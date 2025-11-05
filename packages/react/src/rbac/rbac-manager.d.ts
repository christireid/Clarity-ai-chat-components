/**
 * RBAC Manager
 *
 * Simple role-based access control utilities.
 */
import type { Role, RBACContext, RBACStorage } from './types';
export declare class RBACManager {
    private storage;
    private roleCache;
    constructor(storage: RBACStorage);
    /**
     * Check if user has permission
     */
    hasPermission(context: RBACContext, permission: string): Promise<boolean>;
    /**
     * Check if user has any of the permissions
     */
    hasAnyPermission(context: RBACContext, permissions: string[]): Promise<boolean>;
    /**
     * Check if user has all permissions
     */
    hasAllPermissions(context: RBACContext, permissions: string[]): Promise<boolean>;
    /**
     * Get all permissions for user
     */
    getUserPermissions(context: RBACContext): Promise<string[]>;
    /**
     * Expand roles to include inherited roles
     */
    private expandRoles;
    /**
     * Get role (with caching)
     */
    private getRole;
    /**
     * Clear role cache
     */
    clearCache(): void;
}
/**
 * Memory RBAC Storage (for development/testing)
 */
export declare class MemoryRBACStorage implements RBACStorage {
    private roles;
    private userRoles;
    getRole(roleId: string): Promise<Role | null>;
    getUserRoles(userId: string, tenantId?: string): Promise<string[]>;
    getRolePermissions(roleId: string): Promise<string[]>;
    /**
     * Add role (for testing)
     */
    addRole(role: Role): void;
    /**
     * Assign roles to user (for testing)
     */
    assignRoles(userId: string, roles: string[], tenantId?: string): void;
    /**
     * Clear all data
     */
    clear(): void;
}
/**
 * Common roles for AI applications
 */
export declare const CommonRoles: {
    readonly ADMIN: {
        readonly id: "admin";
        readonly name: "Administrator";
        readonly description: "Full access to all resources";
        readonly permissions: readonly ["*"];
    };
    readonly USER: {
        readonly id: "user";
        readonly name: "User";
        readonly description: "Standard user access";
        readonly permissions: readonly ["chat.send", "chat.read", "document.upload", "document.read"];
    };
    readonly VIEWER: {
        readonly id: "viewer";
        readonly name: "Viewer";
        readonly description: "Read-only access";
        readonly permissions: readonly ["chat.read", "document.read"];
    };
    readonly DEVELOPER: {
        readonly id: "developer";
        readonly name: "Developer";
        readonly description: "Developer access";
        readonly permissions: readonly ["chat.send", "chat.read", "document.upload", "document.read", "api.access", "settings.read"];
    };
};
//# sourceMappingURL=rbac-manager.d.ts.map