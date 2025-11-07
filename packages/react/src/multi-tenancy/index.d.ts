/**
 * Multi-Tenancy Utilities
 *
 * Optional utilities for building multi-tenant AI applications.
 *
 * @example
 * ```tsx
 * import { TenantManager, MemoryTenantStorage } from '@clarity-chat/react'
 *
 * const storage = new MemoryTenantStorage()
 * const tenants = new TenantManager(storage)
 *
 * // Set context for request
 * tenants.setContext({
 *   tenant: {
 *     id: 'acme-corp',
 *     name: 'Acme Corp',
 *     status: 'active',
 *     quotas: { tokens: 100000 },
 *   },
 *   userId: 'user-123',
 * })
 *
 * // Use tenant-specific namespace
 * const namespace = tenants.getNamespace('acme-corp')
 *
 * // Store data with isolation
 * await vectorStore.upsert(vectors, { namespace })
 *
 * // Query only tenant's data
 * await vectorStore.query({ namespace, vector, topK: 10 })
 * ```
 */
export * from './types';
export * from './tenant-manager';
//# sourceMappingURL=index.d.ts.map