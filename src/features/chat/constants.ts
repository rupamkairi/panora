export const CHAT_MODEL = 'openai/gpt-4o-mini'

export const STARTER_PROMPTS = [
  {
    label: 'Summarize the main findings',
    prompt: 'Summarize the main findings and explain why they matter.',
  },
  {
    label: 'Compare different viewpoints',
    prompt: 'Compare the main viewpoints and show where they agree or differ.',
  },
  {
    label: 'Explain the evidence simply',
    prompt: 'Explain the strongest evidence in clear, accessible language.',
  },
  {
    label: 'Identify risks and open questions',
    prompt: 'What are the key risks, limitations, and unanswered questions?',
  },
] as const

export const SYSTEM_PROMPT = `You are Panora, a clear and thoughtful research assistant.
Give accurate, concise answers. Use headings and lists when they make an answer easier to scan.
Never claim to have analyzed a report or attachment unless its contents were included in the conversation.`
