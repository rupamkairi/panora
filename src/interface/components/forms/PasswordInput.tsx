import { Input as TamaguiInput, styled, XStack } from 'tamagui'
import { useState, type ReactNode } from 'react'
import { colors } from '../colors'
import { IconButton } from '../actions/IconButton'

const StyledInput = styled(TamaguiInput, {
  height: 40,
  fontSize: 14,
  fontFamily: '$body',
  color: colors.content,
  bg: colors.surface,
  borderColor: colors.outlineVariant,
  borderWidth: 1,
  rounded: '$2',
  px: '$3',
  flex: 1,
  placeholderTextColor: colors.outline as any,
  hoverStyle: { borderColor: colors.outline },
  focusStyle: {
    borderColor: colors.accent,
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: colors.accent,
    outlineOffset: -1,
  },
})

export const PasswordInput = (
  props: React.ComponentProps<typeof StyledInput> & { toggleIcon?: ReactNode },
) => {
  const [show, setShow] = useState(false)
  return (
    <XStack items="center" gap="$2">
      <StyledInput
        {...props}
        secureTextEntry={!show}
        autoComplete="password"
        textContentType="password"
      />
      <IconButton
        variant="ghost"
        onPress={() => setShow(!show)}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? '🙈' : '👁'}
      </IconButton>
    </XStack>
  )
}
