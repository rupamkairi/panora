import type { Conversation, ConversationGroup } from './types'

const STORAGE_KEY = 'panora.conversations.v1'

export interface ChatRepository {
  list(): Promise<Conversation[]>
  save(conversation: Conversation): Promise<void>
  remove(id: string): Promise<void>
  clear(): Promise<void>
}

const memory = new Map<string, string>()

const storage = {
  getItem(key: string) {
    if (typeof localStorage !== 'undefined') return localStorage.getItem(key)
    return memory.get(key) ?? null
  },
  setItem(key: string, value: string) {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value)
    else memory.set(key, value)
  },
  removeItem(key: string) {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key)
    else memory.delete(key)
  },
}

const safeParse = (value: string | null): Conversation[] => {
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
    return safeParse(storage.getItem(STORAGE_KEY)).sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    )
  }

  async save(conversation: Conversation) {
    const conversations = await this.list()
    const next = [
      conversation,
      ...conversations.filter((item) => item.id !== conversation.id),
    ]
    storage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  async remove(id: string) {
    const conversations = await this.list()
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify(conversations.filter((item) => item.id !== id)),
    )
  }

  async clear() {
    storage.removeItem(STORAGE_KEY)
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
