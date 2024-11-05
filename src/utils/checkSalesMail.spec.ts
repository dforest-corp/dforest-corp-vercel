import {expect, test} from 'bun:test'
import {checkSalesMail} from '@/utils/checkSalesMail'

test('checkSalesMail', async () => {
  const subject = '問い合わせ'
  const mailText = `
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

本件は貴社と事業シナジーが非常に高くご面談時には、 クライアントの社名を公開し、
事業シナジー案をご紹介させていただきたく存じます。

ご検討のほどよろしくお願いいたします。
`

  const result = await checkSalesMail(subject, mailText)
  expect(result).not.toBeNull()

  console.log(result)

  if (result) {
    expect(result.is_sales).toBe(true)
    expect(result.usefulness).toBeLessThan(5)
  }
})
