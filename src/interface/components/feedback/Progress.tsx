import { Progress as TamaguiProgress, styled } from 'tamagui'
import { colors } from '../colors'

export const Progress = styled(TamaguiProgress, {
  height: 8,
  rounded: '$1',
  bg: colors.surface2,
})
