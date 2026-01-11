import { NextRequest, NextResponse } from 'next/server'
import {
  createSSEStream,
  getStreamingFunctionWithRouting,
  validateRequest,
  handleStreamError,
} from '@/lib/ai/streaming'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Validate request
    const validation = validateRequest(messages)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Get the last user message for complexity analysis
    const lastMessage = messages[messages.length - 1]
    const conversationLength = messages.length

    // Get appropriate streaming function based on routing config
    const { streamFn, model, classification } = getStreamingFunctionWithRouting(
      lastMessage.content,
      conversationLength
    )

    // Log the decision (in a real app you'd use a proper logger)
    console.log(`[Chat API] Routing query to ${model} (${classification.complexity})`)

    // Create the stream generator
    const generator = streamFn(messages, {
      model,
      // Pass other config if needed
    })

    // Create the SSE stream
    const stream = createSSEStream(generator)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
