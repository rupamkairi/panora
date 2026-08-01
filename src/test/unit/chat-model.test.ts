import { describe, expect, test } from 'vitest'

import {
  FREE_CHAT_MODEL_FALLBACK,
  resolveFreeChatModel,
} from '~/features/chat/server/config'

describe('free chat model configuration', () => {
  test('uses the configured free router or a specific free model', () => {
    expect(resolveFreeChatModel('openrouter/free')).toBe('openrouter/free')
    expect(resolveFreeChatModel('provider/model:free')).toBe('provider/model:free')
  })

  test('never sends a paid or missing model to OpenRouter', () => {
    expect(resolveFreeChatModel('openai/gpt-4o-mini')).toBe(FREE_CHAT_MODEL_FALLBACK)
    expect(resolveFreeChatModel(undefined)).toBe(FREE_CHAT_MODEL_FALLBACK)
  })
})
