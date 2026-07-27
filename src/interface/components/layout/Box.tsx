import { View, styled } from 'tamagui'
import { colors } from '../colors'

export const Box = styled(View, {
  variants: {
    bg: {
      background: { bg: colors.background },
      surface: { bg: colors.surface },
      surface1: { bg: colors.surface1 },
      surface2: { bg: colors.surface2 },
      surface3: { bg: colors.surface3 },
      transparent: { bg: colors.transparent },
    },
    padded: {
      true: { p: '$4' },
      false: { p: 0 },
    },
    rounded: {
      true: { borderRadius: '$2' },
      false: { borderRadius: 0 },
    },
    bordered: {
      true: { borderWidth: 1, borderColor: colors.outlineVariant },
      false: { borderWidth: 0 },
    },
  } as const,

  defaultVariants: {
    bg: 'transparent',
    padded: false,
    rounded: false,
    bordered: false,
  },
})
