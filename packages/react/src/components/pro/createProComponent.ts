/**
 * Pro Component Wrapper Factory
 *
 * Creates license-wrapped components for Clarity Chat Pro features.
 *
 * @packageDocumentation
 */

import * as React from 'react'

// NOTE: @clarity-chat/license package doesn't exist - creating stub implementation
// import { createLicenseWrapper } from '@clarity-chat/license'

/**
 * Stub wrapper that passes through the component without license checks
 * TODO: Implement when license package is available
 */
const createLicenseWrapper = (_config: any) => {
  return <T extends React.ComponentType<any>>(Component: T, _name: string): T => {
    return Component
  }
}

/**
 * Factory for creating Pro-licensed components.
 *
 * @example
 * ```typescript
 * import { createProComponent } from '@clarity-chat/react/components/pro';
 *
 * export const LicensedAnalytics = createProComponent(Analytics, 'Analytics');
 * export const LicensedTreeView = createProComponent(TreeView, 'TreeView');
 * ```
 */
export const createProComponent = createLicenseWrapper({
  requiredPlan: 'pro',
  showWatermark: true,
  showConsoleWarning: true,
})

/**
 * Factory for creating Enterprise-licensed components.
 *
 * @example
 * ```typescript
 * import { createEnterpriseComponent } from '@clarity-chat/react/components/pro';
 *
 * export const LicensedSSO = createEnterpriseComponent(SSOPanel, 'SSOPanel');
 * ```
 */
export const createEnterpriseComponent = createLicenseWrapper({
  requiredPlan: 'enterprise',
  showWatermark: true,
  showConsoleWarning: true,
})
