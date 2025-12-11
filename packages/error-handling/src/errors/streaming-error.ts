import { ClarityError } from './base-error'
import { StreamingErrorCode } from './error-codes'

export { StreamingErrorCode }

/**
 * Transport types for streaming connections
 */
export type StreamTransport = 'sse' | 'websocket' | 'fetch'

/**
 * SSE/WebSocket streaming errors
 */
export class StreamingError extends ClarityError {
  readonly code: StreamingErrorCode
  readonly statusCode: number
  readonly transport: StreamTransport
  readonly partialContent?: string

  constructor(
    message: string,
    options: {
      code: StreamingErrorCode
      transport: StreamTransport
      statusCode?: number
      partialContent?: string
      cause?: Error
      context?: Record<string, unknown>
      solution?: string
      docs?: string
    }
  ) {
    // Connection errors are often recoverable
    const recoverableCodes: StreamingErrorCode[] = [
      StreamingErrorCode.CONNECTION_LOST,
      StreamingErrorCode.TIMEOUT,
      StreamingErrorCode.CONNECTION_FAILED,
    ]
    const isRecoverable = recoverableCodes.includes(options.code)

    super(message, {
      cause: options.cause,
      context: {
        ...options.context,
        transport: options.transport,
        partialContentLength: options.partialContent?.length,
      },
      recoverable: isRecoverable,
      solution: options.solution,
      docs: options.docs,
    })

    // Required for proper instanceof checks
    Object.setPrototypeOf(this, StreamingError.prototype)

    this.code = options.code
    this.statusCode = options.statusCode ?? 500
    this.transport = options.transport
    this.partialContent = options.partialContent
  }

  /**
   * Create a connection failed error
   */
  static connectionFailed(
    transport: StreamTransport,
    cause?: Error,
    context?: Record<string, unknown>
  ): StreamingError {
    return new StreamingError('Failed to establish streaming connection', {
      code: StreamingErrorCode.CONNECTION_FAILED,
      transport,
      cause,
      context,
      solution: 'Check your network connection and try again.',
    })
  }

  /**
   * Create a connection lost error
   */
  static connectionLost(
    transport: StreamTransport,
    partialContent?: string,
    cause?: Error
  ): StreamingError {
    return new StreamingError('Streaming connection was lost', {
      code: StreamingErrorCode.CONNECTION_LOST,
      transport,
      partialContent,
      cause,
      solution:
        'Connection was interrupted. Your partial response has been preserved.',
    })
  }

  /**
   * Create a parse error
   */
  static parseError(
    transport: StreamTransport,
    cause?: Error,
    partialContent?: string
  ): StreamingError {
    return new StreamingError('Failed to parse streaming response', {
      code: StreamingErrorCode.PARSE_ERROR,
      transport,
      partialContent,
      cause,
      solution: 'The server response was malformed. Please try again.',
    })
  }

  /**
   * Create a timeout error
   */
  static timeout(transport: StreamTransport, timeout: number): StreamingError {
    return new StreamingError(
      `Streaming connection timed out after ${timeout}ms`,
      {
        code: StreamingErrorCode.TIMEOUT,
        transport,
        context: { timeout },
        solution: 'The response took too long. Please try a shorter message.',
      }
    )
  }

  /**
   * Create an aborted error
   */
  static aborted(
    transport: StreamTransport,
    partialContent?: string
  ): StreamingError {
    return new StreamingError('Streaming was aborted', {
      code: StreamingErrorCode.ABORTED,
      transport,
      partialContent,
      statusCode: 499,
      solution: 'The request was cancelled.',
    })
  }

  /**
   * Create a provider error (wrapped from AI provider)
   */
  static providerError(
    transport: StreamTransport,
    providerError: Error,
    partialContent?: string
  ): StreamingError {
    return new StreamingError(providerError.message, {
      code: StreamingErrorCode.PROVIDER_ERROR,
      transport,
      partialContent,
      cause: providerError,
      solution: 'The AI provider returned an error. Please try again.',
    })
  }

  /**
   * Check if this error has usable partial content
   */
  get hasPartialContent(): boolean {
    return Boolean(this.partialContent && this.partialContent.trim().length > 0)
  }

  override get userMessage(): string {
    switch (this.code) {
      case StreamingErrorCode.CONNECTION_FAILED:
        return 'Failed to connect to the chat server. Please check your connection.'
      case StreamingErrorCode.CONNECTION_LOST:
        return this.hasPartialContent
          ? 'Connection lost, but your partial response was saved.'
          : 'Connection lost. Please try again.'
      case StreamingErrorCode.TIMEOUT:
        return 'The response took too long. Please try a shorter message.'
      case StreamingErrorCode.ABORTED:
        return 'Request was cancelled.'
      case StreamingErrorCode.PARSE_ERROR:
        return 'Received an invalid response. Please try again.'
      case StreamingErrorCode.PROVIDER_ERROR:
        return 'The AI service encountered an error. Please try again.'
      default:
        return super.userMessage
    }
  }
}

/**
 * Type guard for StreamingError
 */
export function isStreamingError(error: unknown): error is StreamingError {
  return error instanceof StreamingError
}
