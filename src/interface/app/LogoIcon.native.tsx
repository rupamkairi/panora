import type { ImageSourcePropType } from 'react-native'
import { Image } from 'tamagui'

import panoraLogo from '../../../assets/logo.png'

const logoAsset = panoraLogo as unknown as number

export const LogoIcon = ({ size = 24 }: { size?: number }) => {
  return (
    <Image
      source={logoAsset as ImageSourcePropType}
      width={size}
      height={size}
      rounded={Math.max(4, size * 0.22)}
      resizeMode="contain"
      accessibilityLabel="Panora"
    />
  )
}
