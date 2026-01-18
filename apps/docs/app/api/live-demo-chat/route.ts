/**
 * Live Demo Chat API Endpoint
 *
 * Powers the homepage demo chat with AI and docs search.
 * Uses shared streaming utilities from lib/ai/streaming.ts
 *
 * Demonstrates Next.js 16 features:
 * - after() API for post-response analytics logging
 */

import { NextRequest } from 'next/server'
import { after } from 'next/server'
import {
  searchDocumentation,
  formatSearchResultsForRAG,
} from '@/lib/ai/keywordSearch'
import {
  streamFromGemini,
  streamFromDemo,
  streamFromRAG,
  type StreamChunk,
} from '@/lib/ai/streaming'
import { trackChatInteraction } from '@/lib/ai/chat-analytics'
import { getLogger } from '@/lib/logging'

const logger = getLogger('live-demo-chat')

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// System prompt that defines the assistant's role
const SYSTEM_PROMPT = `You are the Clarity Chat documentation assistant, helping developers build amazing chat interfaces.

## About Clarity Chat

Clarity Chat is a comprehensive React component library with:
- 190+ production-ready components (ChatWindow, MessageBubble, InputBar, TypingIndicator, etc.)
- 95+ custom hooks (useChat, useStreaming, useTokenCount, useMessageHistory, etc.)
- Token optimization tools achieving 60-80% cost reductions
- TypeScript-first design with full type safety
- WCAG AAA accessibility compliance
- 15 built-in themes with dark mode support

## Your Behavior

1. **Be concise**: This is a demo chat, keep responses focused and helpful (2-4 paragraphs max)
2. **Use the documentation context**: When provided, reference specific components, hooks, and features
3. **Provide code examples**: Include short, practical code snippets when relevant
4. **Be enthusiastic but professional**: Help developers feel excited about using Clarity Chat
5. **Stay on topic**: Focus on Clarity Chat; politely redirect off-topic questions

## Response Format

- Use markdown for formatting (code blocks, bold, lists)
- Keep code examples short and focused
- Always mention relevant documentation pages when applicable
- End with a helpful follow-up suggestion when appropriate

Remember: You're the friendly face of Clarity Chat, helping developers build production-ready chat UIs!`

interface RequestBody {
  message: string
}

// Maximum message length (4KB is reasonable for chat)
const MAX_MESSAGE_LENGTH = 4096

/**
 * Create a plain text streaming response from StreamChunk generator
 * Falls back to demo mode if the generator fails
 */
function createPlainTextStream(
  generator: AsyncGenerator<StreamChunk>,
  fallbackMessage?: string
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of generator) {
          if (chunk.type === 'text' && chunk.content) {
            controller.enqueue(encoder.encode(chunk.content))
          }
        }
        controller.close()
      } catch (error) {
        logger.error('Streaming error, falling back to demo mode:', error)
        
        // Fallback to RAG mode with error message
        try {
          logger.info('Attempting fallback to RAG mode')
          const fallbackGenerator = streamFromRAG([
            { role: 'user', content: fallbackMessage || 'Help' }
          ])
          
          for await (const chunk of fallbackGenerator) {
            if (chunk.type === 'text' && chunk.content) {
              controller.enqueue(encoder.encode(chunk.content))
            }
          }
          logger.info('Fallback to RAG mode completed successfully')
          controller.close()
        } catch (fallbackError) {
          logger.error('RAG fallback failed, trying demo mode:', fallbackError)
          // Last resort: try demo mode
          try {
            const demoGenerator = streamFromDemo([
              { role: 'user', content: fallbackMessage || 'Help' }
            ])
            
            for await (const chunk of demoGenerator) {
              if (chunk.type === 'text' && chunk.content) {
                controller.enqueue(encoder.encode(chunk.content))
              }
            }
            controller.close()
          } catch (demoError) {
            logger.error('All fallbacks failed:', demoError)
            // Final fallback: send a simple error message
            const errorMsg = 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment!'
            controller.enqueue(encoder.encode(errorMsg))
            controller.close()
          }
        }
      }
    },
  })
}

/**
 * POST /api/live-demo-chat
 */
export async function POST(request: NextRequest) {
  let body: RequestBody

  try {
    body = (await request.json()) as RequestBody
  } catch {
    return Response.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    )
  }

  try {
    // Validate message exists and has content
    const message = typeof body.message === 'string' ? body.message.trim() : ''

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 })
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        {
          error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`,
        },
        { status: 400 }
      )
    }

    // Search documentation for relevant context
    let searchResults: any[] = []
    let docsContext = ''
    try {
      searchResults = searchDocumentation(message, {
        topK: 3,
        minScore: 0.5,
      })
      const formatted = formatSearchResultsForRAG(searchResults)
      docsContext = formatted.context || ''
    } catch (error) {
      logger.warn('Documentation search failed, continuing without context:', error)
    }

    // Build message with context
    const messageWithContext = docsContext
      ? `[Documentation Context]\n${docsContext}\n\n[User Question]\n${message}`
      : message

    // Check for API key from environment or request header (client-provided)
    const clientApiKey = request.headers.get('X-Gemini-API-Key')
    const envApiKey = process.env.GEMINI_API_KEY
    
    // Use client-provided key if available, otherwise fall back to env key
    const geminiApiKey = clientApiKey || envApiKey
    
    const hasGeminiKey = !!geminiApiKey && 
                         geminiApiKey.trim() !== '' &&
                         !geminiApiKey.includes('your-') &&
                         !geminiApiKey.includes('placeholder')

    let generator: AsyncGenerator<StreamChunk>
    let provider: 'gemini' | 'rag' | 'demo' = 'rag'

    logger.info(`Processing chat request: message="${message.substring(0, 50)}...", hasGeminiKey=${hasGeminiKey}`)

    try {
      if (hasGeminiKey) {
        // Use shared Gemini streaming utility
        logger.info('Attempting to use Gemini API')
        generator = streamFromGemini(
          [{ role: 'user', content: messageWithContext }],
          { 
            systemPrompt: SYSTEM_PROMPT,
            apiKey: geminiApiKey // Pass API key directly (client-provided or env)
          }
        )
        provider = 'gemini'
      } else {
        // Use RAG system as fallback (searches documentation for contextual answers)
        logger.info('Using RAG mode (no valid Gemini API key)')
        generator = streamFromRAG(
          [{ role: 'user', content: message }],
          { systemPrompt: SYSTEM_PROMPT }
        )
        provider = 'rag'
      }
    } catch (error) {
      // Fallback to RAG if Gemini initialization fails
      logger.warn('Failed to initialize Gemini, falling back to RAG mode:', error)
      generator = streamFromRAG(
        [{ role: 'user', content: message }],
        { systemPrompt: SYSTEM_PROMPT }
      )
      provider = 'rag'
    }

    // Create streaming response with fallback support
    const stream = createPlainTextStream(generator, message)

    // Next.js 16: Use after() to log analytics after response is sent
    // This doesn't block the response - analytics are processed asynchronously
    after(() => {
      // Track chat interaction using the analytics service
      try {
        trackChatInteraction({
          messageLength: message.length,
          hasDocsContext: !!docsContext,
          searchResultsCount: searchResults.length,
          provider,
        })
      } catch (error) {
        logger.warn('Failed to track chat interaction:', error)
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Response-Provider': provider, // Indicate which provider was used
      },
    })
  } catch (error) {
    logger.error('API error:', error)
    return Response.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/live-demo-chat - Health check
 */
export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'Live Demo Chat',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  })
}
