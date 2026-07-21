import { Separator, YStack, styled } from 'tamagui'

export const Card = styled(YStack, {
  bg: '#FFFFFF',
  borderColor: '#E2E8F0',
  rounded: '$4',
  borderWidth: 1,
})

export const InsetSurface = styled(YStack, {
  bg: '#F2F4F6',
  borderColor: '#E2E8F0',
  rounded: '$3',
  borderWidth: 1,
})

export const Divider = styled(Separator, {
  borderColor: '#E2E8F0',
})
