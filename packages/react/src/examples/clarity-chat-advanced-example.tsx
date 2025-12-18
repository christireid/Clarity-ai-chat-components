/**
 * Advanced Clarity Chat Example
 * 
 * Demonstrates advanced features of useClarityChat including:
 * - Custom message handlers
 * - Performance monitoring
 * - Analytics integration
 * - Error recovery
 * - Memory optimization
 * 
 * @example
 * ```tsx
 * import { ClarityChatAdvancedExample } from '@clarity-chat/react/examples'
 * 
 * function App() {
 *   return <ClarityChatAdvancedExample />
 * }
 * ```
 */

import * as React from 'react'
import {
  useClarityChat,
  ChatWindow,
  convertCoreMessagesToMessages,
  createUserMessage,
  extractTextContent,
  isUserMessage,
  type ChatEvent,
} from '@clarity-chat/react'
import { MemoryProvider } from '../memory/memory-provider'
import { Badge, Card, Button } from '@clarity-chat/primitives'

/**
 * Performance Metrics Component
 */
function PerformanceMetrics({
  metrics,
}: {
  metrics: {
    averageResponseTime: number
    messagesSent: number
    messagesReceived: number
    memoryOperations: number
    errorCount: number
  }
}) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-2">Performance Metrics</h3>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Avg Response:</span>
          <span className="ml-1 font-medium">{metrics.averageResponseTime}ms</span>
        </div>
        <div>
          <span className="text-muted-foreground">Sent:</span>
          <span className="ml-1 font-medium">{metrics.messagesSent}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Received:</span>
          <span className="ml-1 font-medium">{metrics.messagesReceived}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Memory Ops:</span>
          <span className="ml-1 font-medium">{metrics.memoryOperations}</span>
        </div>
        <div className="col-span-2">
          <span className="text-muted-foreground">Errors:</span>
          <span className={`ml-1 font-medium ${metrics.errorCount > 0 ? 'text-destructive' : ''}`}>
            {metrics.errorCount}
          </span>
        </div>
      </div>
    </Card>
  )
}

/**
 * Advanced Clarity Chat Example Component
 */
export function ClarityChatAdvancedExample() {
  const [metrics, setMetrics] = React.useState({
    averageResponseTime: 0,
    messagesSent: 0,
    messagesReceived: 0,
    memoryOperations: 0,
    errorCount: 0,
  })

  const [responseTimes, setResponseTimes] = React.useState<number[]>([])
  const requestStartTimeRef = React.useRef<number | null>(null)

  const {
    messages: coreMessages,
    append,
    isLoading,
    memoryInfo,
    memoryErrorInfo,
  } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'vector-store',
      retryOnError: true,
      maxRetryAttempts: 3,
      onMemoryError: (error, operation) => {
        // Track memory errors
        setMetrics((prev) => ({
          ...prev,
          errorCount: prev.errorCount + 1,
        }))

        // Track memory operations
        setMetrics((prev) => ({
          ...prev,
          memoryOperations: prev.memoryOperations + 1,
        }))

        logger.error(`Memory ${operation} error:`, error)
      },
    },
    onFinish: async (message) => {
      // Track message received
      setMetrics((prev) => ({
        ...prev,
        messagesReceived: prev.messagesReceived + 1,
      }))

      // Calculate response time
      if (requestStartTimeRef.current) {
        const responseTime = Date.now() - requestStartTimeRef.current
        setResponseTimes((prev) => [...prev, responseTime])
        
        const avgResponseTime = Math.round(
          [...responseTimes, responseTime].reduce((a, b) => a + b, 0) /
          (responseTimes.length + 1)
        )
        
        setMetrics((prev) => ({
          ...prev,
          averageResponseTime: avgResponseTime,
        }))

        requestStartTimeRef.current = null
      }

      // Track memory storage
      if (memoryInfo.enabled) {
        setMetrics((prev) => ({
          ...prev,
          memoryOperations: prev.memoryOperations + 1,
        }))
      }
    },
  })

  // Convert CoreMessage[] to Message[] for ChatWindow
  const messages = React.useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  const handleSendMessage = React.useCallback(
    async (content: string) => {
      // Track message sent
      setMetrics((prev) => ({
        ...prev,
        messagesSent: prev.messagesSent + 1,
      }))

      // Record request start time
      requestStartTimeRef.current = Date.now()

      // Track memory query
      if (memoryInfo.enabled) {
        setMetrics((prev) => ({
          ...prev,
          memoryOperations: prev.memoryOperations + 1,
        }))
      }

      await append(createUserMessage(content))
    },
    [append, memoryInfo.enabled]
  )

  // Calculate user vs assistant message counts
  const userMessageCount = React.useMemo(
    () => coreMessages.filter(isUserMessage).length,
    [coreMessages]
  )

  const assistantMessageCount = coreMessages.length - userMessageCount

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Header with Stats */}
      <div className="border-b bg-card px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-semibold">Advanced Chat</h2>
            <p className="text-sm text-muted-foreground">
              Performance monitoring, analytics, and error recovery
            </p>
          </div>
          <div className="flex items-center gap-2">
            {memoryInfo.enabled && (
              <Badge variant="secondary">
                Memory: {memoryInfo.memoryCount}
              </Badge>
            )}
            <Badge variant="outline">
              {userMessageCount} user / {assistantMessageCount} assistant
            </Badge>
            {memoryErrorInfo.memoryError && (
              <Badge variant="destructive">Error</Badge>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <PerformanceMetrics metrics={metrics} />
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          showHeader={false}
        />
      </div>

      {/* Error Display */}
      {memoryErrorInfo.memoryError && (
        <div className="border-t bg-destructive/10 px-4 py-2">
          <p className="text-sm text-destructive">
            Memory {memoryErrorInfo.memoryErrorOperation} error: 
            {memoryErrorInfo.memoryError.message}
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Wrapper with MemoryProvider
 */
export function ClarityChatAdvancedExampleWrapped() {
  return (
    <MemoryProvider
      config={{
        maxMemories: 1000,
        enableVectorSearch: true,
      }}
    >
      <ClarityChatAdvancedExample />
    </MemoryProvider>
  )
}
