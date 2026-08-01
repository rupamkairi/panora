import { Label, styled, Switch as TamaguiSwitch, XStack } from 'tamagui'
import { useState, type ReactNode } from 'react'
import { colors } from '../colors'

const SwitchTrack = styled(TamaguiSwitch, {
  unstyled: true,
  width: 40,
  height: 24,
  minHeight: 24,
  maxHeight: 24,
  boxSizing: 'border-box',
  p: 3,
  rounded: '$10',
  bg: colors.surface3,
  borderWidth: 0,
  borderColor: colors.transparent,
  cursor: 'pointer',
  activeStyle: {
    backgroundColor: colors.accent,
  },
  pressStyle: {
    opacity: 0.84,
  },
  focusVisibleStyle: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: colors.accent,
    outlineOffset: 2,
  },
  disabledStyle: {
    opacity: 0.42,
    cursor: 'not-allowed',
  },
})

const SwitchThumb = styled(TamaguiSwitch.Thumb, {
  unstyled: true,
  width: 18,
  height: 18,
  rounded: '$10',
  bg: colors.white,
  shadowColor: colors.content,
  shadowOpacity: 0.14,
  shadowRadius: 2,
  shadowOffset: { width: 0, height: 1 },
})

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
    <XStack minH={44} gap="$3" items="center">
      <SwitchTrack
        unstyled
        id={id}
        checked={isChecked}
        onCheckedChange={(val) => {
          if (!c) setIc(!!val)
          onCheckedChange?.(!!val)
        }}
        disabled={disabled}
        hitSlop={10}
      >
        <SwitchThumb />
      </SwitchTrack>
      {label && (
        <Label htmlFor={id} color={disabled ? colors.outline : colors.content}>
          {label}
        </Label>
      )}
    </XStack>
  )
}
