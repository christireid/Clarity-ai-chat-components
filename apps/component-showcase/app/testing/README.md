# Testing Utilities - Clarity Chat Components

> Comprehensive testing examples, utilities, and best practices for testing Clarity Chat components.

## Overview

This testing suite provides everything you need to test Clarity Chat components across multiple testing strategies:

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions and flows
- **Accessibility Tests**: Ensure WCAG compliance
- **E2E Tests**: Validate complete user workflows
- **Mock Factories**: Generate realistic test data
- **Test Utilities**: Helper functions for common test scenarios

## Quick Start

### Installation

```bash
npm install --save-dev vitest @testing-library/react @testing-library/user-event jest-axe
```

### Basic Unit Test

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChatMessage } from '@clarity-chat/react'

describe('ChatMessage', () => {
  it('renders message content', () => {
    const message = {
      id: '1',
      role: 'user',
      content: 'Hello!',
    }

    render(<ChatMessage message={message} />)
    expect(screen.getByText('Hello!')).toBeInTheDocument()
  })
})
```

## Test Categories

### 1. Unit Tests

Test individual components in isolation. Focus on:

- Component rendering
- Props handling
- Event handlers
- State management
- Edge cases

**Example:**

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatInput } from '@clarity-chat/react'

describe('ChatInput', () => {
  it('calls onSend when message submitted', () => {
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} />)

    const input = screen.getByPlaceholderText(/type a message/i)
    fireEvent.change(input, { target: { value: 'Test' } })
    fireEvent.submit(input.closest('form'))

    expect(onSend).toHaveBeenCalledWith('Test')
  })
})
```

### 2. Integration Tests

Test how components work together. Focus on:

- Component interactions
- Data flow
- State synchronization
- User workflows

**Example:**

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClarityChatApp } from '@clarity-chat/react'

describe('Chat Flow', () => {
  it('sends and receives messages', async () => {
    const user = userEvent.setup()

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: 'AI Response' }),
    })

    render(<ClarityChatApp api="/api/chat" />)

    await user.type(screen.getByPlaceholderText(/type a message/i), 'Hello')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(screen.getByText('AI Response')).toBeInTheDocument()
    })
  })
})
```

### 3. Accessibility Tests

Ensure WCAG compliance. Focus on:

- Keyboard navigation
- Screen reader support
- ARIA attributes
- Color contrast
- Focus management

**Example:**

```typescript
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ChatInput } from '@clarity-chat/react'

expect.extend(toHaveNoViolations)

describe('ChatInput Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ChatInput onSend={vi.fn()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('supports keyboard navigation', async () => {
    render(<ChatInput onSend={vi.fn()} />)

    await userEvent.tab()
    expect(screen.getByRole('textbox')).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByRole('button', { name: /send/i })).toHaveFocus()
  })
})
```

### 4. E2E Tests

Test complete user workflows. Focus on:

- Real user interactions
- Multi-step flows
- Network requests
- Error handling

**Example (Playwright):**

```typescript
import { test, expect } from '@playwright/test'

test('chat conversation flow', async ({ page }) => {
  await page.goto('http://localhost:3000/chat')

  await page.getByPlaceholder(/type a message/i).fill('What is React?')
  await page.getByRole('button', { name: /send/i }).click()

  await expect(page.getByText('What is React?')).toBeVisible()
  await expect(page.getByText(/React is/i)).toBeVisible({ timeout: 10000 })
})
```

## Mock Factories

### Using Mock Factories

```typescript
import {
  createMockMessage,
  createMockMessages,
  createMockConversation,
  createMockUser,
} from './test-utils'

// Single message
const message = createMockMessage({
  role: 'user',
  content: 'Custom content',
})

// Multiple messages
const messages = createMockMessages(5)

// Conversation with messages
const conversation = createMockConversation({
  title: 'Test Conversation',
})

// User
const user = createMockUser({
  name: 'John Doe',
})
```

### Streaming Mocks

```typescript
import { createStreamingMessage, createMockStreamingResponse } from './test-utils'

// Generate streaming chunks
const chunks = Array.from(createStreamingMessage('Hello, World!', 3))
// ['Hel', 'lo,', ' Wo', 'rld', '!']

// Mock streaming API response
const response = createMockStreamingResponse(chunks)
```

## Test Utilities

### API Mocking

```typescript
import { mockChatAPISuccess, mockChatAPIError } from './test-utils'

// Mock successful response
mockChatAPISuccess('AI response text')

// Mock error response
mockChatAPIError(500)
```

### File Upload Testing

```typescript
import { createMockFile, createMockFileList } from './test-utils'

const file = createMockFile('test.txt', 'test content')
const fileList = createMockFileList([file])

const input = screen.getByLabelText(/upload/i)
await userEvent.upload(input, fileList)
```

### Accessibility Helpers

```typescript
import { hasAriaLabel, isKeyboardNavigable, getFocusableElements } from './test-utils'

const button = screen.getByRole('button')

// Check ARIA labels
expect(hasAriaLabel(button)).toBe(true)

// Check keyboard navigation
expect(isKeyboardNavigable(button)).toBe(true)

// Get all focusable elements
const focusable = getFocusableElements(container)
```

## Best Practices

### 1. Test User Behavior, Not Implementation

```typescript
// ✅ Good: Test what users see
expect(screen.getByText('Hello')).toBeInTheDocument()

// ❌ Bad: Test implementation details
expect(component.state.messages[0].content).toBe('Hello')
```

### 2. Use Semantic Queries

```typescript
// ✅ Good: Semantic queries
screen.getByRole('button', { name: /send/i })
screen.getByLabelText(/message input/i)

// ❌ Bad: Test IDs
screen.getByTestId('send-button')
```

### 3. Mock External Dependencies

```typescript
// ✅ Good: Mock fetch
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ content: 'Response' }),
})

// ❌ Bad: Make real API calls in tests
```

### 4. Test Error States

```typescript
// ✅ Good: Test error handling
it('handles API errors', async () => {
  mockChatAPIError(500)
  render(<ChatApp api="/api/chat" />)

  await user.click(screen.getByRole('button', { name: /send/i }))

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument()
  })
})
```

### 5. Keep Tests Fast

```typescript
// ✅ Good: Use mocks, avoid unnecessary delays
mockChatAPISuccess('Fast response')

// ❌ Bad: Use real timers
await new Promise((resolve) => setTimeout(resolve, 5000))
```

## Coverage Targets

| Test Type       | Target | Current |
| --------------- | ------ | ------- |
| Unit Tests      | 85%    | 87%     |
| Integration     | 75%    | 72%     |
| Accessibility   | 100%   | 100%    |
| E2E (Flows)     | All    | 8/10    |

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test ChatMessage.test.tsx

# Run E2E tests
npm run test:e2e
```

## Test Configuration

### Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/'],
    },
  },
})
```

### Setup File

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from 'jest-axe'

expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/)
- [jest-axe](https://github.com/nickcolley/jest-axe)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Examples

See the testing page at `/testing` for interactive examples and code snippets for:

- Unit tests for each component
- Integration test patterns
- Accessibility test examples
- E2E test scenarios
- Mock data generators
- Test utility usage

## Contributing

When adding new components, please include:

1. Unit tests for all props and functionality
2. Integration tests for component interactions
3. Accessibility tests with axe
4. Example E2E test for critical flows
5. Mock factories for new data types

Aim for 85%+ code coverage on new components.
