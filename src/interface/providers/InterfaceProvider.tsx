import { type ReactNode } from 'react'

import { DialogProvider } from './DialogProvider'
import { ToastProvider } from './ToastProvider'
import { OverlayProvider } from './OverlayProvider'

export function InterfaceProvider({ children }: { children: ReactNode }) {
  return (
    <OverlayProvider>
      <ToastProvider>
        <DialogProvider>{children}</DialogProvider>
      </ToastProvider>
    </OverlayProvider>
  )
}

export { DialogProvider, showError, dialogConfirm } from './DialogProvider'
export { ToastProvider, showToast, hideToast } from './ToastProvider'
export { OverlayProvider } from './OverlayProvider'
