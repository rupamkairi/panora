import { Sheet, SizableText, VisuallyHidden, YStack, type SheetProps } from 'tamagui'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { colors } from '../colors'

type AppSheetContextValue = { open: boolean; setOpen: (open: boolean) => void }
const AppSheetContext = createContext<AppSheetContextValue | null>(null)

export const useAppSheet = () => {
  const context = useContext(AppSheetContext)
  if (!context)
    throw new Error('AppSheet compound components must be used inside AppSheet.')
  return context
}

export type AppSheetProps = {
  children?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  snapPoints?: SheetProps['snapPoints']
  modal?: boolean
  showHandle?: boolean
  title: string
  description: string
  trigger?: ReactNode
  footer?: ReactNode
}

const AppSheetRoot = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  snapPoints = [85],
  modal = true,
  showHandle = true,
  title,
  description,
  trigger,
  footer,
}: AppSheetProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const isOpen = controlledOpen ?? internalOpen
  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )
  const contextValue = useMemo(() => ({ open: isOpen, setOpen }), [isOpen, setOpen])

  return (
    <AppSheetContext.Provider value={contextValue}>
      {trigger ? (
        <YStack role="button" onPress={() => setOpen(true)}>
          {trigger}
        </YStack>
      ) : null}
      <Sheet
        open={isOpen}
        onOpenChange={setOpen}
        modal={modal}
        snapPoints={snapPoints}
        dismissOnOverlayPress
        dismissOnSnapToBottom
      >
        <Sheet.Overlay
          bg={colors.primary}
          opacity={0.18}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame bg={colors.surface} rounded="$6">
          <VisuallyHidden>
            <SizableText>{title}</SizableText>
            <SizableText>{description}</SizableText>
          </VisuallyHidden>
          {showHandle ? (
            <YStack width="100%" height={28} items="center" justify="center">
              <YStack
                width={38}
                height={4}
                rounded="$10"
                bg={colors.outline}
                opacity={0.72}
              />
            </YStack>
          ) : null}
          <YStack px="$4" pt="$3" gap="$1">
            <SizableText fontFamily="$heading" fontSize={18} fontWeight="600">
              {title}
            </SizableText>
            <SizableText fontSize={13} color={colors.contentSecondary}>
              {description}
            </SizableText>
          </YStack>
          <Sheet.ScrollView flex={1}>{children}</Sheet.ScrollView>
          {footer ? (
            <YStack px="$4" py="$3">
              {footer}
            </YStack>
          ) : null}
        </Sheet.Frame>
      </Sheet>
    </AppSheetContext.Provider>
  )
}

const Trigger = ({ children }: { children: ReactNode }) => {
  const { setOpen } = useAppSheet()
  return (
    <YStack role="button" onPress={() => setOpen(true)}>
      {children}
    </YStack>
  )
}
const Header = ({ children }: { children: ReactNode }) => (
  <YStack px="$4" pt="$4" pb="$3">
    {children}
  </YStack>
)
const Body = ({ children }: { children: ReactNode }) => (
  <YStack px="$4" py="$2" flex={1}>
    {children}
  </YStack>
)
const Footer = ({ children }: { children: ReactNode }) => (
  <YStack px="$4" py="$3">
    {children}
  </YStack>
)
const Close = ({ children }: { children: ReactNode }) => {
  const { setOpen } = useAppSheet()
  return (
    <YStack role="button" onPress={() => setOpen(false)}>
      {children}
    </YStack>
  )
}

export const AppSheet = Object.assign(AppSheetRoot, {
  Trigger,
  Header,
  Body,
  Footer,
  Close,
})
