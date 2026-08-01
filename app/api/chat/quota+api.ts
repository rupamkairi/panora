import type { Endpoint } from 'one'

import {
  getChatQuota,
  quotaHeaders,
  resolveQuotaIdentity,
} from '~/features/chat/server/quota'

export const GET: Endpoint = async (request) => {
  const identity = resolveQuotaIdentity(request)
  const quota = await getChatQuota(identity)
  return Response.json(quota, { headers: quotaHeaders(identity, quota) })
}
