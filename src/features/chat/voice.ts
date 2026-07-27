export type VoiceState =
  | { status: 'idle' }
  | { status: 'recording'; startedAt: number }
  | { status: 'transcribing' }
  | { status: 'error'; message: string }

export interface VoiceTranscriptionService {
  start(): Promise<void>
  finish(): Promise<string>
  cancel(): Promise<void>
}

export class MockVoiceTranscriptionService implements VoiceTranscriptionService {
  private recording = false

  async start() {
    this.recording = true
  }

  async finish() {
    if (!this.recording) throw new Error('No recording is active.')
    this.recording = false
    await new Promise((resolve) => setTimeout(resolve, 650))
    return 'Help me understand the most important finding in these reports.'
  }

  async cancel() {
    this.recording = false
  }
}

export const voiceTranscriptionService = new MockVoiceTranscriptionService()
