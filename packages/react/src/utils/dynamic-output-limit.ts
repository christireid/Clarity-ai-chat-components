/**
 * Dynamic Output Token Calculator
 *
 * Calculates optimal max_tokens based on input consumption, user preferences,
 * and task type. Reduces wasted output capacity and minimizes TTIT latency.
 *
 * Features:
 * - Dynamic calculation: max_tokens = min(remaining, preference, ui_cap)
 * - Task-type multipliers for different use cases
 * - User preference modifiers (concise/balanced/detailed)
 * - Brevity instruction injection for prompt reinforcement
 *
 * @module utils/dynamic-output-limit
 */

/**
 * User preference for response verbosity
 */
export type OutputPreference = 'concise' | 'balanced' | 'detailed'

/**
 * Task type for output limit calculation
 */
export type TaskType = 'classification' | 'extraction' | 'generation' | 'analysis' | 'chat' | 'code' | 'summary'

/**
 * Configuration for output limit calculation
 */
export interface OutputLimitConfig {
  /** Total model context capacity */
  modelCapacity: number
  /** Actual input tokens used */
  inputTokenCount: number
  /** User's verbosity preference */
  userPreference?: OutputPreference
  /** Type of task being performed */
  taskType?: TaskType
  /** Hard cap from UI configuration */
  uiConfiguredMax?: number
  /** Minimum output tokens (default: 50) */
  minOutputTokens?: number
  /** Whether to include brevity instruction */
  includeBrevityInstruction?: boolean
}

/**
 * Result from output limit calculation
 */
export interface OutputLimitResult {
  /** Recommended max_tokens for API call */
  recommendedMaxTokens: number
  /** Absolute maximum (modelCapacity - inputTokenCount) */
  absoluteMaxTokens: number
  /** Brevity instruction to inject into system prompt */
  brevityInstruction: string
  /** Explanation of how limit was calculated */
  reasoning: string
  /** Whether the limit is constrained by input size */
  inputConstrained: boolean
  /** Utilization percentage of context window */
  inputUtilization: number
}

/**
 * Default base limits by task type
 */
const TASK_TYPE_DEFAULTS: Record<TaskType, { base: number; multiplier: number }> = {
  classification: { base: 100, multiplier: 0.1 },
  extraction: { base: 500, multiplier: 0.3 },
  summary: { base: 500, multiplier: 0.25 },
  chat: { base: 1000, multiplier: 0.5 },
  analysis: { base: 2000, multiplier: 0.6 },
  generation: { base: 4000, multiplier: 0.7 },
  code: { base: 4000, multiplier: 0.8 },
}

/**
 * Preference multipliers
 */
const PREFERENCE_MULTIPLIERS: Record<OutputPreference, number> = {
  concise: 0.5,
  balanced: 1.0,
  detailed: 1.5,
}

/**
 * Brevity instructions by token limit range
 */
const BREVITY_INSTRUCTIONS: Array<{ maxTokens: number; instruction: string }> = [
  {
    maxTokens: 100,
    instruction: 'Respond in 1-2 sentences maximum. Be extremely brief.',
  },
  {
    maxTokens: 200,
    instruction: 'Keep your response to 2-3 sentences. Be very concise.',
  },
  {
    maxTokens: 500,
    instruction: 'Be concise. Use bullet points where appropriate. Aim for brevity.',
  },
  {
    maxTokens: 1000,
    instruction: 'Provide a focused response. Avoid unnecessary elaboration.',
  },
  {
    maxTokens: 2000,
    instruction: 'Give a clear, well-structured response without excessive detail.',
  },
  {
    maxTokens: Infinity,
    instruction: 'Provide a thorough response while remaining efficient with words.',
  },
]

/**
 * Calculate dynamic output token limit
 *
 * Intelligently determines the optimal max_tokens based on:
 * - Available context space (modelCapacity - inputTokenCount)
 * - Task type (classification needs fewer tokens than code generation)
 * - User preference (concise vs detailed)
 * - UI configuration limits
 *
 * @param config - Configuration for the calculation
 * @returns Output limit result with recommendation and brevity instruction
 *
 * @example
 * ```ts
 * const result = calculateDynamicOutputLimit({
 *   modelCapacity: 128000,
 *   inputTokenCount: 5000,
 *   userPreference: 'concise',
 *   taskType: 'chat',
 * })
 *
 * console.log(result.recommendedMaxTokens) // e.g., 500
 * console.log(result.brevityInstruction)   // "Be concise..."
 *
 * // Use in API call
 * const response = await api.chat({
 *   messages,
 *   max_tokens: result.recommendedMaxTokens,
 * })
 * ```
 */
export function calculateDynamicOutputLimit(config: OutputLimitConfig): OutputLimitResult {
  const {
    modelCapacity,
    inputTokenCount,
    userPreference = 'balanced',
    taskType = 'chat',
    uiConfiguredMax,
    minOutputTokens = 50,
    includeBrevityInstruction = true,
  } = config

  // Calculate absolute maximum (what's left after input)
  const absoluteMaxTokens = Math.max(0, modelCapacity - inputTokenCount)

  // Calculate input utilization
  const inputUtilization = modelCapacity > 0 ? (inputTokenCount / modelCapacity) * 100 : 0

  // Get task type configuration
  const taskConfig = TASK_TYPE_DEFAULTS[taskType]

  // Calculate task-based limit
  // Use the remaining space multiplied by task multiplier, or task base, whichever fits
  const taskBasedLimit = Math.min(
    taskConfig.base,
    Math.floor(absoluteMaxTokens * taskConfig.multiplier)
  )

  // Apply preference multiplier
  const preferenceMultiplier = PREFERENCE_MULTIPLIERS[userPreference]
  const preferenceAdjusted = Math.floor(taskBasedLimit * preferenceMultiplier)

  // Calculate final recommendation
  let recommendedMaxTokens = preferenceAdjusted

  // Apply UI configured max if set
  if (uiConfiguredMax !== undefined) {
    recommendedMaxTokens = Math.min(recommendedMaxTokens, uiConfiguredMax)
  }

  // Ensure we don't exceed absolute max
  recommendedMaxTokens = Math.min(recommendedMaxTokens, absoluteMaxTokens)

  // Ensure minimum
  recommendedMaxTokens = Math.max(recommendedMaxTokens, Math.min(minOutputTokens, absoluteMaxTokens))

  // Determine if input constrained
  const inputConstrained = absoluteMaxTokens < taskConfig.base

  // Get appropriate brevity instruction
  let brevityInstruction = ''
  if (includeBrevityInstruction) {
    for (const { maxTokens, instruction } of BREVITY_INSTRUCTIONS) {
      if (recommendedMaxTokens <= maxTokens) {
        brevityInstruction = instruction
        break
      }
    }
  }

  // Build reasoning explanation
  const reasoningParts: string[] = []

  reasoningParts.push(`Model capacity: ${modelCapacity.toLocaleString()} tokens`)
  reasoningParts.push(`Input used: ${inputTokenCount.toLocaleString()} tokens (${inputUtilization.toFixed(1)}%)`)
  reasoningParts.push(`Remaining: ${absoluteMaxTokens.toLocaleString()} tokens`)
  reasoningParts.push(`Task type "${taskType}": base ${taskConfig.base}, multiplier ${taskConfig.multiplier}`)
  reasoningParts.push(`Preference "${userPreference}": ${preferenceMultiplier}x`)

  if (uiConfiguredMax !== undefined) {
    reasoningParts.push(`UI cap: ${uiConfiguredMax.toLocaleString()} tokens`)
  }

  if (inputConstrained) {
    reasoningParts.push('⚠️ Input-constrained: less output space than typical for task')
  }

  reasoningParts.push(`Final recommendation: ${recommendedMaxTokens.toLocaleString()} tokens`)

  return {
    recommendedMaxTokens,
    absoluteMaxTokens,
    brevityInstruction,
    reasoning: reasoningParts.join('\n'),
    inputConstrained,
    inputUtilization,
  }
}

/**
 * Inject brevity instruction into system prompt
 *
 * Adds the instruction at the end of the system prompt to reinforce
 * output length constraints.
 *
 * @param systemPrompt - Original system prompt
 * @param instruction - Brevity instruction to add
 * @returns Modified system prompt with instruction
 *
 * @example
 * ```ts
 * const limit = calculateDynamicOutputLimit(config)
 * const enhancedPrompt = injectBrevityInstruction(
 *   "You are a helpful assistant.",
 *   limit.brevityInstruction
 * )
 * // "You are a helpful assistant.\n\nIMPORTANT: Be concise..."
 * ```
 */
export function injectBrevityInstruction(
  systemPrompt: string,
  instruction: string
): string {
  if (!instruction) return systemPrompt

  // Don't duplicate if already present
  if (systemPrompt.includes(instruction)) {
    return systemPrompt
  }

  return `${systemPrompt}\n\nIMPORTANT: ${instruction}`
}

/**
 * Get output preference configuration
 */
export function getPreferenceConfig(preference: OutputPreference): {
  multiplier: number
  description: string
  typicalRange: string
} {
  const configs: Record<OutputPreference, { multiplier: number; description: string; typicalRange: string }> = {
    concise: {
      multiplier: 0.5,
      description: 'Brief, to-the-point responses',
      typicalRange: '50-500 tokens',
    },
    balanced: {
      multiplier: 1.0,
      description: 'Standard response length',
      typicalRange: '200-2000 tokens',
    },
    detailed: {
      multiplier: 1.5,
      description: 'Comprehensive explanations',
      typicalRange: '500-4000 tokens',
    },
  }

  return configs[preference]
}

/**
 * Get task type configuration
 */
export function getTaskTypeConfig(taskType: TaskType): {
  base: number
  multiplier: number
  description: string
  examples: string[]
} {
  const configs: Record<TaskType, { base: number; multiplier: number; description: string; examples: string[] }> = {
    classification: {
      base: 100,
      multiplier: 0.1,
      description: 'Single-label or category output',
      examples: ['Sentiment analysis', 'Topic classification', 'Intent detection'],
    },
    extraction: {
      base: 500,
      multiplier: 0.3,
      description: 'Extracting specific information',
      examples: ['Named entity extraction', 'Data parsing', 'Key fact extraction'],
    },
    summary: {
      base: 500,
      multiplier: 0.25,
      description: 'Condensing longer content',
      examples: ['Article summarization', 'Meeting notes', 'TLDR'],
    },
    chat: {
      base: 1000,
      multiplier: 0.5,
      description: 'Conversational responses',
      examples: ['Customer support', 'General Q&A', 'Casual conversation'],
    },
    analysis: {
      base: 2000,
      multiplier: 0.6,
      description: 'Detailed examination of content',
      examples: ['Document analysis', 'Comparison', 'Evaluation'],
    },
    generation: {
      base: 4000,
      multiplier: 0.7,
      description: 'Creating new content',
      examples: ['Article writing', 'Story generation', 'Report creation'],
    },
    code: {
      base: 4000,
      multiplier: 0.8,
      description: 'Code generation and explanation',
      examples: ['Writing functions', 'Code review', 'Debugging'],
    },
  }

  return configs[taskType]
}

/**
 * Detect task type from user query
 *
 * Analyzes the query to suggest an appropriate task type.
 *
 * @param query - User's input query
 * @returns Suggested task type
 */
export function detectTaskType(query: string): TaskType {
  const lowerQuery = query.toLowerCase()

  // Classification indicators
  if (/\b(classify|categorize|label|is this|sentiment|positive or negative)\b/.test(lowerQuery)) {
    return 'classification'
  }

  // Extraction indicators
  if (/\b(extract|find|get|list all|what are the|identify)\b/.test(lowerQuery)) {
    return 'extraction'
  }

  // Summary indicators
  if (/\b(summarize|summary|tldr|brief|condense|shorten)\b/.test(lowerQuery)) {
    return 'summary'
  }

  // Code indicators
  if (/\b(code|function|implement|write.*program|debug|fix.*bug|refactor)\b/.test(lowerQuery)) {
    return 'code'
  }

  // Generation indicators
  if (/\b(write|create|generate|compose|draft|make a)\b/.test(lowerQuery)) {
    return 'generation'
  }

  // Analysis indicators
  if (/\b(analyze|compare|evaluate|assess|review|explain in detail)\b/.test(lowerQuery)) {
    return 'analysis'
  }

  // Default to chat
  return 'chat'
}

/**
 * Create output limit configuration for common models
 */
export function createModelOutputConfig(
  model: 'gpt-4' | 'gpt-4-turbo' | 'gpt-4o' | 'claude-3-opus' | 'claude-3-5-sonnet' | 'claude-3-haiku',
  inputTokenCount: number,
  overrides?: Partial<Omit<OutputLimitConfig, 'modelCapacity' | 'inputTokenCount'>>
): OutputLimitConfig {
  const modelCapacities: Record<string, number> = {
    'gpt-4': 8192,
    'gpt-4-turbo': 128000,
    'gpt-4o': 128000,
    'claude-3-opus': 200000,
    'claude-3-5-sonnet': 200000,
    'claude-3-haiku': 200000,
  }

  return {
    modelCapacity: modelCapacities[model],
    inputTokenCount,
    ...overrides,
  }
}

/**
 * Quick helper to get max_tokens for API call
 */
export function getMaxTokens(
  modelCapacity: number,
  inputTokenCount: number,
  preference: OutputPreference = 'balanced',
  taskType: TaskType = 'chat'
): number {
  const result = calculateDynamicOutputLimit({
    modelCapacity,
    inputTokenCount,
    userPreference: preference,
    taskType,
  })

  return result.recommendedMaxTokens
}
