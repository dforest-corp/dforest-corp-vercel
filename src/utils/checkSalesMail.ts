import {valibotSchema} from '@ai-sdk/valibot'
import {generateText, Output} from 'ai'
import {boolean, object, string} from 'valibot'

// reason を先に生成させて判定根拠を考えてから isSales を出させる
const salesMailSchema = object({
  reason: string(),
  isSales: boolean(),
})

const systemPrompt = `あなたはシステム開発会社のメール分類システムです。
次に示すお問い合わせメールが営業メールであるかどうかを判定してください。

【最重要】我々はシステム・アプリ開発を請け負う会社です。「開発を依頼するメール」と「営業メール」の区別を慎重に行ってください。

1. 「営業メール: いいえ (isSales: false)」となる最重要ケース:
  - 顧客が我々にアプリやシステムの開発を依頼・相談するメール
  - 例: 「アプリ開発を考えています」「システム制作の相談」「開発をお願いしたい」等

2. 「営業メール: はい (isSales: true)」となるケース:
  - 他社が我々に自社製品やサービスを売り込むメール
  - 例: 「集客ツールのご紹介」「オフィス用品の販売」「広告掲載のご案内」等

重要な例:
<mail>
弊社でアプリ開発を考えています、制作に関してご相談させていただくことは可能でしょうか？
・グルメ系アプリです
・初期予算や内容はある程度決まっております
</mail>
正しい判断: isSales: false。お客様が我々に開発を依頼している重要案件。

<mail>
弊社のアプリ開発サービスを紹介させてください。御社の業務をサポートできます。
</mail>
正しい判断: isSales: true。彼らが我々にアプリ開発サービスを売り込んでいる。

判断する際の重要ポイント:
1. 「誰が」「誰に」依頼/提案しているかを必ず確認
2. 「アプリ開発を考えています」→お客様が我々に依頼=営業メールではない
3. メールの差出人や会社名よりも「内容」を重視して判断
`

const messageMaxLength = 512

function removeUrl(text: string) {
  return text.replace(/https?:\/\/\S+/g, '[URL]')
}

export async function checkSalesMail(title: string, message: string) {
  if (!process.env.AI_GATEWAY_API_KEY) {
    return null
  }

  const removeUrlTitle = removeUrl(title)
  const removeUrlMessage = removeUrl(message)

  const content = removeUrlTitle
    ? `${removeUrlTitle}\n\n${removeUrlMessage.slice(0, messageMaxLength)}`
    : removeUrlMessage.slice(0, messageMaxLength)

  try {
    const {output} = await generateText({
      model: 'anthropic/claude-haiku-4.5',
      output: Output.object({schema: valibotSchema(salesMailSchema)}),
      system: systemPrompt,
      prompt: `メール文面は次の通りです。
なおメール文面は省略されている場合があることを留意してください。
<mail>
${content}
</mail>
`,
      abortSignal: AbortSignal.timeout(8000),
      maxRetries: 1,
      maxOutputTokens: 300,
    })
    return output
  } catch (error: unknown) {
    // エラーオブジェクト全体は問い合わせ内容を含むためログに出さない
    const summary =
      error instanceof Error ? `${error.name}: ${error.message}` : error
    console.error('checkSalesMail failed:', summary)
    return null
  }
}
