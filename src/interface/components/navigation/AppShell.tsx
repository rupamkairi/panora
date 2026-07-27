import { useCallback, useState, type ReactNode } from 'react'
import { useWindowDimensions } from 'react-native'
import { XStack, YStack } from 'tamagui'

import { colors } from '../colors'
import { AppDrawer } from './AppDrawer'
import { AppSidebar } from './AppSidebar'

import type { NavigationItem } from '../types'

export type AppShellProps = {
  navigation: NavigationItem[]
  header?: ReactNode
  sidebarHeader?: ReactNode
  sidebarFooter?: ReactNode
  children?: ReactNode
  sidebarOpen?: boolean
  defaultSidebarOpen?: boolean
  onSidebarOpenChange?: (open: boolean) => void
  sidebarCollapsed?: boolean
  defaultSidebarCollapsed?: boolean
  onSidebarCollapsedChange?: (collapsed: boolean) => void
  activeId?: string | null
}

export const AppShell = ({
  navigation,
  header,
  sidebarHeader,
  sidebarFooter,
  children,
  sidebarOpen: controlledOpen,
  defaultSidebarOpen = false,
  onSidebarOpenChange,
  sidebarCollapsed: controlledCollapsed,
  defaultSidebarCollapsed = false,
  onSidebarCollapsedChange,
  activeId,
}: AppShellProps) => {
  const { width } = useWindowDimensions()
  const isDesktop = width >= 768
  const [internalOpen, setInternalOpen] = useState(defaultSidebarOpen)
  const [internalCollapsed, setInternalCollapsed] = useState(defaultSidebarCollapsed)
  const sidebarOpen = controlledOpen ?? internalOpen
  const sidebarCollapsed = controlledCollapsed ?? internalCollapsed

  const setSidebarOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setInternalOpen(next)
      onSidebarOpenChange?.(next)
    },
    [controlledOpen, onSidebarOpenChange],
  )
  const setSidebarCollapsed = useCallback(
    (next: boolean) => {
      if (controlledCollapsed === undefined) setInternalCollapsed(next)
      onSidebarCollapsedChange?.(next)
    },
    [controlledCollapsed, onSidebarCollapsedChange],
  )

  return (
    <XStack flex={1} minH={0}>
      {isDesktop ? (
        <AppSidebar
          navigation={navigation}
          collapsed={sidebarCollapsed}
          activeId={activeId}
          header={sidebarHeader}
          footer={sidebarFooter}
        />
      ) : (
        <AppDrawer
          navigation={navigation}
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          activeId={activeId}
          header={sidebarHeader}
          footer={sidebarFooter}
        />
      )}
      <YStack flex={1} minW={0} bg={colors.background} role="main">
        {header}
        {children}
      </YStack>
    </XStack>
  )
}

export const useAppShellToggle = ({
  desktop,
  open,
  collapsed,
  onOpenChange,
  onCollapsedChange,
}: {
  desktop: boolean
  open: boolean
  collapsed: boolean
  onOpenChange: (open: boolean) => void
  onCollapsedChange: (collapsed: boolean) => void
}) =>
  useCallback(() => {
    if (desktop) onCollapsedChange(!collapsed)
    else onOpenChange(!open)
  }, [collapsed, desktop, onCollapsedChange, onOpenChange, open])
