/**
 * usePromptInspector Hook
 * 
 * Dev tool hook for inspecting prompt composition and token usage.
 */

import { useMemo, useState, useCallback } from 'react'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import type { ResolvedPrompt } from '../core/types'
import {
  estimateMessageArrayTokens,
  estimateMessageTokens,
} from '../core/token-estimation'

/**
 * Message token breakdown
 */
export interface MessageTokenBreakdown {
  message: CoreMessage
  tokens: number
  role: string
  contentPreview: string
}

/**
 * Prompt inspection data
 */
export interface PromptInspection {
  /**
   * Total tokens
   */
  totalTokens: number
  
  /**
   * Token breakdown by message
   */
  messageBreakdown: MessageTokenBreakdown[]
  
  /**
   * Token breakdown by role
   */
  roleBreakdown: Record<string, number>
  
  /**
   * Resolved prompt (if from recipe)
   */
  resolvedPrompt?: ResolvedPrompt
  
  /**
   * Model identifier (if provided)
   */
  model?: string
}

/**
 * Options for usePromptInspector
 */
export interface UsePromptInspectorOptions {
  /**
   * Messages to inspect
   */
  messages?: CoreMessage[]
  
  /**
   * Resolved prompt to inspect (alternative to messages)
   */
  resolvedPrompt?: ResolvedPrompt
  
  /**
   * Model identifier for accurate tokenization
   */
  model?: string
  
  /**
   * Enable inspection (useful for dev/prod toggle)
   */
  enabled?: boolean
}

/**
 * Return type for usePromptInspector
 */
export interface UsePromptInspectorReturn {
  /**
   * Inspection data
   */
  inspection: PromptInspection | null
  
  /**
   * Whether inspection is enabled
   */
  enabled: boolean
  
  /**
   * Toggle inspection on/off
   */
  toggle: () => void
  
  /**
   * Refresh inspection data
   */
  refresh: () => void
}

/**
 * Hook for inspecting prompts (dev tool)
 * 
 * @example
 * ```tsx
 * const { inspection } = usePromptInspector({
 *   messages,
 *   model: 'gpt-4',
 *   enabled: process.env.NODE_ENV === 'development',
 * })
 * 
 * // Render in debug panel
 * <DebugPanel>
 *   <div>Total tokens: {inspection?.totalTokens}</div>
 *   {inspection?.messageBreakdown.map(msg => (
 *     <div key={msg.message.id}>{msg.role}: {msg.tokens} tokens</div>
 *   ))}
 * </DebugPanel>
 * ```
 */
export function usePromptInspector(
  options: UsePromptInspectorOptions
): UsePromptInspectorReturn {
  const {
    messages,
    resolvedPrompt,
    model,
    enabled: initialEnabled = true,
  } = options
  
  const [enabled, setEnabled] = useState(initialEnabled)
  
  const toggle = useCallback(() => {
    setEnabled(prev => !prev)
  }, [])
  
  const inspection = useMemo<PromptInspection | null>(() => {
    if (!enabled) {
      return null
    }
    
    // Use messages from resolved prompt if available
    const messagesToInspect = resolvedPrompt?.messages || messages || []
    
    if (messagesToInspect.length === 0) {
      return null
    }
    
    // Calculate token breakdown by message
    const messageBreakdown: MessageTokenBreakdown[] = messagesToInspect.map(msg => {
      const tokens = estimateMessageTokens(msg, { model })
      const contentPreview = typeof msg.content === 'string'
        ? msg.content.slice(0, 100) + (msg.content.length > 100 ? '...' : '')
        : Array.isArray(msg.content)
        ? `[${msg.content.length} parts]`
        : '[non-text content]'
      
      return {
        message: msg,
        tokens,
        role: msg.role,
        contentPreview,
      }
    })
    
    // Calculate token breakdown by role
    const roleBreakdown: Record<string, number> = {}
    for (const breakdown of messageBreakdown) {
      roleBreakdown[breakdown.role] = (roleBreakdown[breakdown.role] || 0) + breakdown.tokens
    }
    
    // Calculate total tokens
    const totalTokens = estimateMessageArrayTokens(messagesToInspect, { model })
    
    return {
      totalTokens,
      messageBreakdown,
      roleBreakdown,
      resolvedPrompt,
      model,
    }
  }, [enabled, messages, resolvedPrompt, model])
  
  const refresh = useCallback(() => {
    // Force re-computation by toggling enabled state
    setEnabled(prev => {
      // This will trigger useMemo to recompute
      return prev
    })
  }, [])
  
  return {
    inspection,
    enabled,
    toggle,
    refresh,
  }
}
