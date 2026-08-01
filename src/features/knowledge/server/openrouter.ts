import { OPENROUTER_API_KEY, OPENROUTER_EMBEDDING_MODEL } from '~/server/env-server'

export async function embedTexts(texts: string[]) {
  if (!OPENROUTER_API_KEY) throw new Error('OpenRouter is not configured.')
  const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENROUTER_EMBEDDING_MODEL,
      input: texts,
      encoding_format: 'float',
    }),
  })
  if (!response.ok) throw new Error(`Embedding provider returned ${response.status}.`)
  const body = (await response.json()) as {
    data?: Array<{ index: number; embedding: number[] }>
  }
  if (!body.data || body.data.length !== texts.length) {
    throw new Error('Embedding provider returned incomplete results.')
  }
  return body.data.sort((a, b) => a.index - b.index).map((item) => item.embedding)
}
