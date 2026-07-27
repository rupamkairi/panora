import { XStack, YStack, styled } from 'tamagui'

export const Grid = styled(YStack, {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '$4',
})

export const GridItem = styled(XStack, {
  flex: 1,
})
