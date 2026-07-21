import { styled } from 'tamagui'

import { Pressable } from '../buttons/Pressable'

export const Chip = styled(Pressable, {
  height: 40,
  items: 'center',
  justify: 'center',
  flexDirection: 'row',
  gap: 8,
  px: 20,
  py: 8,
  bg: '#F2F4F6',
  borderColor: '#C6C6CD',
  rounded: '$10',
  borderWidth: 1,
  cursor: 'pointer',
  pressStyle: { bg: '#E6E8EA', scale: 0.99 },
  hoverStyle: { bg: '#ECEEF0' },
})
