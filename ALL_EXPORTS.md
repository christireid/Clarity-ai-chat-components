# Complete Export Reference - All Available Imports

## 📦 @clarity-chat/react - Chat Components (34 Components)

### Core Chat Components
```typescript
import {
  ChatWindow,          // Full-featured chat interface
  MessageList,         // Virtualized message rendering
  Message,             // Rich message display with markdown
  ChatInput,           // Basic message composition
  AdvancedChatInput,   // Advanced input with file upload
  ThinkingIndicator,   // AI processing states
  CopyButton,          // Copy message content
} from '@clarity-chat/react'
```

### Context & Knowledge Management
```typescript
import {
  ContextManager,        // Document/image/link context
  ContextCard,           // Context item display
  ContextVisualizer,     // Show what AI "sees"
  KnowledgeBaseViewer,   // Auto-generated knowledge base
  LinkPreview,           // URL preview cards
} from '@clarity-chat/react'
```

### Project & Organization
```typescript
import {
  ProjectSidebar,      // Conversation organization
  ConversationList,    // Search and filter conversations
  PromptLibrary,       // Template management
  SettingsPanel,       // User preferences
  UsageDashboard,      // Credit and usage tracking
} from '@clarity-chat/react'
```

### Advanced Features
```typescript
import {
  StreamCancellation,  // Cancel streaming responses
  RetryButton,         // Smart retry with backoff
  ErrorBoundary,       // Error recovery UI
  NetworkStatus,       // Connection monitoring
  TokenCounter,        // Real-time token tracking
  ExportDialog,        // Export to PDF, DOCX, Markdown
  FileUpload,          // Drag & drop file handling
} from '@clarity-chat/react'
```

## 🪝 @clarity-chat/react - Hooks (25+ Hooks)

### Chat Core Hooks
```typescript
import {
  useChat,                // Main chat state management
  useStreaming,           // Real-time streaming support
  useStreamingSSE,        // Server-Sent Events streaming
  useStreamingWebSocket,  // WebSocket streaming
} from '@clarity-chat/react'
```

### Message Operations Hooks
```typescript
import {
  useMessageOperations,   // Edit, regenerate, branch, undo/redo
  useRealisticTyping,     // Adaptive typing indicators
  useAutoScroll,          // Smart auto-scrolling
  useClipboard,           // Copy to clipboard
} from '@clarity-chat/react'
```

### Infrastructure Hooks
```typescript
import {
  useErrorRecovery,       // Automatic retry with exponential backoff
  useTokenTracker,        // Token counting and cost estimation
  useKeyboardShortcuts,   // Keyboard navigation
  useLocalStorage,        // Persistent state
} from '@clarity-chat/react'
```

### Utility Hooks
```typescript
import {
  useDebounce,              // Debounce values
  useThrottle,              // Throttle callbacks
  useMediaQuery,            // Responsive design
  useMounted,               // Component lifecycle
  useToggle,                // Boolean state management
  useIntersectionObserver,  // Visibility detection
  useEventListener,         // Event handling
  useWindowSize,            // Viewport dimensions
  usePrevious,              // Previous value tracking
} from '@clarity-chat/react'
```

## 🛡️ @clarity-chat/error-handling - Error Classes (10 Classes)

### Base Error Class
```typescript
import { ClarityChatError } from '@clarity-chat/error-handling'

// Base class with:
// - code: string
// - solution?: string
// - docs?: string
// - context?: Record<string, any>
// - toString(): string (formats with emojis)
```

### Specialized Error Classes
```typescript
import {
  ConfigurationError,    // Missing/invalid configuration
  APIError,              // API call failures (has statusCode)
  AuthenticationError,   // Auth failures
  RateLimitError,        // Rate limit exceeded
  ValidationError,       // Input validation failures
  StreamError,           // Streaming connection issues
  TokenLimitError,       // Token/context window exceeded
  NetworkError,          // Network connectivity issues
  TimeoutError,          // Request timeouts
  ComponentError,        // Component-specific errors
} from '@clarity-chat/error-handling'
```

## 🏭 @clarity-chat/error-handling - Error Factories (24+ Functions)

### Configuration Error Factory
```typescript
import { createConfigError } from '@clarity-chat/error-handling'

createConfigError.missingApiEndpoint()
createConfigError.invalidModel(model: string, validModels: string[])
createConfigError.missingAuthToken()
createConfigError.invalidConfiguration(field: string, value: any)
```

### API Error Factory
```typescript
import { createApiError } from '@clarity-chat/error-handling'

createApiError.badRequest(message: string)
createApiError.unauthorized()
createApiError.serverError(statusCode: number)
createApiError.modelOverloaded(model: string)
```

### Authentication Error Factory
```typescript
import { createAuthError } from '@clarity-chat/error-handling'

createAuthError.invalidToken()
createAuthError.expiredToken()
createAuthError.insufficientPermissions(required: string[])
```

### Network Error Factory
```typescript
import { createNetworkError } from '@clarity-chat/error-handling'

createNetworkError.noConnection()
createNetworkError.timeout(endpoint: string, duration: number)
createNetworkError.dns(hostname: string)
createNetworkError.ssl(message: string)
```

### Validation Error Factory
```typescript
import { createValidationError } from '@clarity-chat/error-handling'

createValidationError.emptyMessage()
createValidationError.messageTooLong(length: number, maxLength: number)
createValidationError.invalidFileType(fileType: string, allowedTypes: string[])
createValidationError.fileTooLarge(size: number, maxSize: number)
```

### Stream Error Factory
```typescript
import { createStreamError } from '@clarity-chat/error-handling'

createStreamError.connectionFailed(endpoint: string)
createStreamError.connectionLost()
createStreamError.parseError(chunk: string)
createStreamError.streamTimeout(duration: number)
```

## 🪝 @clarity-chat/error-handling - Hooks (5 Hooks)

### useErrorHandler
```typescript
import { useErrorHandler } from '@clarity-chat/error-handling'

const { handleError } = useErrorHandler({
  logErrors?: boolean,        // Log to console (default: dev mode)
  showToast?: boolean,        // Show toast notification
  onError?: (error: Error) => void  // Custom error callback
})

// Usage:
try {
  await someAsyncOperation()
} catch (error) {
  handleError(error)
}
```

### useAsyncError
```typescript
import { useAsyncError } from '@clarity-chat/error-handling'

const { 
  error,          // Current error or null
  isLoading,      // Loading state
  retryCount,     // Number of retry attempts
  executeAsync,   // Execute function with retry
  reset           // Reset error state
} = useAsyncError()

// Usage:
await executeAsync(
  async () => {
    // Your async operation
    return await fetch('/api/endpoint')
  },
  {
    maxRetries: 3,                        // Number of retry attempts
    retryDelay: 1000,                     // Base delay in ms (exponential backoff)
    onError: (error) => console.error(error),
    onSuccess: () => console.log('Success!')
  }
)
```

### useErrorBoundary
```typescript
import { useErrorBoundary } from '@clarity-chat/error-handling'

const { 
  throwError,    // Throw error to nearest ErrorBoundary
  resetError     // Reset nearest ErrorBoundary
} = useErrorBoundary()

// Usage:
const handleClick = () => {
  if (someCondition) {
    throwError(new ConfigurationError('Invalid config'))
  }
}
```

### useErrorRecovery
```typescript
import { useErrorRecovery } from '@clarity-chat/error-handling'

const { 
  error,                   // Current error or null
  isRecovering,            // Recovery in progress
  retryCount,              // Number of retry attempts
  handleError,             // Handle error with auto-retry
  retry,                   // Manual retry
  registerRecoveryStrategy // Register custom recovery
} = useErrorRecovery({
  maxRetries: 3,
  retryDelay: 1000,
  shouldRetry: (error) => error instanceof NetworkError
})

// Usage:
try {
  await apiCall()
} catch (error) {
  await handleError(error)
}
```

### useErrorToast
```typescript
import { useErrorToast } from '@clarity-chat/error-handling'

const { 
  toasts,      // Array of toast notifications
  showToast,   // Show a toast
  dismissToast // Dismiss a toast
} = useErrorToast({
  position: 'top-right',    // Toast position
  duration: 5000            // Auto-dismiss duration
})

// Usage:
showToast({
  message: 'Operation failed',
  type: 'error',
  action: { label: 'Retry', onClick: () => retry() }
})
```

## 🧩 @clarity-chat/error-handling - Components

### ErrorBoundary
```typescript
import { ErrorBoundary } from '@clarity-chat/error-handling'

<ErrorBoundary
  fallback={({ error, resetError }) => (
    <div>
      <h2>Error: {error.message}</h2>
      <button onClick={resetError}>Try Again</button>
    </div>
  )}
  onError={(error, errorInfo) => {
    // Log to error service
    console.error(error, errorInfo)
  }}
  onReset={() => {
    // Cleanup before reset
  }}
  resetKeys={[userId, conversationId]}  // Auto-reset on prop change
>
  <YourComponent />
</ErrorBoundary>
```

## 🎨 @clarity-chat/primitives - UI Components

### Basic Components
```typescript
import {
  Button,        // Button with variants
  Avatar,        // User avatar
  Badge,         // Status badge
  Input,         // Text input
  Textarea,      // Multi-line input
  Card,          // Container card
  Tooltip,       // Hover tooltip
  DropdownMenu,  // Dropdown menu
  Dialog,        // Modal dialog
  ScrollArea,    // Custom scrollbar
} from '@clarity-chat/primitives'
```

## 📘 @clarity-chat/types - Type Definitions

### Message Types
```typescript
import type {
  Message,              // Chat message
  MessageRole,          // 'user' | 'assistant' | 'system'
  MessageContent,       // Message content structure
  MessageMetadata,      // Message metadata
} from '@clarity-chat/types'
```

### User Types
```typescript
import type {
  User,                 // User profile
  UserPreferences,      // User settings
} from '@clarity-chat/types'
```

### Chat Types
```typescript
import type {
  Chat,                 // Chat conversation
  ChatSettings,         // Chat configuration
  ChatStatus,           // Chat state
} from '@clarity-chat/types'
```

### Context Types
```typescript
import type {
  Context,              // Context item
  ContextType,          // Context type enum
  ContextMetadata,      // Context metadata
} from '@clarity-chat/types'
```

### AI Status Types
```typescript
import type {
  AIStatus,             // AI processing status
  ThinkingStage,        // Thinking indicator stage
} from '@clarity-chat/types'
```

## 📖 Usage Examples

### Complete Chat Application with Error Handling
```typescript
import React from 'react'
import { 
  ChatWindow, 
  useChat, 
  useStreaming, 
  useTokenTracker 
} from '@clarity-chat/react'
import { 
  ErrorBoundary, 
  useAsyncError, 
  useErrorHandler,
  createApiError,
  createNetworkError 
} from '@clarity-chat/error-handling'

function ChatApp() {
  const { messages, sendMessage, isLoading } = useChat()
  const { stream } = useStreaming()
  const { tokenCount, estimateCost } = useTokenTracker()
  const { executeAsync, retryCount } = useAsyncError()
  const { handleError } = useErrorHandler({ logErrors: true })

  const handleSend = async (content: string) => {
    try {
      await executeAsync(
        async () => {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: content, tokenLimit: 4000 })
          })

          if (!response.ok) {
            if (response.status === 429) {
              throw createApiError.rateLimitExceeded()
            }
            throw createApiError.serverError(response.status)
          }

          if (!response.body) {
            throw createNetworkError.noConnection()
          }

          return await stream(response)
        },
        {
          maxRetries: 3,
          retryDelay: 1000,
          onError: handleError
        }
      )
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{error.message}</p>
          {error instanceof ClarityChatError && error.solution && (
            <p><strong>Solution:</strong> {error.solution}</p>
          )}
          <button onClick={resetError}>Try Again</button>
        </div>
      )}
    >
      <div className="chat-container">
        <div className="chat-header">
          <h1>AI Chat</h1>
          <div className="token-info">
            Tokens: {tokenCount} | Cost: ${estimateCost().toFixed(4)}
          </div>
          {retryCount > 0 && (
            <div className="retry-indicator">
              Retrying... (Attempt {retryCount})
            </div>
          )}
        </div>
        
        <ChatWindow
          messages={messages}
          onSendMessage={handleSend}
          isLoading={isLoading}
        />
      </div>
    </ErrorBoundary>
  )
}

export default ChatApp
```

---

## 📚 Documentation Links

- **Chat Components:** See `packages/react/README.md`
- **Error Handling:** See `packages/error-handling/docs/ERROR_HANDLING.md`
- **Troubleshooting:** See `packages/error-handling/docs/TROUBLESHOOTING.md`
- **Complete Overview:** See `COMPLETE_PROJECT_OVERVIEW.md`
- **Contributing:** See `CONTRIBUTING.md`

---

**Total Exports:**
- **34 Chat Components**
- **25+ React Hooks**
- **10 Error Classes**
- **24+ Factory Functions**
- **5 Error Handling Hooks**
- **10+ UI Primitives**
- **50+ TypeScript Types**

**= 150+ Total Exports**
