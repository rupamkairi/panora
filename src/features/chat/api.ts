import { API_URL } from '~/constants/urls'

import type { ChatMessage, OpenRouterMessage } from './types'

type ChatResponse = {
  message?: OpenRouterMessage
  error?: string
}

export async function sendChatMessage(messages: ChatMessage[], signal?: AbortSignal) {
  const recentMessages = messages.slice(-20)
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: recentMessages.map(({ role, content }) => ({ role, content })),
    }),
    signal,
  })

  const data = (await response.json()) as ChatResponse

  if (!response.ok || !data.message?.content) {
    throw new Error(data.error || 'Panora could not complete that request.')
  }

  return data.message.content
}
