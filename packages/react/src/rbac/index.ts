/**
 * RBAC (Role-Based Access Control)
 *
 * Optional utilities for implementing permissions and access control.
 * Flexible and extensible - bring your own storage.
 *
 * @example
 * ```tsx
 * import {
 *   RBACManager,
 *   MemoryRBACStorage,
 *   CommonRoles,
 * } from '@clarity-chat/react'
 *
 * const storage = new MemoryRBACStorage()
 *
 * // Add roles
 * storage.addRole(CommonRoles.ADMIN)
 * storage.addRole(CommonRoles.USER)
 *
 * // Assign roles to users
 * storage.assignRoles('user-123', ['user'])
 * storage.assignRoles('admin-456', ['admin'])
 *
 * // Create RBAC manager
 * const rbac = new RBACManager(storage)
 *
 * // Check permissions
 * const canSend = await rbac.hasPermission(
 *   { userId: 'user-123', roles: ['user'] },
 *   'chat.send'
 * )
 *
 * if (canSend) {
 *   // Allow action
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Role inheritance
 * storage.addRole({
 *   id: 'power-user',
 *   name: 'Power User',
 *   permissions: ['api.access', 'settings.modify'],
 *   inherits: ['user'], // Inherits all user permissions
 * })
 * ```
 */

export * from './types'
export * from './rbac-manager'
export * from './react'
