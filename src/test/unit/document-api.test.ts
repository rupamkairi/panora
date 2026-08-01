import { beforeEach, describe, expect, test, vi } from 'vitest'

const list = vi.fn()

vi.mock('~/features/auth/server/ensureAuth', () => ({
  ensureAuth: vi.fn(() => {
    throw Response.json({ error: 'Not authorized' }, { status: 401 })
  }),
}))

vi.mock('~/features/knowledge/server/repository', () => ({
  knowledgeRepository: { list },
}))

describe('GET /api/documents', () => {
  beforeEach(() => {
    list.mockReset()
  })

  test('lists ready documents for the public chat document picker', async () => {
    list.mockResolvedValue([
      {
        id: 'document-1',
        title: 'Indexed handbook',
        status: 'ready',
      },
    ])
    const { GET } = await import('../../../app/api/documents+api')

    const result = await GET(new Request('http://localhost/api/documents'))

    expect(result).toBeInstanceOf(Response)
    const response = result as Response
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      documents: [
        { id: 'document-1', title: 'Indexed handbook', status: 'ready' },
      ],
    })
    expect(list).toHaveBeenCalledWith(true)
  })
})
