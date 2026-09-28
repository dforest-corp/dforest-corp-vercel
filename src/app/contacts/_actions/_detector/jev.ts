import {ContactContent} from '@/app/contacts/_actions/_detector/types'

// ---------------------------------------------------------------------------
// TypeSafe AI の評価モデル Jev に「営業メールか」を確率で問い合わせる。
//
// SDK（@typesafe-ai/sdk）は使わず HTTP API を直接呼んでいる。SDK は 429 で
// バックオフ再試行するが、フォーム送信中のユーザーを待たせないよう、ここでは
// 再試行せずに打ち切ってルールベースへフォールバックさせたいため。
//
// 外部に送るのはタイトルと本文だけ。氏名・メールアドレスは判定に不要なので送らない。
// ---------------------------------------------------------------------------

/**
 * エイリアス（jev-latest）はリリースごとに中身が変わり、閾値の前提が崩れるので
 * バージョンを固定する。上げるときは classify 用フィクスチャで閾値を測り直すこと。
 *
 * @package
 */
export const JEV_MODEL = 'jev-1.13.0'

/** @package */
export const JEV_ENDPOINT = 'https://api.typesafe.ai/v1/systemone'

/**
 * 通常は 200ms 前後で返る。フォーム送信の待ち時間の上限として置いている。
 *
 * @package
 */
export const JEV_TIMEOUT_MS = 3000

/** @package */
export type JevContent = Pick<ContactContent, 'title' | 'message'>

/** @package */
export type JevFailureReason =
  'http' | 'timeout' | 'network' | 'invalid_response'

/**
 * Jev 呼び出しの失敗。メッセージには問い合わせ内容もレスポンス本文も含めない
 * （そのままログに出してよい）。
 *
 * @package
 */
export class JevError extends Error {
  readonly reason: JevFailureReason
  readonly status: number | undefined

  constructor(reason: JevFailureReason, status?: number) {
    super(
      status === undefined
        ? `jev request failed: ${reason}`
        : `jev request failed: ${reason} ${status}`,
    )
    this.name = 'JevError'
    this.reason = reason
    this.status = status
  }
}

/** @package */
export type JevOptions = {
  readonly apiKey: string
  /** テスト用の差し替え口。既定はグローバルの fetch */
  readonly fetch?: (url: string, init: RequestInit) => Promise<Response>
  readonly timeoutMs?: number
}

const CONTEXT =
  'The state is a message submitted through the contact form of D-FOREST, a small Japanese software development company (受託開発・システム開発).'

// 3択（inquiry / sales / gray）や「発注意図」「売り込み」への分解も試したが、
// この1問の方が営業の検出率・正当な問い合わせの誤検出ともに良かった
const isSalesQuestion = {
  type: 'noul',
  instructions: `${CONTEXT} Is this an unsolicited sales / marketing pitch (営業メール) where the sender is trying to sell their own product, service, staff, or partnership to D-FOREST?`,
  criteria: {
    true: 'the sender promotes their own offering: outsourcing/SES staff, tools, training, recruiting services, ads, lead generation, generic partnership recruitment, mass-sent template emails',
    false:
      'a genuine inquiry to D-FOREST: requesting development work or a quote, asking about D-FOREST services, job application, question from an existing customer or partner',
  },
} as const

function readProbability(body: unknown): number {
  const noul = (
    body as {answers?: {isSales?: {noul?: unknown}}} | null | undefined
  )?.answers?.isSales?.noul
  if (
    typeof noul !== 'number' ||
    !Number.isFinite(noul) ||
    noul < 0 ||
    noul > 1
  ) {
    throw new JevError('invalid_response')
  }
  return noul
}

/**
 * 問い合わせが営業メールである確率（0〜1）を返す。失敗はすべて JevError で投げる。
 *
 * @package
 */
export async function evaluateSalesProbability(
  content: JevContent,
  options: JevOptions,
): Promise<number> {
  const fetchImpl = options.fetch ?? fetch
  const signal = AbortSignal.timeout(options.timeoutMs ?? JEV_TIMEOUT_MS)

  // 呼び出し側が ContactContent 全体を渡しても、氏名・メールアドレスを送らない
  const state = {title: content.title, message: content.message}

  let response: Response
  try {
    response = await fetchImpl(JEV_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: JEV_MODEL,
        state,
        questions: {isSales: isSalesQuestion},
      }),
      signal,
    })
  } catch {
    throw new JevError(signal.aborted ? 'timeout' : 'network')
  }

  if (!response.ok) {
    // エラー本文は読まない（内容をログやメッセージに混ぜないため）
    await response.body?.cancel().catch(() => undefined)
    throw new JevError('http', response.status)
  }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new JevError(signal.aborted ? 'timeout' : 'invalid_response')
  }
  return readProbability(body)
}
