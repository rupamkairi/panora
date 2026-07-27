import { Component, type ReactNode } from 'react'
import { YStack } from 'tamagui'
import { Button, Heading, Text } from '~/interface/components'

type Props = { children: ReactNode }
type State = { error: Error | null }

export class ChatErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <YStack flex={1} items="center" justify="center" px="$4" gap="$4">
          <YStack items="center" gap="$2">
            <Heading level="h3">Something went wrong</Heading>
            <Text tone="secondary" text="center">
              The chat interface encountered an unexpected error. Your conversations are
              safe.
            </Text>
          </YStack>
          <Button onPress={this.handleReset} variant="outline">
            Try again
          </Button>
        </YStack>
      )
    }

    return this.props.children
  }
}
