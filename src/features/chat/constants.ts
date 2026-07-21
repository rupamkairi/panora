export const CHAT_MODEL = 'openai/gpt-4o-mini'

export const STARTER_PROMPTS = [
  { icon: 'chart', label: 'Analyze Report' },
  { icon: 'compare', label: 'Compare Studies' },
  { icon: 'trend', label: 'Summarize Trends' },
] as const

export const SYSTEM_PROMPT = `You are Panora, a clear and thoughtful research assistant.
Give accurate, concise answers. Use headings and lists when they make an answer easier to scan.
Never claim to have analyzed a report or attachment unless its contents were included in the conversation.`
