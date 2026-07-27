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

  test('limits a client to 10 requests per minute', async () => {
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
