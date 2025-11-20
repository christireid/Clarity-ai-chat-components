/**
 * TOON (Token-Oriented Object Notation) Utilities
 *
 * Provides JSON ↔ TOON conversion for 30-60% token savings on structured data.
 *
 * @example
 * ```ts
 * import { jsonToToon, toonToJson, useToonOptimization } from './utils/toon'
 *
 * // Convert data to TOON for LLM input
 * const data = [
 *   { name: "Alice", age: 30, city: "NYC" },
 *   { name: "Bob", age: 25, city: "SF" }
 * ]
 *
 * const toon = jsonToToon(data)
 * // name, age, city
 * // Alice, 30, NYC
 * // Bob, 25, SF
 *
 * // Parse TOON response back to JSON
 * const parsed = toonToJson(toon)
 * ```
 */

export * from './encoder'
export * from './decoder'
export * from './optimizer'
export * from './types'
