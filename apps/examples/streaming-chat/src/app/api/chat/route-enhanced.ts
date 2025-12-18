import { NextRequest } from 'next/server'
import { getAdapter } from '@clarity-chat/react'
import type { ModelConfig, ChatMessage } from '@clarity-chat/react'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { messages, config } = await req.json()
    
    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request: messages required', { status: 400 })
    }

    if (!config || !config.provider || !config.model) {
      return new Response('Invalid request: config with provider and model required', { status: 400 })
    }

    // Get the appropriate adapter based on provider
    const adapter = getAdapter(config.provider)

    // Format messages for the adapter
    const chatMessages: ChatMessage[] = messages.map(m => ({
      role: m.role,
      content: m.content,
    }))

    // Get API key from environment based on provider
    const apiKey = config.provider === 'openai' 
      ? process.env.OPENAI_API_KEY
      : config.provider === 'anthropic'
      ? process.env.ANTHROPIC_API_KEY
      : config.provider === 'google'
      ? process.env.GOOGLE_API_KEY
      : undefined

    if (!apiKey) {
      return new Response(`API key not configured for provider: ${config.provider}`, { status: 500 })
    }

    const modelConfig: ModelConfig = {
      ...config,
      apiKey,
      temperature: 0.7,
      maxTokens: 1000,
    }

    // Create a ReadableStream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        try {
          // Stream the response using the adapter
          for await (const chunk of adapter.stream(chatMessages, modelConfig)) {
            if (chunk.type === 'token' && chunk.content) {
              const data = JSON.stringify({ 
                type: 'token',
                content: chunk.content 
              })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            } else if (chunk.type === 'tool_call' && chunk.toolCall) {
              const data = JSON.stringify({ 
                type: 'tool_call',
                toolCall: chunk.toolCall 
              })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            } else if (chunk.type === 'thinking' && chunk.content) {
              const data = JSON.stringify({ 
                type: 'thinking',
                content: chunk.content 
              })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            } else if (chunk.type === 'done' && chunk.usage) {
              // Calculate cost
              const cost = adapter.estimateCost(chunk.usage, modelConfig.model)
              
              const data = JSON.stringify({ 
                type: 'done',
                usage: chunk.usage,
                cost 
              })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            } else if (chunk.type === 'error') {
              const data = JSON.stringify({ 
                type: 'error',
                error: chunk.error?.message || 'Unknown error' 
              })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
          }

          // Send done signal
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
          controller.close()
        } catch (error: any) {
          console.error('Streaming error:', error)
          const errorData = JSON.stringify({ 
            type: 'error',
            error: error.message || 'Stream error' 
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
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
  } catch (error: any) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
