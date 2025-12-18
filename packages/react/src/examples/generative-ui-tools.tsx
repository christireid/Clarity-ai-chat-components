/**
 * Generative UI Tools Example
 *
 * Demonstrates end-to-end generative UI with:
 * - Tool definitions (weather, FAQ search)
 * - Tool UI registry
 * - useClarityChat integration
 * - ClarityToolResult rendering
 */

import * as React from 'react'
import {
  useClarityChat,
  convertCoreMessagesToMessages,
} from '../hooks/use-clarity-chat'
import { ChatWindow } from '../components/chat/chat-window'
import {
  ClarityToolResult,
  type ToolCall,
} from '../components/clarity-tool-result'
import {
  createToolUIRegistry,
  type ToolComponentRegistry,
} from '../agents/tool-ui-registry'
import {
  Card,
  CardContent,
  CardHeader,
  Badge,
  Button,
} from '@clarity-chat/primitives'
import type { Tool } from '../agents/types'

// ============================================================================
// Tool Definitions
// ============================================================================

const weatherTool: Tool = {
  name: 'get_weather',
  description: 'Get current weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'City name or location',
      },
      units: {
        type: 'string',
        enum: ['celsius', 'fahrenheit'],
        description: 'Temperature units',
      },
    },
    required: ['location'],
  },
  async execute(args) {
    // Mock weather API
    const { location, units = 'celsius' } = args
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      location,
      temperature: units === 'celsius' ? 22 : 72,
      condition: 'Sunny',
      humidity: 65,
      windSpeed: 10,
      units,
    }
  },
}

const faqSearchTool: Tool = {
  name: 'search_faq',
  description: 'Search FAQ database for answers',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query',
      },
      limit: {
        type: 'number',
        description: 'Maximum results (default: 3)',
      },
    },
    required: ['query'],
  },
  async execute(args) {
    // Mock FAQ search
    const { query, limit = 3 } = args
    await new Promise((resolve) => setTimeout(resolve, 300))

    const faqs = [
      {
        question: 'How do I reset my password?',
        answer: 'Go to Settings > Security > Reset Password',
        category: 'Account',
      },
      {
        question: 'What is your refund policy?',
        answer: 'We offer 30-day money-back guarantee',
        category: 'Billing',
      },
      {
        question: 'How do I contact support?',
        answer: 'Email support@example.com or use the chat',
        category: 'Support',
      },
    ]

    return {
      query,
      results: faqs.slice(0, limit),
      totalResults: faqs.length,
    }
  },
}

// ============================================================================
// Tool UI Components
// ============================================================================

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  units: string
}

function WeatherResult({ data }: { data: WeatherData }) {
  return (
    <Card className="mt-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Weather in {data.location}</h3>
          <Badge variant="info">{data.condition}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold">
            {data.temperature}°{data.units === 'celsius' ? 'C' : 'F'}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Humidity:</span>{' '}
              {data.humidity}%
            </div>
            <div>
              <span className="text-muted-foreground">Wind:</span>{' '}
              {data.windSpeed} km/h
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface FAQSearchData {
  query: string
  results: Array<{
    question: string
    answer: string
    category: string
  }>
  totalResults: number
}

function FAQSearchResults({ data }: { data: FAQSearchData }) {
  return (
    <Card className="mt-2">
      <CardHeader>
        <h3 className="text-lg font-semibold">
          FAQ Results for "{data.query}"
        </h3>
        <p className="text-sm text-muted-foreground">
          Found {data.totalResults} results
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.results.map((faq, idx) => (
            <div key={idx} className="border-l-2 border-primary pl-4">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">
                  {faq.category}
                </Badge>
                <h4 className="font-medium">{faq.question}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Tool Registry
// ============================================================================

const toolRegistry = createToolUIRegistry({
  get_weather: WeatherResult,
  search_faq: FAQSearchResults,
})

// ============================================================================
// Main Component
// ============================================================================

export function GenerativeUIToolsExample() {
  const {
    messages: coreMessages,
    append,
    isLoading,
    error,
  } = useClarityChat({
    api: '/api/chat',
    // In a real implementation, you would configure tools here
    // For this example, we'll simulate tool calls from messages
  })

  const messages = React.useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  const handleSendMessage = React.useCallback(
    async (content: string) => {
      await append({
        role: 'user',
        content,
      })
    },
    [append]
  )

  // Extract tool calls and results from messages
  const messagesWithToolResults = React.useMemo(() => {
    return messages.map((msg, idx) => {
      // Check if this message has tool calls (simulated)
      // In a real implementation, tool calls would come from the API response
      if (msg.role === 'assistant' && msg.content.includes('[TOOL:')) {
        // Parse simulated tool call format: [TOOL:toolName:args:result]
        const toolMatch = msg.content.match(/\[TOOL:([^:]+):([^:]+):([^\]]+)\]/)
        if (toolMatch) {
          const [, toolName, argsStr, resultStr] = toolMatch
          try {
            const args = JSON.parse(argsStr)
            const result = JSON.parse(resultStr)

            return {
              ...msg,
              toolCall: {
                name: toolName,
                args,
                id: `tool-${idx}`,
              },
              toolResult: result,
            }
          } catch {
            // Invalid format, return original message
          }
        }
      }
      return msg
    })
  }, [messages])

  // Simulate tool execution for demo purposes
  const handleToolExecution = React.useCallback(
    async (toolName: string, args: Record<string, any>) => {
      let result: any

      if (toolName === 'get_weather') {
        result = await weatherTool.execute(args)
      } else if (toolName === 'search_faq') {
        result = await faqSearchTool.execute(args)
      } else {
        result = { error: 'Unknown tool' }
      }

      // Append assistant message with tool result
      await append({
        role: 'assistant',
        content: `I've executed the ${toolName} tool.`,
      })
    },
    [append]
  )

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold">Generative UI Tools Example</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Chat with tools that render rich UI components
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messagesWithToolResults.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">{msg.role}</div>
                  <div className="text-sm">{msg.content}</div>

                  {/* Render tool result if available */}
                  {'toolCall' in msg &&
                    msg.toolCall &&
                    'toolResult' in msg &&
                    msg.toolResult && (
                      <ClarityToolResult
                        registry={toolRegistry}
                        toolCall={msg.toolCall as ToolCall}
                        result={msg.toolResult}
                        messages={messages}
                      />
                    )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">
                    Thinking...
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask about weather or search FAQs..."
              className="flex-1 px-4 py-2 border rounded-lg"
              onKeyDown={async (e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  await handleSendMessage(e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
              disabled={isLoading}
            />
            <Button
              onClick={async () => {
                const input = document.querySelector(
                  'input'
                ) as HTMLInputElement
                if (input?.value.trim()) {
                  await handleSendMessage(input.value)
                  input.value = ''
                }
              }}
              disabled={isLoading}
            >
              Send
            </Button>
          </div>

          {/* Demo buttons */}
          <div className="mt-2 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleToolExecution('get_weather', {
                  location: 'San Francisco',
                  units: 'celsius',
                })
              }
            >
              Get Weather Demo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleToolExecution('search_faq', {
                  query: 'password',
                  limit: 3,
                })
              }
            >
              Search FAQ Demo
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="border-t border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error.message}
          </p>
        </div>
      )}
    </div>
  )
}
