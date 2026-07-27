import { Dialog, VisuallyHidden, YStack } from 'tamagui'
import { type ReactNode } from 'react'

export type FloatingMenuProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  children: ReactNode
  top?: number
  right?: number
  bottom?: number
  left?: number
  width?: number
}

/**
 * A touch-safe anchored menu. Unlike a Popover it does not need native anchor
 * measurement, so the exact same compact dropdown works in Android and web.
 */
export function FloatingMenu({
  open,
  onOpenChange,
  title,
  description,
  children,
  top,
  right,
  bottom,
  left,
  width = 220,
}: FloatingMenuProps) {
  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          fullscreen
          bg="$transparent"
          opacity={1}
          pointerEvents="auto"
          aria-label={`Dismiss ${title}`}
          onPressIn={() => onOpenChange(false)}
        />
        <Dialog.Content
          position="absolute"
          t={top}
          r={right}
          b={bottom}
          l={left}
          width={width}
          maxW="calc(100% - 32px)"
          p="$1"
          gap={0}
          bg="$surface"
          borderWidth={0}
          rounded="$4"
          elevation="$3"
          shadowColor="$primary"
          shadowOpacity={0.12}
          shadowRadius={18}
          shadowOffset={{ width: 0, height: 8 }}
        >
          <VisuallyHidden>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description>{description}</Dialog.Description>
          </VisuallyHidden>
          <YStack>{children}</YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
