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
} from '../../enterprise/use-enterprise-auth'

// Mid-level: Building blocks
export {
  useMultiTenancy,
  type UseMultiTenancyOptions,
} from '../../multi-tenancy/use-multi-tenancy'
export {
  useRBAC,
  type UseRBACOptions,
} from '../../rbac/use-rbac'
export {
  useAudit,
  type UseAuditOptions,
} from '../../audit/use-audit'
export {
  useSafety,
  type UseSafetyOptions,
} from '../../safety/use-safety'

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
