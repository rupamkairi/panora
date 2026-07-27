import { Dialog, ScrollView, XStack, YStack, useTheme } from 'tamagui'
import { useState } from 'react'

import type { Conversation, ConversationGroup } from '../types'
import { LogoIcon } from '~/interface/app/LogoIcon'
import { Button, IconButton, Text } from '~/interface/components'
import { CloseIcon, MoreIcon, PlusIcon } from '~/interface/icons/ChatIcons'

type ChatSidebarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeId: string
  groups: Record<ConversationGroup, Conversation[]>
  onNew: () => void
  onOpen: (id: string) => void
  onPin: (id: string) => void
  onShare: (conversation: Conversation) => void
  onDelete: (id: string) => void
  onSettings: () => void
}

const groupOrder: ConversationGroup[] = ['Pinned', 'Today', 'Previous 7 Days', 'Older']

export function ChatSidebar({
  open,
  onOpenChange,
  activeId,
  groups,
  onNew,
  onOpen,
  onPin,
  onShare,
  onDelete,
  onSettings,
}: ChatSidebarProps) {
  const theme = useTheme()
  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          bg="$primary"
          opacity={0.32}
          transition="quick"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          position="absolute"
          l={0}
          t={0}
          b={0}
          width="86%"
          maxW={350}
          height="100%"
          p={0}
          gap={0}
          bg="$surface"
          borderWidth={0}
          borderRightWidth={1}
          borderRightColor="$outlineVariant"
          rounded={0}
          transition="quick"
          animateOnly={['opacity', 'transform']}
          x={0}
          opacity={1}
          enterStyle={{ x: -340, opacity: 0.8 }}
          exitStyle={{ x: -340, opacity: 0.8 }}
        >
          <XStack px="$4" pt="$5" pb="$3" items="center" justify="space-between">
            <XStack items="center" gap="$2">
              <LogoIcon size={42} />
              <YStack>
                <Dialog.Title fontFamily="$brand" fontSize={21} fontWeight="600">
                  Panora
                </Dialog.Title>
                <Dialog.Description
                  fontFamily="$body"
                  fontSize={13}
                  color="$contentSecondary"
                >
                  Your report-grounded conversations
                </Dialog.Description>
              </YStack>
            </XStack>
            <IconButton aria-label="Close sidebar" onPress={() => onOpenChange(false)}>
              <CloseIcon color={theme.content?.val as string} />
            </IconButton>
          </XStack>
          <YStack px="$3" pb="$3">
            <Button
              variant="primary"
              justify="flex-start"
              icon={<PlusIcon color={theme.contentInverse?.val as string} />}
              onPress={() => {
                onNew()
                onOpenChange(false)
              }}
            >
              New chat
            </Button>
          </YStack>
          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            <YStack px="$2" pb="$6" gap="$4">
              {groupOrder.map((group) =>
                groups[group].length ? (
                  <YStack key={group} gap="$1">
                    <Text size="xs" weight="semibold" tone="secondary" px="$2" py="$1">
                      {group.toUpperCase()}
                    </Text>
                    {groups[group].map((conversation) => (
                      <ConversationRow
                        key={conversation.id}
                        conversation={conversation}
                        active={conversation.id === activeId}
                        onOpen={() => {
                          onOpen(conversation.id)
                          onOpenChange(false)
                        }}
                        onPin={() => onPin(conversation.id)}
                        onShare={() => onShare(conversation)}
                        onDelete={() => onDelete(conversation.id)}
                      />
                    ))}
                  </YStack>
                ) : null,
              )}
              {!groupOrder.some((group) => groups[group].length) ? (
                <YStack px="$3" py="$6" gap="$1">
                  <Text weight="semibold">No conversations yet</Text>
                  <Text size="sm" tone="secondary">
                    Your chats will appear here after your first question.
                  </Text>
                </YStack>
              ) : null}
            </YStack>
          </ScrollView>
          <YStack borderTopWidth={1} borderTopColor="$outlineVariant" px="$3" py="$3">
            <Button variant="ghost" justify="flex-start" onPress={onSettings}>
              Settings
            </Button>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

function ConversationRow({
  conversation,
  active,
  onOpen,
  onPin,
  onShare,
  onDelete,
}: {
  conversation: Conversation
  active: boolean
  onOpen: () => void
  onPin: () => void
  onShare: () => void
  onDelete: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <YStack>
      <XStack
        minH={46}
        items="center"
        pl="$3"
        pr="$1"
        rounded="$3"
        bg={active ? '$surface1' : '$transparent'}
        hoverStyle={{ bg: '$surface1' }}
        pressStyle={{ bg: '$surface2' }}
      >
        <YStack flex={1} py="$2" onPress={onOpen}>
          <Text size="sm" weight={active ? 'semibold' : 'medium'} numberOfLines={1}>
            {conversation.title}
          </Text>
        </YStack>
        <IconButton
          aria-label={`Actions for ${conversation.title}`}
          uiSize="sm"
          onPress={() => setMenuOpen((value) => !value)}
        >
          <MoreIcon />
        </IconButton>
      </XStack>
      {menuOpen ? (
        <XStack px="$3" pb="$2" gap="$1" flexWrap="wrap">
          <Button size="$2" variant="ghost" onPress={onPin}>
            {conversation.pinned ? 'Unpin' : 'Pin'}
          </Button>
          <Button size="$2" variant="ghost" onPress={onShare}>
            Share
          </Button>
          <Button size="$2" variant="ghost" onPress={onDelete}>
            <Text size="sm" tone="destructive">
              Delete
            </Text>
          </Button>
        </XStack>
      ) : null}
    </YStack>
  )
}
