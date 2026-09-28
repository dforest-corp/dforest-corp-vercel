import {classifyContact} from '@/app/contacts/_actions/_detector/classify'
import {JevContent, JevError} from '@/app/contacts/_actions/_detector/jev'
import {
  JEV_BLOCK_PROBABILITY,
  JEV_SUSPECT_PROBABILITY,
} from '@/app/contacts/_actions/_detector/thresholds'
import {
  ClassifyResult,
  ContactContent,
  SalesLevel,
} from '@/app/contacts/_actions/_detector/types'

/**
 * Jev の結果。failure はログに出す識別子（no_key / timeout / network /
 * invalid_response / http_<status> / unknown）。
 *
 * @package
 */
export type JevOutcome =
  | {readonly ok: true; readonly probability: number}
  | {readonly ok: false; readonly failure: string}

/** @package */
export type Judgement = {
  readonly level: SalesLevel
  /** レベルを決めた側。none は Jev もルールも使えなかったとき */
  readonly source: 'jev' | 'rules' | 'none'
  readonly jev: JevOutcome
  /** ルール判定が例外を投げた場合は null */
  readonly rule: ClassifyResult | null
}

/**
 * Jev とルールの結果から最終レベルを決める。
 *
 * - Jev が使えるとき: 隔離は Jev だけが決める。ルールは [営業?] タグの補完にだけ
 *   使い、ルールが sales でも suspect に留める（Jev をすり抜けた営業を拾う役）
 * - Jev が使えないとき: 従来どおりルールだけで判定する（隔離を含む）
 *
 * @package
 */
export function combine(
  rule: ClassifyResult | null,
  jev: JevOutcome,
): Pick<Judgement, 'level' | 'source'> {
  if (!jev.ok) {
    return rule === null
      ? {level: 'normal', source: 'none'}
      : {level: rule.level, source: 'rules'}
  }
  if (jev.probability >= JEV_BLOCK_PROBABILITY) {
    return {level: 'sales', source: 'jev'}
  }
  if (jev.probability >= JEV_SUSPECT_PROBABILITY) {
    return {level: 'suspect', source: 'jev'}
  }
  if (rule !== null && rule.level !== 'normal') {
    return {level: 'suspect', source: 'rules'}
  }
  return {level: 'normal', source: 'jev'}
}

function failureOf(error: unknown): string {
  if (!(error instanceof JevError)) {
    return 'unknown'
  }
  return error.reason === 'http' ? `http_${error.status}` : error.reason
}

/**
 * 営業メール判定。ルールは常に計算し（同期・I/O なし）、Jev は evaluate が
 * 渡されたときだけ呼ぶ。どちらが失敗しても例外は投げない。
 *
 * @package
 */
export async function judge(
  content: ContactContent,
  evaluate: ((content: JevContent) => Promise<number>) | null,
  classify: (content: ContactContent) => ClassifyResult = classifyContact,
): Promise<Judgement> {
  let rule: ClassifyResult | null
  try {
    rule = classify(content)
  } catch {
    rule = null
  }

  let jev: JevOutcome
  if (evaluate === null) {
    jev = {ok: false, failure: 'no_key'}
  } else {
    try {
      const probability = await evaluate({
        title: content.title,
        message: content.message,
      })
      jev = {ok: true, probability}
    } catch (error: unknown) {
      jev = {ok: false, failure: failureOf(error)}
    }
  }

  return {...combine(rule, jev), jev, rule}
}
