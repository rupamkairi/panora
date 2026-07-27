import { XStack, YStack, styled } from 'tamagui'
import { type ReactNode } from 'react'
import { colors } from '../colors'
import { Badge } from '../content/Badge'
import { Text } from '../typography/Text'
import type { NavigationItem } from '../types'

const SidebarRoot = styled(YStack, {
  bg: colors.surface,
  borderRightWidth: 1,
  borderRightColor: colors.outlineVariant,
  height: '100%' as any,
})

export const AppSidebar = ({
  navigation,
  collapsed,
  activeId,
  header,
  footer,
}: {
  navigation: NavigationItem[]
  collapsed?: boolean
  activeId?: string | null
  header?: ReactNode
  footer?: ReactNode
}) => {
  const w = collapsed ? 56 : (248 as any)
  return (
    <SidebarRoot width={w} role="navigation" aria-label="Primary navigation">
      {header && (
        <XStack
          height={52}
          px="$3"
          items="center"
          borderBottomWidth={1}
          borderBottomColor={colors.outlineVariant}
        >
          {header}
        </XStack>
      )}
      <YStack flex={1}>
        {navigation.map((item) => (
          <XStack
            key={item.id}
            role="button"
            tabIndex={0}
            aria-disabled={item.disabled}
            aria-current={activeId === item.id ? 'page' : undefined}
            px="$3"
            py="$2"
            minH={40}
            items="center"
            gap="$3"
            rounded="$2"
            opacity={item.disabled ? 0.45 : 1}
            bg={activeId === item.id ? colors.surface2 : colors.transparent}
            hoverStyle={item.disabled ? undefined : { bg: colors.surface1 }}
            pressStyle={item.disabled ? undefined : { bg: colors.surface2 }}
            cursor={item.disabled ? 'default' : 'pointer'}
            onPress={() => {
              if (!item.disabled) item.onPress?.()
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (item.disabled) return
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                item.onPress?.()
              }
            }}
          >
            {item.icon && (
              <XStack width={20} height={20} items="center" justify="center">
                {item.icon}
              </XStack>
            )}
            {!collapsed && (
              <>
                <Text
                  flex={1}
                  uiSize="sm"
                  numberOfLines={1}
                  weight={activeId === item.id ? 'semibold' : 'medium'}
                >
                  {item.label}
                </Text>
                {item.badge && <Badge>{item.badge}</Badge>}
              </>
            )}
          </XStack>
        ))}
      </YStack>
      {footer && (
        <YStack borderTopWidth={1} borderTopColor={colors.outlineVariant} px="$3" py="$3">
          {footer}
        </YStack>
      )}
    </SidebarRoot>
  )
}
