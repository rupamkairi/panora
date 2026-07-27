import { useParams, useRouter, createRoute } from 'one'
import { memo, useLayoutEffect, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Spinner, useEvent, XStack, YStack } from 'tamagui'

import { Button, Heading, IconButton, Input, Page, Text } from '~/interface/components'
import { showError } from '~/interface/dialogs/actions'
import { CaretLeftIcon } from '~/interface/icons/phosphor/CaretLeftIcon'

const route = createRoute<'/auth/signup/[method]'>()

export const SignupPage = memo(() => {
  const { method } = useParams<{
    method?: 'email'
  }>()
  const { top } = useSafeAreaInsets()
  const router = useRouter()
  const inputRef = useRef<any>(null)
  const [inputValue, setInputValue] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const isDisabled = !inputValue.trim()

  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus?.()
    }, 650)

    return () => clearTimeout(timer)
  }, [])

  const handleGoBack = useEvent(() => router.back())

  const handleContinue = useEvent(async () => {
    if (!method) {
      showError('Authentication method is not specified.')
      return
    }

    setLoading(true)

    try {
      router.push(
        `/auth/login/password?method=${method}&value=${encodeURIComponent(inputValue)}`,
      )
    } finally {
      setLoading(false)
    }
  })

  if (method !== 'email') {
    return (
      <Page pt={top} px="$4">
        <XStack items="center" gap="$3">
          <IconButton aria-label="Go back" onPress={handleGoBack}>
            <CaretLeftIcon size={24} />
          </IconButton>
        </XStack>
        <YStack flex={1} items="center" justify="center">
          <Text tone="secondary">Invalid authentication method</Text>
        </YStack>
      </Page>
    )
  }

  return (
    <Page pt={top} px="$4">
      <XStack height={52} items="center">
        <IconButton aria-label="Go back" onPress={handleGoBack}>
          <CaretLeftIcon size={20} />
        </IconButton>
      </XStack>
      <YStack flex={1} justify="center" items="center" pb="$10">
        <YStack width="100%" maxW={380} px="$2" gap="$5">
          <YStack gap="$1">
            <Heading level="h3">Continue with email</Heading>
            <Text tone="secondary">Sign in or create an account with your email.</Text>
          </YStack>
          <YStack gap="$3">
            <Input
              data-testid="email-input"
              ref={inputRef}
              placeholder="Enter email address"
              value={inputValue}
              onChange={(e) => setInputValue((e.target as HTMLInputElement).value)}
              autoCapitalize="none"
              onSubmitEditing={handleContinue}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              aria-label="Email address"
            />

            <Button
              data-testid="next-button"
              onPress={handleContinue}
              disabled={isDisabled || loading}
            >
              {loading ? <Spinner size="small" /> : 'Next'}
            </Button>
          </YStack>
        </YStack>
      </YStack>
    </Page>
  )
})
