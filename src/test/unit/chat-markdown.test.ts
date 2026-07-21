import { describe, expect, test } from 'vitest'

import { parseMarkdownBlocks } from '~/features/chat/markdown'

describe('chat Markdown', () => {
  test('parses headings, lists, paragraphs, and fenced code as display blocks', () => {
    expect(
      parseMarkdownBlocks(`# Findings

The **main result** is clear.

- First outcome
- Second outcome

\`\`\`ts
const reached = true
\`\`\``),
    ).toEqual([
      { type: 'heading', level: 1, content: 'Findings' },
      { type: 'paragraph', content: 'The **main result** is clear.' },
      { type: 'list-item', ordered: false, content: 'First outcome' },
      { type: 'list-item', ordered: false, content: 'Second outcome' },
      { type: 'code', content: 'const reached = true' },
    ])
  })
})
