/**
 * Cross-platform Crypto Utilities
 *
 * Provides isomorphic implementations for cryptographic operations
 * that work in both Node.js and browser environments.
 *
 * @module utils/crypto
 */

/**
 * Cross-platform SHA-256 hash function that works in both Node.js and browsers.
 *
 * In browser environments, uses the Web Crypto API (crypto.subtle).
 * In Node.js environments, uses the built-in crypto module.
 *
 * @param str - The string to hash
 * @returns A promise that resolves to the hex-encoded SHA-256 hash
 *
 * @example
 * ```typescript
 * const hash = await hashString('hello world')
 * console.log(hash) // '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
 * ```
 */
export async function hashString(str: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    // Browser environment - use Web Crypto API
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  } else {
    // Node.js environment - use built-in crypto module
    const { createHash } = await import('crypto')
    return createHash('sha256').update(str).digest('hex')
  }
}

/**
 * Cross-platform base64 encoding that works in both Node.js and browsers.
 *
 * Handles Unicode strings properly by encoding to UTF-8 first.
 *
 * @param str - The string to encode
 * @returns The base64-encoded string
 *
 * @example
 * ```typescript
 * const encoded = toBase64('Hello, World!')
 * console.log(encoded) // 'SGVsbG8sIFdvcmxkIQ=='
 * ```
 */
export function toBase64(str: string): string {
  if (typeof btoa !== 'undefined') {
    // Browser environment - use btoa with UTF-8 encoding
    return btoa(unescape(encodeURIComponent(str)))
  } else {
    // Node.js environment - use Buffer
    return Buffer.from(str, 'utf-8').toString('base64')
  }
}

/**
 * Cross-platform base64 decoding that works in both Node.js and browsers.
 *
 * Handles Unicode strings properly by decoding from UTF-8.
 *
 * @param str - The base64-encoded string to decode
 * @returns The decoded string
 *
 * @example
 * ```typescript
 * const decoded = fromBase64('SGVsbG8sIFdvcmxkIQ==')
 * console.log(decoded) // 'Hello, World!'
 * ```
 */
export function fromBase64(str: string): string {
  if (typeof atob !== 'undefined') {
    // Browser environment - use atob with UTF-8 decoding
    return decodeURIComponent(escape(atob(str)))
  } else {
    // Node.js environment - use Buffer
    return Buffer.from(str, 'base64').toString('utf-8')
  }
}

/**
 * Cross-platform string to bytes conversion using TextEncoder.
 *
 * Works identically in both Node.js and browser environments.
 *
 * @param str - The string to convert
 * @returns A Uint8Array containing the UTF-8 encoded bytes
 *
 * @example
 * ```typescript
 * const bytes = stringToBytes('hello')
 * console.log(bytes) // Uint8Array [104, 101, 108, 108, 111]
 * ```
 */
export function stringToBytes(str: string): Uint8Array {
  const encoder = new TextEncoder()
  return encoder.encode(str)
}

/**
 * Cross-platform bytes to string conversion using TextDecoder.
 *
 * Works identically in both Node.js and browser environments.
 *
 * @param bytes - The Uint8Array to convert
 * @returns The decoded string
 *
 * @example
 * ```typescript
 * const str = bytesToString(new Uint8Array([104, 101, 108, 108, 111]))
 * console.log(str) // 'hello'
 * ```
 */
export function bytesToString(bytes: Uint8Array): string {
  const decoder = new TextDecoder('utf-8')
  return decoder.decode(bytes)
}

/**
 * Generates a simple hash for cache key purposes (non-cryptographic).
 *
 * This is a fast, cross-platform hash suitable for cache keys.
 * Not suitable for security purposes.
 *
 * @param str - The string to hash
 * @returns A hex-encoded hash string
 *
 * @example
 * ```typescript
 * const key = simpleHash('cache-key-input')
 * console.log(key) // '7f3e2a1b'
 * ```
 */
export function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash + char) | 0
  }
  // Convert to unsigned 32-bit integer and then to hex
  return (hash >>> 0).toString(16).padStart(8, '0')
}
