import { logger } from '@clarity-chat/utils/logger';
/**
 * Chain-of-Thought (CoT) Optimization
 *
 * Optimizes CoT prompting for token efficiency based on research showing:
 * - Zero-Shot CoT often matches Few-Shot CoT for strong models (GPT-4, Claude 3.5+)
 * - Few-Shot exemplars primarily align output format, not reasoning
 * - "Let's think step by step" achieves similar results with fewer tokens
 *
 * This module helps:
 * - Detect and analyze CoT patterns in prompts
 * - Suggest Zero-Shot alternatives to save tokens
 * - Add appropriate CoT triggers
 * - Track token savings from CoT optimization
 *
 * @module utils/cot-optimizer
 */

import { estimateTokens } from '../tokenization/estimator'

export interface CoTOptimizationOptions {
  /** Prefer Zero-Shot CoT for strong models (default true) */
  preferZeroShot?: boolean
  /** Zero-Shot trigger phrase */
  zeroShotTrigger?: string
  /** Model strength classification */
  modelStrength?: 'weak' | 'moderate' | 'strong'
  /** Preserve format exemplars even when removing reasoning exemplars */
  preserveFormatExemplars?: boolean
  /** Maximum exemplars to keep (0 = remove all) */
  maxExemplars?: number
}

export interface CoTAnalysis {
  /** Whether prompt uses Few-Shot exemplars */
  hasFewShotExemplars: boolean
  /** Number of exemplars detected */
  exemplarCount: number
  /** Token count of exemplars */
  exemplarTokens: number
  /** Whether prompt has reasoning chains in exemplars */
  hasReasoningChains: boolean
  /** Whether prompt already has CoT trigger */
  hasCoTTrigger: boolean
  /** Detected CoT trigger phrase */
  detectedTrigger?: string
  /** Recommendation for optimization */
  recommendation:
    | 'keep-few-shot'
    | 'convert-to-zero-shot'
    | 'add-cot-trigger'
    | 'already-optimized'
  /** Estimated token savings from optimization */
  potentialSavings: number
}

export interface CoTOptimizationResult {
  /** Optimized prompt */
  optimized: string
  /** Original token count */
  originalTokens: number
  /** Optimized token count */
  optimizedTokens: number
  /** Tokens saved */
  tokensSaved: number
  /** Savings percentage */
  savingsPercent: number
  /** Applied optimizations */
  appliedOptimizations: string[]
  /** Analysis details */
  analysis: CoTAnalysis
}

/**
 * Common CoT trigger phrases
 */
export const COT_TRIGGERS = {
  /** Standard Zero-Shot CoT trigger (most effective) */
  standard: "Let's think step by step.",
  /** More detailed trigger */
  detailed:
    "Let's approach this step by step, considering each aspect carefully.",
  /** Concise trigger */
  concise: 'Think step by step:',
  /** Analysis-focused trigger */
  analysis: "Let's analyze this systematically.",
  /** Problem-solving trigger */
  problemSolving: "Let's break this problem down:",
  /** Reasoning trigger */
  reasoning: "Let's reason through this:",
} as const

/**
 * Patterns that indicate Few-Shot exemplars
 */
const EXEMPLAR_PATTERNS = [
  // Input/Output format
  /(?:Input|Question|Q):\s*[^\n]+\n(?:Output|Answer|A):\s*[^\n]+/gi,
  // Example markers
  /(?:Example\s*\d*:|For example:|E\.g\.:|Such as:)[^\n]*(?:\n[^\n]+)+/gi,
  // Numbered examples
  /\d+\)\s*[^\n]+(?:\n[^\n]+)+/gi,
  // User/Assistant format
  /(?:User:|Human:)\s*[^\n]+\n(?:Assistant:|AI:)\s*[^\n]+/gi,
]

/**
 * Patterns that indicate reasoning chains in exemplars
 */
const REASONING_PATTERNS = [
  // Step markers
  /(?:Step \d+|First|Then|Next|Finally|Therefore|Thus|Hence|So)[,:]?\s/gi,
  // Reasoning connectors
  /(?:because|since|due to|as a result|consequently|this means)/gi,
  // Mathematical reasoning
  /(?:we know that|we can see|this gives us|which equals|=)/gi,
  // Logical markers
  /(?:if .* then|given that|assuming|let's consider)/gi,
]

/**
 * Patterns that indicate existing CoT triggers
 */
const COT_TRIGGER_PATTERNS = [
  /let'?s?\s+think\s+(?:about\s+(?:this|it)\s+)?step\s+by\s+step/i,
  /think\s+(?:about\s+(?:this|it)\s+)?step\s+by\s+step/i,
  /let'?s?\s+(?:break\s+(?:this|it)\s+down|analyze\s+(?:this|it))/i,
  /approach\s+this\s+(?:step\s+by\s+step|systematically)/i,
  /reason(?:ing)?\s+(?:through|step\s+by\s+step)/i,
]

/**
 * Analyze a prompt for CoT patterns
 */
export function analyzeCoTPrompt(prompt: string): CoTAnalysis {
  // Detect exemplars
  let exemplarCount = 0
  let exemplarTokens = 0
  let hasReasoningChains = false

  for (const pattern of EXEMPLAR_PATTERNS) {
    const matches = prompt.match(pattern)
    if (matches) {
      exemplarCount += matches.length
      for (const match of matches) {
        exemplarTokens += estimateTokens(match)
        // Check if this exemplar has reasoning
        for (const reasoningPattern of REASONING_PATTERNS) {
          if (reasoningPattern.test(match)) {
            hasReasoningChains = true
            break
          }
        }
      }
    }
  }

  // Detect existing CoT trigger
  let hasCoTTrigger = false
  let detectedTrigger: string | undefined

  for (const pattern of COT_TRIGGER_PATTERNS) {
    const match = prompt.match(pattern)
    if (match) {
      hasCoTTrigger = true
      detectedTrigger = match[0]
      break
    }
  }

  const hasFewShotExemplars = exemplarCount > 0

  // Determine recommendation
  let recommendation: CoTAnalysis['recommendation'] = 'already-optimized'
  let potentialSavings = 0

  if (!hasFewShotExemplars && hasCoTTrigger) {
    recommendation = 'already-optimized'
  } else if (!hasFewShotExemplars && !hasCoTTrigger) {
    recommendation = 'add-cot-trigger'
    potentialSavings = 0 // Adding trigger adds tokens, but improves quality
  } else if (hasFewShotExemplars && hasReasoningChains) {
    // Few-shot with reasoning chains can often be converted to zero-shot
    recommendation = 'convert-to-zero-shot'
    potentialSavings = exemplarTokens - estimateTokens(COT_TRIGGERS.standard)
  } else if (hasFewShotExemplars && !hasReasoningChains) {
    // Few-shot without reasoning (format exemplars only) - keep some
    recommendation = 'keep-few-shot'
    potentialSavings = Math.floor(exemplarTokens * 0.5) // Can reduce exemplars
  }

  return {
    hasFewShotExemplars,
    exemplarCount,
    exemplarTokens,
    hasReasoningChains,
    hasCoTTrigger,
    detectedTrigger,
    recommendation,
    potentialSavings,
  }
}

/**
 * Optimize a CoT prompt for token efficiency
 *
 * @example
 * ```ts
 * const result = optimizeCoTPrompt(prompt, {
 *   preferZeroShot: true,
 *   modelStrength: 'strong'
 * })
 * logger.debug(`Saved ${result.tokensSaved} tokens (${result.savingsPercent.toFixed(1)}%)`)
 * ```
 */
export function optimizeCoTPrompt(
  prompt: string,
  options: CoTOptimizationOptions = {}
): CoTOptimizationResult {
  const {
    preferZeroShot = true,
    zeroShotTrigger = COT_TRIGGERS.standard,
    modelStrength = 'strong',
    preserveFormatExemplars = false,
    maxExemplars = 0,
  } = options

  const analysis = analyzeCoTPrompt(prompt)
  const originalTokens = estimateTokens(prompt)
  let optimized = prompt
  const appliedOptimizations: string[] = []

  // Decide whether to convert to zero-shot
  const shouldConvert =
    preferZeroShot &&
    modelStrength === 'strong' &&
    analysis.recommendation === 'convert-to-zero-shot'

  if (shouldConvert) {
    // Remove exemplars with reasoning chains
    for (const pattern of EXEMPLAR_PATTERNS) {
      optimized = optimized.replace(pattern, '')
    }
    optimized = optimized.replace(/\n{3,}/g, '\n\n').trim()
    appliedOptimizations.push('removed-reasoning-exemplars')

    // Add zero-shot trigger if not present
    if (!analysis.hasCoTTrigger) {
      optimized = `${optimized}\n\n${zeroShotTrigger}`
      appliedOptimizations.push('added-zero-shot-trigger')
    }
  } else if (
    analysis.hasFewShotExemplars &&
    (preserveFormatExemplars || maxExemplars > 0)
  ) {
    // Keep some exemplars but reduce count
    // This is a simplified implementation - real version would be smarter
    const lines = optimized.split('\n')
    let exemplarsSeen = 0
    const filteredLines = lines.filter((line) => {
      for (const pattern of EXEMPLAR_PATTERNS) {
        if (pattern.test(line)) {
          exemplarsSeen++
          return exemplarsSeen <= maxExemplars
        }
      }
      return true
    })
    optimized = filteredLines.join('\n')
    appliedOptimizations.push(`reduced-exemplars-to-${maxExemplars}`)
  } else if (analysis.recommendation === 'add-cot-trigger') {
    // Add CoT trigger to prompts without one
    if (!analysis.hasCoTTrigger) {
      optimized = `${optimized}\n\n${zeroShotTrigger}`
      appliedOptimizations.push('added-cot-trigger')
    }
  }

  // Clean up extra whitespace
  optimized = optimized.replace(/\n{3,}/g, '\n\n').trim()

  const optimizedTokens = estimateTokens(optimized)
  const tokensSaved = originalTokens - optimizedTokens

  return {
    optimized,
    originalTokens,
    optimizedTokens,
    tokensSaved,
    savingsPercent: (tokensSaved / originalTokens) * 100,
    appliedOptimizations,
    analysis,
  }
}

/**
 * Add Zero-Shot CoT trigger to a prompt
 *
 * Appends the trigger phrase appropriately, handling existing CoT indicators.
 *
 * @example
 * ```ts
 * const enhanced = addZeroShotCoT("What is 2 + 2?")
 * // "What is 2 + 2?\n\nLet's think step by step."
 * ```
 */
export function addZeroShotCoT(
  prompt: string,
  trigger: string = COT_TRIGGERS.standard
): string {
  // Check if already has a CoT trigger
  for (const pattern of COT_TRIGGER_PATTERNS) {
    if (pattern.test(prompt)) {
      return prompt // Already has trigger
    }
  }

  // Add trigger at end
  return `${prompt.trim()}\n\n${trigger}`
}

/**
 * Detect the best CoT approach for a given model and task
 */
export function recommendCoTApproach(params: {
  model: string
  taskType: 'math' | 'logic' | 'coding' | 'analysis' | 'creative' | 'factual'
  promptLength: number
  hasExamples: boolean
}): {
  approach: 'zero-shot' | 'few-shot' | 'none'
  trigger?: string
  reason: string
  tokenEfficiency: 'high' | 'medium' | 'low'
} {
  const { model, taskType, promptLength, hasExamples } = params

  // Strong models (GPT-4, Claude 3.5+) work well with Zero-Shot
  const strongModels = [
    'gpt-4',
    'gpt-4o',
    'gpt-4-turbo',
    'claude-3-5',
    'claude-3-opus',
    'claude-3-sonnet',
    'claude-4',
    'gemini-1.5-pro',
    'gemini-2',
  ]
  const isStrongModel = strongModels.some((m) =>
    model.toLowerCase().includes(m.toLowerCase())
  )

  // Tasks that benefit from CoT
  const cotBenefitTasks: (typeof taskType)[] = [
    'math',
    'logic',
    'coding',
    'analysis',
  ]
  const benefitsFromCoT = cotBenefitTasks.includes(taskType)

  // Decision logic
  if (!benefitsFromCoT) {
    return {
      approach: 'none',
      reason: `${taskType} tasks typically don't benefit from CoT`,
      tokenEfficiency: 'high',
    }
  }

  if (isStrongModel && !hasExamples) {
    return {
      approach: 'zero-shot',
      trigger: COT_TRIGGERS.standard,
      reason: `${model} performs well with Zero-Shot CoT, saving tokens vs Few-Shot`,
      tokenEfficiency: 'high',
    }
  }

  if (isStrongModel && hasExamples) {
    return {
      approach: 'zero-shot',
      trigger: COT_TRIGGERS.standard,
      reason:
        'Consider removing examples and using Zero-Shot for similar quality with fewer tokens',
      tokenEfficiency: 'medium',
    }
  }

  // Weaker models may benefit from Few-Shot
  return {
    approach: 'few-shot',
    reason: `${model} may benefit from Few-Shot exemplars for ${taskType} tasks`,
    tokenEfficiency: 'low',
  }
}

/**
 * Estimate token savings from using Zero-Shot vs Few-Shot CoT
 */
export function estimateCoTSavings(
  exemplarCount: number,
  averageExemplarLength: number = 100
): {
  fewShotTokens: number
  zeroShotTokens: number
  savings: number
  savingsPercent: number
} {
  const exemplarTokens = exemplarCount * Math.ceil(averageExemplarLength / 4)
  const triggerTokens = estimateTokens(COT_TRIGGERS.standard)

  return {
    fewShotTokens: exemplarTokens,
    zeroShotTokens: triggerTokens,
    savings: exemplarTokens - triggerTokens,
    savingsPercent: ((exemplarTokens - triggerTokens) / exemplarTokens) * 100,
  }
}

/**
 * Create a CoT-optimized prompt for a specific task type
 */
export function createCoTPrompt(params: {
  task: string
  taskType: 'math' | 'logic' | 'coding' | 'analysis' | 'creative' | 'factual'
  model?: string
  useZeroShot?: boolean
}): string {
  const { task, taskType, model = 'gpt-4', useZeroShot = true } = params

  // Get appropriate trigger based on task type
  let trigger: string
  switch (taskType) {
    case 'math':
      trigger = COT_TRIGGERS.problemSolving
      break
    case 'logic':
      trigger = COT_TRIGGERS.reasoning
      break
    case 'coding':
      trigger = COT_TRIGGERS.detailed
      break
    case 'analysis':
      trigger = COT_TRIGGERS.analysis
      break
    default:
      trigger = COT_TRIGGERS.standard
  }

  if (!useZeroShot) {
    // Return without CoT for creative/factual
    return task
  }

  return `${task}\n\n${trigger}`
}
