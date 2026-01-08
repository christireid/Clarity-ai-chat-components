/**
 * Case Conversion Utilities
 *
 * Shared utilities for converting between different case formats.
 * Used by generators, templates, and validation.
 */
/**
 * Convert string to PascalCase
 * @example toPascalCase('chat-message') => 'ChatMessage'
 * @example toPascalCase('chatMessage') => 'ChatMessage'
 */
export function toPascalCase(str) {
    if (!str)
        return '';
    return str
        .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
        .replace(/^(.)/, (_, c) => c.toUpperCase());
}
/**
 * Convert string to camelCase
 * @example toCamelCase('ChatMessage') => 'chatMessage'
 * @example toCamelCase('chat-message') => 'chatMessage'
 */
export function toCamelCase(str) {
    if (!str)
        return '';
    return str
        .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
        .replace(/^(.)/, (_, c) => c.toLowerCase());
}
/**
 * Convert string to kebab-case
 * @example toKebabCase('ChatMessage') => 'chat-message'
 * @example toKebabCase('chatMessage') => 'chat-message'
 */
export function toKebabCase(str) {
    if (!str)
        return '';
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}
/**
 * Convert string to SCREAMING_SNAKE_CASE
 * @example toScreamingSnakeCase('chatMessage') => 'CHAT_MESSAGE'
 */
export function toScreamingSnakeCase(str) {
    return toKebabCase(str).replace(/-/g, '_').toUpperCase();
}
/**
 * Convert string to snake_case
 * @example toSnakeCase('chatMessage') => 'chat_message'
 */
export function toSnakeCase(str) {
    return toKebabCase(str).replace(/-/g, '_');
}
//# sourceMappingURL=case.js.map