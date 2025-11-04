/**
 * Tenant Manager
 *
 * Simple utilities for multi-tenant applications.
 */
import type { Tenant, TenantContext, TenantStorage, TenantIsolation } from './types';
export declare class TenantManager implements TenantIsolation {
    private storage;
    private currentContext?;
    constructor(storage: TenantStorage);
    /**
     * Set current tenant context
     */
    setContext(context: TenantContext): void;
    /**
     * Get current tenant context
     */
    getContext(): TenantContext | undefined;
    /**
     * Get tenant by ID
     */
    getTenant(tenantId: string): Promise<Tenant | null>;
    /**
     * Update tenant
     */
    updateTenant(tenant: Tenant): Promise<void>;
    /**
     * Check if tenant is active
     */
    isActive(tenantId: string): Promise<boolean>;
    /**
     * Get namespace for tenant (for data isolation)
     */
    getNamespace(tenantId: string): string;
    /**
     * Get cache key prefix for tenant
     */
    getCachePrefix(tenantId: string): string;
    /**
     * Get database name for tenant (if using database-per-tenant)
     */
    getDatabaseName(tenantId: string): string;
    /**
     * Check quota for tenant
     */
    checkQuota(tenantId: string, type: keyof Tenant['quotas']): Promise<boolean>;
}
/**
 * Memory Tenant Storage (for development/testing)
 */
export declare class MemoryTenantStorage implements TenantStorage {
    private tenants;
    getTenant(tenantId: string): Promise<Tenant | null>;
    updateTenant(tenant: Tenant): Promise<void>;
    listTenants(options?: {
        limit?: number;
        offset?: number;
    }): Promise<Tenant[]>;
    /**
     * Add tenant (for testing)
     */
    addTenant(tenant: Tenant): Promise<void>;
    /**
     * Clear all tenants
     */
    clear(): void;
}
//# sourceMappingURL=tenant-manager.d.ts.map