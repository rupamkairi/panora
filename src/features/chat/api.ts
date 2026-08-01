import { API_URL } from '~/constants/urls'

import type { ChatMessage, ChatStreamEvent } from './types'
import { getQuotaHeaders, rememberQuotaToken } from './quota'

export async function sendChatMessage(
  messages: ChatMessage[],
  onEvent: (event: ChatStreamEvent) => void,
  signal?: AbortSignal,
  options?: { documentIds: string[]; webSearchEnabled: boolean },
) {
  const quotaHeaders = await getQuotaHeaders()
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...quotaHeaders,
    },
    body: JSON.stringify({
      stream: true,
      messages: messages.slice(-20).map(({ role, content }) => ({ role, content })),
      documentIds: options?.documentIds ?? [],
      webSearchEnabled: options?.webSearchEnabled ?? true,
    }),
    signal,
  })
  rememberQuotaToken(response)

  if (!response.ok || !response.body) {
    const remaining = Number(response.headers.get('x-ratelimit-remaining'))
    const limit = Number(response.headers.get('x-ratelimit-limit'))
    if (Number.isFinite(remaining) && Number.isFinite(limit)) {
      onEvent({
        type: 'quota',
        quota: {
          remaining,
          limit,
          resetAt: response.headers.get('x-ratelimit-reset'),
        },
      })
    }
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
      if (event.type === 'error') {
        onEvent(event)
        throw new Error(event.error)
      }
      onEvent(event)
    }
  }
}
