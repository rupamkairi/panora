import { SizableText, styled } from 'tamagui'
import { colors } from '../colors'

export const Badge = styled(SizableText, {
  height: 20,
  px: '$2',
  rounded: '$10',
  fontFamily: '$body',
  fontSize: 11,
  fontWeight: '600',
  color: colors.white,
  bg: colors.accent,
})
