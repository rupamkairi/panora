export const CHAT_LIMITS = {
  maxMessages: 20,
  maxTotalCharacters: 16_000,
  maxRequestsPerWindow: 10,
  maxConcurrentRequests: 2,
  windowMs: 60_000,
  upstreamTimeoutMs: 45_000,
} as const

export const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions'
