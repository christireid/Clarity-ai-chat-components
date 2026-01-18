/**
 * Environment Detection Utilities
 *
 * Centralized, consistent environment detection for use across all Clarity Chat packages.
 * Provides both simple checks and advanced runtime detection.
 *
 * @module @clarity-chat/utils/env
 *
 * @example
 * ```ts
 * import { isBrowser, isNode, isServer, detectEnvironment } from '@clarity-chat/utils/env'
 *
 * if (isBrowser()) {
 *   // Browser-specific code
 * }
 *
 * const env = detectEnvironment() // 'browser' | 'node' | 'serverless' | 'unknown'
 * ```
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const window: any
declare const indexedDB: any
declare const Worker: any
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Runtime environment type
 */
export type RuntimeEnvironment = 'browser' | 'node' | 'serverless' | 'unknown'

/**
 * Check if code is running in a browser environment
 *
 * @returns True if running in a browser
 *
 * @example
 * ```ts
 * if (isBrowser()) {
 *   window.localStorage.setItem('key', 'value')
 * }
 * ```
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined'
}

/**
 * Check if code is running in a server environment (non-browser)
 *
 * @returns True if NOT running in a browser
 *
 * @example
 * ```ts
 * if (isServer()) {
 *   // Server-side code
 * }
 * ```
 */
export function isServer(): boolean {
  return !isBrowser()
}

/**
 * Check if code is running in Node.js
 *
 * @returns True if running in Node.js
 *
 * @example
 * ```ts
 * if (isNode()) {
 *   // Node.js-specific code
 *   const fs = require('fs')
 * }
 * ```
 */
export function isNode(): boolean {
  return (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null
  )
}

/**
 * Check if code is running in a serverless environment
 *
 * Detects common serverless platforms: Vercel, AWS Lambda, Google Cloud Functions,
 * Azure Functions, Netlify Functions, Cloudflare Workers.
 *
 * @returns True if running in a serverless environment
 *
 * @example
 * ```ts
 * if (isServerless()) {
 *   // Optimize for cold starts
 * }
 * ```
 */
export function isServerless(): boolean {
  if (typeof process === 'undefined') return false

  const env = process.env || {}

  return !!(
    env.VERCEL ||
    env.AWS_LAMBDA_FUNCTION_NAME ||
    env.FUNCTION_NAME || // Google Cloud Functions
    env.AZURE_FUNCTIONS_ENVIRONMENT ||
    env.NETLIFY ||
    // Cloudflare Workers (they have a different global)
    (typeof globalThis !== 'undefined' &&
      'caches' in globalThis &&
      !isBrowser())
  )
}

/**
 * Detect the current runtime environment
 *
 * @returns The detected runtime environment
 *
 * @example
 * ```ts
 * const env = detectEnvironment()
 * switch (env) {
 *   case 'browser':
 *     // Use IndexedDB
 *     break
 *   case 'serverless':
 *     // Use lightweight storage
 *     break
 *   case 'node':
 *     // Use file system
 *     break
 * }
 * ```
 */
export function detectEnvironment(): RuntimeEnvironment {
  if (isBrowser()) {
    return 'browser'
  }

  if (isNode()) {
    if (isServerless()) {
      return 'serverless'
    }
    return 'node'
  }

  return 'unknown'
}

/**
 * Check if IndexedDB is available
 *
 * @returns True if IndexedDB is available
 */
export function isIndexedDBAvailable(): boolean {
  if (!isBrowser()) return false

  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null
  } catch {
    return false
  }
}

/**
 * Check if localStorage is available
 *
 * @returns True if localStorage is available and accessible
 */
export function isLocalStorageAvailable(): boolean {
  if (!isBrowser()) return false

  try {
    const testKey = '__storage_test__'
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Check if the Fetch API is available
 *
 * @returns True if fetch is available
 */
export function isFetchAvailable(): boolean {
  return typeof fetch === 'function'
}

/**
 * Check if Web Workers are available
 *
 * @returns True if Web Workers are available
 */
export function isWebWorkerAvailable(): boolean {
  return isBrowser() && typeof Worker !== 'undefined'
}

/**
 * Check if the code is running in development mode
 *
 * @returns True if NODE_ENV is 'development' or not set
 */
export function isDevelopment(): boolean {
  if (typeof process === 'undefined') return false
  return process.env?.NODE_ENV === 'development' || !process.env?.NODE_ENV
}

/**
 * Check if the code is running in production mode
 *
 * @returns True if NODE_ENV is 'production'
 */
export function isProduction(): boolean {
  if (typeof process === 'undefined') return false
  return process.env?.NODE_ENV === 'production'
}

/**
 * Check if the code is running in test mode
 *
 * @returns True if NODE_ENV is 'test' or VITEST/JEST globals are present
 */
export function isTest(): boolean {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
    return true
  }

  // Check for common test runner globals
  return (
    typeof (globalThis as Record<string, unknown>).vi !== 'undefined' || // Vitest
    typeof (globalThis as Record<string, unknown>).jest !== 'undefined' // Jest
  )
}
