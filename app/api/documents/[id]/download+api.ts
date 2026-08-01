import type { Endpoint } from 'one'

import { knowledgeRepository } from '~/features/knowledge/server/repository'
import { documentStorage } from '~/features/knowledge/server/storage'

export const GET: Endpoint = async (request) => {
  const segments = new URL(request.url).pathname.split('/')
  const id = segments[segments.indexOf('documents') + 1]
  if (!id) return Response.json({ error: 'Document not found.' }, { status: 404 })
  const document = await knowledgeRepository.getInternal(id)
  if (!document || document.status !== 'ready') {
    return Response.json({ error: 'Document not found.' }, { status: 404 })
  }
  const body = await documentStorage.get(document.storageKey)
  return new Response(Uint8Array.from(body).buffer, {
    headers: {
      'Content-Type': document.mimeType,
      'Content-Disposition': `inline; filename="${document.originalFilename.replace(/["\r\n]/g, '_')}"`,
      'Cache-Control': 'private, max-age=300',
    },
  })
}
