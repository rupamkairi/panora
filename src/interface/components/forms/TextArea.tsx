import { TextArea as TamaguiTextArea, styled } from 'tamagui'
import { colors } from '../colors'

export const TextArea = styled(TamaguiTextArea, {
  height: 72,
  fontSize: 14,
  fontFamily: '$body',
  color: colors.content,
  bg: colors.surface,
  borderColor: colors.outlineVariant,
  borderWidth: 1,
  rounded: '$2',
  px: '$3',
  py: '$2',
  placeholderTextColor: colors.outline as any,
  textAlignVertical: 'top',
  hoverStyle: { borderColor: colors.outline },
  focusStyle: {
    borderColor: colors.accent,
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: colors.accent,
    outlineOffset: -1,
  },
})
