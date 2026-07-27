import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { MMKV } from 'react-native-mmkv'
import { Theme } from 'tamagui'

import type { PanoraThemeName } from '~/tamagui/tamagui.config'

const storage = new MMKV({ id: 'panora-preferences' })
const STORAGE_KEY = 'theme'
const themeNames: PanoraThemeName[] = ['saffron', 'apricot', 'rosewood']

type ThemePreferenceValue = {
  themeName: PanoraThemeName
  setThemeName: (theme: PanoraThemeName) => void
}

const ThemePreferenceContext = createContext<ThemePreferenceValue | null>(null)

const readTheme = (): PanoraThemeName => {
  const stored = storage.getString(STORAGE_KEY) as PanoraThemeName | undefined
  return stored && themeNames.includes(stored) ? stored : 'saffron'
}

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeState] = useState<PanoraThemeName>(readTheme)
  const setThemeName = useCallback((next: PanoraThemeName) => {
    setThemeState(next)
    storage.set(STORAGE_KEY, next)
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
