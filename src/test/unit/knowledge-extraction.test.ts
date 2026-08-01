import { describe, expect, test } from 'vitest'

import { chunkSections, extractDocument } from '~/features/knowledge/server/extract'

describe('knowledge document ingestion', () => {
  test('extracts UTF-8 text documents through the public extraction boundary', async () => {
    const result = await extractDocument(
      new TextEncoder().encode('First section.\n\nSecond section.'),
      'text/plain',
    )

    expect(result).toEqual({
      pageCount: null,
      sections: [{ text: 'First section.\n\nSecond section.' }],
    })
  })

  test('creates bounded chunks while retaining overlap for retrieval continuity', () => {
    const chunks = chunkSections(
      [{ text: `${'A'.repeat(700)}\n\n${'B'.repeat(700)}`, pageNumber: 3 }],
      1_000,
    )

    expect(chunks).toHaveLength(2)
    expect(chunks[0]).toMatchObject({ pageNumber: 3, text: 'A'.repeat(700) })
    expect(chunks[1]?.text).toBe(`${'A'.repeat(180)}\n\n${'B'.repeat(700)}`)
  })
})
