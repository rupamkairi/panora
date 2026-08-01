import { CHAT_LIMITS } from './config'

type ClientState = {
  windowStartedAt: number
  requestCount: number
  concurrentRequests: number
}

export type RateLimitLease =
  | { allowed: false; retryAfterSeconds: number }
  | { allowed: true; release: () => void }

const clients = new Map<string, ClientState>()
let acquisitionCount = 0

const pruneExpiredClients = (now: number) => {
  acquisitionCount += 1
  if (acquisitionCount % 100 !== 0) return

  for (const [clientId, state] of clients) {
    if (
      state.concurrentRequests === 0 &&
      now - state.windowStartedAt >= CHAT_LIMITS.abuseWindowMs
    ) {
      clients.delete(clientId)
    }
  }
}

const getState = (clientId: string, now: number) => {
  const current = clients.get(clientId)
  if (!current || now - current.windowStartedAt >= CHAT_LIMITS.abuseWindowMs) {
    const state: ClientState = {
      windowStartedAt: now,
      requestCount: 0,
      concurrentRequests: current?.concurrentRequests ?? 0,
    }
    clients.set(clientId, state)
    return state
  }
  return current
}

export const acquireChatRateLimit = (
  clientId: string,
  now = Date.now(),
): RateLimitLease => {
  pruneExpiredClients(now)
  const state = getState(clientId, now)
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((state.windowStartedAt + CHAT_LIMITS.abuseWindowMs - now) / 1000),
  )

  if (
    state.requestCount >= CHAT_LIMITS.maxRequestsPerWindow ||
    state.concurrentRequests >= CHAT_LIMITS.maxConcurrentRequests
  ) {
    return { allowed: false, retryAfterSeconds }
  }

  state.requestCount += 1
  state.concurrentRequests += 1
  let released = false

  return {
    allowed: true,
    release: () => {
      if (released) return
      released = true
      state.concurrentRequests = Math.max(0, state.concurrentRequests - 1)
    },
  }
}

export const resolveChatClientId = (request: Request) => {
  const connectingIp = request.headers.get('cf-connecting-ip')?.trim()
  if (connectingIp) return connectingIp

  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  const forwardedIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwardedIp || 'unknown-client'
}
