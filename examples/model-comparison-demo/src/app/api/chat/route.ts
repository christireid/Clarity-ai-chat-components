import { NextRequest } from 'next/server'
import { 
  openAIAdapter, 
  anthropicAdapter, 
  googleAdapter,
  type ChatMessage,
  type ModelConfig 
} from '@clarity-chat/react'

export const runtime = 'edge'

// Helper to get the correct adapter based on provider
function getAdapter(provider: string) {
  switch (provider) {
    case 'openai':
      return openAIAdapter
    case 'anthropic':
      return anthropicAdapter
    case 'google':
      return googleAdapter
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}

// Helper to create SSE message
function createSSEMessage(data: any): string {
  return `data: ${JSON.stringify(data)}\n\n`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, config } = body as {
      messages: ChatMessage[]
      config: ModelConfig
    }

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!config || !config.provider || !config.model) {
      return new Response(
        JSON.stringify({ error: 'Valid config with provider and model is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get API key from environment
    let apiKey = config.apiKey
    if (!apiKey) {
      switch (config.provider) {
        case 'openai':
          apiKey = process.env.OPENAI_API_KEY
          break
        case 'anthropic':
          apiKey = process.env.ANTHROPIC_API_KEY
          break
        case 'google':
          apiKey = process.env.GOOGLE_API_KEY
          break
      }
    }

    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: `API key not found for provider: ${config.provider}`,
          hint: `Set ${config.provider.toUpperCase()}_API_KEY environment variable`
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get the appropriate adapter
    const adapter = getAdapter(config.provider)

    // Create streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const startTime = Date.now()

        try {
          // Stream responses from the adapter
          const streamConfig = {
            ...config,
            apiKey,
          }

          let totalTokens = 0
          let promptTokens = 0
          let completionTokens = 0

          for await (const chunk of adapter.stream(messages, streamConfig)) {
            // Send each chunk as SSE
            if (chunk.type === 'token') {
              controller.enqueue(
                encoder.encode(createSSEMessage({
                  type: 'token',
                  content: chunk.content
                }))
              )
              completionTokens++
            } else if (chunk.type === 'tool_call') {
              controller.enqueue(
                encoder.encode(createSSEMessage({
                  type: 'tool_call',
                  toolCall: chunk.toolCall
                }))
              )
            } else if (chunk.type === 'thinking') {
              controller.enqueue(
                encoder.encode(createSSEMessage({
                  type: 'thinking',
                  content: chunk.content
                }))
              )
            } else if (chunk.type === 'citation') {
              controller.enqueue(
                encoder.encode(createSSEMessage({
                  type: 'citation',
                  citation: chunk.citation
                }))
              )
            } else if (chunk.type === 'done') {
              const endTime = Date.now()
              const duration = endTime - startTime

              // Calculate cost
              const usage = chunk.usage || {
                promptTokens,
                completionTokens,
                totalTokens: totalTokens || (promptTokens + completionTokens)
              }

              const cost = adapter.estimateCost(usage, config.model)

              // Send completion message
              controller.enqueue(
                encoder.encode(createSSEMessage({
                  type: 'done',
                  usage,
                  cost,
                  duration
                }))
              )
            } else if (chunk.type === 'error') {
              controller.enqueue(
                encoder.encode(createSSEMessage({
                  type: 'error',
                  error: chunk.error?.message || 'Unknown error'
                }))
              )
            }
          }

          // Close the stream
          controller.close()
        } catch (error: any) {
          console.error('Streaming error:', error)
          
          // Send error message
          controller.enqueue(
            encoder.encode(createSSEMessage({
              type: 'error',
              error: error.message || 'An error occurred during streaming'
            }))
          )
          
          controller.close()
        }
      }
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
    console.error('API error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.stack 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
}
