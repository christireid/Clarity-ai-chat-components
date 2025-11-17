/**
 * Documentation Assistant API Endpoint
 *
 * Handles chat requests with RAG-powered responses using indexed documentation.
 * Supports streaming responses via Server-Sent Events.
 */

import { NextRequest, NextResponse } from 'next/server'
import { enhanceMessageWithRAG, formatCitations, shouldUseRAG } from '@/lib/ai/rag'
import {
  createSSEStream,
  getStreamingFunction,
  checkRateLimit,
  validateRequest,
  handleStreamError,
  type StreamChunk,
} from '@/lib/ai/streaming'
import { SYSTEM_PROMPT, ERROR_PROMPT, RATE_LIMIT_PROMPT } from '@/lib/ai/prompts'
import {
  getOrCreateSessionForRequest,
  updateSessionWithMessages,
  type SessionMessage,
} from '@/lib/ai/sessionStore'

export const runtime = 'edge' // Use Edge runtime for better performance
export const dynamic = 'force-dynamic'

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
    // Parse request body
    const body = (await request.json()) as RequestBody

    if (!body.message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get user identifier for rate limiting (IP or userId)
    const identifier = body.userId || request.ip || 'anonymous'

    // Check rate limit
    const rateLimit = checkRateLimit(
      identifier,
      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
      parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000')
    )

    if (!rateLimit.allowed) {
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
          'Connection': 'keep-alive',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
        },
      })
    }

    // Session management
    const sessionId = body.sessionId || body.conversationId
    let session = null

    if (sessionId) {
      try {
        // Get or create session
        session = await getOrCreateSessionForRequest(
          sessionId,
          body.userId,
          request.headers.get('user-agent') || undefined
        )
      } catch (error) {
        console.error('Session error:', error)
        // Continue without session if it fails
      }
    }

    // Build messages array from session or request
    const messages: ChatMessage[] = session?.messages.length
      ? session.messages.map((m: SessionMessage) => ({
          role: m.role,
          content: m.content,
        }))
      : body.messages || []

    // Add system prompt if not present
    if (messages.length === 0 || messages[0].role !== 'system') {
      messages.unshift({
        role: 'system',
        content: SYSTEM_PROMPT,
      })
    }

    // Validate request
    const validation = validateRequest(messages)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Determine if we should use RAG
    const useRAG = shouldUseRAG(body.message)

    // Create streaming response
    const generator = useRAG
      ? streamWithRAG(body.message, messages, body.currentPath, sessionId)
      : streamWithoutRAG(body.message, messages, sessionId)

    return new Response(createSSEStream(generator), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
      },
    })
  } catch (error) {
    console.error('API error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Stream response with RAG (Retrieval-Augmented Generation)
 */
async function* streamWithRAG(
  userMessage: string,
  messages: ChatMessage[],
  currentPath?: string,
  sessionId?: string
): AsyncGenerator<StreamChunk> {
  let assistantResponse = ''

  try {
    // Enhance message with RAG context
    const { enhancedMessage, ragContext } = await enhanceMessageWithRAG(
      userMessage,
      {
        currentPath,
        topK: 5,
        minScore: 0.7,
      }
    )

    // Send sources first (if any)
    if (ragContext.sources.length > 0) {
      const citations = formatCitations(ragContext.sources)

      yield {
        type: 'sources',
        data: {
          sources: citations,
          count: citations.length,
        },
      }
    }

    // Update system message with RAG context
    const updatedMessages = messages.map((msg) =>
      msg.role === 'system'
        ? { ...msg, content: ragContext.systemPrompt }
        : msg
    )

    // Add the enhanced user message
    updatedMessages.push({
      role: 'user',
      content: enhancedMessage,
    })

    // Stream response from LLM
    const streamingFn = getStreamingFunction()
    const stream = streamingFn(updatedMessages)

    for await (const chunk of stream) {
      if (chunk.type === 'text' && chunk.content) {
        assistantResponse += chunk.content
      }
      yield chunk
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
        console.error('Failed to save session:', error)
        // Don't fail the request if session save fails
      }
    }
  } catch (error) {
    console.error('RAG streaming error:', error)
    yield handleStreamError(error)
  }
}

/**
 * Stream response without RAG (for simple queries)
 */
async function* streamWithoutRAG(
  userMessage: string,
  messages: ChatMessage[],
  sessionId?: string
): AsyncGenerator<StreamChunk> {
  let assistantResponse = ''

  try {
    // Add user message
    const updatedMessages = [...messages, { role: 'user', content: userMessage }]

    // Stream response from LLM
    const streamingFn = getStreamingFunction()
    const stream = streamingFn(updatedMessages)

    for await (const chunk of stream) {
      if (chunk.type === 'text' && chunk.content) {
        assistantResponse += chunk.content
      }
      yield chunk
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
        console.error('Failed to save session:', error)
        // Don't fail the request if session save fails
      }
    }
  } catch (error) {
    console.error('Streaming error:', error)
    yield handleStreamError(error)
  }
}

/**
 * GET /api/docs-assistant
 *
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Clarity Chat Documentation Assistant',
    version: '1.0.0',
    features: {
      rag: !!process.env.OPENAI_API_KEY || !!process.env.ANTHROPIC_API_KEY,
      streaming: true,
      rateLimit: true,
    },
    models: {
      configured: process.env.AI_MODEL || 'gpt-4-turbo-preview',
      available: ['gpt-4-turbo-preview', 'gpt-4', 'claude-3-5-sonnet-20241022'],
    },
  })
}

/**
 * OPTIONS /api/docs-assistant
 *
 * CORS preflight
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
