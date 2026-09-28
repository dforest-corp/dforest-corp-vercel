// 判定基準（rules.ts の正規表現と重み、jev.ts の質問文）がクライアントバンドルに
// 載ると営業側が回避文面を作れてしまう。'server-only' はそれをビルド時に防ぐ唯一の
// 手段で、'use client' 側のモジュールグラフからこのファイルに到達した時点で
// ビルドが失敗する。
//
// なお 'server-only' は Node/Bun の条件付きエクスポートで例外を投げるため、
// *.spec.ts はこのファイルを経由せず各モジュールを直接 import している。
import 'server-only'

import {evaluateSalesProbability} from '@/app/contacts/_actions/_detector/jev'
import {judge, Judgement} from '@/app/contacts/_actions/_detector/judge'
import {ContactContent} from '@/app/contacts/_actions/_detector/types'

/**
 * 営業メール判定。TYPESAFE_API_KEY が未設定ならルールだけで判定する。
 * Jev の失敗はルールへのフォールバックで吸収し、例外は投げない。
 */
export function judgeContact(content: ContactContent): Promise<Judgement> {
  const apiKey = process.env.TYPESAFE_API_KEY
  return judge(
    content,
    apiKey
      ? (jevContent) => evaluateSalesProbability(jevContent, {apiKey})
      : null,
  )
}

export type {Judgement} from '@/app/contacts/_actions/_detector/judge'
export type {SalesLevel} from '@/app/contacts/_actions/_detector/types'
