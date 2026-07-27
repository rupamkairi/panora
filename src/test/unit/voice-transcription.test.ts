import { describe, expect, test } from 'vitest'

import { MockVoiceTranscriptionService } from '~/features/chat/voice'

describe('MockVoiceTranscriptionService', () => {
  test('requires an active recording and returns an editable transcript', async () => {
    const service = new MockVoiceTranscriptionService()
    await expect(service.finish()).rejects.toThrow('No recording')
    await service.start()
    await expect(service.finish()).resolves.toContain('most important finding')
  })

  test('cancels without producing a transcript', async () => {
    const service = new MockVoiceTranscriptionService()
    await service.start()
    await service.cancel()
    await expect(service.finish()).rejects.toThrow('No recording')
  })
})
