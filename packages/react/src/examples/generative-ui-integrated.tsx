/**
 * Integrated Generative UI Example
 *
 * Complete example showing useClarityChat + useAssistant + tool registry
 * working together for a full generative UI experience.
 */

import * as React from 'react'
import {
  useClarityChat,
  convertCoreMessagesToMessages,
} from '../hooks/use-clarity-chat'
import { useAssistant, type ToolInvocation } from '../hooks/use-assistant'
import { ChatWindow } from '../components/chat/chat-window'
import {
  ClarityToolResult,
  type ToolCall,
} from '../components/clarity-tool-result'
import {
  createToolUIRegistry,
  type ToolComponentRegistry,
} from '../../agents/tool-ui-registry'
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
    const { query, limit = 3 } = args
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      query,
      results: [
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
      ].slice(0, limit),
      totalResults: 3,
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

export function GenerativeUIIntegratedExample() {
  const [useAssistantMode, setUseAssistantMode] = React.useState(false)

  // useClarityChat for standard chat
  const chatHook = useClarityChat({
    api: '/api/chat',
  })

  // useAssistant for tool calling
  const assistantHook = useAssistant({
    api: '/api/assistant',
    assistantId: 'generative-ui-assistant',
    tools: [weatherTool, faqSearchTool],
  })

  const activeHook = useAssistantMode ? assistantHook : chatHook

  const messages = React.useMemo(() => {
    if (useAssistantMode) {
      // Convert assistant messages
      return convertCoreMessagesToMessages(assistantHook.messages)
    } else {
      return convertCoreMessagesToMessages(chatHook.messages)
    }
  }, [useAssistantMode, chatHook.messages, assistantHook.messages])

  const handleSendMessage = React.useCallback(
    async (content: string) => {
      if (useAssistantMode) {
        await assistantHook.submitMessage(content)
      } else {
        await chatHook.append({
          role: 'user',
          content,
        })
      }
    },
    [useAssistantMode, chatHook, assistantHook]
  )

  // Extract tool invocations from assistant hook
  const toolInvocations = useAssistantMode ? assistantHook.toolInvocations : []

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Integrated Generative UI</h1>
            <p className="text-sm text-muted-foreground mt-1">
              useClarityChat + useAssistant + Tool Registry
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={useAssistantMode ? 'info' : 'secondary'}>
              {useAssistantMode ? 'Assistant Mode' : 'Chat Mode'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUseAssistantMode(!useAssistantMode)}
            >
              Switch to {useAssistantMode ? 'Chat' : 'Assistant'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ChatWindow
          messages={messages}
          isLoading={activeHook.isLoading}
          onSendMessage={handleSendMessage}
          showHeader
          sessionTitle="Generative UI"
          sessionSubtitle={
            useAssistantMode ? 'Assistant with tool calling' : 'Standard chat'
          }
        />
      </div>

      {/* Tool Invocations Display */}
      {useAssistantMode && toolInvocations.length > 0 && (
        <div className="border-t p-4 bg-muted/50">
          <h3 className="text-sm font-semibold mb-2">Tool Invocations</h3>
          <div className="space-y-2">
            {toolInvocations.map((invocation, idx) => {
              // Convert ToolInvocation to ToolCall format
              const toolCall: ToolCall = {
                name: invocation.toolName,
                args: invocation.args || {},
                id: invocation.toolCallId || `tool-${idx}`,
              }

              return (
                <div
                  key={invocation.toolCallId || idx}
                  className="border rounded-lg p-3 bg-background"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-medium">
                      Tool: {invocation.toolName}
                    </div>
                    <Badge
                      variant={
                        invocation.state === 'result'
                          ? 'success'
                          : invocation.state === 'error'
                            ? 'destructive'
                            : 'info'
                      }
                    >
                      {invocation.state}
                    </Badge>
                  </div>
                  {invocation.state === 'result' && invocation.result && (
                    <ClarityToolResult
                      registry={toolRegistry}
                      toolCall={toolCall}
                      result={invocation.result}
                      messages={messages}
                    />
                  )}
                  {(invocation.state === 'call' ||
                    invocation.state === 'partial-call') && (
                    <div className="text-sm text-muted-foreground">
                      Executing tool with args:{' '}
                      {JSON.stringify(invocation.args)}
                    </div>
                  )}
                  {invocation.state === 'error' && (
                    <div className="text-sm text-red-600">
                      Error: {invocation.error || 'Unknown error'}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeHook.error && (
        <div className="border-t border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {activeHook.error.message}
          </p>
        </div>
      )}
    </div>
  )
}
