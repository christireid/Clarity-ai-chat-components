/**
 * Hero Chat API Route
 *
 * Powers the flagship demo with Google Gemini + Tool Calling.
 * Demonstrates 100% of Clarity Chat library capabilities.
 */

import { NextRequest } from 'next/server'
import {
  GoogleGenerativeAI,
  SchemaType,
  type FunctionDeclaration,
} from '@google/generative-ai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ============================================================================
// TYPES
// ============================================================================

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface RequestBody {
  messages: ChatMessage[]
  model?: string
}

type SSEEvent =
  | { type: 'text-delta'; content: string }
  | {
      type: 'tool-call'
      id: string
      name: string
      args: Record<string, unknown>
    }
  | { type: 'tool-result'; id: string; name: string; data: unknown; ui: string }
  | { type: 'error'; message: string; code?: string }
  | { type: 'done'; usage?: { promptTokens: number; completionTokens: number } }

// ============================================================================
// SYSTEM PROMPT
// ============================================================================

const HERO_SYSTEM_PROMPT = `You are **Clarity**, the AI assistant for the Clarity Chat component library. You're helpful, witty, and love to show off capabilities through interactive demos.

## Your Personality
- **Concise**: Keep responses under 3 paragraphs unless asked for detail
- **Witty**: Light humor is welcome, but stay professional
- **Demo-Eager**: Look for opportunities to use your tools to create visual demonstrations
- **Helpful**: Always provide actionable information

## Your Tools
You have access to special tools that render beautiful UI components directly in the chat. USE THEM when relevant:

1. **render_weather_card**: Show weather for any city. Use when users mention weather, travel, or ask "what's the weather in X?"
2. **render_stock_chart**: Display stock data. Use when users mention stocks, investing, market, or company valuations.
3. **render_code_sandbox**: Show interactive code. Use when explaining code, demonstrating concepts, or when users ask "how do I..."
4. **render_task_list**: Create interactive checklists. Use when users want to plan, organize, or track tasks.
5. **render_location_card**: Show location/map cards. Use when users ask about places, directions, addresses, restaurants, hotels, or tourist attractions.

## Response Guidelines
- Start responses naturally - don't announce what you're about to do
- When using tools, add brief context before or after (not both)
- Use markdown for formatting: **bold**, \`code\`, lists, etc.
- If a question is about Clarity Chat library, focus on that
- For off-topic questions, engage briefly then suggest Clarity Chat features

## About Clarity Chat
Clarity Chat is a comprehensive React component library with:
- 200+ production-ready components
- 140+ custom hooks
- Token optimization tools (60-80% cost reduction)
- TypeScript-first design
- WCAG AAA accessibility
- 11 built-in themes

Remember: You're the star of the demo. Make it shine!`

// ============================================================================
// TOOL DEFINITIONS
// ============================================================================

const TOOL_DECLARATIONS = [
  {
    name: 'render_weather_card',
    description:
      'Renders a beautiful weather card UI component showing current weather conditions for a city. Use this when users ask about weather, travel conditions, or outdoor activities.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        city: {
          type: SchemaType.STRING,
          description:
            "The city name (e.g., 'San Francisco', 'Tokyo', 'London')",
        },
        country: {
          type: SchemaType.STRING,
          description: "The country code (e.g., 'US', 'JP', 'UK')",
        },
        temperature: {
          type: SchemaType.NUMBER,
          description: 'Current temperature in Celsius',
        },
        condition: {
          type: SchemaType.STRING,
          description:
            'Current weather condition: sunny, partly-cloudy, cloudy, rainy, stormy, snowy, foggy, or windy',
        },
        humidity: {
          type: SchemaType.NUMBER,
          description: 'Humidity percentage (0-100)',
        },
        windSpeed: {
          type: SchemaType.NUMBER,
          description: 'Wind speed in km/h',
        },
      },
      required: ['city', 'temperature', 'condition'],
    },
  },
  {
    name: 'render_stock_chart',
    description:
      'Renders an interactive stock price chart with trend data. Use when users ask about stocks, investments, market performance, or specific companies.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        symbol: {
          type: SchemaType.STRING,
          description: "Stock ticker symbol (e.g., 'AAPL', 'GOOGL', 'MSFT')",
        },
        companyName: {
          type: SchemaType.STRING,
          description: 'Full company name',
        },
        currentPrice: {
          type: SchemaType.NUMBER,
          description: 'Current stock price in USD',
        },
        changePercent: {
          type: SchemaType.NUMBER,
          description: 'Percentage change (positive or negative)',
        },
        changeAmount: {
          type: SchemaType.NUMBER,
          description: 'Dollar change amount',
        },
        marketCap: {
          type: SchemaType.STRING,
          description: "Market capitalization (e.g., '2.8T', '450B')",
        },
      },
      required: ['symbol', 'companyName', 'currentPrice', 'changePercent'],
    },
  },
  {
    name: 'render_code_sandbox',
    description:
      "Renders an interactive code editor with syntax highlighting. Use when explaining programming concepts, showing code examples, or when users ask 'how do I...' questions about code.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        title: {
          type: SchemaType.STRING,
          description: 'Title for the code sandbox',
        },
        language: {
          type: SchemaType.STRING,
          description:
            'Programming language: typescript, javascript, python, html, css, json, bash, or sql',
        },
        code: {
          type: SchemaType.STRING,
          description: 'The code to display',
        },
        description: {
          type: SchemaType.STRING,
          description: 'Brief description of what the code does',
        },
      },
      required: ['language', 'code'],
    },
  },
  {
    name: 'render_task_list',
    description:
      'Renders an interactive checklist/task list that users can interact with. Use when users want to plan something, organize tasks, create a todo list, or track progress.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        title: {
          type: SchemaType.STRING,
          description: 'Title for the task list',
        },
        description: {
          type: SchemaType.STRING,
          description: 'Brief description or context for the tasks',
        },
        tasks: {
          type: SchemaType.ARRAY,
          description: 'List of tasks',
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              text: { type: SchemaType.STRING },
              completed: { type: SchemaType.BOOLEAN },
              priority: { type: SchemaType.STRING },
            },
            required: ['id', 'text', 'completed'],
          },
        },
      },
      required: ['tasks'],
    },
  },
  {
    name: 'render_location_card',
    description:
      "Renders a location/map card showing a place on a map. Use when users ask about locations, places, addresses, restaurants, hotels, tourist attractions, directions, or 'where is X?'",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        name: {
          type: SchemaType.STRING,
          description: 'Name of the place or location',
        },
        address: {
          type: SchemaType.STRING,
          description: 'Street address',
        },
        city: {
          type: SchemaType.STRING,
          description: 'City name',
        },
        country: {
          type: SchemaType.STRING,
          description: 'Country name',
        },
        latitude: {
          type: SchemaType.NUMBER,
          description: 'Latitude coordinate',
        },
        longitude: {
          type: SchemaType.NUMBER,
          description: 'Longitude coordinate',
        },
        description: {
          type: SchemaType.STRING,
          description: 'Brief description of the place',
        },
        placeType: {
          type: SchemaType.STRING,
          description:
            'Type of place: restaurant, hotel, attraction, business, address, or city',
        },
      },
      required: ['name'],
    },
  },
]

// ============================================================================
// TOOL EXECUTION
// ============================================================================

// Common city/place coordinates lookup
const KNOWN_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'san francisco': { lat: 37.7749, lng: -122.4194 },
  'new york': { lat: 40.7128, lng: -74.006 },
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  london: { lat: 51.5074, lng: -0.1278 },
  paris: { lat: 48.8566, lng: 2.3522 },
  tokyo: { lat: 35.6762, lng: 139.6503 },
  sydney: { lat: -33.8688, lng: 151.2093 },
  berlin: { lat: 52.52, lng: 13.405 },
  rome: { lat: 41.9028, lng: 12.4964 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  singapore: { lat: 1.3521, lng: 103.8198 },
  'hong kong': { lat: 22.3193, lng: 114.1694 },
  amsterdam: { lat: 52.3676, lng: 4.9041 },
  barcelona: { lat: 41.3851, lng: 2.1734 },
  chicago: { lat: 41.8781, lng: -87.6298 },
  seattle: { lat: 47.6062, lng: -122.3321 },
  austin: { lat: 30.2672, lng: -97.7431 },
  denver: { lat: 39.7392, lng: -104.9903 },
  miami: { lat: 25.7617, lng: -80.1918 },
  boston: { lat: 42.3601, lng: -71.0589 },
  'eiffel tower': { lat: 48.8584, lng: 2.2945 },
  'statue of liberty': { lat: 40.6892, lng: -74.0445 },
  'golden gate bridge': { lat: 37.8199, lng: -122.4783 },
  'big ben': { lat: 51.5007, lng: -0.1246 },
  colosseum: { lat: 41.8902, lng: 12.4922 },
}

function getDefaultCoordinates(
  city?: string,
  name?: string
): { lat: number; lng: number } | undefined {
  const searchTerms = [name, city].filter(Boolean).map((s) => s!.toLowerCase())
  for (const term of searchTerms) {
    if (KNOWN_COORDINATES[term]) {
      return KNOWN_COORDINATES[term]
    }
    // Partial match
    for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
      if (term.includes(key) || key.includes(term)) {
        return coords
      }
    }
  }
  return undefined
}

function generateMockStockData(days: number, basePrice: number) {
  const data = []
  let price = basePrice
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    price = price * (1 + (Math.random() - 0.48) * 0.03)
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
    })
  }

  return data
}

function executeTool(
  name: string,
  args: Record<string, unknown>
): {
  success: boolean
  data: unknown
  ui: string
} {
  switch (name) {
    case 'render_weather_card':
      return {
        success: true,
        data: {
          ...args,
          forecast: [
            {
              day: 'Tomorrow',
              high: (args.temperature as number) + 2,
              low: (args.temperature as number) - 4,
              condition: args.condition,
            },
            {
              day: 'Day After',
              high: (args.temperature as number) + 1,
              low: (args.temperature as number) - 3,
              condition: 'partly-cloudy',
            },
            {
              day: 'In 3 Days',
              high: (args.temperature as number) - 1,
              low: (args.temperature as number) - 5,
              condition: 'cloudy',
            },
          ],
          lastUpdated: new Date().toISOString(),
        },
        ui: 'weather-card',
      }

    case 'render_stock_chart': {
      const basePrice = (args.currentPrice as number) || 150
      return {
        success: true,
        data: {
          ...args,
          dataPoints: generateMockStockData(30, basePrice * 0.95),
          volume: `${Math.floor(Math.random() * 80 + 20)}M`,
          lastUpdated: new Date().toISOString(),
        },
        ui: 'stock-chart',
      }
    }

    case 'render_code_sandbox':
      return {
        success: true,
        data: {
          ...args,
          executable: ['javascript', 'typescript'].includes(
            args.language as string
          ),
        },
        ui: 'code-sandbox',
      }

    case 'render_task_list':
      return {
        success: true,
        data: {
          ...args,
          showProgress: true,
        },
        ui: 'task-list',
      }

    case 'render_location_card':
      return {
        success: true,
        data: {
          ...args,
          // Add default coordinates for well-known cities if not provided
          latitude:
            args.latitude ??
            getDefaultCoordinates(args.city as string, args.name as string)
              ?.lat,
          longitude:
            args.longitude ??
            getDefaultCoordinates(args.city as string, args.name as string)
              ?.lng,
        },
        ui: 'location-card',
      }

    default:
      return {
        success: false,
        data: { error: `Unknown tool: ${name}` },
        ui: 'error',
      }
  }
}

// ============================================================================
// RATE LIMITING
// ============================================================================

const rateLimitStore = new Map<
  string,
  { requests: number[]; lastReset: number }
>()

function checkRateLimit(
  identifier: string,
  maxRequests = 50,
  windowMs = 60000
): boolean {
  const now = Date.now()
  let store = rateLimitStore.get(identifier)

  if (!store || now - store.lastReset > windowMs) {
    store = { requests: [], lastReset: now }
    rateLimitStore.set(identifier, store)
  }

  store.requests = store.requests.filter((time) => now - time < windowMs)

  if (store.requests.length >= maxRequests) {
    return false
  }

  store.requests.push(now)
  return true
}

// ============================================================================
// SSE HELPERS
// ============================================================================

function createSSEEncoder() {
  const encoder = new TextEncoder()
  return (event: SSEEvent) => {
    const data = `data: ${JSON.stringify(event)}\n\n`
    return encoder.encode(data)
  }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown'
  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: 'Rate limit exceeded. Please try again in a moment.' },
      { status: 429 }
    )
  }

  // Validate API key
  const apiKey =
    process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: 'Gemini API key not configured' },
      { status: 500 }
    )
  }

  // Parse request
  let body: RequestBody
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    )
  }

  const {
    messages,
    model = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
  } = body

  // Input validation
  const MAX_MESSAGE_LENGTH = 10000 // 10KB max per message
  const MAX_MESSAGES_COUNT = 50 // Max conversation history

  if (!messages || messages.length === 0) {
    return Response.json({ error: 'Messages are required' }, { status: 400 })
  }

  if (messages.length > MAX_MESSAGES_COUNT) {
    return Response.json(
      {
        error: `Conversation history limited to ${MAX_MESSAGES_COUNT} messages`,
      },
      { status: 400 }
    )
  }

  // Validate each message
  for (const msg of messages) {
    if (
      typeof msg.content !== 'string' ||
      msg.content.length > MAX_MESSAGE_LENGTH
    ) {
      return Response.json(
        {
          error: `Each message must be under ${MAX_MESSAGE_LENGTH} characters`,
        },
        { status: 400 }
      )
    }
  }

  const lastMessage = messages[messages.length - 1]

  const encode = createSSEEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const geminiModel = genAI.getGenerativeModel({
          model,
          tools: [
            {
              functionDeclarations:
                TOOL_DECLARATIONS as unknown as FunctionDeclaration[],
            },
          ],
        })

        // Build chat history
        const history = messages.slice(0, -1).map((m) => ({
          role: m.role === 'user' ? ('user' as const) : ('model' as const),
          parts: [{ text: m.content }],
        }))

        // Add system prompt as initial exchange
        history.unshift(
          {
            role: 'user' as const,
            parts: [{ text: `System: ${HERO_SYSTEM_PROMPT}` }],
          },
          {
            role: 'model' as const,
            parts: [
              {
                text: "Understood! I'm Clarity, ready to help and show off some cool demos.",
              },
            ],
          }
        )

        const chat = geminiModel.startChat({ history })
        const userMessage = messages[messages.length - 1].content

        // Send message and stream response
        const result = await chat.sendMessageStream(userMessage)

        let functionCalls: Array<{
          name: string
          args: Record<string, unknown>
        }> = []

        for await (const chunk of result.stream) {
          // Check for function calls
          const candidates = chunk.candidates
          if (candidates && candidates[0]?.content?.parts) {
            for (const part of candidates[0].content.parts) {
              if (part.functionCall) {
                const { name, args } = part.functionCall
                functionCalls.push({
                  name,
                  args: args as Record<string, unknown>,
                })

                // Send tool call event
                const toolCallId = `tool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                controller.enqueue(
                  encode({
                    type: 'tool-call',
                    id: toolCallId,
                    name,
                    args: args as Record<string, unknown>,
                  })
                )

                // Execute tool
                const toolResult = executeTool(
                  name,
                  args as Record<string, unknown>
                )

                // Send tool result event
                controller.enqueue(
                  encode({
                    type: 'tool-result',
                    id: toolCallId,
                    name,
                    data: toolResult.data,
                    ui: toolResult.ui,
                  })
                )
              }

              if (part.text) {
                controller.enqueue(
                  encode({
                    type: 'text-delta',
                    content: part.text,
                  })
                )
              }
            }
          }
        }

        // If there were function calls, send the results back to get a final response
        if (functionCalls.length > 0) {
          const functionResponseParts = functionCalls.map((fc) => ({
            functionResponse: {
              name: fc.name,
              response: executeTool(fc.name, fc.args).data as object,
            },
          }))

          // Send as an array of parts (content parts)
          const followUpResult = await chat.sendMessageStream(
            functionResponseParts as any
          )

          for await (const chunk of followUpResult.stream) {
            const text = chunk.text()
            if (text) {
              controller.enqueue(
                encode({
                  type: 'text-delta',
                  content: text,
                })
              )
            }
          }
        }

        // Send done event
        controller.enqueue(encode({ type: 'done' }))
        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
        controller.close()
      } catch (error) {
        logger.error('Hero Chat API error:', error)
        controller.enqueue(
          encode({
            type: 'error',
            message:
              error instanceof Error
                ? error.message
                : 'An unexpected error occurred',
          })
        )
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
}

/**
 * GET /api/hero-chat - Health check
 */
export async function GET() {
  const hasKey = !!(
    process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
  )

  return Response.json({
    status: 'ok',
    service: 'Hero Chat',
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
    hasGeminiKey: hasKey,
    tools: [
      'render_weather_card',
      'render_stock_chart',
      'render_code_sandbox',
      'render_task_list',
      'render_location_card',
    ],
  })
}
