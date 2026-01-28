/**
 * Hooks Index
 *
 * This module provides organized access to all hooks.
 * Hooks are grouped by domain for better discoverability:
 *
 * - chat/        Core chat and AI hooks
 * - streaming/   Streaming response hooks
 * - message/     Message management hooks
 * - ui/          UI utility hooks
 * - keyboard/    Keyboard navigation hooks
 * - storage/     Data persistence hooks
 * - token/       Token management hooks
 * - theme/       Theme hooks
 * - resilience/  Error handling and retry hooks
 * - performance/ Performance optimization hooks
 * - dashboard/   Dashboard data hooks
 * - input/       Input handling hooks
 * - context/     Context monitoring hooks
 * - model/       Model selection hooks
 * - security/    Security hooks
 */

// Chat Hooks
export * from './chat'

// Streaming Hooks
export * from './streaming'

// Message Hooks
export * from './message'

// UI Hooks
export * from './ui'

// Keyboard Hooks
export * from './keyboard'

// Storage Hooks
export * from './storage'

// Token Hooks
export * from './token'

// Theme Hooks
export * from './theme'

// Resilience Hooks
export * from './resilience'

// Dashboard Hooks
export * from './dashboard'

// Input Hooks
export * from './input'

// Context Hooks
export * from './context'

// Model Hooks
export * from './model'

// Security Hooks
export * from './security'

// Generative UI Hooks
export {
  useAiState,
  AiStateProvider,
  useAiStateContext,
  useAllAiStates,
  type AiStateUpdateSource,
  type AiStateUpdate,
  type UseAiStateOptions,
  type UseAiStateReturn,
  type AiStateContextValue,
  type AiStateProviderProps,
} from './useAiState'

export {
  useTool,
  useToolContext,
  useTools,
  useToolHistory,
  usePendingTools,
  ToolProvider,
  defineTool,
  defineTools,
  createToolRegistry,
  type Tool,
  type ToolStatus,
  type ToolCall,
  type ToolRegistry,
  type ToolContextValue,
  type ToolProviderProps,
} from './useTool'

export {
  useThread,
  useThreadContext,
  useThreadInput,
  ThreadProvider,
  type MessageRole,
  type MessageStatus,
  type MessageToolCall,
  type RenderedComponent,
  type ThreadMessage,
  type Thread,
  type UseThreadOptions,
  type UseThreadReturn,
  type ThreadContextValue,
  type ThreadProviderProps,
} from './useThread'

export {
  useStreamStatus,
  useStreamStatusContext,
  useIsStreaming,
  useMultiStreamStatus,
  useProgressiveContent,
  StreamStatusProvider,
  type StreamPhase,
  type StreamStatusState,
  type PropStatus,
  type TokenUsage,
  type UseStreamStatusOptions,
  type UseStreamStatusReturn,
  type StreamStatusContextValue,
  type StreamStatusProviderProps,
} from './useStreamStatus'
