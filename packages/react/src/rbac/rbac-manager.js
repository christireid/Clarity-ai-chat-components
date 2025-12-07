/**
 * RBAC Manager
 *
 * Simple role-based access control utilities.
 */
export class RBACManager {
    storage;
    roleCache = new Map();
    constructor(storage) {
        this.storage = storage;
    }
    /**
     * Check if user has permission
     */
    async hasPermission(context, permission) {
        const allPermissions = await this.getUserPermissions(context);
        return allPermissions.includes(permission) || allPermissions.includes('*');
    }
    /**
     * Check if user has any of the permissions
     */
    async hasAnyPermission(context, permissions) {
        const allPermissions = await this.getUserPermissions(context);
        for (const permission of permissions) {
            if (allPermissions.includes(permission) || allPermissions.includes('*')) {
                return true;
            }
        }
        return false;
    }
    /**
     * Check if user has all permissions
     */
    async hasAllPermissions(context, permissions) {
        const allPermissions = await this.getUserPermissions(context);
        for (const permission of permissions) {
            if (!allPermissions.includes(permission) && !allPermissions.includes('*')) {
                return false;
            }
        }
        return true;
    }
    /**
     * Get all permissions for user
     */
    async getUserPermissions(context) {
        const permissions = new Set();
        // Get all roles with inheritance
        const roles = await this.expandRoles(context.roles, context.tenantId);
        // Collect permissions from all roles
        for (const roleId of roles) {
            const rolePermissions = await this.storage.getRolePermissions(roleId);
            rolePermissions.forEach((p) => permissions.add(p));
        }
        return Array.from(permissions);
    }
    /**
     * Expand roles to include inherited roles
     */
    async expandRoles(roleIds, tenantId) {
        const expanded = new Set(roleIds);
        const toProcess = [...roleIds];
        while (toProcess.length > 0) {
            const roleId = toProcess.pop();
            const role = await this.getRole(roleId);
            if (role?.inherits) {
                for (const parentRoleId of role.inherits) {
                    if (!expanded.has(parentRoleId)) {
                        expanded.add(parentRoleId);
                        toProcess.push(parentRoleId);
                    }
                }
            }
        }
        return Array.from(expanded);
    }
    /**
     * Get role (with caching)
     */
    async getRole(roleId) {
        if (this.roleCache.has(roleId)) {
            return this.roleCache.get(roleId);
        }
        const role = await this.storage.getRole(roleId);
        if (role) {
            this.roleCache.set(roleId, role);
        }
        return role;
    }
    /**
     * Clear role cache
     */
    clearCache() {
        this.roleCache.clear();
    }
}
/**
 * Memory RBAC Storage (for development/testing)
 */
export class MemoryRBACStorage {
    roles = new Map();
    userRoles = new Map();
    async getRole(roleId) {
        return this.roles.get(roleId) || null;
    }
    async getUserRoles(userId, tenantId) {
        const key = tenantId ? `${tenantId}:${userId}` : userId;
        return this.userRoles.get(key) || [];
    }
    async getRolePermissions(roleId) {
        const role = this.roles.get(roleId);
        return role?.permissions || [];
    }
    /**
     * Add role (for testing)
     */
    addRole(role) {
        this.roles.set(role.id, role);
    }
    /**
     * Assign roles to user (for testing)
     */
    assignRoles(userId, roles, tenantId) {
        const key = tenantId ? `${tenantId}:${userId}` : userId;
        this.userRoles.set(key, roles);
    }
    /**
     * Clear all data
     */
    clear() {
        this.roles.clear();
        this.userRoles.clear();
    }
}
/**
 * Common roles for AI applications
 */
export const CommonRoles = {
    ADMIN: {
        id: 'admin',
        name: 'Administrator',
        description: 'Full access to all resources',
        permissions: ['*'],
    },
    USER: {
        id: 'user',
        name: 'User',
        description: 'Standard user access',
        permissions: [
            'chat.send',
            'chat.read',
            'document.upload',
            'document.read',
        ],
    },
    VIEWER: {
        id: 'viewer',
        name: 'Viewer',
        description: 'Read-only access',
        permissions: ['chat.read', 'document.read'],
    },
    DEVELOPER: {
        id: 'developer',
        name: 'Developer',
        description: 'Developer access',
        permissions: [
            'chat.send',
            'chat.read',
            'document.upload',
            'document.read',
            'api.access',
            'settings.read',
        ],
    },
};
//# sourceMappingURL=rbac-manager.js.map