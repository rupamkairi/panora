import type { Endpoint } from 'one'

import {
  clearAdminCookie,
  createAdminCookie,
  isAdminRequest,
  validateAdminCredentials,
} from '~/features/knowledge/server/adminSession'

export const GET: Endpoint = async (request) =>
  Response.json({ authenticated: isAdminRequest(request) })

export const POST: Endpoint = async (request) => {
  const body = (await request.json().catch(() => null)) as {
    username?: unknown
    password?: unknown
  } | null
  if (
    !body ||
    typeof body.username !== 'string' ||
    typeof body.password !== 'string' ||
    !validateAdminCredentials(body.username, body.password)
  ) {
    return Response.json({ error: 'Invalid admin credentials.' }, { status: 401 })
  }
  return Response.json(
    { authenticated: true },
    { headers: { 'Set-Cookie': createAdminCookie() } },
  )
}

export const DELETE: Endpoint = async () =>
  Response.json(
    { authenticated: false },
    { headers: { 'Set-Cookie': clearAdminCookie() } },
  )
