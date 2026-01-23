/**
 * Advanced Token Cost Preview Component
 *
 * Enterprise-grade cost estimation with real-time pricing,
 * model comparison, and optimization recommendations
 */

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useTransition,
  useDeferredValue,
  useId,
} from 'react'
import {
  AccurateTokenCounter,
  countTokensWithConfidence,
  type ModelFamily,
  type TokenCountResult,
} from '@clarity-chat/token-optimization'

/**
 * Model pricing information (tokens per dollar)
 */
export interface ModelPricing {
  model: ModelFamily
  inputCost: number // Cost per 1K input tokens
  outputCost: number // Cost per 1K output tokens
  contextWindow: number
  description: string
}

/**
 * Cost estimation result
 */
export interface CostEstimate {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  inputCost: number
  outputCost: number
  totalCost: number
  confidence: 'exact' | 'high' | 'approximate'
  model: ModelFamily
  optimizationPotential: number
}

/**
 * Optimization suggestion
 */
export interface OptimizationSuggestion {
  type: 'compression' | 'model_selection' | 'context_optimization' | 'caching'
  title: string
  description: string
  potentialSavings: number
  implementation: 'easy' | 'medium' | 'complex'
  priority: 'high' | 'medium' | 'low'
}

/**
 * Advanced Token Cost Preview Props
 */
export interface AdvancedTokenCostPreviewProps {
  text: string
  models?: ModelFamily[]
  estimatedOutputRatio?: number
  showOptimization?: boolean
  showComparison?: boolean
  enableRealTime?: boolean
  onCostUpdate?: (estimate: CostEstimate) => void
  className?: string
  style?: React.CSSProperties
}

/**
 * Model pricing data
 */
const MODEL_PRICING: Record<ModelFamily, ModelPricing> = {
  'gpt-4': {
    model: 'gpt-4',
    inputCost: 0.03,
    outputCost: 0.06,
    contextWindow: 128000,
    description: 'Most capable GPT model',
  },
  'gpt-3.5': {
    model: 'gpt-3.5',
    inputCost: 0.001,
    outputCost: 0.002,
    contextWindow: 16384,
    description: 'Fast and cost-effective',
  },
  claude: {
    model: 'claude',
    inputCost: 0.008,
    outputCost: 0.024,
    contextWindow: 200000,
    description: 'Advanced reasoning capabilities',
  },
  gemini: {
    model: 'gemini',
    inputCost: 0.0075,
    outputCost: 0.03,
    contextWindow: 128000,
    description: 'Multimodal capabilities',
  },
  generic: {
    model: 'generic',
    inputCost: 0.01,
    outputCost: 0.02,
    contextWindow: 32768,
    description: 'General purpose',
  },
}

/**
 * Advanced Token Cost Preview Component
 */
export const AdvancedTokenCostPreview: React.FC<
  AdvancedTokenCostPreviewProps
> = ({
  text,
  models = ['gpt-4', 'gpt-3.5', 'claude'],
  estimatedOutputRatio = 0.3,
  showOptimization = true,
  showComparison = true,
  enableRealTime = true,
  onCostUpdate,
  className,
  style,
}) => {
  // React 19: Stable unique ID for accessibility
  const componentId = useId()

  // React 19: useTransition for non-blocking model selection updates
  const [isPending, startTransition] = useTransition()

  // React 19: useDeferredValue prevents UI jank during expensive cost calculations
  const deferredText = useDeferredValue(text)

  const [selectedModel, setSelectedModel] = useState<ModelFamily>(models[0])
  const [isCalculating, setIsCalculating] = useState(false)
  const [lastCalculation, setLastCalculation] = useState<number>(0)
  const [tokenInfo, setTokenInfo] = useState<TokenCountResult | null>(null)
  const [costEstimate, setCostEstimate] = useState<CostEstimate | null>(null)
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<
    OptimizationSuggestion[]
  >([])

  // Track stale state for visual feedback
  const isStale = text !== deferredText || isPending

  const _tokenCounter = useMemo(
    () => new AccurateTokenCounter({ model: 'gpt-4' }),
    []
  )

  /**
   * Calculate cost estimate
   */
  const calculateCostEstimate = useCallback((): CostEstimate => {
    if (!tokenInfo) {
      return {
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        inputCost: 0,
        outputCost: 0,
        totalCost: 0,
        confidence: 'exact',
        model: selectedModel,
        optimizationPotential: 0,
      }
    }

    const inputTokens = tokenInfo.count
    const outputTokens = Math.ceil(inputTokens * estimatedOutputRatio)
    const totalTokens = inputTokens + outputTokens

    const pricing = MODEL_PRICING[selectedModel]
    const inputCost = (inputTokens / 1000) * pricing.inputCost
    const outputCost = (outputTokens / 1000) * pricing.outputCost
    const totalCost = inputCost + outputCost

    // Calculate optimization potential
    const optimizationPotential = calculateOptimizationPotential(
      tokenInfo,
      selectedModel
    )

    return {
      inputTokens,
      outputTokens,
      totalTokens,
      inputCost,
      outputCost,
      totalCost,
      confidence: tokenInfo.confidence,
      model: selectedModel,
      optimizationPotential,
    }
  }, [tokenInfo, selectedModel, estimatedOutputRatio])

  /**
   * Count tokens with performance optimization
   */
  const countTokensOptimized =
    useCallback(async (): Promise<TokenCountResult> => {
      if (!text) {
        return {
          count: 0,
          confidence: 'exact',
          contentType: 'unknown',
          model: selectedModel,
        }
      }

      setIsCalculating(true)

      try {
        // Use the advanced counter for accurate results
        const result = countTokensWithConfidence(text, selectedModel, {
          enableCaching: true,
          enableContentDetection: true,
        })

        return result
      } catch (error) {
        console.warn('Token counting failed:', error)
        // Fallback to basic counting
        return {
          count: Math.ceil(text.length / 4),
          confidence: 'approximate',
          contentType: 'unknown',
          model: selectedModel,
        }
      } finally {
        setIsCalculating(false)
      }
    }, [text, selectedModel])

  /**
   * Generate optimization suggestions
   */
  const generateOptimizationSuggestions =
    useCallback((): OptimizationSuggestion[] => {
      if (!costEstimate || !showOptimization) return []

      const suggestions: OptimizationSuggestion[] = []

      // Model selection optimization
      const optimalModel = findOptimalModel(text, models)
      if (optimalModel !== selectedModel) {
        const potentialSavings = calculateModelSavings(
          selectedModel,
          optimalModel,
          costEstimate
        )
        suggestions.push({
          type: 'model_selection',
          title: 'Switch to More Cost-Effective Model',
          description: `${MODEL_PRICING[optimalModel].description} could save ~${Math.round(potentialSavings * 100)}% on costs`,
          potentialSavings,
          implementation: 'easy',
          priority: 'high',
        })
      }

      // Compression optimization
      if (costEstimate.totalTokens > 1000) {
        const compressionSavings = calculateCompressionSavings(costEstimate)
        suggestions.push({
          type: 'compression',
          title: 'Enable Smart Compression',
          description:
            'Compress repetitive content to reduce token usage by 20-40%',
          potentialSavings: compressionSavings,
          implementation: 'medium',
          priority: 'medium',
        })
      }

      // Caching optimization
      if (text.length > 500) {
        suggestions.push({
          type: 'caching',
          title: 'Implement Response Caching',
          description: 'Cache similar queries to reduce repeated token costs',
          potentialSavings: 0.15,
          implementation: 'medium',
          priority: 'low',
        })
      }

      return suggestions
    }, [costEstimate, showOptimization, text, models, selectedModel])

  /**
   * Effect for token counting
   * Uses deferredText (React 19) for smoother UI during rapid text changes
   */
  useEffect(() => {
    let cancelled = false

    const updateTokens = async () => {
      const now = Date.now()

      // Throttle calculations to prevent excessive updates
      if (!enableRealTime || now - lastCalculation < 500) return

      const result = await countTokensOptimized()
      if (!cancelled) {
        setTokenInfo(result)
        setLastCalculation(now)
      }
    }

    updateTokens()

    return () => {
      cancelled = true
    }
  }, [deferredText, countTokensOptimized, enableRealTime, lastCalculation])

  /**
   * Effect for cost calculation
   */
  useEffect(() => {
    if (tokenInfo) {
      const estimate = calculateCostEstimate()
      setCostEstimate(estimate)

      if (onCostUpdate) {
        onCostUpdate(estimate)
      }
    }
  }, [tokenInfo, calculateCostEstimate, onCostUpdate])

  /**
   * Effect for optimization suggestions
   */
  useEffect(() => {
    if (costEstimate) {
      const suggestions = generateOptimizationSuggestions()
      setOptimizationSuggestions(suggestions)
    }
  }, [costEstimate, generateOptimizationSuggestions])

  /**
   * Format currency
   */
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(amount)
  }

  /**
   * Format number with commas
   */
  const formatNumber = (num: number): string => {
    return num.toLocaleString()
  }

  return (
    <div
      className={`advanced-token-cost-preview ${className || ''}`}
      style={{ ...style, opacity: isStale ? 0.8 : 1 }}
      aria-labelledby={`${componentId}-title`}
      aria-busy={isCalculating || isStale}
    >
      <div className="cost-preview-header">
        <h3 id={`${componentId}-title`}>Token Cost Analysis</h3>
        {(isCalculating || isStale) && (
          <span className="calculating-indicator" aria-live="polite">
            {isCalculating ? 'Calculating...' : 'Updating...'}
          </span>
        )}
      </div>

      <div className="model-selector">
        <label htmlFor={`${componentId}-model-select`}>Model:</label>
        <select
          id={`${componentId}-model-select`}
          value={selectedModel}
          onChange={(e) => {
            // React 19: Use transition for non-blocking model changes
            startTransition(() => {
              setSelectedModel(e.target.value as ModelFamily)
            })
          }}
          disabled={isCalculating}
          aria-busy={isPending}
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {model.toUpperCase()} - {MODEL_PRICING[model].description}
            </option>
          ))}
        </select>
        {isPending && <span className="transition-indicator">Updating...</span>}
      </div>

      {tokenInfo && (
        <div className="token-analysis">
          <div className="token-count">
            <span className="label">Tokens:</span>
            <span className="value">{formatNumber(tokenInfo.count)}</span>
            <span className={`confidence ${tokenInfo.confidence}`}>
              {tokenInfo.confidence}
            </span>
          </div>

          <div className="content-type">
            <span className="label">Content Type:</span>
            <span className="value">{tokenInfo.contentType || 'unknown'}</span>
          </div>
        </div>
      )}

      {costEstimate && (
        <div className="cost-breakdown">
          <h4>Cost Estimate</h4>
          <div className="cost-details">
            <div className="cost-item">
              <span className="label">
                Input ({formatNumber(costEstimate.inputTokens)} tokens):
              </span>
              <span className="value">
                {formatCurrency(costEstimate.inputCost)}
              </span>
            </div>
            <div className="cost-item">
              <span className="label">
                Output ({formatNumber(costEstimate.outputTokens)} tokens):
              </span>
              <span className="value">
                {formatCurrency(costEstimate.outputCost)}
              </span>
            </div>
            <div className="cost-item total">
              <span className="label">Total:</span>
              <span className="value">
                {formatCurrency(costEstimate.totalCost)}
              </span>
            </div>
          </div>

          {showComparison && models.length > 1 && (
            <div className="model-comparison">
              <h4>Model Comparison</h4>
              <div className="comparison-grid">
                {models.map((model) => {
                  const modelCost = calculateModelCost(
                    text,
                    model,
                    estimatedOutputRatio
                  )
                  const isSelected = model === selectedModel
                  const savings = isSelected
                    ? 0
                    : (costEstimate.totalCost - modelCost) /
                      costEstimate.totalCost

                  return (
                    <div
                      key={model}
                      className={`model-option ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="model-name">{model.toUpperCase()}</div>
                      <div className="model-cost">
                        {formatCurrency(modelCost)}
                      </div>
                      {!isSelected && savings > 0.01 && (
                        <div className="model-savings">
                          Save {Math.round(savings * 100)}%
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {showOptimization && optimizationSuggestions.length > 0 && (
        <div className="optimization-suggestions">
          <h4>Optimization Suggestions</h4>
          {optimizationSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`suggestion priority-${suggestion.priority}`}
            >
              <div className="suggestion-header">
                <span className="suggestion-title">{suggestion.title}</span>
                <span className="suggestion-savings">
                  Save {Math.round(suggestion.potentialSavings * 100)}%
                </span>
              </div>
              <div className="suggestion-description">
                {suggestion.description}
              </div>
              <div className="suggestion-meta">
                <span className="implementation">
                  {suggestion.implementation}
                </span>
                <span className="priority">{suggestion.priority}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Calculate optimization potential based on content and model
 */
function calculateOptimizationPotential(
  tokenInfo: TokenCountResult,
  model: ModelFamily
): number {
  let potential = 0

  // Content-based optimization
  if (tokenInfo.contentType === 'code') {
    potential += 0.2 // Code can be compressed more effectively
  }

  if (tokenInfo.confidence === 'approximate') {
    potential += 0.15 // Better counting can improve accuracy
  }

  // Model-based optimization
  if (['gpt-4', 'claude'].includes(model)) {
    potential += 0.25 // High-cost models have more optimization potential
  }

  return Math.min(0.5, potential)
}

/**
 * Find optimal model for given text
 */
function findOptimalModel(
  text: string,
  availableModels: ModelFamily[]
): ModelFamily {
  const textLength = text.length
  const complexity = text.split(/[.!?]+/).length / (textLength / 100)

  // Simple heuristics for model selection
  if (textLength < 1000 && complexity < 5) {
    return 'gpt-3.5' // Simple, short texts
  }

  if (text.includes('code') || text.includes('function')) {
    return 'claude' // Code-related content
  }

  // Default to most cost-effective available model
  return availableModels.includes('gpt-3.5') ? 'gpt-3.5' : availableModels[0]
}

/**
 * Calculate model switching savings
 */
function calculateModelSavings(
  currentModel: ModelFamily,
  optimalModel: ModelFamily,
  _currentCost: CostEstimate
): number {
  const currentPricing = MODEL_PRICING[currentModel]
  const optimalPricing = MODEL_PRICING[optimalModel]

  const currentTotalRate = currentPricing.inputCost + currentPricing.outputCost
  const optimalTotalRate = optimalPricing.inputCost + optimalPricing.outputCost

  return Math.max(0, (currentTotalRate - optimalTotalRate) / currentTotalRate)
}

/**
 * Calculate compression savings potential
 */
function calculateCompressionSavings(_costEstimate: CostEstimate): number {
  // Estimate 20-40% compression for typical content
  const compressionRatio = 0.3
  return compressionRatio * 0.8 // Account for implementation overhead
}

/**
 * Calculate model cost
 */
function calculateModelCost(
  text: string,
  model: ModelFamily,
  outputRatio: number
): number {
  const tokenInfo = countTokensWithConfidence(text, model)
  const inputTokens = tokenInfo.count
  const outputTokens = Math.ceil(inputTokens * outputRatio)

  const pricing = MODEL_PRICING[model]
  const inputCost = (inputTokens / 1000) * pricing.inputCost
  const outputCost = (outputTokens / 1000) * pricing.outputCost

  return inputCost + outputCost
}
