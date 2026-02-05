# Testing Quick Start Guide

> Get started testing Clarity Chat components in under 5 minutes

## Installation

```bash
npm install --save-dev vitest @testing-library/react @testing-library/user-event jest-axe
```

## Basic Unit Test

```typescript
import { render, screen } from '@testing-library/react'
import { ChatMessage } from '@clarity-chat/react'

test('renders message', () => {
  const message = { id: '1', role: 'user', content: 'Hello!' }
  render(<ChatMessage message={message} />)
  expect(screen.getByText('Hello!')).toBeInTheDocument()
})
```

## Test with User Interaction

```typescript
import userEvent from '@testing-library/user-event'
import { ChatInput } from '@clarity-chat/react'

test('sends message', async () => {
  const onSend = vi.fn()
  const user = userEvent.setup()

  render(<ChatInput onSend={onSend} />)

  await user.type(screen.getByRole('textbox'), 'Hello')
  await user.click(screen.getByRole('button', { name: /send/i }))

  expect(onSend).toHaveBeenCalledWith('Hello')
})
```

## Accessibility Test

```typescript
import { axe } from 'jest-axe'

test('has no a11y violations', async () => {
  const { container } = render(<ChatInput onSend={vi.fn()} />)
  expect(await axe(container)).toHaveNoViolations()
})
```

## Mock API Calls

```typescript
test('fetches AI response', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ content: 'AI says hello!' })
  })

  render(<ClarityChatApp api="/api/chat" />)

  // ... test interaction
})
```

## Use Test Utilities

```typescript
import { createMockMessage, mockChatAPISuccess } from './test-utils'

test('displays messages', () => {
  const messages = [
    createMockMessage({ content: 'Hello' }),
    createMockMessage({ content: 'Hi there!' })
  ]

  render(<MessageList messages={messages} />)

  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

## Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# With coverage
npm test -- --coverage
```

## Common Patterns

### Wait for async updates
```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

### Query by role (best practice)
```typescript
screen.getByRole('button', { name: /send/i })
screen.getByRole('textbox')
screen.getByRole('heading', { level: 1 })
```

### Test keyboard navigation
```typescript
await user.tab()
expect(screen.getByRole('button')).toHaveFocus()

await user.keyboard('{Enter}')
```

### Mock file upload
```typescript
const file = new File(['content'], 'test.txt', { type: 'text/plain' })
const input = screen.getByLabelText(/upload/i)
await user.upload(input, file)
```

## Next Steps

1. Visit `/testing` for complete examples
2. Copy configuration from `vitest.config.example.ts`
3. Use test utilities from `test-utils.ts`
4. Follow best practices in README.md
5. Aim for 85%+ coverage

## Resources

- [Full Documentation](./README.md)
- [Test Utilities](./test-utils.ts)
- [All Examples](/testing)
- [Testing Library Docs](https://testing-library.com)
- [Vitest Docs](https://vitest.dev)
