import { SizableText, styled } from 'tamagui'
import { colors } from '../colors'

export const CodeText = styled(SizableText, {
  fontFamily: '$mono',
  fontSize: 14,
  lineHeight: 20,
  color: colors.content,
  bg: colors.surface1,
  px: '$2',
  py: '$1',
  rounded: '$1',
})
