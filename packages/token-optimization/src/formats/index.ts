/**
 * Format Optimization Utilities
 *
 * This module provides optimizers for various content formats to reduce
 * token usage when sending to LLMs.
 *
 * @module formats
 *
 * @example
 * ```typescript
 * import {
 *   // TOON (Token-Oriented Object Notation)
 *   ToonOptimizer,
 *   encodeToon,
 *   decodeToon,
 *   validateToon,
 *
 *   // Markdown optimization
 *   MarkdownOptimizer,
 *   stripMarkdown,
 *   compressMarkdown,
 *
 *   // HTML optimization
 *   HTMLOptimizer,
 *   htmlToText,
 *   htmlToMarkdown
 * } from '@clarity-ai/token-optimization'
 *
 * // Optimize JSON data with TOON (30-60% savings)
 * const toon = encodeToon({ users: [{ id: 1, name: 'Alice' }] })
 *
 * // Strip markdown formatting (10-20% savings)
 * const plain = stripMarkdown('# Hello **World**')
 *
 * // Convert HTML to text
 * const text = htmlToText('<h1>Welcome</h1>')
 * ```
 */

// TOON (Token-Oriented Object Notation) exports
export {
  ToonOptimizer,
  TOONParseError,
  encodeToon,
  decodeToon,
  validateToon,
} from './toon-optimizer'

export type {
  ToonConfig,
  TOONSchema,
  TOONSchemaField,
  ValidationResult,
  ValidationError,
  SavingsEstimate as ToonSavingsEstimate,
  SavingsInfo,
} from './toon-optimizer'

// Markdown optimization exports
export {
  MarkdownOptimizer,
  stripMarkdown,
  compressMarkdown,
} from './markdown-optimizer'

export type {
  MarkdownCompressOptions,
  CodeBlock,
  SavingsEstimate as MarkdownSavingsEstimate,
} from './markdown-optimizer'

// HTML optimization exports
export { HTMLOptimizer, htmlToText, htmlToMarkdown } from './html-optimizer'

export type { HTMLToTextOptions } from './html-optimizer'
