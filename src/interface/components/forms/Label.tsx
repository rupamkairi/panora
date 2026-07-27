import { Label as TamaguiLabel, styled } from 'tamagui'
import { colors } from '../colors'

export const Label = styled(TamaguiLabel, {
  fontFamily: '$body',
  fontSize: 13,
  fontWeight: '600',
  lineHeight: 16,
  letterSpacing: 0.13,
  color: colors.content,
})
