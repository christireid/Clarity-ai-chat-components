# Comprehensive Integration Example

This document demonstrates how to use all Phase 3 enhancements together in a production AI chat application.

---

## Complete Chat Application Example

### Setup

```tsx
import React from 'react'
import {
  // Components
  ErrorBoundary,
  RetryButton,
  NetworkStatus,
  TokenCounter,
  MessageList,
  ChatInput,
  StreamCancellation,
  
  // Hooks
  useStreamingSSE,
  useErrorRecovery,
  useTokenTracker,
  useMessageOperations,
  useRealisticTyping,
} from '@clarity-chat/react'
```

---

## Full Implementation

```tsx
function ChatApplication() {
  // 1. Message operations (edit, regenerate, branch, undo)
  const {
    messages,
    addMessage,
    editMessage,
    regenerateMessage,
    deleteMessage,
    branchConversation,
    undo,
    canUndo,
  } = useMessageOperations({
    onEdit: (id, content) => {
      console.log('Message edited:', id)
      analytics.track('message_edited')
    },
    onRegenerate: async (messageId) => {
      // Get context up to this message
      const context = getMessagesUpTo(messageId)
      
      // Delete old assistant message
      deleteMessage(messageId)
      
      // Regenerate with same context
      await sendToAI(context)
    },
    onBranch: (branchId, parentId) => {
      console.log('Created conversation branch:', branchId)
      analytics.track('conversation_branched')
    },
  })

  // 2. Token tracking and cost management
  const {
    tokens,
    estimatedCost,
    isNearLimit,
    isCritical,
    canSend,
    addMessage: addTokenMessage,
    suggestPruning,
  } = useTokenTracker({
    modelName: 'gpt-4',
    warningThreshold: 0.8,
    criticalThreshold: 0.95,
    onWarning: () => {
      toast.warning('Approaching context limit')
      analytics.track('token_warning')
    },
    onCritical: () => {
      toast.error('Context limit nearly reached!')
      analytics.track('token_critical')
    },
  })

  // 3. Realistic typing simulation
  const {
    isTyping,
    currentStage,
    stageProgress,
    startTyping,
    stopTyping,
    delayResponse,
  } = useRealisticTyping({
    minDelay: 800,
    maxDelay: 3000,
    wordsPerMinute: 400,
    stages: [
      { duration: 1500, label: 'Reading your message...' },
      { duration: 2500, label: 'Thinking deeply...' },
      { duration: 2000, label: 'Crafting response...' },
    ],
  })

  // 4. SSE streaming with reconnection
  const {
    status,
    data,
    error: streamError,
    connect,
    disconnect,
    reconnectAttempt,
    isReconnecting,
  } = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    authToken: user.token,
    autoReconnect: true,
    maxReconnectAttempts: 5,
    onMessage: (event) => {
      if (event.type === 'token') {
        // Accumulate streaming tokens
        updateCurrentMessage(event.data)
      } else if (event.type === 'done') {
        // Finalize message
        finalizeMessage()
        stopTyping()
        disconnect()
      }
    },
    onError: (error) => {
      console.error('Streaming error:', error)
    },
  })

  // 5. Error recovery for API calls
  const {
    execute: sendMessage,
    error: apiError,
    errorType,
    errorMessage,
    retry,
    canRetry,
    isRetrying,
  } = useErrorRecovery({
    operation: async (message: string) => {
      // Check token limit first
      const estimatedTokens = estimateTokens(message)
      if (!canSend(estimatedTokens)) {
        throw new Error('Message would exceed context limit')
      }

      // Start realistic typing
      startTyping(message, 200)

      // Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          message,
          conversationId: currentConversation.id,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      return response.json()
    },
    maxAttempts: 3,
    backoffMs: [1000, 3000, 10000],
    shouldRetry: (error, attempt) => {
      // Don't retry auth errors
      if (error.message.includes('401')) return false
      // Don't retry after 3 attempts for network errors
      if (error.message.includes('Network') && attempt > 3) return false
      return true
    },
    onRetryStart: (attempt) => {
      analytics.track('message_retry', { attempt })
    },
    onMaxAttemptsReached: () => {
      toast.error('Failed to send message. Please try again later.')
      showSupportDialog()
    },
  })

  // Handle sending messages
  const handleSend = async (content: string) => {
    // Add user message
    const userMsgId = addMessage({
      role: 'user',
      content,
    })

    // Track tokens
    addTokenMessage({
      role: 'user',
      content,
      tokens: estimateTokens(content),
    })

    // Send with error recovery
    const result = await sendMessage(content)

    if (result) {
      // Add assistant response
      const assistantMsgId = addMessage({
        role: 'assistant',
        content: result.response,
      })

      // Track tokens
      addTokenMessage({
        role: 'assistant',
        content: result.response,
        tokens: result.tokens,
      })

      // Stop typing indicator
      stopTyping()
    }
  }

  // Handle message editing
  const handleEdit = (messageId: string, newContent: string) => {
    editMessage(messageId, newContent)
    
    // If user message, regenerate response
    const message = messages.find(m => m.id === messageId)
    if (message?.role === 'user') {
      // Find and delete assistant's response
      const assistantMsg = messages.find(
        m => m.role === 'assistant' && m.parentId === messageId
      )
      if (assistantMsg) {
        deleteMessage(assistantMsg.id)
      }
      
      // Resend with edited message
      handleSend(newContent)
    }
  }

  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="error-container">
          <h1>Chat Error</h1>
          <p>{error.message}</p>
          <button onClick={reset}>Restart Chat</button>
        </div>
      )}
      onError={(error) => {
        Sentry.captureException(error)
        analytics.track('chat_error', { error: error.message })
      }}
      resetKeys={[currentConversation.id]}
    >
      {/* Network status indicator */}
      <NetworkStatus
        position="top-right"
        showDetails={true}
        onStatusChange={(status) => {
          if (status === 'offline') {
            disconnect()
            toast.warning('You are offline. Messages will be sent when reconnected.')
          }
        }}
      />

      <div className="chat-container">
        {/* Token counter */}
        <TokenCounter
          currentTokens={tokens}
          maxTokens={8192}
          costPerToken={0.00003}
          showWarning={true}
          suggestPruning={suggestPruning}
          onPruneSuggested={() => {
            // Prune oldest messages
            const oldMessages = messages.slice(0, 5)
            oldMessages.forEach(msg => deleteMessage(msg.id))
            toast.success('Pruned 5 oldest messages')
          }}
        />

        {/* Undo button */}
        {canUndo && (
          <button onClick={undo} className="undo-button">
            ↶ Undo
          </button>
        )}

        {/* Messages */}
        <MessageList
          messages={messages}
          onEdit={handleEdit}
          onDelete={deleteMessage}
          onRegenerate={regenerateMessage}
          onBranch={branchConversation}
        />

        {/* Typing indicator */}
        {isTyping && currentStage && (
          <div className="typing-indicator">
            <span>{currentStage.label}</span>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${stageProgress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Stream cancellation */}
        <StreamCancellation
          isStreaming={status === 'streaming'}
          onCancel={disconnect}
          progressMessage={
            isReconnecting
              ? `Reconnecting (attempt ${reconnectAttempt})...`
              : 'Streaming response...'
          }
        />

        {/* Error display with retry */}
        {(apiError || streamError) && (
          <div className="error-message">
            <RetryButton
              onRetry={retry}
              errorType={errorType || 'unknown'}
              maxAttempts={3}
              disabled={!canRetry}
            />
          </div>
        )}

        {/* Chat input */}
        <ChatInput
          onSend={handleSend}
          disabled={
            isTyping ||
            status === 'streaming' ||
            isCritical ||
            isRetrying
          }
          placeholder={
            isCritical
              ? 'Context limit reached - please prune messages'
              : isNearLimit
              ? 'Approaching context limit...'
              : 'Type a message...'
          }
        />

        {/* Context warning */}
        {isNearLimit && !isCritical && (
          <div className="warning-banner">
            ⚠️ You're using {Math.round((tokens / 8192) * 100)}% of the context window.
            Older messages may be excluded soon.
          </div>
        )}

        {/* Cost display */}
        <div className="cost-display">
          Estimated cost: ${estimatedCost.toFixed(4)}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default ChatApplication
```

---

## Key Features Demonstrated

### 1. ✅ Error Handling
- **ErrorBoundary**: Catches all React errors
- **RetryButton**: User-friendly retry with exponential backoff
- **useErrorRecovery**: Automatic retry logic with configurable conditions

### 2. ✅ Token Management
- **TokenCounter**: Visual display with warnings
- **useTokenTracker**: Real-time tracking and cost estimation
- **Pruning suggestions**: Automatic when critical

### 3. ✅ Message Operations
- **Edit**: Edit user messages and regenerate responses
- **Regenerate**: Resend assistant messages with same context
- **Delete**: Remove unwanted messages
- **Branch**: Create alternative conversation paths
- **Undo**: Undo any operation

### 4. ✅ Streaming
- **SSE**: Server-Sent Events with auto-reconnection
- **Cancellation**: Stop streaming anytime
- **Reconnection**: Automatic with exponential backoff

### 5. ✅ Realistic Typing
- **Multi-stage indicators**: Reading → Thinking → Crafting
- **Adaptive timing**: Based on input length
- **Progress tracking**: Visual progress bar

### 6. ✅ Network Resilience
- **NetworkStatus**: Real-time connection monitoring
- **Auto-reconnect**: When connection restored
- **Offline handling**: Graceful degradation

---

## Analytics Integration

```tsx
// Track all important events
const analytics = {
  track: (event: string, properties?: object) => {
    // Send to your analytics service
    console.log('Analytics:', event, properties)
  },
}

// Example events to track:
// - message_sent
// - message_edited
// - message_deleted
// - message_regenerated
// - conversation_branched
// - token_warning
// - token_critical
// - message_retry
// - max_retries_reached
// - chat_error
// - network_offline
// - network_online
```

---

## Error Logging

```tsx
// Integrate with Sentry or similar
import * as Sentry from '@sentry/react'

// In ErrorBoundary
<ErrorBoundary
  onError={(error, errorInfo) => {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    })
  }}
>
  <ChatApplication />
</ErrorBoundary>
```

---

## Testing

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChatApplication } from './ChatApplication'

describe('ChatApplication', () => {
  it('should send message and display response', async () => {
    render(<ChatApplication />)
    
    const input = screen.getByPlaceholderText('Type a message...')
    const sendButton = screen.getByText('Send')
    
    fireEvent.change(input, { target: { value: 'Hello AI!' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText('Hello AI!')).toBeInTheDocument()
    })
  })

  it('should show error and retry button on failure', async () => {
    // Mock API failure
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    )
    
    render(<ChatApplication />)
    
    const input = screen.getByPlaceholderText('Type a message...')
    fireEvent.change(input, { target: { value: 'Test' } })
    fireEvent.click(screen.getByText('Send'))
    
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })
  })

  it('should show token warning when approaching limit', async () => {
    render(<ChatApplication />)
    
    // Send many messages to approach limit
    for (let i = 0; i < 50; i++) {
      // ... send messages
    }
    
    await waitFor(() => {
      expect(screen.getByText(/Approaching context limit/)).toBeInTheDocument()
    })
  })
})
```

---

## Performance Optimization

```tsx
// Memoize expensive components
const MessageList = React.memo(MessageListComponent)
const TokenCounter = React.memo(TokenCounterComponent)

// Virtualize long message lists
import { FixedSizeList } from 'react-window'

function VirtualizedMessageList({ messages }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={messages.length}
      itemSize={100}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <Message message={messages[index]} />
        </div>
      )}
    </FixedSizeList>
  )
}
```

---

## Mobile Optimization

```tsx
// Use mobile-specific hooks
import { useMobileKeyboard } from '@clarity-chat/react'

function MobileChatApp() {
  const {
    keyboardHeight,
    adjustLayout,
    isKeyboardVisible,
  } = useMobileKeyboard()

  return (
    <div
      className="chat-container"
      style={{
        paddingBottom: isKeyboardVisible ? keyboardHeight : 0,
      }}
    >
      {/* Chat content */}
    </div>
  )
}
```

---

## Deployment Checklist

- [ ] Set up error logging (Sentry)
- [ ] Configure analytics tracking
- [ ] Set environment variables (API keys)
- [ ] Enable HTTPS for production
- [ ] Configure CORS for API
- [ ] Set up rate limiting
- [ ] Enable Redis for session storage
- [ ] Configure CDN for static assets
- [ ] Set up monitoring (Datadog, New Relic)
- [ ] Run security audit
- [ ] Enable CSP headers
- [ ] Test on mobile devices
- [ ] Run accessibility audit
- [ ] Load test with k6 or Artillery
- [ ] Set up CI/CD pipeline

---

## Environment Variables

```bash
# .env.production
REACT_APP_API_URL=https://api.example.com
REACT_APP_WS_URL=wss://api.example.com
REACT_APP_SENTRY_DSN=https://xxx@sentry.io/xxx
REACT_APP_ANALYTICS_KEY=xxx
REACT_APP_MAX_TOKENS=8192
REACT_APP_MODEL_NAME=gpt-4
```

---

## Summary

This comprehensive example demonstrates:

1. **Error Resilience**: Graceful handling with retry logic
2. **Cost Transparency**: Real-time token tracking and warnings
3. **Natural UX**: Realistic typing delays prevent uncanny valley
4. **Network Resilience**: Auto-reconnection and offline handling
5. **Advanced Features**: Edit, regenerate, branch, undo
6. **Production Ready**: Analytics, logging, testing, deployment

**Result**: Enterprise-grade AI chat application that feels polished and reliable.
