/**
 * Response Output Limiter
 * 
 * Utilities for limiting AI response length and format to reduce output tokens.
 * Can save 30-50% on output tokens.
 */

export interface ResponseLimitConfig {
  /** Maximum response tokens */
  maxTokens?: number
  /** Maximum response characters */
  maxCharacters?: number
  /** Enforce structured format */
  enforceFormat?: 'json' | 'bullet-points' | 'numbered-list' | 'concise' | 'none'
  /** Stop sequences to end response early */
  stopSequences?: string[]
  /** Temperature (lower = more focused) */
  temperature?: number
  /** Brevity instruction strength (0-1) */
  brevityLevel?: number
}

export interface FormattedPrompt {
  /** Enhanced prompt with formatting instructions */
  prompt: string
  /** Original prompt */
  original: string
  /** Applied constraints */
  constraints: string[]
  /** Estimated max output tokens */
  estimatedMaxTokens: number
}

/**
 * Format instructions for different output types
 */
const FORMAT_INSTRUCTIONS = {
  json: 'Respond ONLY with valid JSON. No explanations.',
  'bullet-points': 'Respond using bullet points only. Be concise.',
  'numbered-list': 'Respond using a numbered list. Be brief.',
  concise: 'Be extremely concise. Use shortest possible phrasing.',
}

/**
 * Brevity level instructions
 */
const BREVITY_INSTRUCTIONS = {
  low: 'Be concise but complete.',
  medium: 'Be brief and to the point.',
  high: 'Be extremely brief. One sentence max per point.',
  extreme: 'Respond in 1-2 sentences total. Ultra-brief.',
}

/**
 * Create system prompt with output constraints
 */
export function createLimitedPrompt(
  userPrompt: string,
  config: ResponseLimitConfig = {}
): FormattedPrompt {
  const {
    maxTokens,
    maxCharacters,
    enforceFormat = 'none',
    stopSequences = [],
    temperature,
    brevityLevel = 0.5,
  } = config

  const constraints: string[] = []
  const instructions: string[] = []

  // Add format instructions
  if (enforceFormat !== 'none' && FORMAT_INSTRUCTIONS[enforceFormat]) {
    instructions.push(FORMAT_INSTRUCTIONS[enforceFormat])
    constraints.push(`Format: ${enforceFormat}`)
  }

  // Add length constraints
  if (maxTokens) {
    instructions.push(`Limit response to ${maxTokens} tokens maximum.`)
    constraints.push(`Max tokens: ${maxTokens}`)
  }

  if (maxCharacters) {
    instructions.push(`Keep response under ${maxCharacters} characters.`)
    constraints.push(`Max characters: ${maxCharacters}`)
  }

  // Add brevity instruction based on level
  const brevityKey = 
    brevityLevel < 0.25 ? 'low' :
    brevityLevel < 0.5 ? 'medium' :
    brevityLevel < 0.75 ? 'high' :
    'extreme'
  
  instructions.push(BREVITY_INSTRUCTIONS[brevityKey])
  constraints.push(`Brevity: ${brevityKey}`)

  // Add stop sequences info
  if (stopSequences.length > 0) {
    constraints.push(`Stop sequences: ${stopSequences.join(', ')}`)
  }

  // Construct enhanced prompt
  let enhancedPrompt = userPrompt

  if (instructions.length > 0) {
    const systemInstruction = `\n\nIMPORTANT CONSTRAINTS:\n${instructions.join(' ')}`
    enhancedPrompt = userPrompt + systemInstruction
  }

  // Estimate max output tokens
  const estimatedMaxTokens = maxTokens || 
    (maxCharacters ? Math.ceil(maxCharacters / 4) : 1000)

  return {
    prompt: enhancedPrompt,
    original: userPrompt,
    constraints,
    estimatedMaxTokens,
  }
}

/**
 * Post-process response to ensure it meets constraints
 */
export function enforceResponseLimits(
  response: string,
  config: ResponseLimitConfig = {}
): {
  response: string
  truncated: boolean
  originalLength: number
  finalLength: number
} {
  const { maxTokens, maxCharacters, stopSequences = [] } = config
  
  let processed = response
  let truncated = false
  const originalLength = response.length

  // Apply stop sequences
  for (const sequence of stopSequences) {
    const index = processed.indexOf(sequence)
    if (index !== -1) {
      processed = processed.substring(0, index)
      truncated = true
    }
  }

  // Enforce character limit
  if (maxCharacters && processed.length > maxCharacters) {
    // Try to cut at sentence boundary
    const sentences = processed.substring(0, maxCharacters).match(/[^.!?]+[.!?]+/g)
    if (sentences && sentences.length > 0) {
      processed = sentences.join('')
    } else {
      processed = processed.substring(0, maxCharacters - 3) + '...'
    }
    truncated = true
  }

  // Enforce token limit (rough approximation)
  if (maxTokens) {
    const maxChars = maxTokens * 4 // 4 chars ≈ 1 token
    if (processed.length > maxChars) {
      processed = processed.substring(0, maxChars - 3) + '...'
      truncated = true
    }
  }

  return {
    response: processed,
    truncated,
    originalLength,
    finalLength: processed.length,
  }
}

/**
 * Response limiter with tracking
 */
export class ResponseLimiter {
  private config: ResponseLimitConfig
  private stats = {
    totalResponses: 0,
    totalTruncated: 0,
    originalTotalLength: 0,
    finalTotalLength: 0,
    tokensSaved: 0,
  }

  constructor(config: ResponseLimitConfig = {}) {
    this.config = config
  }

  /**
   * Create limited prompt
   */
  createPrompt(userPrompt: string): FormattedPrompt {
    return createLimitedPrompt(userPrompt, this.config)
  }

  /**
   * Enforce limits on response
   */
  enforce(response: string): {
    response: string
    truncated: boolean
    originalLength: number
    finalLength: number
    tokensSaved: number
  } {
    const result = enforceResponseLimits(response, this.config)

    // Update stats
    this.stats.totalResponses++
    if (result.truncated) {
      this.stats.totalTruncated++
    }
    this.stats.originalTotalLength += result.originalLength
    this.stats.finalTotalLength += result.finalLength

    const tokensSaved = Math.ceil((result.originalLength - result.finalLength) / 4)
    this.stats.tokensSaved += tokensSaved

    return {
      ...result,
      tokensSaved,
    }
  }

  /**
   * Get statistics
   */
  getStats() {
    const avgOriginalLength = this.stats.totalResponses > 0
      ? this.stats.originalTotalLength / this.stats.totalResponses
      : 0

    const avgFinalLength = this.stats.totalResponses > 0
      ? this.stats.finalTotalLength / this.stats.totalResponses
      : 0

    const truncationRate = this.stats.totalResponses > 0
      ? (this.stats.totalTruncated / this.stats.totalResponses) * 100
      : 0

    const savingsPercent = this.stats.originalTotalLength > 0
      ? ((this.stats.originalTotalLength - this.stats.finalTotalLength) / this.stats.originalTotalLength) * 100
      : 0

    return {
      totalResponses: this.stats.totalResponses,
      totalTruncated: this.stats.totalTruncated,
      truncationRate,
      avgOriginalLength,
      avgFinalLength,
      tokensSaved: this.stats.tokensSaved,
      savingsPercent,
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ResponseLimitConfig>) {
    this.config = { ...this.config, ...config }
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      totalResponses: 0,
      totalTruncated: 0,
      originalTotalLength: 0,
      finalTotalLength: 0,
      tokensSaved: 0,
    }
  }
}

/**
 * Common presets
 */
export const RESPONSE_PRESETS = {
  /** Very brief responses */
  ultraBrief: {
    maxTokens: 100,
    enforceFormat: 'bullet-points' as const,
    brevityLevel: 0.9,
  },
  /** Brief but complete */
  brief: {
    maxTokens: 300,
    enforceFormat: 'concise' as const,
    brevityLevel: 0.6,
  },
  /** Standard length with some constraints */
  standard: {
    maxTokens: 500,
    brevityLevel: 0.4,
  },
  /** For code responses */
  code: {
    maxTokens: 800,
    enforceFormat: 'none' as const,
    stopSequences: ['\n\n\n', '---'],
  },
  /** For data/JSON responses */
  data: {
    maxTokens: 400,
    enforceFormat: 'json' as const,
    temperature: 0.3,
  },
}
