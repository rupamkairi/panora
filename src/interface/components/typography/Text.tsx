import { SizableText, styled } from 'tamagui'
import { colors } from '../colors'

export const Text = styled(SizableText, {
  color: colors.content,
  fontFamily: '$body',
  fontSize: 16,
  fontWeight: '400',
  lineHeight: 24,

  variants: {
    size: {
      xs: { fontSize: 12, lineHeight: 18 },
      sm: { fontSize: 14, lineHeight: 21 },
      md: { fontSize: 16, lineHeight: 24 },
      lg: { fontSize: 18, lineHeight: 29 },
      xl: { fontSize: 20, lineHeight: 30 },
    },
    uiSize: {
      xs: { fontSize: 12, lineHeight: 18 },
      sm: { fontSize: 14, lineHeight: 21 },
      md: { fontSize: 16, lineHeight: 24 },
      lg: { fontSize: 18, lineHeight: 29 },
      xl: { fontSize: 20, lineHeight: 30 },
    },
    weight: {
      normal: { fontWeight: '400' },
      medium: { fontWeight: '500' },
      semibold: { fontWeight: '600' },
      bold: { fontWeight: '700' },
    },
    tone: {
      neutral: { color: colors.content },
      secondary: { color: colors.contentSecondary },
      accent: { color: colors.accent },
      destructive: { color: colors.destructive },
      success: { color: colors.success },
      warning: { color: colors.warning },
    },
    fontStyle: {
      normal: { fontStyle: 'normal' },
      italic: { fontStyle: 'italic' },
    },
    center: {
      true: { textAlign: 'center' as any },
    },
    shrink: {
      true: { flexShrink: 1 },
    },
  } as const,

  defaultVariants: {
    size: 'md',
    weight: 'normal',
    tone: 'neutral',
  },
})
