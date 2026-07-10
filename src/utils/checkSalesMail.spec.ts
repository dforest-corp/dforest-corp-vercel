import {expect, test} from 'bun:test'
import {checkSalesMail} from '@/utils/checkSalesMail'

test(
  '営業メール（コンサル・集客支援の売り込み）は isSales: true と判定される',
  async () => {
    const title = '問い合わせ'
    const message = `
xx xxxx様

お世話になっております。
xxxx株式会社のxxxと申します。

突然のご連絡失礼します。

弊社は上場企業様、大手企業様に対して、
オープンイノベーションに関するコンサルティング事業を行っている会社でございます。

この度、東証スタンダード上場の弊社クライアント企業様が、資本提携を検討されており、
貴社であれば社名公開をしていいとの条件のもとご連絡いたしました。

クライアント企業様は、大手上場IT企業向けにエンジニアと企業を結び付けるプラットフォーム事業をしており、
自身が持つ大手～中小までの販路に対するクロスセル戦略の中で、貴社にご連絡を差し上げた次第です。

本件は貴社と事業シナジーが非常に高くご面談時には、クライアントの社名を公開し、
事業シナジー案をご紹介させていただきたく存じます。

ご検討のほどよろしくお願いいたします。
`

    const result = await checkSalesMail(title, message)
    console.log(result)

    expect(result).not.toBeNull()
    expect(result?.isSales).toBe(true)
  },
  {timeout: 15000},
)

test(
  '営業メール（集客ツール・営業代行の売り込み）は isSales: true と判定される',
  async () => {
    const title = 'ホームページ制作会社様へのご案内'
    const message = `
ご担当者様

初めてご連絡いたします。
株式会社〇〇マーケティングの田中と申します。

弊社では、Web制作会社様・システム開発会社様向けに、
新規案件の受注を増やすための営業代行サービスをご提供しております。

月額固定費のみで、貴社の代わりに見込み客へのテレアポ・商談設定まで
一括で代行いたします。導入企業様の多くが半年以内に受注件数2倍を達成しております。

また、あわせてSEO対策付きの集客用ランディングページ制作パッケージも
特別価格にてご案内可能です。

一度オンラインにて15分ほどお時間を頂戴し、
サービス内容の詳細をご説明させていただけますと幸いです。

何卒よろしくお願い申し上げます。
`

    const result = await checkSalesMail(title, message)
    console.log(result)

    expect(result).not.toBeNull()
    expect(result?.isSales).toBe(true)
  },
  {timeout: 15000},
)

test(
  '開発依頼の相談メールは isSales: false と判定される',
  async () => {
    const title = '問い合わせ'
    const message = `
D-FOREST ご担当者様

はじめまして、株式会社〇〇の山田と申します。

現在、グルメ系のスマートフォンアプリの開発を検討しており、
貴社にご相談させていただきたくご連絡いたしました。

想定している機能は以下の通りです。
・ユーザーによる飲食店の口コミ投稿、写真投稿
・位置情報を使った近隣店舗の検索
・お気に入り店舗の登録、プッシュ通知

開発予算はある程度確保できており、リリース時期は半年後を目安に考えております。
まずは概算のお見積りとスケジュール感についてお伺いできればと思います。

お忙しいところ恐縮ですが、ご返信お待ちしております。

株式会社〇〇
山田
`

    const result = await checkSalesMail(title, message)
    console.log(result)

    expect(result).not.toBeNull()
    expect(result?.isSales).toBe(false)
  },
  {timeout: 15000},
)

test(
  '社内システム開発の相談メールは isSales: false と判定される',
  async () => {
    const title = '社内業務システムの開発相談'
    const message = `
D-FOREST ご担当者様

お世話になります。〇〇株式会社の鈴木と申します。

貴社のホームページを拝見し、システム開発のご相談でご連絡いたしました。

現在、社内の在庫管理を紙とExcelで行っており、
入力ミスや二重管理が課題となっております。
このたび、在庫管理を一元化できるクラウド型の業務システムの開発を
検討しており、貴社にご依頼できるかご相談させてください。

利用人数は20名程度、既存の会計システムとの連携も必要になる見込みです。
可能であれば一度オンラインでお打ち合わせのお時間をいただけますでしょうか。

よろしくお願いいたします。
`

    const result = await checkSalesMail(title, message)
    console.log(result)

    expect(result).not.toBeNull()
    expect(result?.isSales).toBe(false)
  },
  {timeout: 15000},
)
