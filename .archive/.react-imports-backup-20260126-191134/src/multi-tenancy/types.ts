/**
 * Multi-Tenancy Types
 *
 * Optional utilities for building multi-tenant AI applications.
 * Bring your own storage and authentication.
 */

export interface Tenant {
  /** Tenant ID */
  id: string
  /** Tenant name */
  name: string
  /** Tenant status */
  status: 'active' | 'suspended' | 'cancelled'
  /** Plan/tier */
  plan?: string
  /** Resource quotas */
  quotas?: {
    tokens?: number
    requests?: number
    storage?: number
    users?: number
  }
  /** Settings */
  settings?: Record<string, any>
  /** Created timestamp */
  createdAt: number
  /** Metadata */
  metadata?: Record<string, any>
}

export interface TenantContext {
  /** Current tenant */
  tenant: Tenant
  /** Current user within tenant */
  userId?: string
  /** User roles within tenant */
  roles?: string[]
  /** Permissions */
  permissions?: string[]
}

export interface TenantStorage {
  /**
   * Get tenant by ID
   */
  getTenant(tenantId: string): Promise<Tenant | null>

  /**
   * Update tenant
   */
  updateTenant(tenant: Tenant): Promise<void>

  /**
   * List all tenants
   */
  listTenants(options?: { limit?: number; offset?: number }): Promise<Tenant[]>
}

export interface TenantIsolation {
  /**
   * Get namespace for tenant (for vector stores, caches, etc.)
   */
  getNamespace(tenantId: string): string

  /**
   * Get database name for tenant
   */
  getDatabaseName?(tenantId: string): string

  /**
   * Get cache key prefix for tenant
   */
  getCachePrefix(tenantId: string): string
}

