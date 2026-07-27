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
  variants: {
    composer: {
      true: {
        bg: '$transparent',
        borderWidth: 0,
        borderColor: '$transparent',
        rounded: 0,
        hoverStyle: {
          bg: '$transparent',
          borderWidth: 0,
          borderColor: '$transparent',
        },
        focusStyle: {
          bg: '$transparent',
          borderWidth: 0,
          borderColor: '$transparent',
          outlineWidth: 0,
          outlineColor: '$transparent',
        },
        focusVisibleStyle: {
          bg: '$transparent',
          borderWidth: 0,
          borderColor: '$transparent',
          outlineWidth: 0,
          outlineColor: '$transparent',
        },
      },
    },
  } as const,
})
