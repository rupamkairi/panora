import type { ChatMessage } from './types'

export type ChatSnapshot = {
  messages: ChatMessage[]
  isSending: boolean
  error: string | null
  canRetry: boolean
}

export type ChatTransport = (
  messages: ChatMessage[],
  signal?: AbortSignal,
) => Promise<string>

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

const initialSnapshot: ChatSnapshot = {
  messages: [],
  isSending: false,
  error: null,
  canRetry: false,
}

export class ChatSession {
  private snapshot = initialSnapshot
  private readonly listeners = new Set<() => void>()
  private request: AbortController | null = null
  private disposed = false

  constructor(private readonly transport: ChatTransport) {}

  getSnapshot = () => this.snapshot

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  activate = () => {
    this.disposed = false
  }

  send = (content: string) => {
    const text = content.trim()
    if (!text || this.request || this.disposed) return false

    const userMessage: ChatMessage = { id: createId(), role: 'user', content: text }
    const messages = [...this.snapshot.messages, userMessage]
    this.update({ messages, isSending: true, error: null, canRetry: false })
    this.startRequest(messages)
    return true
  }

  retry = () => {
    if (this.request || this.disposed || !this.snapshot.canRetry) return false
    this.update({ ...this.snapshot, isSending: true, error: null, canRetry: false })
    this.startRequest(this.snapshot.messages)
    return true
  }

  dispose = () => {
    this.disposed = true
    this.request?.abort()
    this.request = null
  }

  private startRequest(messages: ChatMessage[]) {
    const controller = new AbortController()
    this.request = controller

    void this.transport(messages, controller.signal)
      .then((content) => {
        if (this.disposed || this.request !== controller) return
        this.update({
          messages: [
            ...this.snapshot.messages,
            { id: createId(), role: 'assistant', content },
          ],
          isSending: false,
          error: null,
          canRetry: false,
        })
      })
      .catch((cause: unknown) => {
        if (this.disposed || this.request !== controller || controller.signal.aborted)
          return
        this.update({
          ...this.snapshot,
          isSending: false,
          error: cause instanceof Error ? cause.message : 'Something went wrong.',
          canRetry: true,
        })
      })
      .finally(() => {
        if (this.request === controller) this.request = null
      })
  }

  private update(snapshot: ChatSnapshot) {
    this.snapshot = snapshot
    this.listeners.forEach((listener) => listener())
  }
}
