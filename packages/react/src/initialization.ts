'use client'

// NOTE: @clarity-chat/license package doesn't exist - commenting out
// import { LicenseInfo } from '@clarity-chat/license'

/**
 * Options for initializing Clarity Chat
 */
export interface InitializeClarityOptions {
  /**
   * License key for Clarity Chat.
   * If not provided, will attempt to read from CLARITY_LICENSE environment variable.
   */
  license?: string

  /**
   * Environment mode. Defaults to NODE_ENV.
   * - 'development': Warnings only, watermark shown
   * - 'production': Watermark shown if unlicensed
   */
  env?: 'development' | 'production'

  /**
   * Suppress console warnings in development mode.
   * @default false
   */
  silent?: boolean
}

let initialized = false

/**
 * Initialize Clarity Chat with your license key.
 *
 * Call this once at app startup, before rendering any Clarity components.
 *
 * @example
 * ```tsx
 * // app/layout.tsx or _app.tsx
 * import { initializeClarity } from '@clarity-chat/react'
 *
 * initializeClarity({
 *   license: process.env.CLARITY_LICENSE,
 * })
 * ```
 *
 * @example With explicit options
 * ```tsx
 * initializeClarity({
 *   license: 'CC-1-eyJ...',
 *   env: 'production',
 *   silent: false,
 * })
 * ```
 */
export function initializeClarity(
  options: InitializeClarityOptions = {}
): void {
  if (initialized) {
    return
  }

  const {
    license,
    env = (typeof process !== 'undefined'
      ? process.env?.NODE_ENV
      : 'development') as 'development' | 'production',
    silent = false,
  } = options

  // Try to get license from options or environment
  const licenseKey =
    license ??
    (typeof process !== 'undefined'
      ? process.env?.CLARITY_LICENSE
      : undefined) ??
    (typeof process !== 'undefined'
      ? process.env?.NEXT_PUBLIC_CLARITY_LICENSE
      : undefined)

  // Set the license key
  if (licenseKey) {
    // NOTE: LicenseInfo doesn't exist - license package not available
    // LicenseInfo.setLicenseKey(licenseKey)
    // TODO: Implement when license package is available
  }

  // Warn in development if no license
  if (env === 'development' && !licenseKey && !silent) {
    console.warn(
      '[Clarity Chat] Running without a license key.\n' +
        'A watermark will be displayed. To remove it, set CLARITY_LICENSE in your environment.\n' +
        'Get your license at: https://claritychat.dev/pricing'
    )
  }

  initialized = true
}

/**
 * Check if Clarity has been initialized.
 * Useful for debugging and testing.
 */
export function isClarityInitialized(): boolean {
  return initialized
}

/**
 * Reset initialization state.
 * Only use this for testing purposes.
 * @internal
 */
export function resetClarityInitialization(): void {
  initialized = false
}
