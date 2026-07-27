import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'

import { sendChatMessage } from './api'
import { chatRepository, groupConversation } from './repository'
import { ChatSession, type ChatSnapshot } from './session'
import type {
  ChatContextItem,
  Conversation,
  ConversationGroup,
  MessageFeedback,
} from './types'

const createConversationId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`
const emptySnapshot: ChatSnapshot = {
  messages: [],
  isSending: false,
  error: null,
  canRetry: false,
}

export function useChat() {
  const [session] = useState(() => new ChatSession(sendChatMessage))
  const [conversationId, setConversationId] = useState(createConversationId)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [draft, setDraftState] = useState('')
  const [contextItems, setContextItems] = useState<ChatContextItem[]>([])
  const snapshot = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getSnapshot,
  )

  useEffect(() => {
    session.activate()
    void chatRepository.list().then(setConversations)
    return () => session.dispose()
  }, [session])

  useEffect(() => {
    const firstPrompt = snapshot.messages.find((message) => message.role === 'user')
    if (!firstPrompt) return
    const now = new Date().toISOString()
    const existing = conversations.find((item) => item.id === conversationId)
    const conversation: Conversation = {
      id: conversationId,
      title:
        firstPrompt.content.length > 42
          ? `${firstPrompt.content.slice(0, 42)}…`
          : firstPrompt.content,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      pinned: existing?.pinned ?? false,
      draft,
      messages: snapshot.messages,
      contextItems,
    }
    setConversations((current) => [
      conversation,
      ...current.filter((item) => item.id !== conversationId),
    ])
    void chatRepository.save(conversation)
    // Conversation writes are intentionally keyed to actual session/context changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot.messages, conversationId, contextItems])

  const setDraft = useCallback((value: string) => {
    setDraftState(value)
  }, [])

  const newConversation = useCallback(() => {
    session.reset()
    setConversationId(createConversationId())
    setDraftState('')
    setContextItems([])
  }, [session])

  const openConversation = useCallback(
    (id: string) => {
      const conversation = conversations.find((item) => item.id === id)
      if (!conversation) return
      setConversationId(id)
      setDraftState(conversation.draft)
      setContextItems(conversation.contextItems)
      session.restore({ ...emptySnapshot, messages: conversation.messages })
    },
    [conversations, session],
  )

  const togglePinned = useCallback((id: string) => {
    setConversations((current) =>
      current.map((item) => {
        if (item.id !== id) return item
        const next = { ...item, pinned: !item.pinned }
        void chatRepository.save(next)
        return next
      }),
    )
  }, [])

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((current) => current.filter((item) => item.id !== id))
      void chatRepository.remove(id)
      if (id === conversationId) newConversation()
    },
    [conversationId, newConversation],
  )

  const addContextItems = useCallback((items: ChatContextItem[]) => {
    setContextItems((current) => {
      const unique = items.filter(
        (item) => !current.some((existing) => existing.id === item.id),
      )
      return [...current, ...unique].slice(0, 5)
    })
  }, [])

  const removeContextItem = useCallback((id: string) => {
    setContextItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const groupedConversations = useMemo(() => {
    const groups: Record<ConversationGroup, Conversation[]> = {
      Pinned: [],
      Today: [],
      'Previous 7 Days': [],
      Older: [],
    }
    conversations.forEach((conversation) => {
      groups[groupConversation(conversation)].push(conversation)
    })
    return groups
  }, [conversations])

  const setFeedback = useCallback(
    (id: string, feedback: MessageFeedback) => session.setFeedback(id, feedback),
    [session],
  )

  return {
    ...snapshot,
    send: session.send,
    stop: session.stop,
    retry: session.retry,
    setFeedback,
    conversationId,
    conversations,
    groupedConversations,
    newConversation,
    openConversation,
    togglePinned,
    deleteConversation,
    draft,
    setDraft,
    contextItems,
    addContextItems,
    removeContextItem,
  }
}
