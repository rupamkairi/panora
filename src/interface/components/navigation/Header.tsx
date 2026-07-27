import { styled, XStack, YStack } from 'tamagui'
import type { ReactNode } from 'react'
import { colors } from '../colors'
import { Heading } from '../typography/Heading'
import { Text } from '../typography/Text'

const HeaderRoot = styled(XStack, {
  height: 52,
  px: '$4',
  items: 'center',
  justify: 'space-between',
  bg: colors.surface,
  borderBottomWidth: 1,
  borderBottomColor: colors.outlineVariant,
  gap: '$3',
})

export const Header = ({
  title,
  subtitle,
  left,
  right,
}: {
  title?: string
  subtitle?: string
  left?: ReactNode
  right?: ReactNode
}) => (
  <HeaderRoot role="banner">
    <XStack items="center" gap="$3" flex={1}>
      {left}
      {title && (
        <YStack gap="$0.5">
          <Heading level="h6">{title}</Heading>
          {subtitle && (
            <Text uiSize="xs" tone="secondary">
              {subtitle}
            </Text>
          )}
        </YStack>
      )}
    </XStack>
    <XStack items="center" gap="$2">
      {right}
    </XStack>
  </HeaderRoot>
)
