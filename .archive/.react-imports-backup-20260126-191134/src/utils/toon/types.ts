/**
 * TOON Type Definitions
 */

export type ToonFormat = 'json' | 'toon'

export interface ToonMetadata {
  /** Format used */
  format: ToonFormat
  /** Original tokens */
  originalTokens: number
  /** Optimized tokens */
  optimizedTokens: number
  /** Tokens saved */
  tokensSaved: number
  /** Savings percentage */
  savingsPercent: number
  /** Optimization timestamp */
  timestamp: number
}

export interface ToonStats {
  /** Total conversions */
  conversions: number
  /** Total tokens saved */
  totalTokensSaved: number
  /** Average savings percentage */
  averageSavingsPercent: number
  /** TOON vs JSON usage count */
  formatUsage: {
    toon: number
    json: number
  }
}
