import { YStack, XStack, SizableText } from 'tamagui'
import { useState, useCallback, type ReactNode } from 'react'
import { Platform } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import { colors } from '../colors'

import { Button } from '../actions/Button'
import { IconButton } from '../actions/IconButton'

import type { PickedFile, FileValidationError } from '../types'

export { formatBytes, validatePickedFiles } from './filePickerUtils'

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${['B', 'KB', 'MB', 'GB'][i]}`
}

export const FilePicker = ({
  accept = '*/*',
  multiple = false,
  maxFileSize,
  maxTotalSize,
  maxFiles,
  files: controlledFiles,
  defaultFiles,
  onFilesChange,
  onRejected,
  onError,
  variant = 'button',
  disabled = false,
  loading = false,
  copyToCache = true,
  buttonLabel = 'Choose file',
  dropZoneLabel = 'Drag and drop files here',
  trigger,
  showFileSize = true,
  showRemoveAction = true,
}: {
  accept?: string
  multiple?: boolean
  maxFileSize?: number
  maxTotalSize?: number
  maxFiles?: number
  files?: PickedFile[]
  defaultFiles?: PickedFile[]
  onFilesChange?: (files: PickedFile[]) => void
  onRejected?: (errors: FileValidationError[]) => void
  onError?: (error: Error) => void
  variant?: 'button' | 'dropzone'
  disabled?: boolean
  loading?: boolean
  copyToCache?: boolean
  buttonLabel?: string
  dropZoneLabel?: string
  trigger?: (pickFiles: () => void) => ReactNode
  showFileSize?: boolean
  showRemoveAction?: boolean
}) => {
  const [internalFiles, setInternalFiles] = useState<PickedFile[]>(defaultFiles ?? [])
  const isControlled = controlledFiles !== undefined
  const currentFiles = isControlled ? controlledFiles : internalFiles

  const setFiles = useCallback(
    (newFiles: PickedFile[]) => {
      if (!isControlled) setInternalFiles(newFiles)
      onFilesChange?.(newFiles)
    },
    [isControlled, onFilesChange],
  )

  const validateFile = useCallback(
    (file: PickedFile, allFiles: PickedFile[]): FileValidationError | null => {
      if (maxFileSize && file.size > maxFileSize) {
        return { file, reason: 'size', message: `${file.name} exceeds max size of ${formatSize(maxFileSize)}` }
      }
      if (maxFiles && allFiles.length > maxFiles) {
        return { file, reason: 'count', message: `Maximum ${maxFiles} files allowed` }
      }
      if (maxTotalSize) {
        const totalSize = allFiles.reduce((sum, f) => sum + f.size, 0)
        if (totalSize > maxTotalSize) {
          return { file, reason: 'size', message: `Total size exceeds ${formatSize(maxTotalSize)}` }
        }
      }
      return null
    },
    [maxFileSize, maxTotalSize, maxFiles],
  )

  const handlePick = useCallback(async () => {
    if (disabled || loading) return

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: accept,
        multiple,
        copyToCacheDirectory: copyToCache,
      })

      if (result.canceled) return

      const pickedFiles = result.assets.map((asset) => ({
        name: asset.name,
        uri: asset.uri,
        mimeType: asset.mimeType ?? 'application/octet-stream',
        size: asset.size ?? 0,
        lastModified: asset.lastModified ?? undefined,
        file: asset.file ?? undefined,
      }))

      const allFiles = multiple ? [...currentFiles, ...pickedFiles] : pickedFiles

      const errors: FileValidationError[] = []
      for (const file of pickedFiles) {
        const error = validateFile(file, allFiles)
        if (error) errors.push(error)
      }

      if (errors.length > 0) {
        onRejected?.(errors)
        const valid = pickedFiles.filter((f) => !errors.some((e) => e.file === f))
        setFiles(multiple ? [...currentFiles, ...valid] : valid)
        return
      }

      setFiles(allFiles)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      onError?.(error)
    }
  }, [disabled, loading, accept, multiple, copyToCache, currentFiles, validateFile, setFiles, onRejected, onError])

  const removeFile = useCallback(
    (index: number) => setFiles(currentFiles.filter((_, i) => i !== index)),
    [currentFiles, setFiles],
  )

  const clearFiles = useCallback(() => setFiles([]), [setFiles])

  if (trigger) {
    return (
      <YStack gap="$3">
        {trigger(handlePick)}
        {currentFiles.length > 0 && (
          <YStack gap="$2">
            {currentFiles.map((file, i) => (
              <XStack key={`${file.name}-${i}`} px="$3" py="$2" height={44} items="center" gap="$3" rounded="$2" bg={colors.surface1}>
                <SizableText flex={1} fontSize={14} fontWeight="500" color={colors.content}>{file.name}</SizableText>
                {showFileSize && <SizableText fontSize={12} color={colors.contentSecondary}>{formatSize(file.size)}</SizableText>}
                {showRemoveAction && (
                  <IconButton variant="ghost" uiSize="sm" onPress={() => removeFile(i)} aria-label={`Remove ${file.name}`}>✕</IconButton>
                )}
              </XStack>
            ))}
          </YStack>
        )}
      </YStack>
    )
  }

  if (variant === 'dropzone') {
    return (
      <YStack gap="$3">
        <YStack
          borderWidth={2} borderStyle="dashed" borderColor={colors.outlineVariant} rounded="$2"
          p="$6" items="center" justify="center" gap="$3" cursor="pointer" height={120}
          hoverStyle={{ borderColor: colors.accent, bg: colors.surface1 }}
          onPress={handlePick}
        >
          <SizableText fontFamily="$body" fontSize={16} color={colors.contentSecondary}>{dropZoneLabel}</SizableText>
          <SizableText fontFamily="$body" fontSize={13} color={colors.outline}>
            {accept !== '*/*' ? `Accepted: ${accept}` : 'All file types accepted'}
          </SizableText>
        </YStack>
        {currentFiles.map((file, i) => (
          <XStack key={`${file.name}-${i}`} px="$3" py="$2" height={44} items="center" gap="$3" rounded="$2" bg={colors.surface1}>
            <SizableText flex={1} fontSize={14} color={colors.content}>{file.name}</SizableText>
            {showFileSize && <SizableText fontSize={12} color={colors.contentSecondary}>{formatSize(file.size)}</SizableText>}
            {showRemoveAction && (
              <IconButton variant="ghost" uiSize="sm" onPress={() => removeFile(i)}>✕</IconButton>
            )}
          </XStack>
        ))}
      </YStack>
    )
  }

  return (
    <YStack gap="$3">
      <XStack gap="$3" items="center">
        <Button variant="secondary" disabled={disabled} onPress={handlePick}>
          {loading ? 'Loading...' : buttonLabel}
        </Button>
        {currentFiles.length > 0 && (
          <>
            <SizableText fontSize={14} color={colors.contentSecondary}>
              {currentFiles.length} file{currentFiles.length !== 1 ? 's' : ''} selected
            </SizableText>
            {showRemoveAction && (
              <Button variant="ghost" uiSize="sm" onPress={clearFiles}>Clear all</Button>
            )}
          </>
        )}
      </XStack>
      {currentFiles.map((file, i) => (
        <XStack key={`${file.name}-${i}`} px="$3" py="$2" height={44} items="center" gap="$3" rounded="$2" bg={colors.surface1}>
          <SizableText flex={1} fontSize={14} fontWeight="500" color={colors.content}>{file.name}</SizableText>
          {showFileSize && <SizableText fontSize={12} color={colors.contentSecondary}>{formatSize(file.size)}</SizableText>}
          <SizableText fontSize={12} color={colors.contentSecondary}>{file.mimeType}</SizableText>
          {showRemoveAction && (
            <IconButton variant="ghost" uiSize="sm" onPress={() => removeFile(i)}>✕</IconButton>
          )}
        </XStack>
      ))}
    </YStack>
  )
}
