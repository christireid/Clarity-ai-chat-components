import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Simple token estimation (roughly 4 chars per token for English)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

export async function POST(request: NextRequest) {
  try {
    const { messages, model = 'gpt-4-turbo-preview' } = await request.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Calculate input tokens
    const inputText = messages
      .map((m: { content: string }) => m.content)
      .join(' ')
    const inputTokens = estimateTokens(inputText)

    const encoder = new TextEncoder()
    let outputTokens = 0
    const startTime = Date.now()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial metadata
          const initData = JSON.stringify({
            type: 'init',
            inputTokens,
            model,
          })
          controller.enqueue(encoder.encode(`data: ${initData}\n\n`))

          const completion = await openai.chat.completions.create({
            model,
            messages,
            stream: true,
            stream_options: { include_usage: true },
          })

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content

            if (content) {
              outputTokens += estimateTokens(content)

              const data = JSON.stringify({
                type: 'text-delta',
                content,
                outputTokens,
                elapsedMs: Date.now() - startTime,
              })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }

            // Handle usage info if available
            if (chunk.usage) {
              const usageData = JSON.stringify({
                type: 'usage',
                promptTokens: chunk.usage.prompt_tokens,
                completionTokens: chunk.usage.completion_tokens,
                totalTokens: chunk.usage.total_tokens,
              })
              controller.enqueue(encoder.encode(`data: ${usageData}\n\n`))
            }

            if (chunk.choices[0]?.finish_reason === 'stop') {
              const finishData = JSON.stringify({
                type: 'finish',
                reason: 'stop',
                totalMs: Date.now() - startTime,
                outputTokens,
              })
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
    console.error('Chat API error:', error)
    return Response.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
