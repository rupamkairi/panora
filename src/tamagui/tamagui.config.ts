import { defaultConfig } from '@tamagui/config/v5'
import { createTamagui } from 'tamagui'

import { animationsRoot } from './animationsRoot'
import { fonts } from './fonts'

export const panoraPalettes = {
  rosewood: {
    background: '#F8E8E4',
    surface: '#FFF4F1',
    surface1: '#F0D2CE',
    surface2: '#E8C0BC',
    surface3: '#DDA8A5',
    surface4: '#CF9290',
    content: '#321B1D',
    contentSecondary: '#76575A',
    outline: '#9A7175',
    outlineVariant: '#DDBDB9',
    accent: '#9B3D46',
    accentHover: '#7D2E36',
    accentContainer: '#E8A5AB',
  },
} as const

const semantics = {
  contentInverse: '#FFF9EE',
  primary: '#2C1D12',
  primaryContainer: '#4A3322',
  destructive: '#A33A31',
  destructiveContainer: '#F8D7D1',
  success: '#3D7552',
  warning: '#A96800',
  inverseSurface: '#34271D',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const

const createTheme = (palette: (typeof panoraPalettes)[keyof typeof panoraPalettes]) => ({
  ...defaultConfig.themes.light,
  ...palette,
  ...semantics,
  color: palette.content,
  background: palette.background,
  borderColor: palette.outlineVariant,
  placeholderColor: palette.contentSecondary,
})

export const config = createTamagui({
  ...defaultConfig,
  animations: animationsRoot,
  fonts,
  tokens: {
    ...defaultConfig.tokens,
    color: { ...panoraPalettes.rosewood, ...semantics },
    size: {
      ...defaultConfig.tokens.size,
      controlSm: 44,
      controlMd: 48,
      controlLg: 52,
      field: 48,
      composer: 58,
      sidebarRail: 0,
      sidebar: 0,
      readingRail: 0,
    },
    space: {
      ...defaultConfig.tokens.space,
      componentGap: 10,
      componentPadding: 14,
      sectionGap: 28,
      pageGutter: 16,
    },
  },
  themes: {
    rosewood: createTheme(panoraPalettes.rosewood),
    light: createTheme(panoraPalettes.rosewood),
  },
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
  interface TypeOverride {
    groupNames(): 'button' | 'message' | 'icon' | 'item' | 'frame' | 'card'
  }
}
