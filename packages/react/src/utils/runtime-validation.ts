/**
 * Runtime Validation Utilities
 * 
 * Developer-friendly validation functions for public APIs.
 * These provide clear, actionable error messages.
 */

/**
 * Validate that a required string prop is provided
 */
export function validateRequiredString(
  value: unknown,
  propName: string,
  componentName: string,
  example?: string
): asserts value is string {
  if (!value) {
    throw new Error(
      `[${componentName}] Missing required prop "${propName}". ` +
      (example ? `Example: ${example}` : `Please provide a value for "${propName}".`)
    )
  }

  if (typeof value !== 'string') {
    throw new Error(
      `[${componentName}] Invalid "${propName}" prop. ` +
      `Expected a string, got: ${typeof value}`
    )
  }

  if (value.trim() === '') {
    throw new Error(
      `[${componentName}] Invalid "${propName}" prop. ` +
      `Expected a non-empty string, got an empty string.`
    )
  }
}

/**
 * Validate that a value is one of the allowed options
 */
export function validateEnum<T extends string>(
  value: unknown,
  propName: string,
  componentName: string,
  allowedValues: readonly T[],
  defaultValue?: T
): T {
  if (value === undefined && defaultValue !== undefined) {
    return defaultValue
  }

  if (!allowedValues.includes(value as T)) {
    throw new Error(
      `[${componentName}] Invalid "${propName}" prop. ` +
      `Expected one of: ${allowedValues.join(', ')}, got: ${value}`
    )
  }

  return value as T
}

/**
 * Validate that a provider is available in context
 */
export function validateProvider<T>(
  contextValue: T | null,
  providerName: string,
  hookName: string
): asserts contextValue is T {
  if (!contextValue) {
    throw new Error(
      `[${hookName}] ${providerName} is not available. ` +
      `Please wrap your component with <${providerName}> to use this hook.`
    )
  }
}

/**
 * Validate API endpoint format
 */
export function validateApiEndpoint(
  api: unknown,
  componentName: string
): asserts api is string {
  validateRequiredString(api, 'api', componentName, `<${componentName} api="/api/chat" />`)

  // Warn about common mistakes
  if (api.startsWith('http://localhost') || api.startsWith('http://127.0.0.1')) {
    console.warn(
      `[${componentName}] Using localhost API endpoint. ` +
      'Make sure your API server is running and accessible.'
    )
  }
}

/**
 * Validate that a function is provided
 */
export function validateFunction(
  value: unknown,
  propName: string,
  componentName: string
// eslint-disable-next-line
): asserts value is Function {
  if (value === undefined || value === null) {
    return // Optional callbacks are allowed
  }

  if (typeof value !== 'function') {
    throw new Error(
      `[${componentName}] Invalid "${propName}" prop. ` +
      `Expected a function, got: ${typeof value}`
    )
  }
}

/**
 * Validate storage key format
 */
export function validateStorageKey(
  key: unknown,
  hookName: string
): asserts key is string {
  if (key === undefined || key === null) {
    return // Optional, will use default
  }

  if (typeof key !== 'string' || key.trim() === '') {
    console.warn(
      `[${hookName}] Invalid "storageKey" option. ` +
      'Expected a non-empty string, using default: "clarity-chat"'
    )
  }
}
