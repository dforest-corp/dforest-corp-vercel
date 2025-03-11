import {
  boolean,
  maxValue,
  minValue,
  number,
  object,
  safeParseAsync,
  string,
  pipe,
} from 'valibot'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type SystemMessage = {
  type: 'text'
  text: string
  cache_control?: {
    type: 'ephemeral'
  }
}

type Request = {
  model: string
  max_tokens: number
  system?: SystemMessage[]
  messages: Message[]
}

type Response =
  | {
      id: string
      type: 'message'
      role: 'assistant'
      model: string
      content: {
        type: 'text'
        text: string
      }[]
      stop_reason: 'end_turn'
      stop_sequence: null
      usage: {
        input_tokens: number
        output_tokens: number
      }
    }
  | {
      type: 'error'
      error: {
        type: string
        message: string
      }
    }

const responseFormatSchema = object({
  is_sales: boolean(),
  usefulness: pipe(number(), minValue(1), maxValue(10)),
  summary: string(),
})

const messageMaxLength = 512

function removeUrl(text: string) {
  return text.replace(/https?:\/\/\S+/g, '[URL]')
}

export async function checkSalesMail(title: string, message: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return null
  }

  const removeUrlMessage = removeUrl(message)

  const content = title
    ? `${title}\n\n${removeUrlMessage.slice(0, messageMaxLength)}`
    : removeUrlMessage.slice(0, messageMaxLength)

  const request: Request = {
    model: 'claude-3-haiku-20240307',
    max_tokens: 200,
    system: [
      {
        type: 'text',
        text: `あなたはシステム開発会社のメール分類システムです。
次に示すメールが営業メールであるかどうか、そしてメールの有用度を1-10の範囲で評価してください。
また、メールの非常に短い概要も含めてください。

【最重要】我々はシステム・アプリ開発を請け負う会社です。「開発を依頼するメール」と「営業メール」の区別を慎重に行ってください。

1. 「営業メール: いいえ」となる最重要ケース:
  - 顧客が我々にアプリやシステムの開発を依頼・相談するメール
  - 例: 「アプリ開発を考えています」「システム制作の相談」「開発をお願いしたい」等

2. 「営業メール: はい」となるケース:
  - 他社が我々に自社製品やサービスを売り込むメール
  - 例: 「集客ツールのご紹介」「オフィス用品の販売」「広告掲載のご案内」等

有用度の基準:
  - 10: 具体的なアプリ・システム開発の依頼（最優先）
  - 9: 開発相談・問い合わせ（優先対応）
  - 7-8: 既存顧客からの連絡
  - 4-6: 検討の余地がある提案
  - 1-3: 不要な営業メール

重要な例:
<mail>
弊社でアプリ開発を考えています、制作に関してご相談させていただくことは可能でしょうか？
・グルメ系アプリです
・初期予算や内容はある程度決まっております
</mail>
正しい判断: これは「営業メール: いいえ」、「有用度: 10」の重要案件。お客様が我々に開発を依頼している。

<mail>
弊社のアプリ開発サービスを紹介させてください。御社の業務をサポートできます。
</mail>
正しい判断: これは「営業メール: はい」、「有用度: 2」。彼らが我々にアプリ開発サービスを売り込んでいる。

判断する際の重要ポイント:
1. 「誰が」「誰に」依頼/提案しているかを必ず確認
2. 「アプリ開発を考えています」→お客様が我々に依頼=重要案件
3. メールの差出人や会社名よりも「内容」を重視して判断

返答のフォーマットを次に指定します。
<formatting>
{
  "is_sales": false,
  "usefulness": 10,
  "summary": "グルメアプリ開発の相談"
}
</formatting>

返答は常に上のフォーマットで示したJSON形式で行ってください。
返答がそのままJSON.parseされるため、絶対にJSON形式のみを返答し判断理由など他のテキストは含めないでください。
`,
      },
    ],
    messages: [
      {
        role: 'user',
        content: `
メール文面は次の通りです。
なおメール文面は省略されている場合があることを留意してください。
<mail>
${content}
</mail>
`,
      },
      {
        role: 'assistant',
        content: '{',
      },
    ],
  }

  const timeoutController = new AbortController()
  setTimeout(() => timeoutController.abort(), 5000)

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: timeoutController.signal,
    })
    if (!response.ok) {
      return null
    }

    const json = (await response.json()) as Response
    if (json.type !== 'message') {
      return null
    }

    let jsonText = '{' + json.content[0].text
    // もし}で終わっていない場合は}を追加する
    if (jsonText[jsonText.length - 1] !== '}') {
      jsonText += '}'
    }

    const parsed = JSON.parse(jsonText)
    const validationResult = await safeParseAsync(responseFormatSchema, parsed)
    if (!validationResult.success) {
      return null
    }

    return validationResult.output
  } catch (error: unknown) {
    console.error(error)
    return null
  }
}
