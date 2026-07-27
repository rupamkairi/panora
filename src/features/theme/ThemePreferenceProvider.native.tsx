import { type ReactNode } from 'react'
import { Theme } from 'tamagui'

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  return <Theme name="rosewood">{children}</Theme>
}
