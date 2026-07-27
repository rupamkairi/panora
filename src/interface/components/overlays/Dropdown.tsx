import { Adapt, Popover, ScrollView, Sheet, SizableText, XStack, YStack } from 'tamagui'
import { useCallback, useState, type ReactElement } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '../actions/Button'
import { colors } from '../colors'

import type { DropdownItem } from '../types'

export type DropdownProps<T extends string> = {
  items: DropdownItem<T>[]
  value?: T
  defaultValue?: T
  onValueChange?: (value: T) => void
  onSelect?: (item: DropdownItem<T>) => void
  trigger?: ReactElement
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  label: string
}

export const Dropdown = <T extends string>({
  items,
  value: controlledValue,
  defaultValue,
  onValueChange,
  onSelect,
  trigger,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  label,
}: DropdownProps<T>) => {
  const { bottom } = useSafeAreaInsets()
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue)
  const isControlled = controlledOpen !== undefined
  const isOpen = controlledOpen ?? internalOpen
  const currentValue = controlledValue ?? internalValue
  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )
  const selectItem = (item: DropdownItem<T>) => {
    if (item.disabled) return
    if (controlledValue === undefined) setInternalValue(item.value)
    onValueChange?.(item.value)
    onSelect?.(item)
    setOpen(false)
  }

  const menu = (
    <ScrollView maxH={360}>
      {items.map((item) => (
        <XStack
          key={item.value}
          role="menuitem"
          aria-disabled={item.disabled}
          minH={40}
          items="center"
          gap="$3"
          px="$4"
          py="$2"
          opacity={item.disabled ? 0.5 : 1}
          bg={currentValue === item.value ? colors.surface1 : colors.transparent}
          hoverStyle={item.disabled ? undefined : { bg: colors.surface1 }}
          onPress={() => selectItem(item)}
        >
          {item.icon}
          <YStack flex={1}>
            <SizableText
              fontWeight="500"
              color={item.destructive ? colors.destructive : colors.content}
            >
              {item.label}
            </SizableText>
            {item.description ? (
              <SizableText fontSize={12} color={colors.contentSecondary}>
                {item.description}
              </SizableText>
            ) : null}
          </YStack>
          {item.shortcut ? (
            <SizableText fontSize={11} color={colors.contentSecondary}>
              {item.shortcut}
            </SizableText>
          ) : null}
          {currentValue === item.value ? (
            <SizableText color={colors.accent}>✓</SizableText>
          ) : null}
        </XStack>
      ))}
    </ScrollView>
  )

  return (
    <Popover open={isOpen} onOpenChange={setOpen} placement="bottom-start" offset={4}>
      <Popover.Trigger asChild>
        {trigger ?? <Button variant="secondary">{label}</Button>}
      </Popover.Trigger>
      <Adapt when="max-md" platform="touch">
        <Sheet modal dismissOnSnapToBottom snapPoints={[50, 85]}>
          <Sheet.Overlay />
          <Sheet.Frame bg={colors.surface} pb={bottom + 16}>
            <Sheet.Handle />
            <YStack px="$4" pt="$3">
              <SizableText fontFamily="$heading" fontSize={18} fontWeight="600">
                {label}
              </SizableText>
            </YStack>
            <Adapt.Contents />
          </Sheet.Frame>
        </Sheet>
      </Adapt>
      <Popover.Content
        role="menu"
        minW={200}
        bg={colors.surface}
        borderWidth={1}
        borderColor={colors.outlineVariant}
        rounded="$2"
        p={0}
      >
        {menu}
      </Popover.Content>
    </Popover>
  )
}
