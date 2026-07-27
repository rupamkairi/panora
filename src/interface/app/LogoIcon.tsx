import { Image } from 'tamagui'
import type { ImageSourcePropType } from 'react-native'

import panoraLogo from '../../../assets/logo.png'

const logoAsset = panoraLogo as unknown as string | number
const logoSource: ImageSourcePropType =
  typeof logoAsset === 'string' ? { uri: logoAsset } : logoAsset

export const LogoIcon = ({ size = 24 }: { size?: number }) => {
  return (
    <Image
      src={typeof logoAsset === 'string' ? logoAsset : undefined}
      source={logoSource}
      width={size}
      height={size}
      rounded={Math.max(4, size * 0.22)}
      resizeMode="contain"
      accessibilityLabel="Panora"
    />
  )
}
