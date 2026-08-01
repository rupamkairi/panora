import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { Pool } from 'pg'

import { DATABASE_URL } from '~/server/env-server'

import { CHAT_LIMITS } from './config'

export type ChatQuota = {
  remaining: number
  limit: number
  resetAt: string | null
  unlimited?: boolean
}

export type QuotaIdentity = {
  token: string
  keys: string[]
}

const TOKEN_HEADER = 'x-panora-anonymous-token'
const TOKEN_VERSION = 'v1'
const memory = new Map<string, { startedAt: number | null; used: number }>()
let pool: Pool | undefined

const DEVELOPMENT_QUOTA: ChatQuota = {
  remaining: Number.MAX_SAFE_INTEGER,
  limit: Number.MAX_SAFE_INTEGER,
  resetAt: null,
  unlimited: true,
}

export const isDevelopmentQuotaUnlimited = (
  nodeEnv = process.env.NODE_ENV,
  isVitest = process.env['VITEST'],
) => nodeEnv === 'development' && isVitest !== 'true'

const secret = () =>
  process.env['CHAT_QUOTA_SECRET'] ||
  process.env['BETTER_AUTH_SECRET'] ||
  'development-only-chat-quota-secret'

const hmac = (value: string) =>
  createHmac('sha256', secret()).update(value).digest('base64url')

const signInstallation = (id: string) =>
  `${TOKEN_VERSION}.${id}.${hmac(`${TOKEN_VERSION}.${id}`)}`

const readInstallation = (token: string | null) => {
  if (!token) return null
  const [version, id, signature] = token.split('.')
  if (version !== TOKEN_VERSION || !id || !signature) return null
  const expected = hmac(`${version}.${id}`)
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  return actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
    ? id
    : null
}

const resolveIp = (request: Request) =>
  request.headers.get('cf-connecting-ip')?.trim() ||
  request.headers.get('x-real-ip')?.trim() ||
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  'unknown'

const coarseUserAgent = (request: Request) =>
  (request.headers.get('user-agent') || 'unknown')
    .toLowerCase()
    .replace(/\d+(?:\.\d+)+/g, 'x')
    .slice(0, 160)

export const resolveQuotaIdentity = (request: Request): QuotaIdentity => {
  const supplied = request.headers.get(TOKEN_HEADER)
  const installationId = readInstallation(supplied) || randomUUID()
  return {
    token: signInstallation(installationId),
    keys: [
      `installation:${hmac(installationId)}`,
      `network:${hmac(`${resolveIp(request)}|${coarseUserAgent(request)}`)}`,
    ],
  }
}

const quotaFromRows = (
  rows: Array<{ usedCount: number; windowStartedAt: Date | string | null }>,
  now: number,
): ChatQuota => {
  let remaining: number = CHAT_LIMITS.maxRequestsPerWindow
  let resetAt: string | null = null
  for (const row of rows) {
    const started = row.windowStartedAt ? new Date(row.windowStartedAt).getTime() : null
    if (started === null || now - started >= CHAT_LIMITS.windowMs) continue
    const rowRemaining = Math.max(0, CHAT_LIMITS.maxRequestsPerWindow - row.usedCount)
    if (rowRemaining < remaining) {
      remaining = rowRemaining
      resetAt = new Date(started + CHAT_LIMITS.windowMs).toISOString()
    } else if (rowRemaining === remaining && resetAt === null) {
      resetAt = new Date(started + CHAT_LIMITS.windowMs).toISOString()
    }
  }
  return { remaining, limit: CHAT_LIMITS.maxRequestsPerWindow, resetAt }
}

const getPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      max: 10,
    })
  }
  return pool
}

const shouldUseMemory = () =>
  process.env.NODE_ENV === 'test' || process.env['VITEST'] === 'true'

const memoryStatus = (keys: string[], now: number) =>
  quotaFromRows(
    keys.map((key) => {
      const state = memory.get(key)
      return {
        usedCount: state?.used ?? 0,
        windowStartedAt: state?.startedAt ? new Date(state.startedAt) : null,
      }
    }),
    now,
  )

export const getChatQuota = async (
  identity: QuotaIdentity,
  now = Date.now(),
): Promise<ChatQuota> => {
  if (isDevelopmentQuotaUnlimited()) return DEVELOPMENT_QUOTA
  if (shouldUseMemory()) return memoryStatus(identity.keys, now)
  const result = await getPool().query<{
    usedCount: number
    windowStartedAt: Date | null
  }>(
    `SELECT "usedCount", "windowStartedAt" FROM "chatQuota"
     WHERE "quotaKey" = ANY($1::text[])`,
    [identity.keys],
  )
  return quotaFromRows(result.rows, now)
}

export const reserveChatQuota = async (
  identity: QuotaIdentity,
  now = Date.now(),
): Promise<{ allowed: boolean; quota: ChatQuota }> => {
  if (isDevelopmentQuotaUnlimited()) return { allowed: true, quota: DEVELOPMENT_QUOTA }
  if (shouldUseMemory()) {
    const current = memoryStatus(identity.keys, now)
    if (current.remaining === 0) return { allowed: false, quota: current }
    for (const key of identity.keys) {
      const state = memory.get(key)
      if (!state?.startedAt || now - state.startedAt >= CHAT_LIMITS.windowMs) {
        memory.set(key, { startedAt: now, used: 1 })
      } else {
        state.used += 1
      }
    }
    return { allowed: true, quota: memoryStatus(identity.keys, now) }
  }

  const client = await getPool().connect()
  try {
    await client.query('BEGIN')
    const expiresAt = new Date(now + CHAT_LIMITS.windowMs)
    await client.query(`DELETE FROM "chatQuota" WHERE "expiresAt" <= $1`, [new Date(now)])
    await client.query(
      `INSERT INTO "chatQuota" ("quotaKey", "expiresAt")
       SELECT unnest($1::text[]), $2
       ON CONFLICT ("quotaKey") DO NOTHING`,
      [identity.keys, expiresAt],
    )
    const locked = await client.query<{
      quotaKey: string
      usedCount: number
      windowStartedAt: Date | null
    }>(
      `SELECT "quotaKey", "usedCount", "windowStartedAt" FROM "chatQuota"
       WHERE "quotaKey" = ANY($1::text[]) FOR UPDATE`,
      [identity.keys],
    )
    const activeRows = locked.rows.map((row) => {
      const started = row.windowStartedAt?.getTime() ?? 0
      return !started || now - started >= CHAT_LIMITS.windowMs
        ? { ...row, usedCount: 0, windowStartedAt: null }
        : row
    })
    if (activeRows.some((row) => row.usedCount >= CHAT_LIMITS.maxRequestsPerWindow)) {
      await client.query('ROLLBACK')
      return { allowed: false, quota: quotaFromRows(activeRows, now) }
    }
    await client.query(
      `UPDATE "chatQuota"
       SET "usedCount" = CASE
             WHEN "windowStartedAt" IS NULL OR "windowStartedAt" <= $2 THEN 1
             ELSE "usedCount" + 1
           END,
           "windowStartedAt" = CASE
             WHEN "windowStartedAt" IS NULL OR "windowStartedAt" <= $2 THEN $3
             ELSE "windowStartedAt"
           END,
           "expiresAt" = CASE
             WHEN "windowStartedAt" IS NULL OR "windowStartedAt" <= $2 THEN $4
             ELSE "expiresAt"
           END
       WHERE "quotaKey" = ANY($1::text[])`,
      [identity.keys, new Date(now - CHAT_LIMITS.windowMs), new Date(now), expiresAt],
    )
    await client.query('COMMIT')
    return {
      allowed: true,
      quota: quotaFromRows(
        activeRows.map((row) => ({
          ...row,
          usedCount: row.usedCount + 1,
          windowStartedAt: row.windowStartedAt || new Date(now),
        })),
        now,
      ),
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export const refundChatQuota = async (identity: QuotaIdentity, now = Date.now()) => {
  if (isDevelopmentQuotaUnlimited()) return DEVELOPMENT_QUOTA
  if (shouldUseMemory()) {
    for (const key of identity.keys) {
      const state = memory.get(key)
      if (!state) continue
      if (state.used <= 1) memory.delete(key)
      else state.used -= 1
    }
    return memoryStatus(identity.keys, now)
  }
  await getPool().query(
    `UPDATE "chatQuota"
     SET "usedCount" = GREATEST(0, "usedCount" - 1),
         "windowStartedAt" = CASE WHEN "usedCount" <= 1 THEN NULL ELSE "windowStartedAt" END,
         "expiresAt" = CASE WHEN "usedCount" <= 1 THEN $2 ELSE "expiresAt" END
     WHERE "quotaKey" = ANY($1::text[])`,
    [identity.keys, new Date(now)],
  )
  return getChatQuota(identity, now)
}

export const quotaHeaders = (identity: QuotaIdentity, quota: ChatQuota) => ({
  'X-Panora-Anonymous-Token': identity.token,
  'X-RateLimit-Limit': String(quota.limit),
  'X-RateLimit-Remaining': String(quota.remaining),
  ...(quota.resetAt ? { 'X-RateLimit-Reset': quota.resetAt } : {}),
})

export const resetChatQuotaForTests = () => memory.clear()

export const hashQuotaDiagnostic = (value: string) =>
  createHash('sha256').update(value).digest('hex').slice(0, 12)
