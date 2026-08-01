import { API_URL } from '~/constants/urls'

import { getAnonymousToken, setAnonymousToken } from './quotaStorage'
import type { ChatQuota } from './types'

export const INITIAL_CHAT_QUOTA: ChatQuota = {
  remaining: 10,
  limit: 10,
  resetAt: null,
}

const headers = (): Record<string, string> => {
  const token = getAnonymousToken()
  return token ? { 'X-Panora-Anonymous-Token': token } : {}
}

const rememberToken = (response: Response) => {
  const token = response.headers.get('x-panora-anonymous-token')
  if (token) setAnonymousToken(token)
}

export const getQuotaHeaders = async () => {
  if (!getAnonymousToken()) await fetchChatQuota()
  return headers()
}

export const rememberQuotaToken = rememberToken

export const fetchChatQuota = async (): Promise<ChatQuota> => {
  const response = await fetch(`${API_URL}/chat/quota`, { headers: headers() })
  if (!response.ok) throw new Error('Could not load your ask limit.')
  rememberToken(response)
  return (await response.json()) as ChatQuota
}
