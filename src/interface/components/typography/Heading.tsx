import { SizableText, styled } from 'tamagui'
import { colors } from '../colors'

export const Heading = styled(SizableText, {
  color: colors.content,
  fontFamily: '$heading',
  fontWeight: '600',

  variants: {
    level: {
      h1: { fontSize: 48, fontWeight: '700', lineHeight: 53, letterSpacing: -0.96 },
      h2: { fontSize: 32, fontWeight: '600', lineHeight: 38, letterSpacing: -0.32 },
      h3: { fontSize: 24, fontWeight: '500', lineHeight: 31 },
      h4: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
      h5: { fontSize: 18, fontWeight: '600', lineHeight: 26 },
      h6: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
    },
    tone: {
      neutral: { color: colors.content },
      secondary: { color: colors.contentSecondary },
      accent: { color: colors.accent },
      destructive: { color: colors.destructive },
    },
    text: {
      center: { textAlign: 'center' as any },
    },
  } as const,

  defaultVariants: {
    level: 'h2',
    tone: 'neutral',
  },
})
