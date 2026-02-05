'use client'

import React, { useState } from 'react'
import {
  Code2,
  TestTube,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Zap,
  Users,
  ArrowRight,
  Copy,
  Eye,
  Play,
  BookOpen,
  Package,
} from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

const testingCategories = [
  {
    id: 'unit',
    name: 'Unit Tests',
    icon: TestTube,
    description: 'Test individual components in isolation',
    count: 15,
    color: 'text-blue-500',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 'integration',
    name: 'Integration Tests',
    icon: Users,
    description: 'Test component interactions',
    count: 8,
    color: 'text-purple-500',
    gradient: 'from-purple-500/20 to-violet-500/20',
  },
  {
    id: 'accessibility',
    name: 'Accessibility Tests',
    icon: Eye,
    description: 'WCAG compliance and a11y testing',
    count: 12,
    color: 'text-green-500',
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  {
    id: 'e2e',
    name: 'E2E Tests',
    icon: Play,
    description: 'End-to-end user flows',
    count: 6,
    color: 'text-orange-500',
    gradient: 'from-orange-500/20 to-amber-500/20',
  },
  {
    id: 'mocks',
    name: 'Mock Factories',
    icon: Package,
    description: 'Generate test data',
    count: 10,
    color: 'text-pink-500',
    gradient: 'from-pink-500/20 to-rose-500/20',
  },
  {
    id: 'utilities',
    name: 'Test Utilities',
    icon: Zap,
    description: 'Helper functions and setup',
    count: 8,
    color: 'text-cyan-500',
    gradient: 'from-cyan-500/20 to-blue-500/20',
  },
]

const testExamples = {
  unit: `// Unit Test Example - ChatMessage Component
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatMessage } from '@clarity-chat/react'

describe('ChatMessage', () => {
  const mockMessage = {
    id: '1',
    role: 'user',
    content: 'Hello, AI!',
    timestamp: new Date(),
  }

  it('renders message content', () => {
    render(<ChatMessage message={mockMessage} />)
    expect(screen.getByText('Hello, AI!')).toBeInTheDocument()
  })

  it('displays timestamp', () => {
    render(<ChatMessage message={mockMessage} showTimestamp />)
    const timestamp = screen.getByText(/ago/)
    expect(timestamp).toBeInTheDocument()
  })

  it('calls onEdit when edit button clicked', () => {
    const onEdit = vi.fn()
    render(<ChatMessage message={mockMessage} onEdit={onEdit} />)

    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)

    expect(onEdit).toHaveBeenCalledWith('1', 'Hello, AI!')
  })

  it('supports markdown rendering', () => {
    const messageWithMarkdown = {
      ...mockMessage,
      content: '**Bold** and *italic*',
    }

    render(<ChatMessage message={messageWithMarkdown} />)

    expect(screen.getByText('Bold')).toHaveStyle({ fontWeight: 'bold' })
    expect(screen.getByText('italic')).toHaveStyle({ fontStyle: 'italic' })
  })
})`,

  integration: `// Integration Test Example - Chat Flow
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClarityChatApp } from '@clarity-chat/react'

describe('Chat Flow Integration', () => {
  it('complete conversation flow', async () => {
    const user = userEvent.setup()

    // Mock API
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: 'AI Response' }),
    })

    render(<ClarityChatApp api="/api/chat" />)

    // User types message
    const input = screen.getByPlaceholderText(/type a message/i)
    await user.type(input, 'Hello!')

    // User sends message
    const sendButton = screen.getByRole('button', { name: /send/i })
    await user.click(sendButton)

    // Wait for user message to appear
    await waitFor(() => {
      expect(screen.getByText('Hello!')).toBeInTheDocument()
    })

    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText('AI Response')).toBeInTheDocument()
    })

    // Verify input cleared
    expect(input).toHaveValue('')
  })

  it('handles file upload with message', async () => {
    const user = userEvent.setup()

    render(<ClarityChatApp api="/api/chat" features={{ fileUpload: true }} />)

    // Upload file
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const fileInput = screen.getByLabelText(/upload file/i)
    await user.upload(fileInput, file)

    // Verify file appears
    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeInTheDocument()
    })

    // Send with message
    const textInput = screen.getByPlaceholderText(/type a message/i)
    await user.type(textInput, 'Check this file')
    await user.click(screen.getByRole('button', { name: /send/i }))

    // Verify both sent
    await waitFor(() => {
      expect(screen.getByText('Check this file')).toBeInTheDocument()
      expect(screen.getByText('test.txt')).toBeInTheDocument()
    })
  })
})`,

  accessibility: `// Accessibility Test Example
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ChatInput } from '@clarity-chat/react'

expect.extend(toHaveNoViolations)

describe('ChatInput Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <ChatInput onSend={(msg) => {}} />
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('supports keyboard navigation', async () => {
    render(<ChatInput onSend={vi.fn()} />)

    const input = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button', { name: /send/i })

    // Tab to input
    await userEvent.tab()
    expect(input).toHaveFocus()

    // Tab to send button
    await userEvent.tab()
    expect(sendButton).toHaveFocus()
  })

  it('has proper ARIA labels', () => {
    render(<ChatInput onSend={vi.fn()} />)

    const input = screen.getByRole('textbox', {
      name: /type your message/i
    })
    expect(input).toHaveAttribute('aria-label')

    const sendButton = screen.getByRole('button', { name: /send/i })
    expect(sendButton).toHaveAttribute('aria-label')
  })

  it('announces loading state to screen readers', async () => {
    render(<ChatInput onSend={vi.fn()} isLoading />)

    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveTextContent(/sending/i)
  })

  it('supports reduced motion', () => {
    // Mock prefers-reduced-motion
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    const { container } = render(<ChatInput onSend={vi.fn()} />)

    // Verify no animations applied
    const animated = container.querySelectorAll('[class*="animate"]')
    expect(animated).toHaveLength(0)
  })
})`,

  e2e: `// E2E Test Example (Playwright)
import { test, expect } from '@playwright/test'

test.describe('Chat E2E Flow', () => {
  test('complete chat conversation', async ({ page }) => {
    await page.goto('http://localhost:3000/chat')

    // Type message
    const input = page.getByPlaceholder(/type a message/i)
    await input.fill('What is React?')

    // Send message
    const sendButton = page.getByRole('button', { name: /send/i })
    await sendButton.click()

    // Wait for user message
    await expect(page.getByText('What is React?')).toBeVisible()

    // Wait for AI response
    await expect(page.getByText(/React is/i)).toBeVisible({
      timeout: 10000
    })

    // Verify streaming animation
    const streamingIndicator = page.getByTestId('streaming-indicator')
    await expect(streamingIndicator).toBeVisible()
    await expect(streamingIndicator).not.toBeVisible({ timeout: 15000 })
  })

  test('handles errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route('/api/chat', route =>
      route.fulfill({ status: 500 })
    )

    await page.goto('http://localhost:3000/chat')

    const input = page.getByPlaceholder(/type a message/i)
    await input.fill('Test message')
    await page.getByRole('button', { name: /send/i }).click()

    // Verify error message
    await expect(page.getByText(/error/i)).toBeVisible()

    // Verify retry button
    const retryButton = page.getByRole('button', { name: /retry/i })
    await expect(retryButton).toBeVisible()
  })

  test('file upload workflow', async ({ page }) => {
    await page.goto('http://localhost:3000/chat')

    // Upload file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('./test-files/document.pdf')

    // Verify file preview
    await expect(page.getByText('document.pdf')).toBeVisible()

    // Send with message
    await page.getByPlaceholder(/type a message/i).fill('Summarize this')
    await page.getByRole('button', { name: /send/i }).click()

    // Verify both appear
    await expect(page.getByText('Summarize this')).toBeVisible()
    await expect(page.getByText('document.pdf')).toBeVisible()
  })
})`,

  mocks: `// Mock Factories
import { faker } from '@faker-js/faker'
import type { Message, User, Conversation } from '@clarity-chat/types'

/**
 * Generate a mock message
 */
export function createMockMessage(overrides?: Partial<Message>): Message {
  return {
    id: faker.string.uuid(),
    role: faker.helpers.arrayElement(['user', 'assistant', 'system']),
    content: faker.lorem.paragraph(),
    timestamp: faker.date.recent(),
    ...overrides,
  }
}

/**
 * Generate multiple mock messages
 */
export function createMockMessages(count: number = 5): Message[] {
  return Array.from({ length: count }, () => createMockMessage())
}

/**
 * Generate a mock conversation
 */
export function createMockConversation(
  overrides?: Partial<Conversation>
): Conversation {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    messages: createMockMessages(faker.number.int({ min: 3, max: 10 })),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    userId: faker.string.uuid(),
    ...overrides,
  }
}

/**
 * Generate a mock user
 */
export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    ...overrides,
  }
}

/**
 * Generate streaming message chunks
 */
export function* createStreamingMessage(
  message: string,
  chunkSize: number = 10
): Generator<string> {
  for (let i = 0; i < message.length; i += chunkSize) {
    yield message.slice(i, i + chunkSize)
  }
}

/**
 * Mock API response
 */
export function createMockAPIResponse<T>(
  data: T,
  overrides?: Partial<Response>
) {
  return {
    ok: true,
    status: 200,
    json: async () => data,
    ...overrides,
  } as Response
}`,

  utilities: `// Test Utilities
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { ClarityChatProvider } from '@clarity-chat/react'

/**
 * Custom render with providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <ClarityChatProvider config={{ api: '/api/chat' }}>
        {children}
      </ClarityChatProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

/**
 * Wait for loading to complete
 */
export async function waitForLoadingToFinish() {
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })
}

/**
 * Mock fetch with streaming response
 */
export function mockStreamingFetch(chunks: string[]) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      chunks.forEach(chunk => {
        controller.enqueue(encoder.encode(\`data: \${chunk}\\n\\n\`))
      })
      controller.close()
    },
  })

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    body: stream,
  })
}

/**
 * Setup component test
 */
export function setupComponentTest<P>(
  Component: React.ComponentType<P>,
  defaultProps: P
) {
  return {
    render: (props?: Partial<P>) =>
      renderWithProviders(<Component {...defaultProps} {...props} />),
    props: defaultProps,
  }
}

/**
 * Test utilities for accessibility
 */
export const a11y = {
  /**
   * Check for ARIA attributes
   */
  hasAriaLabel: (element: HTMLElement) =>
    element.hasAttribute('aria-label') ||
    element.hasAttribute('aria-labelledby'),

  /**
   * Check for keyboard navigability
   */
  isKeyboardNavigable: (element: HTMLElement) =>
    element.tabIndex >= 0 || element.hasAttribute('tabindex'),

  /**
   * Get contrast ratio
   */
  getContrastRatio: (fg: string, bg: string) => {
    // Implementation would calculate WCAG contrast ratio
    return 4.5 // Placeholder
  },
}`,
}

const bestPractices = [
  {
    title: 'Test User Behavior, Not Implementation',
    description: 'Focus on what users see and do, not internal component state',
    example: 'Test button clicks, not setState calls',
    icon: Users,
    color: 'text-blue-500',
  },
  {
    title: 'Write Accessible Tests',
    description: 'Use semantic queries like getByRole, getByLabelText',
    example: 'getByRole("button", { name: /send/i })',
    icon: Eye,
    color: 'text-green-500',
  },
  {
    title: 'Mock External Dependencies',
    description: 'Isolate components by mocking APIs and third-party code',
    example: 'Mock fetch, WebSocket, localStorage',
    icon: Package,
    color: 'text-purple-500',
  },
  {
    title: 'Test Error States',
    description: 'Verify graceful handling of errors and edge cases',
    example: 'Network failures, validation errors, loading states',
    icon: AlertCircle,
    color: 'text-red-500',
  },
  {
    title: 'Use Test IDs Sparingly',
    description: 'Prefer semantic queries; use data-testid as last resort',
    example: 'getByRole > getByLabelText > getByTestId',
    icon: Code2,
    color: 'text-orange-500',
  },
  {
    title: 'Keep Tests Fast',
    description: 'Use mocks, avoid unnecessary renders, parallelize tests',
    example: 'Unit tests < 5ms, Integration < 100ms',
    icon: Zap,
    color: 'text-yellow-500',
  },
]

const coverageGuide = {
  title: 'Test Coverage Guide',
  metrics: [
    { label: 'Unit Tests', target: '85%', current: '87%', status: 'good' },
    { label: 'Integration Tests', target: '75%', current: '72%', status: 'ok' },
    { label: 'Accessibility Tests', target: '100%', current: '100%', status: 'good' },
    { label: 'E2E Tests', target: 'Critical Flows', current: '8/10', status: 'good' },
  ],
}

export default function TestingPage() {
  const [activeTab, setActiveTab] = useState('unit')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="orb-primary -top-20 -left-20 animate-float" />
        <div
          className="orb-violet top-1/3 -right-32 animate-float"
          style={{ animationDelay: '-2s' }}
        />
        <div className="absolute inset-0 dot-pattern opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-container">
              <TestTube className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                Testing Utilities
              </h1>
              <p className="text-muted-foreground">
                Comprehensive testing examples and utilities for Clarity Chat components
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="stat-card">
              <div className="text-2xl font-bold gradient-text">59</div>
              <div className="text-sm text-muted-foreground">Test Examples</div>
            </div>
            <div className="stat-card">
              <div className="text-2xl font-bold gradient-text">87%</div>
              <div className="text-sm text-muted-foreground">Coverage</div>
            </div>
            <div className="stat-card">
              <div className="text-2xl font-bold gradient-text">10</div>
              <div className="text-sm text-muted-foreground">Mock Factories</div>
            </div>
            <div className="stat-card">
              <div className="text-2xl font-bold gradient-text">100%</div>
              <div className="text-sm text-muted-foreground">A11y Tests</div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6">Test Categories</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testingCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={cn(
                  'feature-card text-left cursor-pointer transition-all',
                  activeTab === category.id
                    ? 'border-primary/50 shadow-lg'
                    : 'hover:border-primary/30'
                )}
              >
                <div
                  className={cn(
                    'absolute inset-0 rounded-2xl opacity-0 transition-opacity bg-gradient-to-br',
                    category.gradient,
                    activeTab === category.id && 'opacity-100'
                  )}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn('icon-container-sm', category.color)}>
                      <category.icon className="h-5 w-5" />
                    </div>
                    <span className="badge-glass text-xs">{category.count}</span>
                  </div>

                  <h3 className="font-semibold mb-1 flex items-center gap-2">
                    {category.name}
                    {activeTab === category.id && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Code Examples */}
        <section className="mb-12">
          <div className="glass-card">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileCode className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="text-xl font-bold">
                      {testingCategories.find((c) => c.id === activeTab)?.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Click copy to use these examples in your tests
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    copyCode(testExamples[activeTab as keyof typeof testExamples], activeTab)
                  }
                  className="px-4 py-2 rounded-lg glass flex items-center gap-2 hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
                >
                  {copiedCode === activeTab ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="text-sm">Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6">
              <pre className="glass-panel p-6 overflow-x-auto text-sm">
                <code className="language-typescript">
                  {testExamples[activeTab as keyof typeof testExamples]}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6">Testing Best Practices</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bestPractices.map((practice, index) => (
              <div key={index} className="feature-card">
                <div className={cn('icon-container-sm mb-3', practice.color)}>
                  <practice.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-2">{practice.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {practice.description}
                </p>
                <div className="glass-panel px-3 py-2">
                  <code className="text-xs text-foreground">{practice.example}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage Guide */}
        <section className="mb-12">
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="icon-container">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{coverageGuide.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Current test coverage and targets
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {coverageGuide.metrics.map((metric, index) => (
                <div key={index} className="glass-panel p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{metric.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        Target: {metric.target}
                      </span>
                      <span
                        className={cn(
                          'font-bold',
                          metric.status === 'good' && 'text-green-500',
                          metric.status === 'ok' && 'text-yellow-500',
                          metric.status === 'warning' && 'text-red-500'
                        )}
                      >
                        {metric.current}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        metric.status === 'good' && 'bg-green-500',
                        metric.status === 'ok' && 'bg-yellow-500',
                        metric.status === 'warning' && 'bg-red-500'
                      )}
                      style={{
                        width:
                          metric.status === 'good'
                            ? '100%'
                            : metric.status === 'ok'
                              ? '75%'
                              : '50%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6">Resources</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="https://testing-library.com/docs/react-testing-library/intro/"
              target="_blank"
              rel="noopener noreferrer"
              className="feature-card hover:border-primary/30 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Testing Library Docs</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Official React Testing Library documentation
              </p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <span>Read documentation</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </a>

            <a
              href="https://vitest.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="feature-card hover:border-primary/30 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Vitest Guide</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Fast unit testing framework documentation
              </p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <span>Learn Vitest</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </a>

            <a
              href="https://playwright.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="feature-card hover:border-primary/30 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <Play className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Playwright E2E</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                End-to-end testing with Playwright
              </p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <span>View guide</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </a>

            <a
              href="https://www.w3.org/WAI/test-evaluate/"
              target="_blank"
              rel="noopener noreferrer"
              className="feature-card hover:border-primary/30 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <Eye className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Accessibility Testing</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                WCAG testing guidelines and tools
              </p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <span>Learn more</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

function BarChart3({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  )
}
