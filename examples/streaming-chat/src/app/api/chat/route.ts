import { NextRequest } from 'next/server'

export const runtime = 'edge'

// Simulated AI response streaming
// In production, replace with actual API calls to OpenAI, Anthropic, etc.
async function* simulateStreamingResponse(userMessage: string): AsyncGenerator<string> {
  const responses = [
    "I understand you're asking about ",
    userMessage.substring(0, 50),
    ". Let me provide you with a detailed response.\n\n",
    "Streaming responses allow for real-time interaction, ",
    "making conversations feel more natural and responsive. ",
    "This demo uses Server-Sent Events (SSE) to deliver ",
    "each chunk of text as it's generated.\n\n",
    "Key benefits include:\n",
    "1. **Improved UX**: Users see responses appear in real-time\n",
    "2. **Lower perceived latency**: Engagement starts immediately\n",
    "3. **Cancellation support**: Users can stop unwanted responses\n\n",
    "This pattern works great with OpenAI's streaming API, ",
    "Anthropic's Claude, and other modern LLM providers.",
  ]

  for (const chunk of responses) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100))
    yield chunk
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    
    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request', { status: 400 })
    }

    const lastMessage = messages[messages.length - 1]
    
    // Create a ReadableStream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        try {
          // Stream the response
          for await (const chunk of simulateStreamingResponse(lastMessage.content)) {
            const data = JSON.stringify({ content: chunk })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }

          // Send done signal
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    // Return SSE response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
