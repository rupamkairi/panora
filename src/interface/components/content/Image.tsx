import { Image as TamaguiImage, styled } from 'tamagui'

export const Image = styled(TamaguiImage, {
  variants: {
    rounded: { true: { borderRadius: '$2' } },
    cover: { true: { objectFit: 'cover' } },
    contain: { true: { objectFit: 'contain' } },
  } as const,
  defaultVariants: { rounded: false, cover: false, contain: true },
})
