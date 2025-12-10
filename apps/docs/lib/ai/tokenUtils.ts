/**
 * Token Counting Utilities
 *
 * Provides token estimation and validation for prompts.
 * Uses a character-based approximation calibrated for English text and code.
 *
 * For production accuracy, consider using tiktoken:
 * https://github.com/openai/tiktoken
 *
 * @version 1.0.0
 * @lastUpdated December 2025
 */

/**
 * Average characters per token for different content types.
 * Based on OpenAI's tokenizer behavior:
 * - English prose: ~4 chars/token
 * - Code: ~3 chars/token (more special chars, shorter words)
 * - Mixed content: ~3.5 chars/token
 */
const CHARS_PER_TOKEN = {
  prose: 4,
  code: 3,
  mixed: 3.5,
} as const

type ContentType = keyof typeof CHARS_PER_TOKEN

/**
 * Estimate token count for a string using character-based heuristics.
 *
 * This is an approximation. For exact counts, use tiktoken.
 *
 * @param text - The text to estimate tokens for
 * @param contentType - Type of content (prose, code, or mixed)
 * @returns Estimated token count
 */
export function estimateTokens(
  text: string,
  contentType: ContentType = 'mixed'
): number {
  if (!text) return 0

  const charsPerToken = CHARS_PER_TOKEN[contentType]
  const baseEstimate = Math.ceil(text.length / charsPerToken)

  // Adjust for special patterns that affect tokenization
  const adjustments = calculateTokenAdjustments(text)

  return Math.max(1, baseEstimate + adjustments)
}

/**
 * Calculate adjustments for patterns that affect tokenization.
 */
function calculateTokenAdjustments(text: string): number {
  let adjustment = 0

  // Code blocks tend to have more tokens than character count suggests
  const codeBlockCount = (text.match(/```[\s\S]*?```/g) || []).length
  adjustment += codeBlockCount * 5 // Each code block adds overhead

  // URLs are tokenized inefficiently
  const urlCount = (text.match(/https?:\/\/\S+/g) || []).length
  adjustment += urlCount * 3

  // Special XML-style tags add tokens
  const tagCount = (text.match(/<\/?[a-z_][a-z0-9_]*>/gi) || []).length
  adjustment += Math.ceil(tagCount * 0.5)

  // Markdown headers, lists, etc. add some overhead
  const markdownElements = (text.match(/^[#\-*>]/gm) || []).length
  adjustment += Math.ceil(markdownElements * 0.2)

  return adjustment
}

/**
 * Validate that a token estimate is within acceptable range of actual count.
 *
 * @param actual - The actual/estimated token count
 * @param declared - The declared token estimate
 * @param tolerance - Allowed variance (0.2 = 20%)
 * @returns Validation result with details
 */
export function validateTokenEstimate(
  actual: number,
  declared: number,
  tolerance: number = 0.25
): {
  isValid: boolean
  variance: number
  message: string
} {
  const variance = Math.abs(actual - declared) / declared
  const isValid = variance <= tolerance

  const percentVariance = Math.round(variance * 100)
  const direction = actual > declared ? 'higher' : 'lower'

  const message = isValid
    ? `Token estimate is accurate (${percentVariance}% variance)`
    : `Token estimate is ${percentVariance}% ${direction} than actual (${actual} vs ${declared})`

  return { isValid, variance, message }
}

/**
 * Analyze a prompt and return detailed token information.
 */
export function analyzePromptTokens(prompt: string): {
  estimatedTokens: number
  characterCount: number
  codeBlockCount: number
  xmlTagCount: number
  breakdown: {
    proseEstimate: number
    codeEstimate: number
    mixedEstimate: number
  }
} {
  const characterCount = prompt.length
  const codeBlockCount = (prompt.match(/```[\s\S]*?```/g) || []).length
  const xmlTagCount = (prompt.match(/<\/?[a-z_][a-z0-9_]*>/gi) || []).length

  return {
    estimatedTokens: estimateTokens(prompt, 'mixed'),
    characterCount,
    codeBlockCount,
    xmlTagCount,
    breakdown: {
      proseEstimate: estimateTokens(prompt, 'prose'),
      codeEstimate: estimateTokens(prompt, 'code'),
      mixedEstimate: estimateTokens(prompt, 'mixed'),
    },
  }
}

/**
 * Check if prompt is within a token budget.
 */
export function isWithinBudget(
  prompt: string,
  budget: number,
  contentType: ContentType = 'mixed'
): boolean {
  return estimateTokens(prompt, contentType) <= budget
}

/**
 * Suggest a token estimate for a prompt.
 * Rounds to nearest 50 for cleaner values.
 */
export function suggestTokenEstimate(prompt: string): number {
  const estimate = estimateTokens(prompt, 'mixed')
  return Math.ceil(estimate / 50) * 50
}
