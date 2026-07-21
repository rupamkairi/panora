export type MarkdownBlock =
  | { type: 'heading'; level: number; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'list-item'; ordered: boolean; content: string }
  | { type: 'code'; content: string }

export const parseMarkdownBlocks = (markdown: string): MarkdownBlock[] => {
  const blocks: MarkdownBlock[] = []
  const lines = markdown.replaceAll('\r\n', '\n').split('\n')
  let paragraph: string[] = []

  const flushParagraph = () => {
    if (!paragraph.length) return
    blocks.push({ type: 'paragraph', content: paragraph.join(' ').trim() })
    paragraph = []
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? ''

    if (line.startsWith('```')) {
      flushParagraph()
      const code: string[] = []
      index += 1
      while (index < lines.length && !lines[index]?.startsWith('```')) {
        code.push(lines[index] ?? '')
        index += 1
      }
      blocks.push({ type: 'code', content: code.join('\n').trimEnd() })
      continue
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line)
    if (heading) {
      flushParagraph()
      blocks.push({
        type: 'heading',
        level: heading[1]?.length ?? 1,
        content: heading[2]?.trim() ?? '',
      })
      continue
    }

    const unorderedItem = /^[-*]\s+(.+)$/.exec(line)
    const orderedItem = /^\d+[.)]\s+(.+)$/.exec(line)
    if (unorderedItem || orderedItem) {
      flushParagraph()
      blocks.push({
        type: 'list-item',
        ordered: Boolean(orderedItem),
        content: (orderedItem?.[1] || unorderedItem?.[1] || '').trim(),
      })
      continue
    }

    if (!line.trim()) {
      flushParagraph()
      continue
    }

    paragraph.push(line.trim())
  }

  flushParagraph()
  return blocks
}

export const createSessionTitle = (firstPrompt: string) => {
  const normalized = firstPrompt
    .replace(/[`*_#[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.!?]+$/, '')

  if (!normalized) return 'Conversation with Panora'
  if (normalized.length <= 52) return normalized
  return `${normalized.slice(0, 49).trimEnd()}…`
}
