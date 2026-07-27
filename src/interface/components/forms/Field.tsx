import { YStack, styled } from 'tamagui'

import type { ReactNode } from 'react'

export const Field = styled(YStack, {
  gap: '$2',

  variants: {
    layout: {
      vertical: { flexDirection: 'column' },
      horizontal: { flexDirection: 'row', alignItems: 'center', gap: '$4' },
    },
  } as const,

  defaultVariants: {
    layout: 'vertical',
  },
})
