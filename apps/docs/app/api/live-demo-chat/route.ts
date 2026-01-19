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
  streamFromClaude,
  streamFromDemo,
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
 */
function createPlainTextStream(
  generator: AsyncGenerator<StreamChunk>
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
        logger.error('Streaming error:', error)
        controller.error(error)
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
    const searchResults = searchDocumentation(message, {
      topK: 3,
      minScore: 0.5,
    })

    const { context: docsContext } = formatSearchResultsForRAG(searchResults)

    // Build message with context
    const messageWithContext = docsContext
      ? `[Documentation Context]\n${docsContext}\n\n[User Question]\n${message}`
      : message

    // Choose streaming function based on API key availability
    const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY &&
      process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-')

    let generator: AsyncGenerator<StreamChunk>

    if (hasAnthropicKey) {
      // Use Claude streaming utility with system prompt
      generator = streamFromClaude(
        [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: messageWithContext }
        ],
        { model: 'claude-sonnet-4-20250514' }
      )
    } else {
      // Use shared demo streaming utility
      generator = streamFromDemo([{ role: 'user', content: message }])
    }

    // Create streaming response
    const stream = createPlainTextStream(generator)

    // Next.js 16: Use after() to log analytics after response is sent
    // This doesn't block the response - analytics are processed asynchronously
    after(() => {
      // Track chat interaction using the analytics service
      trackChatInteraction({
        messageLength: message.length,
        hasDocsContext: !!docsContext,
        searchResultsCount: searchResults.length,
        provider: hasAnthropicKey ? 'claude' : 'demo',
      })
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/live-demo-chat - Health check
 */
export async function GET() {
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY &&
    process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-')
  return Response.json({
    status: 'ok',
    service: 'Live Demo Chat',
    hasAnthropicKey,
  })
}
