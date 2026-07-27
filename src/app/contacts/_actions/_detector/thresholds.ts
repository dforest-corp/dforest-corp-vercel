import {RuleCategory} from '@/app/contacts/_actions/_detector/types'

/**
 * 加点ルール単体の重みの上限。
 *
 * これが SUSPECT_SCORE 未満であることによって、**どの単一ルールも単独では
 * 件名タグすら付けられない**ことが保証される（最低2ルールの同時成立が必要）。
 * 「NGワードを1語足したら誤ブロックが始まった」という退行を構造的に防ぐための
 * 中核の制約なので、invariants.spec.ts で機械的に検証している。
 *
 * 減点ルールにはこの上限を適用しない。減点は「隔離しない方向」にしか働かず、
 * 強い正当性シグナル（発注の依頼・採用応募）は単独で加点を打ち消せるべきなので、
 * より大きな絶対値を許す。減点側の歯止めは CATEGORY_CAPS.legit の下限が担う。
 *
 * @package
 */
export const MAX_RULE_WEIGHT = 4

/**
 * カテゴリごとの寄与の上限（legit は下限）。
 *
 * 加点側の上限がすべて BLOCK_SCORE 未満であることによって、**単一カテゴリの
 * ルールを全部踏んでも隔離には到達できない**（＝隔離には2カテゴリ以上の独立した
 * 証拠が必要）ことが保証される。
 *
 * さらに template + meta < BLOCK_SCORE なので、「言い回し」と「メタ情報」だけでは
 * 隔離されない。隔離には bulk（一斉送信の痕跡）か pitch（自己PR）が必須になる。
 *
 * @package
 */
export const CATEGORY_CAPS: Record<RuleCategory, number> = {
  bulk: 7,
  template: 7,
  pitch: 6,
  meta: 3,
  legit: -12,
}

/**
 * この点数以上で件名に `[営業?]` を付ける。宛先は通常の MAIL_TO のまま。
 *
 * 誤爆しても「本物の受信箱にタグ付きで届く」だけなので実害はない。
 *
 * @package
 */
export const SUSPECT_SCORE = 7

/**
 * この点数以上で隔離ボックスへ転送する。
 *
 * 正当な問い合わせの実測最高スコアとの間に強ルール2本分の余裕を確保している。
 * 運用ログで `[営業?]` の誤爆がないことを確認できたら段階的に下げてよい
 * （実測では 10 まで下げても誤検出0で、営業の隔離率は 36% → 66% になる）。
 *
 * @package
 */
export const BLOCK_SCORE = 12
