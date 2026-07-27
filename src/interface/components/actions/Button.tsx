import { Button as TamaguiButton, styled } from 'tamagui'
import { colors } from '../colors'

export const Button = styled(TamaguiButton, {
  size: '$3',
  height: 44,
  minW: 44,
  rounded: '$3',
  cursor: 'pointer',
  borderWidth: 1,
  px: '$3',
  py: '$2',
  focusVisibleStyle: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: colors.accent,
    outlineOffset: 2,
  },
  variants: {
    variant: {
      primary: {
        bg: colors.accent,
        color: colors.white,
        borderColor: colors.accent,
        hoverStyle: { bg: colors.accentHover },
        pressStyle: { bg: colors.accentHover, scale: 0.98 },
      },
      secondary: {
        bg: colors.surface1,
        color: colors.content,
        borderColor: colors.outlineVariant,
        hoverStyle: { bg: colors.surface2, borderColor: colors.outline },
        pressStyle: { bg: colors.surface3, scale: 0.98 },
      },
      outline: {
        bg: colors.transparent,
        color: colors.accent,
        borderColor: colors.accent,
        hoverStyle: { bg: colors.surface1 },
        pressStyle: { bg: colors.surface2, scale: 0.98 },
      },
      ghost: {
        bg: colors.transparent,
        color: colors.content,
        borderColor: colors.transparent,
        hoverStyle: { bg: colors.surface1 },
        pressStyle: { bg: colors.surface2, opacity: 0.9 },
      },
      destructive: {
        bg: colors.destructive,
        color: colors.white,
        borderColor: colors.destructive,
        hoverStyle: { opacity: 0.9 },
        pressStyle: { opacity: 0.8 },
      },
    },
    uiSize: {
      sm: { height: 40, minWidth: 40, px: '$3', hitSlop: 2 },
      md: { height: 44, minWidth: 44, px: '$3' },
      lg: { height: 48, minWidth: 48, px: '$4' },
    },
  } as const,
  defaultVariants: { variant: 'primary', uiSize: 'md' },
})
