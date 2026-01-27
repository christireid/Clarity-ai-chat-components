/**
 * Tool Calling System - Core Module
 *
 * Clean exports for the enterprise tool calling system.
 * Import everything you need from this single entry point.
 *
 * @example
 * ```typescript
 * // Clean imports from single source
 * import {
 *   ToolOrchestrator,
 *   ToolRegistry,
 *   ToolExecutor,
 *   ToolLifecycleManager,
 *   type ToolDefinition,
 *   type ExecutionOptions,
 * } from '@clarity-chat/react/core'
 * ```
 *
 * @module core
 */

// =============================================================================
// Core Classes
// =============================================================================

export { ToolRegistry, globalToolRegistry } from './tool-registry'
export { ToolExecutor } from './tool-executor'
export { ToolLifecycleManager } from './tool-lifecycle'
export { ToolOrchestrator, globalToolOrchestrator } from './tool-orchestrator'

// =============================================================================
// Tool Definition Types
// =============================================================================

export type {
  ToolDefinition,
  ToolParameters,
  ToolParameterProperty,
  ToolArguments,
  ToolResult,
  ToolExecutionContext,
  ToolLifecycleHooks,
  IToolRegistry,
} from '../types/tool-definition'

// =============================================================================
// Executor Types
// =============================================================================

export type {
  ExecutionOptions,
  ExecutionResult,
  ExecutorConfig,
  ToolResultCacheConfig,
} from './tool-executor'

export { ToolValidationError } from './tool-executor'

// =============================================================================
// Unified Error Hierarchy
// =============================================================================

export {
  ToolSystemError,
  ToolRegistryError,
  ToolLifecycleError,
  ToolSecurityError,
  ToolCacheError,
  ToolErrorCode,
  isToolSystemError,
  isToolError,
  toToolSystemError,
} from './tool-errors'

// =============================================================================
// Lifecycle Types
// =============================================================================

export type {
  ToolCallStatus,
  ToolCallRecord,
  ToolLifecycleEvent,
  ToolLifecycleListener,
  ToolLifecycleListeners,
  AuditLogEntry,
  AuditLogConfig,
  AuditLogPersister,
  AuditLogFilter,
} from './tool-lifecycle'

// =============================================================================
// Orchestrator Types
// =============================================================================

export type {
  OrchestratorConfig,
  OrchestrationResult,
} from './tool-orchestrator'

// =============================================================================
// Registry Types
// =============================================================================

export type {
  RegistryEventType,
  RegistryEvent,
  RegistryListener,
} from './tool-registry'

// =============================================================================
// Validation
// =============================================================================

export {
  validateToolImplementation,
  validateToolImplementationStrict,
  isToolImplementationSafe,
  type ValidationResult,
  type ValidationIssue,
} from './tool-implementation-validator'

// =============================================================================
// Utilities
// =============================================================================

export {
  generateToolCallId,
  generateSessionId,
  generateCacheKey,
  isValidToolCallId,
  extractPrefix,
  extractTimestamp,
} from '../utils/id-generator'

// =============================================================================
// Re-exports from tool-invocation for convenience
// =============================================================================

export type {
  ToolInvocation,
  ToolInvocationState,
  PartialToolCall,
  CompleteToolCall,
  ExecutingToolCall,
  ToolCallResult,
  ToolCallError,
} from '../types/tool-invocation'

export {
  getToolInvocations,
  getToolInvocationsByState,
  findToolInvocation,
} from '../types/tool-invocation'
