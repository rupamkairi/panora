import { MMKV } from 'react-native-mmkv'

import type { Conversation, ConversationGroup } from './types'

const storage = new MMKV({ id: 'panora-chat-history' })
const STORAGE_KEY = 'conversations.v1'

export interface ChatRepository {
  list(): Promise<Conversation[]>
  save(conversation: Conversation): Promise<void>
  remove(id: string): Promise<void>
  clear(): Promise<void>
}

const read = (): Conversation[] => {
  const value = storage.getString(STORAGE_KEY)
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export class LocalChatRepository implements ChatRepository {
  async list() {
    return read().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }
  async save(conversation: Conversation) {
    storage.set(
      STORAGE_KEY,
      JSON.stringify([
        conversation,
        ...read().filter((item) => item.id !== conversation.id),
      ]),
    )
  }
  async remove(id: string) {
    storage.set(STORAGE_KEY, JSON.stringify(read().filter((item) => item.id !== id)))
  }
  async clear() {
    storage.delete(STORAGE_KEY)
  }
}

export const groupConversation = (
  conversation: Conversation,
  now = new Date(),
): ConversationGroup => {
  if (conversation.pinned) return 'Pinned'
  const updated = new Date(conversation.updatedAt)
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const age = startToday.getTime() - updated.getTime()
  if (age <= 0) return 'Today'
  if (age < 7 * 86_400_000) return 'Previous 7 Days'
  return 'Older'
}

export const chatRepository = new LocalChatRepository()
