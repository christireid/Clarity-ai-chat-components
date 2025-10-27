import { NextRequest } from 'next/server'

export const runtime = 'edge'

// Type definitions
interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ModelConfig {
  provider: string
  model: string
  temperature?: number
  maxTokens?: number
  apiKey?: string
}

interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

type StreamChunk = 
  | { type: 'token'; content: string }
  | { type: 'done'; usage: TokenUsage }
  | { type: 'error'; error: string }

// OpenAI Adapter
async function* streamOpenAI(messages: ChatMessage[], config: ModelConfig): AsyncGenerator<StreamChunk> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: config.temperature || 0.7,
      max_tokens: config.maxTokens || 1000,
      stream: true,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'OpenAI API error')
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter(line => line.trim() !== '')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') {
          yield { type: 'done', usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } }
          return
        }

        try {
          const json = JSON.parse(data)
          const content = json.choices[0]?.delta?.content
          if (content) {
            yield { type: 'token', content }
          }
        } catch (e) {
          // Ignore parse errors for incomplete chunks
        }
      }
    }
  }
}

// Anthropic Adapter
async function* streamAnthropic(messages: ChatMessage[], config: ModelConfig): AsyncGenerator<StreamChunk> {
  const systemMessage = messages.find(m => m.role === 'system')
  const userMessages = messages.filter(m => m.role !== 'system')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': config.apiKey!,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages: userMessages,
      system: systemMessage?.content,
      max_tokens: config.maxTokens || 1000,
      temperature: config.temperature || 0.7,
      stream: true,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Anthropic API error')
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter(line => line.trim() !== '')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        
        try {
          const json = JSON.parse(data)
          
          if (json.type === 'content_block_delta' && json.delta?.text) {
            yield { type: 'token', content: json.delta.text }
          } else if (json.type === 'message_stop') {
            yield { type: 'done', usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } }
            return
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }
}

// Google AI Adapter  
async function* streamGoogle(messages: ChatMessage[], config: ModelConfig): AsyncGenerator<StreamChunk> {
  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }))

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:streamGenerateContent?key=${config.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: config.temperature || 0.7,
          maxOutputTokens: config.maxTokens || 1000,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Google AI API error')
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter(line => line.trim() !== '')

    for (const line of lines) {
      try {
        const json = JSON.parse(line)
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
          yield { type: 'token', content: text }
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }

  yield { type: 'done', usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } }
}

// Cost estimation
function estimateCost(usage: TokenUsage, model: string): number {
  const costs: Record<string, { input: number; output: number }> = {
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
    'claude-3-opus': { input: 0.015, output: 0.075 },
    'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
    'claude-3-sonnet': { input: 0.003, output: 0.015 },
    'claude-3-sonnet-20240229': { input: 0.003, output: 0.015 },
    'claude-3-haiku': { input: 0.00025, output: 0.00125 },
    'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 },
    'gemini-pro': { input: 0.00025, output: 0.0005 },
    'gemini-pro-vision': { input: 0.00025, output: 0.0005 },
  }

  const pricing = costs[model] || { input: 0, output: 0 }
  return (usage.promptTokens * pricing.input / 1000) + (usage.completionTokens * pricing.output / 1000)
}

// Helper to get the correct adapter based on provider
function getAdapter(provider: string) {
  switch (provider) {
    case 'openai':
      return streamOpenAI
    case 'anthropic':
      return streamAnthropic
    case 'google':
      return streamGoogle
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

          let completionTokens = 0

          for await (const chunk of adapter(messages, streamConfig)) {
            // Send each chunk as SSE
            if (chunk.type === 'token') {
              controller.enqueue(
                encoder.encode(createSSEMessage({
                  type: 'token',
                  content: chunk.content
                }))
              )
              completionTokens++
            } else if (chunk.type === 'done') {
              const endTime = Date.now()
              const duration = endTime - startTime

              // Estimate token count and cost
              const usage = {
                promptTokens: 50, // Rough estimate
                completionTokens,
                totalTokens: 50 + completionTokens
              }

              const cost = estimateCost(usage, config.model)

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
                  error: chunk.error
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
