/**
 * Compression Strategy Interface
 */

import type { Memory } from '../types'

export interface CompressionResult {
  compressed: string
  original: string
  compressionRatio: number
  tokensSaved: number
  method: string
}

export interface CompressionStrategy {
  compress(memory: Memory, targetRatio: number): Promise<CompressionResult>
  canCompress(memory: Memory): boolean
}
