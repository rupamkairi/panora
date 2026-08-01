import type { Endpoint } from 'one'

import { requireAdmin } from '~/features/knowledge/server/adminSession'
import { knowledgeRepository } from '~/features/knowledge/server/repository'
import { documentStorage } from '~/features/knowledge/server/storage'

export const DELETE: Endpoint = async (request) => {
  requireAdmin(request)
  const id = new URL(request.url).pathname.split('/').pop()!
  const document = await knowledgeRepository.getInternal(id)
  if (!document) return Response.json({ error: 'Document not found.' }, { status: 404 })
  await documentStorage.delete(document.storageKey)
  await knowledgeRepository.remove(id)
  return Response.json({ deleted: true })
}

export const POST: Endpoint = async (request) => {
  requireAdmin(request)
  const id = new URL(request.url).pathname.split('/').pop()!
  const document = await knowledgeRepository.getInternal(id)
  if (!document) return Response.json({ error: 'Document not found.' }, { status: 404 })
  if (document.status !== 'failed') {
    return Response.json(
      { error: 'Only failed documents can be retried.' },
      { status: 409 },
    )
  }
  await knowledgeRepository.retry(id)
  return Response.json({ queued: true })
}
