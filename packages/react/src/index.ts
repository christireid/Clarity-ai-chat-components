// Model Adapters
export * from './adapters'

// Vector Stores (Enterprise RAG)
export * from './vector-stores'

// Embeddings (Multi-Provider)
export * from './embeddings'

// Agent Orchestration (Agentic AI)
export * from './agents'

// Prompt Templates
export * from './prompts'

// Document Loaders & Text Splitting
export * from './document-loaders'

// AI Safety (PII Detection, Content Filtering, Guardrails)
export * from './safety'

// Observability & Evaluation
export * from './observability'

// Reranking (RAG Improvement)
export * from './reranking'

// Webhook System
export * from './webhooks'

// Plugin Architecture
export * from './plugins'

// Audit Logging
export * from './audit'

// Usage Quotas
export * from './quotas'

// Multi-Tenancy
export * from './multi-tenancy'

// RBAC (Role-Based Access Control)
export * from './rbac'

// Export all components
export * from './components/message'
export * from './components/message-metadata'
export * from './components/message-list'
export * from './components/chat-input'
export * from './components/advanced-chat-input'
export * from './components/chat-window'
export * from './components/model-selector'
export * from './components/streaming-message'
export * from './components/stream-block'
export * from './components/tool-invocation-card'
export * from './components/citation-card'
export * from './components/thinking-indicator'
export * from './components/copy-button'
export * from './components/file-upload'
export * from './components/context-card'
export * from './components/context-manager'
export * from './components/project-sidebar'
export * from './components/prompt-library'
export * from './components/settings-panel'
export * from './components/usage-dashboard'
export * from './components/link-preview'
export * from './components/knowledge-base-viewer'
export * from './components/export-dialog'
export * from './components/batch-export-dialog'
export * from './components/stream-cancellation'
export * from './components/message-search'
export * from './components/advanced-message-search'
export * from './components/follow-up-suggestions'
export * from './components/prompt-suggestions'
export * from './components/enhanced-markdown-renderer'
export * from './components/enhanced-code-block'
export * from './components/streaming-text-renderer'
export * from './components/persona-panel'
export * from './components/conversation-timeline'
export * from './components/memory-inspector'
export * from './components/safety-status-card'
export * from './components/response-quality-meter'
export * from './components/multi-modal-preview'
export * from './components/agent-run-feed'
export * from './components/session-summary-card'
export * from './components/workflow-suggestion-list'
export * from './components/ai-ops'
export * from './components/enterprise'

// Phase 3 Enhancement - Error Handling & Recovery
export * from './components/error-boundary'
export * from './components/retry-button'
export * from './components/network-status'

// Phase 3 Enhancement - Token Management
export * from './components/token-counter'
export * from './components/token-optimization-panel'
export * from './components/token-optimization-badge'

// Phase 3 Enhancement - Context & Conversation Management
export * from './components/context-visualizer'
export * from './components/conversation-list'

// v2.1 Blueprint Features - Conversation Branching
export * from './components/conversation-branch-visualizer'

// v2.1 Blueprint Features - Virtual Scrolling
export * from './components/virtualized-message-list'

// v2.1 Blueprint Features - Enhanced Markdown with LaTeX
export * from './components/markdown-renderer-enhanced'

// Export hooks
export {
  useChat,
  type UseChatOptions as UseChatOptionsLegacy,
  type UseChatReturn as UseChatReturnLegacy,
} from './hooks/use-chat'
export * from './hooks/use-chat-enhanced'
export * from './hooks/use-completion'
export * from './hooks/use-assistant'
export * from './hooks/use-streaming'
export * from './hooks/use-streaming-sse'
export * from './hooks/use-streaming-websocket'
export * from './hooks/use-streamable-ui'
export * from './hooks/use-auto-scroll'
export * from './hooks/use-clipboard'
export * from './hooks/use-debounce'
export * from './hooks/use-throttle'
export * from './hooks/use-event-listener'
export * from './hooks/use-intersection-observer'
// Note: use-keyboard-shortcuts not exported to avoid conflict with accessibility/keyboard-shortcuts
// export * from './hooks/use-keyboard-shortcuts'
export * from './hooks/use-local-storage'
export * from './hooks/use-indexed-db'
export * from './hooks/use-media-query'
export * from './hooks/use-mounted'
export * from './hooks/use-previous'
export * from './hooks/use-toggle'
export * from './hooks/use-window-size'

// Phase 3 Enhancement - Error Recovery & Token Tracking
export * from './hooks/use-error-recovery'
export * from './hooks/use-token-tracker'
export * from './hooks/use-token-optimization'

// Phase 3 Enhancement - Message Operations & Typing
export * from './hooks/use-message-operations'
export * from './hooks/use-message-history'
export * from './hooks/use-realistic-typing'

// Optimistic Updates
export * from './hooks/use-optimistic-message'

// Performance Monitoring
export * from './hooks/use-performance'

// React Concurrent Features
export * from './hooks/use-deferred-search'

// Utility Functions (Model Fallback, Context Window, Rate Limiting, Hybrid Search, etc.)
export * from './utils'

// StreamableValue utilities (Vercel AI SDK compatible)
export * from './utils/streamable-value'

// Chat helper utilities
export * from './utils/chat-helpers'

// Streaming parser utilities
export * from './utils/streaming-parser'

// Performance utilities
export * from './utils/performance'
export * from './utils/performance-optimization'

// v2.1 Blueprint Features - Advanced Export Utilities
export * from './utils/export-utils'

// Enhanced TypeScript types
export * from './types/chat-types'

// Optimized hooks
export * from './hooks/use-chat-optimized'

// Theme System
export * from './theme'

// Animation System
export * from './animations'

// Skeleton Loaders
export * from './components/skeleton'

// Animated Components
export * from './components/animated-list'

// Toast Notifications
export * from './components/toast'

// Progress Indicators
export * from './components/progress'

// Feedback Animations
export * from './components/feedback-animation'

// Interactive Components
export * from './components/interactive-card'

// Performance Optimized Components
export * from './components/virtualized-message-list'
export * from './components/message-optimized'

// Error Handling
export * from './components/error-boundary-enhanced'

// Empty States
export * from './components/empty-state'

// Icons
export * from './components/icons'

// Theme Selector
export * from './components/theme-selector'

// Analytics System
export * from './analytics'

// AI Features
export * from './ai'

// AI Memory & Context System
export * from './memory'

// Error Tracking System
export * from './error'

// Accessibility System
export * from './accessibility'

// Theme Preview
export * from './components/theme-preview'

// Performance Dashboard
export * from './components/performance-dashboard'

// ============================================================================
// PHASE 4 FEATURES
// ============================================================================

// Phase 4 - Voice Input
export * from './components/voice-input'
export * from './hooks/use-voice-input'

// Phase 4 - Mobile Keyboard Handling
export * from './hooks/use-mobile-keyboard'

// Phase 4 - Pre-built Templates
export * from './templates'

// ============================================================================
// PHASE 8 FEATURES - ADVANCED INTERACTIONS
// ============================================================================

// Phase 8 - Command Palette
export * from './components/command-palette'

// Phase 8 - Keyboard Hints
export * from './components/keyboard-hint'

// Phase 8 - Drag & Drop
export * from './components/draggable'

// Phase 8 - Context Menu
export * from './components/context-menu'

// Phase 8 - Theme Switcher
export * from './components/theme-switcher'

// Phase 8 - Undo/Redo Hook
export * from './hooks/use-undo-redo'

// Phase 8 - Haptic Feedback
export * from './hooks/use-haptic'

// ============================================================================
// TOKEN OPTIMIZATION FEATURES
// ============================================================================

// Token Optimization Components
export * from './components/token-optimization-dashboard'
export * from './components/token-optimization-badge'

// Token Optimization Hooks
export * from './hooks/use-prompt-compression'
export * from './hooks/use-smart-cache'
export * from './hooks/use-model-router'
export * from './hooks/use-response-limiter'
export * from './hooks/use-request-batcher'
export * from './hooks/use-smart-throttle'
