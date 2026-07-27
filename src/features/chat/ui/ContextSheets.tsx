import { useEffect, useMemo, useState } from 'react'
import { Pressable as NativePressable } from 'react-native'
import { ScrollView, XStack, YStack, useTheme } from 'tamagui'

import { reportRepository } from '~/features/reports/repository'
import type { ReportSummary } from '~/features/reports/types'
import { AppSheet, Button, IconButton, Input, Text } from '~/interface/components'
import { CheckIcon, CloseIcon, FileIcon, SearchIcon } from '~/interface/icons/ChatIcons'

import type { ChatContextItem } from '../types'

type ContextSheetsProps = {
  uploadOpen: boolean
  onUploadOpenChange: (open: boolean) => void
  reportsOpen: boolean
  onReportsOpenChange: (open: boolean) => void
  selected: ChatContextItem[]
  onAdd: (items: ChatContextItem[]) => void
}

export function ContextSheets(props: ContextSheetsProps) {
  return (
    <>
      <UploadSheet {...props} />
      <ReportSheet {...props} />
    </>
  )
}

function UploadSheet({
  uploadOpen,
  onUploadOpenChange,
  selected,
  onAdd,
}: ContextSheetsProps) {
  const remaining = 5 - selected.length

  const addDocument = async () => {
    if (remaining <= 0) return
    const DocumentPicker = await import('expo-document-picker')
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: true,
      type: ['application/pdf', 'text/plain', 'text/csv'],
    })
    if (result.canceled) return
    onAdd(
      result.assets.slice(0, remaining).map((asset) => ({
        id: `document-${asset.uri}`,
        kind: 'document',
        name: asset.name,
        uri: asset.uri,
        mimeType: asset.mimeType ?? undefined,
        status: 'selected',
      })),
    )
    onUploadOpenChange(false)
  }

  const addImage = async (camera: boolean) => {
    if (remaining <= 0) return
    const ImagePicker = await import('expo-image-picker')
    const permission = camera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) return
    const result = camera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsMultipleSelection: true,
          selectionLimit: remaining,
          quality: 0.8,
        })
    if (result.canceled) return
    onAdd(
      result.assets.slice(0, remaining).map((asset, index) => ({
        id: `image-${asset.assetId ?? asset.uri}`,
        kind: 'image',
        name: asset.fileName ?? `Photo ${index + 1}`,
        uri: asset.uri,
        mimeType: asset.mimeType,
        status: 'selected',
      })),
    )
    onUploadOpenChange(false)
  }

  return (
    <AppSheet
      open={uploadOpen}
      onOpenChange={onUploadOpenChange}
      snapPoints={[42]}
      title="Upload"
      description={
        remaining > 0
          ? `Add files or photos. ${remaining} context slots available.`
          : 'Remove an item before adding another.'
      }
    >
      <YStack px="$4" py="$4" gap="$2">
        <UploadChoice
          title="Files"
          subtitle="PDF, TXT, or CSV"
          disabled={remaining <= 0}
          onPress={() => void addDocument()}
        />
        <UploadChoice
          title="Photos"
          subtitle="Choose from your library"
          disabled={remaining <= 0}
          onPress={() => void addImage(false)}
        />
        <UploadChoice
          title="Camera"
          subtitle="Take a new photo"
          disabled={remaining <= 0}
          onPress={() => void addImage(true)}
        />
        <Text size="xs" tone="secondary" mt="$2">
          Selected items are local context only until report ingestion is connected.
        </Text>
      </YStack>
    </AppSheet>
  )
}

function UploadChoice({
  title,
  subtitle,
  disabled,
  onPress,
}: {
  title: string
  subtitle: string
  disabled: boolean
  onPress: () => void
}) {
  const theme = useTheme()
  return (
    <NativePressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        width: '100%',
        opacity: disabled ? 0.42 : pressed ? 0.7 : 1,
      })}
    >
      <XStack width="100%" minH={58} items="center" gap="$3" py="$2">
        <YStack
          width={42}
          height={42}
          rounded="$10"
          bg="$surface1"
          items="center"
          justify="center"
        >
          <FileIcon color={theme.content?.val as string} />
        </YStack>
        <YStack flex={1} items="flex-start">
          <Text weight="semibold">{title}</Text>
          <Text size="sm" tone="secondary">
            {subtitle}
          </Text>
        </YStack>
      </XStack>
    </NativePressable>
  )
}

function ReportSheet({
  reportsOpen,
  onReportsOpenChange,
  selected,
  onAdd,
}: ContextSheetsProps) {
  const [query, setQuery] = useState('')
  const [reports, setReports] = useState<ReportSummary[]>([])
  const [pending, setPending] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const theme = useTheme()

  useEffect(() => {
    if (!reportsOpen) return
    setLoading(true)
    void reportRepository
      .list({ search: query })
      .then(setReports)
      .finally(() => setLoading(false))
  }, [query, reportsOpen])

  useEffect(() => {
    if (reportsOpen) {
      setPending(
        selected.filter((item) => item.kind === 'report').map((item) => item.reportId),
      )
    }
  }, [reportsOpen, selected])

  const selectedNonReports = selected.filter((item) => item.kind !== 'report').length
  const maxReports = 5 - selectedNonReports
  const canApply = pending.length <= maxReports
  const addLabel = pending.length
    ? `Add ${pending.length} report${pending.length > 1 ? 's' : ''}`
    : 'Add reports'
  const selectedReports = useMemo(
    () => reports.filter((report) => pending.includes(report.id)),
    [pending, reports],
  )

  const toggle = (id: string) => {
    setPending((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < maxReports
          ? [...current, id]
          : current,
    )
  }

  const apply = () => {
    onAdd(
      selectedReports.map((report) => ({
        id: `report-${report.id}`,
        kind: 'report',
        reportId: report.id,
        name: report.title,
        publisher: report.publisher,
        status: 'ready',
      })),
    )
    onReportsOpenChange(false)
  }

  return (
    <AppSheet
      open={reportsOpen}
      onOpenChange={onReportsOpenChange}
      snapPoints={[90]}
      title="Choose reports"
      description="Sample reports are clearly marked until your report library is connected."
      footer={
        <Button width="100%" variant="primary" disabled={!canApply} onPress={apply}>
          {addLabel}
        </Button>
      }
    >
      <YStack px="$4" pt="$3" pb="$8" gap="$3">
        <XStack minH={48} items="center" gap="$2" px="$3" bg="$surface1" rounded="$4">
          <SearchIcon color={theme.contentSecondary?.val as string} />
          <Input
            aria-label="Search reports"
            value={query}
            onChangeText={setQuery}
            placeholder="Search sample reports"
            flex={1}
            borderWidth={0}
            bg="$transparent"
            px="$1"
            focusStyle={{
              borderWidth: 0,
              outlineWidth: 0,
              bg: '$transparent',
            }}
          />
          {query ? (
            <IconButton aria-label="Clear search" onPress={() => setQuery('')}>
              <CloseIcon color={theme.contentSecondary?.val as string} />
            </IconButton>
          ) : null}
        </XStack>
        <XStack justify="space-between" items="center">
          <Text size="sm" weight="semibold">
            {pending.length} of {maxReports} selected
          </Text>
          <Text size="xs" tone="secondary">
            SAMPLE LIBRARY
          </Text>
        </XStack>
        {loading ? (
          <Text tone="secondary">Loading sample reports…</Text>
        ) : reports.length === 0 ? (
          <YStack py="$8" items="center" gap="$2">
            <Text weight="semibold">No reports found</Text>
            <Text size="sm" tone="secondary">
              Try another title, publisher, or topic.
            </Text>
          </YStack>
        ) : (
          <ScrollView>
            <YStack gap="$1">
              {reports.map((report) => {
                const checked = pending.includes(report.id)
                return (
                  <NativePressable
                    key={report.id}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked }}
                    accessibilityLabel={`Select ${report.title}`}
                    onPress={() => toggle(report.id)}
                  >
                    <XStack
                      minH={74}
                      px="$2"
                      py="$2"
                      gap="$3"
                      rounded="$3"
                      items="center"
                      bg={checked ? '$surface1' : '$transparent'}
                    >
                      <YStack
                        width={24}
                        height={24}
                        rounded="$2"
                        borderWidth={1.5}
                        borderColor={checked ? '$accent' : '$outline'}
                        bg={checked ? '$accent' : '$transparent'}
                        items="center"
                        justify="center"
                      >
                        {checked ? (
                          <CheckIcon
                            size={16}
                            color={theme.contentInverse?.val as string}
                          />
                        ) : null}
                      </YStack>
                      <YStack flex={1} gap="$1">
                        <Text weight="semibold" numberOfLines={2}>
                          {report.title}
                        </Text>
                        <Text size="sm" tone="secondary" numberOfLines={2}>
                          {report.publisher} · {report.publishedAt}
                        </Text>
                      </YStack>
                    </XStack>
                  </NativePressable>
                )
              })}
            </YStack>
          </ScrollView>
        )}
      </YStack>
    </AppSheet>
  )
}
