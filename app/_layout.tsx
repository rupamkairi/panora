import './root.css'

import { Slot } from 'one'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'

import { PlatformSpecificRootProvider } from '~/interface/platform/PlatformSpecificRootProvider'
import { TamaguiRootProvider } from '~/tamagui/TamaguiRootProvider'

export function Layout() {
  return (
    <html lang="en-US">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>Panora</title>
        <meta name="description" content="Panora, your AI research assistant." />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />
        <link rel="icon" href="/favicon.png" />
      </head>

      <body>
        <div
          data-testid="app-container"
          style={{ display: 'flex', flex: 1, minHeight: '100dvh' }}
        >
          <PlatformSpecificRootProvider>
            <TamaguiRootProvider>
              <SafeAreaProvider>
                <YStack flex={1}>
                  <Slot />
                </YStack>
              </SafeAreaProvider>
            </TamaguiRootProvider>
          </PlatformSpecificRootProvider>
        </div>
      </body>
    </html>
  )
}
