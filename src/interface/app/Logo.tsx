import { SizableText, XStack } from 'tamagui'

import { LogoIcon } from './LogoIcon'

export const Logo = ({ height = 24 }: { height?: number }) => {
  return (
    <XStack items="center" gap={Math.max(8, height * 0.3)}>
      <LogoIcon size={height} />
      <SizableText
        select="none"
        fontFamily="$brand"
        fontWeight="600"
        fontSize={height * 0.7}
        lineHeight={height * 0.8}
      >
        Panora
      </SizableText>
    </XStack>
  )
}
