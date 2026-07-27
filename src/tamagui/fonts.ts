import { createSystemFont } from '@tamagui/config/v5'

import { fontFamilies } from './fontFamilies'

const body = createSystemFont({
  font: {
    family: fontFamilies.bricolage.regular,
    weight: {
      1: '400',
      4: '400',
      5: '400',
      6: '600',
      7: '600',
      8: '600',
      9: '700',
      10: '700',
      true: '400',
    },
    face: {
      400: { normal: fontFamilies.bricolage.regular },
      500: { normal: fontFamilies.bricolage.medium },
      600: { normal: fontFamilies.bricolage.semiBold },
      700: { normal: fontFamilies.bricolage.bold },
    },
  },
})

const heading = createSystemFont({
  font: {
    family: fontFamilies.bricolage.regular,
    weight: {
      1: '400',
      4: '500',
      5: '500',
      6: '600',
      7: '600',
      8: '600',
      9: '700',
      10: '700',
      true: '500',
    },
    face: {
      400: { normal: fontFamilies.bricolage.regular },
      500: { normal: fontFamilies.bricolage.medium },
      600: { normal: fontFamilies.bricolage.semiBold },
      700: { normal: fontFamilies.bricolage.bold },
    },
  },
  sizeLineHeight: (size) => Math.round(size * 1.2),
})

const mono = createSystemFont({
  sizeLineHeight: (size) => (size >= 16 ? size * 1.2 + 8 : size * 1.15 + 5),
  font: {
    family: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace',
    weight: {
      0: '400',
    },
  },
})

export const fonts = {
  body,
  heading,
  brand: createSystemFont({
    font: {
      family: fontFamilies.anybody.regular,
      face: {
        400: { normal: fontFamilies.anybody.regular },
        600: { normal: fontFamilies.anybody.semiBold },
      },
    },
  }),
  mono,
}
