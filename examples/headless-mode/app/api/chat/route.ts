import { NextRequest } from 'next/server'

const DEMO_MODE = process.env.DEMO_MODE !== 'false'

const DEMO_RESPONSES = [
  "This response is coming through Clarity Chat's **headless hooks**! The UI you see is 100% custom - no pre-built components.",
  "Headless mode gives you full control. Use `useChat` for messaging, `useTokenTracker` for costs, `useAutoScroll` for UX - all without any UI lock-in.",
  "Try building this with your own design system. The hooks work with Tailwind, MUI, Chakra, or plain CSS. Your call!",
]

function getDemoResponse(): string {
  return DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)]
}

async function* streamDemoResponse(content: string) {
  const words = content.split(' ')
  for (let i = 0; i < words.length; i++) {
    yield words[i] + (i < words.length - 1 ? ' ' : '')
    await new Promise((resolve) => setTimeout(resolve, 40))
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Messages required' }, { status: 400 })
    }

    const encoder = new TextEncoder()

    if (DEMO_MODE || !process.env.OPENAI_API_KEY) {
      const content = getDemoResponse()

      const stream = new ReadableStream({
        async start(controller) {
          await new Promise((resolve) => setTimeout(resolve, 300))

          for await (const chunk of streamDemoResponse(content)) {
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

    // Production mode with OpenAI
    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: messages.map((m: { role: string; content: string }) => ({
              role: m.role as 'user' | 'assistant',
              content: m.content,
            })),
            stream: true,
          })

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text-delta', content })}\n\n`))
            }
            if (chunk.choices[0]?.finish_reason === 'stop') {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'finish' })}\n\n`))
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Stream error'
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: msg })}\n\n`))
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
    console.error('API error:', error)
    return Response.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
