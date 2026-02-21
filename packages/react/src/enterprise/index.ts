/**
 * Enterprise Domain Exports
 *
 * Enterprise features: audit and safety.
 * NOTE: Multi-tenancy, RBAC, and quotas have been moved out of the react package
 * as infrastructure concerns.
 */

export {
  createEnterpriseShell,
  type EnterpriseShellOptions,
  type EnterpriseShell,
} from './create-enterprise-shell'

export {
  useEnterpriseAuth,
  type UseEnterpriseAuthOptions,
  type UseEnterpriseAuthReturn,
} from './use-enterprise-auth'

// Re-export enterprise modules
export * from '../audit'
export * from '../safety'
