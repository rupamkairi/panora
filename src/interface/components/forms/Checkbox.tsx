import { Checkbox as TamaguiCheckbox, Label, XStack } from 'tamagui'
import { useState, type ReactNode } from 'react'
import { colors } from '../colors'

export const Checkbox = ({
  label,
  id,
  defaultChecked,
  checked: controlledChecked,
  onCheckedChange,
  disabled,
}: {
  label?: ReactNode
  id?: string
  defaultChecked?: boolean
  checked?: boolean
  onCheckedChange?: (c: boolean) => void
  disabled?: boolean
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false)
  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : internalChecked
  return (
    <XStack gap="$3" items="center">
      <TamaguiCheckbox
        id={id}
        checked={!!checked}
        width={20}
        height={20}
        hitSlop={12}
        rounded="$1"
        onCheckedChange={(value) => {
          const b = value === true
          if (!isControlled) setInternalChecked(b)
          onCheckedChange?.(b)
        }}
        disabled={disabled}
      >
        <TamaguiCheckbox.Indicator width={14} height={14} bg={colors.accent}>
          <XStack>{checked === true ? '✓' : ''}</XStack>
        </TamaguiCheckbox.Indicator>
      </TamaguiCheckbox>
      {label && (
        <Label htmlFor={id} color={disabled ? colors.outline : colors.content}>
          {label}
        </Label>
      )}
    </XStack>
  )
}
