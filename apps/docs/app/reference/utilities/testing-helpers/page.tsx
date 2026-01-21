import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Testing Helpers',
  description: 'Comprehensive testing toolkit for Clarity Chat components.',
}

export default function Page() {
  return (
    <div className="docs-content">
      <div className="docs-section">
        <h1>Testing Helpers</h1>
        <p className="lead">
          Comprehensive testing toolkit for Clarity Chat components with mocks,
          utilities, and helpers for unit, integration, and E2E testing.
        </p>
      </div>

      <div className="docs-section">
        <h2>🎭 Mock APIs</h2>
        <p>Mock implementations for testing API interactions.</p>

        <h3>Mock Chat API Responses</h3>
        <div className="code-block">
          <pre><code>{`import { mockChatAPI } from '@clarity-chat/react'

describe('Chat Component', () => {
  it('handles successful response', () => {
    const response = mockChatAPI.success('Hello from AI')
    expect(response).toEqual({
      id: 'msg-123',
      content: 'Hello from AI',
      role: 'assistant',
      timestamp: expect.any(Number)
    })
  })

  it('handles streaming response', () => {
    const response = mockChatAPI.streaming(['Hello', ' world', '!'])
    expect(response.content).toEqual(['Hello', ' world', '!'])
    expect(response.isStreaming).toBe(true)
  })

  it('handles errors', () => {
    const error = mockChatAPI.error('API Error')
    expect(error.success).toBe(false)
    expect(error.error.message).toBe('API Error')
  })
})`}</code></pre>
        </div>

        <h3>Mock WebSocket</h3>
        <div className="code-block">
          <pre><code>{`import { MockWebSocket } from '@clarity-chat/react'

describe('Streaming Chat', () => {
  it('handles WebSocket messages', () => {
    const ws = new MockWebSocket('ws://test.com')

    const onMessage = vi.fn()
    ws.onmessage = onMessage

    // Simulate incoming message
    ws.simulateMessage({ content: 'Hello', role: 'assistant' })

    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        data: JSON.stringify({ content: 'Hello', role: 'assistant' })
      })
    )
  })
})`}</code></pre>
        </div>

        <h3>Mock Fetch</h3>
        <div className="code-block">
          <pre><code>{`import { createMockFetch, mockChatAPI } from '@clarity-chat/react'

describe('API Calls', () => {
  it('fetches chat response', async () => {
    const mockFetch = createMockFetch({
      '/api/chat': mockChatAPI.success('Mock response')
    })

    global.fetch = mockFetch

    const response = await fetch('/api/chat')
    const data = await response.json()

    expect(data.content).toBe('Mock response')
  })
})`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>📝 Test Data Factories</h2>
        <p>Create realistic test data easily.</p>

        <div className="code-block">
          <pre><code>{`import { createTestMessages, createMockChatState } from '@clarity-chat/react'

describe('Message Components', () => {
  it('renders user message', () => {
    const message = createTestMessages.user('Hello world')
    expect(message.role).toBe('user')
    expect(message.content).toBe('Hello world')
  })

  it('renders assistant message', () => {
    const message = createTestMessages.assistant('Hi there!')
    expect(message.role).toBe('assistant')
  })

  it('handles streaming messages', () => {
    const message = createTestMessages.streaming(['Hello', ' world'])
    expect(message.isStreaming).toBe(true)
    expect(message.content).toEqual(['Hello', ' world'])
  })
})

// Mock chat state for testing hooks
describe('Chat State', () => {
  it('manages messages', () => {
    const chatState = createMockChatState([
      createTestMessages.user('Hello')
    ])

    chatState.append(createTestMessages.assistant('Hi!'))

    expect(chatState.messages).toHaveLength(2)
  })
})`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔧 Component Testing</h2>
        <p>Test components with realistic configurations.</p>

        <h3>Test Configurations</h3>
        <div className="code-block">
          <pre><code>{`import { testConfigs, renderChatWithDefaults } from '@clarity-chat/react'

describe('ClarityChat Component', () => {
  it('renders basic chat', () => {
    const { props } = renderChatWithDefaults(testConfigs.basic)
    // Test with basic configuration
  })

  it('renders chat with messages', () => {
    const { props } = renderChatWithDefaults(testConfigs.withMessages)
    expect(props.messages).toHaveLength(2)
  })

  it('renders chat with error', () => {
    const { props } = renderChatWithDefaults(testConfigs.withError)
    expect(props.error).toBeInstanceOf(Error)
  })

  it('renders enterprise configuration', () => {
    const { props } = renderChatWithDefaults(testConfigs.enterprise)
    expect(props.memory.enabled).toBe(true)
    expect(props.header.show).toBe(true)
  })
})`}</code></pre>
        </div>

        <h3>Test Component Wrapper</h3>
        <div className="code-block">
          <pre><code>{`import { TestWrapper, createTestComponent } from '@clarity-chat/react'

describe('Custom Components', () => {
  const TestChat = createTestComponent(ChatWindow, {
    messages: [],
    onSendMessage: vi.fn()
  })

  it('renders with defaults', () => {
    render(<TestChat />)
    expect(screen.getByTestId('test-wrapper')).toBeInTheDocument()
  })

  it('overrides defaults', () => {
    render(<TestChat messages={[createTestMessages.user('Test')]} />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎣 Hook Testing</h2>
        <p>Test custom hooks with mock implementations.</p>

        <div className="code-block">
          <pre><code>{`import { createMockClarityChatHook } from '@clarity-chat/react'

describe('useClarityChat Hook', () => {
  it('handles message sending', () => {
    const { hook, state } = createMockClarityChatHook({
      messages: [createTestMessages.user('Hello')]
    })

    // Mock the hook
    hook.mockReturnValue(state)

    const { result } = renderHook(() => useClarityChat({ api: '/api/chat' }))

    act(() => {
      result.current.append({ role: 'user', content: 'New message' })
    })

    expect(state.append).toHaveBeenCalledWith({
      role: 'user',
      content: 'New message'
    })
  })
})`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>⚡ Async Testing</h2>
        <p>Utilities for testing asynchronous operations.</p>

        <div className="code-block">
          <pre><code>{`import { asyncTestUtils } from '@clarity-chat/react'

describe('Async Operations', () => {
  it('waits for next tick', async () => {
    let updated = false

    setTimeout(() => { updated = true }, 0)

    expect(updated).toBe(false)
    await asyncTestUtils.nextTick()
    expect(updated).toBe(true)
  })

  it('waits for condition', async () => {
    let count = 0
    setTimeout(() => { count = 5 }, 100)

    await asyncTestUtils.waitFor(() => count === 5, 200)
    expect(count).toBe(5)
  })

  it('waits for specific time', async () => {
    const start = Date.now()
    await asyncTestUtils.wait(50)
    const end = Date.now()

    expect(end - start).toBeGreaterThanOrEqual(45)
  })
})`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🖱️ DOM Testing</h2>
        <p>Simulate user interactions in tests.</p>

        <div className="code-block">
          <pre><code>{`import { domTestUtils } from '@clarity-chat/react'

describe('User Interactions', () => {
  it('handles button clicks', () => {
    const onClick = vi.fn()
    render(<button onClick={onClick}>Click me</button>)

    const button = screen.getByRole('button')
    domTestUtils.click(button)

    expect(onClick).toHaveBeenCalled()
  })

  it('handles text input', () => {
    render(<input type="text" />)
    const input = screen.getByRole('textbox')

    domTestUtils.type(input, 'Hello world')
    expect(input).toHaveValue('Hello world')
  })

  it('handles keyboard navigation', () => {
    render(<button>Focus me</button>)
    const button = screen.getByRole('button')

    domTestUtils.pressKey(button, 'Enter')
    expect(button).toHaveFocus()
  })
})`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>♿ Accessibility Testing</h2>
        <p>Test accessibility compliance.</p>

        <div className="code-block">
          <pre><code>{`import { a11yTestUtils } from '@clarity-chat/react'

describe('Accessibility', () => {
  it('has accessible elements', () => {
    render(<button aria-label="Close">×</button>)
    const button = screen.getByRole('button')

    expect(a11yTestUtils.hasAccessibleName(button)).toBe(true)
  })

  it('has keyboard accessible elements', () => {
    render(<button>Click me</button>)
    const button = screen.getByRole('button')

    expect(a11yTestUtils.isKeyboardAccessible(button)).toBe(true)
  })

  it('supports keyboard navigation', () => {
    render(
      <div>
        <button>First</button>
        <button>Second</button>
      </div>
    )

    a11yTestUtils.testKeyboardNavigation(document.body)
    // Tests that tab navigation works correctly
  })
})`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>📊 Performance Testing</h2>
        <p>Test component performance metrics.</p>

        <div className="code-block">
          <pre><code>{`import { performanceTestUtils } from '@clarity-chat/react'

describe('Performance', () => {
  it('measures render time', async () => {
    const renderTime = await performanceTestUtils.measureRenderTime(ChatWindow, {
      messages: [],
      onSendMessage: vi.fn()
    })

    expect(renderTime).toBeLessThan(100) // Should render in < 100ms
  })

  it('mocks performance API', () => {
    const restore = performanceTestUtils.mockPerformance()

    expect(performance.now()).toBeDefined()
    expect(performance.mark).toBeDefined()

    restore() // Restore original performance API
  })
})`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔗 End-to-End Testing</h2>
        <p>Complete application flow testing.</p>

        <div className="code-block">
          <pre><code>{`import { e2eTestUtils } from '@clarity-chat/react'

describe('E2E Flows', () => {
  beforeEach(() => {
    e2eTestUtils.setupTestEnvironment()
  })

  afterEach(() => {
    e2eTestUtils.teardownTestEnvironment()
  })

  it('completes chat flow', async () => {
    const responses = await e2eTestUtils.testChatFlow([
      'Hello',
      'How are you?',
      'Tell me a joke'
    ])

    expect(responses).toHaveLength(3)
    responses.forEach(response => {
      expect(response.success).toBe(true)
      expect(response.content).toBeDefined()
    })
  })
})`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>✅ Assertion Helpers</h2>
        <p>Custom assertions for chat-specific testing.</p>

        <div className="code-block">
          <pre><code>{`import { chatAssertions } from '@clarity-chat/react'

describe('Chat Assertions', () => {
  it('validates messages', () => {
    const message = createTestMessages.user('Hello')

    chatAssertions.isValidMessage(message)
    expect(message.role).toBe('user')
  })

  it('checks message arrays', () => {
    const messages = [
      createTestMessages.user('Hello'),
      createTestMessages.assistant('Hi!')
    ]

    chatAssertions.hasMessages(messages, 2)
  })

  it('validates loading states', () => {
    chatAssertions.isLoading(true)
  })

  it('validates streaming messages', () => {
    const message = createTestMessages.streaming(['Hello', ' world'])
    chatAssertions.isStreaming(message)
  })
})`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎲 Test Data Generators</h2>
        <p>Generate realistic test data.</p>

        <div className="code-block">
          <pre><code>{`import { testDataFactories } from '@clarity-chat/react'

describe('Data Generation', () => {
  it('generates IDs', () => {
    const id1 = testDataFactories.messageId()
    const id2 = testDataFactories.messageId()

    expect(id1).not.toBe(id2)
    expect(id1).toMatch(/^msg-/)
  })

  it('generates timestamps', () => {
    const timestamp = testDataFactories.timestamp()
    expect(timestamp).toBeGreaterThan(0)
    expect(timestamp).toBeLessThanOrEqual(Date.now())
  })

  it('generates message content', () => {
    const content = testDataFactories.messageContent()
    expect(typeof content).toBe('string')
    expect(content.length).toBeGreaterThan(0)
  })
})`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>📚 API Reference</h2>

        <h3>Mock APIs</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>mockChatAPI.success(content?): object</code>
            <p>Mock successful chat response.</p>
          </div>
          <div className="api-item">
            <code>mockChatAPI.streaming(chunks): object</code>
            <p>Mock streaming response.</p>
          </div>
          <div className="api-item">
            <code>mockChatAPI.error(message?, code?): object</code>
            <p>Mock error response.</p>
          </div>
          <div className="api-item">
            <code>MockWebSocket</code>
            <p>Mock WebSocket for testing streaming.</p>
          </div>
          <div className="api-item">
            <code>MockLocalStorage</code>
            <p>Mock localStorage for testing persistence.</p>
          </div>
          <div className="api-item">
            <code>createMockFetch(responses): Function</code>
            <p>Create mock fetch function.</p>
          </div>
        </div>

        <h3>Test Data</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>createTestMessages.user(content, id?): object</code>
            <p>Create user message for testing.</p>
          </div>
          <div className="api-item">
            <code>createTestMessages.assistant(content, id?): object</code>
            <p>Create assistant message for testing.</p>
          </div>
          <div className="api-item">
            <code>createMockChatState(initial?): object</code>
            <p>Create mock chat state for testing.</p>
          </div>
          <div className="api-item">
            <code>testConfigs.basic|withMessages|withError|streaming|enterprise</code>
            <p>Pre-configured test setups.</p>
          </div>
        </div>

        <h3>Testing Utilities</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>asyncTestUtils.nextTick|wait|waitFor</code>
            <p>Async testing helpers.</p>
          </div>
          <div className="api-item">
            <code>domTestUtils.click|type|pressKey|focus|blur|waitForElement</code>
            <p>DOM interaction helpers.</p>
          </div>
          <div className="api-item">
            <code>a11yTestUtils.hasAccessibleName|isKeyboardAccessible|getFocusableElements|testKeyboardNavigation</code>
            <p>Accessibility testing helpers.</p>
          </div>
          <div className="api-item">
            <code>performanceTestUtils.measureRenderTime|measureMemoryUsage|mockPerformance</code>
            <p>Performance testing helpers.</p>
          </div>
          <div className="api-item">
            <code>e2eTestUtils.setupTestEnvironment|teardownTestEnvironment|testChatFlow</code>
            <p>E2E testing helpers.</p>
          </div>
        </div>

        <h3>Assertions & Factories</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>chatAssertions.hasMessages|isValidMessage|isLoading|hasError|isStreaming</code>
            <p>Chat-specific assertions.</p>
          </div>
          <div className="api-item">
            <code>testDataFactories.messageId|chatId|userId|timestamp|messageContent</code>
            <p>Test data generators.</p>
          </div>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎯 Best Practices</h2>

        <h3>Test Organization</h3>
        <ul>
          <li>Use <code>testConfigs</code> for consistent test setups</li>
          <li>Create custom test components with <code>createTestComponent</code></li>
          <li>Use <code>TestWrapper</code> for consistent test environments</li>
          <li>Mock external dependencies (API, WebSocket, localStorage)</li>
        </ul>

        <h3>Async Testing</h3>
        <ul>
          <li>Use <code>asyncTestUtils.waitFor</code> for conditional waits</li>
          <li>Use <code>asyncTestUtils.nextTick</code> for microtask waits</li>
          <li>Mock timers for time-dependent tests</li>
          <li>Test both success and error scenarios</li>
        </ul>

        <h3>Component Testing</h3>
        <ul>
          <li>Test user interactions with <code>domTestUtils</code></li>
          <li>Use <code>createTestMessages</code> for realistic message data</li>
          <li>Test accessibility with <code>a11yTestUtils</code></li>
          <li>Mock hooks with <code>createMockClarityChatHook</code></li>
        </ul>

        <h3>Performance Testing</h3>
        <ul>
          <li>Use <code>performanceTestUtils.measureRenderTime</code> for benchmarks</li>
          <li>Set performance budgets and test against them</li>
          <li>Test memory usage with <code>measureMemoryUsage</code></li>
          <li>Mock performance API for consistent testing</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>🔧 Integration Examples</h2>

        <h3>With Vitest</h3>
        <div className="code-block">
          <pre><code>{`// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
})

// src/test/setup.ts
import { e2eTestUtils } from '@clarity-chat/react'

beforeEach(() => {
  e2eTestUtils.setupTestEnvironment()
})

afterEach(() => {
  e2eTestUtils.teardownTestEnvironment()
})`}</code></pre>
        </div>

        <h3>With React Testing Library</h3>
        <div className="code-block">
          <pre><code>{`import { render, screen } from '@testing-library/react'
import { domTestUtils, createTestMessages } from '@clarity-chat/react'

describe('ChatInput', () => {
  it('sends message on Enter', () => {
    const onSend = vi.fn()
    render(<ChatInput onSendMessage={onSend} />)

    const input = screen.getByRole('textbox')
    domTestUtils.type(input, 'Hello world')
    domTestUtils.pressKey(input, 'Enter')

    expect(onSend).toHaveBeenCalledWith('Hello world')
  })

  it('handles message submission', () => {
    const messages = [createTestMessages.user('Test')]
    render(<MessageList messages={messages} />)

    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})`}</code></pre>
        </div>

        <h3>With Playwright (E2E)</h3>
        <div className="code-block">
          <pre><code>{`// e2e/chat.spec.ts
import { test, expect } from '@playwright/test'
import { testDataFactories } from '@clarity-chat/react'

test('complete chat flow', async ({ page }) => {
  await page.goto('/chat')

  // Type a message
  await page.fill('[data-testid="chat-input"]', 'Hello AI')
  await page.press('[data-testid="chat-input"]', 'Enter')

  // Wait for response
  await page.waitForSelector('[data-testid="assistant-message"]')

  // Verify response
  const response = page.locator('[data-testid="assistant-message"]')
  await expect(response).toBeVisible()
})`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔍 Troubleshooting</h2>

        <h3>Common Issues</h3>
        <div className="issue-list">
          <div className="issue">
            <h4>Mock API not working</h4>
            <p>Ensure mocks are set up before tests run and properly restored after.</p>
          </div>
          <div className="issue">
            <h4>Async tests timing out</h4>
            <p>Use asyncTestUtils.waitFor with appropriate timeouts and conditions.</p>
          </div>
          <div className="issue">
            <h4>DOM interactions not working</h4>
            <p>Use domTestUtils helpers instead of direct DOM manipulation.</p>
          </div>
          <div className="issue">
            <h4>Performance tests inconsistent</h4>
            <p>Mock the performance API and run tests in isolation.</p>
          </div>
        </div>
      </div>
    </div>
  )
}