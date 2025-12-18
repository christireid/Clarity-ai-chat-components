/**
 * Token Estimation Utilities
 *
 * Provides token counting and estimation for different models.
 * Uses approximate tokenization by default, with pluggable tokenizers.
 */

import type { CoreMessage } from '../../hooks/chat/use-chat-enhanced'
import type { ToonNode } from './toon'

/**
 * Tokenizer interface for pluggable tokenization
 */
export interface Tokenizer {
  /** Estimate tokens for text */
  estimate(text: string): number
  /** Name of the tokenizer */
  name: string
}

/**
 * Model metadata with token limits and pricing
 */
export interface ModelMetadata {
  /** Model identifier */
  model: string
  /** Maximum context tokens */
  maxTokens: number
  /** Maximum output tokens */
  maxOutputTokens?: number
  /** Tokenizer to use */
  tokenizer?: Tokenizer
  /** Input price per 1K tokens */
  inputPricePer1K?: number
  /** Output price per 1K tokens */
  outputPricePer1K?: number
}

/**
 * Approximate tokenizer using character-to-token ratio
 * Uses ~4 characters per token as a reasonable default for English text
 */
export class ApproximateTokenizer implements Tokenizer {
  name = 'approximate'
  private charsPerToken: number

  constructor(charsPerToken: number = 4) {
    this.charsPerToken = charsPerToken
  }

  estimate(text: string): number {
    if (!text) return 0
    // Account for special tokens and whitespace
    const adjusted = text.replace(/\s+/g, ' ').trim()
    return Math.ceil(adjusted.length / this.charsPerToken)
  }
}

/**
 * Claude-optimized tokenizer (slightly different ratio)
 */
export class ClaudeTokenizer implements Tokenizer {
  name = 'claude'

  estimate(text: string): number {
    if (!text) return 0
    // Claude uses slightly fewer tokens per character on average
    const adjusted = text.replace(/\s+/g, ' ').trim()
    return Math.ceil(adjusted.length / 3.8)
  }
}

/**
 * Default tokenizer instance
 */
const defaultTokenizer = new ApproximateTokenizer(4)
const claudeTokenizer = new ClaudeTokenizer()

/**
 * Get tokenizer for a specific model
 */
export function getTokenizerForModel(
  modelName: string,
  customTokenizer?: Tokenizer
): Tokenizer {
  if (customTokenizer) return customTokenizer

  // Use Claude tokenizer for Claude models
  if (modelName.toLowerCase().includes('claude')) {
    return claudeTokenizer
  }

  return defaultTokenizer
}

/**
 * Model presets with common configurations
 */
export const MODEL_PRESETS: Record<string, ModelMetadata> = {
  // OpenAI GPT-4 family
  'gpt-4': {
    model: 'gpt-4',
    maxTokens: 8192,
    maxOutputTokens: 4096,
    inputPricePer1K: 0.03,
    outputPricePer1K: 0.06,
  },
  'gpt-4-turbo': {
    model: 'gpt-4-turbo',
    maxTokens: 128000,
    maxOutputTokens: 4096,
    inputPricePer1K: 0.01,
    outputPricePer1K: 0.03,
  },
  'gpt-4o': {
    model: 'gpt-4o',
    maxTokens: 128000,
    maxOutputTokens: 16384,
    inputPricePer1K: 0.005,
    outputPricePer1K: 0.015,
  },
  'gpt-4o-mini': {
    model: 'gpt-4o-mini',
    maxTokens: 128000,
    maxOutputTokens: 16384,
    inputPricePer1K: 0.00015,
    outputPricePer1K: 0.0006,
  },
  // OpenAI GPT-3.5 family
  'gpt-3.5-turbo': {
    model: 'gpt-3.5-turbo',
    maxTokens: 16385,
    maxOutputTokens: 4096,
    inputPricePer1K: 0.0005,
    outputPricePer1K: 0.0015,
  },
  // Anthropic Claude family
  'claude-3-opus': {
    model: 'claude-3-opus-20240229',
    maxTokens: 200000,
    maxOutputTokens: 4096,
    inputPricePer1K: 0.015,
    outputPricePer1K: 0.075,
    tokenizer: claudeTokenizer,
  },
  'claude-3-sonnet': {
    model: 'claude-3-sonnet-20240229',
    maxTokens: 200000,
    maxOutputTokens: 4096,
    inputPricePer1K: 0.003,
    outputPricePer1K: 0.015,
    tokenizer: claudeTokenizer,
  },
  'claude-3-haiku': {
    model: 'claude-3-haiku-20240307',
    maxTokens: 200000,
    maxOutputTokens: 4096,
    inputPricePer1K: 0.00025,
    outputPricePer1K: 0.00125,
    tokenizer: claudeTokenizer,
  },
  'claude-3.5-sonnet': {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 200000,
    maxOutputTokens: 8192,
    inputPricePer1K: 0.003,
    outputPricePer1K: 0.015,
    tokenizer: claudeTokenizer,
  },
  // Google Gemini family
  'gemini-1.5-pro': {
    model: 'gemini-1.5-pro',
    maxTokens: 1000000,
    maxOutputTokens: 8192,
    inputPricePer1K: 0.00125,
    outputPricePer1K: 0.005,
  },
  'gemini-1.5-flash': {
    model: 'gemini-1.5-flash',
    maxTokens: 1000000,
    maxOutputTokens: 8192,
    inputPricePer1K: 0.000075,
    outputPricePer1K: 0.0003,
  },
}

/**
 * Estimate tokens for a single message
 */
export function estimateSingleMessageTokens(
  message: CoreMessage,
  tokenizer: Tokenizer = defaultTokenizer
): number {
  // Role token overhead (~4 tokens per message for formatting)
  const overhead = 4

  let contentTokens = 0
  if (typeof message.content === 'string') {
    contentTokens = tokenizer.estimate(message.content)
  } else if (Array.isArray(message.content)) {
    // Handle multi-part content
    for (const part of message.content) {
      if (part.type === 'text') {
        contentTokens += tokenizer.estimate(part.text)
      } else if (part.type === 'image') {
        // Images are typically ~85 tokens for low-res, ~170 for high-res
        contentTokens += 170
      }
    }
  }

  return overhead + contentTokens
}

/**
 * Estimate tokens for an array of messages
 */
export function estimateMessageTokens(
  messages: CoreMessage[],
  tokenizer: Tokenizer = defaultTokenizer
): number {
  // Base overhead for message array (~3 tokens)
  let total = 3

  for (const message of messages) {
    total += estimateSingleMessageTokens(message, tokenizer)
  }

  return total
}

/**
 * Estimate tokens for toon nodes or raw text
 */
export function estimatePromptTokens(
  input: ToonNode[] | ToonNode | string,
  variables: Record<string, unknown> = {},
  tokenizer: Tokenizer = defaultTokenizer
): number {
  // Import renderToon dynamically to avoid circular dependency
  // For now, handle string input directly
  if (typeof input === 'string') {
    // Replace variables in the string
    let text = input
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`
      text = text.replace(new RegExp(placeholder, 'g'), String(value ?? ''))
    }
    return tokenizer.estimate(text)
  }

  // For ToonNode, convert to string first
  const nodes = Array.isArray(input) ? input : [input]
  let totalTokens = 0

  for (const node of nodes) {
    totalTokens += estimateToonNodeTokens(node, variables, tokenizer)
  }

  return totalTokens
}

/**
 * Estimate tokens for a single toon node
 */
function estimateToonNodeTokens(
  node: ToonNode,
  variables: Record<string, unknown>,
  tokenizer: Tokenizer
): number {
  switch (node.type) {
    case 'text':
      return tokenizer.estimate(node.content)

    case 'variable': {
      const value = variables[node.name]
      if (value !== undefined && value !== null) {
        return tokenizer.estimate(String(value))
      }
      return node.defaultValue ? tokenizer.estimate(node.defaultValue) : 0
    }

    case 'section': {
      let total = 0
      if (node.title) total += tokenizer.estimate(node.title) + 2 // Title + newlines
      for (const child of node.children) {
        total += estimateToonNodeTokens(child, variables, tokenizer)
      }
      return total
    }

    case 'role': {
      let total = 4 // Role overhead
      for (const child of node.children) {
        total += estimateToonNodeTokens(child, variables, tokenizer)
      }
      return total
    }

    case 'sequence': {
      let total = 0
      for (const child of node.children) {
        total += estimateToonNodeTokens(child, variables, tokenizer)
      }
      return total
    }

    case 'conditional': {
      const conditionMet = Boolean(variables[node.condition])
      const branch = conditionMet ? node.then : node.else
      if (branch) {
        let total = 0
        for (const child of branch) {
          total += estimateToonNodeTokens(child, variables, tokenizer)
        }
        return total
      }
      return 0
    }

    default:
      return 0
  }
}

/**
 * Estimate cost for a given number of tokens
 */
export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  modelMetadata: ModelMetadata
): { inputCost: number; outputCost: number; totalCost: number } {
  const inputCost = modelMetadata.inputPricePer1K
    ? (inputTokens / 1000) * modelMetadata.inputPricePer1K
    : 0

  const outputCost = modelMetadata.outputPricePer1K
    ? (outputTokens / 1000) * modelMetadata.outputPricePer1K
    : 0

  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
  }
}
