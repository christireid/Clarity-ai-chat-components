/**
 * Token Audit Instrumentation Types
 *
 * Types for rigorous token measurement and A/B testing
 */

/**
 * Provider token usage as reported in API responses
 */
export interface ProviderTokenUsage {
  /** Input/prompt tokens as billed by provider */
  promptTokens: number
  /** Output/completion tokens as billed by provider */
  completionTokens: number
  /** Total tokens (prompt + completion) */
  totalTokens: number
  /** Cached tokens if supported (Anthropic) */
  cachedTokens?: number
  /** Reasoning tokens if supported (o1) */
  reasoningTokens?: number
}

/**
 * Estimated token counts from client-side calculation
 */
export interface EstimatedTokenUsage {
  /** Estimated input tokens */
  promptTokens: number
  /** Estimated output tokens (post-response) */
  completionTokens: number
  /** Total estimated */
  totalTokens: number
  /** Method used for estimation */
  method: 'char-ratio' | 'gpt-tokenizer' | 'tiktoken' | 'unknown'
  /** Chars per token ratio used (if applicable) */
  charsPerToken?: number
}

/**
 * Payload snapshot before/after optimization
 */
export interface PayloadSnapshot {
  /** Messages array */
  messages: Array<{
    role: string
    content: string | unknown
    /** Content as string for measurement */
    contentString: string
    /** Character count */
    charCount: number
    /** Estimated tokens */
    estimatedTokens: number
  }>
  /** System prompt if separate */
  systemPrompt?: string
  /** Total characters across all messages */
  totalChars: number
  /** Total estimated tokens */
  totalEstimatedTokens: number
  /** Tools/functions if included */
  toolsJson?: string
  /** Tools estimated tokens */
  toolsEstimatedTokens?: number
}

/**
 * Optimization techniques applied
 */
export interface OptimizationApplied {
  /** Optimization was enabled */
  enabled: boolean
  /** Specific techniques applied */
  techniques: Array<{
    name: string
    applied: boolean
    inputTokens?: number
    outputTokens?: number
    tokensSaved?: number
    savingsPercent?: number
    config?: Record<string, unknown>
  }>
  /** Overall estimated savings */
  estimatedTotalSaved: number
  /** Preset used if any */
  preset?: string
}

/**
 * Single request measurement record
 */
export interface TokenMeasurement {
  /** Unique measurement ID */
  id: string
  /** Timestamp ISO string */
  timestamp: string
  /** Scenario ID for grouping */
  scenarioId: string
  /** Turn number in conversation */
  turn: number

  /** Model used */
  model: string
  /** Provider (openai, anthropic, google, etc) */
  provider: string

  /** Request parameters */
  request: {
    temperature?: number
    maxTokens?: number
    topP?: number
    stopSequences?: string[]
    stream?: boolean
  }

  /** Payload BEFORE optimization */
  payloadBefore: PayloadSnapshot
  /** Payload AFTER optimization */
  payloadAfter: PayloadSnapshot

  /** Optimization details */
  optimization: OptimizationApplied

  /** Estimated tokens (client-side) */
  estimated: EstimatedTokenUsage

  /** Actual provider-reported usage */
  actual?: ProviderTokenUsage

  /** Latency measurements */
  timing: {
    /** Time to first byte (ms) */
    ttfb?: number
    /** Total request time (ms) */
    totalMs: number
    /** Optimization processing time (ms) */
    optimizationMs: number
  }

  /** Response metadata */
  response: {
    /** Response received successfully */
    success: boolean
    /** Error message if failed */
    error?: string
    /** Response length in chars */
    responseChars?: number
    /** Finish reason */
    finishReason?: string
  }

  /** Calculated deltas */
  delta: {
    /** Difference between estimated and actual input tokens */
    inputEstimateError?: number
    /** Difference between before and after optimization (estimated) */
    optimizationSavingsEstimated: number
    /** Difference between before and after optimization (actual) */
    optimizationSavingsActual?: number
    /** Whether optimization actually reduced provider tokens */
    optimizationEffective?: boolean
  }
}

/**
 * Scenario definition for test harness
 */
export interface TestScenario {
  /** Unique scenario ID */
  id: string
  /** Human-readable name */
  name: string
  /** Category */
  category:
    | 'short'
    | 'long'
    | 'adversarial'
    | 'tool-heavy'
    | 'code'
    | 'replay'
    | 'edge-case'
  /** Description */
  description: string
  /** Conversation turns */
  turns: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
    /** Tools to include in this turn */
    tools?: unknown[]
    /** Expected response constraints */
    expectedResponse?: {
      minLength?: number
      maxLength?: number
      mustContain?: string[]
      mustNotContain?: string[]
    }
  }>
  /** Quality gate requirements */
  qualityGates: {
    /** Must not truncate these elements */
    preserveElements?: string[]
    /** Must maintain factual accuracy */
    factualAccuracy?: boolean
    /** Must follow instructions */
    instructionFollowing?: boolean
  }
  /** Optimization allowed to change */
  optimizationAllowed: {
    canTruncateHistory?: boolean
    canCompressPrompt?: boolean
    canChangeToon?: boolean
    canRouteModel?: boolean
  }
}

/**
 * Measurement run configuration
 */
export interface MeasurementRunConfig {
  /** Run ID */
  runId: string
  /** Run timestamp */
  timestamp: string
  /** Mode: baseline (no optimization) or optimized */
  mode: 'baseline' | 'optimized'
  /** Optimization preset if mode=optimized */
  optimizationPreset?: 'aggressive' | 'balanced' | 'conservative' | 'realtime'
  /** Specific optimization config overrides */
  optimizationConfig?: Record<string, unknown>
  /** Scenarios to run */
  scenarioIds: string[]
  /** Number of trials per scenario */
  trialsPerScenario: number
  /** Model to use */
  model: string
  /** Provider to use */
  provider: string
  /** Random seed for reproducibility (if supported) */
  seed?: number
}

/**
 * Aggregated statistics for a measurement run
 */
export interface RunStatistics {
  /** Run configuration */
  config: MeasurementRunConfig
  /** Total measurements */
  totalMeasurements: number
  /** Successful measurements */
  successfulMeasurements: number

  /** Token statistics */
  tokens: {
    /** Mean estimated input tokens */
    meanEstimatedInput: number
    /** Median estimated input tokens */
    medianEstimatedInput: number
    /** P90 estimated input tokens */
    p90EstimatedInput: number
    /** P99 estimated input tokens */
    p99EstimatedInput: number

    /** Mean actual input tokens (if available) */
    meanActualInput?: number
    /** Median actual input tokens */
    medianActualInput?: number
    /** P90 actual input tokens */
    p90ActualInput?: number

    /** Estimation error percentage */
    estimationErrorPercent?: number
  }

  /** Optimization effectiveness */
  optimization: {
    /** Total estimated tokens saved */
    totalEstimatedSaved: number
    /** Total actual tokens saved (if available) */
    totalActualSaved?: number
    /** Percentage reduction (estimated) */
    reductionPercentEstimated: number
    /** Percentage reduction (actual) */
    reductionPercentActual?: number
    /** Whether optimization was effective */
    wasEffective?: boolean
  }

  /** Timing statistics */
  timing: {
    /** Mean latency */
    meanLatencyMs: number
    /** P90 latency */
    p90LatencyMs: number
    /** Mean optimization overhead */
    meanOptimizationMs: number
  }

  /** Errors */
  errors: Array<{
    scenarioId: string
    turn: number
    error: string
  }>
}

/**
 * Comparison between baseline and optimized runs
 */
export interface RunComparison {
  /** Baseline run statistics */
  baseline: RunStatistics
  /** Optimized run statistics */
  optimized: RunStatistics

  /** Token delta */
  tokenDelta: {
    /** Absolute reduction in mean input tokens (estimated) */
    meanInputReductionEstimated: number
    /** Absolute reduction in mean input tokens (actual) */
    meanInputReductionActual?: number
    /** Percentage reduction (estimated) */
    percentReductionEstimated: number
    /** Percentage reduction (actual) */
    percentReductionActual?: number
  }

  /** Latency impact */
  latencyImpact: {
    /** Change in mean latency */
    meanLatencyDeltaMs: number
    /** Optimization overhead */
    optimizationOverheadMs: number
  }

  /** Verdict */
  verdict: {
    /** Optimization is effective (reduces actual tokens) */
    isEffective: boolean
    /** Confidence level */
    confidence: 'high' | 'medium' | 'low'
    /** Notes */
    notes: string[]
  }
}
