import type { FileValidationError, PickedFile } from '../types'

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export const validatePickedFiles = (
  files: PickedFile[],
  limits: { maxFileSize?: number; maxTotalSize?: number; maxFiles?: number },
) => {
  const accepted: PickedFile[] = []
  const rejected: FileValidationError[] = []

  for (const file of files) {
    if (limits.maxFileSize !== undefined && file.size > limits.maxFileSize) {
      rejected.push({
        file,
        reason: 'size',
        message: `${file.name} exceeds the maximum file size.`,
      })
      continue
    }
    if (limits.maxFiles !== undefined && accepted.length >= limits.maxFiles) {
      rejected.push({
        file,
        reason: 'count',
        message: `Only ${limits.maxFiles} files may be selected.`,
      })
      continue
    }
    const nextTotal = accepted.reduce((sum, item) => sum + item.size, 0) + file.size
    if (limits.maxTotalSize !== undefined && nextTotal > limits.maxTotalSize) {
      rejected.push({
        file,
        reason: 'size',
        message: 'The selected files exceed the maximum total size.',
      })
      continue
    }
    accepted.push(file)
  }

  return { accepted, rejected }
}
