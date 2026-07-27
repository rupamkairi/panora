import { View, styled } from 'tamagui'
import { colors } from '../colors'

export const Pressable = styled(View, {
  hitSlop: 10,
  cursor: 'pointer',
  width: 44,
  height: 44,
  items: 'center',
  justify: 'center',
  pressStyle: { opacity: 0.72 },
  focusVisibleStyle: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: colors.accent,
    outlineOffset: 2,
  },
  hoverStyle: { opacity: 0.88 },
})
