import { beforeEach, describe, expect, test } from 'vitest'

import { LocalChatRepository, groupConversation } from '~/features/chat/repository'
import type { Conversation } from '~/features/chat/types'

const conversation = (overrides: Partial<Conversation> = {}): Conversation => ({
  id: 'chat-1',
  title: 'A useful question',
  createdAt: '2026-07-27T08:00:00.000Z',
  updatedAt: '2026-07-27T08:00:00.000Z',
  pinned: false,
  draft: '',
  messages: [],
  contextItems: [],
  ...overrides,
})

describe('LocalChatRepository', () => {
  const repository = new LocalChatRepository()

  beforeEach(async () => repository.clear())

  test('saves, updates, and removes a conversation', async () => {
    await repository.save(conversation())
    await repository.save(conversation({ title: 'Updated', pinned: true }))
    expect(await repository.list()).toMatchObject([{ title: 'Updated', pinned: true }])

    await repository.remove('chat-1')
    expect(await repository.list()).toEqual([])
  })

  test('groups pinned and dated conversations', () => {
    const now = new Date('2026-07-27T12:00:00.000Z')
    expect(groupConversation(conversation({ pinned: true }), now)).toBe('Pinned')
    expect(groupConversation(conversation(), now)).toBe('Today')
    expect(
      groupConversation(conversation({ updatedAt: '2026-07-23T12:00:00.000Z' }), now),
    ).toBe('Previous 7 Days')
    expect(
      groupConversation(conversation({ updatedAt: '2026-06-01T12:00:00.000Z' }), now),
    ).toBe('Older')
  })
})
