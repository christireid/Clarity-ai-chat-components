/**
 * ClarityError - Actionable error class for Clarity Chat components
 *
 * Provides developer-friendly error messages with:
 * - Clear error codes for searchability
 * - Actionable suggestions for resolution
 * - Links to relevant documentation
 * - Context about what went wrong
 */

export type ClarityErrorCode =
  | 'INVALID_MESSAGES_PROP'
  | 'INVALID_MESSAGE_ROLE'
  | 'INVALID_MESSAGE_CONTENT'
  | 'MISSING_REQUIRED_PROP'
  | 'INVALID_PROP_TYPE'
  | 'PROVIDER_NOT_FOUND'
  | 'CONFIGURATION_ERROR'
  | 'MEMORY_ERROR'
  | 'STREAMING_ERROR'

export interface ClarityErrorContext {
  /** The component where the error occurred */
  component?: string
  /** The prop that caused the error */
  prop?: string
  /** What was received */
  received?: unknown
  /** What was expected */
  expected?: string
  /** Link to documentation */
  docs?: string
}

/**
 * Custom error class for Clarity Chat with actionable information
 *
 * @example
 * ```ts
 * throw new ClarityError(
 *   'INVALID_MESSAGES_PROP',
 *   'Expected messages to be an array',
 *   {
 *     component: 'ChatWindow',
 *     prop: 'messages',
 *     received: typeof messages,
 *     expected: 'Message[]',
 *     docs: 'https://clarity-chat.dev/api/chat-window#messages'
 *   }
 * )
 * ```
 */
export class ClarityError extends Error {
  readonly code: ClarityErrorCode
  readonly context: ClarityErrorContext

  constructor(
    code: ClarityErrorCode,
    message: string,
    context: ClarityErrorContext = {}
  ) {
    // Build the full error message
    const fullMessage = ClarityError.formatMessage(code, message, context)
    super(fullMessage)

    this.name = 'ClarityError'
    this.code = code
    this.context = context

    // Maintain proper stack trace in V8 engines
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ClarityError)
    }
  }

  /**
   * Format the error message with all context
   */
  private static formatMessage(
    code: ClarityErrorCode,
    message: string,
    context: ClarityErrorContext
  ): string {
    const lines: string[] = []

    // Header with component name
    if (context.component) {
      lines.push(`[Clarity Chat] ${context.component}: ${message}`)
    } else {
      lines.push(`[Clarity Chat] ${message}`)
    }

    lines.push('')
    lines.push(`Error Code: ${code}`)

    // What was received vs expected
    if (context.prop && context.received !== undefined) {
      lines.push('')
      lines.push(`  Prop: ${context.prop}`)
      lines.push(`  Received: ${JSON.stringify(context.received)}`)
      if (context.expected) {
        lines.push(`  Expected: ${context.expected}`)
      }
    }

    // Documentation link
    if (context.docs) {
      lines.push('')
      lines.push(`📚 Documentation: ${context.docs}`)
    }

    return lines.join('\n')
  }

  /**
   * Check if an error is a ClarityError
   */
  static isClarityError(error: unknown): error is ClarityError {
    return error instanceof ClarityError
  }
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates that a prop is an array
 */
export function validateArrayProp(
  value: unknown,
  propName: string,
  componentName: string,
  docsUrl?: string
): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new ClarityError(
      'INVALID_PROP_TYPE',
      `"${propName}" must be an array`,
      {
        component: componentName,
        prop: propName,
        received: typeof value,
        expected: 'Array',
        docs: docsUrl,
      }
    )
  }
}

/**
 * Validates that a required prop is present
 */
export function validateRequiredProp(
  value: unknown,
  propName: string,
  componentName: string,
  docsUrl?: string
): asserts value is NonNullable<typeof value> {
  if (value === undefined || value === null) {
    throw new ClarityError(
      'MISSING_REQUIRED_PROP',
      `"${propName}" is required but was not provided`,
      {
        component: componentName,
        prop: propName,
        received: value,
        expected: 'non-null value',
        docs: docsUrl,
      }
    )
  }
}

/**
 * Validates message role
 */
export function validateMessageRole(
  role: unknown,
  componentName: string
): asserts role is 'user' | 'assistant' | 'system' {
  const validRoles = ['user', 'assistant', 'system']
  if (typeof role !== 'string' || !validRoles.includes(role)) {
    throw new ClarityError(
      'INVALID_MESSAGE_ROLE',
      `Invalid message role "${role}"`,
      {
        component: componentName,
        prop: 'message.role',
        received: role,
        expected: validRoles.join(' | '),
        docs: 'https://clarity-chat.dev/api/types#message',
      }
    )
  }
}

/**
 * Validates messages array structure
 */
export function validateMessagesArray(
  messages: unknown,
  componentName: string
): asserts messages is Array<{ id: string; role: string; content: string }> {
  validateArrayProp(
    messages,
    'messages',
    componentName,
    'https://clarity-chat.dev/api/types#message'
  )

  // Validate each message has required fields
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i] as Record<string, unknown>

    if (!msg || typeof msg !== 'object') {
      throw new ClarityError(
        'INVALID_PROP_TYPE',
        `messages[${i}] must be an object`,
        {
          component: componentName,
          prop: `messages[${i}]`,
          received: typeof msg,
          expected: 'Message object',
          docs: 'https://clarity-chat.dev/api/types#message',
        }
      )
    }

    if (typeof msg.id !== 'string') {
      throw new ClarityError(
        'INVALID_PROP_TYPE',
        `messages[${i}].id must be a string`,
        {
          component: componentName,
          prop: `messages[${i}].id`,
          received: typeof msg.id,
          expected: 'string',
        }
      )
    }

    if (typeof msg.content !== 'string') {
      throw new ClarityError(
        'INVALID_PROP_TYPE',
        `messages[${i}].content must be a string`,
        {
          component: componentName,
          prop: `messages[${i}].content`,
          received: typeof msg.content,
          expected: 'string',
        }
      )
    }
  }
}
