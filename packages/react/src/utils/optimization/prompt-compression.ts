import { logger } from '@clarity-chat/utils/logger';
/**
 * Prompt Compression Utilities
 *
 * Utilities for optimizing prompts to reduce token usage while maintaining meaning.
 * Can save 20-35% on input tokens.
 */

import { estimateTokens } from './tokenization/estimator'

export interface CompressionOptions {
  /** Remove redundant whitespace */
  trimWhitespace?: boolean
  /** Remove common filler words */
  removeFillers?: boolean
  /** Use abbreviations for common terms */
  useAbbreviations?: boolean
  /** Remove punctuation where safe */
  reducePunctuation?: boolean
  /** Maximum length in characters (0 = no limit) */
  maxLength?: number
  /** Preserve code blocks */
  preserveCode?: boolean
  /** Preserve markdown formatting */
  preserveMarkdown?: boolean
}

export interface CompressionResult {
  /** Compressed text */
  compressed: string
  /** Original text */
  original: string
  /** Original length */
  originalLength: number
  /** Compressed length */
  compressedLength: number
  /** Savings percentage */
  savingsPercent: number
  /** Estimated original tokens */
  originalTokens: number
  /** Estimated compressed tokens */
  compressedTokens: number
  /** Token savings */
  tokenSavings: number
}

/**
 * Common filler words to remove
 */
const FILLER_WORDS = new Set([
  'actually', 'basically', 'really', 'very', 'quite', 'just',
  'literally', 'definitely', 'certainly', 'absolutely',
  'honestly', 'frankly', 'truly', 'indeed', 'surely',
  'perhaps', 'maybe', 'possibly', 'probably',
  'kind of', 'sort of', 'a bit', 'a little',
])

/**
 * Common abbreviations to use
 */
const ABBREVIATIONS: Record<string, string> = {
  'and': '&',
  'with': 'w/',
  'without': 'w/o',
  'between': 'btwn',
  'because': 'bc',
  'before': 'b4',
  'please': 'pls',
  'thanks': 'thx',
  'example': 'ex',
  'examples': 'exs',
  'information': 'info',
  'application': 'app',
  'applications': 'apps',
  'development': 'dev',
  'production': 'prod',
  'configuration': 'config',
  'environment': 'env',
  'repository': 'repo',
  'documentation': 'docs',
  'implementation': 'impl',
  'function': 'fn',
  'functions': 'fns',
  'database': 'db',
  'databases': 'dbs',
  'administrator': 'admin',
  'administrators': 'admins',
  'organization': 'org',
  'organizations': 'orgs',
  'message': 'msg',
  'messages': 'msgs',
  'parameter': 'param',
  'parameters': 'params',
  'argument': 'arg',
  'arguments': 'args',
}

// Token estimation imported from centralized module: estimateTokens

/**
 * Preserve code blocks and markdown
 */
function extractPreservedSections(text: string, preserveCode: boolean, preserveMarkdown: boolean): {
  text: string
  preserved: Map<string, string>
} {
  const preserved = new Map<string, string>()
  let result = text
  let counter = 0

  if (preserveCode) {
    // Extract code blocks (```...```)
    result = result.replace(/```[\s\S]*?```/g, (match) => {
      const placeholder = `__CODE_BLOCK_${counter++}__`
      preserved.set(placeholder, match)
      return placeholder
    })

    // Extract inline code (`...`)
    result = result.replace(/`[^`]+`/g, (match) => {
      const placeholder = `__INLINE_CODE_${counter++}__`
      preserved.set(placeholder, match)
      return placeholder
    })
  }

  if (preserveMarkdown) {
    // Extract markdown links [text](url)
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match) => {
      const placeholder = `__LINK_${counter++}__`
      preserved.set(placeholder, match)
      return placeholder
    })
  }

  return { text: result, preserved }
}

/**
 * Restore preserved sections
 */
function restorePreservedSections(text: string, preserved: Map<string, string>): string {
  let result = text
  for (const [placeholder, original] of preserved.entries()) {
    result = result.replace(placeholder, original)
  }
  return result
}

/**
 * Remove common filler words
 */
function removeFillerWords(text: string): string {
  const words = text.split(/\s+/)
  const filtered = words.filter(word => {
    const lower = word.toLowerCase().replace(/[.,!?;:]$/, '')
    return !FILLER_WORDS.has(lower)
  })
  return filtered.join(' ')
}

/**
 * Apply common abbreviations
 */
function applyAbbreviations(text: string): string {
  let result = text
  for (const [full, abbr] of Object.entries(ABBREVIATIONS)) {
    // Use word boundaries to avoid partial replacements
    const regex = new RegExp(`\\b${full}\\b`, 'gi')
    result = result.replace(regex, abbr)
  }
  return result
}

/**
 * Reduce excessive punctuation
 */
function reducePunctuation(text: string): string {
  return text
    // Multiple spaces to single space
    .replace(/\s{2,}/g, ' ')
    // Multiple punctuation to single
    .replace(/([!?.]){2,}/g, '$1')
    // Remove trailing commas before punctuation
    .replace(/,\s*([.!?])/g, '$1')
    // Remove space before punctuation
    .replace(/\s+([.,!?;:])/g, '$1')
}

/**
 * Trim to maximum length intelligently (at sentence boundaries)
 */
function trimToMaxLength(text: string, maxLength: number): string {
  if (maxLength <= 0 || text.length <= maxLength) {
    return text
  }

  // Try to cut at sentence boundary
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  let result = ''
  
  for (const sentence of sentences) {
    if ((result + sentence).length <= maxLength) {
      result += sentence
    } else {
      break
    }
  }

  // If no sentences fit, just truncate
  if (result.length === 0) {
    result = text.substring(0, maxLength - 3) + '...'
  }

  return result.trim()
}

/**
 * Reduce excessive punctuation
 */
function reducePunctuationHelper(text: string): string {
  return text
    .replace(/[!]+/g, '!') // Multiple exclamation marks to one
    .replace(/[?]+/g, '?') // Multiple question marks to one
    .replace(/\.{2,}/g, '...') // Multiple dots to ellipsis
    .replace(/,\s*,+/g, ',') // Multiple commas to one
}

/**
 * Compress prompt with configurable strategies
 * 
 * @example
 * ```tsx
 * const result = compressPrompt(
 *   "Please help me understand how I can actually improve my code quality.",
 *   {
 *     removeFillers: true,
 *     useAbbreviations: true,
 *     trimWhitespace: true
 *   }
 * )
 * 
 * logger.debug(result.compressed) // "Pls help me understand how I can improve my code quality."
 * logger.debug(result.savingsPercent) // ~15%
 * ```
 */
export function compressPrompt(
  text: string,
  options: CompressionOptions = {}
): CompressionResult {
  const {
    trimWhitespace = true,
    removeFillers = false,
    useAbbreviations = false,
    reducePunctuation = false,
    maxLength = 0,
    preserveCode = true,
    preserveMarkdown = true,
  } = options

  const original = text
  const originalLength = text.length
  const originalTokens = estimateTokens(text)

  // Extract preserved sections
  const { text: workingText, preserved } = extractPreservedSections(
    text,
    preserveCode,
    preserveMarkdown
  )

  let compressed = workingText

  // Apply compression strategies in order
  if (trimWhitespace) {
    compressed = compressed.trim().replace(/\s+/g, ' ')
  }

  if (removeFillers) {
    compressed = removeFillerWords(compressed)
  }

  if (useAbbreviations) {
    compressed = applyAbbreviations(compressed)
  }

  if (reducePunctuation) {
    compressed = reducePunctuationHelper(compressed)
  }

  if (maxLength > 0) {
    compressed = trimToMaxLength(compressed, maxLength)
  }

  // Restore preserved sections
  compressed = restorePreservedSections(compressed, preserved)

  // Final cleanup
  compressed = compressed.trim()

  const compressedLength = compressed.length
  const compressedTokens = estimateTokens(compressed)
  const savingsPercent = ((originalLength - compressedLength) / originalLength) * 100
  const tokenSavings = originalTokens - compressedTokens

  return {
    compressed,
    original,
    originalLength,
    compressedLength,
    savingsPercent: Math.max(0, savingsPercent),
    originalTokens,
    compressedTokens,
    tokenSavings: Math.max(0, tokenSavings),
  }
}

/**
 * Aggressive compression preset for maximum savings
 */
export function aggressiveCompress(text: string, maxLength = 0): CompressionResult {
  return compressPrompt(text, {
    trimWhitespace: true,
    removeFillers: true,
    useAbbreviations: true,
    reducePunctuation: true,
    maxLength,
    preserveCode: true,
    preserveMarkdown: true,
  })
}

/**
 * Conservative compression preset for safety
 */
export function conservativeCompress(text: string): CompressionResult {
  return compressPrompt(text, {
    trimWhitespace: true,
    removeFillers: false,
    useAbbreviations: false,
    reducePunctuation: true,
    preserveCode: true,
    preserveMarkdown: true,
  })
}

/**
 * Balanced compression preset (recommended)
 */
export function balancedCompress(text: string): CompressionResult {
  return compressPrompt(text, {
    trimWhitespace: true,
    removeFillers: true,
    useAbbreviations: false,
    reducePunctuation: true,
    preserveCode: true,
    preserveMarkdown: true,
  })
}

/**
 * Compress conversation history
 */
export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export function compressConversation(
  messages: ConversationMessage[],
  options: CompressionOptions = {}
): {
  compressed: ConversationMessage[]
  originalTokens: number
  compressedTokens: number
  savingsPercent: number
} {
  let originalTokens = 0
  let compressedTokens = 0

  const compressed = messages.map((msg) => {
    const result = compressPrompt(msg.content, options)
    originalTokens += result.originalTokens
    compressedTokens += result.compressedTokens
    
    return {
      ...msg,
      content: result.compressed,
    }
  })

  const savingsPercent = originalTokens > 0
    ? ((originalTokens - compressedTokens) / originalTokens) * 100
    : 0

  return {
    compressed,
    originalTokens,
    compressedTokens,
    savingsPercent: Math.max(0, savingsPercent),
  }
}
