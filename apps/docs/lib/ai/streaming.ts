/**
 * Streaming Utilities
 *
 * Handles streaming responses from LLMs using Server-Sent Events (SSE).
 * Supports OpenAI, Anthropic, and Google Gemini streaming APIs.
 */

import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { logger } from '@/lib/logger'
import type { ToolName, ToolInputs } from './tools'
import { searchDocumentation, formatSearchResultsForRAG } from './keywordSearch'
import type { SearchResult as KeywordSearchResult } from './keywordSearch'

// ============================================================================
// RAG Configuration Constants
// ============================================================================

/** Minimum query length to perform search */
const MIN_QUERY_LENGTH = 2

/** Maximum number of search results to retrieve */
const MAX_SEARCH_RESULTS = 5

/** Minimum score threshold for search results */
const MIN_SEARCH_SCORE = 0.2

/** Minimum quality score to prefer results */
const MIN_QUALITY_SCORE = 0.5

/** Maximum number of quality results to use */
const MAX_QUALITY_RESULTS = 3

/** Fallback number of results if no quality results found */
const FALLBACK_RESULTS = 2

/** Maximum content length before truncation */
const MAX_CONTENT_LENGTH = 600

/** Minimum break point ratio for truncation (50% of max length) */
const MIN_BREAK_POINT_RATIO = 0.5

/** Fallback truncation offset */
const TRUNCATION_FALLBACK_OFFSET = 100

/** Streaming delay for small chunks (ms) */
const STREAM_DELAY_SMALL = 4

/** Streaming delay for large chunks (ms) */
const STREAM_DELAY_LARGE = 2

/** Chunk size threshold for determining delay (characters) */
const LARGE_CHUNK_THRESHOLD = 200

/** Question word patterns for detecting questions */
const QUESTION_PATTERN = /^(what|how|when|where|why|can|is|are|do|does)/i

/** Regex for matching code blocks */
const CODE_BLOCK_REGEX = /```[\s\S]*?```/g

/** Regex for normalizing excessive newlines */
const EXCESSIVE_NEWLINES_REGEX = /\n{3,}/g

/** Regex for spacing before code blocks */
const SPACE_BEFORE_CODE_REGEX = /([^\n])\n```/g

/** Regex for spacing after code blocks */
const SPACE_AFTER_CODE_REGEX = /```\n([^\n])/g

/** Maximum query length to prevent abuse */
const MAX_QUERY_LENGTH = 500

/** Search operation timeout (ms) */
const SEARCH_TIMEOUT_MS = 10000

/** Maximum retry attempts for transient errors */
const MAX_RETRY_ATTEMPTS = 2

/** Retry delay base (ms) */
const RETRY_DELAY_BASE_MS = 100

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
        logger.error('Streaming error:', error)

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

    let hasFinished = false
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
        hasFinished = true
      } else if (finishReason && finishReason !== null) {
        // Stream completed normally
        hasFinished = true
      }
    }
    
    // Signal completion
    yield { type: 'done' as const }
  } catch (error) {
    logger.error('OpenAI streaming error:', error)
    // If API key is invalid, yield error instead of throwing
    if (error instanceof Error && (error.message.includes('401') || error.message.includes('Invalid API key') || error.message.includes('Incorrect API key'))) {
      yield {
        type: 'error',
        content: 'Invalid API key. Please check your OPENAI_API_KEY in .env.local',
      }
      return
    }
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
    
    // Signal completion
    yield { type: 'done' as const }
  } catch (error) {
    logger.error('Claude streaming error:', error)
    // If API key is invalid, yield error instead of throwing
    if (error instanceof Error && (error.message.includes('401') || error.message.includes('Invalid API key') || error.message.includes('authentication'))) {
      yield {
        type: 'error',
        content: 'Invalid API key. Please check your ANTHROPIC_API_KEY in .env.local',
      }
      return
    }
    throw error
  }
}

/**
 * Stream from Anthropic Claude API with tool support
 *
 * This function enables the docs assistant to use tools for enhanced responses:
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
  } = {}
): AsyncGenerator<StreamChunk> {
  const {
    model = 'claude-3-5-sonnet-20241022',
    temperature = 0.7,
    maxTokens = 4000,
    tools = [],
  } = options

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }

  const anthropic = new Anthropic({ apiKey })

  // Import tool handlers dynamically to avoid circular deps
  const toolsModule = await import('./tools')
  const executeToolCall = toolsModule.executeToolCall

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
            const toolResult = await executeToolCall(
              block.name as ToolName,
              block.input as ToolInputs[ToolName]
            )

            // Emit tool result for UI to render
            yield {
              type: 'tool_result',
              tool_name: block.name,
              tool_use_id: block.id,
              tool_result: toolResult,
            }
          } catch (error) {
            logger.error(`Tool execution error for ${block.name}:`, error)
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
            const result = await executeToolCall(
              block.name as ToolName,
              block.input as ToolInputs[ToolName]
            )
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
    logger.error('Claude with tools streaming error:', error)
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
    apiKey?: string // Allow API key to be passed directly
  } = {}
): AsyncGenerator<StreamChunk> {
  const { model = 'gemini-1.5-flash', systemPrompt, apiKey: providedApiKey } = options

  // Use provided API key or fall back to environment variable
  const apiKey = providedApiKey || process.env.GEMINI_API_KEY

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
    
    // Signal completion
    yield { type: 'done' as const }
  } catch (error) {
    logger.error('Gemini streaming error:', error)
    throw error
  }
}

// ============================================================================
// Types and Interfaces
// ============================================================================

interface ProcessedContent {
  content: string
  wasTruncated: boolean
}

interface SearchResultWithQuality extends KeywordSearchResult {
  isHighQuality: boolean
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get current page path (SSR-safe)
 * @returns Current pathname or '/' as fallback
 */
function getCurrentPath(): string {
  if (typeof window === 'undefined') return '/'
  try {
    return window.location.pathname || '/'
  } catch {
    return '/'
  }
}

/**
 * Validate and normalize query string
 * @param query - Raw query string
 * @returns Normalized query or null if invalid
 */
function validateQuery(query: string | undefined | null): string | null {
  if (!query || typeof query !== 'string') return null
  
  const trimmed = query.trim()
  
  // Check minimum length
  if (trimmed.length < MIN_QUERY_LENGTH) return null
  
  // Check maximum length (prevent abuse)
  if (trimmed.length > MAX_QUERY_LENGTH) {
    logger.warn(`Query exceeds max length: ${trimmed.length} chars`)
    return trimmed.substring(0, MAX_QUERY_LENGTH).trim()
  }
  
  return trimmed
}

/**
 * Sanitize query for search (remove potentially problematic characters)
 * @param query - Raw query string
 * @returns Sanitized query
 */
function sanitizeQuery(query: string): string {
  if (!query || typeof query !== 'string') return ''
  
  // Remove control characters but preserve normal whitespace and newlines
  return query
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '') // Remove control chars (preserve \n, \t, \r)
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
    .replace(/\s+/g, ' ') // Normalize whitespace to single spaces
    .trim()
}

/**
 * Performance metrics for RAG operations
 */
interface RAGMetrics {
  searchDuration: number
  processingDuration: number
  streamingDuration: number
  totalDuration: number
  resultsFound: number
  resultsUsed: number
  chunksGenerated: number
  responseLength: number
}

/**
 * Create performance timer
 */
function createTimer(): { start: () => void; stop: () => number } {
  let startTime = 0
  return {
    start: () => {
      startTime = Date.now()
    },
    stop: () => {
      return Date.now() - startTime
    },
  }
}

/**
 * Check if error is transient (retryable)
 */
function isTransientError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  
  const message = error.message.toLowerCase()
  const transientPatterns = [
    'timeout',
    'network',
    'econnreset',
    'etimedout',
    'enotfound',
    'temporary',
    'rate limit',
    '429',
    '503',
    '502',
  ]
  
  return transientPatterns.some((pattern) => message.includes(pattern))
}

/**
 * Validate URL to prevent XSS attacks
 * @param url - URL string to validate
 * @returns True if URL is safe
 */
function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  
  try {
    // Only allow http/https protocols
    const parsed = new URL(url, 'https://example.com')
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    // Relative URLs are allowed (they'll be resolved by the browser)
    return url.startsWith('/') || url.startsWith('#')
  }
}

/**
 * Filter and rank search results by quality
 * @param results - Raw search results
 * @returns Filtered and ranked results with quality metadata
 */
function filterSearchResults(
  results: KeywordSearchResult[]
): SearchResultWithQuality[] {
  if (results.length === 0) {
    logger.debug('No search results to filter')
    return []
  }

  // Prefer high-quality results
  const qualityResults = results
    .filter((r) => r.score >= MIN_QUALITY_SCORE)
    .map((r) => ({ ...r, isHighQuality: true }))

  if (qualityResults.length > 0) {
    logger.debug(`Found ${qualityResults.length} high-quality results`)
    return qualityResults.slice(0, MAX_QUALITY_RESULTS)
  }

  // Fallback to top results if no quality matches
  logger.debug('No high-quality results, using fallback')
  return results
    .slice(0, FALLBACK_RESULTS)
    .map((r) => ({ ...r, isHighQuality: false }))
}

/**
 * Clean and format markdown content
 * @param content - Raw markdown content
 * @returns Cleaned markdown content
 */
function cleanMarkdownContent(content: string): string {
  if (!content || typeof content !== 'string') {
    logger.warn('cleanMarkdownContent: Invalid input')
    return ''
  }

  return content
    .replace(EXCESSIVE_NEWLINES_REGEX, '\n\n') // Normalize excessive newlines
    .replace(SPACE_BEFORE_CODE_REGEX, '$1\n\n```') // Space before code blocks
    .replace(SPACE_AFTER_CODE_REGEX, '```\n\n$1') // Space after code blocks
    .trim()
}

/**
 * Truncate content while preserving code blocks
 * @param content - Content to truncate
 * @returns Truncated content with ellipsis if needed
 */
function truncateContent(content: string): string {
  if (!content || typeof content !== 'string') {
    logger.warn('truncateContent: Invalid input')
    return ''
  }

  if (content.length <= MAX_CONTENT_LENGTH) return content

  // Find all code blocks
  const codeBlocks: Array<{ start: number; end: number }> = []
  let match: RegExpExecArray | null

  // Reset regex lastIndex to ensure consistent behavior
  CODE_BLOCK_REGEX.lastIndex = 0
  while ((match = CODE_BLOCK_REGEX.exec(content)) !== null) {
    codeBlocks.push({
      start: match.index,
      end: match.index + match[0].length,
    })
  }

  // Determine truncation point
  let truncateAt = MAX_CONTENT_LENGTH

  // Extend truncation if it would cut a code block
  for (const block of codeBlocks) {
    if (truncateAt > block.start && truncateAt < block.end) {
      truncateAt = block.end
      logger.debug(`Extended truncation to preserve code block: ${truncateAt}`)
      break
    }
  }

  // Try to break at sentence or paragraph boundary
  const truncated = content.substring(0, truncateAt)
  const lastSentence = truncated.lastIndexOf('.')
  const lastParagraph = truncated.lastIndexOf('\n\n')

  // Use best break point (prefer paragraph, then sentence)
  const breakPoint = Math.max(
    lastParagraph,
    lastSentence,
    truncateAt - TRUNCATION_FALLBACK_OFFSET
  )

  if (breakPoint > truncateAt * MIN_BREAK_POINT_RATIO) {
    const result = content.substring(0, breakPoint + 1).trim() + '...'
    logger.debug(`Truncated content: ${content.length} -> ${result.length} chars`)
    return result
  }

  const result = truncated.trim() + '...'
  logger.debug(`Truncated content (fallback): ${content.length} -> ${result.length} chars`)
  return result
}

/**
 * Process content chunk for display
 * @param content - Raw content chunk
 * @returns Processed content or null if invalid
 */
function processContentChunk(content: string): string | null {
  if (!content || typeof content !== 'string') {
    return null
  }

  const trimmed = content.trim()
  if (!trimmed) {
    return null
  }

  try {
    const cleaned = cleanMarkdownContent(trimmed)
    return truncateContent(cleaned)
  } catch (error) {
    logger.error('Error processing content chunk:', error)
    // Return original content as fallback
    return trimmed
  }
}

/**
 * Detect if query is a question
 * @param query - Query string to check
 * @returns True if query appears to be a question
 */
function isQuestion(query: string): boolean {
  if (!query || typeof query !== 'string') return false
  return query.endsWith('?') || QUESTION_PATTERN.test(query)
}

/**
 * Build response header based on query type
 * @param isQuestion - Whether the query is a question
 * @param resultCount - Number of results found
 * @returns Formatted header string
 */
function buildResponseHeader(isQuestion: boolean, resultCount: number): string {
  if (isQuestion) {
    return `## 💡 Answer\n\nHere's what I found in the Clarity Chat documentation:\n\n---\n\n`
  }
  const resultText = resultCount === 1 ? 'result' : 'results'
  return `## 📚 Documentation\n\nFound ${resultCount} ${resultText}:\n\n---\n\n`
}

/**
 * Split response into streaming chunks for smooth rendering
 * @param response - Full response string
 * @returns Array of chunks ready for streaming
 */
function splitIntoChunks(response: string): string[] {
  if (!response || typeof response !== 'string') {
    logger.warn('splitIntoChunks: Invalid input')
    return []
  }

  const chunks: string[] = []
  const parts: Array<{ type: 'code' | 'text'; content: string }> = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  try {
    // Extract code blocks and text sections
    CODE_BLOCK_REGEX.lastIndex = 0
    while ((match = CODE_BLOCK_REGEX.exec(response)) !== null) {
      if (match.index > lastIndex) {
        const text = response.substring(lastIndex, match.index)
        if (text.trim()) parts.push({ type: 'text', content: text })
      }
      parts.push({ type: 'code', content: match[0] })
      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < response.length) {
      const text = response.substring(lastIndex)
      if (text.trim()) parts.push({ type: 'text', content: text })
    }

    // Fallback if no parts found
    if (parts.length === 0) {
      parts.push({ type: 'text', content: response })
    }

    // Convert to chunks - split text by paragraphs
    for (const part of parts) {
      if (part.type === 'code') {
        chunks.push(part.content)
      } else {
        const paragraphs = part.content.split(/\n\n+/)
        for (const para of paragraphs) {
          const trimmed = para.trim()
          if (trimmed) chunks.push(trimmed + '\n\n')
        }
      }
    }

    logger.debug(`Split response into ${chunks.length} chunks`)
    return chunks.length > 0 ? chunks : [response]
  } catch (error) {
    logger.error('Error splitting response into chunks:', error)
    // Fallback: return response as single chunk
    return [response]
  }
}

// ============================================================================
// Main RAG Streaming Function
// ============================================================================

/**
 * RAG-based streaming function that uses documentation search to generate contextual responses.
 * This provides intelligent answers without requiring an LLM API key.
 *
 * @param messages - Array of conversation messages
 * @param options - Optional configuration
 * @yields StreamChunk - Streaming chunks of the response
 */
export async function* streamFromRAG(
  messages: { role: string; content: string }[],
  options: {
    systemPrompt?: string
  } = {}
): AsyncGenerator<StreamChunk> {
  // Validate input
  if (!messages || messages.length === 0) {
    logger.warn('streamFromRAG: No messages provided')
    yield* streamFromDemo(messages)
    return
  }

  const lastMessage = messages[messages.length - 1]
  const rawQuery = lastMessage?.content
  
  // Validate and sanitize query
  const query = validateQuery(rawQuery)
  if (!query) {
    logger.debug('streamFromRAG: Invalid or empty query, falling back to demo')
    yield* streamFromDemo(messages)
    return
  }

  const sanitizedQuery = sanitizeQuery(query)
  logger.debug(`streamFromRAG: Processing query: "${sanitizedQuery.substring(0, 50)}..."`)

  // Initialize performance metrics
  const metrics: RAGMetrics = {
    searchDuration: 0,
    processingDuration: 0,
    streamingDuration: 0,
    totalDuration: 0,
    resultsFound: 0,
    resultsUsed: 0,
    chunksGenerated: 0,
    responseLength: 0,
  }
  
  const totalTimer = createTimer()
  totalTimer.start()

  try {
    // Search documentation with balanced parameters and timeout protection
    const searchTimer = createTimer()
    searchTimer.start()
    
    let searchResults: ReturnType<typeof searchDocumentation>
    
    try {
      // Wrap search in timeout promise
      const searchPromise = Promise.resolve(
        searchDocumentation(sanitizedQuery, {
          topK: MAX_SEARCH_RESULTS,
          minScore: MIN_SEARCH_SCORE,
          currentPath: getCurrentPath(),
        })
      )
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Search timeout')), SEARCH_TIMEOUT_MS)
      })
      
      searchResults = await Promise.race([searchPromise, timeoutPromise])
      metrics.searchDuration = searchTimer.stop()
    } catch (searchError) {
      metrics.searchDuration = searchTimer.stop()
      
      // Retry transient errors
      if (isTransientError(searchError) && MAX_RETRY_ATTEMPTS > 0) {
        logger.warn(`Search failed, retrying... (${searchError instanceof Error ? searchError.message : 'unknown error'})`)
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_BASE_MS))
        
        try {
          searchResults = searchDocumentation(sanitizedQuery, {
            topK: MAX_SEARCH_RESULTS,
            minScore: MIN_SEARCH_SCORE,
            currentPath: getCurrentPath(),
          })
          metrics.searchDuration += searchTimer.stop()
        } catch (retryError) {
          throw retryError // Re-throw if retry also fails
        }
      } else {
        throw searchError // Re-throw non-transient errors
      }
    }

    metrics.resultsFound = searchResults.length
    logger.debug(`streamFromRAG: Found ${searchResults.length} search results in ${metrics.searchDuration}ms`)

    // Filter and rank results
    const finalResults = filterSearchResults(searchResults)

    if (finalResults.length === 0) {
      // No results found - fall back to demo mode
      yield {
        type: 'text',
        content: `I couldn't find specific documentation for "${query}". Let me provide a general answer:\n\n---\n\n`,
      }
      yield* streamFromDemo(messages)
      return
    }

    // Format search results for context
    const { context: docsContext, sources } = formatSearchResultsForRAG(
      finalResults
    )

    // Build response from search results
    if (!docsContext || finalResults.length === 0) {
      yield* streamFromDemo(messages)
      return
    }

    // Build response header
    const queryIsQuestion = isQuestion(sanitizedQuery)
    
    const processingTimer = createTimer()
    processingTimer.start()
    
    let response = buildResponseHeader(queryIsQuestion, finalResults.length)
    
    logger.debug(`streamFromRAG: Using ${finalResults.length} filtered results (${queryIsQuestion ? 'question' : 'query'})`)

    // Process top results
    const topResults = finalResults.slice(0, Math.min(MAX_QUALITY_RESULTS, finalResults.length))
    metrics.resultsUsed = topResults.length

    for (let index = 0; index < topResults.length; index++) {
      const result = topResults[index]
      const { chunk } = result

      // Add separator between sections (except first)
      if (index > 0) {
        response += '\n\n---\n\n'
      }

      // Section header
      response +=
        topResults.length > 1
          ? `### ${index + 1}. ${chunk.title}\n\n`
          : `### ${chunk.title}\n\n`

      // Category badge (only if multiple results)
      if (chunk.category && topResults.length > 1) {
        response += `**Category:** \`${chunk.category}\`\n\n`
      }

      // Process content chunk
      const processedContent = processContentChunk(chunk.content)
      if (!processedContent) {
        logger.debug(`Skipping empty content for chunk: ${chunk.title}`)
        continue
      }

      response += processedContent + '\n\n'

      // Add source link (validate URL to prevent XSS)
      if (chunk.url && isValidUrl(chunk.url)) {
        response += `🔗 **[Read full documentation: ${chunk.title}](${chunk.url})**\n\n`
      } else if (chunk.url) {
        logger.warn(`Invalid URL skipped: ${chunk.url}`)
      }
    }

    // Additional resources (if available)
    if (sources.length > topResults.length) {
      response += `\n\n---\n\n### 📖 Additional Resources\n\n`
      const additionalSources = sources.slice(
        topResults.length,
        topResults.length + MAX_QUALITY_RESULTS
      )
      for (const source of additionalSources) {
        response += `- [${source.title}](${source.url})\n`
      }
    }

    // Footer
    response += `\n\n---\n\n<small>💡 *Generated from Clarity Chat documentation.*</small>`

    metrics.processingDuration = processingTimer.stop()
    metrics.responseLength = response.length
    
    logger.debug(`streamFromRAG: Built response (${response.length} chars) in ${metrics.processingDuration}ms`)

    // Split response into chunks for streaming
    const chunks = splitIntoChunks(response)
    metrics.chunksGenerated = chunks.length

    // Stream chunks with accumulated content for proper markdown rendering
    let accumulatedContent = ''
    const streamTimer = createTimer()
    streamTimer.start()
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      if (!chunk?.trim()) {
        logger.debug(`Skipping empty chunk at index ${i}`)
        continue
      }

      accumulatedContent += chunk

      yield {
        type: 'text',
        content: accumulatedContent,
      }

      // Adaptive delay between chunks for smooth streaming
      if (i < chunks.length - 1) {
        const delay =
          chunk.length > LARGE_CHUNK_THRESHOLD
            ? STREAM_DELAY_LARGE
            : STREAM_DELAY_SMALL
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
    
    metrics.streamingDuration = streamTimer.stop()
    metrics.totalDuration = totalTimer.stop()
    
    // Log comprehensive metrics
    logger.debug(`streamFromRAG: Completed successfully`, {
      metrics: {
        search: `${metrics.searchDuration}ms`,
        processing: `${metrics.processingDuration}ms`,
        streaming: `${metrics.streamingDuration}ms`,
        total: `${metrics.totalDuration}ms`,
        results: `${metrics.resultsUsed}/${metrics.resultsFound}`,
        chunks: metrics.chunksGenerated,
        responseLength: metrics.responseLength,
      },
    })
    
    // Signal completion
    yield { type: 'done' as const }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    const isTransient = isTransientError(error)
    
    metrics.totalDuration = totalTimer.stop()
    
    logger.error('RAG streaming error, falling back to demo mode:', {
      error: errorMessage,
      errorType: isTransient ? 'transient' : 'permanent',
      query: sanitizedQuery?.substring(0, 50) || 'unknown',
      stack: error instanceof Error ? error.stack : undefined,
      metrics: {
        searchDuration: metrics.searchDuration,
        totalDuration: metrics.totalDuration,
        resultsFound: metrics.resultsFound,
      },
    })

    // Graceful fallback to demo mode
    try {
      yield {
        type: 'text',
        content: `⚠️ I encountered an issue searching the documentation. Here's a general answer:\n\n---\n\n`,
      }
      yield* streamFromDemo(messages)
    } catch (fallbackError) {
      // If even fallback fails, yield error
      logger.error('Demo mode fallback also failed:', fallbackError)
      yield {
        type: 'error',
        content:
          'Unable to retrieve documentation. Please check your connection and try again.',
      }
    }
  }
}

/**
 * Demo/fallback streaming function when no API keys are configured
 */
export async function* streamFromDemo(
  messages: { role: string; content: string }[]
): AsyncGenerator<StreamChunk> {
  const lastMessage = messages[messages.length - 1]
  const query = lastMessage.content.toLowerCase()

  // Comprehensive simulated responses based on common queries
  const responses: Record<string, string> = {
    // Getting Started
    'getting started':
      'To get started with Clarity Chat, first install it via npm:\n\n```bash\nnpm install @clarity-chat/react\n```\n\nThen import and use the components:\n\n```tsx\nimport { ClarityChat } from "@clarity-chat/react"\nimport "@clarity-chat/react/styles.css"\n\nfunction App() {\n  return <ClarityChat api="/api/chat" />\n}\n```\n\nThat\'s it! You now have a fully functional chat interface. 🚀\n\n📖 **Learn more**: [Quick Start Guide](/guides/quick-start) | [Installation](/guides/installation)',
    install:
      'Install Clarity Chat with your preferred package manager:\n\n```bash\n# npm\nnpm install @clarity-chat/react\n\n# yarn\nyarn add @clarity-chat/react\n\n# pnpm\npnpm add @clarity-chat/react\n```\n\nMake sure you also have React 18+ installed as a peer dependency.\n\n📖 **Learn more**: [Installation Guide](/guides/installation)',

    // Streaming
    streaming:
      'Clarity Chat has built-in streaming support via Server-Sent Events (SSE):\n\n```tsx\nimport { useClarityChat } from "@clarity-chat/react"\n\nfunction Chat() {\n  const { messages, sendMessage, isLoading } = useClarityChat({\n    api: "/api/chat",\n    transport: "sse", // Enable streaming\n  })\n\n  return (\n    <ChatWindow\n      messages={messages}\n      onSendMessage={sendMessage}\n      isLoading={isLoading}\n    />\n  )\n}\n```\n\nStreaming provides real-time responses as tokens are generated.\n\n📖 **Learn more**: [Streaming Guide](/guides/streaming)',

    // Components
    components:
      'Clarity Chat provides **70+ pre-built components**:\n\n**Core Components:**\n- `<ClarityChat />` - Drop-in complete chat UI\n- `<ChatWindow />` - Main chat interface\n- `<ChatInput />` - Message input with auto-resize\n- `<MessageList />` - Virtualized message container\n- `<Message />` - Individual message display\n\n**Advanced Components:**\n- `<VoiceInput />` - Speech-to-text\n- `<FileUpload />` - Drag & drop file attachments\n- `<CommandPalette />` - Cmd+K interface\n- `<TokenCounter />` - Real-time token tracking\n- `<PromptSuggestions />` - AI-generated follow-ups\n\n📖 **Learn more**: [Component Reference](/reference/components)',

    // Hooks
    hook: 'Clarity Chat includes **35+ custom hooks**:\n\n**Core Hooks:**\n```tsx\nimport {\n  useClarityChat,    // Main chat hook\n  useStreamingSSE,   // SSE streaming\n  useTokenTracker,   // Token counting\n  useMessageOps,     // Edit/delete/regenerate\n} from "@clarity-chat/react"\n```\n\n**Utility Hooks:**\n- `useAutoScroll()` - Smart scrolling\n- `useClipboard()` - Copy-paste support\n- `useLocalStorage()` - Persistence\n- `useReducedMotion()` - Accessibility\n\n📖 **Learn more**: [Hooks Reference](/reference/hooks)',

    // Theming
    theme:
      'Customize Clarity Chat with **11 built-in themes** or create your own:\n\n```tsx\nimport { ClarityChat, themes } from "@clarity-chat/react"\n\n// Use a preset theme\n<ClarityChat theme={themes.dark} />\n\n// Or customize with CSS variables\n<ClarityChat\n  style={{\n    "--cc-primary": "#6366f1",\n    "--cc-bg": "#0f172a",\n  }}\n/>\n```\n\n**Available themes:** light, dark, system, ocean, forest, sunset, midnight, lavender, slate, rose, emerald\n\n📖 **Learn more**: [Theming Guide](/guides/theming)',

    // Memory
    memory:
      'Clarity Chat supports long-term conversation memory:\n\n```tsx\nimport { MemoryProvider, useClarityChat } from "@clarity-chat/react"\n\nfunction App() {\n  return (\n    <MemoryProvider strategy="sliding-window" maxTokens={4000}>\n      <Chat />\n    </MemoryProvider>\n  )\n}\n```\n\n**Memory strategies:**\n- `sliding-window` - Keep recent messages\n- `summary` - Compress old messages\n- `semantic` - Vector-based retrieval\n\n📖 **Learn more**: [Memory Guide](/guides/memory)',

    // Token optimization
    token:
      'Optimize costs with token tracking and budget management:\n\n```tsx\nimport { useTokenBudgetMonitor } from "@clarity-chat/react"\n\nconst {\n  currentTokens,\n  isNearLimit,\n  isCritical,\n} = useTokenBudgetMonitor({\n  maxTokens: 8000,\n  warningThreshold: 0.8,\n})\n```\n\nClarity Chat can reduce costs by **50-80%** with:\n- TOON format compression\n- Prompt caching\n- Smart model routing\n\n📖 **Learn more**: [Token Optimization](/guides/token-optimization)',

    // Accessibility
    accessib:
      'Clarity Chat is **WCAG 2.1 AAA compliant** with:\n\n- Full keyboard navigation\n- Screen reader support (ARIA labels)\n- Focus management\n- Reduced motion support\n- High contrast mode\n- RTL language support\n\n```tsx\nimport { useReducedMotion } from "@clarity-chat/react"\n\nconst prefersReducedMotion = useReducedMotion()\n```\n\n📖 **Learn more**: [Accessibility Guide](/guides/accessibility)',

    // Error handling
    error:
      'Handle errors gracefully with built-in error boundaries:\n\n```tsx\nimport { ErrorBoundary, useErrorRecovery } from "@clarity-chat/react"\n\nconst { retry, resetError } = useErrorRecovery({\n  maxRetries: 3,\n  onError: (error) => console.error(error),\n})\n\n<ErrorBoundary fallback={<ErrorMessage />}>\n  <ChatWindow />\n</ErrorBoundary>\n```\n\n📖 **Learn more**: [Error Handling](/guides/error-handling)',

    // Testing
    test: 'Test your chat components with our testing utilities:\n\n```tsx\nimport { render, screen } from "@testing-library/react"\nimport { ChatWindow } from "@clarity-chat/react"\n\ntest("renders chat input", () => {\n  render(<ChatWindow messages={[]} />)\n  expect(screen.getByRole("textbox")).toBeInTheDocument()\n})\n```\n\nWe provide mocks for streaming and API calls.\n\n📖 **Learn more**: [Testing Guide](/guides/testing)',

    // Props / API
    props:
      'Each component accepts typed props for full customization:\n\n```tsx\ninterface ChatWindowProps {\n  messages: Message[]\n  onSendMessage: (content: string) => void\n  isLoading?: boolean\n  placeholder?: string\n  maxLength?: number\n  theme?: Theme\n  className?: string\n}\n```\n\nAll props are documented with TSDoc comments for IntelliSense support.\n\n📖 **Learn more**: [API Reference](/reference/components)',

    // Examples
    example:
      'Check out our **30+ production-ready examples**:\n\n- Simple Chat Bot\n- Multi-turn Conversation\n- RAG with Documents\n- Voice Assistant\n- Customer Support Widget\n- Collaborative Chat\n- AI Code Assistant\n\nEach example includes full source code and live demos.\n\n📖 **Explore**: [Examples Gallery](/examples)',

    // Performance
    perform:
      'Clarity Chat is optimized for performance:\n\n- **Virtual scrolling** for 1000+ messages\n- **Lazy loading** of heavy components\n- **Memoized renders** with React.memo\n- **Code splitting** for smaller bundles\n\n```tsx\nimport { VirtualizedMessageList } from "@clarity-chat/react"\n\n<VirtualizedMessageList\n  messages={messages}\n  overscan={5}\n/>\n```\n\n📖 **Learn more**: [Performance Guide](/guides/performance)',
  }

  // Improved default response with contextual help
  const defaultResponse = `👋 **Welcome to Clarity Chat Demo Mode!**

I'm running without an API key, so I can only provide pre-defined answers. Here's what I can help with:

**📚 Documentation Topics:**
- Installation & getting started
- Streaming messages (SSE/WebSocket)
- Available components (70+)
- Hooks reference (35+)
- Theming & customization
- Memory & conversation history
- Token optimization
- Accessibility features
- Error handling
- Testing strategies

**🔗 Quick Links:**
- [Quick Start Guide](/guides/quick-start)
- [Component Reference](/reference/components)
- [Hooks Reference](/reference/hooks)
- [Examples Gallery](/examples)

**💡 Try asking:**
- "How do I install Clarity Chat?"
- "What components are available?"
- "How does streaming work?"
- "How do I customize the theme?"

*To enable full AI-powered responses, add your API key to \`.env.local\`*`

  // Find matching response with priority ordering
  let response = defaultResponse
  const priorityKeys = [
    'getting started',
    'install',
    'streaming',
    'components',
    'hook',
    'theme',
    'memory',
    'token',
    'accessib',
    'error',
    'test',
    'props',
    'example',
    'perform',
  ]

  for (const key of priorityKeys) {
    if (query.includes(key)) {
      response = responses[key]
      break
    }
  }

  // Calculate token estimates for demo mode transparency
  const inputTokens = Math.ceil(lastMessage.content.length / 4)
  const outputTokens = Math.ceil(response.length / 4)
  const matchedTopic =
    priorityKeys.find((key) => query.includes(key)) || 'default'

  // Stream the response smoothly in sentence-sized chunks
  // Split by sentences, code blocks, and line breaks for natural streaming
  const chunks: string[] = []
  
  // Split by code blocks first to preserve them
  const codeBlockRegex = /```[\s\S]*?```/g
  let lastIndex = 0
  let match
  
  while ((match = codeBlockRegex.exec(response)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      const textBefore = response.substring(lastIndex, match.index)
      // Split text by sentences, filtering out empty ones
      const sentences = textBefore.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || []
      chunks.push(...sentences.filter(s => s.trim().length > 0))
    }
    // Add code block as single chunk
    if (match[0].trim().length > 0) {
      chunks.push(match[0])
    }
    lastIndex = match.index + match[0].length
  }
  
  // Add remaining text
  if (lastIndex < response.length) {
    const remaining = response.substring(lastIndex)
    const sentences = remaining.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || []
    chunks.push(...sentences.filter(s => s.trim().length > 0))
  }
  
  // If no chunks found, use original response
  if (chunks.length === 0 && response.trim().length > 0) {
    chunks.push(response)
  }

  // Yield accumulated chunks for proper rendering
  let accumulatedContent = ''
  for (let i = 0; i < chunks.length; i++) {
    // Skip empty chunks
    if (!chunks[i] || chunks[i].trim().length === 0) {
      continue
    }
    
    accumulatedContent += chunks[i]
    
    yield {
      type: 'text',
      content: accumulatedContent, // Yield accumulated content
    }

    // Minimal delay for smooth animation - batch multiple small chunks
    // Only delay if not the last chunk and chunk is small
    if (i < chunks.length - 1) {
      const chunkSize = chunks[i].length
      // Smaller chunks get shorter delays, larger chunks (like code blocks) get slightly longer
      const delay = chunkSize > 100 ? 3 : chunkSize > 50 ? 5 : 8
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  // Add token usage footer in demo mode for transparency
  const tokenFooter = `\n\n---\n📊 **Demo Mode Stats:** ~${inputTokens} input tokens, ~${outputTokens} output tokens | Topic: ${matchedTopic}`

  yield {
    type: 'text',
    content: tokenFooter,
  }

  // Yield thinking chunk with metadata for UI consumption (before done signal)
  yield {
    type: 'thinking',
    data: {
      demoMode: true,
      matchedTopic,
      tokenEstimate: {
        input: inputTokens,
        output: outputTokens,
        total: inputTokens + outputTokens,
      },
    },
  }
  
  // Signal completion (must be last)
  yield { type: 'done' as const }
}

/**
 * Query complexity classification for smart model routing
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
    reason: 'Standard documentation query',
    suggestedModel: 'gpt-3.5-turbo',
    estimatedTokens: Math.ceil(query.length / 4) + 500,
  }
}

/**
 * Model routing configuration
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
 * Check if an API key is valid (not empty and not a placeholder)
 */
function isValidApiKey(key: string | undefined, type: 'openai' | 'anthropic' | 'gemini'): boolean {
  if (!key || key.trim().length === 0) {
    return false
  }

  const trimmedKey = key.trim().toLowerCase()

  // Common placeholder patterns (be careful not to match valid keys)
  const placeholderPatterns = [
    'your-',
    'placeholder',
    'example',
    'replace',
    'add-your',
    'paste-your',
    'enter-your',
    'sk-placeholder', // OpenAI placeholder
    'sk-ant-placeholder', // Anthropic placeholder
  ]

  // Check for placeholder patterns (but allow valid key prefixes)
  for (const pattern of placeholderPatterns) {
    if (trimmedKey.includes(pattern)) {
      return false
    }
  }
  
  // Check for incomplete keys that are just prefixes
  if (trimmedKey === 'sk-' || trimmedKey === 'sk-ant-') {
    return false
  }

  // Type-specific validation
  if (type === 'openai') {
    // OpenAI keys start with 'sk-' (or 'sk-proj-' for project keys) and are typically 51+ characters
    if (!trimmedKey.startsWith('sk-')) {
      return false
    }
    // Accept both regular keys (sk-) and project keys (sk-proj-)
    if (trimmedKey.length < 20) {
      return false
    }
  } else if (type === 'anthropic') {
    // Anthropic keys start with 'sk-ant-' and are typically 50+ characters
    if (!trimmedKey.startsWith('sk-ant-')) {
      return false
    }
    if (trimmedKey.length < 20) {
      return false
    }
  } else if (type === 'gemini') {
    // Gemini keys can vary in format, but should be substantial
    if (trimmedKey.length < 20) {
      return false
    }
  }

  return true
}

/**
 * Get the appropriate streaming function based on configured model
 */
export function getStreamingFunction():
  | typeof streamFromOpenAI
  | typeof streamFromClaude
  | typeof streamFromGemini
  | typeof streamFromDemo {
  // Check if any API key is configured (and not a placeholder)
  const openaiKey = process.env.OPENAI_API_KEY
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY
  
  const hasOpenAI = isValidApiKey(openaiKey, 'openai')
  const hasAnthropic = isValidApiKey(anthropicKey, 'anthropic')
  const hasGemini = isValidApiKey(geminiKey, 'gemini')

  // If no valid API keys, use demo mode
  if (!hasOpenAI && !hasAnthropic && !hasGemini) {
    logger.warn('⚠️  No valid API keys configured - using demo mode')
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
  logger.warn('⚠️  Configured model has no valid API key - using demo mode')
  return streamFromDemo
}

/**
 * Get streaming function with smart model routing based on query complexity
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
  // Check for valid API keys (not placeholders)
  const hasOpenAI = isValidApiKey(process.env.OPENAI_API_KEY, 'openai')
  const hasAnthropic = isValidApiKey(process.env.ANTHROPIC_API_KEY, 'anthropic')
  const hasGemini = isValidApiKey(process.env.GEMINI_API_KEY, 'gemini')

  // Classify query complexity
  const classification = classifyQueryComplexity(query, conversationLength)

  // If no valid API keys, use demo mode
  if (!hasOpenAI && !hasAnthropic && !hasGemini) {
    logger.warn('⚠️  No valid API keys configured - using demo mode for routing')
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
    available: isValidApiKey(openaiKey, 'openai'),
    model: PROVIDER_MODELS.openai,
  })

  // Check Anthropic
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  providers.push({
    name: 'anthropic',
    available: isValidApiKey(anthropicKey, 'anthropic'),
    model: PROVIDER_MODELS.anthropic,
  })

  // Check Google
  const googleKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
  providers.push({
    name: 'google',
    available: isValidApiKey(googleKey, 'gemini'),
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
  logger.error('Stream error:', error)

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
      logger.warn(`Attempt ${attempt + 1} failed:`, error)

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
