import { styled } from 'tamagui'
import { colors } from '../colors'
import { Pressable } from './Pressable'

export const IconButton = styled(Pressable, {
  role: 'button',
  width: 38,
  height: 38,
  hitSlop: 3,
  rounded: '$10',
  cursor: 'pointer',
  variants: {
    variant: {
      ghost: { bg: colors.transparent, hoverStyle: { bg: colors.surface2 } },
      outlined: {
        bg: colors.surface,
        borderColor: colors.outlineVariant,
        borderWidth: 1,
        hoverStyle: { bg: colors.surface1, borderColor: colors.outline },
      },
      primary: { bg: colors.accent, hoverStyle: { bg: colors.accentHover } },
      destructive: {
        bg: colors.transparent,
        hoverStyle: { bg: colors.destructiveContainer },
      },
    },
    uiSize: {
      sm: { width: 34, height: 34, hitSlop: 5 },
      md: { width: 38, height: 38, hitSlop: 3 },
      lg: { width: 42, height: 42, hitSlop: 1 },
    },
  } as const,
  defaultVariants: { variant: 'ghost', uiSize: 'md' },
})
