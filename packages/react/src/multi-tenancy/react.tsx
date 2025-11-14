import * as React from 'react'
import { MemoryTenantStorage, TenantManager } from './tenant-manager'
import type { Tenant, TenantContext, TenantStorage } from './types'

interface MultiTenancyContextValue {
  manager: TenantManager
  context?: TenantContext
  setContext: (context: TenantContext) => void
  clearContext: () => void
  ensureTenant: (tenant: Tenant) => Promise<void>
  isActive: (tenantId?: string) => Promise<boolean>
  getNamespace: (tenantId?: string) => string | null
  getCachePrefix: (tenantId?: string) => string | null
}

const MultiTenancyContext =
  React.createContext<MultiTenancyContextValue | null>(null)

export interface MultiTenancyProviderProps {
  storage?: TenantStorage
  initialContext?: TenantContext
  children: React.ReactNode
}

/**
 * Provides multi-tenancy helpers through React context.
 */
export function MultiTenancyProvider({
  storage,
  initialContext,
  children,
}: MultiTenancyProviderProps) {
  const manager = React.useMemo(
    () => new TenantManager(storage ?? new MemoryTenantStorage()),
    [storage]
  )

  const [context, setContextState] = React.useState<TenantContext | undefined>(
    () => {
      if (initialContext) {
        manager.setContext(initialContext)
      }
      return initialContext
    }
  )

  const setContext = React.useCallback(
    (value: TenantContext) => {
      manager.setContext(value)
      setContextState(value)
    },
    [manager]
  )

  const clearContext = React.useCallback(() => {
    manager.setContext(undefined as any)
    setContextState(undefined)
  }, [manager])

  const ensureTenant = React.useCallback(
    async (tenant: Tenant) => {
      await manager.updateTenant(tenant)
    },
    [manager]
  )

  const isActive = React.useCallback(
    async (tenantId?: string) => {
      const id = tenantId ?? context?.tenant.id
      if (!id) return false
      return manager.isActive(id)
    },
    [manager, context]
  )

  const getNamespace = React.useCallback(
    (tenantId?: string) => {
      const id = tenantId ?? context?.tenant.id
      return id ? manager.getNamespace(id) : null
    },
    [manager, context]
  )

  const getCachePrefix = React.useCallback(
    (tenantId?: string) => {
      const id = tenantId ?? context?.tenant.id
      return id ? manager.getCachePrefix(id) : null
    },
    [manager, context]
  )

  const value = React.useMemo<MultiTenancyContextValue>(
    () => ({
      manager,
      context,
      setContext,
      clearContext,
      ensureTenant,
      isActive,
      getNamespace,
      getCachePrefix,
    }),
    [
      manager,
      context,
      setContext,
      clearContext,
      ensureTenant,
      isActive,
      getNamespace,
      getCachePrefix,
    ]
  )

  return (
    <MultiTenancyContext.Provider value={value}>
      {children}
    </MultiTenancyContext.Provider>
  )
}

/**
 * Hook exposing multi-tenancy utilities.
 */
export function useMultiTenancy(): MultiTenancyContextValue {
  const ctx = React.useContext(MultiTenancyContext)
  if (!ctx) {
    throw new Error(
      'useMultiTenancy must be used within a MultiTenancyProvider'
    )
  }
  return ctx
}
