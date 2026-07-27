import * as Clipboard from 'expo-clipboard'
import { useRouter } from 'one'
import { useEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Share } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { XStack, YStack, useTheme } from 'tamagui'

import type { Conversation } from '../types'
import { useChat } from '../useChat'
import { STARTER_PROMPTS } from '../constants'
import { LogoIcon } from '~/interface/app/LogoIcon'
import { Button, IconButton, Popover, Text } from '~/interface/components'
import {
  MenuIcon,
  MoreIcon,
  PlusIcon,
  ShareIcon,
  TrashIcon,
} from '~/interface/icons/ChatIcons'
import { ChatComposer } from './ChatComposer'
import { ChatErrorBoundary } from './ChatErrorBoundary'
import { ChatSidebar } from './ChatSidebar'
import { MarkdownText } from './MarkdownText'

const shareConversation = async (
  conversation: Pick<Conversation, 'title' | 'messages'>,
) => {
  const content = conversation.messages
    .map(
      (message) =>
        `## ${message.role === 'user' ? 'You' : 'Panora'}\n\n${message.content}`,
    )
    .join('\n\n')
  await Share.share({
    title: conversation.title,
    message: `# ${conversation.title}\n\n${content}`,
  })
}

export function ChatScreen() {
  const router = useRouter()
  const theme = useTheme()
  const scrollRef = useRef<ScrollView>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const chat = useChat()
  const hasMessages = chat.messages.length > 0
  const current = chat.conversations.find((item) => item.id === chat.conversationId)
  const title = current?.title ?? 'New chat'

  useEffect(() => {
    if (hasMessages || chat.isSending) {
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }))
    }
  }, [chat.isSending, chat.messages, hasMessages])

  const shareCurrent = () =>
    void shareConversation({
      title,
      messages: chat.messages,
    })

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background?.val as string }}
      edges={['top', 'bottom']}
    >
      <ChatErrorBoundary>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <XStack
            height={52}
            px="$2"
            items="center"
            borderBottomWidth={1}
            borderBottomColor="$outlineVariant"
          >
            <IconButton
              aria-label="Open conversation sidebar"
              onPress={() => setSidebarOpen(true)}
            >
              <MenuIcon color={theme.content?.val as string} />
            </IconButton>
            <Text flex={1} center size="sm" weight="semibold" numberOfLines={1} px="$2">
              {title}
            </Text>
            <Popover
              open={menuOpen}
              onOpenChange={setMenuOpen}
              placement="bottom-end"
              adaptToSheet={false}
              menu
              content={
                <YStack width={212}>
                  <MenuButton
                    label="Share conversation"
                    icon="share"
                    onPress={() => {
                      setMenuOpen(false)
                      shareCurrent()
                    }}
                  />
                  <MenuButton
                    label="Delete conversation"
                    icon="delete"
                    destructive
                    disabled={!current}
                    onPress={() => {
                      if (current) chat.deleteConversation(current.id)
                      setMenuOpen(false)
                    }}
                  />
                </YStack>
              }
            >
              <IconButton aria-label="Conversation actions">
                <MoreIcon color={theme.content?.val as string} />
              </IconButton>
            </Popover>
          </XStack>

          <ScrollView
            ref={scrollRef}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <YStack flex={1} px="$4" pt="$4" pb="$5">
              {!hasMessages ? (
                <EmptyChat onPrompt={(prompt) => chat.send(prompt)} />
              ) : (
                <YStack gap="$5">
                  {chat.messages.map((message) =>
                    message.role === 'user' ? (
                      <XStack key={message.id} justify="flex-end">
                        <YStack
                          maxW="86%"
                          bg="$accentContainer"
                          rounded="$5"
                          borderBottomRightRadius="$2"
                          px="$4"
                          py="$3"
                        >
                          <Text>{message.content}</Text>
                        </YStack>
                      </XStack>
                    ) : (
                      <AssistantMessage
                        key={message.id}
                        message={message}
                        onRetry={(kind) => chat.retry(kind)}
                        onFeedback={(feedback) =>
                          chat.setFeedback(
                            message.id,
                            message.feedback === feedback ? null : feedback,
                          )
                        }
                      />
                    ),
                  )}
                  {chat.error ? (
                    <YStack bg="$destructiveContainer" rounded="$3" px="$3" py="$2">
                      <Text size="sm" tone="destructive">
                        {chat.error}
                      </Text>
                      {chat.canRetry ? (
                        <Button
                          mt="$2"
                          self="flex-start"
                          size="$2"
                          variant="ghost"
                          onPress={() => chat.retry('retry')}
                        >
                          Try again
                        </Button>
                      ) : null}
                    </YStack>
                  ) : null}
                </YStack>
              )}
            </YStack>
          </ScrollView>

          <ChatComposer
            draft={chat.draft}
            onDraftChange={chat.setDraft}
            onSend={chat.send}
            onStop={chat.stop}
            isSending={chat.isSending}
            contextItems={chat.contextItems}
            onAddContextItems={chat.addContextItems}
            onRemoveContextItem={chat.removeContextItem}
          />
        </KeyboardAvoidingView>
      </ChatErrorBoundary>

      <ChatSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        activeId={chat.conversationId}
        groups={chat.groupedConversations}
        onNew={chat.newConversation}
        onOpen={chat.openConversation}
        onPin={chat.togglePinned}
        onShare={(conversation) => void shareConversation(conversation)}
        onDelete={chat.deleteConversation}
        onSettings={() => {
          setSidebarOpen(false)
          router.push('/settings' as never)
        }}
      />
    </SafeAreaView>
  )
}

function EmptyChat({ onPrompt }: { onPrompt: (prompt: string) => void }) {
  return (
    <YStack flex={1} justify="center" pb="$8" gap="$6">
      <YStack items="center" gap="$2">
        <LogoIcon size={64} />
        <Text size="xl" weight="semibold" center>
          What would you like to understand?
        </Text>
        <Text size="sm" tone="secondary" center>
          Ask freely, or ground the conversation in up to five reports.
        </Text>
      </YStack>
      <YStack gap="$2">
        {STARTER_PROMPTS.slice(0, 4).map((prompt, index) => (
          <Button
            key={prompt.label}
            variant="ghost"
            minH={48}
            px="$3"
            justify="flex-start"
            borderWidth={1}
            borderColor="$outlineVariant"
            icon={<PlusIcon size={16} />}
            onPress={() => onPrompt(prompt.prompt)}
          >
            {prompt.label}
          </Button>
        ))}
      </YStack>
    </YStack>
  )
}

function AssistantMessage({
  message,
  onRetry,
  onFeedback,
}: {
  message: ReturnType<typeof useChat>['messages'][number]
  onRetry: (kind: 'retry' | 'extend' | 'shorten') => void
  onFeedback: (feedback: 'up' | 'down') => void
}) {
  const [retryOpen, setRetryOpen] = useState(false)
  return (
    <YStack gap="$2">
      {message.content ? (
        <MarkdownText streaming={message.status === 'streaming'}>
          {message.content}
        </MarkdownText>
      ) : (
        <Text tone="secondary">Thinking…</Text>
      )}
      {message.status !== 'streaming' && message.content ? (
        <XStack gap="$1" flexWrap="wrap">
          <ActionButton
            label="Copy"
            onPress={() => void Clipboard.setStringAsync(message.content)}
          />
          <Popover
            open={retryOpen}
            onOpenChange={setRetryOpen}
            content={
              <YStack width={140}>
                {(['retry', 'extend', 'shorten'] as const).map((kind) => (
                  <MenuButton
                    key={kind}
                    label={`${kind.charAt(0).toUpperCase()}${kind.slice(1)}`}
                    onPress={() => {
                      onRetry(kind)
                      setRetryOpen(false)
                    }}
                  />
                ))}
              </YStack>
            }
          >
            <Button size="$2" variant="ghost">
              Retry
            </Button>
          </Popover>
          <ActionButton
            label="Share"
            onPress={() => void Share.share({ message: message.content })}
          />
          <ActionButton
            label={message.feedback === 'up' ? 'Liked' : 'Helpful'}
            selected={message.feedback === 'up'}
            onPress={() => onFeedback('up')}
          />
          <ActionButton
            label={message.feedback === 'down' ? 'Disliked' : 'Not helpful'}
            selected={message.feedback === 'down'}
            onPress={() => onFeedback('down')}
          />
        </XStack>
      ) : null}
    </YStack>
  )
}

function ActionButton({
  label,
  onPress,
  selected = false,
}: {
  label: string
  onPress: () => void
  selected?: boolean
}) {
  return (
    <Button
      size="$2"
      variant="ghost"
      bg={selected ? '$surface1' : '$transparent'}
      onPress={onPress}
    >
      {label}
    </Button>
  )
}

function MenuButton({
  label,
  onPress,
  icon,
  destructive = false,
  disabled = false,
}: {
  label: string
  onPress: () => void
  icon?: 'share' | 'delete'
  destructive?: boolean
  disabled?: boolean
}) {
  const theme = useTheme()
  const tone = disabled ? 'secondary' : destructive ? 'destructive' : 'neutral'
  const iconColor = disabled
    ? (theme.contentSecondary?.val as string)
    : destructive
      ? (theme.destructive?.val as string)
      : (theme.content?.val as string)
  return (
    <Button
      unstyled
      height={56}
      width="100%"
      borderWidth={0}
      rounded={0}
      bg="$transparent"
      opacity={disabled ? 0.4 : 1}
      disabled={disabled}
      hoverStyle={{ bg: '$surface1' }}
      pressStyle={{ bg: '$surface2', scale: 0.99 }}
      focusVisibleStyle={{
        outlineWidth: 0,
        bg: '$surface2',
      }}
      onPress={onPress}
    >
      <XStack width="100%" height="100%" items="center">
        <XStack width={52} height="100%" items="center" justify="center">
          {icon === 'share' ? <ShareIcon color={iconColor} /> : null}
          {icon === 'delete' ? <TrashIcon color={iconColor} /> : null}
        </XStack>
        <XStack flex={1} height="100%" items="center">
          <Text size="sm" weight="medium" tone={tone} lineHeight={20}>
            {label}
          </Text>
        </XStack>
      </XStack>
    </Button>
  )
}
