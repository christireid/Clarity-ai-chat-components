/**
 * usePromptRecipe Hook
 * 
 * React hook for building prompts from recipes
 */

import * as React from 'react'
import type {
  PromptRecipeDefinition,
  PromptBuilderContext,
  PromptRecipeResult,
} from '../core/types'
import type { ModelMetadata } from '../core/types'
import { createPromptRecipe } from '../core/recipe'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'

/**
 * Options for usePromptRecipe
 */
export interface UsePromptRecipeOptions {
  /** Recipe definition */
  recipe: PromptRecipeDefinition
  /** Model metadata */
  model: ModelMetadata
  /** Debug mode (exposes debug view) */
  debug?: boolean
}

/**
 * Return type for usePromptRecipe
 */
export interface UsePromptRecipeReturn {
  /** Build prompt from context */
  buildPrompt: (context: PromptBuilderContext) => PromptRecipeResult
  /** Debug view of the recipe */
  debugView?: {
    recipe: PromptRecipeDefinition
    lastResult?: PromptRecipeResult
  }
}

/**
 * Hook for building prompts from recipes
 * 
 * @example
 * ```tsx
 * const { buildPrompt } = usePromptRecipe({
 *   recipe: {
 *     system: 'You are a helpful assistant.',
 *     user: '{{userInput}}',
 *   },
 *   model: { model: 'gpt-4', maxTokens: 8000 },
 * })
 * 
 * const result = buildPrompt({
 *   userInput: 'Hello',
 *   history: [],
 * })
 * ```
 */
export function usePromptRecipe(
  options: UsePromptRecipeOptions
): UsePromptRecipeReturn {
  const { recipe, model, debug } = options

  const recipeBuilder = React.useMemo(
    () => createPromptRecipe(recipe),
    [recipe]
  )

  const [lastResult, setLastResult] = React.useState<
    PromptRecipeResult | undefined
  >()

  const buildPrompt = React.useCallback(
    (context: PromptBuilderContext): PromptRecipeResult => {
      const result = recipeBuilder.build(context, model)
      if (debug) {
        setLastResult(result)
      }
      return result
    },
    [recipeBuilder, model, debug]
  )

  return {
    buildPrompt,
    debugView: debug
      ? {
          recipe,
          lastResult,
        }
      : undefined,
  }
}
