import { describe, expect, test, vi } from 'vitest'

import { ChatSession } from '~/features/chat/session'

describe('ChatSession', () => {
  test('accepts only one submission while a response is pending', async () => {
    let resolveReply: () => void = () => undefined
    const transport = vi.fn(
      (_messages, onEvent) =>
        new Promise<void>((resolve) => {
          onEvent({ type: 'start' })
          resolveReply = () => {
            onEvent({ type: 'delta', content: 'First reply' })
            onEvent({ type: 'complete' })
            resolve()
          }
        }),
    )
    const session = new ChatSession(transport)

    expect(session.send('First message')).toBe(true)
    expect(session.send('Second message')).toBe(false)
    expect(session.getSnapshot().messages.map(({ content }) => content)).toEqual([
      'First message',
      '',
    ])

    resolveReply()
    await vi.waitFor(() => expect(session.getSnapshot().isSending).toBe(false))
    expect(transport).toHaveBeenCalledTimes(1)
  })

  test('preserves a failed user message and retries it without duplication', async () => {
    const transport = vi.fn()
    transport
      .mockRejectedValueOnce(new Error('Connection lost'))
      .mockImplementationOnce(async (_messages, onEvent) => {
        onEvent({ type: 'start' })
        onEvent({ type: 'delta', content: 'Recovered reply' })
        onEvent({ type: 'complete' })
      })
    const session = new ChatSession(transport)

    session.send('Keep this question')
    await vi.waitFor(() => expect(session.getSnapshot().canRetry).toBe(true))
    expect(session.getSnapshot().messages).toHaveLength(1)

    expect(session.retry()).toBe(true)
    await vi.waitFor(() => expect(session.getSnapshot().messages).toHaveLength(2))
    expect(session.getSnapshot().messages.map(({ content }) => content)).toEqual([
      'Keep this question',
      'Recovered reply',
    ])
  })

  test('aborts the active request when disposed', () => {
    let requestSignal: AbortSignal | undefined
    const session = new ChatSession((_messages, _onEvent, signal) => {
      requestSignal = signal
      return new Promise(() => undefined)
    })

    session.send('Cancel me')
    session.dispose()

    expect(requestSignal?.aborted).toBe(true)
  })

  test('can reactivate after a development lifecycle cleanup', async () => {
    const session = new ChatSession(async (_messages, onEvent) => {
      onEvent({ type: 'start' })
      onEvent({ type: 'delta', content: 'Reply' })
      onEvent({ type: 'complete' })
    })
    session.dispose()
    session.activate()

    expect(session.send('Strict mode message')).toBe(true)
    await vi.waitFor(() => expect(session.getSnapshot().messages).toHaveLength(2))
  })
})
