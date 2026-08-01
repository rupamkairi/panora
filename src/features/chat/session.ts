import type {
  ChatMessage,
  ChatQuota,
  ChatStreamEvent,
  ChatTransport,
  MessageFeedback,
} from './types'

export type ChatSnapshot = {
  messages: ChatMessage[]
  isSending: boolean
  error: string | null
  canRetry: boolean
  quota: ChatQuota
}

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`
const now = () => new Date().toISOString()

const initialSnapshot: ChatSnapshot = {
  messages: [],
  isSending: false,
  error: null,
  canRetry: false,
  quota: { remaining: 10, limit: 10, resetAt: null },
}

export class ChatSession {
  private snapshot = initialSnapshot
  private readonly listeners = new Set<() => void>()
  private request: AbortController | null = null
  private disposed = false
  private lastOptions = { documentIds: [] as string[], webSearchEnabled: true }

  constructor(private readonly transport: ChatTransport) {}

  getSnapshot = () => this.snapshot
  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  activate = () => {
    this.disposed = false
  }

  send = (
    content: string,
    options = { documentIds: [] as string[], webSearchEnabled: true },
  ) => {
    const text = content.trim()
    if (!text || this.request || this.disposed || this.snapshot.quota.remaining === 0)
      return false
    const userMessage: ChatMessage = {
      id: createId(),
      role: 'user',
      content: text,
      createdAt: now(),
      status: 'complete',
      sourceDocumentIds: [...options.documentIds],
      webSearchEnabled: options.webSearchEnabled,
    }
    const messages = [...this.snapshot.messages, userMessage]
    this.update({
      messages,
      isSending: true,
      error: null,
      canRetry: false,
      quota: this.snapshot.quota,
    })
    this.lastOptions = options
    this.startRequest(messages, options)
    return true
  }

  retry = (instruction?: 'retry' | 'extend' | 'shorten') => {
    if (
      this.request ||
      this.disposed ||
      this.snapshot.messages.length === 0 ||
      this.snapshot.quota.remaining === 0
    )
      return false
    const withoutFailed = this.snapshot.messages.filter(
      (message) => !(message.role === 'assistant' && message.status === 'failed'),
    )
    const requestMessages =
      instruction && instruction !== 'retry'
        ? [
            ...withoutFailed,
            {
              id: createId(),
              role: 'user' as const,
              content:
                instruction === 'extend'
                  ? 'Continue the previous answer with useful additional detail.'
                  : 'Rewrite the previous answer more concisely.',
              createdAt: now(),
              status: 'complete' as const,
            },
          ]
        : withoutFailed
    this.update({
      messages: requestMessages,
      isSending: true,
      error: null,
      canRetry: false,
      quota: this.snapshot.quota,
    })
    this.startRequest(requestMessages, this.lastOptions)
    return true
  }

  stop = () => {
    if (!this.request) return false
    this.request.abort()
    this.request = null
    this.update({
      ...this.snapshot,
      messages: this.snapshot.messages.map((message) =>
        message.status === 'streaming' ? { ...message, status: 'stopped' } : message,
      ),
      isSending: false,
      error: null,
      canRetry: true,
    })
    return true
  }

  setFeedback = (id: string, feedback: MessageFeedback) => {
    this.update({
      ...this.snapshot,
      messages: this.snapshot.messages.map((message) =>
        message.id === id ? { ...message, feedback } : message,
      ),
    })
  }

  setQuota = (quota: ChatQuota) => {
    this.update({ ...this.snapshot, quota })
  }

  reset = () => {
    this.request?.abort()
    this.request = null
    this.update({ ...initialSnapshot, quota: this.snapshot.quota })
  }

  restore = (snapshot: ChatSnapshot) => {
    this.request?.abort()
    this.request = null
    this.update({
      ...snapshot,
      quota: this.snapshot.quota,
      isSending: false,
      error: null,
      canRetry: false,
    })
  }

  dispose = () => {
    this.disposed = true
    this.request?.abort()
    this.request = null
  }

  private startRequest(
    messages: ChatMessage[],
    options: { documentIds: string[]; webSearchEnabled: boolean },
  ) {
    const controller = new AbortController()
    this.request = controller
    const assistantId = createId()

    const onEvent = (event: ChatStreamEvent) => {
      if (this.disposed || this.request !== controller) return
      if (event.type === 'start') {
        this.update({
          ...this.snapshot,
          messages: [
            ...this.snapshot.messages,
            {
              id: assistantId,
              role: 'assistant',
              content: '',
              createdAt: now(),
              status: 'streaming',
            },
          ],
        })
      } else if (event.type === 'quota') {
        this.update({ ...this.snapshot, quota: event.quota })
      } else if (event.type === 'delta') {
        this.update({
          ...this.snapshot,
          messages: this.snapshot.messages.map((message) =>
            message.id === assistantId
              ? { ...message, content: message.content + event.content }
              : message,
          ),
        })
      } else if (event.type === 'complete') {
        this.update({
          ...this.snapshot,
          messages: this.snapshot.messages.map((message) =>
            message.id === assistantId ? { ...message, status: 'complete' } : message,
          ),
          isSending: false,
          error: null,
          canRetry: false,
          quota: event.quota ?? this.snapshot.quota,
        })
      } else if (event.quota) {
        this.update({ ...this.snapshot, quota: event.quota })
      }
    }

    void this.transport(messages, onEvent, controller.signal, options)
      .catch((cause: unknown) => {
        if (this.disposed || this.request !== controller || controller.signal.aborted)
          return
        this.update({
          ...this.snapshot,
          messages: this.snapshot.messages.map((message) =>
            message.id === assistantId ? { ...message, status: 'failed' } : message,
          ),
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
