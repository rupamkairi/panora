import { ScrollView, Spinner, XStack, YStack, useTheme } from 'tamagui'
import { useCallback, useMemo, useState } from 'react'
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Text as NativeText,
  type LayoutChangeEvent,
} from 'react-native'
import { useEffect, useRef } from 'react'

import { Button, IconButton, Popover, Text, TextArea } from '~/interface/components'
import {
  CloseIcon,
  FileIcon,
  MicIcon,
  PlusIcon,
  SendIcon,
  StopIcon,
} from '~/interface/icons/ChatIcons'
import { fontFamilies } from '~/tamagui/fontFamilies'

import type { ChatContextItem } from '../types'
import { voiceTranscriptionService, type VoiceState } from '../voice'
import { ContextSheets } from './ContextSheets'

type ChatComposerProps = {
  draft: string
  onDraftChange: (value: string) => void
  onSend: (value: string) => boolean
  onStop: () => boolean
  isSending: boolean
  contextItems: ChatContextItem[]
  onAddContextItems: (items: ChatContextItem[]) => void
  onRemoveContextItem: (id: string) => void
}

export function ChatComposer({
  draft,
  onDraftChange,
  onSend,
  onStop,
  isSending,
  contextItems,
  onAddContextItems,
  onRemoveContextItem,
}: ChatComposerProps) {
  const theme = useTheme()
  const [plusOpen, setPlusOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)
  const [composerHeight, setComposerHeight] = useState(48)
  const [voice, setVoice] = useState<VoiceState>({ status: 'idle' })
  const canSend = draft.trim().length > 0 && !isSending && voice.status === 'idle'

  const send = useCallback(() => {
    if (!canSend) return
    if (onSend(draft)) onDraftChange('')
  }, [canSend, draft, onDraftChange, onSend])

  const startVoice = useCallback(async () => {
    if (isSending || voice.status === 'transcribing') return
    try {
      await voiceTranscriptionService.start()
      setVoice({ status: 'recording', startedAt: Date.now() })
    } catch {
      setVoice({ status: 'error', message: 'Microphone access is unavailable.' })
    }
  }, [isSending, voice.status])

  const finishVoice = useCallback(async () => {
    if (voice.status !== 'recording') return
    setVoice({ status: 'transcribing' })
    try {
      const transcript = await voiceTranscriptionService.finish()
      onDraftChange(draft ? `${draft} ${transcript}` : transcript)
      setVoice({ status: 'idle' })
    } catch {
      setVoice({ status: 'error', message: 'The recording could not be transcribed.' })
    }
  }, [draft, onDraftChange, voice.status])

  const contextLabel = useMemo(
    () =>
      contextItems.length === 5
        ? 'Context limit reached'
        : `${contextItems.length}/5 context items`,
    [contextItems.length],
  )

  return (
    <>
      <YStack
        bg="$surface"
        borderWidth={1}
        borderColor={voice.status === 'recording' ? '$accent' : '$outlineVariant'}
        rounded="$6"
        mx="$3"
        mb="$2"
        shadowColor="$primary"
        shadowOpacity={0.08}
        shadowRadius={18}
        shadowOffset={{ width: 0, height: 6 }}
        overflow="hidden"
      >
        {contextItems.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack px="$3" pt="$3" gap="$2">
              {contextItems.map((item) => (
                <ContextPill
                  key={item.id}
                  item={item}
                  onRemove={() => onRemoveContextItem(item.id)}
                />
              ))}
            </XStack>
          </ScrollView>
        ) : null}

        {voice.status === 'recording' ? (
          <VoiceRecording
            onCancel={() => {
              void voiceTranscriptionService.cancel()
              setVoice({ status: 'idle' })
            }}
          />
        ) : (
          <TextArea
            aria-label="Message Panora"
            value={draft}
            onChangeText={onDraftChange}
            placeholder="Ask anything about your reports…"
            height={composerHeight}
            maxH={128}
            px="$4"
            pt="$3"
            pb="$2"
            borderWidth={0}
            bg="$transparent"
            rounded={0}
            multiline
            scrollEnabled
            onContentSizeChange={(event) =>
              setComposerHeight(
                Math.max(48, Math.min(128, event.nativeEvent.contentSize.height + 14)),
              )
            }
          />
        )}

        <XStack minH={52} px="$2" pb="$2" items="center" justify="space-between">
          <XStack items="center" gap="$1">
            <Popover
              open={plusOpen}
              onOpenChange={setPlusOpen}
              placement="top-start"
              adaptToSheet={false}
              menu
              content={
                <YStack width={220} gap="$1">
                  <MenuAction
                    label="Upload"
                    detail="Files, photos, or camera"
                    onPress={() => {
                      setPlusOpen(false)
                      setUploadOpen(true)
                    }}
                  />
                  <MenuAction
                    label="Choose reports"
                    detail="Search the sample library"
                    onPress={() => {
                      setPlusOpen(false)
                      setReportsOpen(true)
                    }}
                  />
                </YStack>
              }
            >
              <IconButton
                aria-label="Add context"
                variant="outlined"
                disabled={contextItems.length >= 5}
              >
                <PlusIcon color={theme.content?.val as string} />
              </IconButton>
            </Popover>
            <Text size="xs" tone="secondary" ml="$1">
              {voice.status === 'transcribing' ? 'Transcribing…' : contextLabel}
            </Text>
          </XStack>

          <XStack items="center" gap="$1">
            <IconButton
              aria-label={
                voice.status === 'recording' ? 'Release to transcribe' : 'Hold to speak'
              }
              variant={voice.status === 'recording' ? 'primary' : 'ghost'}
              onPressIn={() => void startVoice()}
              onPressOut={() => void finishVoice()}
              disabled={isSending || voice.status === 'transcribing'}
            >
              {voice.status === 'transcribing' ? (
                <Spinner size="small" color="$accent" />
              ) : (
                <MicIcon
                  color={
                    voice.status === 'recording'
                      ? (theme.contentInverse?.val as string)
                      : (theme.content?.val as string)
                  }
                />
              )}
            </IconButton>
            <IconButton
              aria-label={isSending ? 'Stop response' : 'Send message'}
              variant="primary"
              disabled={!isSending && !canSend}
              opacity={isSending || canSend ? 1 : 0.42}
              onPress={isSending ? onStop : send}
            >
              {isSending ? (
                <StopIcon color={theme.contentInverse?.val as string} />
              ) : (
                <SendIcon color={theme.contentInverse?.val as string} />
              )}
            </IconButton>
          </XStack>
        </XStack>
        {voice.status === 'error' ? (
          <XStack px="$4" pb="$3" justify="space-between" items="center">
            <Text size="xs" tone="destructive" numberOfLines={2}>
              {voice.message}
            </Text>
            <Button size="$2" chromeless onPress={() => setVoice({ status: 'idle' })}>
              Dismiss
            </Button>
          </XStack>
        ) : null}
      </YStack>

      <ContextSheets
        uploadOpen={uploadOpen}
        onUploadOpenChange={setUploadOpen}
        reportsOpen={reportsOpen}
        onReportsOpenChange={setReportsOpen}
        selected={contextItems}
        onAdd={onAddContextItems}
      />
    </>
  )
}

function MenuAction({
  label,
  detail,
  onPress,
}: {
  label: string
  detail: string
  onPress: () => void
}) {
  return (
    <Button
      unstyled
      width="100%"
      minH={58}
      px="$3"
      rounded="$3"
      justify="flex-start"
      borderWidth={0}
      bg="$transparent"
      hoverStyle={{ bg: '$surface1' }}
      pressStyle={{ bg: '$surface2' }}
      focusVisibleStyle={{ outlineWidth: 0, bg: '$surface1' }}
      onPress={onPress}
    >
      <YStack items="flex-start">
        <Text weight="semibold">{label}</Text>
        <Text size="xs" tone="secondary">
          {detail}
        </Text>
      </YStack>
    </Button>
  )
}

function ContextPill({
  item,
  onRemove,
}: {
  item: ChatContextItem
  onRemove: () => void
}) {
  const theme = useTheme()
  return (
    <XStack
      height={34}
      maxW={210}
      items="center"
      gap="$2"
      pl="$3"
      pr="$1"
      bg="$surface1"
      borderWidth={1}
      borderColor="$outlineVariant"
      rounded="$10"
    >
      <FileIcon size={15} color={theme.accent?.val as string} />
      <MarqueeLabel label={item.name} />
      <IconButton aria-label={`Remove ${item.name}`} uiSize="sm" onPress={onRemove}>
        <CloseIcon size={14} color={theme.contentSecondary?.val as string} />
      </IconButton>
    </XStack>
  )
}

function MarqueeLabel({ label }: { label: string }) {
  const theme = useTheme()
  const offset = useRef(new Animated.Value(0)).current
  const [textWidth, setTextWidth] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)
  const availableWidth = 132

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion)
  }, [])

  useEffect(() => {
    if (reduceMotion || textWidth <= availableWidth) {
      offset.setValue(0)
      return
    }
    const distance = textWidth - availableWidth + 10
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(900),
        Animated.timing(offset, {
          toValue: -distance,
          duration: Math.max(1800, distance * 28),
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(650),
        Animated.timing(offset, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    )
    animation.start()
    return () => animation.stop()
  }, [availableWidth, offset, reduceMotion, textWidth])

  return (
    <YStack width={availableWidth} overflow="hidden">
      <Animated.View style={{ transform: [{ translateX: offset }] }}>
        <NativeText
          numberOfLines={1}
          onLayout={(event: LayoutChangeEvent) =>
            setTextWidth(event.nativeEvent.layout.width)
          }
          style={{
            alignSelf: 'flex-start',
            color: theme.content?.val as string,
            fontFamily: fontFamilies.bricolage.medium,
            fontSize: 12,
            lineHeight: 18,
          }}
        >
          {label}
        </NativeText>
      </Animated.View>
    </YStack>
  )
}

function VoiceRecording({ onCancel }: { onCancel: () => void }) {
  return (
    <XStack minH={58} px="$4" items="center" gap="$3">
      <XStack items="center" gap={3} flex={1}>
        {[10, 18, 26, 14, 22, 12, 28, 16, 20, 9].map((height, index) => (
          <YStack key={index} width={3} height={height} rounded="$10" bg="$accent" />
        ))}
        <Text size="sm" weight="semibold" ml="$3">
          Release to transcribe
        </Text>
      </XStack>
      <Button size="$3" chromeless onPress={onCancel}>
        Cancel
      </Button>
    </XStack>
  )
}
