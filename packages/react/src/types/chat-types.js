/**
 * Enhanced TypeScript types for chat hooks
 *
 * Provides better type inference and type safety
 */
import { isString, isArray } from '@clarity-chat/utils/validation';
/**
 * Type guard for string content
 */
export function isStringContent(content) {
    return isString(content);
}
/**
 * Type guard for array content
 */
export function isArrayContent(content) {
    return isArray(content);
}
/**
 * Type guard for text content part
 */
export function isTextContentPart(part) {
    return (typeof part === 'object' &&
        part !== null &&
        'type' in part &&
        part.type === 'text');
}
/**
 * Type guard for image content part
 */
export function isImageContentPart(part) {
    return (typeof part === 'object' &&
        part !== null &&
        'type' in part &&
        part.type === 'image');
}
/**
 * Type guard for tool call content part
 */
export function isToolCallContentPart(part) {
    return (typeof part === 'object' &&
        part !== null &&
        'type' in part &&
        part.type === 'tool-call');
}
/**
 * Type guard for tool result content part
 */
export function isToolResultContentPart(part) {
    return (typeof part === 'object' &&
        part !== null &&
        'type' in part &&
        part.type === 'tool-result');
}
/**
 * Create typed message builder
 */
export class TypedMessageBuilder {
    static user(content) {
        return {
            role: 'user',
            content,
        };
    }
    static assistant(content) {
        return {
            role: 'assistant',
            content,
        };
    }
    static system(content) {
        return {
            role: 'system',
            content,
        };
    }
    static tool(toolCallId, toolName, result) {
        return {
            role: 'tool',
            content: [
                {
                    type: 'tool-result',
                    toolCallId,
                    toolName,
                    result,
                },
            ],
            toolCallId,
        };
    }
    static multimodal(role, parts) {
        return {
            role,
            content: parts,
        };
    }
}
/**
 * Type-safe message validator
 */
export class MessageValidator {
    static validate(message) {
        const errors = [];
        if (!message.role) {
            errors.push('Message must have a role');
        }
        const validRoles = ['user', 'assistant', 'system', 'function', 'tool'];
        if (!validRoles.includes(message.role)) {
            errors.push(`Invalid role: ${message.role}`);
        }
        if (message.content === undefined || message.content === null) {
            errors.push('Message must have content');
        }
        if (typeof message.content === 'string' && message.content.trim() === '') {
            errors.push('Message content cannot be empty');
        }
        if (Array.isArray(message.content) && message.content.length === 0) {
            errors.push('Message content array cannot be empty');
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    static validateBatch(messages) {
        const errors = [];
        messages.forEach((message, index) => {
            const validation = this.validate(message);
            if (!validation.valid) {
                errors.push({ index, errors: validation.errors });
            }
        });
        return {
            valid: errors.length === 0,
            errors,
        };
    }
}
//# sourceMappingURL=chat-types.js.map