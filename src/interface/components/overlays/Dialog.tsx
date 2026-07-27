import {
  Adapt,
  Dialog as TamaguiDialog,
  Sheet,
  SizableText,
  XStack,
  YStack,
} from 'tamagui'
import { type ReactNode } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors } from '../colors'

export type DialogTone = 'info' | 'success' | 'warning' | 'destructive' | 'neutral'

export type DialogProps = {
  children?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description: string
  trigger?: ReactNode
}

const DialogRoot = ({
  children,
  open,
  defaultOpen,
  onOpenChange,
  title,
  description,
  trigger,
}: DialogProps) => (
  <DialogWithSafeBottom
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
    title={title}
    description={description}
    trigger={trigger}
  >
    {children}
  </DialogWithSafeBottom>
)

const DialogWithSafeBottom = ({
  children,
  open,
  defaultOpen,
  onOpenChange,
  title,
  description,
  trigger,
}: DialogProps) => {
  const { bottom } = useSafeAreaInsets()
  return (
    <TamaguiDialog
      modal
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {trigger ? <TamaguiDialog.Trigger asChild>{trigger}</TamaguiDialog.Trigger> : null}
      <TamaguiDialog.Portal>
        <TamaguiDialog.Overlay
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <TamaguiDialog.Content
          width="90%"
          maxW={440}
          bg={colors.surface}
          borderWidth={1}
          borderColor={colors.outlineVariant}
          rounded="$3"
          p={0}
          gap={0}
          enterStyle={{ opacity: 0, scale: 0.96, y: -12 }}
          exitStyle={{ opacity: 0, scale: 0.98, y: 8 }}
        >
          <YStack px="$4" pt="$4" pb="$2" gap="$1">
            <TamaguiDialog.Title fontFamily="$heading" fontSize={18} fontWeight="600">
              {title}
            </TamaguiDialog.Title>
            <TamaguiDialog.Description fontSize={13} color={colors.contentSecondary}>
              {description}
            </TamaguiDialog.Description>
          </YStack>
          {children}
        </TamaguiDialog.Content>
      </TamaguiDialog.Portal>

      <Adapt when="max-md" platform="touch">
        <Sheet modal dismissOnSnapToBottom snapPoints={[85]}>
          <Sheet.Overlay />
          <Sheet.Frame bg={colors.surface} rounded="$4" pb={bottom + 16}>
            <Sheet.Handle />
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
        </Sheet>
      </Adapt>
    </TamaguiDialog>
  )
}

const Header = ({ children }: { children: ReactNode }) => (
  <YStack px="$4" pt="$3" pb="$2">
    {children}
  </YStack>
)
const Body = ({ children }: { children: ReactNode }) => (
  <YStack px="$4" py="$3">
    {children}
  </YStack>
)
const Footer = ({ children }: { children: ReactNode }) => (
  <XStack px="$4" pb="$4" pt="$2" gap="$2" justify="flex-end">
    {children}
  </XStack>
)

export const Dialog = Object.assign(DialogRoot, {
  Header,
  Body,
  Footer,
  Close: TamaguiDialog.Close,
})
