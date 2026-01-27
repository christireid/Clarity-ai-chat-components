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
 *
 * @module core/tool-executor
 * @deprecated Import from './tool-executor/index' instead
 */

// Re-export all public APIs from the modular implementation
export {
  ToolValidationError,
  validateToolArguments,
  type ToolValidationErrorDetails,
} from './tool-executor/validation'

export { ToolResultCache, type ToolResultCacheConfig } from './tool-executor/cache'

export {
  ToolExecutor,
  type ExecutorConfig,
  type ExecutionOptions,
  type ExecutionResult,
} from './tool-executor/execution'
