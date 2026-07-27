import { ScrollView, styled, SizableText, XStack, YStack } from 'tamagui'
import { colors } from '../colors'

const TableRoot = styled(ScrollView, {
  width: '100%',
  borderColor: colors.outlineVariant,
  borderWidth: 1,
  rounded: '$2',
  bg: colors.surface,
})
const THead = styled(YStack, {
  borderBottomWidth: 1,
  borderBottomColor: colors.outlineVariant,
  bg: colors.surface1,
})
const TBody = styled(YStack, {})
const TR = styled(XStack, {
  height: 44,
  items: 'center',
  borderBottomWidth: 1,
  borderBottomColor: colors.outlineVariant,
})
const TH = styled(SizableText, {
  fontFamily: '$body',
  fontSize: 14,
  fontWeight: '600',
  color: colors.content,
  px: '$4',
  py: '$3',
  flex: 1,
})
const TD = styled(SizableText, {
  fontFamily: '$body',
  fontSize: 14,
  color: colors.content,
  px: '$4',
  py: '$3',
  flex: 1,
})

export const Table = {
  Root: TableRoot,
  Head: THead,
  Body: TBody,
  Row: TR,
  HeaderCell: TH,
  Cell: TD,
}
