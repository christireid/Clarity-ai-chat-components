import { NextRequest } from 'next/server'

// Demo mode - works without API keys
const DEMO_MODE = process.env.DEMO_MODE !== 'false'

// Demo responses for common queries
const DEMO_RESPONSES: Record<string, string> = {
  hello: "Hello! I'm Clarity Chat running in demo mode. Add your OpenAI API key to get real AI responses!",
  help: `To upgrade from demo to production:

1. Get an API key from https://platform.openai.com
2. Add to .env.local: OPENAI_API_KEY=sk-...
3. Set DEMO_MODE=false
4. Restart the server

That's it!`,
  default: `This is a demo response from Clarity Chat!

**Demo Mode Active** - I'm simulating AI responses so you can see the chat working immediately.

To get real AI responses:
- Add your OpenAI API key to \`.env.local\`
- Set \`DEMO_MODE=false\`
- Restart the dev server

Try asking me "help" for setup instructions!`,
}

function getDemoResponse(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('hello') || lower.includes('hi')) return DEMO_RESPONSES.hello
  if (lower.includes('help') || lower.includes('api') || lower.includes('key')) return DEMO_RESPONSES.help
  return DEMO_RESPONSES.default
}

async function* streamDemoResponse(content: string) {
  // Simulate streaming by yielding chunks
  const words = content.split(' ')
  for (let i = 0; i < words.length; i++) {
    yield words[i] + (i < words.length - 1 ? ' ' : '')
    // Small delay between words
    await new Promise((resolve) => setTimeout(resolve, 30))
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Messages array is required' }, { status: 400 })
    }

    const lastMessage = messages[messages.length - 1]
    const encoder = new TextEncoder()

    // Demo mode - simulate streaming response
    if (DEMO_MODE || !process.env.OPENAI_API_KEY) {
      const demoContent = getDemoResponse(lastMessage.content)

      const stream = new ReadableStream({
        async start(controller) {
          // Initial delay to simulate "thinking"
          await new Promise((resolve) => setTimeout(resolve, 500))

          for await (const chunk of streamDemoResponse(demoContent)) {
            const data = JSON.stringify({ type: 'text-delta', content: chunk })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'finish' })}\n\n`))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        },
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      })
    }

    // Production mode - use OpenAI
    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: messages.map((m: { role: string; content: string }) => ({
              role: m.role as 'user' | 'assistant' | 'system',
              content: m.content,
            })),
            stream: true,
          })

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              const data = JSON.stringify({ type: 'text-delta', content })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
            if (chunk.choices[0]?.finish_reason === 'stop') {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'finish' })}\n\n`))
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Stream error'
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: errorMessage })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return Response.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
