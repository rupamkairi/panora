import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { config } from '~/tamagui/tamagui.config'

describe('production theme', () => {
  it('uses the light root theme regardless of the system color preference', () => {
    const providerPath = resolve('src/tamagui/TamaguiRootProvider.tsx')
    const provider = readFileSync(providerPath, 'utf8')

    expect(provider).toContain('defaultTheme="light"')
    expect(config.themes.light.background.val).toBe(config.themes.rosewood.background.val)
    expect(config.themes.light.accent.val).toBe(config.themes.rosewood.accent.val)
  })
})
