import { useRouter } from 'one'
import { SafeAreaView } from 'react-native-safe-area-context'
import { XStack, YStack, useTheme } from 'tamagui'

import { useThemePreference } from '~/features/theme/ThemePreferenceProvider'
import { IconButton, Text } from '~/interface/components'
import { BackIcon, CheckIcon } from '~/interface/icons/ChatIcons'
import { panoraPalettes, type PanoraThemeName } from '~/tamagui/tamagui.config'

const choices: Array<{
  id: PanoraThemeName
  name: string
  description: string
}> = [
  {
    id: 'saffron',
    name: 'Saffron & Espresso',
    description: 'Warm, focused, and quietly editorial.',
  },
  {
    id: 'apricot',
    name: 'Apricot & Aubergine',
    description: 'Soft apricot with a richer plum accent.',
  },
  {
    id: 'rosewood',
    name: 'Rosewood & Blush',
    description: 'A grounded rose palette with gentle contrast.',
  },
]

export function SettingsPage() {
  const router = useRouter()
  const theme = useTheme()
  const { themeName, setThemeName } = useThemePreference()
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
      <YStack px="$4" pt="$6" gap="$6">
        <YStack gap="$1">
          <Text size="xl" weight="semibold">
            Theme
          </Text>
          <Text tone="secondary">
            Choose a warm light theme. Panora does not use dark mode.
          </Text>
        </YStack>
        <YStack gap="$2">
          {choices.map((choice) => {
            const selected = choice.id === themeName
            const palette = panoraPalettes[choice.id]
            return (
              <XStack
                key={choice.id}
                role="radio"
                aria-checked={selected}
                aria-label={`Use ${choice.name} theme`}
                minH={70}
                items="center"
                gap="$3"
                px="$3"
                rounded="$4"
                bg={selected ? '$surface1' : '$transparent'}
                borderWidth={1}
                borderColor={selected ? '$accent' : '$outlineVariant'}
                pressStyle={{ bg: '$surface1', scale: 0.99 }}
                onPress={() => setThemeName(choice.id)}
              >
                <XStack
                  width={44}
                  height={44}
                  rounded="$10"
                  overflow="hidden"
                  borderWidth={1}
                  borderColor="$outlineVariant"
                >
                  <YStack flex={1} bg={palette.background} />
                  <YStack flex={1} bg={palette.accent} />
                </XStack>
                <YStack flex={1} gap="$0.5">
                  <Text weight="semibold">{choice.name}</Text>
                  <Text size="sm" tone="secondary">
                    {choice.description}
                  </Text>
                </YStack>
                <YStack
                  width={24}
                  height={24}
                  rounded="$10"
                  borderWidth={1.5}
                  borderColor={selected ? '$accent' : '$outline'}
                  bg={selected ? '$accent' : '$transparent'}
                  items="center"
                  justify="center"
                >
                  {selected ? (
                    <CheckIcon size={16} color={theme.contentInverse?.val as string} />
                  ) : null}
                </YStack>
              </XStack>
            )
          })}
        </YStack>
      </YStack>
    </SafeAreaView>
  )
}
