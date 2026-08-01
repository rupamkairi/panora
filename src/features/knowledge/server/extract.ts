import mammoth from 'mammoth'
import { PDFParse } from 'pdf-parse'

export type ExtractedSection = { text: string; pageNumber?: number; section?: string }

export async function extractDocument(bytes: Uint8Array, mimeType: string) {
  if (mimeType === 'application/pdf') {
    const parser = new PDFParse({ data: bytes })
    try {
      const result = await parser.getText()
      return {
        pageCount: result.total,
        sections: result.pages.map((page, index) => ({
          text: page.text,
          pageNumber: index + 1,
        })),
      }
    } finally {
      await parser.destroy()
    }
  }
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const result = await mammoth.extractRawText({ buffer: Buffer.from(bytes) })
    return { pageCount: null, sections: [{ text: result.value }] }
  }
  return {
    pageCount: null,
    sections: [{ text: new TextDecoder().decode(bytes) }],
  }
}

export function chunkSections(sections: ExtractedSection[], targetCharacters = 1_200) {
  const chunks: ExtractedSection[] = []
  for (const section of sections) {
    const paragraphs = section.text
      .split(/\n\s*\n/)
      .map((text) => text.trim())
      .filter(Boolean)
    let current = ''
    for (const paragraph of paragraphs) {
      if (current && current.length + paragraph.length + 2 > targetCharacters) {
        chunks.push({ ...section, text: current })
        current = `${current.slice(-180)}\n\n${paragraph}`
      } else {
        current = current ? `${current}\n\n${paragraph}` : paragraph
      }
    }
    if (current) chunks.push({ ...section, text: current })
  }
  return chunks
}
