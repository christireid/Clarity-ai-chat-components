/**
 * AI Provider Streaming Utilities
 *
 * Handles streaming responses from multiple LLM providers using Server-Sent Events (SSE).
 * Supports OpenAI, Anthropic Claude, Google Gemini, and demo mode.
 *
 * **Features:**
 * - Multi-provider support (OpenAI, Anthropic, Google)
 * - SSE stream creation and parsing
 * - Tool calling support (Anthropic)
 * - Smart model routing
 * - Rate limiting
 * - Request validation
 * - Error handling with retry logic
 * - Demo mode fallback
 *
 * @module ai-infrastructure/streaming/provider-streaming
 */

import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

export interface StreamChunk {
  type:
    | 'text'
    | 'error'
    | 'done'
    | 'sources'
    | 'thinking'
    | 'tool_use'
    | 'tool_result'
  content?: string
  data?: unknown
  tool_name?: string
  tool_use_id?: string
  tool_input?: unknown
  tool_result?: unknown
}

/**
 * Create a ReadableStream for Server-Sent Events
 */
export function createSSEStream(
  generator: AsyncGenerator<StreamChunk>
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of generator) {
          const data = `data: ${JSON.stringify(chunk)}\n\n`
          controller.enqueue(encoder.encode(data))
        }

        // Send done signal
        const doneChunk = `data: ${JSON.stringify({ type: 'done' })}\n\n`
        controller.enqueue(encoder.encode(doneChunk))

        controller.close()
      } catch (error) {
        console.error('Streaming error:', error)

        const errorChunk = `data: ${JSON.stringify({
          type: 'error',
          content: error instanceof Error ? error.message : 'Unknown error',
        })}\n\n`

        controller.enqueue(encoder.encode(errorChunk))
        controller.close()
      }
    },
  })
}

/**
 * Stream from OpenAI API
 */
export async function* streamFromOpenAI(
  messages: { role: string; content: string }[],
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
  } = {}
): AsyncGenerator<StreamChunk> {
  const {
    model = 'gpt-4-turbo-preview',
    temperature = 0.7,
    maxTokens = 2000,
  } = options

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set')
  }

  const openai = new OpenAI({ apiKey })

  try {
    const stream = await openai.chat.completions.create({
      model,
      messages:
        messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      temperature,
      max_tokens: maxTokens,
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content

      if (content) {
        yield {
          type: 'text',
          content,
        }
      }

      // Check for finish reason
      const finishReason = chunk.choices[0]?.finish_reason
      if (finishReason === 'length') {
        yield {
          type: 'text',
          content: '\n\n[Response truncated due to length]',
        }
      }
    }
  } catch (error) {
    console.error('OpenAI streaming error:', error)
    throw error
  }
}

/**
 * Stream from Anthropic Claude API
 */
export async function* streamFromClaude(
  messages: { role: string; content: string }[],
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
  } = {}
): AsyncGenerator<StreamChunk> {
  const {
    model = 'claude-3-5-sonnet-20241022',
    temperature = 0.7,
    maxTokens = 2000,
  } = options

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }

  const anthropic = new Anthropic({ apiKey })

  try {
    // Extract system message if present
    const systemMessage = messages.find((m) => m.role === 'system')?.content
    const conversationMessages = messages.filter((m) => m.role !== 'system')

    const stream = await anthropic.messages.stream({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemMessage,
      messages: conversationMessages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })) as Anthropic.MessageParam[],
    })

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        yield {
          type: 'text',
          content: chunk.delta.text,
        }
      }
    }
  } catch (error) {
    console.error('Claude streaming error:', error)
    throw error
  }
}

/**
 * Stream from Anthropic Claude API with tool support
 *
 * This function enables AI assistants to use tools for enhanced responses:
 * - generate_diagram: Create Mermaid diagrams
 * - lookup_component: Look up component documentation
 * - lookup_hook: Look up hook documentation
 * - generate_code_example: Generate code examples
 * - calculate_bundle_impact: Calculate bundle size impact
 */
export async function* streamFromClaudeWithTools(
  messages: { role: string; content: string }[],
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
    tools?: Anthropic.Tool[]
    executeToolCall?: (toolName: string, toolInput: unknown) => Promise<unknown>
  } = {}
): AsyncGenerator<StreamChunk> {
  const {
    model = 'claude-3-5-sonnet-20241022',
    temperature = 0.7,
    maxTokens = 4000,
    tools = [],
    executeToolCall,
  } = options

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }

  const anthropic = new Anthropic({ apiKey })

  if (!executeToolCall) {
    throw new Error('executeToolCall function is required for tool support')
  }

  try {
    // Extract system message if present
    const systemMessage = messages.find((m) => m.role === 'system')?.content
    const conversationMessages = messages.filter((m) => m.role !== 'system')

    // Create the initial request with tools
    let response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemMessage,
      tools: tools.length > 0 ? tools : undefined,
      messages: conversationMessages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })) as Anthropic.MessageParam[],
    })

    // Process response content blocks
    const processContentBlocks = async function* (
      contentBlocks: Anthropic.ContentBlock[]
    ): AsyncGenerator<StreamChunk> {
      for (const block of contentBlocks) {
        if (block.type === 'text') {
          // Stream text in chunks for natural UX
          const words = block.text.split(' ')
          let buffer = ''

          for (let i = 0; i < words.length; i++) {
            buffer += words[i] + (i < words.length - 1 ? ' ' : '')

            // Yield chunks of ~5-10 words
            if (buffer.split(' ').length >= 7 || i === words.length - 1) {
              yield {
                type: 'text',
                content: buffer,
              }
              buffer = ''

              // Small delay for natural streaming feel
              await new Promise((resolve) => setTimeout(resolve, 15))
            }
          }
        } else if (block.type === 'tool_use') {
          // Emit tool use event for UI to show progress
          yield {
            type: 'tool_use',
            tool_name: block.name,
            tool_use_id: block.id,
            tool_input: block.input,
          }

          // Execute the tool
          try {
            const toolResult = await executeToolCall(block.name, block.input)

            // Emit tool result for UI to render
            yield {
              type: 'tool_result',
              tool_name: block.name,
              tool_use_id: block.id,
              tool_result: toolResult,
            }
          } catch (error) {
            console.error(`Tool execution error for ${block.name}:`, error)
            yield {
              type: 'tool_result',
              tool_name: block.name,
              tool_use_id: block.id,
              tool_result: {
                success: false,
                error:
                  error instanceof Error
                    ? error.message
                    : 'Tool execution failed',
              },
            }
          }
        }
      }
    }

    // Process initial response
    yield* processContentBlocks(response.content)

    // Handle tool use loop - continue until model is done
    let loopCount = 0
    const maxLoops = 5 // Prevent infinite loops

    while (response.stop_reason === 'tool_use' && loopCount < maxLoops) {
      loopCount++

      // Collect tool results for the continuation
      const toolResults: Anthropic.ToolResultBlockParam[] = []

      for (const block of response.content) {
        if (block.type === 'tool_use') {
          try {
            const result = await executeToolCall(block.name, block.input)
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: JSON.stringify(result),
            })
          } catch (error) {
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
              }),
              is_error: true,
            })
          }
        }
      }

      // Continue the conversation with tool results
      const continuationMessages: Anthropic.MessageParam[] = [
        ...conversationMessages.map((m) => ({
          role: (m.role === 'user' ? 'user' : 'assistant') as
            | 'user'
            | 'assistant',
          content: m.content,
        })),
        {
          role: 'assistant',
          content: response.content,
        },
        {
          role: 'user',
          content: toolResults,
        },
      ]

      response = await anthropic.messages.create({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemMessage,
        tools: tools.length > 0 ? tools : undefined,
        messages: continuationMessages,
      })

      // Process continuation response
      yield* processContentBlocks(response.content)
    }

    // Emit done
    yield { type: 'done' }
  } catch (error) {
    console.error('Claude with tools streaming error:', error)
    throw error
  }
}

/**
 * Stream from Google Gemini API
 */
export async function* streamFromGemini(
  messages: { role: string; content: string }[],
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
  } = {}
): AsyncGenerator<StreamChunk> {
  const { model = 'gemini-1.5-flash', systemPrompt } = options

  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const geminiModel = genAI.getGenerativeModel({ model })

  try {
    // Build history from messages (excluding the last user message)
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: m.content }],
    }))

    // Add system prompt as initial exchange if provided
    if (systemPrompt) {
      history.unshift(
        {
          role: 'user' as const,
          parts: [{ text: `System instructions: ${systemPrompt}` }],
        },
        {
          role: 'model' as const,
          parts: [{ text: 'Understood. I will follow these instructions.' }],
        }
      )
    }

    const chat = geminiModel.startChat({ history })
    const lastMessage = messages[messages.length - 1].content
    const result = await chat.sendMessageStream(lastMessage)

    for await (const chunk of result.stream) {
      const text = chunk.text()
      if (text) {
        yield {
          type: 'text',
          content: text,
        }
      }
    }
  } catch (error) {
    console.error('Gemini streaming error:', error)
    throw error
  }
}

/**
 * Demo/fallback streaming function when no API keys are configured
 */
export async function* streamFromDemo(
  messages: { role: string; content: string }[]
): AsyncGenerator<StreamChunk> {
  const lastMessage = messages[messages.length - 1]
  const response =
    `Demo mode active - no API keys configured. This is a simulated response.\n\n` +
    `Your message: "${lastMessage.content}"\n\n` +
    `To enable real AI responses, configure an API key in your .env file.`

  // Stream the response word by word
  const words = response.split(' ')
  let buffer = ''

  for (let i = 0; i < words.length; i++) {
    buffer += words[i] + (i < words.length - 1 ? ' ' : '')

    // Yield chunks of ~5-10 words for natural streaming
    if (buffer.split(' ').length >= 7 || i === words.length - 1) {
      yield {
        type: 'text',
        content: buffer,
      }
      buffer = ''

      // Small delay to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 30))
    }
  }
}

/**
 * Query complexity classification for smart model routing
 *
 * NOTE: This is a lightweight, server-side complexity classifier designed for
 * provider dispatch (choosing which streaming function + model to call based
 * on environment-configured API keys). It classifies into 3 levels:
 * simple / moderate / complex.
 *
 * A more sophisticated implementation exists in @clarity-chat/token-optimization:
 *   - `ComplexityAnalyzer` class (routing/complexity-analyzer.ts) provides
 *     weighted multi-factor analysis with 4 levels (Low/Medium/High/Critical),
 *     numeric scores (0-1), configurable weights, and confidence values.
 *   - `ModelRouter` class (routing/model-router.ts) provides cost-optimized
 *     model selection with per-model pricing, capability filtering, multiple
 *     strategies (CostOptimized/Balanced/QualityFirst), and savings tracking.
 *
 * The two implementations serve different layers:
 *   - THIS (ai-infrastructure): Server-side provider dispatch. Decides which
 *     streaming function to invoke and which model string to pass, based on
 *     env vars (OPENAI_API_KEY, ANTHROPIC_API_KEY, etc.).
 *   - token-optimization: Client/library-level cost optimization. Decides which
 *     model ID to request based on pricing data, capability requirements, and
 *     detailed complexity scoring. Does NOT handle streaming or API keys.
 *
 * If consolidation is desired in the future, this function could delegate to
 * token-optimization's ComplexityAnalyzer for the classification step, while
 * keeping the provider dispatch logic here. That would require adding
 * @clarity-chat/token-optimization as a dependency of this package.
 */
export type QueryComplexity = 'simple' | 'moderate' | 'complex'

export interface QueryClassification {
  complexity: QueryComplexity
  reason: string
  suggestedModel: string
  estimatedTokens: number
}

/**
 * Classify query complexity to determine optimal model routing
 *
 * @see {@link @clarity-chat/token-optimization#ComplexityAnalyzer} for a more
 * detailed complexity analysis with weighted factors and numeric scoring.
 */
export function classifyQueryComplexity(
  query: string,
  conversationLength: number = 0
): QueryClassification {
  const wordCount = query.split(/\s+/).length
  const hasCode = /```|`[^`]+`|function\s+\w+|const\s+\w+|class\s+\w+/.test(
    query
  )

  // Patterns indicating complex queries
  const complexPatterns = [
    /\b(implement|build|create|design|architect|refactor)\b.*\b(system|application|service|feature)\b/i,
    /\b(compare|analyze|evaluate|explain in detail|step by step)\b/i,
    /\b(debug|troubleshoot|fix|solve).*\b(error|issue|bug|problem)\b/i,
    /\b(how|why)\b.*\b(work|works|working)\b.*\b(under the hood|internally|behind)\b/i,
    /\b(best practices?|patterns?|architecture)\b/i,
    /\b(multiple|several|many|all)\b.*\b(components?|hooks?|features?)\b/i,
  ]

  // Patterns indicating simple queries
  const simplePatterns = [
    /^(what is|what's|what are)\s+\w+(\s+\w+)?\??$/i,
    /^(how|where)\s+(do|can|to)\s+\w+\??$/i,
    /^(list|show|get)\s+\w+$/i,
    /\b(version|install|import)\b/i,
    /^(yes|no|ok|thanks?|thank you)\b/i,
  ]

  // Check for simple patterns first
  for (const pattern of simplePatterns) {
    if (pattern.test(query) && wordCount < 15 && !hasCode) {
      return {
        complexity: 'simple',
        reason: 'Short, direct question',
        suggestedModel: 'gpt-3.5-turbo',
        estimatedTokens: Math.ceil(query.length / 4) + 500,
      }
    }
  }

  // Check for complex patterns
  for (const pattern of complexPatterns) {
    if (pattern.test(query)) {
      return {
        complexity: 'complex',
        reason: 'Technical deep-dive or multi-step task',
        suggestedModel: 'gpt-4-turbo-preview',
        estimatedTokens: Math.ceil(query.length / 4) + 2000,
      }
    }
  }

  // Factor in conversation length and code presence
  const isComplex =
    wordCount > 50 ||
    hasCode ||
    conversationLength > 10 ||
    (query.match(/\?/g) || []).length > 2

  const isModerate =
    wordCount > 20 ||
    conversationLength > 5 ||
    (query.match(/\?/g) || []).length > 1

  if (isComplex) {
    return {
      complexity: 'complex',
      reason: 'Long query, code, or extended conversation',
      suggestedModel: 'gpt-4-turbo-preview',
      estimatedTokens: Math.ceil(query.length / 4) + 2000,
    }
  }

  if (isModerate) {
    return {
      complexity: 'moderate',
      reason: 'Moderate complexity question',
      suggestedModel: 'gpt-4-turbo-preview',
      estimatedTokens: Math.ceil(query.length / 4) + 1000,
    }
  }

  return {
    complexity: 'simple',
    reason: 'Standard query',
    suggestedModel: 'gpt-3.5-turbo',
    estimatedTokens: Math.ceil(query.length / 4) + 500,
  }
}

/**
 * Model routing configuration
 *
 * NOTE: This is a simplified routing config for server-side provider dispatch.
 * For detailed per-model pricing and capability-based routing, see
 * @clarity-chat/token-optimization's ModelRoutingConfig and ModelRouter.
 */
export interface ModelRoutingConfig {
  /** Enable smart routing (default: true if multiple models available) */
  enabled?: boolean
  /** Force a specific model regardless of complexity */
  forceModel?: string
  /** Cost optimization mode - prefer cheaper models when possible */
  optimizeForCost?: boolean
  /** Speed optimization mode - prefer faster models when possible */
  optimizeForSpeed?: boolean
}

/**
 * Get the appropriate streaming function based on configured model
 */
export function getStreamingFunction():
  | typeof streamFromOpenAI
  | typeof streamFromClaude
  | typeof streamFromGemini
  | typeof streamFromDemo {
  // Check if any API key is configured
  const hasOpenAI = !!process.env.OPENAI_API_KEY
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY
  const hasGemini = !!process.env.GEMINI_API_KEY

  // If no API keys, use demo mode
  if (!hasOpenAI && !hasAnthropic && !hasGemini) {
    return streamFromDemo
  }

  const model = process.env.AI_MODEL || 'gpt-4-turbo-preview'

  if (model.startsWith('claude') && hasAnthropic) {
    return streamFromClaude
  }

  if (model.startsWith('gemini') && hasGemini) {
    return streamFromGemini
  }

  if (hasOpenAI) {
    return streamFromOpenAI
  }

  // Fallback to demo if configured model doesn't have a key
  return streamFromDemo
}

/**
 * Get streaming function with smart model routing based on query complexity
 *
 * This function combines complexity classification with provider dispatch:
 * it classifies the query, then selects both a streaming function and model
 * string based on available API keys and complexity.
 *
 * @see {@link @clarity-chat/token-optimization#ModelRouter} for a standalone
 * model routing system that provides cost estimation, capability filtering,
 * and savings tracking without being tied to streaming providers.
 */
export function getStreamingFunctionWithRouting(
  query: string,
  conversationLength: number = 0,
  config: ModelRoutingConfig = {}
): {
  streamFn:
    | typeof streamFromOpenAI
    | typeof streamFromClaude
    | typeof streamFromGemini
    | typeof streamFromDemo
  model: string
  classification: QueryClassification
} {
  const hasOpenAI = !!process.env.OPENAI_API_KEY
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY
  const hasGemini = !!process.env.GEMINI_API_KEY

  // Classify query complexity
  const classification = classifyQueryComplexity(query, conversationLength)

  // If no API keys, use demo mode
  if (!hasOpenAI && !hasAnthropic && !hasGemini) {
    return {
      streamFn: streamFromDemo,
      model: 'demo',
      classification,
    }
  }

  // If forced model, use it
  if (config.forceModel) {
    if (config.forceModel.startsWith('claude') && hasAnthropic) {
      return {
        streamFn: streamFromClaude,
        model: config.forceModel,
        classification,
      }
    }
    if (config.forceModel.startsWith('gemini') && hasGemini) {
      return {
        streamFn: streamFromGemini,
        model: config.forceModel,
        classification,
      }
    }
    if (hasOpenAI) {
      return {
        streamFn: streamFromOpenAI,
        model: config.forceModel,
        classification,
      }
    }
  }

  // If routing disabled, use default
  if (config.enabled === false) {
    return {
      streamFn: getStreamingFunction(),
      model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
      classification,
    }
  }

  // Smart routing based on complexity
  let selectedModel: string
  let streamFn:
    | typeof streamFromOpenAI
    | typeof streamFromClaude
    | typeof streamFromGemini
    | typeof streamFromDemo

  switch (classification.complexity) {
    case 'simple':
      // For simple queries, prefer fast/cheap models
      if (config.optimizeForSpeed && hasGemini) {
        selectedModel = 'gemini-1.5-flash'
        streamFn = streamFromGemini
      } else if (config.optimizeForCost && hasOpenAI) {
        selectedModel = 'gpt-3.5-turbo'
        streamFn = streamFromOpenAI
      } else if (hasOpenAI) {
        selectedModel = 'gpt-3.5-turbo'
        streamFn = streamFromOpenAI
      } else if (hasGemini) {
        selectedModel = 'gemini-1.5-flash'
        streamFn = streamFromGemini
      } else if (hasAnthropic) {
        selectedModel = 'claude-3-haiku-20240307'
        streamFn = streamFromClaude
      } else {
        selectedModel = 'demo'
        streamFn = streamFromDemo
      }
      break

    case 'moderate':
      // For moderate queries, use balanced models
      if (hasOpenAI) {
        selectedModel = 'gpt-4-turbo-preview'
        streamFn = streamFromOpenAI
      } else if (hasAnthropic) {
        selectedModel = 'claude-3-5-sonnet-20241022'
        streamFn = streamFromClaude
      } else if (hasGemini) {
        selectedModel = 'gemini-1.5-pro'
        streamFn = streamFromGemini
      } else {
        selectedModel = 'demo'
        streamFn = streamFromDemo
      }
      break

    case 'complex':
      // For complex queries, use the most capable models
      if (hasAnthropic) {
        selectedModel = 'claude-3-5-sonnet-20241022'
        streamFn = streamFromClaude
      } else if (hasOpenAI) {
        selectedModel = 'gpt-4-turbo-preview'
        streamFn = streamFromOpenAI
      } else if (hasGemini) {
        selectedModel = 'gemini-1.5-pro'
        streamFn = streamFromGemini
      } else {
        selectedModel = 'demo'
        streamFn = streamFromDemo
      }
      break

    default:
      selectedModel = process.env.AI_MODEL || 'gpt-4-turbo-preview'
      streamFn = getStreamingFunction()
  }

  return {
    streamFn,
    model: selectedModel,
    classification,
  }
}

/**
 * Provider status for API health checks
 */
export interface ProviderStatus {
  name: 'openai' | 'anthropic' | 'google' | 'demo'
  available: boolean
  model: string
  latency?: number
  error?: string
}

export interface ProviderStatusResult {
  providers: ProviderStatus[]
  activeProvider: { name: string; model: string }
  isDemoMode: boolean
  summary: string
}

const PROVIDER_MODELS = {
  openai: 'gpt-4-turbo-preview',
  anthropic: 'claude-3-5-sonnet-20241022',
  google: 'gemini-1.5-pro',
  demo: 'demo-mode',
} as const

export function getProviderStatus(): ProviderStatusResult {
  const providers: ProviderStatus[] = []

  // Check OpenAI
  const openaiKey = process.env.OPENAI_API_KEY
  providers.push({
    name: 'openai',
    available: !!openaiKey && openaiKey.length > 10,
    model: PROVIDER_MODELS.openai,
  })

  // Check Anthropic
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  providers.push({
    name: 'anthropic',
    available: !!anthropicKey && anthropicKey.length > 10,
    model: PROVIDER_MODELS.anthropic,
  })

  // Check Google
  const googleKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
  providers.push({
    name: 'google',
    available: !!googleKey && googleKey.length > 10,
    model: PROVIDER_MODELS.google,
  })

  // Demo is always available
  providers.push({
    name: 'demo',
    available: true,
    model: PROVIDER_MODELS.demo,
  })

  // Determine active provider (first available non-demo, or demo)
  const availableProviders = providers.filter(
    (p) => p.available && p.name !== 'demo'
  )
  const activeProvider =
    availableProviders[0] || providers.find((p) => p.name === 'demo')!
  const isDemoMode = activeProvider.name === 'demo'

  const availableCount = availableProviders.length
  const summary = isDemoMode
    ? 'Running in demo mode - no API keys configured'
    : `${availableCount} provider${availableCount === 1 ? '' : 's'} available: ${availableProviders.map((p) => p.name).join(', ')}`

  return {
    providers,
    activeProvider: { name: activeProvider.name, model: activeProvider.model },
    isDemoMode,
    summary,
  }
}

/**
 * Rate limiting for API requests
 */
interface RateLimitStore {
  requests: number[]
  lastReset: number
}

const rateLimitStore = new Map<string, RateLimitStore>()

export function checkRateLimit(
  identifier: string,
  maxRequests = 100,
  windowMs = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  let store = rateLimitStore.get(identifier)

  // Initialize or reset if window expired
  if (!store || now - store.lastReset > windowMs) {
    store = {
      requests: [],
      lastReset: now,
    }
    rateLimitStore.set(identifier, store)
  }

  // Remove old requests outside the window
  store.requests = store.requests.filter((time) => now - time < windowMs)

  // Check if limit exceeded
  const allowed = store.requests.length < maxRequests

  if (allowed) {
    store.requests.push(now)
  }

  return {
    allowed,
    remaining: Math.max(0, maxRequests - store.requests.length),
    resetAt: store.lastReset + windowMs,
  }
}

/**
 * Token counter for rate limiting
 */
export function estimateMessageTokens(
  messages: { role: string; content: string }[]
): number {
  const totalChars = messages.reduce((sum, msg) => sum + msg.content.length, 0)
  return Math.ceil(totalChars / 4) // Rough estimate: 4 chars per token
}

/**
 * Validate request size
 */
export function validateRequest(
  messages: { role: string; content: string }[],
  maxTokens = 10000
): { valid: boolean; error?: string } {
  if (messages.length === 0) {
    return { valid: false, error: 'No messages provided' }
  }

  const lastMessage = messages[messages.length - 1]
  if (lastMessage.role !== 'user') {
    return { valid: false, error: 'Last message must be from user' }
  }

  const estimatedTokens = estimateMessageTokens(messages)
  if (estimatedTokens > maxTokens) {
    return {
      valid: false,
      error: `Request too large: ${estimatedTokens} tokens (max: ${maxTokens})`,
    }
  }

  return { valid: true }
}

/**
 * Error handler for streaming errors
 */
export function handleStreamError(error: unknown): StreamChunk {
  console.error('Stream error:', error)

  let errorMessage = 'An unexpected error occurred'

  if (error instanceof Error) {
    // OpenAI errors
    if ('status' in error && error.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again in a moment.'
    } else if ('status' in error && error.status === 401) {
      errorMessage = 'Authentication failed. Please check API credentials.'
    } else {
      errorMessage = error.message
    }
  }

  return {
    type: 'error',
    content: errorMessage,
  }
}

/**
 * Retry logic for failed requests
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      console.warn(`Attempt ${attempt + 1} failed:`, error)

      if (attempt < maxRetries - 1) {
        // Exponential backoff
        const delay = delayMs * Math.pow(2, attempt)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

/**
 * Format response with metadata
 */
export interface FormattedResponse {
  content: string
  metadata: {
    model: string
    tokensUsed?: number
    sources?: Array<{ title: string; url: string }>
    timestamp: string
  }
}

export function formatResponse(
  content: string,
  sources?: Array<{ title: string; url: string }>
): FormattedResponse {
  return {
    content,
    metadata: {
      model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
      sources,
      timestamp: new Date().toISOString(),
    },
  }
}
