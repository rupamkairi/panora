import type { ReactNode } from 'react'

export type CatalogEntry = {
  id: string
  title: string
  description?: string
  component: ReactNode
}

export const catalogData: CatalogEntry[] = []
