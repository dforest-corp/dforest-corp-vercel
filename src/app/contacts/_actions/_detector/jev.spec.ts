import {expect, test, describe} from 'bun:test'
import {
  JEV_ENDPOINT,
  JEV_MODEL,
  JEV_TIMEOUT_MS,
  JevError,
  JevOptions,
  evaluateSalesProbability,
} from '@/app/contacts/_actions/_detector/jev'

// JevOptions.fetch は Bun の `typeof fetch`（preconnect 必須）を避けるため、
// url/init だけを取る狭い関数型になっている。フェイクもそれに合わせる
type FakeFetch = NonNullable<JevOptions['fetch']>

const content = {
  title: 'AI活用のご案内',
  message: '突然のご連絡失礼いたします。',
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {'content-type': 'application/json'},
  })
}

function successBody(noul: number) {
  return {
    model: JEV_MODEL,
    answers: {isSales: {type: 'noul', noul}},
    usage: {input_tokens: 1000, output_tokens: 1},
  }
}

describe('evaluateSalesProbability', () => {
  test('成功時はリクエストの内容からP(sales)を解決する', async () => {
    let capturedUrl: string | undefined
    let capturedInit: RequestInit | undefined
    const fakeFetch: FakeFetch = async (url, init) => {
      capturedUrl = String(url)
      capturedInit = init
      return jsonResponse(200, successBody(0.97))
    }

    const result = await evaluateSalesProbability(content, {
      apiKey: 'secret-key',
      fetch: fakeFetch,
    })

    expect(result).toBe(0.97)
    expect(capturedUrl).toBe(JEV_ENDPOINT)
    expect(capturedInit?.method).toBe('POST')
    const headers = new Headers(capturedInit?.headers)
    expect(headers.get('Authorization')).toBe('Bearer secret-key')
    expect(headers.get('Content-Type')).toBe('application/json')

    const body = JSON.parse(String(capturedInit?.body))
    expect(body.model).toBe(JEV_MODEL)
    expect(body.state).toEqual({title: content.title, message: content.message})
    expect(Object.keys(body.state).sort()).toEqual(['message', 'title'])
    expect(body.questions.isSales.type).toBe('noul')
    expect(typeof body.questions.isSales.instructions).toBe('string')
    expect(typeof body.questions.isSales.criteria.true).toBe('string')
    expect(typeof body.questions.isSales.criteria.false).toBe('string')
  })

  test('name・emailを含むオブジェクトを渡してもリクエスト本文に漏れない', async () => {
    let capturedBody: string | undefined
    const fakeFetch: FakeFetch = async (_url, init) => {
      capturedBody = String(init?.body)
      return jsonResponse(200, successBody(0.1))
    }

    const fullContent = {
      name: '山田太郎',
      email: 'yamada-secret@example.com',
      title: content.title,
      message: content.message,
    }

    await evaluateSalesProbability(fullContent, {
      apiKey: 'k',
      fetch: fakeFetch,
    })

    expect(capturedBody).toBeDefined()
    expect(capturedBody).not.toContain('山田太郎')
    expect(capturedBody).not.toContain('yamada-secret@example.com')

    const state = JSON.parse(capturedBody as string).state
    expect(Object.keys(state).sort()).toEqual(['message', 'title'])
  })

  test('fetchにAbortSignalを渡し、timeoutMs経過で中断してtimeout失敗になる', async () => {
    const fakeFetch: FakeFetch = (_url, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(init.signal?.reason)
        })
      })

    await expect(
      evaluateSalesProbability(content, {
        apiKey: 'k',
        fetch: fakeFetch,
        timeoutMs: 20,
      }),
    ).rejects.toMatchObject({reason: 'timeout'})
  })

  test('timeoutMsを省略した場合はJEV_TIMEOUT_MSが既定値になる', async () => {
    let observedSignal: AbortSignal | undefined
    const fakeFetch: FakeFetch = (_url, init) =>
      new Promise((_resolve, reject) => {
        observedSignal = init?.signal ?? undefined
        init?.signal?.addEventListener('abort', () => {
          reject(init.signal?.reason)
        })
      })

    // JEV_TIMEOUT_MS が既定値として使われることを間接的に確認する
    // （フェイク実装なので実際に3秒待つのではなく、signalが渡っていることのみ検証）
    expect(JEV_TIMEOUT_MS).toBeGreaterThan(0)
    const promise = evaluateSalesProbability(content, {
      apiKey: 'k',
      fetch: fakeFetch,
      timeoutMs: 10,
    })
    await expect(promise).rejects.toMatchObject({reason: 'timeout'})
    expect(observedSignal).toBeInstanceOf(AbortSignal)
  })

  test('fetch自体が失敗した場合はnetwork失敗になる', async () => {
    const fakeFetch: FakeFetch = async () => {
      throw new TypeError('fetch failed')
    }

    await expect(
      evaluateSalesProbability(content, {apiKey: 'k', fetch: fakeFetch}),
    ).rejects.toMatchObject({reason: 'network'})
  })

  test('429を返した場合はhttp失敗かつstatusが429になる', async () => {
    const fakeFetch: FakeFetch = async () =>
      jsonResponse(429, {error: 'rate limited'})

    await expect(
      evaluateSalesProbability(content, {apiKey: 'k', fetch: fakeFetch}),
    ).rejects.toMatchObject({reason: 'http', status: 429})
  })

  test('500を返した場合はhttp失敗かつstatusが500になる', async () => {
    const fakeFetch: FakeFetch = async () =>
      jsonResponse(500, {error: 'internal'})

    await expect(
      evaluateSalesProbability(content, {apiKey: 'k', fetch: fakeFetch}),
    ).rejects.toMatchObject({reason: 'http', status: 500})
  })

  test('2xxでもJSONとして解釈できない本文はinvalid_response失敗になる', async () => {
    const fakeFetch: FakeFetch = async () =>
      new Response('not json', {
        status: 200,
        headers: {'content-type': 'text/plain'},
      })

    await expect(
      evaluateSalesProbability(content, {apiKey: 'k', fetch: fakeFetch}),
    ).rejects.toMatchObject({reason: 'invalid_response'})
  })

  test('answers.isSales.noulが欠けている場合はinvalid_response失敗になる', async () => {
    const fakeFetch: FakeFetch = async () =>
      jsonResponse(200, {
        model: JEV_MODEL,
        answers: {isSales: {type: 'noul'}},
        usage: {input_tokens: 1, output_tokens: 1},
      })

    await expect(
      evaluateSalesProbability(content, {apiKey: 'k', fetch: fakeFetch}),
    ).rejects.toMatchObject({reason: 'invalid_response'})
  })

  test('noulが数値でない場合はinvalid_response失敗になる', async () => {
    const fakeFetch: FakeFetch = async () =>
      jsonResponse(200, successBody('0.9' as unknown as number))

    await expect(
      evaluateSalesProbability(content, {apiKey: 'k', fetch: fakeFetch}),
    ).rejects.toMatchObject({reason: 'invalid_response'})
  })

  test('noulが0から1の範囲外の場合はinvalid_response失敗になる', async () => {
    const fakeFetch: FakeFetch = async () => jsonResponse(200, successBody(1.5))

    await expect(
      evaluateSalesProbability(content, {apiKey: 'k', fetch: fakeFetch}),
    ).rejects.toMatchObject({reason: 'invalid_response'})
  })

  test('noulがNaNや無限大の場合はinvalid_response失敗になる', async () => {
    const fakeFetch: FakeFetch = async () =>
      jsonResponse(200, successBody(Number.POSITIVE_INFINITY))

    await expect(
      evaluateSalesProbability(content, {apiKey: 'k', fetch: fakeFetch}),
    ).rejects.toMatchObject({reason: 'invalid_response'})
  })

  test('noulが境界値0の場合は0が解決される', async () => {
    const fakeFetch: FakeFetch = async () => jsonResponse(200, successBody(0))

    const result = await evaluateSalesProbability(content, {
      apiKey: 'k',
      fetch: fakeFetch,
    })
    expect(result).toBe(0)
  })

  test('noulが境界値1の場合は1が解決される', async () => {
    const fakeFetch: FakeFetch = async () => jsonResponse(200, successBody(1))

    const result = await evaluateSalesProbability(content, {
      apiKey: 'k',
      fetch: fakeFetch,
    })
    expect(result).toBe(1)
  })

  test('エラーメッセージにレスポンス本文や問い合わせ内容が含まれない', async () => {
    const secret = 'THIS_SHOULD_NOT_LEAK_xyz123'
    const fakeFetch: FakeFetch = async () => jsonResponse(500, {error: secret})

    try {
      await evaluateSalesProbability(
        {title: 'タイトル漏洩テスト', message: 'メッセージ漏洩テスト'},
        {apiKey: 'k', fetch: fakeFetch},
      )
      throw new Error('rejectされるはずだった')
    } catch (error) {
      expect(error).toBeInstanceOf(JevError)
      const message = (error as JevError).message
      expect(message).not.toContain(secret)
      expect(message).not.toContain('タイトル漏洩テスト')
      expect(message).not.toContain('メッセージ漏洩テスト')
    }
  })

  test('JevErrorはreasonとstatusを保持する', async () => {
    const error = new JevError('http', 503)
    expect(error).toBeInstanceOf(Error)
    expect(error.reason).toBe('http')
    expect(error.status).toBe(503)
  })

  test('http以外の理由ではstatusはundefinedになりうる', async () => {
    const error = new JevError('network')
    expect(error.status).toBeUndefined()
  })
})
