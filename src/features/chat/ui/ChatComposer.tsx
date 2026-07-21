import { useState } from 'react'
import { Platform } from 'react-native'
import { Spinner, XStack, YStack } from 'tamagui'

import { IconButton } from '~/interface/buttons/IconButton'
import { Card } from '~/interface/design/Surface'
import { TextArea } from '~/interface/forms/TextArea'
import {
  MicrophoneIcon,
  PaperclipIcon,
  PlusIcon,
  SendIcon,
  ToolIcon,
} from '~/interface/icons/phosphor/ChatActionIcons'

type ChatComposerProps = {
  isSending: boolean
  onSend: (message: string) => boolean
}

export function ChatComposer({ isSending, onSend }: ChatComposerProps) {
  const [value, setValue] = useState('')
  const canSend = value.trim().length > 0 && !isSending

  const handleSend = () => {
    if (canSend && onSend(value)) setValue('')
  }

  return (
    <Card height={148} p="$5" bg="#FFFFFF" rounded="$6">
      <TextArea
        aria-label="Message Panora"
        multiline
        placeholder="Ask Panora anything..."
        value={value}
        onChangeText={setValue}
        onSubmitEditing={() => {
          if (Platform.OS === 'web') handleSend()
        }}
        blurOnSubmit={false}
      />

      <XStack height={48} mt="$2" items="flex-end" justify="space-between">
        <XStack items="center" gap="$4">
          <ComposerIcon label="Add">
            <PlusIcon size={24} />
          </ComposerIcon>
          <ComposerIcon label="Attach file">
            <PaperclipIcon size={24} />
          </ComposerIcon>
          <ComposerIcon label="Tools">
            <ToolIcon size={24} />
          </ComposerIcon>
          <ComposerIcon label="Voice input">
            <MicrophoneIcon size={24} />
          </ComposerIcon>
        </XStack>

        <IconButton
          aria-disabled={!canSend}
          aria-label="Send message"
          role="button"
          variant="primary"
          onPress={canSend ? handleSend : undefined}
          opacity={canSend ? 1 : 0.45}
          pointerEvents={canSend ? 'auto' : 'none'}
          rounded="$3"
        >
          {isSending ? (
            <Spinner color="white" size="small" />
          ) : (
            <SendIcon color="white" size={24} />
          )}
        </IconButton>
      </XStack>
    </Card>
  )
}

function ComposerIcon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <IconButton
      aria-label={label}
      role="button"
      variant="ghost"
      width={24}
      height={40}
      rounded="$0"
    >
      {children}
    </IconButton>
  )
}
