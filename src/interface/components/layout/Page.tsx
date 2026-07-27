import { YStack, styled } from 'tamagui'
import { colors } from '../colors'

export const Page = styled(YStack, {
  flex: 1,
  bg: colors.background,
  role: 'main',
})
