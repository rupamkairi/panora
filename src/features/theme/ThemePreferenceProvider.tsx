import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Theme } from 'tamagui'

import type { PanoraThemeName } from '~/tamagui/tamagui.config'

const STORAGE_KEY = 'panora.theme.v1'
const themeNames: PanoraThemeName[] = ['saffron', 'apricot', 'rosewood']

type ThemePreferenceValue = {
  themeName: PanoraThemeName
  setThemeName: (theme: PanoraThemeName) => void
}

const ThemePreferenceContext = createContext<ThemePreferenceValue | null>(null)

const readTheme = (): PanoraThemeName => {
  if (typeof localStorage === 'undefined') return 'saffron'
  const stored = localStorage.getItem(STORAGE_KEY) as PanoraThemeName | null
  return stored && themeNames.includes(stored) ? stored : 'saffron'
}

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeState] = useState<PanoraThemeName>('saffron')

  useEffect(() => setThemeState(readTheme()), [])

  const setThemeName = useCallback((next: PanoraThemeName) => {
    setThemeState(next)
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const value = useMemo(() => ({ themeName, setThemeName }), [setThemeName, themeName])

  return (
    <ThemePreferenceContext.Provider value={value}>
      <Theme name={themeName}>{children}</Theme>
    </ThemePreferenceContext.Provider>
  )
}

export const useThemePreference = () => {
  const value = useContext(ThemePreferenceContext)
  if (!value) throw new Error('useThemePreference must be used inside its provider.')
  return value
}
