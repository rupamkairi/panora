import { beforeEach, describe, expect, test } from 'vitest'

import { CHAT_LIMITS } from '~/features/chat/server/config'
import {
  getChatQuota,
  isDevelopmentQuotaUnlimited,
  refundChatQuota,
  reserveChatQuota,
  resetChatQuotaForTests,
  resolveQuotaIdentity,
} from '~/features/chat/server/quota'

const request = (token?: string, ip = '198.51.100.42') =>
  new Request('http://localhost/api/chat/quota', {
    headers: {
      'X-Real-IP': ip,
      'User-Agent': 'Panora Test/1.2.3',
      ...(token ? { 'X-Panora-Anonymous-Token': token } : {}),
    },
  })

describe('anonymous chat quota', () => {
  beforeEach(resetChatQuotaForTests)

  test('issues a stable signed identity and starts a fixed 24-hour window', async () => {
    const identity = resolveQuotaIdentity(request())
    const restored = resolveQuotaIdentity(request(identity.token))
    expect(restored.keys[0]).toBe(identity.keys[0])

    const start = Date.UTC(2026, 6, 31, 10)
    const reservation = await reserveChatQuota(restored, start)
    expect(reservation).toMatchObject({
      allowed: true,
      quota: { remaining: 9, limit: 10 },
    })
    expect(reservation.quota.resetAt).toBe(
      new Date(start + CHAT_LIMITS.windowMs).toISOString(),
    )
  })

  test('blocks ask 11 and resets exactly after 24 hours', async () => {
    const identity = resolveQuotaIdentity(request())
    const start = Date.UTC(2026, 6, 31, 10)
    for (let index = 0; index < 10; index += 1) {
      expect((await reserveChatQuota(identity, start + index)).allowed).toBe(true)
    }
    expect((await reserveChatQuota(identity, start + 10)).allowed).toBe(false)
    expect(
      (await reserveChatQuota(identity, start + CHAT_LIMITS.windowMs)).quota.remaining,
    ).toBe(9)
  })

  test('refunds a failed first ask without starting a visible window', async () => {
    const identity = resolveQuotaIdentity(request())
    await reserveChatQuota(identity)
    const quota = await refundChatQuota(identity)
    expect(quota).toEqual({ remaining: 10, limit: 10, resetAt: null })
  })

  test('applies the shared network quota across installations', async () => {
    const first = resolveQuotaIdentity(request(undefined, '203.0.113.8'))
    const second = resolveQuotaIdentity(request(undefined, '203.0.113.8'))
    for (let index = 0; index < 10; index += 1) {
      await reserveChatQuota(first, 1_000 + index)
    }
    await expect(getChatQuota(second, 2_000)).resolves.toMatchObject({
      remaining: 0,
    })
  })

  test('enables unlimited quota only for the development server', () => {
    expect(isDevelopmentQuotaUnlimited('development', '')).toBe(true)
    expect(isDevelopmentQuotaUnlimited('production', '')).toBe(false)
    expect(isDevelopmentQuotaUnlimited('development', 'true')).toBe(false)
  })
})
