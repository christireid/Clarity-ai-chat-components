/**
 * Tool Executor
 *
 * Executes tools with validation, timeout protection, and caching.
 * Integrates with lifecycle manager for state tracking and event emission.
 *
 * **Features**:
 * - JSON Schema validation of parameters
 * - Timeout protection with AbortSignal
 * - Result caching for cacheable tools
 * - Lifecycle integration
 * - Error handling and recovery
 * - Execution hooks
 * - Rate limiting
 * - Concurrency control
 *
 * @module core/tool-executor
 */

// Re-export validation
export {
  ToolValidationError,
  validateToolArguments,
  type ToolValidationErrorDetails,
} from './validation'

// Re-export cache
export { ToolResultCache, type ToolResultCacheConfig } from './cache'

// Re-export execution
export {
  ToolExecutor,
  type ExecutorConfig,
  type ExecutionOptions,
  type ExecutionResult,
} from './execution'
