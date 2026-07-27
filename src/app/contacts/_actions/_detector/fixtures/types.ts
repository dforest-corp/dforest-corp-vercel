/**
 * 判定のテストに使う問い合わせ1件。
 *
 * このディレクトリのフィクスチャは `sample_emails/` の実メール（追跡対象外）を
 * 匿名化したもの、および手で書いた合成例。氏名・社名・メールアドレス・電話番号・
 * 住所・URL は差し替えてあるが、**判定に効く特徴**（定型句・装飾記号・改行構造・
 * 全角スペース・URL の本数と種別）は原文のまま保持している。
 *
 * `@package` を付けていないのは、親ディレクトリの `*.spec.ts` から読むため。
 * このディレクトリにはデータだけを置き、判定の実装は import しない。
 */
export type ContactFixture = {
  /** 安定した識別子。テストの失敗メッセージに出す */
  readonly id: string
  /**
   * - sales: 営業メール。検出したい
   * - legit: 正当な問い合わせ。絶対に検出してはいけない
   * - gray: 営業寄りだが隔離してはいけないもの（発注元・案件紹介・既存接点など）
   */
  readonly label: 'sales' | 'legit' | 'gray'
  readonly name: string
  readonly email: string
  readonly title: string
  readonly message: string
  /** どういう性質のメールかの人間向けメモ。氏名・社名は書かない */
  readonly note: string
}
