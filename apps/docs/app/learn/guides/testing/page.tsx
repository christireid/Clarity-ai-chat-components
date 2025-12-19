'use client'

import { ToastProvider } from '@clarity-chat/react/internal'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'
import { TutorialStep } from '@/components/Enhanced/TutorialStep'
import { PropTable, type Prop } from '@/components/API/PropTable'
import { ScrollReveal } from '@/components/UI/ScrollReveal'

const testUtilsExports: Prop[] = [
  {
    name: 'renderWithProviders',
    type: '(ui: ReactElement, options?: RenderOptions) => RenderResult',
    description:
      'Custom render function that wraps components with all providers (Theme, Analytics, ErrorReporter)',
  },
  {
    name: 'renderWithTheme',
    type: '(ui: ReactElement, themeName?: string, options?: RenderOptions) => RenderResult',
    description: 'Render with a specific theme applied',
  },
  {
    name: 'createMockMessage',
    type: '(overrides?: Partial<Message>) => Message',
    description: 'Creates a mock message object for testing',
  },
  {
    name: 'createMockMessages',
    type: '(count?: number) => Message[]',
    description: 'Creates an array of alternating user/assistant mock messages',
  },
  {
    name: 'createMockStreamResponse',
    type: '(text: string, chunkSize?: number) => string[]',
    description: 'Creates chunked text array for simulating streaming',
  },
  {
    name: 'createMockReadableStream',
    type: '(chunks: string[]) => ReadableStream',
    description: 'Creates a mock ReadableStream for testing SSE/streaming',
  },
  {
    name: 'mockFetch',
    type: '(response: any, status?: number) => void',
    description: 'Sets up global.fetch mock with specified response',
  },
  {
    name: 'mockIntersectionObserver',
    type: '() => void',
    description: 'Mocks IntersectionObserver for virtualized list testing',
  },
  {
    name: 'mockResizeObserver',
    type: '() => void',
    description: 'Mocks ResizeObserver for responsive component testing',
  },
  {
    name: 'mockLocalStorage',
    type: '() => Storage',
    description: 'Creates an in-memory localStorage mock',
  },
  {
    name: 'mockSpeechRecognition',
    type: '() => void',
    description: 'Mocks Web Speech API for voice input testing',
  },
  {
    name: 'waitForCondition',
    type: '(condition: () => boolean, timeout?: number) => Promise<void>',
    description: 'Waits for a condition to be true with configurable timeout',
  },
  {
    name: 'flushPromises',
    type: '() => Promise<void>',
    description: 'Flushes all pending promises in the microtask queue',
  },
]

const chatTestUtilsExports: Prop[] = [
  {
    name: 'createMockUseClarityChat',
    type: '(overrides?: Partial<UseClarityChatReturn>) => UseClarityChatReturn',
    description: 'Creates a mock implementation of useClarityChat hook',
  },
  {
    name: 'MockClarityChatProvider',
    type: 'React.FC<{ mockReturn?: Partial<UseClarityChatReturn> }>',
    description: 'Test wrapper component for mocking useClarityChat context',
  },
  {
    name: 'createTestMessages',
    type: '() => CoreMessage[]',
    description: 'Creates a standard set of test messages',
  },
  {
    name: 'createTestUserMessage',
    type: '(content: string) => CoreMessage',
    description: 'Creates a single test user message',
  },
  {
    name: 'createTestAssistantMessage',
    type: '(content: string) => CoreMessage',
    description: 'Creates a single test assistant message',
  },
  {
    name: 'waitForChatUpdate',
    type: '(delay?: number) => Promise<void>',
    description: 'Waits for async chat operations to complete',
  },
  {
    name: 'simulateStreamingResponse',
    type: '(chunks: string[], onChunk?: (chunk: string) => void) => Promise<string>',
    description: 'Simulates a streaming response with chunks',
  },
  {
    name: 'createMockFetch',
    type: '(responses: Record<string, Response>) => typeof fetch',
    description: 'Creates a mock fetch function with URL-based responses',
  },
  {
    name: 'createMockStreamingResponse',
    type: '(content: string, chunkSize?: number) => Response',
    description: 'Creates a mock Response with a streaming body',
  },
  {
    name: 'assertMessageStructure',
    type: '(message: CoreMessage) => void',
    description: 'Asserts that a message has the correct structure',
  },
  {
    name: 'assertChatState',
    type: '(chat: UseClarityChatReturn, expected: ChatStateExpectations) => void',
    description: 'Asserts chat state matches expectations',
  },
]

const mockProviders: Prop[] = [
  {
    name: 'AllTheProviders',
    type: 'React.FC<{ children: ReactNode }>',
    description:
      'Wraps children with ThemeProvider, ErrorReporterProvider, and AnalyticsProvider',
  },
  {
    name: 'MockAnalyticsProvider',
    type: 'React.FC<{ children: ReactNode }>',
    description: 'Analytics provider with tracking disabled for tests',
  },
  {
    name: 'MockErrorReporterProvider',
    type: 'React.FC<{ children: ReactNode }>',
    description: 'Error reporter provider with reporting disabled for tests',
  },
]

export default function TestingGuidePage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <ScrollReveal>
          <div className="mb-8">
            <div className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-4">
              Testing
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
              Testing Guide
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Comprehensive testing utilities for Clarity Chat components. Use
              the dedicated{' '}
              <code className="px-1.5 py-0.5 bg-bg-secondary rounded text-sm">
                @clarity-chat/react/test-utils
              </code>{' '}
              entry point for optimized testing workflows.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <YouWillLearn
            items={[
              'How to import and use test utilities',
              'Custom render functions with providers',
              'Mock message and streaming helpers',
              'Browser API mocks (IntersectionObserver, etc.)',
              'Testing useClarityChat and chat flows',
              'Best practices for component testing',
            ]}
          />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Callout type="tip" className="my-8">
            <strong>Separate Entry Point:</strong> The test utilities are
            exported from <code>@clarity-chat/react/test-utils</code> to keep
            them out of your production bundle. Never import from this path in
            production code.
          </Callout>
        </ScrollReveal>

        <div className="mt-12 space-y-12">
          <ScrollReveal delay={0.3}>
            <TutorialStep step={1} title="Installation & Setup">
              <p className="text-text-secondary mb-4">
                The test utilities are included with{' '}
                <code>@clarity-chat/react</code>. No additional packages needed.
                Configure your test environment:
              </p>

              <EnhancedCodeBlock
                code={`// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})`}
                language="typescript"
                filename="vitest.config.ts"
                showCopyButton
              />

              <EnhancedCodeBlock
                code={`// src/test/setup.ts
import '@testing-library/jest-dom'
import {
  mockIntersectionObserver,
  mockResizeObserver
} from '@clarity-chat/react/test-utils'

// Setup browser API mocks
beforeAll(() => {
  mockIntersectionObserver()
  mockResizeObserver()
})

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
})`}
                language="typescript"
                filename="src/test/setup.ts"
                showCopyButton
              />
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <TutorialStep step={2} title="Basic Component Testing">
              <p className="text-text-secondary mb-4">
                Use <code>renderWithProviders</code> to test components that
                depend on Clarity Chat providers:
              </p>

              <EnhancedCodeBlock
                code={`import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  renderWithProviders,
  createMockMessage,
  createMockMessages,
} from '@clarity-chat/react/test-utils'
import { ChatWindow } from '@clarity-chat/react/internal'

describe('ChatWindow', () => {
  it('renders messages correctly', () => {
    const messages = createMockMessages(3)

    renderWithProviders(
      <ChatWindow
        messages={messages}
        onSendMessage={() => {}}
      />
    )

    expect(screen.getByText('Message 1')).toBeInTheDocument()
    expect(screen.getByText('Message 2')).toBeInTheDocument()
    expect(screen.getByText('Message 3')).toBeInTheDocument()
  })

  it('calls onSendMessage when user submits', async () => {
    const user = userEvent.setup()
    const onSendMessage = vi.fn()

    renderWithProviders(
      <ChatWindow
        messages={[]}
        onSendMessage={onSendMessage}
      />
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'Hello, AI!')
    await user.keyboard('{Enter}')

    expect(onSendMessage).toHaveBeenCalledWith('Hello, AI!')
  })

  it('displays custom empty state', () => {
    renderWithProviders(
      <ChatWindow
        messages={[]}
        onSendMessage={() => {}}
        emptyState={<div>Start chatting!</div>}
      />
    )

    expect(screen.getByText('Start chatting!')).toBeInTheDocument()
  })
})`}
                language="typescript"
                filename="ChatWindow.test.tsx"
                showLineNumbers
                showCopyButton
              />
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <TutorialStep step={3} title="Testing with Themes">
              <p className="text-text-secondary mb-4">
                Use <code>renderWithTheme</code> to test components with
                specific themes applied:
              </p>

              <EnhancedCodeBlock
                code={`import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '@clarity-chat/react/test-utils'
import { Message } from '@clarity-chat/react/internal'

describe('Message theming', () => {
  const mockMessage = {
    id: '1',
    chatId: 'test',
    role: 'assistant' as const,
    content: 'Hello!',
    status: 'sent' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('applies dark theme styles', () => {
    renderWithTheme(
      <Message message={mockMessage} />,
      'dark'
    )

    const messageEl = screen.getByText('Hello!')
    expect(messageEl).toHaveClass('dark:text-white')
  })

  it('applies light theme styles', () => {
    renderWithTheme(
      <Message message={mockMessage} />,
      'light'
    )

    const messageEl = screen.getByText('Hello!')
    expect(messageEl).toBeInTheDocument()
  })
})`}
                language="typescript"
                filename="Message.theme.test.tsx"
                showCopyButton
              />
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <TutorialStep step={4} title="Testing Streaming Responses">
              <p className="text-text-secondary mb-4">
                Use streaming utilities to test real-time message updates:
              </p>

              <EnhancedCodeBlock
                code={`import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import {
  renderWithProviders,
  createMockStreamResponse,
  createMockReadableStream,
  mockFetch,
} from '@clarity-chat/react/test-utils'
import { ChatWindow } from '@clarity-chat/react/internal'

describe('Streaming', () => {
  it('displays streaming text progressively', async () => {
    const fullText = 'This is a streaming response'
    const chunks = createMockStreamResponse(fullText, 5)
    const stream = createMockReadableStream(chunks)

    mockFetch({ body: stream }, 200)

    renderWithProviders(
      <ChatWindow
        messages={[]}
        onSendMessage={async () => {
          await fetch('/api/chat')
        }}
      />
    )

    // Trigger streaming
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Hi')
    await userEvent.keyboard('{Enter}')

    // Verify progressive rendering
    await waitFor(() => {
      expect(screen.getByText(/This is/)).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText(fullText)).toBeInTheDocument()
    })
  })
})`}
                language="typescript"
                filename="Streaming.test.tsx"
                showCopyButton
              />
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.7}>
            <TutorialStep step={5} title="Testing useClarityChat Hook">
              <p className="text-text-secondary mb-4">
                Use dedicated chat test utilities to mock the{' '}
                <code>useClarityChat</code> hook:
              </p>

              <EnhancedCodeBlock
                code={`import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import {
  createMockUseClarityChat,
  createTestMessages,
  createTestUserMessage,
  assertChatState,
  waitForChatUpdate,
} from '@clarity-chat/react/test-utils'
import { useClarityChat } from '@clarity-chat/react/internal'

// Mock the hook module
vi.mock('@clarity-chat/react', async () => {
  const actual = await vi.importActual('@clarity-chat/react')
  return {
    ...actual,
    useClarityChat: vi.fn(),
  }
})

describe('useClarityChat', () => {
  it('handles message submission', async () => {
    const appendMock = vi.fn()
    const mockChat = createMockUseClarityChat({
      messages: createTestMessages(),
      append: appendMock,
    })

    vi.mocked(useClarityChat).mockReturnValue(mockChat)

    const { result } = renderHook(() => useClarityChat({ api: '/api/chat' }))

    // Assert initial state
    assertChatState(result.current, {
      messageCount: 3,
      isLoading: false,
      hasError: false,
    })

    // Submit new message
    await act(async () => {
      await result.current.append(
        createTestUserMessage('New message')
      )
    })

    expect(appendMock).toHaveBeenCalled()
  })

  it('handles loading states', async () => {
    const mockChat = createMockUseClarityChat({
      messages: [],
      isLoading: true,
    })

    vi.mocked(useClarityChat).mockReturnValue(mockChat)

    const { result } = renderHook(() => useClarityChat({ api: '/api/chat' }))

    assertChatState(result.current, {
      isLoading: true,
      messageCount: 0,
    })
  })

  it('handles errors gracefully', async () => {
    const mockChat = createMockUseClarityChat({
      error: new Error('API Error'),
    })

    vi.mocked(useClarityChat).mockReturnValue(mockChat)

    const { result } = renderHook(() => useClarityChat({ api: '/api/chat' }))

    assertChatState(result.current, {
      hasError: true,
    })
  })
})`}
                language="typescript"
                filename="useClarityChat.test.tsx"
                showLineNumbers
                showCopyButton
              />
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.8}>
            <TutorialStep step={6} title="Testing Voice Input">
              <p className="text-text-secondary mb-4">
                Mock the Web Speech API for testing voice input components:
              </p>

              <EnhancedCodeBlock
                code={`import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  renderWithProviders,
  mockSpeechRecognition,
} from '@clarity-chat/react/test-utils'
import { VoiceInput } from '@clarity-chat/react/internal'

describe('VoiceInput', () => {
  beforeEach(() => {
    mockSpeechRecognition()
  })

  it('captures voice transcript', async () => {
    const user = userEvent.setup()
    const onTranscript = vi.fn()

    renderWithProviders(
      <VoiceInput onTranscript={onTranscript} />
    )

    // Click microphone button
    const micButton = screen.getByRole('button', { name: /voice/i })
    await user.click(micButton)

    // Wait for mock transcript
    await waitFor(() => {
      expect(onTranscript).toHaveBeenCalledWith('test transcript')
    })
  })
})`}
                language="typescript"
                filename="VoiceInput.test.tsx"
                showCopyButton
              />
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.9}>
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6">
                Test Utilities Reference
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Core Test Utilities
                  </h3>
                  <p className="text-text-secondary mb-4">
                    Import from{' '}
                    <code className="px-1.5 py-0.5 bg-bg-secondary rounded text-sm">
                      @clarity-chat/react/test-utils
                    </code>
                    :
                  </p>
                  <PropTable props={testUtilsExports} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Mock Providers</h3>
                  <PropTable props={mockProviders} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Chat-Specific Utilities
                  </h3>
                  <p className="text-text-secondary mb-4">
                    Specialized utilities for testing chat functionality:
                  </p>
                  <PropTable props={chatTestUtilsExports} />
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1.0}>
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Best Practices</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">+</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Use Test Entry Point
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Always import from{' '}
                    <code>@clarity-chat/react/test-utils</code> to keep test
                    code out of production bundles.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">+</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Setup Browser Mocks Early
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Call <code>mockIntersectionObserver()</code> and similar
                    mocks in <code>beforeAll</code> to avoid flaky tests.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">+</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Use renderWithProviders
                  </h4>
                  <p className="text-sm text-text-secondary">
                    This ensures components have access to all required context
                    providers during tests.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">+</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Test User Interactions
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Use <code>userEvent</code> (re-exported) for realistic user
                    interaction testing instead of <code>fireEvent</code>.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">-</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Avoid Implementation Details
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Test behavior, not implementation. Query by role/text, not
                    by className or test IDs when possible.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">-</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Don&apos;t Import in Production
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Never import <code>test-utils</code> in application code.
                    It&apos;s only for test files.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1.1}>
            <Callout type="info" className="mt-8">
              <strong>Re-exports:</strong> The test-utils entry point re-exports
              everything from <code>@testing-library/react</code> and{' '}
              <code>@testing-library/user-event</code> for convenience. You can
              import them all from one place.
            </Callout>
          </ScrollReveal>
        </div>

        <Pagination
          prev={{
            title: 'Bundle Size Optimization',
            href: '/learn/guides/bundle-size',
          }}
          next={{
            title: 'Performance Guide',
            href: '/guides/performance',
          }}
        />
      </>
    </ToastProvider>
  )
}
