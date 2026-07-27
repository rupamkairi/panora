import { XStack, styled } from 'tamagui'

export const ButtonGroup = styled(XStack, {
  gap: 0,

  variants: {
    attached: {
      true: {},
    },
    direction: {
      row: { flexDirection: 'row' },
      column: { flexDirection: 'column' },
    },
  } as const,

  defaultVariants: {
    attached: true,
    direction: 'row',
  },
})
