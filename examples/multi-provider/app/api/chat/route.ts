import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize clients
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

const google = process.env.GOOGLE_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
  : null

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// Stream OpenAI response
async function streamOpenAI(
  messages: ChatMessage[],
  model: string,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder
) {
  if (!openai) throw new Error('OpenAI not configured')

  const completion = await openai.chat.completions.create({
    model,
    messages,
    stream: true,
  })

  for await (const chunk of completion) {
    const content = chunk.choices[0]?.delta?.content
    if (content) {
      const data = JSON.stringify({ type: 'text-delta', content })
      controller.enqueue(encoder.encode(`data: ${data}\n\n`))
    }
    if (chunk.choices[0]?.finish_reason === 'stop') {
      const finishData = JSON.stringify({ type: 'finish' })
      controller.enqueue(encoder.encode(`data: ${finishData}\n\n`))
    }
  }
}

// Stream Anthropic response
async function streamAnthropic(
  messages: ChatMessage[],
  model: string,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder
) {
  if (!anthropic) throw new Error('Anthropic not configured')

  // Separate system message
  const systemMessage = messages.find((m) => m.role === 'system')
  const chatMessages = messages.filter((m) => m.role !== 'system')

  const stream = await anthropic.messages.stream({
    model,
    max_tokens: 4096,
    system: systemMessage?.content || 'You are a helpful assistant.',
    messages: chatMessages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  })

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      const data = JSON.stringify({
        type: 'text-delta',
        content: event.delta.text,
      })
      controller.enqueue(encoder.encode(`data: ${data}\n\n`))
    }
    if (event.type === 'message_stop') {
      const finishData = JSON.stringify({ type: 'finish' })
      controller.enqueue(encoder.encode(`data: ${finishData}\n\n`))
    }
  }
}

// Stream Google response
async function streamGoogle(
  messages: ChatMessage[],
  model: string,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder
) {
  if (!google) throw new Error('Google AI not configured')

  const genModel = google.getGenerativeModel({ model })

  // Convert messages to Google format
  const systemMessage = messages.find((m) => m.role === 'system')
  const chatMessages = messages.filter((m) => m.role !== 'system')

  const history = chatMessages.slice(0, -1).map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }))

  const lastMessage = chatMessages[chatMessages.length - 1]

  const chat = genModel.startChat({
    history,
    systemInstruction: systemMessage?.content,
  })

  const result = await chat.sendMessageStream(lastMessage.content)

  for await (const chunk of result.stream) {
    const content = chunk.text()
    if (content) {
      const data = JSON.stringify({ type: 'text-delta', content })
      controller.enqueue(encoder.encode(`data: ${data}\n\n`))
    }
  }

  const finishData = JSON.stringify({ type: 'finish' })
  controller.enqueue(encoder.encode(`data: ${finishData}\n\n`))
}

export async function POST(request: NextRequest) {
  try {
    const { messages, model, provider } = await request.json()

    if (!messages || !model || !provider) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send provider info
          const initData = JSON.stringify({ type: 'init', provider, model })
          controller.enqueue(encoder.encode(`data: ${initData}\n\n`))

          // Route to appropriate provider
          switch (provider) {
            case 'openai':
              await streamOpenAI(messages, model, controller, encoder)
              break
            case 'anthropic':
              await streamAnthropic(messages, model, controller, encoder)
              break
            case 'google':
              await streamGoogle(messages, model, controller, encoder)
              break
            default:
              throw new Error(`Unknown provider: ${provider}`)
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

// Return available providers
export async function GET() {
  const available = {
    openai: !!openai,
    anthropic: !!anthropic,
    google: !!google,
  }

  return Response.json({ available })
}
