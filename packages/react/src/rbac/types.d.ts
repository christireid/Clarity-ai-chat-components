/**
 * RBAC Types
 *
 * Optional role-based access control utilities.
 * Bring your own permission storage and enforcement.
 */
export interface Role {
    /** Role ID */
    id: string;
    /** Role name */
    name: string;
    /** Role description */
    description?: string;
    /** Permissions granted by this role */
    permissions: string[];
    /** Parent roles (for inheritance) */
    inherits?: string[];
}
export interface Permission {
    /** Permission ID */
    id: string;
    /** Resource type */
    resource: string;
    /** Action allowed */
    action: 'create' | 'read' | 'update' | 'delete' | 'execute' | string;
    /** Conditions (optional) */
    conditions?: Record<string, any>;
}
export interface RBACContext {
    /** User ID */
    userId: string;
    /** User roles */
    roles: string[];
    /** Tenant ID (for multi-tenancy) */
    tenantId?: string;
    /** Additional context */
    context?: Record<string, any>;
}
export interface RBACStorage {
    /**
     * Get role by ID
     */
    getRole(roleId: string): Promise<Role | null>;
    /**
     * Get user roles
     */
    getUserRoles(userId: string, tenantId?: string): Promise<string[]>;
    /**
     * Get permissions for role
     */
    getRolePermissions(roleId: string): Promise<string[]>;
}
//# sourceMappingURL=types.d.ts.map