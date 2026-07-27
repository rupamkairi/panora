import { YStack, styled } from 'tamagui'

export const Container = styled(YStack, {
  width: '100%',
  mx: 'auto',
  px: '$4',

  variants: {
    size: {
      sm: { maxWidth: 640 },
      md: { maxWidth: 860 },
      lg: { maxWidth: 1040 },
      xl: { maxWidth: 1200 },
      full: { maxWidth: '100%' },
    },
  } as const,

  defaultVariants: {
    size: 'lg',
  },
})
