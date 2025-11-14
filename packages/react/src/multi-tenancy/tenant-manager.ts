/**
 * Tenant Manager
 *
 * Simple utilities for multi-tenant applications.
 */

import type { Tenant, TenantContext, TenantStorage, TenantIsolation } from './types'

export class TenantManager implements TenantIsolation {
  private storage: TenantStorage
  private currentContext?: TenantContext

  constructor(storage: TenantStorage) {
    this.storage = storage
  }

  /**
   * Set current tenant context
   */
  setContext(context: TenantContext): void {
    this.currentContext = context
  }

  /**
   * Get current tenant context
   */
  getContext(): TenantContext | undefined {
    return this.currentContext
  }

  /**
   * Get tenant by ID
   */
  async getTenant(tenantId: string): Promise<Tenant | null> {
    return await this.storage.getTenant(tenantId)
  }

  /**
   * Update tenant
   */
  async updateTenant(tenant: Tenant): Promise<void> {
    await this.storage.updateTenant(tenant)
  }

  /**
   * Check if tenant is active
   */
  async isActive(tenantId: string): Promise<boolean> {
    const tenant = await this.getTenant(tenantId)
    return tenant?.status === 'active'
  }

  /**
   * Get namespace for tenant (for data isolation)
   */
  getNamespace(tenantId: string): string {
    return `tenant_${tenantId}`
  }

  /**
   * Get cache key prefix for tenant
   */
  getCachePrefix(tenantId: string): string {
    return `tenant:${tenantId}:`
  }

  /**
   * Get database name for tenant (if using database-per-tenant)
   */
  getDatabaseName(tenantId: string): string {
    return `clarity_tenant_${tenantId}`
  }

  /**
   * Check quota for tenant
   */
  async checkQuota(tenantId: string, type: keyof Tenant['quotas']): Promise<boolean> {
    const tenant = await this.getTenant(tenantId)
    if (!tenant) return false

    const quota = tenant.quotas?.[type]
    if (!quota) return true // No limit set

    // This would integrate with QuotaManager in real implementation
    return true
  }
}

/**
 * Memory Tenant Storage (for development/testing)
 */
export class MemoryTenantStorage implements TenantStorage {
  private tenants = new Map<string, Tenant>()

  async getTenant(tenantId: string): Promise<Tenant | null> {
    return this.tenants.get(tenantId) || null
  }

  async updateTenant(tenant: Tenant): Promise<void> {
    this.tenants.set(tenant.id, tenant)
  }

  async listTenants(options?: { limit?: number; offset?: number }): Promise<Tenant[]> {
    const all = Array.from(this.tenants.values())
    const offset = options?.offset || 0
    const limit = options?.limit || 100

    return all.slice(offset, offset + limit)
  }

  /**
   * Add tenant (for testing)
   */
  async addTenant(tenant: Tenant): Promise<void> {
    this.tenants.set(tenant.id, tenant)
  }

  /**
   * Clear all tenants
   */
  clear(): void {
    this.tenants.clear()
  }
}

