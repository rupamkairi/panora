import { afterEach, describe, expect, test, vi } from 'vitest'

import { POST } from '../../../app/api/chat+api'

const originalApiKey = process.env.OPENROUTER_API_KEY

afterEach(() => {
  if (originalApiKey === undefined) delete process.env.OPENROUTER_API_KEY
  else process.env.OPENROUTER_API_KEY = originalApiKey
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const chatRequest = (messages: unknown[], ip = `192.0.2.${Math.random() * 255}`) =>
  new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Real-IP': ip },
    body: JSON.stringify({ messages }),
  })

const providerResponse = (content = 'Hello from Panora') =>
  new Response(
    `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\ndata: [DONE]\n\n`,
    {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream' },
    },
  )

const callPost = async (request: Request) => {
  const result = await POST(request)
  if (!(result instanceof Response))
    throw new Error('Expected the endpoint to return a Response')
  return result
}

describe('POST /api/chat', () => {
  test('rejects more than five selected documents before contacting the provider', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key'
    const response = await callPost(
      new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Compare these sources' }],
          documentIds: Array.from({ length: 6 }, (_, index) => `document-${index}`),
        }),
      }),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Select no more than five valid documents.',
    })
  })

  test('returns 503 when OpenRouter is not configured', async () => {
    delete process.env.OPENROUTER_API_KEY

    const response = await callPost(chatRequest([{ role: 'user', content: 'Hello' }]))

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error: 'Chat is not configured on this server.',
    })
  })

  test('rejects more than 20 messages', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key'
    const request = chatRequest(
      Array.from({ length: 21 }, (_, index) => ({
        role: index % 2 === 0 ? 'user' : 'assistant',
        content: `Message ${index}`,
      })),
    )

    const response = await callPost(request)

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Provide between 1 and 20 valid chat messages.',
    })
  })

  test('rejects conversations over 16,000 characters', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key'

    const response = await callPost(
      chatRequest([{ role: 'user', content: 'a'.repeat(16_001) }]),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Conversation content must not exceed 16000 characters.',
    })
  })

  test('maps a successful OpenRouter stream to public delta events', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key'
    const fetchMock = vi.fn().mockResolvedValue(providerResponse('  Useful answer  '))
    vi.stubGlobal('fetch', fetchMock)

    const response = await callPost(chatRequest([{ role: 'user', content: 'Hello' }]))

    expect(response.status).toBe(200)
    const body = await response.text()
    expect(response.headers.get('Content-Type')).toContain('text/event-stream')
    expect(body).toContain('"type":"delta"')
    expect(body).toContain('Useful answer')
    expect(body).toContain('"type":"complete"')
  })

  test('parses provider events split across transport chunks', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key'
    const payload = `data: ${JSON.stringify({
      choices: [{ delta: { content: 'Fragmented answer' } }],
    })}\n\ndata: [DONE]\n\n`
    const encoder = new TextEncoder()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          new ReadableStream({
            start(controller) {
              controller.enqueue(encoder.encode(payload.slice(0, 17)))
              controller.enqueue(encoder.encode(payload.slice(17, 41)))
              controller.enqueue(encoder.encode(payload.slice(41)))
              controller.close()
            },
          }),
        ),
      ),
    )

    const response = await callPost(
      chatRequest([{ role: 'user', content: 'Answer generally' }]),
    )

    expect(await response.text()).toContain('Fragmented answer')
  })

  test('surfaces and refunds provider errors delivered inside a 200 stream', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key'
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          `data: ${JSON.stringify({
            error: {
              code: 429,
              message: 'Provider detail',
              metadata: { error_type: 'rate_limit_exceeded' },
            },
            choices: [{ delta: { content: '' }, finish_reason: 'error' }],
          })}\n\n`,
        ),
      ),
    )

    const response = await callPost(
      chatRequest([{ role: 'user', content: 'Answer generally' }]),
    )
    const body = await response.text()

    expect(body).toContain('"type":"error"')
    expect(body).toContain('"remaining":10')
    expect(body).not.toContain('Provider detail')
  })

  test('normalizes provider failures', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key'
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ error: { message: 'Sensitive provider detail' } }),
          {
            status: 401,
          },
        ),
      ),
    )

    const response = await callPost(chatRequest([{ role: 'user', content: 'Hello' }]))

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({
      error: 'The AI provider could not complete the request.',
    })
  })

  test('limits an anonymous network to 10 asks per 24-hour window', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key'
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => providerResponse()),
    )
    const ip = '198.51.100.10'

    for (let requestNumber = 0; requestNumber < 10; requestNumber += 1) {
      const response = await callPost(
        chatRequest([{ role: 'user', content: `Message ${requestNumber}` }], ip),
      )
      expect(response.status).toBe(200)
      await response.text()
    }

    const limited = await callPost(
      chatRequest([{ role: 'user', content: 'One too many' }], ip),
    )
    expect(limited.status).toBe(429)
    expect(limited.headers.get('Retry-After')).toBeTruthy()
  })

  test('returns 504 when OpenRouter exceeds the timeout', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key'
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, init: RequestInit) =>
          new Promise((_resolve, reject) => {
            init.signal?.addEventListener('abort', () =>
              reject(new DOMException('Aborted', 'AbortError')),
            )
          }),
      ),
    )

    const pendingResponse = callPost(chatRequest([{ role: 'user', content: 'Hello' }]))
    await vi.advanceTimersByTimeAsync(45_000)

    const response = await pendingResponse
    expect(response.status).toBe(504)
  })
})
