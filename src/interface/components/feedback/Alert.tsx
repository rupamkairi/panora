import { SizableText, XStack, YStack } from 'tamagui'
import { colors } from '../colors'
import { Button } from '../actions/Button'

export const Alert = ({
  title,
  description,
  tone = 'info',
  actions,
  onClose,
}: {
  title?: string
  description?: string
  tone?: 'info' | 'success' | 'warning' | 'destructive'
  actions?: {
    label: string
    onPress: () => void
    variant?: 'primary' | 'secondary' | 'ghost'
  }[]
  onClose?: () => void
}) => {
  const bgColor = tone === 'destructive' ? colors.destructiveContainer : colors.surface1
  const bdrColor =
    tone === 'info'
      ? colors.accent
      : tone === 'success'
        ? colors.success
        : tone === 'warning'
          ? colors.warning
          : colors.destructive
  return (
    <XStack
      p="$3"
      rounded="$2"
      borderWidth={1}
      gap="$3"
      bg={bgColor as any}
      borderColor={bdrColor as any}
    >
      <YStack flex={1} gap="$1">
        {title && (
          <SizableText
            fontFamily="$body"
            fontSize={14}
            fontWeight="600"
            color={colors.content}
          >
            {title}
          </SizableText>
        )}
        {description && (
          <SizableText fontFamily="$body" fontSize={13} color={colors.contentSecondary}>
            {description}
          </SizableText>
        )}
        <XStack gap="$2" mt="$2">
          {actions?.map((a) => (
            <Button
              key={a.label}
              uiSize="sm"
              variant={a.variant || 'secondary'}
              onPress={a.onPress}
            >
              {a.label}
            </Button>
          ))}
          {onClose && (
            <Button uiSize="sm" variant="ghost" onPress={onClose}>
              Dismiss
            </Button>
          )}
        </XStack>
      </YStack>
    </XStack>
  )
}
