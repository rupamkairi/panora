import { TextArea as TamaguiTextArea, styled } from 'tamagui'

export const TextArea = styled(TamaguiTextArea, {
  color: '#191C1E',
  fontFamily: '$body',
  fontSize: 18,
  height: 60,
  p: 0,
  borderWidth: 0,
  bg: 'transparent',
  placeholderTextColor: '$color8',
  textAlignVertical: 'top',

  focusVisibleStyle: {
    borderWidth: 0,
    outlineWidth: 0,
  },
})
