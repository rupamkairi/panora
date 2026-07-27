import { AlertDialog as TamaguiAlertDialog, SizableText, XStack, YStack } from 'tamagui'

import { Button } from '../actions/Button'
import { colors } from '../colors'

export type AlertDialogProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description: string
  variant?: 'confirm' | 'destructive' | 'acknowledge'
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
  destructive?: boolean
}

export const AlertDialog = ({
  open,
  defaultOpen,
  onOpenChange,
  title,
  description,
  variant = 'confirm',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
}: AlertDialogProps) => (
  <TamaguiAlertDialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    <TamaguiAlertDialog.Portal>
      <TamaguiAlertDialog.Overlay opacity={0.5} />
      <TamaguiAlertDialog.Content
        width="90%"
        maxW={420}
        bg={colors.surface}
        borderWidth={1}
        borderColor={colors.outlineVariant}
        rounded="$3"
        p="$4"
        gap="$3"
      >
        <YStack gap="$1">
          <TamaguiAlertDialog.Title fontFamily="$heading" fontSize={18} fontWeight="600">
            {title}
          </TamaguiAlertDialog.Title>
          <TamaguiAlertDialog.Description
            fontFamily="$body"
            fontSize={13}
            color={colors.contentSecondary}
          >
            {description}
          </TamaguiAlertDialog.Description>
        </YStack>
        <XStack gap="$3" justify="flex-end">
          {variant !== 'acknowledge' ? (
            <TamaguiAlertDialog.Cancel asChild>
              <Button variant="secondary" onPress={onCancel}>
                {cancelLabel}
              </Button>
            </TamaguiAlertDialog.Cancel>
          ) : null}
          <TamaguiAlertDialog.Action asChild>
            <Button
              variant={
                destructive || variant === 'destructive' ? 'destructive' : 'primary'
              }
              onPress={onConfirm}
            >
              {variant === 'acknowledge' ? 'OK' : confirmLabel}
            </Button>
          </TamaguiAlertDialog.Action>
        </XStack>
      </TamaguiAlertDialog.Content>
    </TamaguiAlertDialog.Portal>
  </TamaguiAlertDialog>
)
