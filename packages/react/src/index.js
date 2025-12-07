'use client';
/**
 * @clarity-chat/react - Main Entry Point
 *
 * This package provides a layered architecture for building AI chat applications:
 *
 * - Top-Level APIs: Drop-in ready components and hooks (ClarityChat, useClarityChat)
 * - Mid-Level APIs: Composable building blocks (ChatWindow, useChatEnhanced)
 * - Low-Level Primitives: Utilities and internal APIs (normalizeMessages, etc.)
 *
 * @see DESIGN.md for architecture documentation
 * @see packages/react/src/exports.ts for structured exports by domain
 *
 * Quick Start:
 * ```tsx
 * import { ClarityChat } from '@clarity-chat/react'
 * <ClarityChat api="/api/chat" />
 * ```
 */
// ============================================================================
// TOP-LEVEL APIs (Drop-in Ready)
// ============================================================================
// Chat UI - Drop-in components
export { ClarityChat } from './components/clarity-chat';
export { ClarityChatPresets } from './components/clarity-chat-presets';
// Chat State - Primary hook
export { useClarityChat, } from './hooks/use-clarity-chat';
// Structured Output
export { useClarityObject, } from './hooks/use-clarity-object';
// Memory Provider (Top-level)
export { MemoryProvider } from './memory/memory-provider';
// ============================================================================
// MID-LEVEL APIs (Composable Building Blocks)
// ============================================================================
// Chat UI Components
export { ChatWindow } from './components/chat-window';
export { ChatInput } from './components/chat-input';
export { AdvancedChatInput } from './components/advanced-chat-input';
export { default as MessageList } from './components/virtualized-message-list';
export { default as VirtualizedMessageList } from './components/virtualized-message-list';
export { StreamingMessage } from './components/streaming-message';
export { ThinkingIndicator } from './components/thinking-indicator';
export { TypingIndicator } from './components/typing-indicator';
// Chat State Hooks
export { useChat as useChatEnhanced, } from './hooks/use-chat-enhanced';
export { useChatHandlers } from './hooks/use-chat-handlers';
export { useClarityChatWithTools, } from './hooks/use-clarity-chat-with-tools';
// Memory Hooks
export { useMemoryContext } from './memory/memory-provider';
// Streaming Hooks
export * from './hooks/use-streaming-sse';
export * from './hooks/use-streaming-websocket';
export * from './hooks/use-streaming';
export * from './hooks/use-streamable-ui';
// Tools & Agents
export * from './agents/tool-ui-registry';
export { createAgent } from './agents';
// ============================================================================
// LOW-LEVEL PRIMITIVES (Utilities & Internal APIs)
// ============================================================================
// Message Conversion
export { convertCoreMessageToMessage, convertMessageToCoreMessage, convertCoreMessagesToMessages, convertMessagesToCoreMessages, } from './utils/message-conversion';
// Legacy Chat Hook (Deprecated - use useChatEnhanced or useClarityChat instead)
/**
 * @deprecated Use `useChatEnhanced` or `useClarityChat` instead.
 * This hook is maintained for backward compatibility only.
 *
 * Migration:
 * ```tsx
 * // Old
 * const chat = useChat({ api: '/api/chat' })
 *
 * // New (recommended)
 * const chat = useClarityChat({ api: '/api/chat' })
 * // or
 * const chat = useChatEnhanced({ api: '/api/chat' })
 * ```
 */
export { useChat, } from './hooks/use-chat';
export * from './utils/streaming-helpers';
export * from './utils/streamable-value';
// Message Helpers
export { createUserMessage, createAssistantMessage, createSystemMessage, createToolResultMessage, } from './utils/chat-helpers';
// Configuration Helpers
export { createBasicChatConfig, createMemoryChatConfig, createStreamingChatConfig, createEnterpriseChatConfig, isValidApiEndpoint, getApiEndpoint, } from './utils/clarity-chat-helpers';
// Type Utilities
export { isMemoryEnabled, isUserMessage, isAssistantMessage, hasTextContent, extractTextContent, } from './types/clarity-chat-types';
// ============================================================================
// TOKEN OPTIMIZATION (Enhanced 2025)
// ============================================================================
// Enhanced Token Optimization Hook
export { useTokenOptimizationEnhanced, } from './hooks/use-token-optimization-enhanced';
// Token Budget Monitor - Real-time threshold warnings and auto-trimming
export { useTokenBudgetMonitor, getStatusColor, formatTokenUsage, createModelBudgetMonitor, } from './hooks/use-token-budget-monitor';
// KV Cache-Aligned Prompt Builder - Optimizes prompt structure for cache reuse
export { buildKVCacheOptimizedPrompt, createSegment, createSystemSegment, createContextSegment, createRAGSegment, createHistorySegment, createUserSegment, conversationToSegments, validateSegments, estimateKVCacheSavings, PromptBudgetExceededError, } from './utils/kv-cache-prompt-builder';
// Dynamic Output Token Calculator - Intelligent max_tokens based on context
export { calculateDynamicOutputLimit, injectBrevityInstruction, getPreferenceConfig, getTaskTypeConfig, detectTaskType, createModelOutputConfig, getMaxTokens, } from './utils/dynamic-output-limit';
// Persistent Semantic Cache - IndexedDB-backed cache with similarity matching
export { PersistentSemanticCache, createPersistentSemanticCache, usePersistentSemanticCacheConfig, } from './utils/semantic-cache-persistent';
// Original Token Optimization Hook
export { useTokenOptimization, } from './hooks/use-token-optimization';
// TOON (Token-Oriented Object Notation) - 30-60% savings
export { jsonToToon, toonToJson, autoOptimize, formatForLLM, parseFlexible, estimateToonSavings, isSuitableForToon, } from './utils/toon';
// Accurate Tokenization
export { countTokens, countConversationTokens, truncateToTokenBudget, chunkByTokens, getTokenizerStats, clearTokenCache, } from './utils/tokenization';
// Model Pricing & Cost Calculation
export { calculateCost, calculateCacheSavings, estimateConversationCost, compareModelCosts, recommendModel, MODEL_PRICING, } from './utils/tokenization/model-pricing';
// Prompt Caching - 50-90% savings
export { PromptCacheManager, createAnthropicCachedMessages, estimateCacheSavings, } from './utils/prompt-caching';
// Prompt Compression - 20-35% savings
export { compressPrompt, aggressiveCompress, conservativeCompress, balancedCompress, compressConversation, } from './utils/prompt-compression';
// Smart Caching with Semantic Similarity
export { SmartCache, SimpleCache, } from './utils/smart-cache';
// ============================================================================
// ENTERPRISE INFRASTRUCTURE (Top-level Providers)
// ============================================================================
export * from './analytics';
export * from './observability';
export * from './quotas';
export * from './rbac';
export * from './multi-tenancy';
export * from './audit';
export * from './webhooks';
// ============================================================================
// ADDITIONAL EXPORTS (Organized by Feature Area)
// ============================================================================
// Model Adapters
export * from './adapters';
// Vector Stores & Embeddings
export * from './vector-stores';
export * from './embeddings';
// Prompt System
export * from './prompts';
export * from './prompt';
// Document Loaders
export * from './document-loaders';
// AI Safety
export * from './safety';
// ✨ ENHANCED (2025): Comprehensive Security System
export * from './security';
export { useSecurity, useSecurityMonitor, useSecureInput, useSecureChat, useSecurityEvents, useSecurityStats, useRateLimitStatus, } from './hooks/use-security';
// Reranking
export * from './reranking';
// Plugin Architecture
export * from './plugins';
// Theme System
export * from './theme';
// Animation System
export * from './animations';
// Accessibility
export * from './accessibility';
// ============================================================================
// COMPONENTS (Additional UI Components)
// ============================================================================
// Core Message Components
export { Message } from './components/message';
export { MessageMetadata } from './components/message-metadata';
export { MessageOptimized } from './components/message-optimized';
export { TimeSeparator } from './components/time-separator';
export { StreamBlock } from './components/stream-block';
export { ToolInvocationCard } from './components/tool-invocation-card';
export { ClarityToolResult } from './components/clarity-tool-result';
export { CitationCard } from './components/citation-card';
export { CopyButton } from './components/copy-button';
export { FileUpload } from './components/file-upload';
// ✨ ENHANCED (2025): Secure Message Actions with Security Indicators
export { MessageActionsSecure, } from './components/message/message-actions-secure';
// Feature Components
export { ModelSelector } from './components/model-selector';
export { ContextCard } from './components/context-card';
export { ContextManager } from './components/context-manager';
export { ProjectSidebar } from './components/project-sidebar';
// TODO: Re-enable once prompt system is implemented
// export { PromptLibrary } from './components/prompt-library'
export { SettingsPanel } from './components/settings-panel';
export { UsageDashboard } from './components/usage-dashboard';
export { LinkPreview, InlineLink } from './components/link-preview';
export { KeyboardHint } from './components/keyboard-hint';
export { ThemeSwitcher } from './components/theme-switcher';
export { KnowledgeBaseViewer } from './components/knowledge-base-viewer';
export { ExportDialog } from './components/export-dialog';
export { BatchExportDialog } from './components/batch-export-dialog';
export { StreamCancellation } from './components/stream-cancellation';
export { MessageSearch, MessageSearchWithSuspense } from './components/message-search';
export { AdvancedMessageSearch } from './components/advanced-message-search';
export { FollowUpSuggestions } from './components/follow-up-suggestions';
export { PromptSuggestions } from './components/prompt-suggestions';
export { PromptLibrary } from './components/prompt-library';
export { PromptSuggestionsEnhanced, usePromptSuggestionsEnhanced } from './components/prompt-suggestions-enhanced';
export { ConversationSummarizer } from './components/conversation-summarizer';
export { BatteryIndicator } from './components/battery-indicator';
export { PerformanceAnalyticsDashboard } from './components/performance-analytics-dashboard';
export { PerformanceDashboard } from './components/performance-dashboard';
export { SemanticMessageSearch } from './components/advanced-message-search-semantic';
export { ConversationAnalyticsDashboard } from './components/conversation-analytics-dashboard';
export { MessageThreadView, ThreadList } from './components/message-thread-view';
export { MentionInput, MentionList, useMentions } from './components/mention-system';
export { ConversationSharing, ShareAnalyticsDashboard, useConversationSharing } from './components/conversation-sharing';
export { CollaborativeEditor, CollaborativeMessageList, PresenceIndicator, useCollaborativeSession, } from './components/collaborative-editing';
// Document Integration
export { DocumentIntegration, useDocumentIntegration, } from './components/document-integration';
// Calendar Integration
export { CalendarIntegration, useCalendarIntegration, useAvailabilityCheck, } from './components/calendar-integration';
// Email Integration
export { EmailIntegration, useEmailIntegration, } from './components/email-integration';
export { UserInteractionAnalytics, useInteractionTracking } from './components/user-interaction-analytics';
export { ABTestingDashboard, useABTesting } from './components/ab-testing-dashboard';
export { MobileOptimizedMessage, MobileChatWindow, TouchFriendlyButton, useMobileOptimization, } from './components/mobile-chat-optimized';
export { OfflineChatSync, useOfflineChat } from './components/offline-chat-sync';
export { EnhancedMarkdownRenderer } from './components/enhanced-markdown-renderer';
export { EnhancedCodeBlock } from './components/enhanced-code-block';
export { StreamingTextRenderer } from './components/streaming-text-renderer';
export { PersonaPanel } from './components/persona-panel';
export { ConversationTimeline } from './components/conversation-timeline';
export { MemoryInspector } from './components/memory-inspector';
export { SafetyStatusCard } from './components/safety-status-card';
export { AuditLogViewer } from './components/audit-log-viewer';
export { DocumentViewer } from './components/document-viewer';
export { ResponseQualityMeter } from './components/response-quality-meter';
export { MultiModalPreview } from './components/multi-modal-preview';
export { AgentRunFeed } from './components/agent-run-feed';
export { SessionSummaryCard } from './components/session-summary-card';
export { WorkflowSuggestionList } from './components/workflow-suggestion-list';
// Note: AIOps and Enterprise components are exported individually via their respective directories
export { AnalyticsDashboard } from './components/analytics-dashboard';
// AIOps Components
export * from './components/ai-ops';
// Enterprise Components
export * from './components/enterprise';
// Error Handling Components
export { ErrorBoundary } from './components/error-boundary';
export * from './components/error-boundary-enhanced';
export { RetryButton } from './components/retry-button';
export { ErrorMessage } from './components/error-message';
export { NetworkStatus } from './components/network-status';
// Error Reporting System
export * from './error';
// Token Management Components
export { TokenCounter } from './components/token-counter';
export { TokenOptimizationPanel } from './components/token-optimization-panel';
export { TokenOptimizationBadge } from './components/token-optimization-badge';
export { TokenOptimizationDashboard } from './components/token-optimization-dashboard';
export { HistoryManager, HistoryMessageRow, TokenUsageBar, HistoryToolbar, } from './components/history-manager';
export { OutputPreferenceSelector, UncontrolledOutputPreferenceSelector, useOutputPreference, } from './components/output-preference-selector';
export { StructuredInputBuilder, useStructuredInput, PRESET_FIELDS, } from './components/structured-input-builder';
// Context & Conversation Management
export { ContextVisualizer } from './components/context-visualizer';
export { ConversationList } from './components/conversation-list';
export { ConversationBranchVisualizer } from './components/conversation-branch-visualizer';
// Markdown & Rendering
export { MarkdownRendererEnhanced } from './components/markdown-renderer-enhanced';
// UI Primitives
export * from './components/skeleton';
export * from './components/animated-list';
export * from './components/toast';
export * from './components/progress';
export * from './components/feedback-animation';
export * from './components/interactive-card';
// Interactive Components
export { CommandPalette } from './components/command-palette';
export { ContextMenu } from './components/context-menu';
export { Draggable, DropZone } from './components/draggable';
export { VoiceInput, InlineVoiceInput } from './components/voice-input';
// Empty States
export { EmptyState, EmptyChatState, NoSearchResultsState, NoConversationsState, ErrorState, SuccessState, } from './components/empty-state';
// Theme Components
export { ThemePreview } from './components/theme-preview';
export { ThemeSelector, ThemeSelectorDropdown } from './components/theme-selector';
// ============================================================================
// ADDITIONAL HOOKS (Utility & Feature Hooks)
// ============================================================================
export * from './hooks/use-completion';
export * from './hooks/use-assistant';
export * from './hooks/use-auto-scroll';
export * from './hooks/use-clipboard';
export * from './hooks/use-debounce';
export * from './hooks/use-throttle';
export * from './hooks/use-event-listener';
export * from './hooks/use-intersection-observer';
export * from './hooks/use-local-storage';
export * from './hooks/use-indexed-db';
export * from './hooks/use-media-query';
export * from './hooks/use-reduced-motion';
export * from './hooks/use-theme-shortcuts';
export * from './hooks/use-mounted';
export * from './hooks/use-previous';
export * from './hooks/use-toggle';
export * from './hooks/use-window-size';
export * from './hooks/use-error-recovery';
export * from './hooks/use-token-tracker';
export * from './hooks/use-token-optimization';
export * from './hooks/use-message-operations';
export * from './hooks/use-message-history';
export * from './hooks/use-realistic-typing';
export * from './hooks/use-command-palette-commands';
export * from './hooks/use-optimistic-message';
export * from './hooks/use-performance';
export * from './hooks/use-battery-aware';
export * from './hooks/use-deferred-search';
export * from './hooks/use-voice-input';
export * from './hooks/use-model-router';
export * from './hooks/use-smart-throttle';
export * from './hooks/use-smart-cache';
// Note: use-context-monitor has formatTokenCount and getUtilizationColor which conflict with ./prompt exports
// Export specific items to avoid conflicts
export { useContextMonitor, createContextMonitorIntegration, } from './hooks/use-context-monitor';
// Re-export context-monitor specific utilities with different names to avoid conflicts
export { getUtilizationColor as getContextUtilizationColor, formatTokenCount as formatContextTokenCount, } from './hooks/use-context-monitor';
export * from './hooks/use-character-counter';
export * from './hooks/use-submit-button-state';
export * from './hooks/use-mobile-keyboard';
// Note: DesignTokens type is exported from './theme', only export the hook here
export { useDesignTokens } from './hooks/use-design-tokens';
// ============================================================================
// TEMPLATES (Pre-built Chat Templates)
// ============================================================================
export * from './templates';
// Helper hooks (internal - use top-level APIs instead)
// These are implementation details and should not be used directly.
// Use `useClarityChat` or `ClarityChat` component instead.
// @internal
// export {
//   useClarityChatWithWindow,
//   useClarityChatWithAnalytics,
//   useClarityChatWithPersistence,
//   useClarityChatWithDebounce,
//   useClarityChatWithAutoSave,
// } from './hooks/use-clarity-chat-helpers'
// ============================================================================
// UTILITIES & TYPES
// ============================================================================
export * from './utils';
export * from './types/chat-types';
export { isWeatherToolResult, isSearchToolResult, isCalculatorToolResult, getToolName, parseToolArguments as parseToolArgumentsType, validateToolResult, } from './types/tool-result-types';
// Note: getLatestToolResult is already exported from './utils', export other helpers explicitly
export { groupToolResultsByToolName, groupToolResultsByMessage, getToolResultsForTool, hasToolBeenCalled, getUniqueToolNames, countToolCallsByTool, filterToolResultsByMessage, hasToolError, getToolError, } from './utils/tool-result-helpers';
//# sourceMappingURL=index.js.map