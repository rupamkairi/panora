import { SizableText, styled } from 'tamagui'
import { colors } from '../colors'

export const Link = styled(SizableText, {
  color: colors.accent,
  cursor: 'pointer',
  fontFamily: '$body',
  fontSize: 14,
  fontWeight: '500',
  textDecorationLine: 'underline',
  hoverStyle: { color: colors.accentHover },
  focusVisibleStyle: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: colors.accent,
    outlineOffset: 2,
  },
  variants: {
    uiSize: { sm: { fontSize: 13 }, md: { fontSize: 14 }, lg: { fontSize: 16 } },
    tone: {
      accent: { color: colors.accent },
      destructive: { color: colors.destructive },
      neutral: { color: colors.content },
    },
  } as const,
  defaultVariants: { uiSize: 'md', tone: 'accent' },
})
