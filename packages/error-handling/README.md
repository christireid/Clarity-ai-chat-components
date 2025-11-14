# @clarity-chat/error-handling

Comprehensive error handling system for React 19 applications with specialized error classes, recovery hooks, and error boundaries.

## Features

- 🚀 **React 19 Native** - Built specifically for React 19
- 🛡️ **Comprehensive Error Handling** - 10 specialized error types
- ♿ **Accessible** - WCAG 2.1 AA compliant
- 📦 **Tree-shakeable** - < 50KB gzipped
- 🧪 **Well Tested** - Comprehensive test suite
- 📘 **TypeScript** - Full type safety

## Installation

```bash
npm install @clarity-chat/error-handling
```

## Quick Start

```tsx
import { ErrorBoundary } from '@clarity-chat/error-handling'

function App() {
  return (
    <ErrorBoundary>
      <YourChatComponent />
    </ErrorBoundary>
  )
}
```

## Error Handling

```tsx
import { 
  useErrorHandler, 
  useAsyncError,
  createConfigError 
} from '@clarity-chat/error-handling'

function ChatComponent() {
  const { handleError } = useErrorHandler({ logErrors: true })
  const { executeAsync, isLoading, retryCount } = useAsyncError()

  const sendMessage = async (message: string) => {
    const result = await executeAsync(
      async () => {
        const res = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message })
        })
        
        if (!res.ok) {
          throw createConfigError.missingApiEndpoint()
        }
        
        return res.json()
      },
      { 
        maxRetries: 3,
        retryDelay: 1000,
        onError: handleError 
      }
    )
    
    return result
  }

  return (
    <div>
      {isLoading && <p>Loading... (Attempt {retryCount})</p>}
      {/* Your UI */}
    </div>
  )
}
```

## Documentation

- [Error Handling Guide](./docs/ERROR_HANDLING.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)
- [API Reference](https://docs.claritychat.dev)
- [Storybook](https://storybook.claritychat.dev)

## Error Classes

### Available Error Types

- `ClarityChatError` - Base error class
- `ConfigurationError` - Invalid configuration
- `APIError` - API request failures
- `AuthenticationError` - Auth issues
- `RateLimitError` - Rate limiting
- `ValidationError` - Input validation
- `StreamError` - Streaming issues
- `TokenLimitError` - Token limits
- `NetworkError` - Network failures
- `TimeoutError` - Request timeouts
- `ComponentError` - Component errors

## Hooks

- `useErrorHandler` - Central error handling
- `useAsyncError` - Async with retry logic
- `useErrorBoundary` - Programmatic errors
- `useErrorRecovery` - Custom recovery
- `useErrorToast` - Toast notifications

## Components

- `ErrorBoundary` - Catch React errors

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build package
npm run build

# Start Storybook
npm run storybook
```

## License

MIT © Clarity Chat Contributors
