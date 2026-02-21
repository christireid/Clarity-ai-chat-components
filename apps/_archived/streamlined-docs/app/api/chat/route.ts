import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]
    const userText = lastMessage?.content || ''

    // Check if client requested streaming (this is a mock, so we assume yes for demo)
    // In a real app, we'd check headers or body props.

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const responseText = `This is a simulated streaming response to: "${userText}".\n\nIn a real application, this would connect to an LLM like OpenAI or Anthropic. The text appears token by token to improve perceived latency.`

        const tokens = responseText.split(/(?=\s)/) // Split by words/spaces roughly

        for (const token of tokens) {
          // Simulate token generation delay
          await new Promise((resolve) => setTimeout(resolve, 30))
          controller.enqueue(encoder.encode(token))
        }

        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
