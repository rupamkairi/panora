import { styled, View } from 'tamagui'

export const Pressable = styled(View, {
  hitSlop: 10,
  cursor: 'pointer',
  pressStyle: {
    opacity: 0.72,
  },
  focusVisibleStyle: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#0051D5',
    outlineOffset: 2,
  },
})
