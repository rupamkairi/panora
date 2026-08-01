export type ChatRole = 'user' | 'assistant'
export type MessageStatus = 'complete' | 'streaming' | 'stopped' | 'failed'
export type MessageFeedback = 'up' | 'down' | null

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  createdAt: string
  status: MessageStatus
  feedback?: MessageFeedback
  sourceDocumentIds?: string[]
  webSearchEnabled?: boolean
}

export type OpenRouterMessage = Pick<ChatMessage, 'role' | 'content'>

export type ContextItemStatus =
  | 'selected'
  | 'processing'
  | 'ready'
  | 'failed'
  | 'unavailable'

type ContextItemBase = {
  id: string
  name: string
  status: ContextItemStatus
}

export type ReportContextItem = ContextItemBase & {
  kind: 'report'
  reportId: string
  publisher: string
}

export type FileContextItem = ContextItemBase & {
  kind: 'document' | 'image'
  uri?: string
  mimeType?: string
}

export type ChatContextItem = ReportContextItem | FileContextItem

export type Conversation = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  pinned: boolean
  draft: string
  messages: ChatMessage[]
  contextItems: ChatContextItem[]
}

export type ConversationGroup = 'Pinned' | 'Today' | 'Previous 7 Days' | 'Older'

export type ChatStreamEvent =
  | { type: 'start' }
  | { type: 'delta'; content: string }
  | { type: 'quota'; quota: ChatQuota }
  | { type: 'complete'; quota?: ChatQuota }
  | { type: 'error'; error: string; quota?: ChatQuota }

export type ChatQuota = {
  remaining: number
  limit: number
  resetAt: string | null
  unlimited?: boolean
}

export type ChatTransport = (
  messages: ChatMessage[],
  onEvent: (event: ChatStreamEvent) => void,
  signal?: AbortSignal,
  options?: { documentIds: string[]; webSearchEnabled: boolean },
) => Promise<void>
