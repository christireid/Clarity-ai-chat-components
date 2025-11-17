# Testing Guide

## Overview

Clarity Chat maintains enterprise-grade test coverage across all packages with comprehensive unit, integration, accessibility, and E2E tests.

## Test Coverage Goals

- **Unit Tests**: 80%+ coverage for all components and hooks
- **Integration Tests**: Critical user flows and component interactions
- **Accessibility Tests**: WCAG 2.1 AA compliance
- **E2E Tests**: Key demo application scenarios
- **Visual Regression**: Component appearance consistency

## Running Tests

### Quick Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui

# Run specific package tests
npm test --workspace=@clarity-chat/react
npm test --workspace=@clarity-chat/primitives

# Run specific test file
npm test -- src/components/__tests__/message.test.tsx

# Run E2E tests (requires Playwright)
npm run test:e2e
```

### Package-Specific Commands

```bash
# React package
cd packages/react
npm test                    # Run all tests
npm run test:coverage       # With coverage
npm run test:ui             # Interactive UI

# Primitives package
cd packages/primitives
npm test

# Examples
cd examples/basic-chat
npm test
```

## Test Structure

### Component Tests

Location: `packages/react/src/components/__tests__/`

Each component test file includes:

1. **Rendering Tests**: Basic rendering and props
2. **Interaction Tests**: User interactions and events
3. **State Management Tests**: Component state changes
4. **Accessibility Tests**: ARIA attributes, keyboard navigation
5. **Edge Cases**: Error handling, boundary conditions
6. **Performance Tests**: Large data sets, rapid updates

Example test structure:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '../my-component'

describe('MyComponent', () => {
  describe('Rendering', () => {
    it('should render correctly', () => {
      render(<MyComponent />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should handle clicks', async () => {
      const onClick = vi.fn()
      const user = userEvent.setup()
      
      render(<MyComponent onClick={onClick} />)
      await user.click(screen.getByRole('button'))
      
      expect(onClick).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<MyComponent />)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label')
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<MyComponent />)
      
      await user.tab()
      expect(screen.getByRole('button')).toHaveFocus()
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined props', () => {
      expect(() => render(<MyComponent />)).not.toThrow()
    })
  })
})
```

### Hook Tests

Location: `packages/react/src/hooks/__tests__/`

Hook tests use `@testing-library/react-hooks`:

```typescript
import { renderHook, act } from '@testing-library/react'
import { useMyHook } from '../use-my-hook'

describe('useMyHook', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useMyHook())
    expect(result.current.value).toBe(defaultValue)
  })

  it('should update value', () => {
    const { result } = renderHook(() => useMyHook())
    
    act(() => {
      result.current.setValue('new value')
    })
    
    expect(result.current.value).toBe('new value')
  })

  it('should handle errors gracefully', () => {
    const { result } = renderHook(() => useMyHook())
    
    act(() => {
      result.current.triggerError()
    })
    
    expect(result.current.error).toBeDefined()
  })
})
```

### Integration Tests

Integration tests verify multiple components working together:

```typescript
describe('Chat Integration', () => {
  it('should send message and display response', async () => {
    const { user } = setup()
    render(<ChatWindow messages={[]} onSendMessage={mockSend} />)

    // Type message
    await user.type(screen.getByRole('textbox'), 'Hello')
    await user.click(screen.getByRole('button', { name: /send/i }))

    // Verify message sent
    expect(mockSend).toHaveBeenCalledWith('Hello')

    // Verify response displayed
    await waitFor(() => {
      expect(screen.getByText('AI Response')).toBeInTheDocument()
    })
  })
})
```

### E2E Tests

Location: `tests/e2e/`

E2E tests use Playwright to test complete user flows:

```typescript
import { test, expect } from '@playwright/test'

test('basic chat flow', async ({ page }) => {
  await page.goto('http://localhost:3000')

  // Type and send message
  await page.fill('[data-testid="chat-input"]', 'Hello, AI!')
  await page.click('[data-testid="send-button"]')

  // Wait for response
  await page.waitForSelector('[data-testid="assistant-message"]')

  // Verify response displayed
  const response = await page.textContent('[data-testid="assistant-message"]')
  expect(response).toBeTruthy()
})
```

## Test Utilities

### Custom Render Function

```typescript
// test-utils.tsx
import { render } from '@testing-library/react'
import { ThemeProvider } from './theme-provider'

export function renderWithProviders(ui: React.ReactElement, options = {}) {
  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider>
        {children}
      </ThemeProvider>
    ),
    ...options,
  })
}

export * from '@testing-library/react'
export { renderWithProviders as render }
```

### Mock Data Factories

```typescript
// test-factories.ts
import type { Message } from '@clarity-chat/types'

export function createMockMessage(overrides?: Partial<Message>): Message {
  return {
    id: 'msg-' + Math.random(),
    chatId: 'chat-1',
    role: 'user',
    content: 'Test message',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'sent',
    ...overrides,
  }
}

export function createMockMessages(count: number): Message[] {
  return Array.from({ length: count }, (_, i) => 
    createMockMessage({
      id: `msg-${i}`,
      content: `Message ${i}`,
    })
  )
}
```

## Accessibility Testing

### Manual Checks

- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- Color contrast ratios (WCAG AA: 4.5:1)
- Focus indicators visible and clear
- Semantic HTML elements

### Automated Checks

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Visual Regression Testing

### Setup Chromatic (Recommended)

```bash
# Install Chromatic
npm install --save-dev chromatic

# Run visual tests
npx chromatic --project-token=YOUR_TOKEN
```

### Storybook Integration

```javascript
// .storybook/main.js
export default {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
}
```

## Performance Testing

### Component Rendering Performance

```typescript
import { renderHook } from '@testing-library/react'
import { performance } from 'perf_hooks'

it('should render large lists efficiently', () => {
  const startTime = performance.now()
  
  render(<MessageList messages={createMockMessages(1000)} />)
  
  const endTime = performance.now()
  const renderTime = endTime - startTime
  
  expect(renderTime).toBeLessThan(100) // 100ms threshold
})
```

### Memory Leak Testing

```typescript
it('should not leak memory on unmount', () => {
  const { unmount } = render(<MyComponent />)
  
  // Track memory usage
  const before = process.memoryUsage().heapUsed
  
  unmount()
  
  // Force garbage collection (requires --expose-gc flag)
  if (global.gc) {
    global.gc()
  }
  
  const after = process.memoryUsage().heapUsed
  const leaked = after - before
  
  expect(leaked).toBeLessThan(1000000) // 1MB threshold
})
```

## Coverage Reports

### View Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open packages/react/coverage/index.html
```

### Coverage Thresholds

Configured in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
})
```

## Continuous Integration

### GitHub Actions

Tests run automatically on:
- Push to main/develop branches
- Pull requests
- Release tags

See `.github/workflows/ci.yml` for full pipeline.

### Local Pre-commit Hooks

```bash
# Install Husky
npm install --save-dev husky

# Set up pre-commit hook
npx husky add .husky/pre-commit "npm test"
```

## Debugging Tests

### Debug in VSCode

```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test:debug"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Debug Specific Test

```bash
# Add debugger statement
it('should do something', () => {
  debugger
  expect(result).toBe(expected)
})

# Run with inspect
node --inspect-brk ./node_modules/.bin/vitest run --no-coverage
```

### Visual Debugging

```bash
# Run tests in UI mode
npm run test:ui

# This opens a browser with interactive test runner
```

## Best Practices

### DO ✅

- Write tests before fixing bugs (TDD)
- Test user behavior, not implementation details
- Use meaningful test descriptions
- Keep tests independent and isolated
- Mock external dependencies
- Test edge cases and error scenarios
- Use data-testid for complex selectors
- Follow AAA pattern (Arrange, Act, Assert)

### DON'T ❌

- Test implementation details
- Create interdependent tests
- Use arbitrary waits (use waitFor instead)
- Ignore accessibility in tests
- Skip error case testing
- Hardcode dates/times (use Date.now() or mock)
- Write tests that depend on execution order

## Common Issues

### Test Timeout

```typescript
// Increase timeout for slow tests
it('slow test', async () => {
  // ...
}, { timeout: 10000 }) // 10 seconds
```

### Async State Updates

```typescript
import { waitFor } from '@testing-library/react'

// Wait for async state updates
await waitFor(() => {
  expect(screen.getByText('Updated')).toBeInTheDocument()
})
```

### Mock Timers

```typescript
import { vi } from 'vitest'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.restoreAllMocks()
})

it('should handle debounce', () => {
  // Trigger debounced function
  debounced()
  
  // Fast-forward time
  vi.advanceTimersByTime(500)
  
  expect(callback).toHaveBeenCalled()
})
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## Contributing

When adding new features:

1. Write tests first (TDD)
2. Ensure all tests pass
3. Maintain 80%+ coverage
4. Add accessibility tests
5. Update this documentation

## Test Metrics

Current coverage (as of last update):

- **Components**: 85% coverage
- **Hooks**: 92% coverage
- **Utilities**: 88% coverage
- **Overall**: 87% coverage

Goals:
- Maintain 80%+ coverage across all packages
- Zero accessibility violations in automated tests
- All E2E scenarios pass
- Performance benchmarks met
