import * as React from 'react'
import { ClarityChat } from '../components/clarity-chat'
import { Card } from '@clarity-chat/primitives'
import type { ToolRenderer } from '../components/message/tool-invocation'

/**
 * Demo Weather Tool Renderer
 * Shows how to build rich UIs for tool results
 */
const WeatherCard: ToolRenderer = ({ args, result, state }) => {
  if (state !== 'result' || !result) return null
  
  const { location } = args
  const { temperature, condition, humidity } = result
  
  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4 my-2 max-w-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold text-foreground/90">{location}</h3>
          <div className="text-3xl font-bold text-foreground mt-1">{temperature}°</div>
          <div className="text-sm text-muted-foreground capitalize">{condition}</div>
        </div>
        <div className="text-4xl">
          {condition === 'sunny' ? '☀️' : condition === 'rainy' ? '🌧️' : '☁️'}
        </div>
      </div>
      <div className="mt-3 flex gap-4 text-xs text-muted-foreground/80">
        <div className="flex items-center gap-1">
          <span>💧</span> Humidity: {humidity}%
        </div>
        <div className="flex items-center gap-1">
          <span>💨</span> Wind: 12mph
        </div>
      </div>
    </div>
  )
}

/**
 * Mock API Handler to simulate streaming and tools
 */
const mockApiHandler = async (req: Request) => {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1]
  
  // Create a stream
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const push = (str: string) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(str)}\n\n`))
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

      if (lastMessage.content.toLowerCase().includes('weather')) {
        // Simulate tool call
        push({ content: "I'll check the weather for you..." })
        await delay(500)
        
        // Tool Call Chunk
        push({
          choices: [{
            delta: {
              tool_calls: [{
                index: 0,
                id: 'call_weather_123',
                type: 'function',
                function: { name: 'get_weather', arguments: '{"location": "San Francisco"}' }
              }]
            }
          }]
        })
        await delay(1000)

        // Tool Result Chunk (simulated)
        push({
          toolInvocation: {
            toolCallId: 'call_weather_123',
            toolName: 'get_weather',
            args: { location: 'San Francisco' },
            state: 'result',
            result: { temperature: 72, condition: 'sunny', humidity: 45 }
          }
        })
        
        await delay(500)
        push({ content: "It looks like it's a beautiful sunny day in San Francisco!" })
      } else {
        // Standard chat response
        const text = "I'm a demo agent! Try asking me about the weather in San Francisco to see a tool call in action."
        const words = text.split(' ')
        for (const word of words) {
          push({ content: word + ' ' })
          await delay(50)
        }
      }
      
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    }
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' }
  })
}

export function AgenticChatDemo() {
  // In a real app, this API endpoint would be on your server
  // Here we override fetch to mock it entirely client-side
  const mockFetch = async (url: string, init?: RequestInit) => {
    return mockApiHandler(new Request(url, init))
  }

  return (
    <div className="h-[600px] w-full max-w-2xl mx-auto p-4">
      <Card className="h-full overflow-hidden shadow-2xl border-border/50">
        <ClarityChat 
          api="/api/mock/chat"
          sessionTitle="Agentic Assistant"
          sessionSubtitle="Capable of using tools and reasoning"
          showHeader
          // Pass custom fetch for demo purposes
          fetch={mockFetch as any}
          // Register custom tool renderers
          toolRenderers={{
            'get_weather': WeatherCard
          }}
          // Enable new features
          showStarterPrompts
          starterPrompts={[
            { text: "What's the weather in San Francisco?", label: "Check Weather" },
            { text: "Analyze my spending habits", label: "Financial Analysis" },
          ]}
        />
      </Card>
    </div>
  )
}
