import { API_URL } from '~/constants/urls'

import type { ChatMessage, ChatStreamEvent } from './types'

export async function sendChatMessage(
  messages: ChatMessage[],
  onEvent: (event: ChatStreamEvent) => void,
  signal?: AbortSignal,
) {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify({
      stream: true,
      messages: messages.slice(-20).map(({ role, content }) => ({ role, content })),
    }),
    signal,
  })

  if (!response.ok || !response.body) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(data?.error || 'Panora could not complete that request.')
  }

  onEvent({ type: 'start' })
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data:')) continue
      const payload = line.slice(5).trim()
      if (!payload || payload === '[DONE]') continue
      const event = JSON.parse(payload) as ChatStreamEvent
      if (event.type === 'delta') onEvent(event)
    }
  }
  onEvent({ type: 'complete' })
}
