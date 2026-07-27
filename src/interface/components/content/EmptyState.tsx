import { SizableText, YStack } from 'tamagui'
import { colors } from '../colors'
import { Button } from '../actions/Button'

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}) => (
  <YStack flex={1} items="center" py="$8" px="$4" gap="$4">
    <SizableText
      fontFamily="$heading"
      fontSize={18}
      fontWeight="600"
      color={colors.content}
    >
      {title}
    </SizableText>
    {description && (
      <SizableText fontFamily="$body" fontSize={13} color={colors.contentSecondary}>
        {description}
      </SizableText>
    )}
    {actionLabel && onAction && (
      <Button variant="secondary" onPress={onAction}>
        {actionLabel}
      </Button>
    )}
  </YStack>
)
