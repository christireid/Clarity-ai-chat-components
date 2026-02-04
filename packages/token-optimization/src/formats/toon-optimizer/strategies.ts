/**
 * TOON optimization strategies and utilities
 * @module toon-optimizer/strategies
 */

import { encode } from 'gpt-tokenizer'
import type { ToonConfig } from './core'

/**
 * Savings estimation result
 *
 * @example
 * ```typescript
 * const savings = estimateSavings(largeDataset, config);
 * if (savings.recommendation === 'use-toon') {
 *   const toon = encode(largeDataset);
 * }
 * ```
 */
export interface SavingsEstimate {
  /** Estimated tokens for JSON representation */
  jsonTokens: number
  /** Estimated tokens for TOON representation */
  toonTokens: number
  /** Percentage of tokens saved */
  savingsPercent: number
  /** Recommendation based on savings */
  recommendation: 'use-toon' | 'use-json' | 'marginal'
}

/**
 * Token savings information
 */
export interface SavingsInfo {
  /** JSON token count */
  jsonTokens: number
  /** TOON token count */
  toonTokens: number
  /** Absolute token savings */
  savings: number
  /** Percentage savings */
  percentage: number
}

/**
 * Calculate token savings compared to JSON
 *
 * Uses real GPT tokenizer for accurate token counts.
 *
 * @param json - JSON string
 * @param toon - TOON string
 * @returns Savings information with actual token counts
 */
export function calculateSavings(json: string, toon: string): SavingsInfo {
  // Use real GPT tokenizer for accurate token counts
  const jsonTokens = encode(json).length
  const toonTokens = encode(toon).length

  const savings = jsonTokens - toonTokens
  const percentage = jsonTokens > 0 ? (savings / jsonTokens) * 100 : 0

  return {
    jsonTokens,
    toonTokens,
    savings,
    percentage: Math.round(percentage * 100) / 100,
  }
}

/**
 * Estimate token savings for data
 *
 * Computes actual token counts for both JSON and TOON representations
 * using GPT tokenizer and provides a recommendation on which format to use.
 *
 * Uses real tokenization (gpt-tokenizer) for accurate measurements.
 * Based on benchmarks, TOON typically achieves 20-45% token savings vs JSON.
 *
 * @param json - JSON string representation
 * @param toon - TOON string representation
 * @returns Savings estimate with recommendation
 *
 * @example
 * ```typescript
 * const savings = estimateSavings(json, toon);
 *
 * console.log(`JSON: ${savings.jsonTokens} tokens`);
 * console.log(`TOON: ${savings.toonTokens} tokens`);
 * console.log(`Savings: ${savings.savingsPercent}%`);
 * console.log(`Recommendation: ${savings.recommendation}`);
 * ```
 */
export function estimateSavings(json: string, toon: string): SavingsEstimate {
  // Use real GPT tokenizer for accurate token counts
  const jsonTokens = encode(json).length
  const toonTokens = encode(toon).length

  const savings = jsonTokens - toonTokens
  const savingsPercent =
    jsonTokens > 0 ? Math.round((savings / jsonTokens) * 100 * 100) / 100 : 0

  let recommendation: 'use-toon' | 'use-json' | 'marginal'
  if (savingsPercent >= 20) {
    recommendation = 'use-toon'
  } else if (savingsPercent <= 5) {
    recommendation = 'use-json'
  } else {
    recommendation = 'marginal'
  }

  return {
    jsonTokens,
    toonTokens,
    savingsPercent,
    recommendation,
  }
}

/**
 * Optimize data structure for TOON
 *
 * Normalizes data structure to ensure uniform arrays can be converted
 * to tabular format for maximum token savings.
 *
 * @param data - Data to optimize
 * @returns Optimized data structure
 */
export function optimizeDataStructure(data: unknown): unknown {
  if (Array.isArray(data) && data.length > 0) {
    // Ensure uniform structure for arrays
    const firstItem = data[0]
    if (typeof firstItem === 'object' && firstItem !== null) {
      const keys = Object.keys(firstItem).sort()

      return data.map((item) => {
        if (typeof item !== 'object' || item === null) {
          return item
        }
        const uniformItem: Record<string, unknown> = {}
        keys.forEach((key) => {
          uniformItem[key] = (item as Record<string, unknown>)[key] ?? null
        })
        return uniformItem
      })
    }
  }

  if (typeof data === 'object' && data !== null) {
    // Optimize nested structures
    const optimized: Record<string, unknown> = {}

    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        optimized[key] = optimizeDataStructure(value)
      } else if (typeof value === 'object' && value !== null) {
        optimized[key] = optimizeDataStructure(value)
      } else {
        optimized[key] = value
      }
    })

    return optimized
  }

  return data
}

/**
 * Check if array should use table format
 */
export function shouldUseTableFormat(
  arr: unknown[],
  config: ToonConfig
): boolean {
  if (!config.enableArrayTables) return false
  if (arr.length === 0) return true
  if (arr.length < 3) return false // Table format efficient for 3+ items
  if (arr.length > config.maxArraySizeForTable) return false

  return isUniformArray(arr)
}

/**
 * Check if all array items have the same structure
 */
export function isUniformArray(arr: unknown[]): boolean {
  if (arr.length === 0) return true

  // All items must be objects
  if (
    !arr.every(
      (item) =>
        typeof item === 'object' && item !== null && !Array.isArray(item)
    )
  ) {
    return false
  }

  // All objects must have the same keys
  const firstKeys = Object.keys(arr[0] as Record<string, unknown>).sort()
  return arr.every((item) => {
    const itemKeys = Object.keys(item as Record<string, unknown>).sort()
    return JSON.stringify(firstKeys) === JSON.stringify(itemKeys)
  })
}

/**
 * Check if array contains only primitive values
 */
export function isPrimitiveArray(arr: unknown[]): boolean {
  return arr.every(
    (item) =>
      item === null ||
      typeof item === 'string' ||
      typeof item === 'number' ||
      typeof item === 'boolean'
  )
}
