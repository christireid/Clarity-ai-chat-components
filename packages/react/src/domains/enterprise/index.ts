/**
 * Enterprise Domain
 * 
 * APIs for multi-tenancy, RBAC, audit, quotas, safety
 */

// Top-level: Drop-in ready APIs
export {
  createEnterpriseShell,
  type EnterpriseShellOptions,
  type EnterpriseShell,
} from '../../enterprise/create-enterprise-shell'
export {
  useEnterpriseAuth,
  type UseEnterpriseAuthOptions,
  type UseEnterpriseAuthReturn,
} from '../../enterprise/use-enterprise-auth'

// Mid-level: Building blocks
export { MultiTenancyProvider, useMultiTenancy } from '../../multi-tenancy/react'
export { RBACProvider, useRBAC } from '../../rbac/react'
export { AuditLogger } from '../../audit/audit-logger'
export { SafetyChecker } from '../../safety/safety-checker'

// Low-level: Primitives
export { createTenant } from '../../multi-tenancy/create-tenant'
export { checkPermission } from '../../rbac/check-permission'
export { logAuditEvent } from '../../audit/log-audit-event'

// Re-export enterprise modules
export * from '../../multi-tenancy'
export * from '../../rbac'
export * from '../../audit'
export * from '../../safety'
export * from '../../quotas'
