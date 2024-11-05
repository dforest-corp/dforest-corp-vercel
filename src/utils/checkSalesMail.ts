import {
  boolean,
  maxValue,
  minValue,
  number,
  object,
  safeParseAsync,
  string,
} from 'valibot'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type Request = {
  model: string
  max_tokens: number
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
  usefulness: number([minValue(1), maxValue(10)]),
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
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 50,
    messages: [
      {
        role: 'user',
        content: `あなたはシステム開発会社のメール分類システムです。
次に示すメールが営業メールであるかどうか、そしてメールの有用度を1-10の範囲で評価してください。
また、メールの非常に短い概要も含めてください。
判断を下す前に以下の事項を注意して段階的に考えてください。
・我々はシステム開発を請け負う会社であるため、仕事の依頼は絶対に逃したくありません。
・現在のお客様からの連絡も稀に入りますが、これらは重要です。
・一方でほとんどの営業・売り込み・業務提携のメールは不要と考えています。
・フリーランスの方からの営業もよく入りますがまず必要ありません。
・これらに該当しないメールはシステム開発会社の視点に立って総合的に判断してください。

返答のフォーマットを次に指定します。
<formatting>
{
  "is_sales": true,
  "usefulness": 10,
  "summary": "有用でない業務提携案内"
}
</formatting>

メール文面は次の通りです。
なおメール文面は省略されている場合があることを留意してください。
<mail>
${content}
</mail>

返答は常に上のフォーマットで示したJSON形式で行ってください。
返答がそのままJSON.parseされるため、絶対にJSON形式のみを返答し判断理由など他のテキストは含めないでください。
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
