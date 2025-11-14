/**
 * RBAC Manager
 *
 * Simple role-based access control utilities.
 */

import type { Role, RBACContext, RBACStorage } from './types'

export class RBACManager {
  private storage: RBACStorage
  private roleCache = new Map<string, Role>()

  constructor(storage: RBACStorage) {
    this.storage = storage
  }

  /**
   * Check if user has permission
   */
  async hasPermission(
    context: RBACContext,
    permission: string
  ): Promise<boolean> {
    const allPermissions = await this.getUserPermissions(context)
    return allPermissions.includes(permission) || allPermissions.includes('*')
  }

  /**
   * Check if user has any of the permissions
   */
  async hasAnyPermission(
    context: RBACContext,
    permissions: string[]
  ): Promise<boolean> {
    const allPermissions = await this.getUserPermissions(context)

    for (const permission of permissions) {
      if (allPermissions.includes(permission) || allPermissions.includes('*')) {
        return true
      }
    }

    return false
  }

  /**
   * Check if user has all permissions
   */
  async hasAllPermissions(
    context: RBACContext,
    permissions: string[]
  ): Promise<boolean> {
    const allPermissions = await this.getUserPermissions(context)

    for (const permission of permissions) {
      if (!allPermissions.includes(permission) && !allPermissions.includes('*')) {
        return false
      }
    }

    return true
  }

  /**
   * Get all permissions for user
   */
  async getUserPermissions(context: RBACContext): Promise<string[]> {
    const permissions = new Set<string>()

    // Get all roles with inheritance
    const roles = await this.expandRoles(context.roles, context.tenantId)

    // Collect permissions from all roles
    for (const roleId of roles) {
      const rolePermissions = await this.storage.getRolePermissions(roleId)
      rolePermissions.forEach((p) => permissions.add(p))
    }

    return Array.from(permissions)
  }

  /**
   * Expand roles to include inherited roles
   */
  private async expandRoles(
    roleIds: string[],
    tenantId?: string
  ): Promise<string[]> {
    const expanded = new Set<string>(roleIds)
    const toProcess = [...roleIds]

    while (toProcess.length > 0) {
      const roleId = toProcess.pop()!
      const role = await this.getRole(roleId)

      if (role?.inherits) {
        for (const parentRoleId of role.inherits) {
          if (!expanded.has(parentRoleId)) {
            expanded.add(parentRoleId)
            toProcess.push(parentRoleId)
          }
        }
      }
    }

    return Array.from(expanded)
  }

  /**
   * Get role (with caching)
   */
  private async getRole(roleId: string): Promise<Role | null> {
    if (this.roleCache.has(roleId)) {
      return this.roleCache.get(roleId)!
    }

    const role = await this.storage.getRole(roleId)
    if (role) {
      this.roleCache.set(roleId, role)
    }

    return role
  }

  /**
   * Clear role cache
   */
  clearCache(): void {
    this.roleCache.clear()
  }
}

/**
 * Memory RBAC Storage (for development/testing)
 */
export class MemoryRBACStorage implements RBACStorage {
  private roles = new Map<string, Role>()
  private userRoles = new Map<string, string[]>()

  async getRole(roleId: string): Promise<Role | null> {
    return this.roles.get(roleId) || null
  }

  async getUserRoles(userId: string, tenantId?: string): Promise<string[]> {
    const key = tenantId ? `${tenantId}:${userId}` : userId
    return this.userRoles.get(key) || []
  }

  async getRolePermissions(roleId: string): Promise<string[]> {
    const role = this.roles.get(roleId)
    return role?.permissions || []
  }

  /**
   * Add role (for testing)
   */
  addRole(role: Role): void {
    this.roles.set(role.id, role)
  }

  /**
   * Assign roles to user (for testing)
   */
  assignRoles(userId: string, roles: string[], tenantId?: string): void {
    const key = tenantId ? `${tenantId}:${userId}` : userId
    this.userRoles.set(key, roles)
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.roles.clear()
    this.userRoles.clear()
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
} as const

