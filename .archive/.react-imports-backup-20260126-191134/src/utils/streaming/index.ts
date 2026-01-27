/**
 * Streaming Utilities
 *
 * Utilities for handling streaming responses and parsing.
 */

export * from './streaming-helpers'
export * from './streamable-value'

export {
  StreamingResponseMonitor,
  PartialResponseCache,
  createOptimizedStreamHandler,
  hashQuery,
  estimateResponseLength,
  getRecommendedMaxTokens,
  DEFAULT_COMPLETION_SIGNALS,
  DEFAULT_EARLY_STOP_PATTERNS,
  type StreamingOptimizationConfig,
  type ChunkAnalysis,
  type StreamingMetrics,
  type PartialResponseEntry,
} from './streaming-optimizer'

export * from './streaming-parser'

export {
  MessageDeduplicator,
  useMessageDeduplicator,
  type DeduplicatableMessage,
  type MessageDeduplicatorOptions,
} from './message-deduplicator'

export {
  SequenceValidator,
  useSequenceValidator,
  type SequencedMessage,
  type SequenceValidationResult,
  type SequenceValidatorOptions,
} from './sequence-validator'
