/**
 * Tool Calling System - Standalone Export
 *
 * Complete tool calling system that works with ANY React application.
 * No Clarity Chat components required!
 *
 * @module tools
 * @example
 * ```typescript
 * import { ToolOrchestrator, executeWithRetry } from '@clarity-chat/react/tools'
 *
 * const orchestrator = new ToolOrchestrator({ tools: [...] })
 * const result = await executeWithRetry(orchestrator, 'my_tool', args)
 * ```
 */

// =============================================================================
// Core Components (Framework Agnostic)
// =============================================================================

export { ToolRegistry } from '../core/tool-registry'
export { ToolExecutor } from '../core/tool-executor'
export { ToolLifecycleManager } from '../core/tool-lifecycle'
export { ToolOrchestrator } from '../core/tool-orchestrator'

// =============================================================================
// Utility Functions (Framework Agnostic)
// =============================================================================

export {
  executeWithRetry,
  executeWithFallback,
  executeWithTimeout,
  executeWithLogging,
  executeWithAll,
  executeBatch,
  type RetryOptions,
  type FallbackOptions,
  type TimeoutOptions,
  type LogOptions,
} from '../utils/tool-execution'

export {
  ToolPerformanceMonitor,
  formatPerformanceReport,
  compareReports,
  type PerformanceMetric,
  type PerformanceStats,
  type PerformanceReport,
  type MonitorOptions,
} from '../utils/tool-performance'

// =============================================================================
// React Components (Optional - only if using React)
// =============================================================================

export {
  ToolApprovalDialog,
  type ToolApprovalDialogProps,
} from '../components/tool-approval/ToolApprovalDialog'

// =============================================================================
// Types
// =============================================================================

export type {
  ToolDefinition,
  ToolArguments,
  ToolResult,
  ToolExecutionContext,
} from '../../types/tool-definition'

export type {
  ToolCallRecord,
  ToolCallStatus,
  ToolLifecycleEvent,
  ToolLifecycleEventType,
} from '../core/tool-lifecycle'

export type {
  OrchestrationResult,
  OrchestratorConfig,
  // OrchestratorStats, // NOTE: Type doesn't exist in tool-orchestrator
  // CacheStats, // NOTE: Type doesn't exist in tool-orchestrator
} from '../core/tool-orchestrator'

export type { ExecutionResult, ValidationError } from '../core/tool-executor'

// =============================================================================
// Re-export for convenience
// =============================================================================

/**
 * Create a ToolOrchestrator instance
 *
 * Convenience function for creating an orchestrator
 *
 * @example
 * ```typescript
 * const orchestrator = createToolOrchestrator({
 *   autoApprove: false,
 *   tools: [weatherTool, calculatorTool]
 * })
 * ```
 */
export function createToolOrchestrator(
  config?: import('../core/tool-orchestrator').OrchestratorConfig
) {
  const {
    ToolOrchestrator: Orchestrator,
  } = require('../core/tool-orchestrator')
  return new Orchestrator(config)
}
