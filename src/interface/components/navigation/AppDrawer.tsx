import { Dialog, ScrollView, XStack, YStack } from 'tamagui'
import { type ReactNode } from 'react'

import { Badge } from '../content/Badge'
import { Text } from '../typography/Text'
import { colors } from '../colors'

import type { NavigationItem } from '../types'

export type AppDrawerProps = {
  navigation: NavigationItem[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  activeId?: string | null
  header?: ReactNode
  footer?: ReactNode
  title?: string
  description?: string
}

export const AppDrawer = ({
  navigation,
  open,
  onOpenChange,
  activeId,
  header,
  footer,
  title = 'Panora',
  description = 'Conversations and tools',
}: AppDrawerProps) => (
  <Dialog modal open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay
        bg={colors.inverseSurface}
        opacity={0.22}
        transition="quick"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Dialog.Content
        position="absolute"
        l={0}
        t={0}
        b={0}
        width="84%"
        maxW={320}
        height="100%"
        p={0}
        gap={0}
        bg={colors.surface}
        borderWidth={0}
        borderRightWidth={1}
        borderRightColor={colors.outlineVariant}
        rounded={0}
        transition="quick"
        enterStyle={{ x: -320, opacity: 0.7 }}
        exitStyle={{ x: -320, opacity: 0.7 }}
      >
        <YStack px="$4" pt="$4" pb="$3" gap="$1">
          <Dialog.Title fontFamily="$heading" fontSize={18} fontWeight="600">
            {title}
          </Dialog.Title>
          <Dialog.Description
            fontFamily="$body"
            fontSize={13}
            color={colors.contentSecondary}
          >
            {description}
          </Dialog.Description>
        </YStack>
        {header ? (
          <YStack px="$3" pb="$3">
            {header}
          </YStack>
        ) : null}
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack px="$2" gap="$1">
            {navigation.map((item) => (
              <XStack
                key={item.id}
                role="button"
                tabIndex={0}
                aria-disabled={item.disabled}
                aria-current={activeId === item.id ? 'page' : undefined}
                minH={40}
                px="$3"
                items="center"
                gap="$3"
                rounded="$2"
                opacity={item.disabled ? 0.45 : 1}
                bg={activeId === item.id ? colors.surface2 : colors.transparent}
                hoverStyle={item.disabled ? undefined : { bg: colors.surface1 }}
                pressStyle={item.disabled ? undefined : { bg: colors.surface2 }}
                cursor={item.disabled ? 'default' : 'pointer'}
                onPress={() => {
                  if (item.disabled) return
                  item.onPress?.()
                  onOpenChange?.(false)
                }}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (item.disabled) return
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    item.onPress?.()
                    onOpenChange?.(false)
                  }
                }}
              >
                {item.icon ? (
                  <XStack width={20} height={20} items="center" justify="center">
                    {item.icon}
                  </XStack>
                ) : null}
                <Text
                  flex={1}
                  uiSize="sm"
                  numberOfLines={1}
                  weight={activeId === item.id ? 'semibold' : 'medium'}
                >
                  {item.label}
                </Text>
                {item.badge ? <Badge>{item.badge}</Badge> : null}
              </XStack>
            ))}
          </YStack>
        </ScrollView>
        {footer ? (
          <YStack borderTopWidth={1} borderTopColor={colors.outlineVariant} px="$4">
            {footer}
          </YStack>
        ) : null}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog>
)
