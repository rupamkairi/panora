import { useRouter } from 'one'
import { SafeAreaView } from 'react-native-safe-area-context'
import { XStack, YStack, useTheme } from 'tamagui'

import { IconButton, Text } from '~/interface/components'
import { BackIcon } from '~/interface/icons/ChatIcons'

export function SettingsPage() {
  const router = useRouter()
  const theme = useTheme()
  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{ flex: 1, backgroundColor: theme.background?.val as string }}
    >
      <XStack
        height={52}
        px="$2"
        items="center"
        borderBottomWidth={1}
        borderBottomColor="$outlineVariant"
      >
        <IconButton aria-label="Back to chat" onPress={() => router.back()}>
          <BackIcon color={theme.content?.val as string} />
        </IconButton>
        <Text flex={1} center size="sm" weight="semibold" pr={44}>
          Settings
        </Text>
      </XStack>
      <YStack px="$4" pt="$6" gap="$2">
        <YStack gap="$1">
          <Text size="xl" weight="semibold">
            Appearance
          </Text>
          <Text tone="secondary">
            Panora uses the Rosewood & Blush light theme across the app.
          </Text>
        </YStack>
      </YStack>
    </SafeAreaView>
  )
}
