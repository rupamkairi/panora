import {
  Anybody_400Regular,
  Anybody_500Medium,
  Anybody_600SemiBold,
  Anybody_700Bold,
} from '@expo-google-fonts/anybody'
import {
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque'
import { useFonts } from 'expo-font'
import type { ReactNode } from 'react'

import { fontFamilies } from './fontFamilies'

/** Registers the exact weights defined in DESIGN.md for Expo and web. */
export function FontProvider({ children }: { children: ReactNode }) {
  useFonts({
    [fontFamilies.anybody.regular]: Anybody_400Regular,
    [fontFamilies.anybody.medium]: Anybody_500Medium,
    [fontFamilies.anybody.semiBold]: Anybody_600SemiBold,
    [fontFamilies.anybody.bold]: Anybody_700Bold,
    [fontFamilies.bricolage.regular]: BricolageGrotesque_400Regular,
    [fontFamilies.bricolage.medium]: BricolageGrotesque_500Medium,
    [fontFamilies.bricolage.semiBold]: BricolageGrotesque_600SemiBold,
    [fontFamilies.bricolage.bold]: BricolageGrotesque_700Bold,
  })

  return children
}
