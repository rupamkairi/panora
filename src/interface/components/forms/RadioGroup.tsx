import { RadioGroup as TamaguiRadioGroup, Label, XStack, YStack } from 'tamagui'
import { useState, type ReactNode } from 'react'
import { colors } from '../colors'

export type RadioOption<T = string> = { value: T; label: ReactNode; disabled?: boolean }

export const RadioGroup = <T extends string>({
  options,
  value: cv,
  defaultValue,
  onValueChange,
  name,
  orientation = 'vertical',
}: {
  options: RadioOption<T>[]
  value?: T
  defaultValue?: T
  onValueChange?: (value: T) => void
  name?: string
  orientation?: 'vertical' | 'horizontal'
}) => {
  const [iv, setIv] = useState<T | undefined>(defaultValue)
  const c = cv !== undefined
  const current = (c ? cv : iv) as string | undefined
  const Wrapper = orientation === 'vertical' ? YStack : XStack
  return (
    <TamaguiRadioGroup
      value={current}
      onValueChange={(val) => {
        const t = val as T
        if (!c) setIv(t)
        onValueChange?.(t)
      }}
      name={name}
    >
      <Wrapper gap="$3">
        {options.map((opt) => (
          <XStack key={String(opt.value)} gap="$3" items="center">
            <TamaguiRadioGroup.Item
              value={opt.value}
              disabled={opt.disabled}
              width={20}
              height={20}
              hitSlop={12}
              rounded="$10"
              borderColor={colors.outline}
              borderWidth={1.5}
            >
              <TamaguiRadioGroup.Indicator
                width={10}
                height={10}
                rounded="$10"
                bg={colors.accent}
              />
            </TamaguiRadioGroup.Item>
            <Label color={opt.disabled ? colors.outline : colors.content}>
              {opt.label}
            </Label>
          </XStack>
        ))}
      </Wrapper>
    </TamaguiRadioGroup>
  )
}
