import { createHash, randomUUID } from 'node:crypto'

import type { Endpoint } from 'one'

import { requireAdmin } from '~/features/knowledge/server/adminSession'
import { knowledgeRepository } from '~/features/knowledge/server/repository'
import { documentStorage } from '~/features/knowledge/server/storage'
import { MAX_DOCUMENT_BYTES, SUPPORTED_DOCUMENT_TYPES } from '~/features/knowledge/types'
import { ADMIN_USERNAME } from '~/server/env-server'

type WebFormData = { get(name: string): string | File | null }

const text = (form: WebFormData, key: string) => {
  const value = form.get(key)
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

const tags = (form: WebFormData) =>
  (text(form, 'tags') ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20)

export const GET: Endpoint = async (request) => {
  requireAdmin(request)
  return Response.json({ documents: await knowledgeRepository.list() })
}

export const POST: Endpoint = async (request) => {
  requireAdmin(request)
  const form = (await request.formData()) as unknown as WebFormData
  const file = form.get('file')
  if (!(file instanceof File)) {
    return Response.json({ error: 'Choose a document to upload.' }, { status: 400 })
  }
  if (file.size <= 0 || file.size > MAX_DOCUMENT_BYTES) {
    return Response.json(
      { error: 'Documents must be between 1 byte and 25 MB.' },
      { status: 400 },
    )
  }
  if (
    !SUPPORTED_DOCUMENT_TYPES.includes(
      file.type as (typeof SUPPORTED_DOCUMENT_TYPES)[number],
    )
  ) {
    return Response.json(
      { error: 'Upload a PDF, DOCX, TXT, or Markdown file.' },
      { status: 400 },
    )
  }
  const bytes = new Uint8Array(await file.arrayBuffer())
  const checksum = createHash('sha256').update(bytes).digest('hex')
  const duplicate = await knowledgeRepository.findByChecksum(checksum)
  if (duplicate) {
    return Response.json(
      { error: `This file already exists as “${duplicate.title}”.`, duplicate },
      { status: 409 },
    )
  }
  const title = text(form, 'title')
  if (!title) {
    return Response.json({ error: 'A display title is required.' }, { status: 400 })
  }
  const storageKey = `documents/${randomUUID()}/${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  await documentStorage.put(storageKey, bytes, file.type)
  try {
    const document = await knowledgeRepository.create({
      title,
      originalFilename: file.name,
      description: text(form, 'description'),
      author: text(form, 'author'),
      organization: text(form, 'organization'),
      sourceUrl: text(form, 'sourceUrl'),
      publicationDate: text(form, 'publicationDate'),
      language: text(form, 'language'),
      category: text(form, 'category'),
      tags: tags(form),
      mimeType: file.type,
      sizeBytes: file.size,
      checksum,
      storageKey,
      uploadedBy: ADMIN_USERNAME,
    })
    return Response.json({ document }, { status: 201 })
  } catch (error) {
    await documentStorage.delete(storageKey).catch(() => {})
    throw error
  }
}
