import type { ReactNode } from 'react'
import { ScrollView, YStack } from 'tamagui'

import { Link as AppLink } from '~/interface/app/Link'

import { Button } from '../actions/Button'
import { Container } from '../layout/Container'
import { Heading } from '../typography/Heading'
import { Text } from '../typography/Text'

type LegalPageProps = {
  title: string
  updated: string
  children: ReactNode
}

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <ScrollView bg="$background" $platform-web={{ minHeight: '100dvh' }}>
      <Container size="sm" py="$10" px="$4">
        <YStack gap="$6">
          <YStack gap="$1">
            <Heading level="h2" render="h1">
              {title}
            </Heading>
            <Text size="sm" tone="secondary">
              Last updated: {updated}
            </Text>
          </YStack>

          <YStack gap="$5">{children}</YStack>

          <YStack items="flex-start">
            <AppLink href="/" asChild>
              <Button variant="ghost">← Back to Panora</Button>
            </AppLink>
          </YStack>
        </YStack>
      </Container>
    </ScrollView>
  )
}

export function LegalSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <YStack gap="$2">
      <Heading level="h5" render="h2">
        {title}
      </Heading>
      {children}
    </YStack>
  )
}
