import { Input as TamaguiInput, styled } from 'tamagui'
import { colors } from '../colors'

export const Input = styled(TamaguiInput, {
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
