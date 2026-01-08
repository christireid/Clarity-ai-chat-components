/**
 * Validation Utilities
 *
 * Type guards, assertions, and validation helpers.
 *
 * This module has been enhanced to include strict TypeScript validation utilities
 * that were previously duplicated in /apps/docs/lib/typescript/strict.ts
 *
 * @module @clarity-chat/utils/validation
 *
 * @example
 * ```ts
 * import {
 *   isString,
 *   validateString,
 *   assertString,
 *   strictTypeOf
 * } from '@clarity-chat/utils/validation'
 *
 * // Type guards
 * if (isString(value)) {
 *   // value is narrowed to string
 * }
 *
 * // Validation with detailed errors
 * const result = validateString(value, { minLength: 5, maxLength: 100 })
 * if (!result.success) {
 *   console.error(result.errors)
 * }
 *
 * // Assertions
 * assertDefined(user, 'User is required')
 * // user is now non-nullable
 * console.log(user.name)
 *
 * // Strict runtime type checking
 * const str = strictTypeOf(value, isString, 'Expected string')
 * ```
 */
// Re-export everything from the enhanced validation module
export * from './enhanced';
//# sourceMappingURL=index.js.map