/**
 * Chat Presets - Pre-configured setups for common use cases
 * 
 * These presets provide sensible defaults for different scenarios,
 * making it easy to get started without configuration.
 */

import type { UseClarityChatOptions } from '../hooks/use-clarity-chat'
import type { ClarityChatProps } from '../components/clarity-chat'

/**
 * Preset configurations for common chat scenarios
 */
export const chatPresets = {
  /**
   * Basic chat - Simple, no-frills chat interface
   */
  basic: {
    autoScroll: true,
    showHeader: false,
  } satisfies Partial<ClarityChatProps>,

  /**
   * Enterprise chat - Full-featured with memory and analytics
   */
  enterprise: {
    autoScroll: true,
    showHeader: true,
    showMessageCount: true,
    memory: {
      enabled: true,
      strategy: 'vector-store',
      retryOnError: true,
    },
  } satisfies Partial<ClarityChatProps>,

  /**
   * Customer support - Optimized for support scenarios
   */
  support: {
    autoScroll: true,
    showHeader: true,
    sessionTitle: 'Customer Support',
    showMessageCount: true,
    memory: {
      enabled: true,
      strategy: 'semantic-chunks',
    },
  } satisfies Partial<ClarityChatProps>,

  /**
   * Code assistant - Optimized for code-related conversations
   */
  codeAssistant: {
    autoScroll: true,
    showHeader: true,
    sessionTitle: 'Code Assistant',
    showMessageCount: false,
  } satisfies Partial<ClarityChatProps>,

  /**
   * Minimal chat - Ultra-minimal interface
   */
  minimal: {
    autoScroll: true,
    showHeader: false,
    showMessageCount: false,
  } satisfies Partial<ClarityChatProps>,

  /**
   * Persistent chat - With localStorage persistence
   */
  persistent: {
    autoScroll: true,
    showHeader: true,
    showMessageCount: true,
  } satisfies Partial<ClarityChatProps>,
} as const

/**
 * Hook preset configurations
 */
export const hookPresets = {
  /**
   * Basic hook configuration
   */
  basic: {
    stream: true,
  } satisfies Partial<UseClarityChatOptions>,

  /**
   * Enterprise hook configuration
   */
  enterprise: {
    stream: true,
    memory: {
      enabled: true,
      strategy: 'vector-store',
      retryOnError: true,
      maxRetryAttempts: 3,
    },
    transport: 'sse',
  } satisfies Partial<UseClarityChatOptions>,

  /**
   * WebSocket configuration
   */
  websocket: {
    stream: true,
    transport: 'websocket',
    websocket: {
      autoReconnect: true,
      maxReconnectAttempts: 5,
      enableHeartbeat: true,
    },
  } satisfies Partial<UseClarityChatOptions>,

  /**
   * With prompt optimization
   */
  optimized: {
    stream: true,
    promptOptimization: {
      enabled: true,
      strategy: 'hybrid',
      targetTokens: 8000,
    },
  } satisfies Partial<UseClarityChatOptions>,
} as const

/**
 * Apply a preset to chat options
 */
export function applyChatPreset<T extends ClarityChatProps>(
  preset: keyof typeof chatPresets,
  options: T
): T {
  return {
    ...chatPresets[preset],
    ...options,
  } as T
}

/**
 * Apply a preset to hook options
 */
export function applyHookPreset<T extends UseClarityChatOptions>(
  preset: keyof typeof hookPresets,
  options: T
): T {
  return {
    ...hookPresets[preset],
    ...options,
  } as T
}

/**
 * Type-safe preset keys
 */
export type ChatPreset = keyof typeof chatPresets
export type HookPreset = keyof typeof hookPresets
