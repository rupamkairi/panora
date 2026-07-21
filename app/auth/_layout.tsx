import { Redirect, Slot, Stack, usePathname } from 'one'
import { Configuration } from 'tamagui'

import { useAuth } from '~/features/auth/client/authClient'
import { DialogProvider } from '~/interface/dialogs/Dialog'
import { PlatformSpecificRootProvider } from '~/interface/platform/PlatformSpecificRootProvider'
import { ToastProvider } from '~/interface/toast/Toast'
import { ProvideZero } from '~/zero/client'

export function AuthLayout() {
  const { state } = useAuth()
  const pathname = usePathname()

  if (state === 'loading') return null
  if (state === 'logged-in' && pathname.startsWith('/auth')) {
    return <Redirect href="/" />
  }

  return (
    <Configuration disableSSR>
      <ProvideZero>
        <ToastProvider>
          <DialogProvider>
            <PlatformSpecificRootProvider>
              {process.env.VITE_PLATFORM === 'web' ? (
                <Slot />
              ) : (
                <Stack screenOptions={{ headerShown: false }} initialRouteName="login">
                  <Stack.Screen name="login" />
                  <Stack.Screen name="login/password" />
                  <Stack.Screen name="signup/[method]" />
                </Stack>
              )}
            </PlatformSpecificRootProvider>
          </DialogProvider>
        </ToastProvider>
      </ProvideZero>
    </Configuration>
  )
}
