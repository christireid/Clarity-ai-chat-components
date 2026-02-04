/**
 * API Route Templates
 *
 * Templates for generating Next.js API routes with security best practices.
 */

export const apiRoute = `import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
{{#if (eq provider "openai")}}

import OpenAI from 'openai'
{{else if (eq provider "anthropic")}}

import Anthropic from '@anthropic-ai/sdk'
{{else if (eq provider "google")}}

import { GoogleGenerativeAI } from '@google/generative-ai'
{{/if}}


// ============================================================================
// Security Configuration
// ============================================================================

/**
 * Rate limiting configuration
 * In production, use Redis or a dedicated rate limiting service
 */
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 requests per minute per IP
}

// Simple in-memory rate limiter (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT.windowMs })
    return { allowed: true, remaining: RATE_LIMIT.maxRequests - 1 }
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: RATE_LIMIT.maxRequests - record.count }
}

/**
 * Input validation and sanitization
 */
const MAX_MESSAGE_LENGTH = 32000 // ~8k tokens
const MAX_MESSAGES = 50

function validateInput(messages: unknown, maxTokens: unknown): string | null {
  if (!messages || !Array.isArray(messages)) {
    return 'messages is required and must be an array'
  }

  if (messages.length > MAX_MESSAGES) {
    return \`Maximum \${MAX_MESSAGES} messages allowed\`
  }

  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      return 'Each message must have role and content'
    }
    if (!['user', 'assistant', 'system'].includes(msg.role)) {
      return 'Invalid message role'
    }
    if (typeof msg.content !== 'string' || msg.content.length > MAX_MESSAGE_LENGTH) {
      return \`Message content must be a string under \${MAX_MESSAGE_LENGTH} characters\`
    }
  }

  if (maxTokens && (typeof maxTokens !== 'number' || maxTokens < 1 || maxTokens > 4096)) {
    return 'maxTokens must be between 1 and 4096'
  }

  return null
}

// ============================================================================
// AI Provider Configuration
// ============================================================================

{{#if (eq provider "openai")}}
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
{{else if (eq provider "anthropic")}}
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})
{{else if (eq provider "google")}}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
{{/if}}

// ============================================================================
// API Route Handler
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const ip = forwardedFor?.split(',')[0] ?? 'unknown'

    // Check rate limit
    const { allowed, remaining } = checkRateLimit(ip)
    if (!allowed) {
      return Response.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(RATE_LIMIT.maxRequests),
            'X-RateLimit-Remaining': '0',
            'Retry-After': '60',
          },
        }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const { messages, model, systemPrompt, temperature = 0.7, maxTokens = 1000 } = body

    // Validate input
    const validationError = validateInput(messages, maxTokens)
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 })
    }

    // Optional: Add authentication check here
    // const authHeader = headersList.get('authorization')
    // if (!authHeader || !verifyToken(authHeader)) {
    //   return Response.json({ error: 'Unauthorized' }, { status: 401 })
    // }

{{#if withStreaming}}
    // Streaming response
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
{{#if (eq provider "openai")}}
          const response = await openai.chat.completions.create({
            model: model || 'gpt-4',
            messages: systemPrompt
              ? [{ role: 'system', content: systemPrompt }, ...messages]
              : messages,
            temperature,
            max_tokens: maxTokens,
            stream: true,
          })

          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ content })}\\n\\n\`))
            }
          }
{{else if (eq provider "anthropic")}}
          const stream = await anthropic.messages.stream({
            model: model || 'claude-3-opus-20240229',
            system: systemPrompt,
            messages: messages.map((m: { role: string; content: string }) => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.content,
            })),
            max_tokens: maxTokens,
          })

          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ content: event.delta.text })}\\n\\n\`))
            }
          }
{{else if (eq provider "google")}}
          const geminiModel = genAI.getGenerativeModel({ model: model || 'gemini-pro' })
          const chat = geminiModel.startChat({
            history: messages.slice(0, -1).map((m: { role: string; content: string }) => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }],
            })),
          })

          const result = await chat.sendMessageStream(messages[messages.length - 1].content)

          for await (const chunk of result.stream) {
            const content = chunk.text()
            if (content) {
              controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ content })}\\n\\n\`))
            }
          }
{{/if}}

          controller.enqueue(encoder.encode('data: [DONE]\\n\\n'))
          controller.close()
        } catch (error) {
          controller.error(error)
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
{{else}}
    // Non-streaming response
{{#if (eq provider "openai")}}
    const response = await openai.chat.completions.create({
      model: model || 'gpt-4',
      messages: systemPrompt
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages,
      temperature,
      max_tokens: maxTokens,
    })

    return Response.json({
      content: response.choices[0]?.message?.content || '',
      usage: response.usage,
    })
{{else if (eq provider "anthropic")}}
    const response = await anthropic.messages.create({
      model: model || 'claude-3-opus-20240229',
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
      max_tokens: maxTokens,
    })

    return Response.json({
      content: response.content[0]?.type === 'text' ? response.content[0].text : '',
      usage: response.usage,
    })
{{else if (eq provider "google")}}
    const geminiModel = genAI.getGenerativeModel({ model: model || 'gemini-pro' })
    const chat = geminiModel.startChat({
      history: messages.slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    })

    const result = await chat.sendMessage(messages[messages.length - 1].content)
    const response = await result.response

    return Response.json({
      content: response.text(),
    })
{{/if}}
{{/if}}
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
`
