import { Separator, styled } from 'tamagui'
import { colors } from '../colors'

export const Divider = styled(Separator, {
  borderColor: colors.outlineVariant,

  variants: {
    orientation: {
      horizontal: { borderBottomWidth: 1, width: '100%' },
      vertical: { borderRightWidth: 1, height: '100%' },
    },
    tone: {
      subtle: { borderColor: colors.outlineVariant },
      strong: { borderColor: colors.outline },
    },
  } as const,

  defaultVariants: {
    orientation: 'horizontal',
    tone: 'subtle',
  },
})
