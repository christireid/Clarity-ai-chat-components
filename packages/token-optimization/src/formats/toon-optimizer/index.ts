/**
 * TOON (Token-Oriented Object Notation) Optimizer
 *
 * Implements the TOON format for 20-45% token savings vs JSON (measured).
 * Combines YAML-like indentation with CSV-style tabular arrays.
 *
 * @module toon-optimizer
 * @description A comprehensive parser and encoder for the TOON format,
 * designed to minimize token usage in LLM contexts while maintaining
 * full round-trip capability with JSON data.
 *
 * @example
 * ```typescript
 * // Basic usage
 * const optimizer = new ToonOptimizer({
 *   enableArrayTables: true,
 *   maxArraySizeForTable: 100,
 *   preserveKeys: false,
 *   compactNumbers: true,
 *   quoteStrings: false
 * });
 *
 * // Encode to TOON
 * const toon = optimizer.encode({
 *   users: [
 *     { id: 1, name: 'Alice', role: 'admin' },
 *     { id: 2, name: 'Bob', role: 'user' }
 *   ]
 * });
 * // Result:
 * // users[2]{id,name,role}:
 * //   1,Alice,admin
 * //   2,Bob,user
 *
 * // Decode back to object
 * const data = optimizer.decode(toon);
 *
 * // Estimate savings
 * const savings = optimizer.estimateSavings(data);
 * console.log(savings.savingsPercent); // e.g., 45.2
 * ```
 */

// Core exports
export { ToonOptimizer, TOONParseError } from './core'
export type { ToonConfig } from './core'

// Validation exports
export { validateAgainstSchema } from './validators'
export type {
  TOONSchema,
  TOONSchemaField,
  ValidationResult,
  ValidationError,
} from './validators'

// Strategy exports
export { calculateSavings, optimizeDataStructure } from './strategies'
export type { SavingsEstimate, SavingsInfo } from './strategies'

// Re-export for backwards compatibility
import { ToonOptimizer } from './core'
import { validateAgainstSchema } from './validators'
import type { TOONSchema } from './validators'
import type { ValidationResult } from './validators'

/**
 * Convenience function to encode data to TOON format
 *
 * @param data - Data to encode
 * @returns TOON formatted string
 *
 * @example
 * ```typescript
 * const toon = encodeToon({ users: [{ id: 1, name: 'Alice' }] });
 * ```
 */
export function encodeToon(data: unknown): string {
  return ToonOptimizer.optimizeForLLM(data)
}

/**
 * Convenience function to decode TOON format
 *
 * @param toon - TOON formatted string
 * @returns Parsed data
 *
 * @example
 * ```typescript
 * const data = decodeToon('users[1]{id,name}:\n  1,Alice');
 * ```
 */
export function decodeToon(toon: string): unknown {
  const optimizer = new ToonOptimizer({
    enableArrayTables: true,
    maxArraySizeForTable: 100,
    preserveKeys: false,
    compactNumbers: true,
    quoteStrings: false,
  })
  return optimizer.decode(toon)
}

/**
 * Validate data against a TOON schema
 *
 * @param data - Data to validate
 * @param schema - Schema to validate against
 * @returns Validation result
 */
export function validateToon(
  data: unknown,
  schema: TOONSchema
): ValidationResult {
  return validateAgainstSchema(data, schema)
}
