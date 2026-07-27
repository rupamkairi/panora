import { YStack, SizableText, isWeb } from 'tamagui'

import type { ReactNode } from 'react'

export const CatalogSection = ({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) => {
  return (
    <YStack
      gap="$4"
      p="$6"
      bg="$surface"
      rounded="$4"
      borderWidth={1}
      borderColor="$outlineVariant"
    >
      <YStack gap="$1">
        <SizableText
          fontFamily="$heading"
          fontSize={24}
          fontWeight="600"
          color="$content"
        >
          {title}
        </SizableText>
        {description && (
          <SizableText fontFamily="$body" fontSize={16} color="$contentSecondary">
            {description}
          </SizableText>
        )}
      </YStack>
      <YStack gap="$6">
        {Array.isArray(children) ? (
          (children as ReactNode[]).map((child, i) => (
            <YStack key={i} gap="$3">
              {child}
            </YStack>
          ))
        ) : (
          <YStack gap="$3">{children}</YStack>
        )}
      </YStack>
    </YStack>
  )
}
