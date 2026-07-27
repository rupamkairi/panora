import { Input as TamaguiInput, styled, XStack } from 'tamagui'
import { colors } from '../colors'
import type { ReactNode } from 'react'

const StyledSearchInput = styled(TamaguiInput, {
  height: 48,
  fontSize: 16,
  fontFamily: '$body',
  color: colors.content,
  bg: colors.surface,
  borderColor: colors.outlineVariant,
  borderWidth: 1,
  rounded: '$3',
  px: '$4',
  placeholderTextColor: colors.outline as any,
  hoverStyle: { borderColor: colors.outline },
  focusStyle: {
    borderColor: colors.accent,
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: colors.accent,
    outlineOffset: 2,
  },
})

export const SearchInput = ({
  icon,
  ...props
}: React.ComponentProps<typeof StyledSearchInput> & { icon?: ReactNode }) => {
  if (!icon) return <StyledSearchInput {...props} />
  return (
    <XStack position="relative" items="center">
      <XStack position="absolute" l={8} z={1} pointerEvents="none">
        {icon}
      </XStack>
      <StyledSearchInput pl="$8" {...props} />
    </XStack>
  )
}
