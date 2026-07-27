// 判定基準（rules.ts の正規表現と重み）がクライアントバンドルに載ると
// 営業側が回避文面を作れてしまう。'server-only' はそれをビルド時に防ぐ唯一の手段で、
// 'use client' 側のモジュールグラフからこのファイルに到達した時点でビルドが失敗する。
//
// なお 'server-only' は Node/Bun の条件付きエクスポートで例外を投げるため、
// *.spec.ts はこのファイルを経由せず ./classify を直接 import している。
import 'server-only'

export {classifyContact} from '@/app/contacts/_actions/_detector/classify'
export type {
  ClassifyResult,
  SalesLevel,
} from '@/app/contacts/_actions/_detector/types'
