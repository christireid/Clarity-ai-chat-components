/**
 * Enterprise Domain
 *
 * APIs for enterprise features: audit and safety.
 *
 * NOTE: Multi-tenancy, RBAC, and quotas have been moved out of the react package
 * as infrastructure concerns. They belong in backend services.
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

// Re-export remaining enterprise modules
export { AuditLogger } from '../../audit/audit-logger'
export * from '../../audit'
export * from '../../safety'
