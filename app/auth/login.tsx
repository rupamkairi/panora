import { XStack, YStack } from 'tamagui'

import { APP_NAME } from '~/constants/app'
import { Link } from '~/interface/app/Link'
import { LogoIcon } from '~/interface/app/LogoIcon'
import { Button, Heading, Page, Text } from '~/interface/components'
import { AppleIcon } from '~/interface/icons/AppleIcon'
import { GoogleIcon } from '~/interface/icons/GoogleIcon'
import { showToast } from '~/interface/toast/helpers'

export const LoginPage = () => {
  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    showToast(`${provider} login coming soon!`, { type: 'info' })
  }

  return (
    <Page justify="center" items="center" px="$4" $platform-web={{ minHeight: '100vh' }}>
      <YStack width="100%" maxW={380} px="$2" gap="$6">
        <YStack items="center" gap="$3">
          <LogoIcon size={72} />
          <YStack items="center" gap="$1">
            <Heading level="h3" text="center">
              Welcome to {APP_NAME}
            </Heading>
            <Text tone="secondary" text="center">
              Continue with your preferred sign-in method.
            </Text>
          </YStack>
        </YStack>

        <YStack
          key="welcome-content"
          gap="$3"
          items="center"
          width="100%"
          position="relative"
          overflow="hidden"
        >
          <YStack width="100%" gap="$3">
            <Link
              href="/auth/signup/email"
              $platform-web={{
                display: 'contents',
              }}
              asChild
            >
              <Button variant="primary" width="100%">
                Continue with Email
              </Button>
            </Link>
          </YStack>

          <XStack width="100%" gap="$3" justify="center" overflow="visible">
            <Button
              uiSize="md"
              variant="secondary"
              flex={1}
              onPress={() => handleSocialLogin('google')}
              pressStyle={{
                scale: 0.97,
                bg: '$color2',
              }}
              hoverStyle={{
                bg: '$color2',
              }}
              icon={<GoogleIcon size={18} />}
            >
              Google
            </Button>

            <Button
              uiSize="md"
              variant="secondary"
              flex={1}
              onPress={() => handleSocialLogin('apple')}
              pressStyle={{
                scale: 0.97,
                bg: '$color2',
              }}
              hoverStyle={{
                bg: '$color2',
              }}
              icon={<AppleIcon size={20} />}
            >
              Apple
            </Button>
          </XStack>
        </YStack>
      </YStack>
    </Page>
  )
}
