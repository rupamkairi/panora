import { Adapt, Select as TamaguiSelect, Sheet } from 'tamagui'
import { colors } from '../colors'
import type { DropdownItem } from '../types'

export const Select = <T extends string>({
  options,
  value: controlledValue,
  defaultValue,
  onValueChange,
  placeholder = 'Select...',
  disabled,
  invalid,
}: {
  options: DropdownItem<T>[]
  value?: T
  defaultValue?: T
  onValueChange?: (value: T) => void
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
}) => {
  return (
    <TamaguiSelect
      value={controlledValue}
      defaultValue={defaultValue}
      onValueChange={(val) => onValueChange?.(val as T)}
      disablePreventBodyScroll
    >
      <TamaguiSelect.Trigger
        height={40}
        disabled={disabled}
        borderColor={invalid ? colors.destructive : colors.outlineVariant}
      >
        <TamaguiSelect.Value placeholder={placeholder} />
      </TamaguiSelect.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet modal dismissOnSnapToBottom snapPointsMode="fit">
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>

      <TamaguiSelect.Content>
        <TamaguiSelect.Viewport>
          <TamaguiSelect.Group>
            {options.map((opt) => (
              <TamaguiSelect.Item
                key={String(opt.value)}
                value={opt.value}
                index={options.indexOf(opt)}
                disabled={opt.disabled}
              >
                <TamaguiSelect.ItemText
                  color={opt.destructive ? colors.destructive : colors.content}
                >
                  {opt.label}
                </TamaguiSelect.ItemText>
                {opt.description && (
                  <TamaguiSelect.ItemText color={colors.contentSecondary} size="$1">
                    {opt.description}
                  </TamaguiSelect.ItemText>
                )}
              </TamaguiSelect.Item>
            ))}
          </TamaguiSelect.Group>
        </TamaguiSelect.Viewport>
      </TamaguiSelect.Content>
    </TamaguiSelect>
  )
}
