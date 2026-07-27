import { Label, Switch as TamaguiSwitch, XStack } from 'tamagui'
import { useState, type ReactNode } from 'react'
import { colors } from '../colors'

export const Switch = ({
  label,
  id,
  defaultChecked,
  checked: cc,
  onCheckedChange,
  disabled,
}: {
  label?: ReactNode
  id?: string
  defaultChecked?: boolean
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}) => {
  const [ic, setIc] = useState(defaultChecked ?? false)
  const c = cc !== undefined
  const isChecked = c ? cc : ic
  return (
    <XStack gap="$3" items="center">
      <TamaguiSwitch
        id={id}
        checked={isChecked}
        onCheckedChange={(val) => {
          if (!c) setIc(!!val)
          onCheckedChange?.(!!val)
        }}
        disabled={disabled}
        width={42}
        height={24}
        hitSlop={10}
        rounded="$10"
      >
        <TamaguiSwitch.Thumb width={18} height={18} rounded="$10" bg={colors.white} />
      </TamaguiSwitch>
      {label && (
        <Label htmlFor={id} color={disabled ? colors.outline : colors.content}>
          {label}
        </Label>
      )}
    </XStack>
  )
}
