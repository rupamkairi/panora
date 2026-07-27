import { ScrollView, styled } from 'tamagui'

export const ScrollArea = styled(ScrollView, {
  flex: 1,
  width: '100%',

  variants: {
    horizontal: {
      true: { horizontal: true },
    },
    padded: {
      true: { px: '$4' },
    },
  } as const,

  defaultVariants: {
    horizontal: false,
    padded: false,
  },
})
