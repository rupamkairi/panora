import { SizableText, styled } from 'tamagui'
import { colors } from '../colors'

export const TruncatedText = styled(SizableText, {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  numberOfLines: 1,
  color: colors.content,
  fontFamily: '$body',
  fontSize: 16,
  lineHeight: 24,

  variants: {
    lines: {
      '1': { numberOfLines: 1 },
      '2': { numberOfLines: 2 },
      '3': { numberOfLines: 3 },
    },
  } as const,

  defaultVariants: {
    lines: '1',
  },
})
