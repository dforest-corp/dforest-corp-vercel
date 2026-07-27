/**
 * ルールの分類。カテゴリごとに上限を設けることで「単一種類の証拠だけでは
 * 隔離に到達できない」ことを保証する（thresholds.ts の CATEGORY_CAPS を参照）。
 *
 * - bulk: 機械的な一斉送信の指紋（日程調整SaaS・短縮URL・装飾罫線など）
 * - template: 営業メールの定型文（突然のご連絡・貴社HPを拝見など）
 * - pitch: 送り手が自分を売り込む言い回し（○名在籍・協業先募集など）
 * - meta: メタ情報（件名の【】・フリーメール・本文長など）。単独ではほぼ無力
 * - legit: 正当な問い合わせのシグナル。減点のみ
 *
 * @package
 */
export type RuleCategory = 'bulk' | 'template' | 'pitch' | 'meta' | 'legit'

/** @package */
export type SalesLevel = 'normal' | 'suspect' | 'sales'

/**
 * 判定対象。formSchema の FormSchemaType から必要な項目だけを受け取る。
 *
 * @package
 */
export type ContactContent = {
  readonly name: string
  readonly email: string
  readonly title: string
  readonly message: string
}

/**
 * ルールに渡す入力。語句マッチは normalizedText、構造・記号・URL は原文由来の
 * フィールドを使う。ルール側で生の message を触らせないための境界。
 *
 * @package
 */
export type DetectorInput = {
  /** タイトルと本文を改行で連結した原文。装飾記号や改行構造を保持する */
  readonly rawText: string
  /** 本文を改行で分割したもの。行頭記号の判定に使う */
  readonly rawLines: readonly string[]
  /**
   * URL を除いた本文。URL には / - _ = ~ が大量に含まれるため、
   * 装飾記号を数える前に必ず落とす（URL 1本で装飾スコアが誤爆する）。
   */
  readonly messageWithoutUrls: string
  /**
   * NFKC 正規化 + 不可視文字除去 + URL 除去 + 空白除去 + 小文字化。
   * 「営 業 代 行」「ｴﾝｼﾞﾆｱ派遣」のような回避を無効化する。
   * 空白が無いので、文字数窓を使うルールは原文より狭い窓で書くことになる。
   */
  readonly normalizedText: string
  /** 小文字化した入力メールアドレス */
  readonly email: string
  /** メールアドレスの @ より前 */
  readonly emailLocalPart: string
  /** メールアドレスの @ より後 */
  readonly emailDomain: string
  /** 入力されたタイトル（原文） */
  readonly title: string
  /** 本文中の URL。本数・ドメインの判定に使う */
  readonly urls: readonly string[]
  /** URL を除いた本文中の装飾記号の数 */
  readonly decorationCount: number
  /** 本文の文字数 */
  readonly messageLength: number
}

/**
 * 判定ルール1件。
 *
 * test の戻り値を boolean に固定しているのは、重みを可変にすると
 * カテゴリ上限の不変条件（invariants.spec.ts）を機械的に証明できなくなるため。
 * 強度の違いは段階別の別ルールとして表現する。
 *
 * @package
 */
export type Rule = {
  /** ログに出力する識別子。英数字とアンダースコアのみ（本文が復元できないように） */
  readonly id: string
  readonly category: RuleCategory
  /** 加点は正、減点は負。絶対値は MAX_RULE_WEIGHT 以下でなければならない */
  readonly weight: number
  readonly description: string
  readonly test: (input: DetectorInput) => boolean
}

/** @package */
export type ClassifyResult = {
  readonly level: SalesLevel
  readonly score: number
  readonly hitRuleIds: readonly string[]
}
