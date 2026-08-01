export const CHAT_LIMITS = {
  maxMessages: 20,
  maxTotalCharacters: 16_000,
  maxRequestsPerWindow: 10,
  abuseWindowMs: 60_000,
  maxConcurrentRequests: 2,
  windowMs: 24 * 60 * 60 * 1000,
  upstreamTimeoutMs: 45_000,
} as const

export const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions'

export const FREE_CHAT_MODEL_FALLBACK = 'openrouter/free'

export const resolveFreeChatModel = (configuredModel: string | undefined) => {
  const model = configuredModel?.trim()
  return model === FREE_CHAT_MODEL_FALLBACK || model?.endsWith(':free')
    ? model
    : FREE_CHAT_MODEL_FALLBACK
}
