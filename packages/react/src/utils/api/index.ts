/**
 * API Utilities
 *
 * Utilities for API requests, rate limiting, and model routing.
 */

export {
  BatchRequestManager,
  estimateBatchSavings,
  shouldUseBatch,
  createOpenAIBatchFile,
  createAnthropicBatchFile,
  parseOpenAIBatchResults,
  type BatchRequest,
  type BatchJob,
  type BatchJobStatus,
  type BatchResult,
  type BatchConfig,
  type BatchCostEstimate,
  type BatchStats,
  type BatchMessage,
} from './batch-api'

export {
  fetchWithTimeout,
  TimeoutError,
  isTimeoutError,
  isAbortError,
  type FetchWithTimeoutOptions,
} from './fetch-with-timeout'

export * from './request-batcher'

export {
  RequestDeduplicator,
  DebouncedError,
  isDebouncedError,
  createMessageKey,
  createDeduplicator,
  type DeduplicationOptions,
  type DeduplicationStats,
} from './request-deduplication'

export * from './rate-limiting'

export {
  parseRateLimitHeaders,
  calculateRetryDelay,
  shouldThrottle,
  RateLimitInfoError,
  type RateLimitInfo,
} from './rate-limit-headers'

export * from './model-router'
export * from './model-fallback'
