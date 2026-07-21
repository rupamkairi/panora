import type { Endpoint } from 'one'

import { CHAT_MODEL, SYSTEM_PROMPT } from '~/features/chat/constants'
import { CHAT_LIMITS, OPENROUTER_CHAT_URL } from '~/features/chat/server/config'
import {
  acquireChatRateLimit,
  resolveChatClientId,
} from '~/features/chat/server/rateLimiter'

type RequestMessage = { role: 'user' | 'assistant'; content: string }

const jsonError = (error: string, status: number, headers?: HeadersInit) =>
  Response.json({ error }, { status, headers })

const isMessage = (value: unknown): value is RequestMessage => {
  if (!value || typeof value !== 'object') return false
  const message = value as Record<string, unknown>
  return (
    (message.role === 'user' || message.role === 'assistant') &&
    typeof message.content === 'string' &&
    message.content.trim().length > 0
  )
}

const parseMessages = async (request: Request) => {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return { error: jsonError('The request body must be valid JSON.', 400) }
  }

  const messages =
    body &&
    typeof body === 'object' &&
    Array.isArray((body as { messages?: unknown }).messages)
      ? (body as { messages: unknown[] }).messages
      : null

  if (
    !messages ||
    messages.length === 0 ||
    messages.length > CHAT_LIMITS.maxMessages ||
    !messages.every(isMessage)
  ) {
    return {
      error: jsonError(
        `Provide between 1 and ${CHAT_LIMITS.maxMessages} valid chat messages.`,
        400,
      ),
    }
  }

  const totalCharacters = messages.reduce(
    (sum, message) => sum + message.content.length,
    0,
  )
  if (totalCharacters > CHAT_LIMITS.maxTotalCharacters) {
    return {
      error: jsonError(
        `Conversation content must not exceed ${CHAT_LIMITS.maxTotalCharacters} characters.`,
        400,
      ),
    }
  }

  return { messages }
}

export const POST: Endpoint = async (request) => {
  const apiKey = process.env['OPENROUTER_API_KEY']
  if (!apiKey) {
    return jsonError('Chat is not configured on this server.', 503)
  }

  const lease = acquireChatRateLimit(resolveChatClientId(request))
  if (!lease.allowed) {
    return jsonError('Too many chat requests. Please try again shortly.', 429, {
      'Retry-After': String(lease.retryAfterSeconds),
    })
  }

  try {
    const parsed = await parseMessages(request)
    if (parsed.error) return parsed.error

    const timeoutController = new AbortController()
    let didTimeout = false
    const timeout = setTimeout(() => {
      didTimeout = true
      timeoutController.abort()
    }, CHAT_LIMITS.upstreamTimeoutMs)
    const abortUpstream = () => timeoutController.abort()
    request.signal.addEventListener('abort', abortUpstream, { once: true })

    try {
      const response = await fetch(OPENROUTER_CHAT_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env['ONE_SERVER_URL'] || 'https://panora.app',
          'X-Title': 'Panora',
        },
        body: JSON.stringify({
          model: process.env['OPENROUTER_MODEL'] || CHAT_MODEL,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...parsed.messages],
        }),
        signal: timeoutController.signal,
      })

      const payload = (await response.json().catch(() => null)) as {
        choices?: { message?: { content?: string } }[]
      } | null
      const content = payload?.choices?.[0]?.message?.content?.trim()

      if (!response.ok || !content) {
        return jsonError('The AI provider could not complete the request.', 502)
      }

      return Response.json({ message: { role: 'assistant', content } })
    } catch (error) {
      if (didTimeout) return jsonError('The AI provider took too long to respond.', 504)
      if (request.signal.aborted) return jsonError('The request was cancelled.', 499)
      console.error('[chat] OpenRouter request failed', error)
      return jsonError('The AI provider is temporarily unavailable.', 502)
    } finally {
      clearTimeout(timeout)
      request.signal.removeEventListener('abort', abortUpstream)
    }
  } finally {
    lease.release()
  }
}
