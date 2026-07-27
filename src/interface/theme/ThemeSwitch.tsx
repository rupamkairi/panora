import { View } from 'tamagui'

import { SunIcon } from '~/interface/icons/phosphor/SunIcon'

import type { SizeTokens } from 'tamagui'

export function ThemeSwitch({ size = '$2' }: { size?: SizeTokens }) {
  const iconSize = size === '$1' ? 16 : size === '$2' ? 20 : size === '$3' ? 24 : 28

  return (
    <View items="center" justify="center" aria-label="Light theme">
      <SunIcon size={iconSize} />
    </View>
  )
}

export function useToggleTheme() {
  return {
    setting: 'light' as const,
    scheme: 'light' as const,
    Icon: SunIcon,
    onPress: () => undefined,
  }
}

ThemeSwitch.title = 'Theme Switch'
