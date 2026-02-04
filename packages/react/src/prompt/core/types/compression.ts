/**
 * Shared Compression Types
 *
 * Extracted from circular dependency between prompt-optimizer and strategy-router
 */

/**
 * Compression strategy options
 */
export type CompressionStrategy =
  | 'truncate'
  | 'summarize'
  | 'extract'
  | 'adaptive'
  | 'semantic-grouping'
  | 'tool-condensing'
  | 'intent-summarization'

/**
 * Compression log entry
 */
export interface CompressionLog {
  strategy: CompressionStrategy
  description: string
  tokensSaved?: number
}
