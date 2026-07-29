import { Redirect, Slot, Stack, usePathname } from 'one'
import { Configuration, isWeb } from 'tamagui'

import { getProductRoute } from '~/constants/navigation'
import { useAuth } from '~/features/auth/client/authClient'
import { PlatformSpecificRootProvider } from '~/interface/platform/PlatformSpecificRootProvider'

export function AuthLayout() {
  const { state } = useAuth()
  const pathname = usePathname()

  if (state === 'loading') return null
  if (state === 'logged-in' && pathname.startsWith('/auth')) {
    return <Redirect href={getProductRoute(isWeb)} />
  }

  return (
    <Configuration disableSSR>
      <PlatformSpecificRootProvider>
        {isWeb ? (
          <Slot />
        ) : (
          <Stack screenOptions={{ headerShown: false }} initialRouteName="login">
            <Stack.Screen name="login" />
            <Stack.Screen name="login/password" />
            <Stack.Screen name="signup/[method]" />
          </Stack>
        )}
      </PlatformSpecificRootProvider>
    </Configuration>
  )
}
