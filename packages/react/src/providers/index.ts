/**
 * Providers Index
 *
 * Core context providers for clarity-chat.
 * These providers establish shared state and enable component interconnection.
 *
 * Usage:
 * ```tsx
 * import {
 *   ClarityChatProvider,
 *   AgentExecutionProvider
 * } from '@clarity-chat/react/providers'
 *
 * <ClarityChatProvider adapter={myAdapter}>
 *   <AgentExecutionProvider>
 *     <MyApp />
 *   </AgentExecutionProvider>
 * </ClarityChatProvider>
 * ```
 */

// ============================================================================
// ClarityChatProvider - Unified Chat Context
// ============================================================================

export {
  ClarityChatProvider,
  useClarityChat,
  useIsConnected,
  useChatMessages,
  useChatStreamStatus,
  useChatTools,
  useChatThinking,
  // Types
  type ClarityChatProviderProps,
  type ClarityChatContextValue,
  type ClarityChatConfig,
  type ChatMessage,
  type StreamStatus,
  type ThinkingStep,
  type ToolExecution,
  type MessageAttachment,
  type ClarityEventType,
  type ClarityEventHandler,
} from './ClarityChatProvider'

// ============================================================================
// AgentExecutionProvider - Agent Execution Context
// ============================================================================

export {
  AgentExecutionProvider,
  useAgentExecution,
  useIsAgentExecutionConnected,
  // Selectors
  useAgentPlan,
  useAgentTools,
  useAgentThinking,
  useAgentStatus,
  // Types
  type AgentExecutionProviderProps,
  type AgentExecutionContextValue,
  type AgentExecutionState,
  type ExecutionStatus,
  type PlanStep,
  type PlanStepStatus,
  type ToolCall,
  type ToolCallStatus,
  type ThinkingStep as AgentThinkingStep,
  type ThinkingStepStatus,
  type ExecutionError,
  type TimeTracking,
  type AgentExecutionEventType,
  type AgentExecutionEvent,
  type ExecutionSummary,
} from './AgentExecutionProvider'
