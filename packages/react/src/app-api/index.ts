'use client'

// =============================================================================
// ClarityChat App API
// =============================================================================
//
// The unified, easy-to-use API for ClarityChat.
//
// This module provides a single entry point for chat functionality with
// automatic integration of advanced features like memory, token optimization,
// tools, RAG, and safety.
//
// Quick Start:
// ```tsx
// import { ClarityChatApp } from '@clarity-chat/react'
//
// // Basic usage - streaming chat in 3 minutes
// <ClarityChatApp api="/api/chat" />
//
// // With memory enabled
// <ClarityChatApp api="/api/chat" features={{ memory: true }} />
//
// // Enterprise preset with all features
// <ClarityChatApp api="/api/chat" preset="enterprise" />
// ```
//
// =============================================================================

// Main component and hook
export {
  ClarityChatApp,
  ClarityChatAppProvider,
  useClarityChatAppContext,
} from './ClarityChatApp'
export { useClarityChatApp } from './use-clarity-chat-app'

// Configuration utilities
export {
  resolveConfig,
  isFeatureEnabled,
  describeActiveFeatures,
  createPresetConfig,
  mergeConfigs,
  ConfigValidationError,
} from './resolve-config'

// Defaults (for advanced customization)
export {
  DEFAULT_FEATURE_FLAGS,
  DEFAULT_MEMORY_CONFIG,
  DEFAULT_TOKEN_OPTIMIZATION_CONFIG,
  DEFAULT_TOOLS_CONFIG,
  DEFAULT_RAG_CONFIG,
  DEFAULT_SAFETY_CONFIG,
  DEFAULT_OBSERVABILITY_CONFIG,
  DEFAULT_UI_CONFIG,
  DEFAULT_ERROR_RECOVERY_CONFIG,
  DEFAULT_STREAMING_CONFIG,
  PRESET_DEFINITIONS,
  DEFAULT_RESOLVED_CONFIG,
  MODEL_TOKEN_BUDGETS,
  getModelTokenBudget,
} from './defaults'

// Types
export type {
  // Feature flags and presets
  ClarityFeatureFlags,
  ClarityAppPreset,

  // Configuration blocks
  ClarityAppConfig,
  MemoryConfig,
  TokenOptimizationConfig,
  ToolsConfig,
  ToolDefinition,
  RAGConfig,
  RAGSource,
  SafetyConfig,
  ObservabilityConfig,
  UIConfig,

  // Resolved configuration
  ClarityResolvedConfig,

  // Events and metadata
  ClarityEvent,
  TokenStats,
  MemoryStats,
  RAGStats,
  SafetyStats,
  ToolStats,
  ClarityMeta,

  // Component props
  ClarityChatAppProps,
  UseClarityChatAppOptions,
  UseClarityChatAppReturn,
} from './types'
