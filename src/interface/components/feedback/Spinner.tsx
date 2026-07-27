import { Spinner as TamaguiSpinner, styled } from 'tamagui'
import { colors } from '../colors'

export const Spinner = styled(TamaguiSpinner, {
  variants: {
    uiSize: {
      sm: { width: 16, height: 16 },
      md: { width: 24, height: 24 },
      lg: { width: 32, height: 32 },
      xl: { width: 48, height: 48 },
    },
    tone: {
      accent: { color: colors.accent },
      neutral: { color: colors.contentSecondary },
      destructive: { color: colors.destructive },
    },
  } as const,
  defaultVariants: { uiSize: 'md', tone: 'accent' },
})
