/**
 * RAG Chat API - Retrieval Augmented Generation
 * Searches documents, builds context, and streams AI response
 */

export const runtime = 'edge'

import { searchChunks, buildContext, createRAGPrompt, estimateCost, extractSources, approximateTokenCount } from '@/lib/rag'
import { getDocuments } from '../documents/route'
import type { RAGQuery } from '@/types/document'

export async function POST(request: Request) {
  try {
    const body: RAGQuery = await request.json()
    const {
      query,
      documentIds,
      topK = 3,
      model,
      provider,
      temperature = 0.3,
      maxTokens = 1000
    } = body
    
    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    if (!provider || !model) {
      return new Response(JSON.stringify({ error: 'Provider and model are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Get API key
    const apiKey = getApiKey(provider)
    if (!apiKey) {
      return new Response(JSON.stringify({ error: `${provider} API key not configured` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Get documents
    const documents = getDocuments()
    
    if (documents.length === 0) {
      return new Response(JSON.stringify({ error: 'No documents uploaded yet' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Search for relevant chunks
    const searchResults = searchChunks(query, documents, topK, documentIds)
    
    if (searchResults.length === 0) {
      return new Response(JSON.stringify({ error: 'No relevant chunks found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Build context from search results
    const context = buildContext(searchResults)
    const contextTokens = approximateTokenCount(context)
    
    // Create RAG prompt
    const prompt = createRAGPrompt(query, context)
    const promptTokens = approximateTokenCount(prompt)
    
    // Extract sources for response
    const sources = extractSources(searchResults)
    
    // Stream AI response
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    const encoder = new TextEncoder()
    
    // Start streaming in background
    streamAIResponse(
      provider,
      model,
      prompt,
      apiKey,
      temperature,
      maxTokens,
      writer,
      encoder,
      sources,
      contextTokens,
      promptTokens
    ).catch(error => {
      console.error('Streaming error:', error)
      writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`))
      writer.close()
    })
    
    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
    
  } catch (error: any) {
    console.error('RAG chat error:', error)
    return new Response(JSON.stringify({ error: error.message || 'RAG chat failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function streamAIResponse(
  provider: string,
  model: string,
  prompt: string,
  apiKey: string,
  temperature: number,
  maxTokens: number,
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder,
  sources: any[],
  contextTokens: number,
  promptTokens: number
) {
  const startTime = Date.now()
  let completionTokens = 0
  let fullResponse = ''
  
  try {
    // Send metadata first
    writer.write(encoder.encode(`data: ${JSON.stringify({
      type: 'metadata',
      sources,
      contextTokens,
      promptTokens
    })}\n\n`))
    
    // Stream based on provider
    if (provider === 'openai') {
      await streamOpenAI(model, prompt, apiKey, temperature, maxTokens, writer, encoder, (tokens, response) => {
        completionTokens = tokens
        fullResponse = response
      })
    } else if (provider === 'anthropic') {
      await streamAnthropic(model, prompt, apiKey, temperature, maxTokens, writer, encoder, (tokens, response) => {
        completionTokens = tokens
        fullResponse = response
      })
    } else if (provider === 'google') {
      await streamGoogle(model, prompt, apiKey, temperature, maxTokens, writer, encoder, (tokens, response) => {
        completionTokens = tokens
        fullResponse = response
      })
    }
    
    // Send final stats
    const responseTime = Date.now() - startTime
    const totalTokens = contextTokens + promptTokens + completionTokens
    const cost = estimateCost(contextTokens + promptTokens, completionTokens, model)
    
    writer.write(encoder.encode(`data: ${JSON.stringify({
      type: 'done',
      tokens: {
        context: contextTokens,
        prompt: promptTokens,
        completion: completionTokens,
        total: totalTokens
      },
      cost,
      responseTime
    })}\n\n`))
    
  } catch (error: any) {
    writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`))
  } finally {
    writer.close()
  }
}

// OpenAI streaming
async function streamOpenAI(
  model: string,
  prompt: string,
  apiKey: string,
  temperature: number,
  maxTokens: number,
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder,
  onComplete: (tokens: number, response: string) => void
) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
      stream: true,
    }),
  })
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }
  
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let fullResponse = ''
  let tokens = 0
  
  if (!reader) throw new Error('No response body')
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') continue
        
        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content
          
          if (content) {
            fullResponse += content
            tokens++
            writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'content', content })}\n\n`))
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }
  
  onComplete(tokens, fullResponse)
}

// Anthropic streaming (similar pattern)
async function streamAnthropic(
  model: string,
  prompt: string,
  apiKey: string,
  temperature: number,
  maxTokens: number,
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder,
  onComplete: (tokens: number, response: string) => void
) {
  // Similar implementation to OpenAI
  // Using Anthropic's messages API with streaming
  throw new Error('Anthropic streaming not fully implemented in this demo')
}

// Google streaming (similar pattern)
async function streamGoogle(
  model: string,
  prompt: string,
  apiKey: string,
  temperature: number,
  maxTokens: number,
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder,
  onComplete: (tokens: number, response: string) => void
) {
  // Similar implementation to OpenAI
  // Using Google's generateContent API with streaming
  throw new Error('Google streaming not fully implemented in this demo')
}

function getApiKey(provider: string): string | undefined {
  switch (provider) {
    case 'openai':
      return process.env.OPENAI_API_KEY
    case 'anthropic':
      return process.env.ANTHROPIC_API_KEY
    case 'google':
      return process.env.GOOGLE_API_KEY
    default:
      return undefined
  }
}
