# @clarity-chat/error-handling

> **React 19 Error Handling** - Comprehensive error handling with recovery hooks and boundaries

Comprehensive error handling system for React 19 applications with specialized error classes, recovery hooks, and error boundaries.

## ✨ Features

- 🚀 **React 19 Native** - Built specifically for React 19
- 🛡️ **Comprehensive Error Handling** - 10 specialized error types
- ♿ **Accessible** - WCAG 2.1 AA compliant
- 📦 **Tree-shakeable** - < 50KB gzipped
- 🧪 **Well Tested** - Comprehensive test suite
- 📘 **TypeScript** - Full type safety

## 📦 Installation

```bash
npm install @clarity-chat/error-handling
# or
pnpm add @clarity-chat/error-handling
# or
yarn add @clarity-chat/error-handling
```

## 🚀 Quick Start

> 📖 **New to Clarity?** Check the [Getting Started Guide](../../docs/getting-started.md) or browse the [Cookbook](../../docs/cookbook/) for copy-paste ready patterns.

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

## 📚 Documentation

- [Getting Started Guide](../../docs/getting-started.md)
- [Cookbook](../../docs/cookbook/) - Copy-paste ready patterns
- [Troubleshooting](../../docs/TROUBLESHOOTING.md) - Common issues and solutions
- [Error Handling Guide](./docs/ERROR_HANDLING.md) - Complete guide
- [API Reference](../../docs/api-reference.md) - Complete API documentation
- [Storybook](http://localhost:6006) - Interactive examples

## 🔗 Links

- [GitHub Repository](https://github.com/christireid/Clarity-ai-chat-components)
- [Documentation](../../apps/docs/)
- [Examples](../../examples/)

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md)

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
