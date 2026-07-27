import { describe, expect, it } from 'vitest'

import { config } from '~/tamagui/tamagui.config'

describe('mobile chat UI density tokens', () => {
  it('uses mobile-first control and field sizes', () => {
    expect(config.tokens.size.controlSm.val).toBe(44)
    expect(config.tokens.size.controlMd.val).toBe(48)
    expect(config.tokens.size.controlLg.val).toBe(52)
    expect(config.tokens.size.field.val).toBe(48)
    expect(config.tokens.size.composer.val).toBe(58)
  })

  it('does not retain desktop workspace rails', () => {
    expect(config.tokens.size.sidebarRail.val).toBe(0)
    expect(config.tokens.size.sidebar.val).toBe(0)
    expect(config.tokens.size.readingRail.val).toBe(0)
  })

  it('uses compact component and section spacing', () => {
    expect(config.tokens.space.componentGap.val).toBe(10)
    expect(config.tokens.space.componentPadding.val).toBe(14)
    expect(config.tokens.space.sectionGap.val).toBe(28)
  })
})
