import { Linking } from 'react-native'
import { SizableText, XStack, YStack } from 'tamagui'

import { BodyLargeText, HeadlineMediumText } from '~/interface/design/Typography'

import { parseMarkdownBlocks } from '../markdown'

type MarkdownTextProps = { children: string }

const inlinePattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g

const renderInline = (content: string) =>
  content
    .split(inlinePattern)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <SizableText key={index} fontFamily="$body" fontWeight="700">
            {part.slice(2, -2)}
          </SizableText>
        )
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <SizableText key={index} fontFamily="$mono" bg="#E6E8EA" fontSize={16}>
            {part.slice(1, -1)}
          </SizableText>
        )
      }

      const link = /^\[([^\]]+)]\((https?:\/\/[^)]+)\)$/.exec(part)
      if (link) {
        return (
          <SizableText
            role="link"
            key={index}
            color="#0051D5"
            textDecorationLine="underline"
            onPress={() => void Linking.openURL(link[2] || '')}
          >
            {link[1]}
          </SizableText>
        )
      }
      return part
    })

export function MarkdownText({ children }: MarkdownTextProps) {
  let orderedIndex = 0
  return (
    <YStack gap="$4">
      {parseMarkdownBlocks(children).map((block, index) => {
        if (block.type !== 'list-item') orderedIndex = 0

        if (block.type === 'heading') {
          return (
            <HeadlineMediumText
              key={index}
              selectable
              fontSize={block.level === 1 ? 21 : 16}
              lineHeight={block.level === 1 ? 28 : 23}
            >
              {renderInline(block.content)}
            </HeadlineMediumText>
          )
        }

        if (block.type === 'code') {
          return (
            <YStack key={index} bg="#131B2E" rounded="$3" p="$4">
              <SizableText
                selectable
                color="#E9EDF7"
                fontFamily="$mono"
                fontSize={14}
                lineHeight={21}
              >
                {block.content}
              </SizableText>
            </YStack>
          )
        }

        if (block.type === 'list-item') {
          if (block.ordered) orderedIndex += 1
          return (
            <XStack key={index} items="flex-start" gap="$3">
              <SizableText
                color="#0051D5"
                fontFamily="$body"
                fontWeight="700"
                fontSize={16}
                lineHeight={28}
                minW={20}
              >
                {block.ordered ? `${orderedIndex}.` : '✓'}
              </SizableText>
              <BodyLargeText selectable shrink={1}>
                {renderInline(block.content)}
              </BodyLargeText>
            </XStack>
          )
        }

        return (
          <BodyLargeText key={index} selectable>
            {renderInline(block.content)}
          </BodyLargeText>
        )
      })}
    </YStack>
  )
}
