import { useTheme } from 'tamagui'

import { getIconSize } from './helpers'

import type { IconProps } from './types'
import type { ColorTokens } from 'tamagui'

export const useIconProps = ({
  size,
  color = '$color11' as ColorTokens,
  ...restProps
}: IconProps) => {
  const theme = useTheme()
  const sizeValue = getIconSize(size)

  // SVG attributes require a concrete value during static web rendering.
  const colorValue = theme[color]?.val || theme.color11.val

  return {
    width: sizeValue,
    height: sizeValue,
    fill: colorValue,
    ...restProps,
  }
}
