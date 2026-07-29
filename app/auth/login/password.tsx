import { router, useParams } from 'one'
import { useState } from 'react'
import { Keyboard } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { isWeb, YStack } from 'tamagui'

import { getProductRoute } from '~/constants/navigation'
import { passwordLogin } from '~/features/auth/client/passwordLogin'
import { Button, Heading, Input, Page, Text } from '~/interface/components'
import { showError } from '~/interface/dialogs/actions'

export const PasswordPage = () => {
  const params = useParams<{ value?: string }>()
  const insets = useSafeAreaInsets()
  const [loading, setLoading] = useState<boolean>(false)

  const displayValue = params.value || 'example@gmail.com'

  const [password, setPassword] = useState('')

  const handleContinue = async () => {
    if (!params.value) {
      showError('Email is not specified.')
      return
    }

    setLoading(true)

    try {
      const { error } = await passwordLogin(params.value, password)

      if (error) {
        Keyboard.dismiss()
        showError(error)
        return
      }
      router.replace(getProductRoute(isWeb))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page px="$4" pt={insets.top} pb={Math.max(insets.bottom, 16)}>
      <YStack flex={1} justify="center" items="center">
        <YStack width="100%" maxW={380} px="$2" gap="$5">
          <YStack gap="$1">
            <Heading level="h3">Enter password</Heading>
            <Text tone="secondary">Use the password for {displayValue}.</Text>
          </YStack>
          <Input
            data-testid="password-input"
            type="password"
            autoFocus
            value={password}
            aria-label="Password"
            onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
            onSubmitEditing={handleContinue}
          />
          <Button
            data-testid="submit-password-button"
            onPress={handleContinue}
            disabled={!password || loading}
          >
            {loading ? 'Verifying...' : 'Next'}
          </Button>
        </YStack>
      </YStack>
    </Page>
  )
}
