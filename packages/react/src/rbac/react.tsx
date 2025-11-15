import * as React from 'react'
import { RBACManager, MemoryRBACStorage } from './rbac-manager'
import type { RBACContext, RBACStorage, Role } from './types'

interface RBACProviderValue {
  manager: RBACManager
  context?: RBACContext
  setContext: (context: RBACContext) => void
  clearContext: () => void
  hasPermission: (
    permission: string,
    contextOverride?: RBACContext
  ) => Promise<boolean>
  hasAnyPermission: (
    permissions: string[],
    contextOverride?: RBACContext
  ) => Promise<boolean>
  hasAllPermissions: (
    permissions: string[],
    contextOverride?: RBACContext
  ) => Promise<boolean>
  getPermissions: (contextOverride?: RBACContext) => Promise<string[]>
  ensureRole: (role: Role) => void
  resetRoleCache: () => void
}

const RBACReactContext = React.createContext<RBACProviderValue | null>(null)

export interface RBACProviderProps {
  storage?: RBACStorage
  initialContext?: RBACContext
  children: React.ReactNode
}

/**
 * Provides RBAC utilities via React context.
 */
export function RBACProvider({
  storage,
  initialContext,
  children,
}: RBACProviderProps) {
  const storageInstance = React.useMemo<RBACStorage>(
    () => storage ?? new MemoryRBACStorage(),
    [storage]
  )

  const manager = React.useMemo(
    () => new RBACManager(storageInstance),
    [storageInstance]
  )

  const [context, setContextState] = React.useState<RBACContext | undefined>(
    () => initialContext
  )

  React.useEffect(() => {
    if (initialContext) {
      setContextState(initialContext)
    }
  }, [initialContext])

  const setContext = React.useCallback((value: RBACContext) => {
    setContextState(value)
  }, [])

  const clearContext = React.useCallback(() => {
    setContextState(undefined)
  }, [])

  const ensureRole = React.useCallback(
    (role: Role) => {
      // Type guard to check if storage has addRole method
      if (
        storageInstance &&
        'addRole' in storageInstance &&
        typeof (storageInstance as { addRole?: (role: Role) => void }).addRole === 'function'
      ) {
        (storageInstance as { addRole: (role: Role) => void }).addRole(role)
        manager.clearCache()
      }
    },
    [storageInstance, manager]
  )

  const hasPermission = React.useCallback(
    async (permission: string, contextOverride?: RBACContext) => {
      const ctx = contextOverride ?? context
      if (!ctx) return false
      return manager.hasPermission(ctx, permission)
    },
    [manager, context]
  )

  const hasAnyPermission = React.useCallback(
    async (permissions: string[], contextOverride?: RBACContext) => {
      const ctx = contextOverride ?? context
      if (!ctx) return false
      return manager.hasAnyPermission(ctx, permissions)
    },
    [manager, context]
  )

  const hasAllPermissions = React.useCallback(
    async (permissions: string[], contextOverride?: RBACContext) => {
      const ctx = contextOverride ?? context
      if (!ctx) return false
      return manager.hasAllPermissions(ctx, permissions)
    },
    [manager, context]
  )

  const getPermissions = React.useCallback(
    async (contextOverride?: RBACContext) => {
      const ctx = contextOverride ?? context
      if (!ctx) return []
      return manager.getUserPermissions(ctx)
    },
    [manager, context]
  )

  const resetRoleCache = React.useCallback(() => {
    manager.clearCache()
  }, [manager])

  const value = React.useMemo<RBACProviderValue>(
    () => ({
      manager,
      context,
      setContext,
      clearContext,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      getPermissions,
      ensureRole,
      resetRoleCache,
    }),
    [
      manager,
      context,
      setContext,
      clearContext,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      getPermissions,
      ensureRole,
      resetRoleCache,
    ]
  )

  return (
    <RBACReactContext.Provider value={value}>
      {children}
    </RBACReactContext.Provider>
  )
}

/**
 * Hook exposing RBAC helpers.
 */
export function useRBAC(): RBACProviderValue {
  const ctx = React.useContext(RBACReactContext)
  if (!ctx) {
    throw new Error('useRBAC must be used within an RBACProvider')
  }
  return ctx
}
