import { styled } from 'tamagui'

import { Pressable } from './Pressable'

export const IconButton = styled(Pressable, {
  width: 44,
  height: 44,
  items: 'center',
  justify: 'center',
  rounded: '$10',
  cursor: 'pointer',

  variants: {
    variant: {
      ghost: {
        bg: 'transparent',
        hoverStyle: { bg: '#ECEEF0' },
      },
      outlined: {
        bg: '#F7F9FB',
        borderColor: '#C6C6CD',
        borderWidth: 1,
        hoverStyle: { bg: '#ECEEF0', borderColor: '#76777D' },
      },
      primary: {
        bg: '#0051D5',
        hoverStyle: { bg: '#003EA8' },
      },
    },
  } as const,

  defaultVariants: {
    variant: 'ghost',
  },
})
