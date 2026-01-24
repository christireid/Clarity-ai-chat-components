/**
 * Environment Detection Utilities
 *
 * Provides runtime environment detection for browser, Node.js, and serverless environments.
 * This is the canonical implementation - all other packages should import from here.
 *
 * @packageDocumentation
 */

/**
 * Runtime environment types
 */
export type RuntimeEnvironment = 'browser' | 'node' | 'serverless' | 'unknown'

/**
 * Check if code is running in a browser environment
 *
 * @returns true if running in a browser (window and document are defined)
 *
 * @example
 * ```typescript
 * if (isBrowser()) {
 *   // Use browser APIs
 *   localStorage.setItem('key', 'value')
 * }
 * ```
 */
export function isBrowser(): boolean {
  // Use globalThis to avoid TypeScript errors when DOM types are not available
  return (
    typeof globalThis !== 'undefined' &&
    // @ts-expect-error - window may not be defined in Node.js environments
    typeof globalThis.window !== 'undefined' &&
    // @ts-expect-error - document may not be defined in Node.js environments
    typeof globalThis.window.document !== 'undefined'
  )
}

/**
 * Check if code is running in Node.js environment
 *
 * @returns true if running in Node.js (process.versions.node is defined)
 *
 * @example
 * ```typescript
 * if (isNode()) {
 *   // Use Node.js APIs
 *   const fs = require('fs')
 * }
 * ```
 */
export function isNode(): boolean {
  return (
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as { process?: { versions?: { node?: string } } })
      .process?.versions?.node === 'string'
  )
}

/**
 * Check if code is running in a server environment (alias for isNode)
 *
 * @returns true if running in Node.js
 */
export function isServer(): boolean {
  return isNode()
}

/**
 * Detect the current runtime environment with serverless detection
 *
 * @returns The detected runtime environment
 *
 * @example
 * ```typescript
 * const env = detectEnvironment()
 * switch (env) {
 *   case 'browser':
 *     // Browser-specific code
 *     break
 *   case 'serverless':
 *     // Serverless-specific code (stateless)
 *     break
 *   case 'node':
 *     // Node.js-specific code
 *     break
 * }
 * ```
 */
export function detectEnvironment(): RuntimeEnvironment {
  // Check for browser
  if (isBrowser()) {
    return 'browser'
  }

  // Check for Node.js
  if (isNode()) {
    // Check for serverless environments
    if (typeof process !== 'undefined' && process.env) {
      if (
        process.env.VERCEL ||
        process.env.AWS_LAMBDA_FUNCTION_NAME ||
        process.env.CLOUDFLARE_WORKERS ||
        process.env.NETLIFY
      ) {
        return 'serverless'
      }
    }
    return 'node'
  }

  return 'unknown'
}

/**
 * Check if running in development mode
 *
 * @returns true if NODE_ENV is 'development' or not set
 */
export function isDev(): boolean {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
  }
  return false
}

/**
 * Check if running in production mode
 *
 * @returns true if NODE_ENV is 'production'
 */
export function isProd(): boolean {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'production'
  }
  return false
}

/**
 * Check if running in test mode
 *
 * @returns true if NODE_ENV is 'test'
 */
export function isTest(): boolean {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'test'
  }
  return false
}

/**
 * Check if running in CI environment
 *
 * @returns true if CI environment variable is set
 */
export function isCi(): boolean {
  if (typeof process !== 'undefined' && process.env) {
    return Boolean(process.env.CI)
  }
  return false
}

/**
 * Get environment variable value
 *
 * @param key - Environment variable name
 * @param defaultValue - Default value if not set
 * @returns Environment variable value or default
 *
 * @example
 * ```typescript
 * const apiKey = getEnv('API_KEY', 'default-key')
 * const port = getEnv('PORT', '3000')
 * ```
 */
export function getEnv(key: string, defaultValue?: string): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] ?? defaultValue
  }
  return defaultValue
}
