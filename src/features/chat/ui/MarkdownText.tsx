import { EnrichedMarkdownText } from 'react-native-enriched-markdown'
import { Linking } from 'react-native'
import { useTheme } from 'tamagui'

import { fontFamilies } from '~/tamagui/fontFamilies'

type MarkdownTextProps = { children: string; streaming?: boolean }

export function MarkdownText({ children, streaming = false }: MarkdownTextProps) {
  const theme = useTheme()
  const color = theme.content?.val as string
  const secondary = theme.contentSecondary?.val as string
  const accent = theme.accent?.val as string
  const surface = theme.surface1?.val as string
  const outline = theme.outlineVariant?.val as string

  return (
    <EnrichedMarkdownText
      markdown={children}
      flavor="github"
      selectable
      streamingAnimation={streaming}
      streamingConfig={{ tableMode: 'hidden' }}
      onLinkPress={(event) => void Linking.openURL(event.url)}
      markdownStyle={{
        paragraph: {
          color,
          fontFamily: fontFamilies.bricolage.regular,
          fontSize: 16,
          lineHeight: 23,
          marginBottom: 10,
        },
        h1: {
          color,
          fontFamily: fontFamilies.bricolage.semiBold,
          fontSize: 22,
          lineHeight: 27,
          marginBottom: 10,
        },
        h2: {
          color,
          fontFamily: fontFamilies.bricolage.semiBold,
          fontSize: 19,
          lineHeight: 24,
          marginTop: 8,
          marginBottom: 8,
        },
        h3: {
          color,
          fontFamily: fontFamilies.bricolage.semiBold,
          fontSize: 17,
          lineHeight: 22,
          marginTop: 6,
          marginBottom: 6,
        },
        list: {
          color,
          markerColor: accent,
          fontFamily: fontFamilies.bricolage.regular,
          fontSize: 16,
          lineHeight: 23,
          gapWidth: 8,
          marginBottom: 8,
        },
        strong: {
          color,
          fontFamily: fontFamilies.bricolage.semiBold,
          fontWeight: 'normal',
        },
        em: { color: secondary, fontFamily: fontFamilies.bricolage.regular },
        link: {
          color: accent,
          fontFamily: fontFamilies.bricolage.medium,
          underline: true,
        },
        blockquote: {
          color: secondary,
          fontFamily: fontFamilies.bricolage.regular,
          borderColor: accent,
          borderWidth: 2,
          gapWidth: 12,
          backgroundColor: surface,
        },
        codeBlock: {
          color,
          backgroundColor: surface,
          borderColor: outline,
          borderWidth: 1,
          borderRadius: 10,
          padding: 12,
          fontSize: 13,
          lineHeight: 19,
        },
        code: { color, backgroundColor: surface, borderColor: outline, fontSize: 14 },
        thematicBreak: { color: outline, height: 1, marginTop: 12, marginBottom: 12 },
      }}
    />
  )
}
