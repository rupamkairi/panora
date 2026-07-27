import { Avatar as TamaguiAvatar, styled } from 'tamagui'
import { colors } from '../colors'

export const Avatar = styled(TamaguiAvatar, {
  rounded: '$10',
  overflow: 'hidden',
})

export const AvatarFallback = styled(TamaguiAvatar.Fallback, {
  bg: colors.surface1,
  items: 'center',
  justify: 'center',
})
