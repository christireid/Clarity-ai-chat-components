/**
 * Multi-Tenancy Utilities
 *
 * Optional utilities for building multi-tenant AI applications.
 * Handle tenant isolation, quotas, and resource management.
 *
 * @example
 * ```tsx
 * import { TenantManager, MemoryTenantStorage } from '@clarity-chat/react'
 *
 * const tenants = new TenantManager(new MemoryTenantStorage())
 *
 * // Set current tenant context
 * tenants.setContext({
 *   tenant: {
 *     id: 'tenant-123',
 *     name: 'Acme Corp',
 *     status: 'active',
 *   },
 *   userId: 'user-456',
 * })
 *
 * // Use tenant-specific namespace
 * const namespace = tenants.getNamespace('tenant-123')
 * await vectorStore.query({ namespace, vector, topK: 10 })
 *
 * // Get cache prefix
 * const cacheKey = tenants.getCachePrefix('tenant-123') + 'my-key'
 * ```
 */

export * from './types'
export * from './tenant-manager'

