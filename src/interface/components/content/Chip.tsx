import { SizableText, styled } from 'tamagui'
import { colors } from '../colors'

export const Chip = styled(SizableText, {
  height: 32,
  px: '$3',
  py: '$1',
  rounded: '$10',
  bg: colors.surface1,
  color: colors.content,
  borderColor: colors.outlineVariant,
  borderWidth: 1,
  fontFamily: '$body',
  fontSize: 12,
  fontWeight: '500',
  cursor: 'pointer',

  hoverStyle: { bg: colors.surface2 },
  pressStyle: { bg: colors.surface3, scale: 0.99 },

  variants: {
    tone: {
      neutral: { bg: colors.surface1, color: colors.content },
      accent: { bg: colors.accent, color: colors.white, borderColor: colors.accent },
      destructive: { bg: colors.destructiveContainer, color: colors.destructive },
      success: { bg: colors.successContainer, color: colors.success },
      warning: { bg: colors.warningContainer, color: colors.warning },
    },
    size: {
      sm: { height: 24, fontSize: 11, px: '$2' },
      md: { height: 32, fontSize: 12 },
      lg: { height: 40, fontSize: 14, px: '$4' },
    },
  } as const,

  defaultVariants: {
    tone: 'neutral',
    size: 'md',
  },
})
