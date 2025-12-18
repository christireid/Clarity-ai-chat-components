import { NextRequest } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'edge'

const systemPrompt = `You are an expert AI code assistant. You help developers with:
- Writing clean, efficient code
- Debugging and fixing errors
- Explaining complex code concepts
- Suggesting best practices and improvements
- Converting code between languages
- Writing tests and documentation

When providing code:
- Always use proper syntax highlighting with markdown code blocks
- Specify the language (e.g., \`\`\`typescript, \`\`\`python)
- Add helpful comments explaining key parts
- Follow modern best practices and conventions

Be concise but thorough. If you need more context, ask clarifying questions.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'OpenAI API key not configured',
          message: 'Please add OPENAI_API_KEY to your .env.local file',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const openai = new OpenAI({ apiKey })

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 2048,
    })

    // Create SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              const data = JSON.stringify({ content })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
          }

          controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
          controller.close()
        } catch (err) {
          console.error('Stream error:', err)
          controller.error(err)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err: any) {
    console.error('Chat API error:', err)

    if (err?.status === 401) {
      return new Response(
        JSON.stringify({
          error: 'Invalid API key',
          message: 'Please check your OPENAI_API_KEY',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: err.message || 'Something went wrong',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
