/**
 * ClarityError - Actionable error class for Clarity Chat components
 *
 * Provides developer-friendly error messages with:
 * - Clear error codes for searchability
 * - Actionable suggestions for resolution
 * - Links to relevant documentation
 * - Context about what went wrong
 *
 * The validation helpers in this module compose with the type guards from
 * `../internal/assertions` to provide consistent checking with enriched
 * error context for better developer experience.
 */
import { isArray, isDefined, isPlainObject, isNonEmptyString, } from '../internal/assertions';
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
    code;
    context;
    constructor(code, message, context = {}) {
        // Build the full error message
        const fullMessage = ClarityError.formatMessage(code, message, context);
        super(fullMessage);
        this.name = 'ClarityError';
        this.code = code;
        this.context = context;
        // Maintain proper stack trace in V8 engines
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ClarityError);
        }
    }
    /**
     * Format the error message with all context
     */
    static formatMessage(code, message, context) {
        const lines = [];
        // Header with component name
        if (context.component) {
            lines.push(`[Clarity Chat] ${context.component}: ${message}`);
        }
        else {
            lines.push(`[Clarity Chat] ${message}`);
        }
        lines.push('');
        lines.push(`Error Code: ${code}`);
        // What was received vs expected
        if (context.prop && context.received !== undefined) {
            lines.push('');
            lines.push(`  Prop: ${context.prop}`);
            lines.push(`  Received: ${JSON.stringify(context.received)}`);
            if (context.expected) {
                lines.push(`  Expected: ${context.expected}`);
            }
        }
        // Documentation link
        if (context.docs) {
            lines.push('');
            lines.push(`📚 Documentation: ${context.docs}`);
        }
        return lines.join('\n');
    }
    /**
     * Check if an error is a ClarityError
     */
    static isClarityError(error) {
        return error instanceof ClarityError;
    }
}
// ============================================================================
// Validation Helpers
// ============================================================================
/**
 * Validates that a prop is an array
 *
 * Composes with `isArray()` from internal/assertions for consistent type checking.
 */
export function validateArrayProp(value, propName, componentName, docsUrl) {
    if (!isArray(value)) {
        throw new ClarityError('INVALID_PROP_TYPE', `"${propName}" must be an array`, {
            component: componentName,
            prop: propName,
            received: typeof value,
            expected: 'Array',
            docs: docsUrl,
        });
    }
}
/**
 * Validates that a required prop is present
 *
 * Composes with `isDefined()` from internal/assertions for consistent null checking.
 */
export function validateRequiredProp(value, propName, componentName, docsUrl) {
    if (!isDefined(value)) {
        throw new ClarityError('MISSING_REQUIRED_PROP', `"${propName}" is required but was not provided`, {
            component: componentName,
            prop: propName,
            received: value,
            expected: 'non-null value',
            docs: docsUrl,
        });
    }
}
/**
 * Validates message role
 */
export function validateMessageRole(role, componentName) {
    const validRoles = ['user', 'assistant', 'system'];
    if (typeof role !== 'string' || !validRoles.includes(role)) {
        throw new ClarityError('INVALID_MESSAGE_ROLE', `Invalid message role "${role}"`, {
            component: componentName,
            prop: 'message.role',
            received: role,
            expected: validRoles.join(' | '),
            docs: 'https://clarity-chat.dev/api/types#message',
        });
    }
}
/**
 * Validates messages array structure
 *
 * Composes with `isPlainObject()` and `isNonEmptyString()` from internal/assertions
 * for consistent type checking with enriched error context.
 */
export function validateMessagesArray(messages, componentName) {
    validateArrayProp(messages, 'messages', componentName, 'https://clarity-chat.dev/api/types#message');
    // Validate each message has required fields
    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        if (!isPlainObject(msg)) {
            throw new ClarityError('INVALID_PROP_TYPE', `messages[${i}] must be an object`, {
                component: componentName,
                prop: `messages[${i}]`,
                received: typeof msg,
                expected: 'Message object',
                docs: 'https://clarity-chat.dev/api/types#message',
            });
        }
        if (!isNonEmptyString(msg.id)) {
            throw new ClarityError('INVALID_PROP_TYPE', `messages[${i}].id must be a non-empty string`, {
                component: componentName,
                prop: `messages[${i}].id`,
                received: typeof msg.id,
                expected: 'string',
            });
        }
        if (typeof msg.content !== 'string') {
            throw new ClarityError('INVALID_PROP_TYPE', `messages[${i}].content must be a string`, {
                component: componentName,
                prop: `messages[${i}].content`,
                received: typeof msg.content,
                expected: 'string',
            });
        }
    }
}
//# sourceMappingURL=clarity-error.js.map