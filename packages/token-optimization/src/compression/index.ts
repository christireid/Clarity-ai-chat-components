/**
 * Compression Module Index
 * 
 * Advanced compression implementations for token optimization
 */

export { BasicCompressionEngine } from './basic-engine'
export type { 
  CompressionStrategy, 
  CompressionResult, 
  CompressionConfig 
} from './basic-engine'

export { DynamicCompressionEngine } from './dynamic-compression'
export type { 
  DynamicCompressionConfig,
  CompressionStrategy as DynamicCompressionStrategy,
  CompressionResult as DynamicCompressionResult,
  QualityMetrics,
  CompressionContext
} from './dynamic-compression'