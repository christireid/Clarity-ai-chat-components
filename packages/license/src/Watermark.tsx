/**
 * Watermark Components
 *
 * Display watermarks for unlicensed usage of Clarity Chat Pro.
 *
 * @packageDocumentation
 */

import * as React from 'react'
import type { LicenseStatusCode } from './types'

/**
 * Watermark position options
 */
export type WatermarkPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

/**
 * Props for Watermark component
 */
export interface WatermarkProps {
  /** License status code */
  status: LicenseStatusCode

  /** Custom message to display */
  message?: string

  /** Position of the watermark */
  position?: WatermarkPosition

  /** Additional CSS class name */
  className?: string

  /** Custom inline styles */
  style?: React.CSSProperties
}

/**
 * Get default message for license status
 */
function getDefaultMessage(status: LicenseStatusCode): string {
  switch (status) {
    case 'Missing':
      return 'Unlicensed'
    case 'Invalid':
      return 'Invalid License'
    case 'Expired':
    case 'ExpiredForDevelopment':
      return 'License Expired'
    case 'PlanMismatch':
      return 'Upgrade Required'
    default:
      return 'Unlicensed'
  }
}

/**
 * Get CSS styles for position
 */
function getPositionStyles(position: WatermarkPosition): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute',
    zIndex: 9999,
    pointerEvents: 'none',
  }

  switch (position) {
    case 'top-left':
      return { ...base, top: 8, left: 8 }
    case 'top-right':
      return { ...base, top: 8, right: 8 }
    case 'bottom-left':
      return { ...base, bottom: 8, left: 8 }
    case 'bottom-right':
      return { ...base, bottom: 8, right: 8 }
    default:
      return { ...base, top: 8, right: 8 }
  }
}

/**
 * Watermark component for displaying license status.
 * Appears as a subtle indicator when license is invalid.
 *
 * @example
 * ```tsx
 * <div style={{ position: 'relative' }}>
 *   <MyProComponent />
 *   {!isLicensed && <Watermark status="Missing" />}
 * </div>
 * ```
 */
export function Watermark({
  status,
  message,
  position = 'top-right',
  className,
  style,
}: WatermarkProps): React.ReactElement {
  const displayMessage = message ?? getDefaultMessage(status)

  const baseStyles: React.CSSProperties = {
    ...getPositionStyles(position),
    padding: '4px 8px',
    backgroundColor: 'rgba(220, 38, 38, 0.1)', // red-600 with low opacity
    color: 'rgba(220, 38, 38, 0.8)',
    fontSize: '11px',
    fontFamily:
      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
    fontWeight: 500,
    borderRadius: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
    userSelect: 'none',
    ...style,
  }

  return (
    <div
      className={className}
      style={baseStyles}
      role="status"
      aria-label={displayMessage}
    >
      {displayMessage}
    </div>
  )
}

/**
 * Props for WatermarkOverlay component
 */
export interface WatermarkOverlayProps extends WatermarkProps {
  /** Child content to render */
  children: React.ReactNode
}

/**
 * Wrapper component that adds a watermark overlay.
 *
 * @example
 * ```tsx
 * <WatermarkOverlay status={license.status}>
 *   <MyProComponent />
 * </WatermarkOverlay>
 * ```
 */
export function WatermarkOverlay({
  children,
  status,
  ...watermarkProps
}: WatermarkOverlayProps): React.ReactElement {
  // Don't show watermark for valid licenses
  if (status === 'Valid') {
    return <>{children}</>
  }

  return (
    <div style={{ position: 'relative' }}>
      {children}
      <Watermark status={status} {...watermarkProps} />
    </div>
  )
}
