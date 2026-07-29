import { describe, expect, test } from 'vitest'

import { getProductRoute } from '~/constants/navigation'

describe('product route', () => {
  test('keeps the web product under /chat', () => {
    expect(getProductRoute(true)).toBe('/chat')
  })

  test('keeps the native product at the app root', () => {
    expect(getProductRoute(false)).toBe('/')
  })
})
