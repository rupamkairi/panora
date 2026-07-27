import './root.css'

import { Slot } from 'one'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'

import { PlatformSpecificRootProvider } from '~/interface/platform/PlatformSpecificRootProvider'
import { InterfaceProvider } from '~/interface/providers/InterfaceProvider'
import { TamaguiRootProvider } from '~/tamagui/TamaguiRootProvider'

export function Layout() {
  return (
    <html lang="en-US">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>Panora</title>
        <meta
          name="description"
          content="Panora is a personalized AI chat for understanding reports from multiple perspectives."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />
        <meta
          name="panora-design-thesis"
          content="A familiar mobile AI chat made warmer, calmer, and grounded in reports."
        />
        <meta
          name="panora-design-world"
          content="Rosewood & Blush, Bricolage Grotesque throughout, compact open prose, and tactile native controls."
        />
        <meta
          name="panora-design-story"
          content="Start a chat, attach reports or files as durable context, and learn through a compact grounded conversation."
        />
        <meta
          name="panora-design-first-viewport"
          content="An empty new chat with prompt starters and the same elaborate composer used throughout every conversation."
        />
        <meta
          name="panora-design-form"
          content="Approved combination: calm chat readability, dense report selection, and tactile composer, voice, and settings interactions."
        />
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>

      <body>
        <div
          data-testid="app-container"
          style={{ display: 'flex', flex: 1, minHeight: '100dvh' }}
        >
          <PlatformSpecificRootProvider>
            <TamaguiRootProvider>
              <SafeAreaProvider>
                <InterfaceProvider>
                  <YStack flex={1}>
                    <Slot />
                  </YStack>
                </InterfaceProvider>
              </SafeAreaProvider>
            </TamaguiRootProvider>
          </PlatformSpecificRootProvider>
        </div>
      </body>
    </html>
  )
}
