import { YStack, styled, XStack, SizableText } from 'tamagui'
import { colors } from '../colors'

export const List = styled(YStack, {})

export const ListItem = styled(XStack, {
  px: '$4',
  py: '$3',
  height: 44,
  items: 'center',
  gap: '$3',
  cursor: 'pointer',
  hoverStyle: { bg: colors.surface1 },
  pressStyle: { bg: colors.surface2 },
})

export const ListItemText = styled(YStack, { flex: 1, gap: '$1' })
export const ListItemTitle = styled(SizableText, {
  fontFamily: '$body',
  fontSize: 16,
  fontWeight: '500',
  color: colors.content,
})
export const ListItemDescription = styled(SizableText, {
  fontFamily: '$body',
  fontSize: 14,
  color: colors.contentSecondary,
})
