import { YStack, styled } from 'tamagui'
import { colors } from '../colors'

export const Card = styled(YStack, {
  bg: colors.surface,
  rounded: '$4',
  borderWidth: 0,
  overflow: 'hidden',
  p: '$4',
})
