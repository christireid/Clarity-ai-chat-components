/**
 * usePromptRecipe Hook
 * 
 * React hook for building prompts from recipes with variables.
 */

import { useMemo, useCallback } from 'react'
import type { PromptRecipe, ResolvedPrompt } from '../core/types'

/**
 * Options for usePromptRecipe
 */
export interface UsePromptRecipeOptions {
  /**
   * Prompt recipe to use
   */
  recipe: PromptRecipe
  
  /**
   * Initial variables
   */
  initialVariables?: Record<string, any>
}

/**
 * Return type for usePromptRecipe
 */
export interface UsePromptRecipeReturn {
  /**
   * Build a prompt with given variables
   */
  buildPrompt: (variables?: Record<string, any>) => ResolvedPrompt
  
  /**
   * Get all variables required by the recipe
   */
  getVariables: () => import('../core/types').PromptVariable[]
  
  /**
   * Get the template definition
   */
  getTemplate: () => import('../core/types').PromptTemplate
  
  /**
   * Current resolved prompt (if variables provided)
   */
  currentPrompt?: ResolvedPrompt
}

/**
 * Hook for building prompts from recipes
 * 
 * @example
 * ```tsx
 * const recipe = createPromptRecipe({
 *   id: 'chatbot',
 *   system: 'You are {{name}}.',
 *   user: '{{message}}',
 * })
 * 
 * const { buildPrompt } = usePromptRecipe({ recipe })
 * const prompt = buildPrompt({ name: 'Clarity', message: 'Hello!' })
 * ```
 */
export function usePromptRecipe(
  options: UsePromptRecipeOptions
): UsePromptRecipeReturn {
  const { recipe, initialVariables } = options
  
  const buildPrompt = useCallback(
    (variables?: Record<string, any>) => {
      const mergedVars = { ...initialVariables, ...variables }
      return recipe.build(mergedVars)
    },
    [recipe, initialVariables]
  )
  
  const getVariables = useCallback(() => {
    return recipe.getVariables()
  }, [recipe])
  
  const getTemplate = useCallback(() => {
    return recipe.getTemplate()
  }, [recipe])
  
  const currentPrompt = useMemo(() => {
    if (initialVariables) {
      return buildPrompt()
    }
    return undefined
  }, [buildPrompt, initialVariables])
  
  return {
    buildPrompt,
    getVariables,
    getTemplate,
    currentPrompt,
  }
}
