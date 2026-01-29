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
 * - prompt-composer/ Progressive prompt system with token optimization
 */

// Chat Hooks
export * from './chat'

// PromptComposer Hooks
export * from './prompt-composer'

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

export {
  useAdditionalContext,
  useAdditionalContextProvider,
  AdditionalContextProvider,
  type ContextEntry,
  type ContextUpdateEvent,
  type AddContextOptions,
  type UseAdditionalContextOptions,
  type UseAdditionalContextReturn,
  type SerializeOptions,
  type AdditionalContextProviderProps,
} from './useAdditionalContext'

export {
  useAgentConfig,
  useAgentConfigProvider,
  AgentConfigProvider,
  createPersona,
  createToolConfig,
  mergeConfigs,
  type AIProvider,
  type ResponseStyle,
  type AgentTone,
  type ModelParameters,
  type ToolConfig as AgentToolConfig,
  type PersonaConfig,
  type MemoryConfig,
  type SafetyConfig,
  type AgentConfig,
  type ConfigPreset,
  type UseAgentConfigOptions,
  type UseAgentConfigReturn,
  type AgentConfigProviderProps,
} from './useAgentConfig'

// =============================================================================
// Connected Component Hooks
// =============================================================================

export {
  // Connected hooks for auto-wiring to ClarityChatProvider
  useConnectedThinkingBar,
  useConnectedThinkingPill,
  useConnectedStreamProgress,
  useConnectedConversations,
  useConnectedSender,
  useConnectedToolCard,
  useConnectedChainOfThought,
  useConnectedResponseActions,
  useConnectedWelcome,
  useConnectedPrompts,
  useConnectedSuggestion,
  useConnectedAttachments,
  useConnectedApprovalCard,
  useConnectedProps,
  // HOC for connected components
  withConnected,
  // Types
  type ConnectedThinkingBarProps,
  type ConnectedThinkingPillProps,
  type ConnectedStreamProgressProps,
  type ConnectedConversationsProps,
  type ConnectedSenderProps,
  type ConnectedToolCardProps,
  type ConnectedChainOfThoughtProps,
  type ConnectedResponseActionsProps,
  type ConnectedWelcomeProps,
  type ConnectedPromptsProps,
  type ConnectedSuggestionProps,
  type ConnectedAttachmentsProps,
  type ConnectedApprovalCardProps,
  type WithConnectedProps,
} from './connected'

// =============================================================================
// SDK Bridge Hooks
// =============================================================================

export {
  // Vercel AI bridge (re-exported from adapters)
  useVercelAIBridge,
  // LangChain bridge
  useLangChainBridge,
  // Anthropic direct bridge
  useAnthropicBridge,
  // Generic bridge factory
  useGenericBridge,
  // Types
  type VercelAIBridgeResult,
  type LangChainBridgeOptions,
  type LangChainBridgeResult,
  type AnthropicBridgeOptions,
  type AnthropicBridgeResult,
  type GenericChatState,
  type GenericBridgeOptions,
  type BaseBridgeProps,
} from './bridges'
