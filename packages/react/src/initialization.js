'use client';
import { LicenseInfo } from '@clarity-chat/license';
let initialized = false;
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
export function initializeClarity(options = {}) {
    if (initialized) {
        return;
    }
    const { license, env = (typeof process !== 'undefined'
        ? process.env?.NODE_ENV
        : 'development'), silent = false, } = options;
    // Try to get license from options or environment
    const licenseKey = license ??
        (typeof process !== 'undefined'
            ? process.env?.CLARITY_LICENSE
            : undefined) ??
        (typeof process !== 'undefined'
            ? process.env?.NEXT_PUBLIC_CLARITY_LICENSE
            : undefined);
    // Set the license key
    if (licenseKey) {
        LicenseInfo.setLicenseKey(licenseKey);
    }
    // Warn in development if no license
    if (env === 'development' && !licenseKey && !silent) {
        console.warn('[Clarity Chat] Running without a license key.\n' +
            'A watermark will be displayed. To remove it, set CLARITY_LICENSE in your environment.\n' +
            'Get your license at: https://claritychat.dev/pricing');
    }
    initialized = true;
}
/**
 * Check if Clarity has been initialized.
 * Useful for debugging and testing.
 */
export function isClarityInitialized() {
    return initialized;
}
/**
 * Reset initialization state.
 * Only use this for testing purposes.
 * @internal
 */
export function resetClarityInitialization() {
    initialized = false;
}
//# sourceMappingURL=initialization.js.map