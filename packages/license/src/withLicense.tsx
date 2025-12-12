/**
 * Higher-Order Components for License Verification
 *
 * Provides HOCs for wrapping components with license checks.
 *
 * @packageDocumentation
 */

import * as React from 'react'
import { LicenseInfo } from './LicenseInfo'
import { verifyLicense } from './verifyLicense'
import { WatermarkOverlay } from './Watermark'
import type { LicensePlan, LicenseStatus } from './types'

/**
 * Options for the withLicense HOC
 */
export interface WithLicenseOptions {
  /** Name of the component (for error messages) */
  componentName?: string

  /** Package name (for verification) */
  packageName?: string

  /** Required minimum plan level */
  requiredPlan?: LicensePlan

  /** Whether to show watermark on unlicensed components */
  showWatermark?: boolean

  /** Whether to show console warning */
  showConsoleWarning?: boolean

  /** Custom fallback component for unlicensed state */
  fallback?: React.ComponentType<{ status: LicenseStatus }>
}

/**
 * Track if we've already logged the warning for this session.
 * Uses a Map with timestamps for automatic cleanup of old entries.
 */
const warnedComponents = new Map<string, number>()

/** Maximum age for warned components (1 hour) */
const WARNING_TTL_MS = 60 * 60 * 1000

/**
 * Check if a component has been warned recently.
 * Automatically cleans up old entries to prevent memory leaks.
 */
function hasWarnedRecently(componentName: string): boolean {
  const now = Date.now()

  // Clean up old entries (older than TTL)
  for (const [name, timestamp] of warnedComponents.entries()) {
    if (now - timestamp > WARNING_TTL_MS) {
      warnedComponents.delete(name)
    }
  }

  return warnedComponents.has(componentName)
}

/**
 * Mark a component as warned.
 */
function markAsWarned(componentName: string): void {
  warnedComponents.set(componentName, Date.now())
}

/**
 * Higher-order component that wraps a component with license verification.
 * Shows watermark and logs warning for unlicensed usage.
 *
 * @param WrappedComponent - Component to wrap
 * @param options - Configuration options
 * @returns Licensed component
 *
 * @example
 * ```typescript
 * import { withLicense } from '@clarity-chat/license';
 *
 * const MyProComponent = withLicense(BaseComponent, {
 *   componentName: 'MyProComponent',
 *   requiredPlan: 'pro',
 *   showWatermark: true,
 * });
 * ```
 */
export function withLicense<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithLicenseOptions = {}
): React.FC<P> {
  const {
    componentName = WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component',
    requiredPlan,
    showWatermark = true,
    showConsoleWarning = true,
    fallback: FallbackComponent,
  } = options

  const LicensedComponent: React.FC<P> = (props) => {
    const status = React.useMemo(() => {
      const key = LicenseInfo.getLicenseKey()
      return verifyLicense(key, { requiredPlan })
    }, [])

    // Show console warning once per component type (with TTL to prevent memory leaks)
    React.useEffect(() => {
      if (
        status.status !== 'Valid' &&
        status.status !== 'GracePeriod' &&
        showConsoleWarning &&
        !hasWarnedRecently(componentName)
      ) {
        markAsWarned(componentName)
        console.warn(
          `%c[Clarity Chat]%c ${componentName} requires a valid license.\n` +
            `Status: ${status.status}\n` +
            `${status.reason ?? ''}\n` +
            `Purchase at: https://claritychat.dev/pricing`,
          'color: #3b82f6; font-weight: bold',
          'color: inherit'
        )
      }
    }, [status])

    // Use custom fallback if provided
    if (FallbackComponent && status.status !== 'Valid') {
      return <FallbackComponent status={status} />
    }

    // Wrap with watermark if needed
    if (showWatermark && status.status !== 'Valid') {
      return (
        <WatermarkOverlay status={status.status}>
          <WrappedComponent {...props} />
        </WatermarkOverlay>
      )
    }

    return <WrappedComponent {...props} />
  }

  LicensedComponent.displayName = `withLicense(${componentName})`

  return LicensedComponent
}

/**
 * Factory function for creating license wrappers with default options.
 * Useful when you have many components to wrap with the same options.
 *
 * @param defaultOptions - Default options for all wrapped components
 * @returns Factory function for creating licensed components
 *
 * @example
 * ```typescript
 * const createProComponent = createLicenseWrapper({
 *   requiredPlan: 'pro',
 *   showWatermark: true,
 * });
 *
 * export const LicensedChart = createProComponent(Chart, 'Chart');
 * export const LicensedTreeView = createProComponent(TreeView, 'TreeView');
 * ```
 */
export function createLicenseWrapper(
  defaultOptions: Omit<WithLicenseOptions, 'componentName'>
) {
  return function wrap<P extends object>(
    Component: React.ComponentType<P>,
    componentName?: string
  ): React.FC<P> {
    return withLicense(Component, {
      ...defaultOptions,
      componentName,
    })
  }
}

/**
 * Props injected by withLicenseStatus HOC
 */
export interface WithLicenseStatusProps {
  /** Current license status */
  licenseStatus: LicenseStatus
  /** Whether license is valid */
  isLicensed: boolean
}

/**
 * HOC that injects license status as props.
 * Useful when components need to conditionally render based on license.
 *
 * @param WrappedComponent - Component to wrap
 * @returns Component with license status props
 *
 * @example
 * ```typescript
 * interface MyComponentProps extends WithLicenseStatusProps {
 *   title: string;
 * }
 *
 * function MyComponent({ title, licenseStatus, isLicensed }: MyComponentProps) {
 *   return (
 *     <div>
 *       <h1>{title}</h1>
 *       {isLicensed ? (
 *         <ProFeatures />
 *       ) : (
 *         <UpgradePrompt status={licenseStatus} />
 *       )}
 *     </div>
 *   );
 * }
 *
 * export default withLicenseStatus(MyComponent);
 * ```
 */
export function withLicenseStatus<P extends object>(
  WrappedComponent: React.ComponentType<P & WithLicenseStatusProps>
): React.FC<Omit<P, keyof WithLicenseStatusProps>> {
  const ComponentWithLicenseStatus: React.FC<
    Omit<P, keyof WithLicenseStatusProps>
  > = (props) => {
    const licenseStatus = React.useMemo(() => {
      const key = LicenseInfo.getLicenseKey()
      return verifyLicense(key)
    }, [])

    const isLicensed = licenseStatus.status === 'Valid'

    return (
      <WrappedComponent
        {...(props as P)}
        licenseStatus={licenseStatus}
        isLicensed={isLicensed}
      />
    )
  }

  ComponentWithLicenseStatus.displayName = `withLicenseStatus(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return ComponentWithLicenseStatus
}

/**
 * Props for LicenseGate component
 */
export interface LicenseGateProps {
  /** Required plan level */
  requiredPlan: LicensePlan
  /** Child content to render when licensed */
  children: React.ReactNode
  /** Optional fallback to render when not licensed */
  fallback?: React.ReactNode
}

/**
 * Component that only renders children if properly licensed.
 * Does not show watermark - just gates access to content.
 *
 * @example
 * ```tsx
 * <LicenseGate requiredPlan="enterprise" fallback={<UpgradePrompt />}>
 *   <EnterpriseFeature />
 * </LicenseGate>
 * ```
 */
export function LicenseGate({
  requiredPlan,
  children,
  fallback = null,
}: LicenseGateProps): React.ReactElement {
  const hasLicense = React.useMemo(() => {
    const key = LicenseInfo.getLicenseKey()
    const status = verifyLicense(key, { requiredPlan })
    return status.status === 'Valid' || status.status === 'GracePeriod'
  }, [requiredPlan])

  if (!hasLicense) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

LicenseGate.displayName = 'LicenseGate'
