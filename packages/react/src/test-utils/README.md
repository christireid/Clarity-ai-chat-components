# Testing Utilities for useClarityChat

Utilities and helpers for testing components that use `useClarityChat`.

## Installation

```bash
npm install --save-dev @clarity-chat/react
```

## Basic Usage

### Mock useClarityChat

```tsx
import { renderHook } from '@testing-library/react'
import { createMockUseClarityChat } from '@clarity-chat/react/test-utils'

test('should render chat', () => {
  const mockChat = createMockUseClarityChat({
    messages: [
      { id: '1', role: 'user', content: 'Hello' },
      { id: '2', role: 'assistant', content: 'Hi there!' },
    ],
    isLoading: false,
  })

  // Use mockChat in your tests
})
```

### Create Test Messages

```tsx
import { 
  createTestMessages, 
  createTestUserMessage,
  createTestAssistantMessage 
} from '@clarity-chat/react/test-utils'

const messages = createTestMessages()
const userMsg = createTestUserMessage('Hello')
const assistantMsg = createTestAssistantMessage('Hi!')
```

### Mock API Responses

```tsx
import { 
  createMockFetch, 
  createMockStreamingResponse 
} from '@clarity-chat/react/test-utils'

const mockFetch = createMockFetch({
  '/api/chat': createMockStreamingResponse('Hello, world!'),
})

// Use mockFetch in your tests
global.fetch = mockFetch
```

### Simulate Streaming

```tsx
import { simulateStreamingResponse } from '@clarity-chat/react/test-utils'

const content = await simulateStreamingResponse(
  ['Hello', ', ', 'world', '!'],
  (chunk) => {
    console.log('Received chunk:', chunk)
  }
)
```

### Assert Chat State

```tsx
import { assertChatState } from '@clarity-chat/react/test-utils'

assertChatState(chat, {
  messageCount: 2,
  isLoading: false,
  hasError: false,
  memoryEnabled: true,
})
```

## Example Test

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import { useClarityChat } from '@clarity-chat/react'
import { 
  createMockUseClarityChat,
  createTestMessages,
  assertChatState 
} from '@clarity-chat/react/test-utils'

// Mock the hook
jest.mock('@clarity-chat/react', () => ({
  ...jest.requireActual('@clarity-chat/react'),
  useClarityChat: jest.fn(),
}))

test('renders chat messages', async () => {
  const mockChat = createMockUseClarityChat({
    messages: createTestMessages(),
  })

  ;(useClarityChat as jest.Mock).mockReturnValue(mockChat)

  render(<ChatComponent />)

  expect(screen.getByText('Hello, how are you?')).toBeInTheDocument()
  expect(screen.getByText('I am doing well')).toBeInTheDocument()
})
```

## Available Utilities

- `createMockUseClarityChat()` - Create mock hook return value
- `createTestMessages()` - Create test message array
- `createTestUserMessage()` - Create test user message
- `createTestAssistantMessage()` - Create test assistant message
- `waitForChatUpdate()` - Wait for async operations
- `simulateStreamingResponse()` - Simulate streaming chunks
- `createMockFetch()` - Mock fetch API
- `createMockStreamingResponse()` - Create SSE streaming response
- `assertMessageStructure()` - Assert message structure
- `assertChatState()` - Assert chat state

## See Also

- [useClarityChat Documentation](../hooks/USE_CLARITY_CHAT.md)
- [Examples](../examples/) - Complete working examples
