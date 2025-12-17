import { logger } from '@clarity-chat/utils/logger';
/**
 * Clarity Chat Error Handling Example
 *
 * Example demonstrating error handling with useClarityChat,
 * including memory error handling, retry logic, and error display.
 *
 * @example
 * ```tsx
 * import { ClarityChatErrorHandlingExample } from '@clarity-chat/react/examples'
 *
 * function App() {
 *   return <ClarityChatErrorHandlingExample />
 * }
 * ```
 */

import * as React from 'react'
import { useClarityChat } from '../hooks/use-clarity-chat'
import { ChatWindow } from '../components/chat/chat-window'
import { convertCoreMessagesToMessages } from '../utils/message-conversion'
import { ErrorBoundary } from '../components/error-boundary'
import { Badge, Alert, Button } from '@clarity-chat/primitives'

/**
 * Error Display Component
 */
function ErrorDisplay({
  errorInfo,
  onDismiss,
}: {
  errorInfo: {
    memoryError: Error | null
    memoryErrorOperation: 'query' | 'store' | null
    memoryErrorType:
      | 'network'
      | 'ratelimit'
      | 'server'
      | 'auth'
      | 'memory'
      | 'unknown'
      | null
  }
  onDismiss: () => void
}) {
  if (!errorInfo.memoryError) return null

  const getErrorColor = () => {
    switch (errorInfo.memoryErrorType) {
      case 'network':
        return 'yellow'
      case 'ratelimit':
        return 'orange'
      case 'server':
        return 'red'
      case 'auth':
        return 'red'
      default:
        return 'gray'
    }
  }

  const getErrorMessage = () => {
    switch (errorInfo.memoryErrorType) {
      case 'network':
        return 'Network error: Unable to connect to memory service. Retrying...'
      case 'ratelimit':
        return 'Rate limit: Too many memory operations. Please wait.'
      case 'server':
        return 'Server error: Memory service temporarily unavailable.'
      case 'auth':
        return 'Authentication error: Please check your credentials.'
      case 'memory':
        return 'Memory error: Unable to process memory operation.'
      default:
        return `Error: ${errorInfo.memoryError.message}`
    }
  }

  return (
    <Alert variant={getErrorColor()} className="mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs">
              {errorInfo.memoryErrorOperation || 'unknown'}
            </Badge>
            <span className="text-sm font-medium">Memory Operation Failed</span>
          </div>
          <p className="text-sm">{getErrorMessage()}</p>
        </div>
        <Button size="sm" variant="ghost" onClick={onDismiss} className="ml-2">
          Dismiss
        </Button>
      </div>
    </Alert>
  )
}

/**
 * Clarity Chat with Error Handling Example Component
 *
 * Demonstrates comprehensive error handling with useClarityChat:
 * - Memory error callbacks
 * - Error state display
 * - Retry configuration
 * - Error classification
 */
export function ClarityChatErrorHandlingExample() {
  const [dismissedErrors, setDismissedErrors] = React.useState<Set<string>>(
    new Set()
  )

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
        // Custom error handling
        console.error(`Memory ${operation} failed:`, error)

        // You could send to error tracking service here
        // trackError('memory_operation_failed', { operation, error: error.message })
      },
    },
  })

  // Convert CoreMessage[] to Message[] for ChatWindow
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

  const handleDismissError = React.useCallback(() => {
    if (memoryErrorInfo.memoryError) {
      const errorKey = `${memoryErrorInfo.memoryErrorOperation}-${memoryErrorInfo.memoryErrorType}`
      setDismissedErrors((prev) => new Set([...prev, errorKey]))
    }
  }, [memoryErrorInfo])

  // Check if current error should be displayed
  const shouldShowError =
    memoryErrorInfo.memoryError &&
    !dismissedErrors.has(
      `${memoryErrorInfo.memoryErrorOperation}-${memoryErrorInfo.memoryErrorType}`
    )

  return (
    <ErrorBoundary>
      <div className="flex h-screen w-full flex-col">
        <div className="border-b bg-card px-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Chat with Error Handling
              </h2>
              <p className="text-sm text-muted-foreground">
                Demonstrates memory error handling and recovery
              </p>
            </div>
            <div className="flex items-center gap-2">
              {memoryInfo.enabled && (
                <Badge variant="secondary">
                  Memory: {memoryInfo.memoryCount} items
                </Badge>
              )}
              {memoryErrorInfo.memoryError && (
                <Badge variant="destructive">Error</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {shouldShowError && (
            <ErrorDisplay
              errorInfo={memoryErrorInfo}
              onDismiss={handleDismissError}
            />
          )}

          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            showHeader={false}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
