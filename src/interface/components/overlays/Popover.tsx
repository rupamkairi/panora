import { Adapt, Popover, Sheet, styled, type PopoverProps } from 'tamagui'
import { useCallback, useState, type ReactElement, type ReactNode } from 'react'

import { colors } from '../colors'

const PopoverContent = styled(Popover.Content, {
  bg: colors.surface,
  borderWidth: 1,
  borderColor: colors.outlineVariant,
  rounded: '$2',
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 10 },
  shadowRadius: 25,
  shadowOpacity: 0.05,
  maxW: 320,
  p: '$4',
  variants: {
    menu: {
      true: {
        p: 0,
        rounded: '$4',
        minW: 196,
        borderWidth: 0,
        overflow: 'hidden',
        shadowOpacity: 0.12,
        shadowRadius: 20,
      },
    },
  } as const,
})

export type PopoverComponentProps = {
  children: ReactElement
  content: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  placement?: PopoverProps['placement']
  adaptToSheet?: boolean
  menu?: boolean
}

export const PopoverComponent = ({
  children,
  content,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-start',
  adaptToSheet = true,
  menu = false,
}: PopoverComponentProps) => {
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

  return (
    <Popover open={isOpen} onOpenChange={setOpen} placement={placement} offset={8}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      {adaptToSheet ? (
        <Adapt when="max-md" platform="touch">
          <Sheet modal dismissOnSnapToBottom snapPoints={[50]}>
            <Sheet.Overlay />
            <Sheet.Frame p="$4" bg={colors.surface}>
              <Sheet.Handle />
              <Adapt.Contents />
            </Sheet.Frame>
          </Sheet>
        </Adapt>
      ) : null}
      <PopoverContent menu={menu}>{content}</PopoverContent>
    </Popover>
  )
}
