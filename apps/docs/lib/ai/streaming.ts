/**
 * Streaming Utilities for AI APIs
 *
 * Provides streaming support for various AI providers (Claude, OpenAI, Gemini)
 * with Server-Sent Events (SSE) transport.
 */

import Anthropic from '@anthropic-ai/sdk'

// ============================================================================
// Types
// ============================================================================

export interface StreamChunk {
  type: 'text' | 'sources' | 'tool_use' | 'tool_result' | 'error' | 'done'
  content?: string
  data?: unknown
  tool_name?: string
  tool_use_id?: string
  tool_input?: unknown
  tool_result?: unknown
}

export interface QueryClassification {
  complexity: 'simple' | 'moderate' | 'complex'
  requiresRAG: boolean
  estimatedTokens: number
}

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface StreamOptions {
  model?: string
  maxTokens?: number
  temperature?: number
  tools?: Anthropic.Tool[]
}

export interface ProviderInfo {
  name: string
  model: string
  available: boolean
}

export interface ProviderStatus {
  activeProvider: ProviderInfo
  isDemoMode: boolean
  summary: string
  providers: ProviderInfo[]
}

// ============================================================================
// Rate Limiting (Re-export from rate-limit.ts)
// ============================================================================

export { checkRateLimit, type RateLimitResult } from './rate-limit'

// ============================================================================
// Provider Detection
// ============================================================================

/**
 * Get provider status for debugging and health checks
 */
export function getProviderStatus(): ProviderStatus {
  const anthropicAvailable = !!process.env.ANTHROPIC_API_KEY
  const openaiAvailable = !!process.env.OPENAI_API_KEY
  const geminiAvailable = !!process.env.GEMINI_API_KEY

  const providers: ProviderInfo[] = [
    {
      name: 'anthropic',
      model: 'claude-sonnet-4-20250514',
      available: anthropicAvailable,
    },
    {
      name: 'openai',
      model: 'gpt-4-turbo-preview',
      available: openaiAvailable,
    },
    {
      name: 'gemini',
      model: 'gemini-1.5-pro',
      available: geminiAvailable,
    },
    {
      name: 'demo',
      model: 'demo-mode',
      available: true,
    },
  ]

  // Determine active provider (priority: Anthropic > OpenAI > Gemini > Demo)
  const activeProvider =
    providers.find((p) => p.name === 'anthropic' && p.available) ||
    providers.find((p) => p.name === 'openai' && p.available) ||
    providers.find((p) => p.name === 'gemini' && p.available) ||
    providers.find((p) => p.name === 'demo')!

  const isDemoMode = activeProvider.name === 'demo'

  return {
    activeProvider,
    isDemoMode,
    summary: isDemoMode
      ? 'Running in demo mode - configure API keys for full functionality'
      : `Using ${activeProvider.name} (${activeProvider.model})`,
    providers,
  }
}

// ============================================================================
// Request Validation
// ============================================================================

export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validate request messages
 */
export function validateRequest(messages: Message[]): ValidationResult {
  if (!messages || messages.length === 0) {
    return { valid: false, error: 'Messages array cannot be empty' }
  }

  for (const msg of messages) {
    if (!msg.role || !['user', 'assistant', 'system'].includes(msg.role)) {
      return { valid: false, error: 'Invalid message role' }
    }
    if (typeof msg.content !== 'string') {
      return { valid: false, error: 'Message content must be a string' }
    }
  }

  return { valid: true }
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Handle streaming errors gracefully
 */
export function handleStreamError(error: unknown): StreamChunk {
  console.error('Stream error:', error)

  if (error instanceof Error) {
    return {
      type: 'error',
      content: error.message,
    }
  }

  return {
    type: 'error',
    content: 'An unexpected error occurred during streaming',
  }
}

// ============================================================================
// SSE Stream Creation
// ============================================================================

/**
 * Create Server-Sent Events stream from async generator
 */
export function createSSEStream(
  generator: AsyncGenerator<StreamChunk>
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of generator) {
          // Format as SSE
          const data = `data: ${JSON.stringify(chunk)}\n\n`
          controller.enqueue(encoder.encode(data))
        }

        // Send done event
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
        )
        controller.close()
      } catch (error) {
        console.error('SSE stream error:', error)
        const errorChunk = handleStreamError(error)
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(errorChunk)}\n\n`)
        )
        controller.close()
      }
    },
  })
}

// ============================================================================
// Query Classification
// ============================================================================

/**
 * Classify query complexity for smart model routing
 */
function classifyQuery(
  query: string,
  conversationLength: number
): QueryClassification {
  const wordCount = query.split(/\s+/).length
  const hasCodeBlock = /```/.test(query)
  const hasMultipleQuestions = (query.match(/\?/g) || []).length > 1

  let complexity: 'simple' | 'moderate' | 'complex' = 'simple'
  let estimatedTokens = wordCount * 1.3 // Rough estimate

  // Determine complexity
  if (hasCodeBlock || conversationLength > 10 || wordCount > 100) {
    complexity = 'complex'
    estimatedTokens += 500
  } else if (hasMultipleQuestions || wordCount > 30) {
    complexity = 'moderate'
    estimatedTokens += 200
  }

  // Queries mentioning components/hooks likely need RAG
  const requiresRAG = /component|hook|api|how do i|example|documentation/i.test(
    query
  )

  return {
    complexity,
    requiresRAG,
    estimatedTokens: Math.ceil(estimatedTokens),
  }
}

// ============================================================================
// Model Selection
// ============================================================================

/**
 * Get streaming function with smart model routing
 */
export function getStreamingFunctionWithRouting(
  query: string,
  conversationLength: number,
  options: {
    enabled: boolean
    optimizeForCost?: boolean
    optimizeForSpeed?: boolean
  } = { enabled: true }
): { model: string; classification: QueryClassification } {
  const classification = classifyQuery(query, conversationLength)

  if (!options.enabled) {
    return {
      model: process.env.AI_MODEL || 'claude-sonnet-4-20250514',
      classification,
    }
  }

  // Smart routing based on complexity
  let model: string

  if (options.optimizeForSpeed && classification.complexity === 'simple') {
    model = 'claude-3-haiku-20240307'
  } else if (
    options.optimizeForCost &&
    classification.complexity !== 'complex'
  ) {
    model = 'gpt-3.5-turbo'
  } else if (classification.complexity === 'complex') {
    model = 'claude-sonnet-4-20250514'
  } else {
    model = 'gpt-4-turbo-preview'
  }

  return { model, classification }
}

/**
 * Get the default streaming function
 */
export function getStreamingFunction() {
  return streamFromClaude
}

// ============================================================================
// Streaming Implementations
// ============================================================================

/**
 * Stream from Claude (Anthropic)
 */
export async function* streamFromClaude(
  messages: Message[],
  options: StreamOptions = {}
): AsyncGenerator<StreamChunk> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    yield* streamFromDemo(messages)
    return
  }

  try {
    const anthropic = new Anthropic({ apiKey })

    // Separate system message from conversation
    const systemMessage = messages.find((m) => m.role === 'system')
    const conversationMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

    const stream = await anthropic.messages.stream({
      model: options.model || 'claude-sonnet-4-20250514',
      max_tokens: options.maxTokens || 4000,
      temperature: options.temperature || 0.7,
      system: systemMessage?.content,
      messages: conversationMessages,
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
    yield handleStreamError(error)
  }
}

/**
 * Stream from Claude with tool support
 */
export async function* streamFromClaudeWithTools(
  messages: Message[],
  options: StreamOptions = {}
): AsyncGenerator<StreamChunk> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    yield {
      type: 'error',
      content: 'Tool use requires Anthropic API key',
    }
    return
  }

  try {
    const anthropic = new Anthropic({ apiKey })

    // Separate system message
    const systemMessage = messages.find((m) => m.role === 'system')
    const conversationMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

    const stream = await anthropic.messages.stream({
      model: options.model || 'claude-3-5-sonnet-20241022',
      max_tokens: options.maxTokens || 4000,
      temperature: options.temperature || 0.7,
      system: systemMessage?.content,
      messages: conversationMessages,
      tools: options.tools || [],
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

      // Handle tool use events
      if (
        chunk.type === 'content_block_start' &&
        chunk.content_block.type === 'tool_use'
      ) {
        yield {
          type: 'tool_use',
          tool_name: chunk.content_block.name,
          tool_use_id: chunk.content_block.id,
          tool_input: chunk.content_block.input,
        }
      }
    }
  } catch (error) {
    console.error('Claude tool streaming error:', error)
    yield handleStreamError(error)
  }
}

/**
 * Demo streaming (fallback when no API keys configured)
 */
export async function* streamFromDemo(
  messages: Message[]
): AsyncGenerator<StreamChunk> {
  const userMessage = messages[messages.length - 1]?.content || ''

  const responses: Record<string, string> = {
    hello:
      "Hello! I'm running in demo mode. Configure an API key to enable full AI functionality.",
    default: `I'm currently in demo mode. To experience the full Clarity Chat Documentation Assistant, please configure an API key in your environment variables.

Key features available with API access:
- Intelligent documentation search
- Code example generation
- Real-time streaming responses
- Context-aware answers

Check the setup instructions in your documentation for more details.`,
  }

  const responseText =
    responses[userMessage.toLowerCase().trim()] || responses.default

  // Simulate streaming by chunking the response
  const words = responseText.split(' ')
  for (let i = 0; i < words.length; i += 3) {
    const chunk = words.slice(i, i + 3).join(' ') + ' '
    yield {
      type: 'text',
      content: chunk,
    }
    // Small delay to simulate streaming
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
}
