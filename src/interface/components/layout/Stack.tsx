import { YStack, styled } from 'tamagui'

export const Stack = styled(YStack, {
  variants: {
    gap: {
      none: { gap: 0 },
      xs: { gap: '$1' },
      sm: { gap: '$3' },
      md: { gap: '$4' },
      lg: { gap: '$6' },
      xl: { gap: '$8' },
    },
    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
    },
  } as const,

  defaultVariants: {
    gap: 'md',
    align: 'stretch',
  },
})
