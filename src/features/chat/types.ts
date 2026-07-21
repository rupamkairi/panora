export type ChatRole = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
}

export type OpenRouterMessage = Pick<ChatMessage, 'role' | 'content'>
