import './tamagui.generated.css'

import { MetaTheme } from '@vxrn/color-scheme'
import { type ReactNode } from 'react'
import { isWeb, TamaguiProvider, useTheme } from 'tamagui'

import { config } from './tamagui.config'
import { FontProvider } from './FontProvider'
import { ThemePreferenceProvider } from '~/features/theme/ThemePreferenceProvider'

export const TamaguiRootProvider = ({ children }: { children: ReactNode }) => {
  return (
    <FontProvider>
      <TamaguiInnerProvider>{children}</TamaguiInnerProvider>
    </FontProvider>
  )
}

const TamaguiInnerProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TamaguiProvider disableInjectCSS config={config} defaultTheme="rosewood">
      <ThemePreferenceProvider>
        {isWeb && <ThemeMetaTag />}
        {children}
      </ThemePreferenceProvider>
    </TamaguiProvider>
  )
}

const ThemeMetaTag = () => {
  const theme = useTheme()
  return (
    <MetaTheme
      color={theme.background.val}
      darkColor={theme.background.val}
      lightColor={theme.background.val}
    />
  )
}
