import { createHmac, timingSafeEqual } from 'node:crypto'

import { ADMIN_PASSWORD, ADMIN_USERNAME, BETTER_AUTH_SECRET } from '~/server/env-server'

const COOKIE_NAME = 'panora_admin'
const SESSION_SECONDS = 8 * 60 * 60

const equal = (left: string, right: string) => {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

const signature = (value: string) =>
  createHmac('sha256', BETTER_AUTH_SECRET).update(value).digest('base64url')

export function validateAdminCredentials(username: string, password: string) {
  return Boolean(
    ADMIN_USERNAME &&
    ADMIN_PASSWORD &&
    equal(username, ADMIN_USERNAME) &&
    equal(password, ADMIN_PASSWORD),
  )
}

export function createAdminCookie(now = Date.now()) {
  const value = `${ADMIN_USERNAME}.${Math.floor(now / 1000) + SESSION_SECONDS}`
  return `${COOKIE_NAME}=${value}.${signature(value)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
}

export function clearAdminCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
}

export function isAdminRequest(request: Request, now = Date.now()) {
  const raw = request.headers
    .get('cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1)
  if (!raw) return false
  const separator = raw.lastIndexOf('.')
  if (separator < 1) return false
  const value = raw.slice(0, separator)
  const suppliedSignature = raw.slice(separator + 1)
  const expiry = Number(value.slice(value.lastIndexOf('.') + 1))
  return (
    value.startsWith(`${ADMIN_USERNAME}.`) &&
    Number.isFinite(expiry) &&
    expiry > now / 1000 &&
    equal(suppliedSignature, signature(value))
  )
}

export function requireAdmin(request: Request) {
  if (!isAdminRequest(request)) {
    throw Response.json({ error: 'Admin authentication required.' }, { status: 401 })
  }
}
