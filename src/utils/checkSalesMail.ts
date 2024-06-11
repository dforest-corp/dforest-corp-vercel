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

const messageMaxLength = 512

function removeUrl(text: string) {
  return text.replace(/https?:\/\/\S+/g, '[URL]')
}

export async function checkSalesMail(title: string, message: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return false
  }

  const removeUrlMessage = removeUrl(message)

  const content = title
    ? `${title}\n\n${removeUrlMessage.slice(0, messageMaxLength)}`
    : removeUrlMessage.slice(0, messageMaxLength)

  const request: Request = {
    model: 'claude-3-haiku-20240307',
    max_tokens: 50,
    messages: [
      {
        role: 'user',
        content: `私はシステム開発会社です。以下の条件に基づいて、営業メールを判定してください。
いいえ = 営業メールではない、はい = 営業メール
- システム開発の依頼 : いいえ
- コーダーの売り込み : はい
- 関係のないサービスの紹介 : はい
- 人材派遣の提案 : はい
- その他 : 総合的な判断で判定してください
`,
      },
      {
        role: 'assistant',
        content:
          '承知しました。以降、常に「はい」の2文字か「いいえ」の3文字のみを返答します。',
      },
      {
        role: 'user',
        content: content,
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
      return false
    }

    const json = (await response.json()) as Response
    if (json.type !== 'message') {
      return false
    }
    return json.content[0].text.includes('はい')
  } catch (error: unknown) {
    console.error(error)
    return false
  }
}
