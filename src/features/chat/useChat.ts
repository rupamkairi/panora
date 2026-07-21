import { useEffect, useState, useSyncExternalStore } from 'react'

import { sendChatMessage } from './api'
import { ChatSession } from './session'

export function useChat() {
  const [session] = useState(() => new ChatSession(sendChatMessage))
  const snapshot = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getSnapshot,
  )

  useEffect(() => {
    session.activate()
    return () => session.dispose()
  }, [session])

  return {
    ...snapshot,
    send: session.send,
    retry: session.retry,
  }
}
