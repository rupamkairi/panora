import { Image } from 'tamagui'

export const LogoIcon = ({ size = 24 }: { size?: number }) => {
  return (
    <Image
      src="/favicon.png"
      width={size}
      height={size}
      rounded={Math.max(4, size * 0.22)}
      objectFit="contain"
      alt="Panora"
    />
  )
}
