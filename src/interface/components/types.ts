import type { ReactNode } from 'react'

export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type ToneVariant =
  | 'neutral'
  | 'accent'
  | 'destructive'
  | 'success'
  | 'warning'
  | 'info'

export type AlignmentVariant = 'start' | 'center' | 'end' | 'stretch'

export type SpacingVariant = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

export type CommonProps = {
  disabled?: boolean
  loading?: boolean
  id?: string
  testID?: string
}

export type WithChildren = {
  children?: ReactNode
}

export type NavigationItem = {
  id: string
  label: string
  icon?: ReactNode
  href?: string
  onPress?: () => void
  badge?: string | number
  disabled?: boolean
  children?: NavigationItem[]
}

export type PickedFile = {
  name: string
  uri: string
  mimeType: string
  size: number
  lastModified?: number
  file?: File
}

export type FileValidationError = {
  file: PickedFile
  reason: 'size' | 'type' | 'count'
  message: string
}

export type DropdownItem<T = string> = {
  value: T
  label: string
  icon?: ReactNode
  description?: string
  disabled?: boolean
  shortcut?: string
  destructive?: boolean
}
