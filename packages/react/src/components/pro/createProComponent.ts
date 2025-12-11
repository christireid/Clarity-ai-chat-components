/**
 * Pro Component Wrapper Factory
 *
 * Creates license-wrapped components for Clarity Chat Pro features.
 *
 * @packageDocumentation
 */

import { createLicenseWrapper } from '@clarity-chat/license'

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
