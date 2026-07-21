import { useEffect, useRef } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { SizableText, Spinner, XStack, YStack } from 'tamagui'

import { IconButton } from '~/interface/buttons/IconButton'
import { Button } from '~/interface/buttons/Button'
import { Chip } from '~/interface/chips/Chip'
import {
  BodyLargeText,
  BodySmallText,
  HeadlineText,
  LabelText,
} from '~/interface/design/Typography'
import {
  ChartIcon,
  CompareIcon,
  SparkIcon,
  TrendIcon,
} from '~/interface/icons/phosphor/ChatActionIcons'
import { ListIcon } from '~/interface/icons/phosphor/ListIcon'
import { UserIcon } from '~/interface/icons/phosphor/UserIcon'

import { STARTER_PROMPTS } from '../constants'
import { createSessionTitle } from '../markdown'
import { useChat } from '../useChat'
import { ChatComposer } from './ChatComposer'
import { MarkdownText } from './MarkdownText'

const promptIcons = { chart: ChartIcon, compare: CompareIcon, trend: TrendIcon }

export function ChatScreen() {
  const insets = useSafeAreaInsets()
  const scrollRef = useRef<ScrollView>(null)
  const { messages, isSending, error, canRetry, send, retry } = useChat()
  const hasMessages = messages.length > 0
  const firstPrompt = messages.find((message) => message.role === 'user')?.content || ''

  useEffect(() => {
    if (hasMessages || isSending) {
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }))
    }
  }, [hasMessages, isSending, messages])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <XStack
          height={76}
          px="$6"
          items="center"
          justify="space-between"
          bg="#F8FAFC"
          borderBottomColor="#E2E8F0"
          borderBottomWidth={1}
        >
          <IconButton aria-label="Open menu" role="button" variant="ghost">
            <ListIcon size={28} />
          </IconButton>
          <SizableText
            color="#000000"
            fontFamily="$heading"
            fontSize={18}
            fontWeight="700"
            letterSpacing={4}
          >
            PANORA
          </SizableText>
          <IconButton aria-label="Profile" role="button" variant="outlined">
            <UserIcon size={23} />
          </IconButton>
        </XStack>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <YStack
            flex={1}
            width="100%"
            maxW={720}
            mx="auto"
            px="$4"
            py="$7"
            justify={hasMessages ? 'flex-start' : 'center'}
          >
            {!hasMessages ? (
              <YStack items="center" pb="$3">
                <HeadlineText text="center" $sm={{ fontSize: 24, lineHeight: 29 }}>
                  What can I do for you today?
                </HeadlineText>
                <YStack mt="$10" gap="$4" items="center">
                  {STARTER_PROMPTS.map((prompt) => {
                    const Icon = promptIcons[prompt.icon]
                    return (
                      <Chip
                        key={prompt.label}
                        aria-disabled={isSending}
                        role="button"
                        onPress={() => send(prompt.label)}
                        opacity={isSending ? 0.6 : 1}
                        pointerEvents={isSending ? 'none' : 'auto'}
                        width={230}
                        height={52}
                      >
                        <Icon size={20} />
                        <BodyLargeText fontWeight="500">{prompt.label}</BodyLargeText>
                      </Chip>
                    )
                  })}
                </YStack>
              </YStack>
            ) : (
              <YStack gap="$7" pt="$3">
                <YStack items="center" mb="$3">
                  <LabelText color="#45464D" letterSpacing={1.5}>
                    ACTIVE SESSION
                  </LabelText>
                  <HeadlineText mt="$3" text="center" fontSize={27} lineHeight={34}>
                    {createSessionTitle(firstPrompt)}
                  </HeadlineText>
                </YStack>
                {messages.map((message) =>
                  message.role === 'user' ? (
                    <YStack
                      key={message.id}
                      self="flex-end"
                      maxW="84%"
                      p="$5"
                      bg="#FFFFFF"
                      borderColor="#E2E8F0"
                      rounded="$4"
                      borderWidth={1}
                    >
                      <BodyLargeText selectable>{message.content}</BodyLargeText>
                    </YStack>
                  ) : (
                    <AssistantMessage key={message.id}>
                      <MarkdownText>{message.content}</MarkdownText>
                    </AssistantMessage>
                  ),
                )}
                {isSending && (
                  <AssistantMessage>
                    <BodyTextItalic>Panora is thinking…</BodyTextItalic>
                  </AssistantMessage>
                )}
                {error && (
                  <YStack ml={54} gap="$3" items="flex-start">
                    <BodySmallText role="alert" color="#BA1A1A">
                      {error}
                    </BodySmallText>
                    {canRetry && (
                      <Button
                        role="button"
                        variant="outlined"
                        onPress={retry}
                        height={36}
                        px="$4"
                      >
                        Retry
                      </Button>
                    )}
                  </YStack>
                )}
              </YStack>
            )}
          </YStack>
        </ScrollView>

        <YStack
          bg="#F7F9FB"
          px="$4"
          pt="$3"
          pb={Math.max(insets.bottom, 14)}
          items="center"
        >
          <YStack width="100%" maxW={720}>
            <ChatComposer isSending={isSending} onSend={send} />
          </YStack>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

function AssistantMessage({ children }: { children: React.ReactNode }) {
  return (
    <XStack items="flex-start" gap="$3">
      <YStack
        width={42}
        height={42}
        mt="$1"
        items="center"
        justify="center"
        bg="#131B2E"
        rounded="$10"
      >
        <SparkIcon color="white" size={23} />
      </YStack>
      <YStack flex={1} borderLeftColor="#0051D5" borderLeftWidth={3} pl="$5" py="$1">
        {children}
      </YStack>
    </XStack>
  )
}

function BodyTextItalic({ children }: { children: string }) {
  return (
    <BodyLargeText color="#45464D" fontStyle="italic" fontSize={16} lineHeight={25}>
      {children}
    </BodyLargeText>
  )
}
