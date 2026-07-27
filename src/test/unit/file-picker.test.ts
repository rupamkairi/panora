import { describe, expect, it } from 'vitest'

import {
  formatBytes,
  validatePickedFiles,
} from '~/interface/components/forms/filePickerUtils'

import type { PickedFile } from '~/interface/components/types'

const file = (name: string, size: number): PickedFile => ({
  name,
  size,
  uri: `file://${name}`,
  mimeType: 'text/plain',
})

describe('FilePicker helpers', () => {
  it('formats file sizes for display', () => {
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(2048)).toBe('2 KB')
    expect(formatBytes(1_572_864)).toBe('1.5 MB')
  })

  it('rejects files that exceed individual, count, and total limits', () => {
    const result = validatePickedFiles(
      [
        file('one.txt', 4),
        file('large.txt', 20),
        file('two.txt', 4),
        file('three.txt', 4),
      ],
      { maxFileSize: 10, maxFiles: 2, maxTotalSize: 8 },
    )

    expect(result.accepted.map(({ name }) => name)).toEqual(['one.txt', 'two.txt'])
    expect(result.rejected.map(({ file: rejectedFile }) => rejectedFile.name)).toEqual([
      'large.txt',
      'three.txt',
    ])
    expect(result.rejected.map(({ reason }) => reason)).toEqual(['size', 'count'])
  })
})
