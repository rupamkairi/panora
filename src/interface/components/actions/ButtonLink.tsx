import { SizableText, styled } from 'tamagui'

import { colors } from '../colors'

export const ButtonLink = styled(SizableText, {
  render: 'a',
  height: 44,
  minW: 44,
  rounded: '$3',
  cursor: 'pointer',
  borderWidth: 1,
  px: '$3',
  py: '$2',
  items: 'center',
  justify: 'center',
  textDecorationLine: 'none',
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
    },
    uiSize: {
      md: { height: 44, minWidth: 44, px: '$3' },
      lg: { height: 48, minWidth: 48, px: '$4' },
    },
  } as const,
  defaultVariants: { variant: 'primary', uiSize: 'md' },
})
