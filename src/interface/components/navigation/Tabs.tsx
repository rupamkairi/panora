import { SizableText, XStack, YStack } from 'tamagui'
import { useState, type ReactNode } from 'react'
import { colors } from '../colors'

export const Tabs = <T extends string>({
  tabs,
  value: controlledValue,
  defaultValue,
  onChange,
  children,
}: {
  tabs: {
    value: T
    label: string
    icon?: ReactNode
    disabled?: boolean
    badge?: string | number
  }[]
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  children?: (props: { activeTab: T }) => ReactNode
}) => {
  const [iv, setIv] = useState<T | undefined>(defaultValue)
  const activeTab = (controlledValue !== undefined ? controlledValue : iv) as T

  return (
    <YStack flex={1}>
      <XStack gap="$1" borderBottomWidth={1} borderBottomColor={colors.outlineVariant}>
        {tabs.map((tab) => {
          const active = activeTab === tab.value
          return (
            <XStack
              key={String(tab.value)}
              px="$4"
              py="$3"
              height={38}
              items="center"
              gap="$2"
              opacity={tab.disabled ? 0.5 : 1}
              cursor="pointer"
              onPress={() => {
                if (!tab.disabled) {
                  if (controlledValue === undefined) setIv(tab.value)
                  onChange?.(tab.value)
                }
              }}
              borderBottomWidth={active ? 2 : 0}
              borderBottomColor={active ? colors.accent : (colors.transparent as any)}
              hoverStyle={{ bg: colors.surface1 }}
            >
              {tab.icon}
              <SizableText
                fontFamily="$body"
                fontSize={14}
                fontWeight={active ? '600' : '400'}
                color={active ? colors.accent : colors.contentSecondary}
              >
                {tab.label}
              </SizableText>
              {tab.badge && (
                <SizableText
                  fontSize={11}
                  fontWeight="600"
                  color={colors.white}
                  bg={colors.accent}
                  px="$2"
                  py={2}
                  rounded="$10"
                >
                  {tab.badge}
                </SizableText>
              )}
            </XStack>
          )
        })}
      </XStack>
      {children && (
        <YStack flex={1} pt="$4">
          {children({ activeTab })}
        </YStack>
      )}
    </YStack>
  )
}
