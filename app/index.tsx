import { isWeb } from 'tamagui'

import { ChatScreen } from '~/features/chat/ui/ChatScreen'
import { LandingPage } from '~/features/landing/LandingPage'

export function HomePage() {
  if (isWeb) {
    return <LandingPage />
  }
  return <ChatScreen />
}
