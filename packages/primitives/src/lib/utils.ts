/**
 * Enhanced Primitives Utilities
 * Extended utilities for enterprise features
 *
 * REFACTORING NOTE: This file has been split into focused modules for better tree-shaking.
 * Import directly from specific modules for optimal bundle size:
 * - @clarity-chat/primitives/utils/number
 * - @clarity-chat/primitives/utils/string
 * - @clarity-chat/primitives/utils/array
 * - @clarity-chat/primitives/utils/object
 * - @clarity-chat/primitives/utils/type-guards
 * - @clarity-chat/primitives/utils/async
 * - @clarity-chat/primitives/utils/file
 * - @clarity-chat/primitives/utils/format
 */

// Re-export all utilities for backwards compatibility
export * from './utils/number'
export * from './utils/string'
export * from './utils/array'
export * from './utils/object'
export * from './utils/type-guards'
export * from './utils/async'
export * from './utils/file'
export * from './utils/format'

// Re-export existing specialized modules
export * from './utils/classnames'
export * from './utils/dom'
export * from './utils/style'
