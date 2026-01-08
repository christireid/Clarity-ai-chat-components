/**
 * Enterprise Domain
 *
 * APIs for multi-tenancy, RBAC, audit, quotas, safety
 */
// Top-level: Drop-in ready APIs
export { createEnterpriseShell, } from '../../enterprise/create-enterprise-shell';
export { useEnterpriseAuth, } from '../../enterprise/use-enterprise-auth';
// Mid-level: Building blocks
export { MultiTenancyProvider, useMultiTenancy, } from '../../multi-tenancy/react';
export { RBACProvider, useRBAC } from '../../rbac/react';
export { AuditLogger } from '../../audit/audit-logger';
// Re-export enterprise modules
export * from '../../multi-tenancy';
export * from '../../rbac';
export * from '../../audit';
export * from '../../safety';
export * from '../../quotas';
//# sourceMappingURL=index.js.map