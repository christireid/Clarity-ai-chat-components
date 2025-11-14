/**
 * usePromptRecipe Hook
 * 
 * React hook for building prompts from recipes using the toon DSL.
 */

import { useMemo, useCallback } from 'react'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import type { PromptRecipe } from '../core/recipe'
import type { ToonNode } from '../core/toon'
import { buildMessagesFromRecipe } from '../core/recipe'
import { toonToMessages } from '../core/toon'
import { estimatePromptTokens } from '../core/tokenizer'

/**
 * Options for usePromptRecipe
 */
export interface UsePromptRecipeOptions {
  /** Prompt recipe to use */
  recipe?: PromptRecipe
  /** Toon DSL nodes (alternative to recipe) */
  toonNodes?: ToonNode[]
  /** Variables for template substitution */
  variables?: Record<string, unknown>
  /** Enable debug mode */
  debug?: boolean
}

/**
 * Return type for usePromptRecipe
 */
export interface UsePromptRecipeReturn {
  /** Build prompt from current variables */
  buildPrompt: (overrideVariables?: Record<string, unknown>) => CoreMessage[]
  /** Estimate tokens for current prompt */
  estimateTokens: (overrideVariables?: Record<string, unknown>) => number
  /** Debug view of composed prompt */
  debugView?: {
    rendered: string
    variables: Record<string, unknown>
    messages: CoreMessage[]
  }
}

/**
 * Hook for building prompts from recipes
 */
export function usePromptRecipe(options: UsePromptRecipeOptions = {}): UsePromptRecipeReturn {
  const { recipe, toonNodes, variables = {}, debug = false } = options

  const buildPrompt = useCallback(
    (overrideVariables: Record<string, unknown> = {}) => {
      const mergedVariables = { ...variables, ...overrideVariables }

      if (recipe) {
        return buildMessagesFromRecipe(recipe, mergedVariables)
      } else if (toonNodes) {
        return toonToMessages(toonNodes, mergedVariables)
      }

      return []
    },
    [recipe, toonNodes, variables]
  )

  const estimateTokens = useCallback(
    (overrideVariables: Record<string, unknown> = {}) => {
      const mergedVariables = { ...variables, ...overrideVariables }

      if (recipe) {
        if (recipe.systemPrompt) {
          return estimatePromptTokens(recipe.systemPrompt, mergedVariables)
        }
        if (recipe.userMessage) {
          return estimatePromptTokens(recipe.userMessage, mergedVariables)
        }
        return 0
      } else if (toonNodes) {
        return estimatePromptTokens(toonNodes, mergedVariables)
      }

      return 0
    },
    [recipe, toonNodes, variables]
  )

  const debugView = useMemo(() => {
    if (!debug) return undefined

    const messages = buildPrompt()
    const mergedVariables = { ...variables }

    return {
      rendered: messages.map(m => `${m.role}: ${typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}`).join('\n\n'),
      variables: mergedVariables,
      messages,
    }
  }, [debug, buildPrompt, variables])

  return {
    buildPrompt,
    estimateTokens,
    debugView,
  }
}
