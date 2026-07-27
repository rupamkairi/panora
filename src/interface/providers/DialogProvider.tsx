import { useCallback, useEffect, useState, type ReactNode } from 'react'

import { AlertDialog } from '../components/overlays/AlertDialog'

type DialogState =
  | { type: null }
  | {
      type: 'error' | 'confirm'
      title: string
      description: string
      resolve?: (value: boolean) => void
    }

let globalShowError: ((error: unknown, title?: string) => void) | null = null
let globalConfirm:
  | ((props: { title?: string; description?: string }) => Promise<boolean>)
  | null = null

export function DialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DialogState>({ type: null })

  const close = useCallback((confirmed: boolean) => {
    setState((current) => {
      if (current.type !== null) current.resolve?.(confirmed)
      return { type: null }
    })
  }, [])

  useEffect(() => {
    globalShowError = (error, title = 'Error') => {
      const description =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : error && typeof error === 'object' && 'message' in error
              ? String(error.message)
              : 'An unexpected error occurred'
      setState({ type: 'error', title, description })
    }
    globalConfirm = ({ title = 'Confirm', description = 'Are you sure?' }) =>
      new Promise<boolean>((resolve) => {
        setState({ type: 'confirm', title, description, resolve })
      })

    return () => {
      globalShowError = null
      globalConfirm = null
    }
  }, [])

  return (
    <>
      {children}
      {state.type !== null ? (
        <AlertDialog
          open
          title={state.title}
          description={state.description}
          variant={state.type === 'confirm' ? 'confirm' : 'acknowledge'}
          onOpenChange={(open) => {
            if (!open) close(false)
          }}
          onCancel={() => close(false)}
          onConfirm={() => close(state.type === 'confirm')}
        />
      ) : null}
    </>
  )
}

export const showError = (error: unknown, title = 'Error') => {
  if (globalShowError) globalShowError(error, title)
  else console.error(`${title}:`, error)
}

export const dialogConfirm = async (props: {
  title?: string
  description?: string
}): Promise<boolean> => globalConfirm?.(props) ?? false
