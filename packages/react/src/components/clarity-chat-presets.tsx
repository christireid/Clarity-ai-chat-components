/**
 * ClarityChat Presets - Pre-configured chat setups
 * 
 * Common configurations for different use cases.
 * Use these to get started quickly with sensible defaults.
 */

import type { UseClarityChatOptions } from '../hooks/use-clarity-chat'
import { ClarityChat, type ClarityChatProps } from './clarity-chat'

/**
 * Preset configurations for common use cases
 */
export const ClarityChatPresets = {
  /**
   * Simple chat - minimal configuration
   */
  Simple: (props: Omit<ClarityChatProps, 'api'> & { api: string }) => (
    <ClarityChat {...props} />
  ),

  /**
   * Chat with memory - context-aware conversations
   */
  WithMemory: (props: Omit<ClarityChatProps, 'api' | 'memory'> & { 
    api: string
    memoryStrategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  }) => (
    <ClarityChat
      {...props}
      memory={{
        enabled: true,
        strategy: props.memoryStrategy || 'sliding-window',
        maxTokens: 4000,
      }}
    />
  ),

  /**
   * Enterprise chat - full-featured with all options
   */
  Enterprise: (props: Omit<ClarityChatProps, 'api'> & { api: string }) => (
    <ClarityChat
      {...props}
      showHeader
      showMessageCount
      memory={{
        enabled: true,
        strategy: 'vector-store',
        maxTokens: 10000,
      }}
      promptOptimization={{
        enabled: true,
        strategy: 'hybrid',
      }}
    />
  ),

  /**
   * Streaming chat - optimized for real-time updates
   */
  Streaming: (props: Omit<ClarityChatProps, 'api' | 'transport'> & { 
    api: string
    useWebSocket?: boolean
  }) => (
    <ClarityChat
      {...props}
      transport={props.useWebSocket ? 'websocket' : 'sse'}
    />
  ),
}

/**
 * Type-safe preset configurations
 */
export type ClarityChatPresetConfig = {
  Simple: Omit<ClarityChatProps, 'api'> & { api: string }
  WithMemory: Omit<ClarityChatProps, 'api' | 'memory'> & { 
    api: string
    memoryStrategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  }
  Enterprise: Omit<ClarityChatProps, 'api'> & { api: string }
  Streaming: Omit<ClarityChatProps, 'api' | 'transport'> & { 
    api: string
    useWebSocket?: boolean
  }
}
