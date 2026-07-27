import {
  ToastProvider as TamaguiToastProvider,
  Toast,
  ToastViewport,
  useToastController,
  useToastState,
} from '@tamagui/toast'
import { createEmitter, useEmitter } from '@take-out/helpers'
import { type ReactNode } from 'react'
import { YStack } from 'tamagui'
import { colors } from '../components/colors'

export type ToastType = 'error' | 'warn' | 'info' | 'success'
export type ToastOptions = {
  type?: ToastType
  message?: string
  duration?: number
  action?: { label: string; onPress: () => void }
}

const toastEmitter = createEmitter<
  { type: 'show'; toast: { title: string } & ToastOptions } | { type: 'hide' }
>('toast-provider', { type: 'hide' })

export const showToast = (title: string, options: ToastOptions = {}) => {
  toastEmitter.emit({ type: 'show', toast: { title, ...options } })
}
export const hideToast = () => {
  toastEmitter.emit({ type: 'hide' })
}

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <TamaguiToastProvider swipeDirection="horizontal">
      <ToastDisplay />
      <ToastViewport
        portalToRoot
        zIndex={100000}
        flexDirection="column-reverse"
        top={0}
        left={0}
        right={0}
        mx="auto"
      />
      {children}
    </TamaguiToastProvider>
  )
}

const ToastDisplay = () => {
  const currentToast = useToastState()
  const controller = useToastController()
  useEmitter(toastEmitter, (val) => {
    if (val.type === 'hide') controller.hide()
    else
      controller.show(val.toast.title, {
        message: val.toast.message,
        duration: val.toast.duration,
        customData: { type: val.toast.type },
      })
  })

  if (!currentToast || currentToast.isHandledNatively) return null

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration || 3000}
      enterStyle={{ opacity: 0, scale: 1, y: 0 }}
      exitStyle={{ opacity: 0, scale: 1, y: 0 }}
      y={20}
      opacity={1}
      scale={1}
      maxW={250}
      overflow="hidden"
      viewportName={currentToast.viewportName}
      bg={colors.surface}
      py="$2.5"
      px="$4"
      shadowColor={colors.black}
      shadowRadius={8}
      shadowOffset={{ height: 4, width: 0 }}
      rounded="$3"
    >
      <YStack>
        <Toast.Title numberOfLines={1} size="$3" color={colors.content}>
          {currentToast.title ?? ''}
        </Toast.Title>
        {!!currentToast.message && (
          <Toast.Description size="$2" color={colors.contentSecondary}>
            {currentToast.message}
          </Toast.Description>
        )}
      </YStack>
    </Toast>
  )
}
