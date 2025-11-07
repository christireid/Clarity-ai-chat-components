/**
 * Tenant Manager
 *
 * Simple utilities for multi-tenant applications.
 */
export class TenantManager {
    constructor(storage) {
        this.storage = storage;
    }
    /**
     * Set current tenant context
     */
    setContext(context) {
        this.currentContext = context;
    }
    /**
     * Get current tenant context
     */
    getContext() {
        return this.currentContext;
    }
    /**
     * Get tenant by ID
     */
    async getTenant(tenantId) {
        return await this.storage.getTenant(tenantId);
    }
    /**
     * Update tenant
     */
    async updateTenant(tenant) {
        await this.storage.updateTenant(tenant);
    }
    /**
     * Check if tenant is active
     */
    async isActive(tenantId) {
        const tenant = await this.getTenant(tenantId);
        return tenant?.status === 'active';
    }
    /**
     * Get namespace for tenant (for data isolation)
     */
    getNamespace(tenantId) {
        return `tenant_${tenantId}`;
    }
    /**
     * Get cache key prefix for tenant
     */
    getCachePrefix(tenantId) {
        return `tenant:${tenantId}:`;
    }
    /**
     * Get database name for tenant (if using database-per-tenant)
     */
    getDatabaseName(tenantId) {
        return `clarity_tenant_${tenantId}`;
    }
    /**
     * Check quota for tenant
     */
    async checkQuota(tenantId, type) {
        const tenant = await this.getTenant(tenantId);
        if (!tenant)
            return false;
        const quota = tenant.quotas?.[type];
        if (!quota)
            return true; // No limit set
        // This would integrate with QuotaManager in real implementation
        return true;
    }
}
/**
 * Memory Tenant Storage (for development/testing)
 */
export class MemoryTenantStorage {
    constructor() {
        this.tenants = new Map();
    }
    async getTenant(tenantId) {
        return this.tenants.get(tenantId) || null;
    }
    async updateTenant(tenant) {
        this.tenants.set(tenant.id, tenant);
    }
    async listTenants(options) {
        const all = Array.from(this.tenants.values());
        const offset = options?.offset || 0;
        const limit = options?.limit || 100;
        return all.slice(offset, offset + limit);
    }
    /**
     * Add tenant (for testing)
     */
    async addTenant(tenant) {
        this.tenants.set(tenant.id, tenant);
    }
    /**
     * Clear all tenants
     */
    clear() {
        this.tenants.clear();
    }
}
//# sourceMappingURL=tenant-manager.js.map