import { afterEach, describe, expect, test, vi } from 'vitest'

const selectedReady = vi.fn()
const retrieveEvidence = vi.fn()

vi.mock('~/features/auth/server/ensureAuth', () => ({
  ensureAuth: vi.fn(() => {
    throw Response.json({ error: 'Not authorized' }, { status: 401 })
  }),
}))

vi.mock('~/features/knowledge/server/repository', () => ({
  knowledgeRepository: { selectedReady },
}))

vi.mock('~/features/knowledge/server/retrieval', () => ({
  evidencePrompt: vi.fn(() => 'Answer from the supplied evidence.'),
  retrieveEvidence,
}))

vi.mock('~/features/chat/server/rateLimiter', () => ({
  acquireChatRateLimit: vi.fn(() => ({ allowed: true, release: vi.fn() })),
  resolveChatClientId: vi.fn(() => 'test-client'),
}))

vi.mock('~/features/chat/server/quota', () => ({
  quotaHeaders: vi.fn(() => ({})),
  refundChatQuota: vi.fn(),
  reserveChatQuota: vi.fn(async () => ({
    allowed: true,
    quota: { remaining: 9, limit: 10, resetAt: null },
  })),
  resolveQuotaIdentity: vi.fn(() => ({ kind: 'anonymous', id: 'test-client' })),
}))

const providerResponse = () =>
  new Response(
    `data: ${JSON.stringify({ choices: [{ delta: { content: 'Grounded answer' } }] })}\n\ndata: [DONE]\n\n`,
    { status: 200, headers: { 'Content-Type': 'text/event-stream' } },
  )

describe('POST /api/chat with selected documents', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('answers from selected ready documents without requiring an app session', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key'
    selectedReady.mockResolvedValue([
      {
        id: 'document-1',
        embeddingModel: 'nvidia/nemotron-3-embed-1b:free',
        embeddingDimensions: 2048,
      },
    ])
    retrieveEvidence.mockResolvedValue([
      {
        documentId: 'document-1',
        documentTitle: 'Indexed handbook',
        content: 'Verified document evidence',
        score: 1,
      },
    ])
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(providerResponse()))
    const { POST } = await import('../../../app/api/chat+api')

    const result = await POST(
      new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'What does the handbook say?' }],
          documentIds: ['document-1'],
          webSearchEnabled: false,
        }),
      }),
    )

    expect(result).toBeInstanceOf(Response)
    const response = result as Response
    expect(response.status).toBe(200)
    expect(await response.text()).toContain('Grounded answer')
    expect(selectedReady).toHaveBeenCalledWith(['document-1'])
    expect(retrieveEvidence).toHaveBeenCalled()
  })
})
