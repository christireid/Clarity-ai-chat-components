/**
 * Model Prompt Builder
 *
 * High-level API for building optimized, model-ready prompts.
 * Integrates recipes, memory, user input, and optimization.
 */

import type { CoreMessage } from '../../hooks/chat/use-chat-enhanced'
import { toonToMessages } from './toon'
import type type, { ToonNode } from './toon'
import { buildMessagesFromRecipe } from './recipe'
import type type, { PromptRecipe } from './recipe'
import type { ModelMetadata } from './tokenizer'
import { optimizeMessagesForBudget } from './optimizer'
import type type, { MessagePriority, OptimizationStrategy } from './optimizer'
import { getModelProfileOrDefault } from './model-profiles'
import type type, { ModelProfile } from './model-profiles'
import {
  estimateMessageTokens,
  getTokenizerForModel,
  MODEL_PRESETS,
  estimateCost,
} from './tokenizer'

/**
 * Options for building a model prompt
 */
export interface BuildModelPromptOptions {
  /** Toon DSL nodes */
  toonNodes?: ToonNode[]
  /** Prompt recipe */
  recipe?: PromptRecipe
  /** Variables for template substitution */
  variables?: Record<string, unknown>
  /** Existing messages to include */
  messages?: CoreMessage[]
  /** Memory context to include */
  memoryContext?: string | CoreMessage[]
  /** User input to include */
  userInput?: string
  /** Model metadata for token counting */
  modelMetadata?: ModelMetadata | ModelProfile | string
  /** Target token budget */
  targetTokens?: number
  /** Optimization configuration */
  optimization?: {
    /** Enable optimization */
    enabled: boolean
    /** Optimization strategy */
    strategy?: OptimizationStrategy
    /** Message priorities */
    priorities?: MessagePriority[]
    /** Summarization function */
    summarizeFn?: (messages: CoreMessage[]) => Promise<string> | string
    /** Messages to keep at end */
    keepRecent?: number
  }
}

/**
 * Result from building a model prompt
 */
export interface BuildModelPromptResult {
  /** Final messages array */
  messages: CoreMessage[]
  /** Token statistics */
  tokenStats: {
    /** Input tokens */
    inputTokens: number
    /** Remaining budget */
    remainingBudget: number
    /** Budget utilization (0-1) */
    utilization: number
  }
  /** Cost estimates (if model pricing available) */
  costEstimate?: {
    inputCost: number
    outputCost: number
    totalCost: number
  }
  /** Optimization diagnostics (if optimization was applied) */
  optimizationDiagnostics?: {
    originalTokens: number
    optimizedTokens: number
    messagesRemoved: number
    messagesSummarized: number
    strategy: string
    details: string[]
  }
}

/**
 * Build a model-ready prompt with optional optimization
 */
export async function buildModelPrompt(
  options: BuildModelPromptOptions
): Promise<BuildModelPromptResult> {
  const {
    toonNodes,
    recipe,
    variables = {},
    messages: existingMessages = [],
    memoryContext,
    userInput,
    modelMetadata,
    targetTokens,
    optimization,
  } = options

  // Resolve model metadata
  const resolvedMetadata = resolveModelMetadata(modelMetadata)
  const tokenizer = getTokenizerForModel(
    resolvedMetadata?.model ?? 'gpt-4',
    resolvedMetadata?.tokenizer
  )

  const maxTokens = resolvedMetadata?.maxTokens ?? 8192
  const effectiveTargetTokens = targetTokens ?? Math.floor(maxTokens * 0.8)

  // Build initial messages
  let messages: CoreMessage[] = []

  // Add messages from toon or recipe
  if (toonNodes) {
    messages.push(...toonToMessages(toonNodes, variables))
  } else if (recipe) {
    messages.push(...buildMessagesFromRecipe(recipe, variables))
  }

  // Add memory context
  if (memoryContext) {
    if (typeof memoryContext === 'string') {
      messages.push({
        role: 'system',
        content: `Relevant context from memory:\n${memoryContext}`,
      } as CoreMessage)
    } else {
      // Memory context as messages
      messages.push(...memoryContext)
    }
  }

  // Add existing messages
  messages.push(...existingMessages)

  // Add user input
  if (userInput) {
    messages.push({
      role: 'user',
      content: userInput,
    } as CoreMessage)
  }

  // Apply optimization if enabled
  let optimizationDiagnostics:
    | BuildModelPromptResult['optimizationDiagnostics']
    | undefined

  if (optimization?.enabled) {
    const originalTokens = estimateMessageTokens(messages, tokenizer)

    if (originalTokens > effectiveTargetTokens) {
      const optimizationResult = await optimizeMessagesForBudget(messages, {
        targetTokens: effectiveTargetTokens,
        strategy: optimization.strategy ?? 'hybrid',
        modelMetadata: resolvedMetadata,
        tokenizer,
        priorities: optimization.priorities,
        summarizeFn: optimization.summarizeFn,
        keepRecent: optimization.keepRecent ?? 2,
      })

      messages = optimizationResult.optimizedMessages
      optimizationDiagnostics = optimizationResult.diagnostics
    }
  }

  // Calculate final token stats
  const inputTokens = estimateMessageTokens(messages, tokenizer)
  const remainingBudget = Math.max(0, effectiveTargetTokens - inputTokens)
  const utilization = Math.min(1, inputTokens / effectiveTargetTokens)

  // Calculate cost estimate
  let costEstimate: BuildModelPromptResult['costEstimate'] | undefined
  if (resolvedMetadata?.inputPricePer1K) {
    // Estimate output as 30% of input for cost calculation
    const estimatedOutputTokens = Math.floor(inputTokens * 0.3)
    costEstimate = estimateCost(
      inputTokens,
      estimatedOutputTokens,
      resolvedMetadata
    )
  }

  return {
    messages,
    tokenStats: {
      inputTokens,
      remainingBudget,
      utilization,
    },
    costEstimate,
    optimizationDiagnostics,
  }
}

/**
 * Resolve model metadata from various input types
 */
function resolveModelMetadata(
  input?: ModelMetadata | ModelProfile | string
): ModelMetadata | undefined {
  if (!input) return undefined

  if (typeof input === 'string') {
    // Try to get from presets
    if (MODEL_PRESETS[input]) {
      return MODEL_PRESETS[input]
    }

    // Try to get from model profiles
    const profile = getModelProfileOrDefault(input)
    return {
      model: profile.name,
      maxTokens: profile.maxTokens,
      maxOutputTokens: profile.maxOutputTokens,
      tokenizer: profile.tokenizer,
      inputPricePer1K: profile.costPer1K,
      outputPricePer1K: profile.outputCostPer1K,
    }
  }

  // Check if it's a ModelProfile
  if ('displayName' in input && 'family' in input) {
    const profile = input as ModelProfile
    return {
      model: profile.name,
      maxTokens: profile.maxTokens,
      maxOutputTokens: profile.maxOutputTokens,
      tokenizer: profile.tokenizer,
      inputPricePer1K: profile.costPer1K,
      outputPricePer1K: profile.outputCostPer1K,
    }
  }

  // Already ModelMetadata
  return input as ModelMetadata
}

/**
 * Simple prompt builder for quick usage
 */
export function buildPrompt(
  systemPrompt: string,
  userMessage: string,
  options?: {
    memoryContext?: string
    maxTokens?: number
    model?: string
  }
): CoreMessage[] {
  const messages: CoreMessage[] = []

  // Add system prompt
  if (systemPrompt) {
    messages.push({
      role: 'system',
      content: systemPrompt,
    } as CoreMessage)
  }

  // Add memory context
  if (options?.memoryContext) {
    messages.push({
      role: 'system',
      content: `Context:\n${options.memoryContext}`,
    } as CoreMessage)
  }

  // Add user message
  if (userMessage) {
    messages.push({
      role: 'user',
      content: userMessage,
    } as CoreMessage)
  }

  return messages
}

/**
 * Append a message to an existing conversation
 */
export function appendToConversation(
  messages: CoreMessage[],
  newMessage: CoreMessage | string,
  role: 'user' | 'assistant' = 'user'
): CoreMessage[] {
  const message: CoreMessage =
    typeof newMessage === 'string'
      ? ({ role, content: newMessage } as CoreMessage)
      : newMessage

  return [...messages, message]
}

/**
 * Create a conversation from alternating messages
 */
export function createConversation(
  systemPrompt: string,
  ...exchanges: Array<{ user: string; assistant?: string }>
): CoreMessage[] {
  const messages: CoreMessage[] = [
    { role: 'system', content: systemPrompt } as CoreMessage,
  ]

  for (const exchange of exchanges) {
    messages.push({ role: 'user', content: exchange.user } as CoreMessage)
    if (exchange.assistant) {
      messages.push({
        role: 'assistant',
        content: exchange.assistant,
      } as CoreMessage)
    }
  }

  return messages
}
