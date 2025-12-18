import { logger } from '@clarity-chat/utils/logger'
/**
 * Component-Specific Error Utilities
 *
 * Provides developer-friendly error messages for React components
 * with clear descriptions, fixes, and documentation links.
 *
 * @packageDocumentation
 * @internal
 */

import type { ErrorInfo } from 'react'

const DOCS_BASE = 'https://clarity-chat.dev'

/**
 * Error codes for programmatic handling
 */
export type ComponentErrorCode =
  | 'INVALID_PROP'
  | 'MISSING_PROP'
  | 'MISSING_PROVIDER'
  | 'INVALID_MESSAGE_FORMAT'
  | 'INVALID_VARIANT'
  | 'WEBSOCKET_CONNECTION_FAILED'
  | 'STREAM_PARSE_ERROR'
  | 'API_CONFIGURATION_ERROR'
  | 'THEME_ERROR'
  | 'STORAGE_ERROR'

/**
 * Component error options
 */
export interface ComponentErrorOptions {
  /** Error code for programmatic handling */
  code: ComponentErrorCode
  /** Component or hook name */
  component: string
  /** User-friendly error message */
  message: string
  /** Value that was received (if applicable) */
  received?: unknown
  /** Value that was expected (if applicable) */
  expected?: string
  /** Code example showing the fix */
  example?: string
  /** Path to documentation (appended to docs base) */
  docsPath?: string
  /** Original error if this wraps another error */
  cause?: Error
}

/**
 * Custom error class for Clarity Chat React components
 *
 * Provides rich error messages with:
 * - Clear description of what went wrong
 * - What was expected vs. received
 * - Code example showing the fix
 * - Link to documentation
 *
 * @example
 * ```ts
 * throw new ComponentError({
 *   code: 'INVALID_PROP',
 *   component: 'MessageBubble',
 *   message: 'Invalid "variant" prop',
 *   received: 'invalid',
 *   expected: '"user" | "assistant" | "system"',
 *   example: '<MessageBubble variant="user" content="Hello" />',
 *   docsPath: '/components/message-bubble#variants',
 * })
 * ```
 */
export class ComponentError extends Error {
  /** Error code for programmatic handling */
  readonly code: ComponentErrorCode
  /** Component or hook name */
  readonly component: string
  /** Documentation URL */
  readonly docsUrl: string
  /** Original error if this wraps another */
  override readonly cause?: Error

  constructor(options: ComponentErrorOptions) {
    const {
      code,
      component,
      message,
      received,
      expected,
      example,
      docsPath,
      cause,
    } = options

    // Build the full error message
    let fullMessage = `[Clarity Chat] ${component}: ${message}`

    if (received !== undefined) {
      let receivedStr: string
      try {
        receivedStr =
          typeof received === 'object'
            ? JSON.stringify(received, null, 2)
            : String(received)
      } catch {
        // Handle circular references or other stringify failures
        receivedStr = Object.prototype.toString.call(received)
      }
      fullMessage += `\n\nReceived: ${receivedStr}`
    }

    if (expected) {
      fullMessage += `\nExpected: ${expected}`
    }

    if (example) {
      fullMessage += `\n\nExample:\n${example}`
    }

    const docsUrl = docsPath
      ? `${DOCS_BASE}${docsPath}`
      : `${DOCS_BASE}/errors/${code.toLowerCase().replace(/_/g, '-')}`
    fullMessage += `\n\nDocs: ${docsUrl}`

    super(fullMessage)

    this.name = 'ClarityComponentError'
    this.code = code
    this.component = component
    this.docsUrl = docsUrl
    this.cause = cause

    // Maintain proper stack trace for V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ComponentError)
    }
  }

  /**
   * Get a JSON representation of the error
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      component: this.component,
      message: this.message,
      docsUrl: this.docsUrl,
      cause: this.cause?.message,
      stack: this.stack,
    }
  }
}

/**
 * Assert a condition and throw a ComponentError if false
 *
 * @param condition - Condition to check
 * @param options - Error options
 *
 * @example
 * ```ts
 * invariant(
 *   typeof value === 'string',
 *   {
 *     code: 'INVALID_PROP',
 *     component: 'ChatInput',
 *     message: 'value must be a string',
 *   }
 * )
 * ```
 */
export function invariant(
  condition: boolean,
  options: ComponentErrorOptions
): asserts condition {
  if (!condition) {
    throw new ComponentError(options)
  }
}

/**
 * Create an invariant function bound to a specific component
 *
 * @param component - Component name
 * @returns Bound invariant function
 *
 * @example
 * ```ts
 * const invariant = createComponentInvariant('ChatInput')
 * invariant(typeof value === 'string', 'INVALID_PROP', 'value must be a string')
 * ```
 */
export function createComponentInvariant(component: string) {
  return function componentInvariant(
    condition: boolean,
    code: ComponentErrorCode,
    message: string,
    details?: Omit<ComponentErrorOptions, 'code' | 'component' | 'message'>
  ): asserts condition {
    if (!condition) {
      throw new ComponentError({
        code,
        component,
        message,
        ...details,
      })
    }
  }
}

/**
 * Throw an error for missing provider context
 *
 * @param component - Component that needs the provider
 * @param provider - Required provider name
 *
 * @example
 * ```ts
 * const context = useContext(ChatContext)
 * if (!context) {
 *   throwMissingProviderError('ChatInput', 'ChatProvider')
 * }
 * ```
 */
export function throwMissingProviderError(
  component: string,
  provider: string
): never {
  throw new ComponentError({
    code: 'MISSING_PROVIDER',
    component,
    message: `${component} must be used within a ${provider}.`,
    example: `<${provider}>\n  <App>\n    <${component} />\n  </App>\n</${provider}>`,
    docsPath: '/getting-started#provider-setup',
  })
}

/**
 * Throw an error for invalid prop value
 *
 * @param component - Component name
 * @param propName - Prop name
 * @param received - Received value
 * @param expected - Expected type/values
 *
 * @example
 * ```ts
 * if (!VALID_VARIANTS.includes(variant)) {
 *   throwInvalidPropError('Message', 'variant', variant, '"user" | "assistant" | "system"')
 * }
 * ```
 */
export function throwInvalidPropError(
  component: string,
  propName: string,
  received: unknown,
  expected: string
): never {
  throw new ComponentError({
    code: 'INVALID_PROP',
    component,
    message: `Invalid "${propName}" prop.`,
    received,
    expected,
    docsPath: `/components/${component.toLowerCase()}#${propName.toLowerCase()}`,
  })
}

/**
 * Throw an error for missing required prop
 *
 * @param component - Component name
 * @param propName - Prop name that is missing
 *
 * @example
 * ```ts
 * if (!onSubmit) {
 *   throwMissingPropError('ChatInput', 'onSubmit')
 * }
 * ```
 */
export function throwMissingPropError(
  component: string,
  propName: string
): never {
  throw new ComponentError({
    code: 'MISSING_PROP',
    component,
    message: `Required prop "${propName}" is missing.`,
    example: `<${component} ${propName}={...} />`,
    docsPath: `/components/${component.toLowerCase()}#props`,
  })
}

/**
 * Create a safe error boundary handler that logs errors with context
 *
 * @param component - Component name
 * @param onError - Optional additional error handler
 * @returns Error handler function
 *
 * @example
 * ```ts
 * const handleError = createErrorHandler('ChatWidget', (error) => {
 *   analytics.trackError(error)
 * })
 *
 * <ErrorBoundary onError={handleError}>
 *   <Chat />
 * </ErrorBoundary>
 * ```
 */
export function createErrorHandler(
  component: string,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return (error: Error, errorInfo: ErrorInfo) => {
    // Enhance error with component context if not already a ComponentError
    if (!(error instanceof ComponentError)) {
      logger.error(
        `[Clarity Chat] ${component} encountered an error:`,
        error,
        '\n\nComponent Stack:',
        errorInfo.componentStack
      )
    } else {
      logger.error(error.message)
    }

    // Call additional handler if provided
    onError?.(error, errorInfo)
  }
}

/**
 * Wrap a function with error handling that adds component context
 *
 * @param component - Component name
 * @param fn - Function to wrap
 * @returns Wrapped function
 *
 * @example
 * ```ts
 * const safeFetch = withComponentErrorHandling('ChatWidget', async () => {
 *   const response = await fetch('/api/chat')
 *   return response.json()
 * })
 * ```
 */
export function withComponentErrorHandling<
  T extends (...args: unknown[]) => unknown,
>(component: string, fn: T): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args)

      // Handle promises
      if (result instanceof Promise) {
        return result.catch((error: Error) => {
          if (error instanceof ComponentError) {
            throw error
          }
          throw new ComponentError({
            code: 'API_CONFIGURATION_ERROR',
            component,
            message: error.message,
            cause: error,
          })
        })
      }

      return result
    } catch (error) {
      if (error instanceof ComponentError) {
        throw error
      }
      throw new ComponentError({
        code: 'API_CONFIGURATION_ERROR',
        component,
        message: (error as Error).message,
        cause: error as Error,
      })
    }
  }) as T
}

/**
 * Type guard to check if an error is a ComponentError
 *
 * @param error - Error to check
 * @returns true if error is a ComponentError
 */
export function isComponentError(error: unknown): error is ComponentError {
  return error instanceof ComponentError
}
