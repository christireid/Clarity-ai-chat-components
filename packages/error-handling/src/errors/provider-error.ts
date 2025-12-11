import { ClarityError } from './base-error'
import { ProviderErrorCode } from './error-codes'

export { ProviderErrorCode }

/**
 * Supported AI providers
 */
export type AIProvider = 'openai' | 'anthropic' | 'google' | 'azure' | 'cohere'

/**
 * AI provider-specific errors
 */
export class ProviderError extends ClarityError {
  readonly code: ProviderErrorCode
  readonly statusCode: number
  readonly provider: AIProvider
  readonly model?: string
  readonly retryAfter?: number // seconds

  constructor(
    message: string,
    options: {
      code: ProviderErrorCode
      provider: AIProvider
      statusCode?: number
      model?: string
      retryAfter?: number
      cause?: Error
      context?: Record<string, unknown>
      solution?: string
      docs?: string
    }
  ) {
    super(message, {
      cause: options.cause,
      context: {
        ...options.context,
        provider: options.provider,
        model: options.model,
      },
      recoverable: options.code === ProviderErrorCode.RATE_LIMIT,
      solution: options.solution,
      docs: options.docs,
    })

    // Required for proper instanceof checks
    Object.setPrototypeOf(this, ProviderError.prototype)

    this.code = options.code
    this.provider = options.provider
    this.statusCode = options.statusCode ?? 500
    this.model = options.model
    this.retryAfter = options.retryAfter
  }

  /**
   * Create a rate limit error
   */
  static rateLimit(
    provider: AIProvider,
    retryAfter?: number,
    model?: string
  ): ProviderError {
    const message = retryAfter
      ? `Rate limit exceeded. Retry after ${retryAfter} seconds.`
      : 'Rate limit exceeded.'

    return new ProviderError(message, {
      code: ProviderErrorCode.RATE_LIMIT,
      provider,
      statusCode: 429,
      retryAfter,
      model,
      solution: retryAfter
        ? `Please wait ${retryAfter} seconds before trying again.`
        : 'Please wait a moment before trying again.',
    })
  }

  /**
   * Create a context length exceeded error
   */
  static contextLengthExceeded(
    provider: AIProvider,
    limit: number,
    actual: number,
    model?: string
  ): ProviderError {
    return new ProviderError(
      `Context length ${actual} exceeds maximum ${limit} tokens`,
      {
        code: ProviderErrorCode.CONTEXT_LENGTH,
        provider,
        statusCode: 400,
        model,
        context: { limit, actual },
        solution:
          'Your conversation is too long. Try starting a new chat or summarizing previous messages.',
      }
    )
  }

  /**
   * Create a content filter error
   */
  static contentFiltered(provider: AIProvider, model?: string): ProviderError {
    return new ProviderError('Content was flagged by safety filters', {
      code: ProviderErrorCode.CONTENT_FILTER,
      provider,
      statusCode: 400,
      model,
      solution: 'Please revise your message and try again.',
    })
  }

  /**
   * Create an invalid API key error
   */
  static invalidApiKey(provider: AIProvider): ProviderError {
    return new ProviderError(`Invalid ${provider} API key`, {
      code: ProviderErrorCode.INVALID_API_KEY,
      provider,
      statusCode: 401,
      solution: 'Please check your API key configuration.',
    })
  }

  /**
   * Create a model not found error
   */
  static modelNotFound(provider: AIProvider, model: string): ProviderError {
    return new ProviderError(`Model "${model}" not found or not accessible`, {
      code: ProviderErrorCode.MODEL_NOT_FOUND,
      provider,
      statusCode: 404,
      model,
      solution: 'Please verify the model name and your API access.',
    })
  }

  /**
   * Create a quota exceeded error
   */
  static quotaExceeded(provider: AIProvider): ProviderError {
    return new ProviderError(`${provider} quota exceeded`, {
      code: ProviderErrorCode.QUOTA_EXCEEDED,
      provider,
      statusCode: 429,
      solution: 'You have exceeded your API quota. Please check your billing.',
    })
  }

  /**
   * Create a service unavailable error
   */
  static serviceUnavailable(
    provider: AIProvider,
    cause?: Error
  ): ProviderError {
    return new ProviderError(`${provider} service is temporarily unavailable`, {
      code: ProviderErrorCode.SERVICE_UNAVAILABLE,
      provider,
      statusCode: 503,
      cause,
      solution:
        'The AI service is experiencing issues. Please try again later.',
    })
  }

  /**
   * Create a provider-specific error from response
   */
  static fromProviderResponse(
    provider: AIProvider,
    statusCode: number,
    errorBody: { error?: { message?: string; type?: string; code?: string } },
    model?: string
  ): ProviderError {
    const message = errorBody.error?.message || `${provider} API error`
    const errorType = errorBody.error?.type || errorBody.error?.code

    // Map common error types to our codes
    let code: ProviderErrorCode = ProviderErrorCode.OPENAI_ERROR
    if (provider === 'anthropic') code = ProviderErrorCode.ANTHROPIC_ERROR
    if (provider === 'google') code = ProviderErrorCode.GOOGLE_ERROR

    // Detect specific error types
    if (statusCode === 429) {
      code = ProviderErrorCode.RATE_LIMIT
    } else if (statusCode === 401) {
      code = ProviderErrorCode.INVALID_API_KEY
    } else if (
      errorType?.includes('context_length') ||
      message.toLowerCase().includes('context length')
    ) {
      code = ProviderErrorCode.CONTEXT_LENGTH
    } else if (
      errorType?.includes('content_policy') ||
      message.toLowerCase().includes('content policy')
    ) {
      code = ProviderErrorCode.CONTENT_FILTER
    }

    return new ProviderError(message, {
      code,
      provider,
      statusCode,
      model,
      context: { errorType, rawError: errorBody },
    })
  }

  override get userMessage(): string {
    switch (this.code) {
      case ProviderErrorCode.RATE_LIMIT:
        return this.retryAfter
          ? `Rate limit exceeded. Please try again in ${this.retryAfter} seconds.`
          : 'Rate limit exceeded. Please try again later.'
      case ProviderErrorCode.CONTEXT_LENGTH:
        return 'Your message is too long. Please shorten it and try again.'
      case ProviderErrorCode.CONTENT_FILTER:
        return 'Your message was flagged by content filters. Please revise and try again.'
      case ProviderErrorCode.INVALID_API_KEY:
        return 'Authentication failed. Please check your API configuration.'
      case ProviderErrorCode.MODEL_NOT_FOUND:
        return `The model "${this.model}" is not available.`
      case ProviderErrorCode.QUOTA_EXCEEDED:
        return 'API quota exceeded. Please check your usage limits.'
      case ProviderErrorCode.SERVICE_UNAVAILABLE:
        return 'The AI service is temporarily unavailable. Please try again later.'
      default:
        return super.userMessage
    }
  }
}

/**
 * Type guard for ProviderError
 */
export function isProviderError(error: unknown): error is ProviderError {
  return error instanceof ProviderError
}
