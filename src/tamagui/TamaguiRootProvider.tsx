import './tamagui.generated.css'

import { MetaTheme, SchemeProvider, useUserScheme } from '@vxrn/color-scheme'
import { type ReactNode } from 'react'
import { isWeb, TamaguiProvider, useTheme } from 'tamagui'

import { config } from './tamagui.config'
import { FontProvider } from './FontProvider'

export const TamaguiRootProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SchemeProvider>
      <FontProvider>
        <TamaguiInnerProvider>{children}</TamaguiInnerProvider>
      </FontProvider>
    </SchemeProvider>
  )
}

const TamaguiInnerProvider = ({ children }: { children: ReactNode }) => {
  const userScheme = useUserScheme()

  return (
    <TamaguiProvider disableInjectCSS config={config} defaultTheme={userScheme.value}>
      {isWeb && <ThemeMetaTag />}
      {children}
    </TamaguiProvider>
  )
}

const ThemeMetaTag = () => {
  const theme = useTheme()
  return <MetaTheme color={theme.background.val} darkColor="#000" lightColor="#fff" />
}
