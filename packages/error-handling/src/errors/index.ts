/**
 * Base error class for all Clarity Chat errors
 * Provides helpful context, solutions, and documentation links
 */
export class ClarityChatError extends Error {
  public readonly code: string
  public readonly solution?: string
  public readonly docs?: string
  public readonly context?: Record<string, any>

  constructor(
    message: string,
    options?: {
      code?: string
      solution?: string
      docs?: string
      context?: Record<string, any>
    }
  ) {
    super(message)
    this.name = 'ClarityChatError'
    this.code = options?.code || 'UNKNOWN_ERROR'
    this.solution = options?.solution
    this.docs = options?.docs
    this.context = options?.context

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  toString(): string {
    let message = `${this.name} [${this.code}]: ${this.message}`
    
    if (this.solution) {
      message += `\n\n💡 Solution: ${this.solution}`
    }
    
    if (this.docs) {
      message += `\n\n📚 Documentation: ${this.docs}`
    }
    
    if (this.context) {
      message += `\n\n🔍 Context: ${JSON.stringify(this.context, null, 2)}`
    }
    
    return message
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      solution: this.solution,
      docs: this.docs,
      context: this.context,
      stack: this.stack,
    }
  }
}

/**
 * Configuration errors - invalid or missing configuration
 */
export class ConfigurationError extends ClarityChatError {
  constructor(
    message: string,
    options?: {
      code?: string
      solution?: string
      docs?: string
      context?: Record<string, any>
    }
  ) {
    super(message, options)
    this.name = 'ConfigurationError'
  }
}

/**
 * API errors - HTTP request failures, invalid responses
 */
export class APIError extends ClarityChatError {
  public readonly statusCode?: number

  constructor(
    message: string,
    options?: {
      code?: string
      solution?: string
      docs?: string
      context?: Record<string, any>
      statusCode?: number
    }
  ) {
    super(message, options)
    this.name = 'APIError'
    this.statusCode = options?.statusCode
  }
}

/**
 * Authentication errors - missing or invalid credentials
 */
export class AuthenticationError extends ClarityChatError {
  constructor(
    message: string,
    options?: {
      code?: string
      solution?: string
      docs?: string
      context?: Record<string, any>
    }
  ) {
    super(message, options)
    this.name = 'AuthenticationError'
  }
}

/**
 * Rate limit errors - too many requests
 */
export class RateLimitError extends ClarityChatError {
  public readonly retryAfter?: number
  public readonly limit?: number
  public readonly remaining?: number

  constructor(
    message: string,
    options?: {
      code?: string
      solution?: string
      docs?: string
      context?: Record<string, any>
      retryAfter?: number
      limit?: number
      remaining?: number
    }
  ) {
    super(message, options)
    this.name = 'RateLimitError'
    this.retryAfter = options?.retryAfter
    this.limit = options?.limit
    this.remaining = options?.remaining
  }
}

/**
 * Validation errors - invalid input data
 */
export class ValidationError extends ClarityChatError {
  public readonly field?: string
  public readonly value?: any
  public readonly expected?: string

  constructor(
    message: string,
    options?: {
      code?: string
      solution?: string
      docs?: string
      context?: Record<string, any>
      field?: string
      value?: any
      expected?: string
    }
  ) {
    super(message, options)
    this.name = 'ValidationError'
    this.field = options?.field
    this.value = options?.value
    this.expected = options?.expected
  }
}

/**
 * Stream errors - streaming connection issues
 */
export class StreamError extends ClarityChatError {
  constructor(
    message: string,
    options?: {
      code?: string
      solution?: string
      docs?: string
      context?: Record<string, any>
    }
  ) {
    super(message, options)
    this.name = 'StreamError'
  }
}

/**
 * Token limit errors - message or context too long
 */
export class TokenLimitError extends ClarityChatError {
  public readonly limit?: number
  public readonly actual?: number

  constructor(
    message: string,
    options?: {
      code?: string
      solution?: string
      docs?: string
      context?: Record<string, any>
      limit?: number
      actual?: number
    }
  ) {
    super(message, options)
    this.name = 'TokenLimitError'
    this.limit = options?.limit
    this.actual = options?.actual
  }
}

/**
 * Network errors - connection failures
 */
export class NetworkError extends ClarityChatError {
  constructor(
    message: string,
    options?: {
      code?: string
      solution?: string
      docs?: string
      context?: Record<string, any>
    }
  ) {
    super(message, options)
    this.name = 'NetworkError'
  }
}

/**
 * Timeout errors - request took too long
 */
export class TimeoutError extends ClarityChatError {
  public readonly timeout?: number

  constructor(
    message: string,
    options?: {
      code?: string
      solution?: string
      docs?: string
      context?: Record<string, any>
      timeout?: number
    }
  ) {
    super(message, options)
    this.name = 'TimeoutError'
    this.timeout = options?.timeout
  }
}

/**
 * Component errors - React component lifecycle issues
 */
export class ComponentError extends ClarityChatError {
  public readonly componentName?: string

  constructor(
    message: string,
    options?: {
      code?: string
      solution?: string
      docs?: string
      context?: Record<string, any>
      componentName?: string
    }
  ) {
    super(message, options)
    this.name = 'ComponentError'
    this.componentName = options?.componentName
  }
}
