/**
 * Generative UI Tools Example
 * 
 * Demonstrates the tool → UI registry pattern with useClarityChat.
 * Shows how tool results can be rendered as custom UI components.
 * 
 * @example
 * ```tsx
 * import { GenerativeUIToolsExample } from '@clarity-chat/react/examples'
 * 
 * function App() {
 *   return <GenerativeUIToolsExample />
 * }
 * ```
 */

import * as React from 'react'
import { useClarityChat } from '../hooks/use-clarity-chat'
import { ChatWindow } from '../components/chat-window'
import { coreMessagesToMessages } from '../utils/message-converter'
import { ClarityToolResult } from '../components/clarity-tool-result'
import { createToolUIRegistry, type ToolComponentProps } from '../agents/tool-ui-registry'
import type { Message } from '@clarity-chat/types'
import type { ToolCall } from '../adapters/types'
import { Card, Badge } from '@clarity-chat/primitives'

/**
 * Weather Data Type
 */
interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
}

/**
 * Weather Result Component
 * Renders weather tool results as a card
 */
function WeatherResult({ data }: ToolComponentProps<WeatherData>) {
  const weather = data as WeatherData
  
  return (
    <Card className="border-blue-200 bg-blue-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{weather.location}</h3>
          <Badge variant="info">{weather.condition}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-muted-foreground">Temperature</p>
            <p className="text-2xl font-bold">{weather.temperature}°F</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Humidity</p>
            <p className="text-lg">{weather.humidity}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Wind Speed</p>
            <p className="text-lg">{weather.windSpeed} mph</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * FAQ Search Result Type
 */
interface FAQResult {
  query: string
  results: Array<{
    question: string
    answer: string
    category: string
    relevance: number
  }>
}

/**
 * FAQ Search Result Component
 * Renders FAQ search results as a list
 */
function FAQSearchResult({ data }: ToolComponentProps<FAQResult>) {
  const faq = data as FAQResult
  
  return (
    <Card className="border-green-200 bg-green-50">
      <div className="p-4">
        <h3 className="font-semibold mb-3">FAQ Results for: "{faq.query}"</h3>
        <div className="space-y-3">
          {faq.results.map((item, idx) => (
            <div key={idx} className="border-b pb-3 last:border-b-0">
              <div className="flex items-start justify-between mb-1">
                <p className="font-medium">{item.question}</p>
                <Badge variant="success" className="text-xs">
                  {Math.round(item.relevance * 100)}% match
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{item.answer}</p>
              <Badge variant="outline" className="mt-2 text-xs">
                {item.category}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

/**
 * Create tool UI registry
 */
const toolRegistry = createToolUIRegistry({
  weather: WeatherResult,
  get_weather: WeatherResult, // Alias
  faq_search: FAQSearchResult,
  search_faq: FAQSearchResult, // Alias
})

/**
 * Extract tool calls and results from messages
 * 
 * Looks for tool invocations in message metadata and constructs
 * ToolCall objects for rendering with ClarityToolResult.
 */
function extractToolResults(messages: Message[]): Array<{
  toolCall: ToolCall
  result: any
}> {
  const toolResults: Array<{ toolCall: ToolCall; result: any }> = []
  
  for (const message of messages) {
    // Check for tool invocations in metadata (from CoreMessage.toolInvocations)
    if (message.metadata?.toolInvocations) {
      const invocations = message.metadata.toolInvocations
      
      if (Array.isArray(invocations)) {
        for (const invocation of invocations) {
          // Only include completed tool calls with results
          if (invocation.toolCallId && invocation.state === 'result' && invocation.result !== undefined) {
            const toolCall: ToolCall = {
              id: invocation.toolCallId,
              type: 'function',
              function: {
                name: invocation.toolName || 'unknown',
                arguments: JSON.stringify(invocation.args || {}),
              },
            }
            
            toolResults.push({
              toolCall,
              result: invocation.result,
            })
          }
        }
      }
    }
    
    // Also check for tool calls in message metadata (direct tool call)
    if (message.metadata?.toolCallId && message.metadata?.name) {
      const toolCall: ToolCall = {
        id: message.metadata.toolCallId,
        type: 'function',
        function: {
          name: message.metadata.name,
          arguments: JSON.stringify(message.metadata.args || {}),
        },
      }
      
      // Try to extract result from metadata or content
      let result = message.metadata.result
      if (!result && message.content) {
        try {
          result = JSON.parse(message.content)
        } catch {
          // Content is not JSON, use as-is
          result = message.content
        }
      }
      
      if (result) {
        toolResults.push({ toolCall, result })
      }
    }
  }
  
  return toolResults
}

/**
 * Generative UI Tools Example Component
 */
export function GenerativeUIToolsExample() {
  const {
    messages: coreMessages,
    append,
    isLoading,
    error,
  } = useClarityChat({
    api: '/api/chat',
  })

  // Convert messages
  const messages = React.useMemo(
    () => coreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  // Extract tool results from messages
  const toolResults = React.useMemo(
    () => extractToolResults(messages),
    [messages]
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

  return (
    <div className="flex h-screen flex-col">
      <div className="border-b bg-muted/50 p-4">
        <h1 className="text-xl font-bold">Generative UI with Tools</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Try: "What's the weather in San Francisco?" or "Search FAQ for pricing"
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          showHeader={false}
        />
        
        {/* Render tool results */}
        {toolResults.length > 0 && (
          <div className="p-4 space-y-4">
            {toolResults.map(({ toolCall, result }, idx) => (
              <ClarityToolResult
                key={`${toolCall.id}-${idx}`}
                registry={toolRegistry}
                toolCall={toolCall}
                result={result}
                messages={messages}
              />
            ))}
          </div>
        )}
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
