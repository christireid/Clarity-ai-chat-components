import { NextRequest } from 'next/server'
import OpenAI from 'openai'

import { SecureLogger } from '@/lib/security/secureLogger';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { messages, model = 'gpt-4-turbo-preview' } = await request.json()

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Create streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await openai.chat.completions.create({
            model,
            messages,
            stream: true,
          })

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              const data = JSON.stringify({
                type: 'text-delta',
                content,
              })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }

            // Check for completion
            if (chunk.choices[0]?.finish_reason === 'stop') {
              const finishData = JSON.stringify({ type: 'finish' })
              controller.enqueue(encoder.encode(`data: ${finishData}\n\n`))
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Stream error'
          const errorData = JSON.stringify({
            type: 'error',
            message: errorMessage,
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error) {
    SecureLogger.error('Chat API error:', error)
    return Response.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
