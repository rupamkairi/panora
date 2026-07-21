import { Button as TamaguiButton, styled, type GetProps } from 'tamagui'

export const Button = styled(TamaguiButton, {
  render: 'button',
  bg: '#0051D5',
  borderColor: '#0051D5',
  rounded: '$2',
  borderWidth: 1,
  cursor: 'pointer',

  focusVisibleStyle: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#0051D5',
  },

  variants: {
    variant: {
      default: {
        bg: '#0051D5',
        borderColor: '#0051D5',
        hoverStyle: { bg: '#003EA8' },
        pressStyle: { bg: '#003EA8', opacity: 0.88 },
      },
      outlined: {
        bg: '#F2F4F6',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        hoverStyle: { bg: '#ECEEF0', borderColor: '#C6C6CD' },
        pressStyle: { bg: '#E6E8EA', opacity: 0.88 },
      },
      transparent: {
        bg: 'transparent',
        borderColor: 'transparent',
        hoverStyle: { bg: '#F2F4F6' },
        pressStyle: { bg: '#ECEEF0', opacity: 0.88 },
      },
      floating: {
        bg: '#0051D5',
        borderColor: '#0051D5',
        hoverStyle: { bg: '#003EA8' },
        pressStyle: { bg: '#003EA8', opacity: 0.9 },
      },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
  },
})

export type ButtonProps = GetProps<typeof Button>
