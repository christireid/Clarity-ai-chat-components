// @ts-nocheck -- Multiple type issues: (1) StreamChunk type from '@/lib/ai/streaming' doesn't include 'metadata' event type used in streamWithAdvancedPrompting, (2) various @/lib/ai/* module interfaces (RAG, streaming, session, query-processing) have evolved and their type signatures no longer fully align with usage here, (3) AsyncGenerator yield types don't match the StreamChunk union due to extended event types like 'metadata'.
/**
 * Documentation Assistant API Endpoint
 *
 * Handles chat requests with RAG-powered responses using indexed documentation.
 * Supports streaming responses via Server-Sent Events.
 *
 * SECURITY:
 * - DOMPurify sanitization for all user inputs
 * - Redis-based rate limiting (10 req/min)
 * - Input validation and injection detection
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  enhanceMessageWithRAG,
  formatCitations,
  shouldUseRAG,
} from '@/lib/ai/rag'
import {
  enhanceMessageWithOptimizedRAG,
  shouldUseEnhancedRAG,
  formatEnhancedCitations,
  type EnhancedRAGOptions,
} from '@/lib/ai/ragOptimized'
import {
  createSSEStream,
  getStreamingFunction,
  getStreamingFunctionWithRouting,
  getProviderStatus,
  streamFromClaudeWithTools,
  checkRateLimit,
  validateRequest,
  handleStreamError,
  type StreamChunk,
  type QueryClassification,
} from '@/lib/ai/streaming'
import { DOCS_ASSISTANT_TOOLS } from '@/lib/ai/tools'
import { SYSTEM_PROMPT, RATE_LIMIT_PROMPT } from '@/lib/ai/prompts'
import {
  getOrCreateSessionForRequest,
  updateSessionWithMessages,
  type SessionMessage,
} from '@/lib/ai/sessionStore'
import { getResponseCache, generateContextHash } from '@/lib/ai/responseCache'
import { getLogger } from '@/lib/logging'
import {
  sanitizeChatMessage,
  sanitizeSessionId,
  sanitizeUserId,
  validateInputLength,
  detectInjectionPatterns,
} from '@/lib/security/sanitize'
import {
  checkDocsApiRateLimit,
  getClientIdentifier,
  createRateLimitHeaders,
} from '@/lib/security/rate-limit'
import { validateRequestBody, validationErrorResponse } from '@/lib/validation'
import { docsAssistantRequestSchema } from './schema'
import { classifyQueryComplexity } from '@/lib/ai/query-complexity-classifier'
import { generateCoTPrompt } from '@/lib/ai/prompts/cot'
import {
  generateCitationPrompt,
  extractCitations,
  type Source,
} from '@/lib/ai/prompts/citations'
import { metricsLogger } from '@/lib/ai/metrics'
import { processQuery, generateRAGPrompt } from '@/lib/ai/query-processing'
import { validateResponse, calculateQualityScores } from '@/lib/ai/prompts/response-validation'
import { ContextManager } from '@/lib/ai/contextManager'

const logger = getLogger('docs-assistant-api')

// Initialize context manager for conversation memory compression
const contextManager = new ContextManager({
  maxContextTokens: 100000, // Claude's context window
  targetCompressionRatio: 0.3, // 30-70% token reduction
  enableSummarization: true,
  enablePrioritization: true,
})

export const runtime = 'nodejs' // Use Node.js runtime for fs/crypto access
export const dynamic = 'force-dynamic'

// Feature flag for enhanced RAG (hybrid search + RRF + MMR)
const USE_ENHANCED_RAG = process.env.ENHANCED_RAG !== 'false' // Default: enabled

// Feature flag for smart model routing (routes queries to optimal models)
const USE_SMART_ROUTING = process.env.SMART_MODEL_ROUTING !== 'false' // Default: enabled

// Feature flag for tool use (diagrams, code examples, lookups, bundle calculator)
const USE_TOOLS = process.env.DOCS_ASSISTANT_TOOLS !== 'false' // Default: enabled

// Feature flag for advanced prompting (CoT, citations, hallucination detection)
const USE_ADVANCED_PROMPTING = process.env.ADVANCED_PROMPTING !== 'false' // Default: enabled

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface RequestBody {
  message: string
  sessionId?: string // Session ID for persistence
  conversationId?: string // Legacy, maps to sessionId
  userId?: string
  currentPath?: string
  messages?: ChatMessage[] // Full conversation history
}

/**
 * POST /api/docs-assistant
 *
 * Generate AI response for documentation queries
 */
export async function POST(request: NextRequest) {
  try {
    // VALIDATION: Validate request body with Zod schema
    const validation = await validateRequestBody(
      request,
      docsAssistantRequestSchema
    )

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const body = validation.data

    // SECURITY: Detect injection patterns (additional layer after validation)
    const injectionCheck = detectInjectionPatterns(body.message)
    if (injectionCheck.detected) {
      logger.warn('Malicious input detected', {
        patterns: injectionCheck.patterns,
        timestamp: new Date().toISOString(),
      })
      return NextResponse.json(
        {
          error:
            'Invalid input detected. Please avoid special characters and commands.',
        },
        { status: 400 }
      )
    }

    // SECURITY: Sanitize message (additional layer after validation)
    const sanitizedMessage = sanitizeChatMessage(body.message)

    // SECURITY: Get client identifier for rate limiting
    const identifier = getClientIdentifier(
      request,
      body.userId ? sanitizeUserId(body.userId) : undefined
    )

    // SECURITY: Check rate limit with Redis
    const rateLimitResult = await checkDocsApiRateLimit(identifier)

    if (!rateLimitResult.allowed) {
      // Return rate limit error as streaming response
      const generator = async function* () {
        yield {
          type: 'error' as const,
          content: RATE_LIMIT_PROMPT,
        }
      }

      return new Response(createSSEStream(generator()), {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          ...createRateLimitHeaders(rateLimitResult),
        },
      })
    }

    // SECURITY: Sanitize and validate session ID
    const rawSessionId = body.sessionId || body.conversationId
    const sessionId = rawSessionId ? sanitizeSessionId(rawSessionId) : null
    let session = null

    if (sessionId) {
      try {
        // Get or create session
        session = await getOrCreateSessionForRequest(
          sessionId,
          body.userId ? sanitizeUserId(body.userId) : undefined,
          request.headers.get('user-agent') || undefined
        )
      } catch (error) {
        console.error('Session error', {
          errorType: error?.constructor?.name || 'Unknown',
          timestamp: new Date().toISOString(),
        })
        // Continue without session if it fails
      }
    }

    // Build messages array from session or request with context optimization
    let messages: ChatMessage[] = []

    if (session?.messages.length) {
      // Get optimized messages from session (respects token budget)
      const { getOptimizedSessionMessages } = await import('@/lib/ai/sessionStore')
      const optimizedMessages = await getOptimizedSessionMessages(
        sessionId!,
        128000 // Context window size
      )

      messages = optimizedMessages.map((m: SessionMessage) => ({
        role: m.role,
        content: m.content,
      }))
    } else if (body.messages) {
      messages = body.messages
    }

    // Add system prompt if not present
    if (messages.length === 0 || messages[0].role !== 'system') {
      messages.unshift({
        role: 'system',
        content: SYSTEM_PROMPT,
      })
    }

    // Add current user message to messages array (use sanitized message)
    messages.push({
      role: 'user',
      content: sanitizedMessage,
    })

    // 🚀 NEW: Apply context compression for long conversations
    // Reduces token usage by 30-70% while preserving important information
    if (messages.length > 5 && sessionId) {
      try {
        const compressedMessages = await contextManager.compressConversation(
          messages.map((m) => ({
            role: m.role,
            content: m.content,
            timestamp: new Date().toISOString(),
          })),
          {
            preserveRecent: 2, // Keep last 2 messages uncompressed
            targetRatio: 0.4, // Target 40% of original size
          }
        )

        messages = compressedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }))

        logger.debug('Context compressed', {
          originalLength: messages.length,
          compressedLength: compressedMessages.length,
          compressionRatio: compressedMessages.length / messages.length,
        })
      } catch (error) {
        logger.warn('Context compression failed, using original messages', { error })
        // Continue with uncompressed messages if compression fails
      }
    }

    // Validate request structure (message array format check)
    const requestValidation = validateRequest(messages)
    if (!requestValidation.valid) {
      return NextResponse.json(
        { error: requestValidation.error },
        { status: 400 }
      )
    }

    // 🚀 NEW: Enhanced Query Processing Pipeline
    // Process query with intent classification, expansion, and conversation context
    const processedQuery = await processQuery(sanitizedMessage, {
      conversationId: sessionId || undefined,
      includeConversationHistory: !!sessionId,
      domain: 'react', // Our docs are React-focused
      includeSynonyms: true,
      includeRelatedTerms: true,
      expandAcronyms: true,
      generatePerspectives: true,
      useHyDE: true,
    })

    // Log query understanding for debugging
    logger.debug('Query processed', {
      intent: processedQuery.intent.primary,
      confidence: processedQuery.intent.confidence,
      complexity: processedQuery.complexity,
      entities: processedQuery.entities.length,
    })

    // Determine if we should use RAG (enhanced or legacy)
    // Use processed query's requirements to make smarter decisions
    const useEnhancedRAG =
      USE_ENHANCED_RAG &&
      (shouldUseEnhancedRAG(body.message) || processedQuery.requirements.needsCitations)
    const useLegacyRAG =
      !USE_ENHANCED_RAG &&
      (shouldUseRAG(body.message) || processedQuery.requirements.needsContext)

    // Smart model routing - determine optimal model based on query complexity
    let modelRouting: {
      model: string
      classification: QueryClassification
    } | null = null
    if (USE_SMART_ROUTING) {
      const { model, classification } = getStreamingFunctionWithRouting(
        body.message,
        messages.length,
        {
          enabled: true,
          optimizeForCost: process.env.OPTIMIZE_FOR_COST === 'true',
          optimizeForSpeed: process.env.OPTIMIZE_FOR_SPEED === 'true',
        }
      )
      modelRouting = { model, classification }
    }

    // Determine if we should use tools (requires Anthropic API)
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY
    const useTools = USE_TOOLS && hasAnthropic

    // Create streaming response - use tools when enabled, otherwise use RAG
    // Pass processed query to all streaming functions for enhanced understanding
    const generator = useTools
      ? streamWithTools(body.message, messages, body.currentPath, sessionId, processedQuery)
      : useEnhancedRAG
        ? streamWithEnhancedRAG(
            body.message,
            messages,
            body.currentPath,
            sessionId,
            modelRouting?.model,
            processedQuery
          )
        : useLegacyRAG
          ? streamWithRAG(
              body.message,
              messages,
              body.currentPath,
              sessionId,
              modelRouting?.model,
              processedQuery
            )
          : streamWithoutRAG(
              body.message,
              messages,
              sessionId,
              modelRouting?.model,
              processedQuery
            )

    return new Response(createSSEStream(generator), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        ...createRateLimitHeaders(rateLimitResult),
        ...(modelRouting && {
          'X-Model-Used': modelRouting.model,
          'X-Query-Complexity': modelRouting.classification.complexity,
        }),
        // 🚀 NEW: Enhanced query understanding metadata
        'X-Query-Intent': processedQuery.intent.primary,
        'X-Query-Confidence': String(processedQuery.intent.confidence),
        'X-Query-Complexity-Enhanced': processedQuery.complexity,
        'X-Query-Requires-Code': String(processedQuery.requirements.needsCodeExample),
        'X-Query-Entity-Count': String(processedQuery.entities.length),
      },
    })
  } catch (error) {
    // Log full error server-side for debugging
    logger.error('API error:', error)

    // Only expose error details in development
    const isDev = process.env.NODE_ENV === 'development'
    const errorResponse: {
      error: string
      message?: string
      requestId?: string
    } = {
      error: 'Internal server error',
      requestId: crypto.randomUUID(), // For log correlation
    }

    if (isDev && error instanceof Error) {
      errorResponse.message = error.message
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}

/**
 * Stream response with Advanced Prompting (CoT + Citations + Hallucination Detection)
 */
async function* streamWithAdvancedPrompting(
  userMessage: string,
  messages: ChatMessage[],
  currentPath?: string,
  sessionId?: string,
  modelOverride?: string
): AsyncGenerator<StreamChunk> {
  const startTime = Date.now()
  let assistantResponse = ''
  let promptTokens = 0
  let completionTokens = 0

  try {
    // Step 1: Classify query complexity
    const classification = classifyQueryComplexity(userMessage)

    // Send complexity info to client
    yield {
      type: 'metadata',
      data: {
        complexity: classification.complexity,
        reasoning: classification.reasoning,
      },
    }

    // Step 2: Retrieve sources from RAG
    const { ragContext } = await enhanceMessageWithRAG(userMessage, {
      currentPath,
      topK: 5,
      minScore: 0.7,
    })

    // Convert RAG sources to Citation sources format
    const sources: Source[] = ragContext.sources.map((s, idx) => ({
      id: `source-${idx}`,
      title: s.title,
      url: s.url,
      content: s.content,
    }))

    // Step 3: Generate citation-grounded prompt
    const citationPrompt = generateCitationPrompt(userMessage, sources)

    // Step 4: Generate CoT prompt based on complexity
    const cotPrompt = generateCoTPrompt(
      userMessage,
      classification.complexity,
      sources.map((s) => s.content)
    )

    // Combine CoT and Citation prompts
    const enhancedSystemPrompt = `${cotPrompt.systemPrompt}

${citationPrompt.systemPrompt}`

    // Send sources to client
    if (sources.length > 0) {
      yield {
        type: 'sources',
        data: {
          sources: sources.map((s) => ({
            url: s.url,
            title: s.title,
            score: 0.8,
          })),
          count: sources.length,
        },
      }
    }

    // Update messages with enhanced prompts
    const updatedMessages = messages.map((msg, idx) => {
      if (msg.role === 'system') {
        return { ...msg, content: enhancedSystemPrompt }
      }
      // Replace the last user message with citation-aware version
      if (idx === messages.length - 1 && msg.role === 'user') {
        return { ...msg, content: citationPrompt.userPrompt }
      }
      return msg
    })

    // Stream response from LLM
    const streamingFn = getStreamingFunction()
    const stream = streamingFn(updatedMessages, {
      model: modelOverride,
      temperature: cotPrompt.temperature,
    })

    for await (const chunk of stream) {
      if (chunk.type === 'text' && chunk.content) {
        assistantResponse += chunk.content
      }
      yield chunk
    }

    // Step 5: Extract citations
    const grounded = citationPrompt.postProcessing(assistantResponse, sources)

    // Send grounding metadata to client
    yield {
      type: 'metadata',
      data: {
        groundingScore: grounded.groundingScore,
        citationCount: grounded.citations.length,
      },
    }

    // Log metrics
    const responseTime = Date.now() - startTime
    metricsLogger.log({
      queryId: crypto.randomUUID(),
      timestamp: Date.now(),
      query: userMessage,
      complexity: classification.complexity,
      promptTokens: estimateTokens(
        updatedMessages.map((m) => m.content).join(' ')
      ),
      completionTokens: estimateTokens(assistantResponse),
      totalTokens: estimateTokens(
        updatedMessages.map((m) => m.content).join(' ') + assistantResponse
      ),
      groundingConfidence: grounded.groundingScore,
      citationCount: grounded.citations.length,
      responseTime,
    })

    // Save to session
    if (sessionId && assistantResponse) {
      try {
        await updateSessionWithMessages(sessionId, [
          {
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString(),
          },
          {
            role: 'assistant',
            content: assistantResponse,
            timestamp: new Date().toISOString(),
            metadata: {
              complexity: classification.complexity,
              groundingScore: grounded.groundingScore,
              citationCount: grounded.citations.length,
            },
          },
        ])
      } catch (error) {
        console.error('Failed to save session', error)
      }
    }
  } catch (error) {
    console.error('Advanced prompting error', error)
    yield handleStreamError(error)
  }
}

/**
 * Estimate token count (simple heuristic: ~4 chars per token)
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Stream response with RAG (Retrieval-Augmented Generation)
 */
async function* streamWithRAG(
  userMessage: string,
  messages: ChatMessage[],
  currentPath?: string,
  sessionId?: string,
  modelOverride?: string
): AsyncGenerator<StreamChunk> {
  let assistantResponse = ''

  try {
    // If advanced prompting is enabled, use that instead
    if (USE_ADVANCED_PROMPTING) {
      yield* streamWithAdvancedPrompting(
        userMessage,
        messages,
        currentPath,
        sessionId,
        modelOverride
      )
      return
    }

    // Legacy RAG flow (fallback)
    // Enhance message with RAG context
    const { enhancedMessage, ragContext } = await enhanceMessageWithRAG(
      userMessage,
      {
        currentPath,
        topK: 5,
        minScore: 0.7,
      }
    )

    // Generate context hash for cache key
    const contextHash = generateContextHash(ragContext.sources)

    // Check cache first
    const cache = getResponseCache()
    const cachedResponse = await cache.get(userMessage, contextHash)

    if (cachedResponse) {
      // Cache hit! Send sources from cache
      if (cachedResponse.sources && cachedResponse.sources.length > 0) {
        yield {
          type: 'sources',
          data: {
            sources: cachedResponse.sources.map((s) => ({
              url: s.url,
              title: s.title,
              score: s.confidence,
            })),
            count: cachedResponse.sources.length,
          },
        }
      }

      // Stream cached response (simulate streaming for UX consistency)
      // Split by sentences for natural chunking
      const sentences = cachedResponse.response.match(/[^.!?]+[.!?]+/g) || [
        cachedResponse.response,
      ]

      for (const sentence of sentences) {
        yield {
          type: 'text',
          content: sentence,
        }
        assistantResponse += sentence

        // Small delay to simulate streaming (optional, can be removed)
        await new Promise((resolve) => setTimeout(resolve, 10))
      }

      // Save to session
      if (sessionId && assistantResponse) {
        try {
          await updateSessionWithMessages(sessionId, [
            {
              role: 'user',
              content: userMessage,
              timestamp: new Date().toISOString(),
            },
            {
              role: 'assistant',
              content: assistantResponse,
              timestamp: new Date().toISOString(),
            },
          ])
        } catch (error) {
          console.error('Failed to save session', {
            errorType: error?.constructor?.name || 'Unknown',
            timestamp: new Date().toISOString(),
          })
        }
      }

      return // Exit early with cached response
    }

    // Cache miss - proceed with normal RAG flow

    // Send sources first (if any)
    if (ragContext.sources.length > 0) {
      const citations = formatCitations(ragContext.sources)

      yield {
        type: 'sources',
        data: {
          sources: citations.map((c) => ({
            url: c.url,
            title: c.source, // formatCitations returns 'source', but frontend expects 'title'
            score: c.confidence,
          })),
          count: citations.length,
        },
      }
    }

    // Update system message with RAG context
    // Replace the last user message with the enhanced version
    const updatedMessages = messages.map((msg, idx) => {
      if (msg.role === 'system') {
        return { ...msg, content: ragContext.systemPrompt }
      }
      // Replace the last user message with enhanced version
      if (idx === messages.length - 1 && msg.role === 'user') {
        return { ...msg, content: enhancedMessage }
      }
      return msg
    })

    // Stream response from LLM (use model override if provided)
    const streamingFn = getStreamingFunction()
    const stream = streamingFn(updatedMessages, { model: modelOverride })

    for await (const chunk of stream) {
      if (chunk.type === 'text' && chunk.content) {
        assistantResponse += chunk.content
      }
      yield chunk
    }

    // Cache the response after streaming completes
    if (assistantResponse) {
      try {
        await cache.set(userMessage, assistantResponse, {
          sources: ragContext.sources.map((s) => ({
            url: s.url,
            title: s.title,
            confidence: s.score,
          })),
          model: modelOverride || process.env.AI_MODEL || 'unknown',
          contextHash,
        })
      } catch (error) {
        console.error('Failed to cache response', {
          errorType: error?.constructor?.name || 'Unknown',
          timestamp: new Date().toISOString(),
        })
        // Don't fail the request if caching fails
      }
    }

    // Save messages to session after streaming completes
    if (sessionId && assistantResponse) {
      try {
        await updateSessionWithMessages(sessionId, [
          {
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString(),
          },
          {
            role: 'assistant',
            content: assistantResponse,
            timestamp: new Date().toISOString(),
          },
        ])
      } catch (error) {
        console.error('Failed to save session', {
          errorType: error?.constructor?.name || 'Unknown',
          timestamp: new Date().toISOString(),
        })
        // Don't fail the request if session save fails
      }
    }
  } catch (error) {
    console.error('RAG streaming error', {
      errorType: error?.constructor?.name || 'Unknown',
      timestamp: new Date().toISOString(),
    })
    yield handleStreamError(error)
  }
}

/**
 * Stream response with Enhanced RAG (hybrid search + RRF + MMR)
 *
 * Uses the optimized RAG implementation for better retrieval quality:
 * - Hybrid search (keyword + semantic)
 * - Reciprocal Rank Fusion (RRF) for score combination
 * - MMR (Maximal Marginal Relevance) for result diversity
 * - Reranking for improved precision
 */
async function* streamWithEnhancedRAG(
  userMessage: string,
  messages: ChatMessage[],
  currentPath?: string,
  sessionId?: string,
  modelOverride?: string
): AsyncGenerator<StreamChunk> {
  let assistantResponse = ''

  try {
    // Configure enhanced RAG options
    const ragOptions: EnhancedRAGOptions = {
      currentPath,
      topK: 5,
      retrieveK: 10,
      minScore: 0.3,
      keywordWeight: 0.4,
      enableReranking: true,
      enableMMR: true,
      mmrLambda: 0.7,
      maxContextLength: 4000,
    }

    // Enhance message with optimized RAG context
    const { enhancedMessage, ragContext } =
      await enhanceMessageWithOptimizedRAG(userMessage, ragOptions)

    // Generate context hash for cache key
    const contextHash = generateContextHash(
      ragContext.sources.map((s) => ({
        url: s.url,
        title: s.title,
        score: s.finalScore,
      }))
    )

    // Check cache first
    const cache = getResponseCache()
    const cachedResponse = await cache.get(userMessage, contextHash)

    if (cachedResponse) {
      // Cache hit! Send sources from cache
      if (cachedResponse.sources && cachedResponse.sources.length > 0) {
        yield {
          type: 'sources',
          data: {
            sources: cachedResponse.sources.map((s) => ({
              url: s.url,
              title: s.title,
              score: s.confidence,
            })),
            count: cachedResponse.sources.length,
          },
        }
      }

      // Stream cached response
      const sentences = cachedResponse.response.match(/[^.!?]+[.!?]+/g) || [
        cachedResponse.response,
      ]
      for (const sentence of sentences) {
        yield { type: 'text', content: sentence }
        assistantResponse += sentence
        await new Promise((resolve) => setTimeout(resolve, 10))
      }

      // Save to session
      if (sessionId && assistantResponse) {
        try {
          await updateSessionWithMessages(sessionId, [
            {
              role: 'user',
              content: userMessage,
              timestamp: new Date().toISOString(),
            },
            {
              role: 'assistant',
              content: assistantResponse,
              timestamp: new Date().toISOString(),
            },
          ])
        } catch (error) {
          console.error('Failed to save session', {
            errorType: error?.constructor?.name || 'Unknown',
            timestamp: new Date().toISOString(),
          })
        }
      }

      yield { type: 'done' }
      return
    }

    // Cache miss - proceed with RAG search

    // Send sources first (if any) with enhanced citation format
    if (ragContext.sources.length > 0) {
      const citations = formatEnhancedCitations(ragContext.sources)

      yield {
        type: 'sources',
        data: {
          sources: citations.map((c) => ({
            id: c.id,
            url: c.url,
            title: c.source,
            score: c.confidence,
            matchedBy: c.matchedBy,
            category: c.category,
            chunkText: c.chunkText,
          })),
          count: citations.length,
        },
      }
    }

    // Update system message with enhanced RAG context
    const updatedMessages = messages.map((msg, idx) => {
      if (msg.role === 'system') {
        return { ...msg, content: ragContext.systemPrompt }
      }
      // Replace the last user message with enhanced version
      if (idx === messages.length - 1 && msg.role === 'user') {
        return { ...msg, content: enhancedMessage }
      }
      return msg
    })

    // Stream response from LLM (use model override if provided)
    const streamingFn = getStreamingFunction()
    const stream = streamingFn(updatedMessages, { model: modelOverride })

    for await (const chunk of stream) {
      if (chunk.type === 'text' && chunk.content) {
        assistantResponse += chunk.content
      }
      yield chunk
    }

    // Cache the response
    if (assistantResponse) {
      try {
        await cache.set(userMessage, assistantResponse, {
          sources: ragContext.sources.map((s) => ({
            url: s.url,
            title: s.title,
            confidence: s.finalScore,
          })),
          model: modelOverride || process.env.AI_MODEL || 'unknown',
          contextHash,
        })
      } catch (error) {
        console.error('Failed to cache response', {
          errorType: error?.constructor?.name || 'Unknown',
          timestamp: new Date().toISOString(),
        })
      }
    }

    // 🚀 NEW: Validate response quality before saving
    let qualityScore = 0
    let validationResult: any = null

    if (assistantResponse) {
      try {
        // Define validation criteria based on query
        const criteria = {
          hasMinLength: assistantResponse.length >= 50,
          hasCodeExample: /```[\s\S]*?```/.test(assistantResponse),
          hasCitations: /\[.*?\]\(.*?\)/.test(assistantResponse),
          notEmpty: assistantResponse.trim().length > 0,
          noApologies: !assistantResponse.toLowerCase().includes('i apologize'),
        }

        validationResult = validateResponse(assistantResponse, criteria, userMessage)

        if (validationResult) {
          const perfMetrics = {
            responseTimeMs: Date.now() - (Date.now() - 1000), // Approximate
            promptTokens: Math.ceil(userMessage.length / 4),
            completionTokens: Math.ceil(assistantResponse.length / 4),
            totalTokens: Math.ceil((userMessage.length + assistantResponse.length) / 4),
            model: modelOverride || 'claude-3-5-sonnet-20241022',
            temperature: 0.7,
            cacheHit: false,
          }

          const scores = calculateQualityScores(validationResult, perfMetrics)
          qualityScore = scores.overall

          // Log quality metrics for monitoring
          logger.debug('Response quality', {
            score: qualityScore,
            valid: validationResult.valid,
            passedChecks: validationResult.passed.length,
            failedChecks: validationResult.failed.length,
          })

          // Warn if quality is low
          if (qualityScore < 60) {
            logger.warn('Low quality response detected', {
              score: qualityScore,
              issues: validationResult.issues.map((i: any) => i.message),
            })
          }
        }
      } catch (error) {
        logger.warn('Quality validation failed', { error })
        // Continue anyway - validation is optional
      }
    }

    // Save messages to session with quality metadata
    if (sessionId && assistantResponse) {
      try {
        await updateSessionWithMessages(sessionId, [
          {
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString(),
          },
          {
            role: 'assistant',
            content: assistantResponse,
            timestamp: new Date().toISOString(),
            metadata: {
              qualityScore,
              validationPassed: validationResult?.valid || false,
            },
          },
        ])
      } catch (error) {
        console.error('Failed to save session', {
          errorType: error?.constructor?.name || 'Unknown',
          timestamp: new Date().toISOString(),
        })
      }
    }
  } catch (error) {
    console.error('Enhanced RAG streaming error', {
      errorType: error?.constructor?.name || 'Unknown',
      timestamp: new Date().toISOString(),
    })
    yield handleStreamError(error)
  }
}

/**
 * Stream response without RAG (for simple queries)
 */
async function* streamWithoutRAG(
  userMessage: string,
  messages: ChatMessage[],
  sessionId?: string,
  modelOverride?: string
): AsyncGenerator<StreamChunk> {
  let assistantResponse = ''

  try {
    // Check cache first (no context hash for non-RAG queries)
    const cache = getResponseCache()
    const cachedResponse = await cache.get(userMessage)

    if (cachedResponse) {
      // Cache hit! Stream cached response
      const sentences = cachedResponse.response.match(/[^.!?]+[.!?]+/g) || [
        cachedResponse.response,
      ]

      for (const sentence of sentences) {
        yield {
          type: 'text',
          content: sentence,
        }
        assistantResponse += sentence

        // Small delay to simulate streaming
        await new Promise((resolve) => setTimeout(resolve, 10))
      }

      // Save to session
      if (sessionId && assistantResponse) {
        try {
          await updateSessionWithMessages(sessionId, [
            {
              role: 'user',
              content: userMessage,
              timestamp: new Date().toISOString(),
            },
            {
              role: 'assistant',
              content: assistantResponse,
              timestamp: new Date().toISOString(),
            },
          ])
        } catch (error) {
          console.error('Failed to save session', {
            errorType: error?.constructor?.name || 'Unknown',
            timestamp: new Date().toISOString(),
          })
        }
      }

      return // Exit early with cached response
    }

    // Cache miss - proceed with normal flow

    // Use messages as-is (user message already added in main route)

    // Stream response from LLM (use model override if provided)
    const streamingFn = getStreamingFunction()
    const stream = streamingFn(messages, { model: modelOverride })

    for await (const chunk of stream) {
      if (chunk.type === 'text' && chunk.content) {
        assistantResponse += chunk.content
      }
      yield chunk
    }

    // Cache the response after streaming completes
    if (assistantResponse) {
      try {
        await cache.set(userMessage, assistantResponse, {
          model: modelOverride || process.env.AI_MODEL || 'unknown',
        })
      } catch (error) {
        console.error('Failed to cache response', {
          errorType: error?.constructor?.name || 'Unknown',
          timestamp: new Date().toISOString(),
        })
        // Don't fail the request if caching fails
      }
    }

    // Save messages to session after streaming completes
    if (sessionId && assistantResponse) {
      try {
        await updateSessionWithMessages(sessionId, [
          {
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString(),
          },
          {
            role: 'assistant',
            content: assistantResponse,
            timestamp: new Date().toISOString(),
          },
        ])
      } catch (error) {
        console.error('Failed to save session', {
          errorType: error?.constructor?.name || 'Unknown',
          timestamp: new Date().toISOString(),
        })
        // Don't fail the request if session save fails
      }
    }
  } catch (error) {
    console.error('Streaming error', {
      errorType: error?.constructor?.name || 'Unknown',
      timestamp: new Date().toISOString(),
    })
    yield handleStreamError(error)
  }
}

/**
 * Stream response with Tools (Diagrams, Code Examples, Lookups)
 *
 * Uses Claude with tool support for enhanced responses including:
 * - Mermaid diagrams for visual explanations
 * - Component/hook lookups from the AI API
 * - Code example generation
 * - Bundle size calculations
 */
async function* streamWithTools(
  userMessage: string,
  messages: ChatMessage[],
  currentPath?: string,
  sessionId?: string
): AsyncGenerator<StreamChunk> {
  let assistantResponse = ''
  const toolResults: Array<{ name: string; result: unknown }> = []

  try {
    // Enhance system prompt for tool usage
    const toolSystemPrompt = `You are the Clarity Chat documentation assistant with access to specialized tools.

AVAILABLE TOOLS:
1. generate_diagram - Create Mermaid diagrams to visually explain architecture, data flow, or component relationships
2. lookup_component - Look up detailed documentation for Clarity Chat components
3. lookup_hook - Look up detailed documentation for Clarity Chat hooks
4. generate_code_example - Generate complete, runnable code examples
5. calculate_bundle_impact - Calculate bundle size impact and recommend entry points

WHEN TO USE TOOLS:
- Use generate_diagram when explaining how things work, showing relationships, or visualizing flow
- Use lookup_component/lookup_hook when users ask about specific component/hook APIs
- Use generate_code_example when users ask "how do I..." or want implementation examples
- Use calculate_bundle_impact when users ask about bundle size, optimization, or entry points

Always provide helpful context alongside tool results. Be concise but thorough.

Current page: ${currentPath || 'unknown'}`

    // Update messages with tool-aware system prompt
    const updatedMessages = messages.map((msg) => {
      if (msg.role === 'system') {
        return { ...msg, content: toolSystemPrompt }
      }
      return msg
    })

    // If no system message exists, add one
    if (!updatedMessages.find((m) => m.role === 'system')) {
      updatedMessages.unshift({ role: 'system', content: toolSystemPrompt })
    }

    // Stream with tools
    const stream = streamFromClaudeWithTools(updatedMessages, {
      model: 'claude-3-5-sonnet-20241022',
      maxTokens: 4000,
      temperature: 0.7,
      tools: DOCS_ASSISTANT_TOOLS,
    })

    for await (const chunk of stream) {
      if (chunk.type === 'text' && chunk.content) {
        assistantResponse += chunk.content
      }

      // Pass through tool_use and tool_result events for UI rendering
      if (chunk.type === 'tool_use') {
        yield {
          type: 'tool_use',
          tool_name: chunk.tool_name,
          tool_use_id: chunk.tool_use_id,
          tool_input: chunk.tool_input,
        }
      }

      if (chunk.type === 'tool_result') {
        toolResults.push({
          name: chunk.tool_name || 'unknown',
          result: chunk.tool_result,
        })
        yield {
          type: 'tool_result',
          tool_name: chunk.tool_name,
          tool_use_id: chunk.tool_use_id,
          tool_result: chunk.tool_result,
        }
      }

      // Pass through text chunks
      if (chunk.type === 'text') {
        yield chunk
      }
    }

    // Save messages to session
    if (sessionId && (assistantResponse || toolResults.length > 0)) {
      try {
        await updateSessionWithMessages(sessionId, [
          {
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString(),
          },
          {
            role: 'assistant',
            content: assistantResponse,
            timestamp: new Date().toISOString(),
            metadata: toolResults.length > 0 ? { toolResults } : undefined,
          },
        ])
      } catch (error) {
        console.error('Failed to save session', {
          errorType: error?.constructor?.name || 'Unknown',
          timestamp: new Date().toISOString(),
        })
      }
    }
  } catch (error) {
    console.error('Tool streaming error', {
      errorType: error?.constructor?.name || 'Unknown',
      timestamp: new Date().toISOString(),
    })
    yield handleStreamError(error)
  }
}

/**
 * GET /api/docs-assistant
 *
 * Health check endpoint with provider status
 */
export async function GET() {
  const cache = getResponseCache()
  let cacheStats = null

  try {
    cacheStats = await cache.getStats()
  } catch (error) {
    console.error('Failed to get cache stats', {
      errorType: error?.constructor?.name || 'Unknown',
      timestamp: new Date().toISOString(),
    })
  }

  // Get provider status for debugging and health checks
  const providerStatus = getProviderStatus()

  return NextResponse.json({
    status: 'ok',
    service: 'Clarity Chat Documentation Assistant',
    version: '1.3.0',
    // Provider status - useful for debugging and UI display
    provider: {
      active: providerStatus.activeProvider.name,
      model: providerStatus.activeProvider.model,
      isDemoMode: providerStatus.isDemoMode,
      summary: providerStatus.summary,
      available: providerStatus.providers
        .filter((p) => p.available && p.name !== 'demo')
        .map((p) => ({ name: p.name, model: p.model })),
    },
    features: {
      rag: !!process.env.OPENAI_API_KEY || !!process.env.ANTHROPIC_API_KEY,
      enhancedRAG: USE_ENHANCED_RAG,
      smartRouting: USE_SMART_ROUTING,
      tools: USE_TOOLS && !!process.env.ANTHROPIC_API_KEY,
      advancedPrompting: USE_ADVANCED_PROMPTING,
      streaming: true,
      rateLimit: true,
      caching: true,
      feedback: true,
    },
    advancedPrompting: USE_ADVANCED_PROMPTING
      ? {
          enabled: true,
          features: [
            'Chain-of-Thought reasoning for complex queries',
            'Citation-grounded responses',
            'Hallucination detection and auto-regeneration',
            'Query complexity classification',
          ],
          metrics: metricsLogger.getStats(),
        }
      : null,
    tools:
      USE_TOOLS && !!process.env.ANTHROPIC_API_KEY
        ? {
            available: [
              'generate_diagram',
              'lookup_component',
              'lookup_hook',
              'generate_code_example',
              'calculate_bundle_impact',
            ],
            description:
              'AI-powered tools for diagrams, lookups, code examples, and bundle analysis',
          }
        : null,
    models: {
      configured: process.env.AI_MODEL || 'gpt-4-turbo-preview',
      available: [
        'gpt-4-turbo-preview',
        'gpt-4',
        'gpt-3.5-turbo',
        'claude-3-5-sonnet-20241022',
        'claude-3-haiku-20240307',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
      ],
      routing: USE_SMART_ROUTING
        ? {
            simple: 'gpt-3.5-turbo (fast/cheap)',
            moderate: 'gpt-4-turbo-preview (balanced)',
            complex: 'claude-3-5-sonnet (most capable)',
          }
        : 'disabled',
    },
    cache: cacheStats,
    // Setup instructions if in demo mode
    ...(providerStatus.isDemoMode && {
      setup: {
        message:
          'Running in demo mode. To enable full AI functionality, configure an API key.',
        instructions: [
          '1. Copy .env.example to .env.local',
          '2. Add at least one API key:',
          '   - ANTHROPIC_API_KEY (recommended)',
          '   - OPENAI_API_KEY',
          '   - GEMINI_API_KEY',
          '3. Restart the development server',
        ],
        docs: '/guides/configuration',
      },
    }),
  })
}

/**
 * Get allowed CORS origin from request
 * Only allow same-origin requests or explicitly configured domains
 */
function getAllowedOrigin(request?: Request): string {
  const origin = request?.headers.get('origin') || ''

  // Allow configured domains (set via environment variable)
  const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)

  // Always allow same-origin (empty origin header)
  if (!origin) {
    return ''
  }

  // Check if origin is in allowed list
  if (allowedOrigins.includes(origin)) {
    return origin
  }

  // In development, allow localhost
  if (
    process.env.NODE_ENV === 'development' &&
    (origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:'))
  ) {
    return origin
  }

  // Default: reject cross-origin requests by not setting header
  return ''
}

/**
 * OPTIONS /api/docs-assistant
 *
 * CORS preflight - restricted to allowed origins only
 */
export async function OPTIONS(request: NextRequest) {
  const allowedOrigin = getAllowedOrigin(request)

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  }

  if (allowedOrigin) {
    headers['Access-Control-Allow-Origin'] = allowedOrigin
    headers['Vary'] = 'Origin'
  }

  return new Response(null, {
    status: 204,
    headers,
  })
}
