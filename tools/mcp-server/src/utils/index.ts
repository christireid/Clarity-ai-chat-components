/**
 * Utility Exports for Clarity Chat MCP Server
 *
 * Re-exports all utility modules for external use
 *
 * @module utils
 */

// Core utilities
export {
  Cache,
  CacheKeys,
  projectCache,
  modelCache,
  exampleCache,
  stopCacheCleanup,
} from './cache.js'
export { logger, LogLevel } from './logger.js'
export {
  validateRequired,
  validateString,
  validateEnum,
  validateNumber,
} from './validation.js'

// Error handling
export {
  ErrorCode,
  MCPError,
  ValidationError,
  NotFoundError,
  PermissionError,
  RateLimitError,
  ConfigurationError,
  PluginError,
  TimeoutError,
  formatErrorResponse,
  withErrorHandling,
  createFriendlyMessage,
  isRetryableError,
  getRetryDelay,
} from './errors.js'
export type { RecoverySuggestion, ErrorContext } from './errors.js'

// Event system
export { EventEmitter, serverEvents, withEvents } from './events.js'
export type { MCPServerEvents } from './events.js'

// Health monitoring
export {
  metrics,
  healthChecker,
  getServerHealth,
  getDiagnostics,
  HealthStatus,
} from './health.js'
export type {
  HealthCheckResult,
  ServerHealth,
  ServerMetrics,
} from './health.js'

// Rate limiting
export {
  RateLimiter,
  toolRateLimiter,
  resourceRateLimiter,
  globalRateLimiter,
  createRateLimitError,
  withRateLimit,
} from './rate-limiter.js'
export type {
  RateLimitConfig,
  RequestContext,
  RateLimitResult,
} from './rate-limiter.js'

// Search utilities
export {
  SearchEngine,
  stringSimilarity,
  highlightMatches,
  tokenizeQuery,
  scoreMultiWordMatch,
  createSearchableString,
  componentSearchOptions,
  hookSearchOptions,
} from './search.js'
export type { SearchOptions, SearchResult, SearchMatch } from './search.js'

// Schema validation
export {
  ProviderSchema,
  FrameworkSchema,
  ComponentCategorySchema,
  SafePathSchema,
  InitProjectSchema,
  GetExampleSchema,
  ValidateConfigSchema,
  GetModelInfoSchema,
  CalculateCostSchema,
  AnalyzeProjectSchema,
  DiscoverComponentsSchema,
  GetComponentDocsSchema,
  DiscoverHooksSchema,
  GetHookDocsSchema,
  GetAccessibilitySchema,
  GenerateCodeSchema,
  validateInput,
} from './schemas.js'
export type {
  Provider,
  Framework,
  ComponentCategory,
  InitProjectInput,
  GetExampleInput,
  ValidateConfigInput,
  GetModelInfoInput,
  CalculateCostInput,
  AnalyzeProjectInput,
  DiscoverComponentsInput,
  GetComponentDocsInput,
  DiscoverHooksInput,
  GetHookDocsInput,
  GetAccessibilityInput,
  GenerateCodeInput,
} from './schemas.js'

// Security
export { validateProjectPath } from './security.js'
