/**
 * Unified Tool Type System
 *
 * Barrel file that consolidates all tool-related types into a single import path.
 * Instead of importing from individual files, consumers can use:
 *
 * ```typescript
 * import {
 *   // Definitions
 *   type ToolDefinition, type ToolParameters, isToolDefinition,
 *   // Invocations
 *   type ToolInvocation, type ChatMessage, hasToolInvocations,
 *   // Result types
 *   type WeatherToolResult, isWeatherToolResult,
 *   // Status
 *   type ToolStatusVariant, getUnifiedStatus,
 * } from '../types/tool'
 * ```
 *
 * @module types/tool
 */

// Tool Definition types
export type {
  ToolParameterProperty,
  ToolParameters,
  ToolArguments,
  ToolResult,
  ToolExecutionContext,
  ToolLifecycleHooks,
  ToolDefinition,
  IToolRegistry,
} from './tool-definition'

export {
  isToolDefinition,
  validateToolDefinition,
} from './tool-definition'

// Tool Invocation types
export type {
  ToolInvocationState,
  PartialToolCall,
  CompleteToolCall,
  ExecutingToolCall,
  ToolCallResult,
  ToolCallError,
  ToolInvocation,
  BaseMessage,
  UserMessage,
  SystemMessage,
  AssistantMessage,
  FunctionMessage,
  ChatMessage,
} from './tool-invocation'

export {
  isAssistantMessage,
  hasToolInvocations,
  isToolInvocationState,
  isToolInvocationComplete,
  isToolInvocationPending,
  getToolInvocations,
  getToolInvocationsByState,
  getPendingToolInvocations,
  getCompletedToolInvocations,
  findToolInvocation,
  countToolInvocationsByState,
  completeToolCall,
  markToolExecuting,
  completeToolWithResult,
  failToolWithError,
  validateToolInvocation,
} from './tool-invocation'

// Tool Result types
export type {
  WeatherToolResult,
  SearchToolResult,
  CalculatorToolResult,
  DatabaseQueryToolResult,
  APICallToolResult,
  CodeExecutionToolResult,
  PriceComparisonToolResult,
  ReviewSummaryToolResult,
  FAQSearchToolResult,
  FileReadToolResult,
  GenericToolResult,
} from './tool-result-types'

export {
  isWeatherToolResult,
  isSearchToolResult,
  isCalculatorToolResult,
  getToolName,
  parseToolArguments,
  validateToolResult,
} from './tool-result-types'

// Tool Status types
export type {
  ToolStatusVariant,
  UnifiedToolStatus,
} from './tool-status'

export {
  lifecycleToInvocationState,
  invocationToLifecycleStatus,
  lifecycleToVariant,
  invocationToVariant,
  LIFECYCLE_STATUS_LABELS,
  getLifecycleStatusLabel,
  INVOCATION_STATE_LABELS,
  getInvocationStateLabel,
  LIFECYCLE_STATUS_ICONS,
  getLifecycleStatusIcon,
  INVOCATION_STATE_ICONS,
  getInvocationStateIcon,
  VARIANT_COLORS,
  getVariantColors,
  isTerminalStatus,
  isActiveStatus,
  isPendingStatus,
  isSuccessStatus,
  isErrorStatus,
  getUnifiedStatus,
  getUnifiedStatusFromInvocation,
} from './tool-status'
