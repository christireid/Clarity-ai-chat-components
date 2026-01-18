/**
 * usePromptPlayground Hook
 *
 * Interactive prompt testing and experimentation hook.
 * Provides real-time rendering, token estimation, and cost calculation.
 *
 * @packageDocumentation
 */

'use client'

import * as React from 'react'
import type {
  PromptTemplate,
  PromptPlaygroundState,
  PromptRenderResult,
} from '../types'
import { PromptTemplateEngine } from '../template'

/**
 * Model pricing information
 */
export interface ModelPricing {
  id: string
  name: string
  inputCostPer1k: number
  outputCostPer1k: number
  maxTokens: number
}

/**
 * Common model pricing presets
 */
export const MODEL_PRICING: Record<string, ModelPricing> = {
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    inputCostPer1k: 0.005,
    outputCostPer1k: 0.015,
    maxTokens: 128000,
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    inputCostPer1k: 0.00015,
    outputCostPer1k: 0.0006,
    maxTokens: 128000,
  },
  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    inputCostPer1k: 0.01,
    outputCostPer1k: 0.03,
    maxTokens: 128000,
  },
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    inputCostPer1k: 0.0005,
    outputCostPer1k: 0.0015,
    maxTokens: 16385,
  },
  'claude-3-5-sonnet': {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    inputCostPer1k: 0.003,
    outputCostPer1k: 0.015,
    maxTokens: 200000,
  },
  'claude-3-opus': {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    inputCostPer1k: 0.015,
    outputCostPer1k: 0.075,
    maxTokens: 200000,
  },
  'claude-3-haiku': {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    inputCostPer1k: 0.00025,
    outputCostPer1k: 0.00125,
    maxTokens: 200000,
  },
}

/**
 * Options for usePromptPlayground hook
 */
export interface UsePromptPlaygroundOptions {
  /** Initial template */
  initialTemplate?: string | PromptTemplate
  /** Initial variables */
  initialVariables?: Record<string, unknown>
  /** Model for pricing estimation */
  model?: string
  /** Custom model pricing */
  customPricing?: ModelPricing
  /** Debounce delay for rendering (ms) */
  debounceMs?: number
  /** Auto-render on template/variable change */
  autoRender?: boolean
  /** Callback on render */
  onRender?: (result: PromptRenderResult) => void
  /** Callback on error */
  onError?: (errors: string[]) => void
}

/**
 * Return type for usePromptPlayground hook
 */
export interface UsePromptPlaygroundReturn {
  /** Current state */
  state: PromptPlaygroundState
  /** Update template */
  setTemplate: (template: string) => void
  /** Update a single variable */
  setVariable: (name: string, value: unknown) => void
  /** Update multiple variables */
  setVariables: (variables: Record<string, unknown>) => void
  /** Extract variables from current template */
  extractVariables: () => string[]
  /** Manually trigger render */
  render: () => PromptRenderResult
  /** Validate template */
  validate: () => { valid: boolean; errors?: string[] }
  /** Reset to initial state */
  reset: () => void
  /** Load a template */
  loadTemplate: (template: PromptTemplate) => void
  /** Get estimated cost */
  getEstimatedCost: (estimatedOutputTokens?: number) => {
    input: number
    output: number
    total: number
  }
  /** Current model pricing */
  pricing: ModelPricing
  /** Set model */
  setModel: (modelId: string) => void
}

/** Maximum template length to prevent DoS */
const MAX_TEMPLATE_LENGTH = 100_000

/** Maximum variable value length */
const MAX_VARIABLE_VALUE_LENGTH = 50_000

/**
 * Estimate token count (simple approximation)
 * Real implementation should use tiktoken or similar
 */
function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token for English text
  return Math.ceil(text.length / 4)
}

/**
 * Validate and truncate string if necessary
 */
function validateStringLength(
  value: string,
  maxLength: number
): { value: string; truncated: boolean } {
  if (value.length <= maxLength) {
    return { value, truncated: false }
  }
  return { value: value.slice(0, maxLength), truncated: true }
}

/**
 * usePromptPlayground Hook
 *
 * Interactive prompt playground for testing and experimentation.
 * Features real-time rendering, token counting, and cost estimation.
 *
 * @example
 * ```tsx
 * const {
 *   state,
 *   setTemplate,
 *   setVariable,
 *   render,
 *   getEstimatedCost,
 * } = usePromptPlayground({
 *   initialTemplate: 'Hello {{name}}!',
 *   initialVariables: { name: 'World' },
 *   model: 'gpt-4o',
 *   autoRender: true,
 * })
 *
 * // Rendered output: "Hello World!"
 * console.log(state.output)
 *
 * // Token count: ~4
 * console.log(state.tokenCount)
 *
 * // Estimated cost
 * const cost = getEstimatedCost(100)
 * console.log(`Input: $${cost.input}, Output: $${cost.output}`)
 * ```
 */
export function usePromptPlayground(
  options: UsePromptPlaygroundOptions = {}
): UsePromptPlaygroundReturn {
  const {
    initialTemplate = '',
    initialVariables = {},
    model = 'gpt-4o',
    customPricing,
    debounceMs = 300,
    autoRender = true,
    onRender,
    onError,
  } = options

  const templateEngine = React.useMemo(() => new PromptTemplateEngine(), [])

  // Current model pricing
  const [currentModel, setCurrentModel] = React.useState(model)
  const pricing = React.useMemo(
    () =>
      customPricing || MODEL_PRICING[currentModel] || MODEL_PRICING['gpt-4o']!,
    [customPricing, currentModel]
  )

  // State
  const [state, setState] = React.useState<PromptPlaygroundState>(() => {
    const templateStr =
      typeof initialTemplate === 'string'
        ? initialTemplate
        : initialTemplate.template
    return {
      template: templateStr,
      variables: initialVariables,
      output: '',
      tokenCount: estimateTokens(templateStr),
      costEstimate: 0,
      errors: [],
      isRendering: false,
    }
  })

  // Debounce timer ref
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  // Refs to avoid stale closures in performRender
  const stateRef = React.useRef(state)
  const pricingRef = React.useRef(pricing)
  const callbacksRef = React.useRef({ onRender, onError })

  // Keep refs updated
  React.useEffect(() => {
    stateRef.current = state
  }, [state])

  React.useEffect(() => {
    pricingRef.current = pricing
  }, [pricing])

  React.useEffect(() => {
    callbacksRef.current = { onRender, onError }
  }, [onRender, onError])

  // Render function - uses refs to avoid stale closures
  const performRender = React.useCallback((): PromptRenderResult => {
    const currentState = stateRef.current
    const currentPricing = pricingRef.current
    const { onRender: renderCallback, onError: errorCallback } =
      callbacksRef.current

    setState((prev) => ({ ...prev, isRendering: true }))

    try {
      const result = templateEngine.render(currentState.template, {
        variables: currentState.variables as Record<string, unknown>,
        trim: true,
        validate: true,
      })

      const tokenCount = estimateTokens(result.prompt)
      const costEstimate = (tokenCount / 1000) * currentPricing.inputCostPer1k

      setState((prev) => ({
        ...prev,
        output: result.prompt,
        tokenCount,
        costEstimate,
        errors: result.errors ? [...result.errors] : [],
        isRendering: false,
      }))

      if (result.errors && result.errors.length > 0) {
        errorCallback?.([...result.errors])
      } else {
        renderCallback?.(result)
      }

      return result
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      setState((prev) => ({
        ...prev,
        errors: [errorMessage],
        isRendering: false,
      }))
      errorCallback?.([errorMessage])
      return {
        prompt: '',
        usedVariables: [],
        errors: [errorMessage],
        success: false,
      }
    }
  }, [templateEngine])

  // Auto-render with debounce
  React.useEffect(() => {
    if (!autoRender) return

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      performRender()
    }, debounceMs)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [state.template, state.variables, autoRender, debounceMs, performRender])

  // Set template with length validation
  const setTemplate = React.useCallback((template: string) => {
    const { value: validatedTemplate, truncated } = validateStringLength(
      template,
      MAX_TEMPLATE_LENGTH
    )
    setState((prev) => ({
      ...prev,
      template: validatedTemplate,
      tokenCount: estimateTokens(validatedTemplate),
      errors: truncated
        ? [
            ...prev.errors.filter((e) => !e.includes('truncated')),
            'Template was truncated to maximum length',
          ]
        : prev.errors.filter((e) => !e.includes('truncated')),
    }))
  }, [])

  // Validate variable value (truncate strings if too long)
  const validateVariableValue = React.useCallback((value: unknown): unknown => {
    if (typeof value === 'string') {
      const { value: validated } = validateStringLength(
        value,
        MAX_VARIABLE_VALUE_LENGTH
      )
      return validated
    }
    return value
  }, [])

  // Set single variable with validation
  const setVariable = React.useCallback(
    (name: string, value: unknown) => {
      // Validate variable name (alphanumeric, dots for nested paths)
      if (!/^[\w.]+$/.test(name) || name.length > 128) {
        return // Silently reject invalid variable names
      }
      const validatedValue = validateVariableValue(value)
      setState((prev) => ({
        ...prev,
        variables: { ...prev.variables, [name]: validatedValue },
      }))
    },
    [validateVariableValue]
  )

  // Set multiple variables with validation
  const setVariables = React.useCallback(
    (variables: Record<string, unknown>) => {
      // Filter and validate each variable
      const validatedVars: Record<string, unknown> = {}
      for (const [name, value] of Object.entries(variables)) {
        if (/^[\w.]+$/.test(name) && name.length <= 128) {
          validatedVars[name] = validateVariableValue(value)
        }
      }
      setState((prev) => ({
        ...prev,
        variables: { ...prev.variables, ...validatedVars },
      }))
    },
    [validateVariableValue]
  )

  // Extract variables from template
  const extractVariables = React.useCallback(() => {
    return templateEngine.extractVariables(state.template)
  }, [state.template, templateEngine])

  // Validate template
  const validate = React.useCallback(() => {
    return templateEngine.validate(state.template)
  }, [state.template, templateEngine])

  // Reset to initial state
  const reset = React.useCallback(() => {
    const templateStr =
      typeof initialTemplate === 'string'
        ? initialTemplate
        : initialTemplate.template
    setState({
      template: templateStr,
      variables: initialVariables,
      output: '',
      tokenCount: estimateTokens(templateStr),
      costEstimate: 0,
      errors: [],
      isRendering: false,
    })
  }, [initialTemplate, initialVariables])

  // Load a template
  const loadTemplate = React.useCallback((template: PromptTemplate) => {
    const defaultVars: Record<string, unknown> = {}
    template.variables?.forEach((v) => {
      if (v.default !== undefined) {
        defaultVars[v.name] = v.default
      }
    })

    setState({
      template: template.template,
      variables: defaultVars,
      output: '',
      tokenCount: estimateTokens(template.template),
      costEstimate: 0,
      errors: [],
      isRendering: false,
    })
  }, [])

  // Get estimated cost
  const getEstimatedCost = React.useCallback(
    (estimatedOutputTokens = 500) => {
      const inputCost = (state.tokenCount / 1000) * pricing.inputCostPer1k
      const outputCost =
        (estimatedOutputTokens / 1000) * pricing.outputCostPer1k
      return {
        input: inputCost,
        output: outputCost,
        total: inputCost + outputCost,
      }
    },
    [state.tokenCount, pricing]
  )

  // Set model
  const setModel = React.useCallback((modelId: string) => {
    setCurrentModel(modelId)
  }, [])

  return {
    state,
    setTemplate,
    setVariable,
    setVariables,
    extractVariables,
    render: performRender,
    validate,
    reset,
    loadTemplate,
    getEstimatedCost,
    pricing,
    setModel,
  }
}

export default usePromptPlayground
