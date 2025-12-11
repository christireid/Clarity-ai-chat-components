/**
 * ClarityChat Component Stories
 *
 * The complete, drop-in AI chat interface component. ClarityChat provides
 * everything you need to add AI-powered chat to your application with
 * zero configuration required.
 *
 * ## Features
 * - Drop-in ready with sensible defaults
 * - Built-in streaming support
 * - Optional memory management
 * - Fully themeable with Tailwind CSS
 * - WCAG 2.1 AA accessible
 * - Responsive design
 *
 * ## Installation
 * ```bash
 * npm install @clarity-chat/react
 * ```
 *
 * ## Quick Start
 * ```tsx
 * import { ClarityChat } from '@clarity-chat/react'
 *
 * export default function Chat() {
 *   return <ClarityChat api="/api/chat" />
 * }
 * ```
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { http, HttpResponse, delay } from 'msw'
import { ClarityChat } from '@clarity-chat/react'

// Simple action function replacement for action('action')
const action =
  (name: string) =>
  (...args: unknown[]) =>
    console.log(name, ...args)

const meta: Meta<typeof ClarityChat> = {
  title: 'Components/Drop-in Solutions/ClarityChat',
  component: ClarityChat,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The complete AI chat interface. Use this when you want a fully-featured ' +
          'chat UI with minimal setup. For more customization, see the building block components.',
      },
    },
  },
  argTypes: {
    api: {
      control: 'text',
      description: 'The API endpoint for chat completions',
      table: {
        type: { summary: 'string' },
        category: 'Required',
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the container',
      table: {
        type: { summary: 'string' },
        category: 'Appearance',
      },
    },
    showHeader: {
      control: 'boolean',
      description: 'Whether to show the chat header',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Appearance',
      },
    },
    sessionTitle: {
      control: 'text',
      description: 'Title displayed in the header',
      table: {
        type: { summary: 'string' },
        category: 'Appearance',
      },
    },
    sessionSubtitle: {
      control: 'text',
      description: 'Subtitle displayed in the header',
      table: {
        type: { summary: 'string' },
        category: 'Appearance',
      },
    },
    showMessageCount: {
      control: 'boolean',
      description: 'Show message count badge in header',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Appearance',
      },
    },
    showTokenCounter: {
      control: 'boolean',
      description: 'Show token counter in input',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Features',
      },
    },
    showNetworkStatus: {
      control: 'boolean',
      description: 'Show network status indicator',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Features',
      },
    },
    memoryStrategy: {
      control: 'select',
      options: ['sliding-window', 'semantic-chunks', 'vector-store'],
      description: 'Memory strategy for conversation context',
      table: {
        type: {
          summary: "'sliding-window' | 'semantic-chunks' | 'vector-store'",
        },
        category: 'Features',
      },
    },
    onError: {
      action: 'onError',
      description: 'Callback when an error occurs',
      table: {
        type: { summary: '(error: Error) => void' },
        category: 'Events',
      },
    },
    onExport: {
      action: 'onExport',
      description: 'Callback for export functionality',
      table: {
        type: { summary: '() => void' },
        category: 'Events',
      },
    },
    onClear: {
      action: 'onClear',
      description: 'Callback for clear chat functionality',
      table: {
        type: { summary: '() => void' },
        category: 'Events',
      },
    },
  },
  args: {
    api: '/api/chat',
    onError: action('onError'),
  },
  decorators: [
    (Story) => (
      <div className="h-[600px] w-full max-w-4xl mx-auto border rounded-lg overflow-hidden bg-background">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// REALISTIC MSW HANDLERS - Simulating Real AI Responses
// =============================================================================

/**
 * Simulates realistic character-by-character streaming with variable timing
 * to mimic actual LLM token generation behavior
 */
const createRealisticStreamHandler = (
  responseText: string,
  options: {
    initialDelay?: number
    minCharDelay?: number
    maxCharDelay?: number
    pauseOnPunctuation?: boolean
    thinkingTime?: number
  } = {}
) => {
  const {
    initialDelay = 500,
    minCharDelay = 15,
    maxCharDelay = 50,
    pauseOnPunctuation = true,
    thinkingTime = 0,
  } = options

  return http.post('/api/chat', async () => {
    // Initial "thinking" delay
    await delay(initialDelay + thinkingTime)

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // Stream character by character for realistic effect
        for (let i = 0; i < responseText.length; i++) {
          const char = responseText[i]

          // Variable delay based on character type
          let charDelay =
            Math.random() * (maxCharDelay - minCharDelay) + minCharDelay

          // Longer pause after punctuation for natural reading
          if (
            pauseOnPunctuation &&
            ['.', '!', '?', ',', ';', ':'].includes(char)
          ) {
            charDelay += 100
          }

          // Slight pause at newlines
          if (char === '\n') {
            charDelay += 50
          }

          await delay(charDelay)

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content: char })}\n\n`)
          )
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  })
}

/**
 * Creates a handler that simulates word-by-word streaming (faster than char-by-char)
 */
const createWordStreamHandler = (
  responseText: string,
  wordDelay: number = 50
) => {
  return http.post('/api/chat', async () => {
    await delay(300)

    const encoder = new TextEncoder()
    const words = responseText.split(' ')

    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < words.length; i++) {
          const word = words[i]
          const isLast = i === words.length - 1

          await delay(wordDelay + Math.random() * 30)

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ content: word + (isLast ? '' : ' ') })}\n\n`
            )
          )
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    return new HttpResponse(stream, {
      headers: { 'Content-Type': 'text/event-stream' },
    })
  })
}

/**
 * Creates a handler that simulates code block streaming with syntax awareness
 */
const createCodeStreamHandler = (codeResponse: string) => {
  return http.post('/api/chat', async () => {
    await delay(400)

    const encoder = new TextEncoder()
    const lines = codeResponse.split('\n')

    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          const isLast = i === lines.length - 1

          // Faster for code, but still line-by-line for readability
          await delay(80 + Math.random() * 40)

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ content: line + (isLast ? '' : '\n') })}\n\n`
            )
          )
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    return new HttpResponse(stream, {
      headers: { 'Content-Type': 'text/event-stream' },
    })
  })
}

/**
 * Creates error handlers for various failure scenarios
 */
const createErrorHandlers = {
  serverError: () =>
    http.post('/api/chat', () => {
      return new HttpResponse(
        JSON.stringify({
          error: 'Internal Server Error',
          message: 'Something went wrong on our end. Please try again.',
        }),
        { status: 500 }
      )
    }),

  rateLimited: () =>
    http.post('/api/chat', () => {
      return new HttpResponse(
        JSON.stringify({
          error: 'Rate Limited',
          message:
            'Too many requests. Please wait a moment before trying again.',
        }),
        { status: 429, headers: { 'Retry-After': '30' } }
      )
    }),

  unauthorized: () =>
    http.post('/api/chat', () => {
      return new HttpResponse(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'Invalid API key. Please check your configuration.',
        }),
        { status: 401 }
      )
    }),

  timeout: () =>
    http.post('/api/chat', async () => {
      await delay(30000)
      return new HttpResponse(null, { status: 504 })
    }),

  networkError: () =>
    http.post('/api/chat', () => {
      return HttpResponse.error()
    }),
}

/**
 * Creates a handler that simulates a slow connection
 */
const createSlowConnectionHandler = (responseText: string) => {
  return http.post('/api/chat', async () => {
    await delay(2000) // Long initial delay

    const encoder = new TextEncoder()
    const words = responseText.split(' ')

    const stream = new ReadableStream({
      async start(controller) {
        for (const word of words) {
          // Very slow streaming to simulate poor connection
          await delay(200 + Math.random() * 300)

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ content: word + ' ' })}\n\n`
            )
          )
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    return new HttpResponse(stream, {
      headers: { 'Content-Type': 'text/event-stream' },
    })
  })
}

// =============================================================================
// RESPONSE CONTENT
// =============================================================================

const RESPONSES = {
  greeting: `Hello! I'm Clarity, your AI assistant. I'm here to help you with anything you need—from answering questions and explaining concepts to helping with code and creative writing.

What would you like to explore today?`,

  codeExample: `Here's a React hook for managing form state with validation:

\`\`\`tsx
import { useState, useCallback } from 'react'

interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
}

function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validate: (values: T) => Partial<Record<keyof T, string>>
) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
  })

  const handleChange = useCallback((field: keyof T, value: unknown) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      touched: { ...prev.touched, [field]: true },
    }))
  }, [])

  const handleBlur = useCallback((field: keyof T) => {
    setState(prev => {
      const errors = validate(prev.values)
      return { ...prev, errors, touched: { ...prev.touched, [field]: true } }
    })
  }, [validate])

  return { ...state, handleChange, handleBlur }
}
\`\`\`

This hook provides:
- **Type-safe form values** with generics
- **Field-level validation** on blur
- **Touch tracking** to show errors only after interaction
- **Memoized handlers** for performance`,

  markdownDemo: `# Markdown Rendering Demo

Clarity Chat supports **rich markdown** formatting for responses:

## Text Formatting
- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- ~~Strikethrough~~ for corrections
- \`inline code\` for technical terms

## Lists
1. First ordered item
2. Second ordered item
3. Third ordered item

- Unordered item one
- Unordered item two
- Unordered item three

## Blockquotes
> "The best way to predict the future is to invent it."
> — Alan Kay

## Tables
| Feature | Status | Notes |
|---------|--------|-------|
| Streaming | ✅ | Real-time token display |
| Markdown | ✅ | Full GFM support |
| Code | ✅ | Syntax highlighting |

## Links
Learn more at [Clarity Chat Documentation](https://clarity-chat.dev).`,

  thinkingResponse: `Let me think about this carefully...

After analyzing your question, I believe the best approach would be to break this down into several key considerations:

**1. Understanding the Context**
First, we need to establish what problem we're actually solving. Often, the stated problem isn't the root cause.

**2. Evaluating Options**
There are typically multiple valid approaches. The "best" choice depends on your specific constraints—time, resources, maintainability, and team expertise.

**3. My Recommendation**
Based on common patterns and best practices, I'd suggest starting with the simplest solution that could work, then iterating based on real feedback.

Would you like me to elaborate on any of these points?`,

  longResponse: `Thank you for your question! This is a comprehensive topic that deserves a thorough explanation.

## Introduction

The evolution of modern web development has brought us remarkable tools and frameworks that make building complex applications more accessible than ever. However, with this power comes responsibility—the responsibility to create applications that are not only functional but also performant, accessible, and maintainable.

## Key Principles

### Performance First
When building real-time applications like chat interfaces, performance isn't optional—it's foundational. Every millisecond of latency affects user perception and engagement. Consider:

- **Streaming responses** instead of waiting for complete responses
- **Virtual scrolling** for long message lists
- **Optimistic updates** for immediate feedback
- **Intelligent caching** to reduce redundant requests

### Accessibility Always
An estimated 15% of the world's population lives with some form of disability. Building accessible applications isn't just ethical—it's good business:

- Proper semantic HTML structure
- ARIA attributes where native semantics fall short
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast

### Developer Experience
Happy developers build better products. A well-designed component library should:

- Have intuitive, consistent APIs
- Provide comprehensive TypeScript types
- Include clear documentation with examples
- Support common customization patterns

## Conclusion

Building great software is a journey of continuous improvement. Start with solid foundations, measure everything, and iterate based on real user feedback.

Is there a specific aspect you'd like me to dive deeper into?`,
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * The default ClarityChat configuration with realistic streaming.
 * Watch how the AI response streams character-by-character.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [createRealisticStreamHandler(RESPONSES.greeting)],
    },
    docs: {
      description: {
        story:
          'The default ClarityChat experience with realistic character-by-character streaming. ' +
          'Type a message and watch the AI respond naturally.',
      },
    },
  },
}

/**
 * ClarityChat with a header showing session information.
 * Useful for multi-conversation interfaces.
 */
export const WithHeader: Story = {
  args: {
    showHeader: true,
    sessionTitle: 'AI Assistant',
    sessionSubtitle: 'Powered by Clarity Chat',
    showMessageCount: true,
  },
  parameters: {
    msw: {
      handlers: [createRealisticStreamHandler(RESPONSES.greeting)],
    },
    docs: {
      description: {
        story:
          'The header provides context for the conversation and can include ' +
          'custom actions like export or clear functionality.',
      },
    },
  },
}

/**
 * ClarityChat with export and clear actions in the header.
 */
export const WithActions: Story = {
  args: {
    showHeader: true,
    sessionTitle: 'Chat Session',
    onExport: action('export'),
    onClear: action('clear'),
  },
  parameters: {
    msw: {
      handlers: [createRealisticStreamHandler(RESPONSES.greeting)],
    },
  },
}

/**
 * Custom styled chat with a dark theme applied via className.
 */
export const DarkTheme: Story = {
  args: {
    className: 'dark bg-gray-900',
    showHeader: true,
    sessionTitle: 'Dark Mode Chat',
  },
  parameters: {
    backgrounds: { default: 'dark' },
    msw: {
      handlers: [createRealisticStreamHandler(RESPONSES.greeting)],
    },
  },
  decorators: [
    (Story) => (
      <div className="dark h-[600px] w-full max-w-4xl mx-auto border border-gray-700 rounded-lg overflow-hidden">
        <Story />
      </div>
    ),
  ],
}

/**
 * ClarityChat with memory enabled for multi-turn conversations.
 */
export const WithMemory: Story = {
  args: {
    memoryStrategy: 'sliding-window',
    showHeader: true,
    sessionTitle: 'Chat with Memory',
    sessionSubtitle: 'Context-aware conversation',
  },
  parameters: {
    msw: {
      handlers: [
        createRealisticStreamHandler(
          "I'll remember our conversation! I'm using a sliding-window memory strategy to maintain context across multiple turns. Feel free to reference things we discussed earlier—I'll keep track.",
          { thinkingTime: 800 }
        ),
      ],
    },
    docs: {
      description: {
        story:
          'When memory is enabled, Clarity Chat maintains conversation context ' +
          'and can reference previous messages. This is essential for multi-turn conversations.',
      },
    },
  },
}

/**
 * Demonstrates the "thinking" state with extended initial delay.
 */
export const ThinkingState: Story = {
  args: {
    showHeader: true,
    sessionTitle: 'Deep Thinking',
    sessionSubtitle: 'Complex reasoning mode',
  },
  parameters: {
    msw: {
      handlers: [
        createRealisticStreamHandler(RESPONSES.thinkingResponse, {
          initialDelay: 2500,
          thinkingTime: 1500,
        }),
      ],
    },
    docs: {
      description: {
        story:
          'For complex questions, the AI takes time to "think" before responding. ' +
          'The thinking indicator provides feedback during this processing time.',
      },
    },
  },
}

/**
 * Code assistant with syntax-highlighted streaming.
 */
export const CodeAssistant: Story = {
  args: {
    showHeader: true,
    sessionTitle: 'Code Assistant',
    sessionSubtitle: 'Ask me about code',
  },
  parameters: {
    msw: {
      handlers: [createCodeStreamHandler(RESPONSES.codeExample)],
    },
    docs: {
      description: {
        story:
          'ClarityChat supports markdown rendering with syntax highlighting for code blocks. ' +
          'Watch how code streams line-by-line for readability.',
      },
    },
  },
}

/**
 * Demonstrates full markdown rendering capabilities.
 */
export const MarkdownRendering: Story = {
  args: {
    showHeader: true,
    sessionTitle: 'Documentation Helper',
    sessionSubtitle: 'Rich text support',
  },
  parameters: {
    msw: {
      handlers: [createWordStreamHandler(RESPONSES.markdownDemo, 30)],
    },
    docs: {
      description: {
        story:
          'ClarityChat renders rich markdown including headers, lists, tables, ' +
          'blockquotes, and inline formatting. Perfect for documentation-style responses.',
      },
    },
  },
}

/**
 * Long-form response demonstrating sustained streaming.
 */
export const LongResponse: Story = {
  args: {
    showHeader: true,
    sessionTitle: 'In-Depth Analysis',
    sessionSubtitle: 'Detailed explanations',
  },
  parameters: {
    msw: {
      handlers: [createWordStreamHandler(RESPONSES.longResponse, 40)],
    },
    docs: {
      description: {
        story:
          'ClarityChat handles long responses gracefully with smooth scrolling and ' +
          'sustained streaming. The message list auto-scrolls as content arrives.',
      },
    },
  },
}

/**
 * Simulates a slow network connection.
 */
export const SlowConnection: Story = {
  args: {
    showHeader: true,
    sessionTitle: 'Slow Connection Demo',
    sessionSubtitle: '2G network simulation',
    showNetworkStatus: true,
  },
  parameters: {
    msw: {
      handlers: [
        createSlowConnectionHandler(
          'This response is being delivered over a simulated slow connection. ' +
            'Notice how the network status indicator shows the connection state, ' +
            'and how the UI remains responsive despite the slow delivery.'
        ),
      ],
    },
    docs: {
      description: {
        story:
          'Demonstrates how ClarityChat behaves on slow connections. ' +
          'The network status indicator shows connection state.',
      },
    },
  },
}

/**
 * Server error state (500).
 */
export const ServerError: Story = {
  args: {
    showHeader: true,
    sessionTitle: 'Error Handling',
    sessionSubtitle: 'Server Error Demo',
  },
  parameters: {
    msw: {
      handlers: [createErrorHandlers.serverError()],
    },
    docs: {
      description: {
        story:
          'When a server error occurs, ClarityChat displays an error message ' +
          'and allows the user to retry. The onError callback is triggered.',
      },
    },
  },
}

/**
 * Rate limiting error (429).
 */
export const RateLimited: Story = {
  args: {
    showHeader: true,
    sessionTitle: 'Rate Limiting',
    sessionSubtitle: 'Too many requests',
  },
  parameters: {
    msw: {
      handlers: [createErrorHandlers.rateLimited()],
    },
    docs: {
      description: {
        story:
          'When rate limited, the API returns a 429 status. ' +
          'ClarityChat can display appropriate messaging and retry information.',
      },
    },
  },
}

/**
 * Authentication error (401).
 */
export const Unauthorized: Story = {
  args: {
    showHeader: true,
    sessionTitle: 'Auth Error',
    sessionSubtitle: 'Invalid credentials',
  },
  parameters: {
    msw: {
      handlers: [createErrorHandlers.unauthorized()],
    },
    docs: {
      description: {
        story:
          'Authentication errors are handled gracefully with clear messaging ' +
          'about what went wrong and how to fix it.',
      },
    },
  },
}

/**
 * Network error (connection failed).
 */
export const NetworkError: Story = {
  args: {
    showHeader: true,
    sessionTitle: 'Network Error',
    sessionSubtitle: 'Connection failed',
    showNetworkStatus: true,
  },
  parameters: {
    msw: {
      handlers: [createErrorHandlers.networkError()],
    },
    docs: {
      description: {
        story:
          'When the network connection fails entirely, ClarityChat shows ' +
          'an offline indicator and allows retry when connection is restored.',
      },
    },
  },
}

/**
 * Loading state with infinite delay to show thinking indicator.
 */
export const LoadingState: Story = {
  parameters: {
    msw: {
      handlers: [createErrorHandlers.timeout()],
    },
    docs: {
      description: {
        story:
          'When waiting for a response, a thinking indicator is displayed. ' +
          'This provides visual feedback that the AI is processing the request.',
      },
    },
  },
}

/**
 * Mobile viewport demonstration.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    msw: {
      handlers: [createRealisticStreamHandler(RESPONSES.greeting)],
    },
    docs: {
      description: {
        story:
          'ClarityChat is fully responsive. On mobile, the input stays fixed ' +
          'at the bottom for easy thumb access.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-full">
        <Story />
      </div>
    ),
  ],
}

/**
 * Tablet viewport demonstration.
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    msw: {
      handlers: [createRealisticStreamHandler(RESPONSES.greeting)],
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-full">
        <Story />
      </div>
    ),
  ],
}

/**
 * Full-featured example with all options enabled.
 */
export const FullFeatured: Story = {
  args: {
    showHeader: true,
    sessionTitle: 'Full-Featured Chat',
    sessionSubtitle: 'All features enabled',
    showMessageCount: true,
    showTokenCounter: true,
    showNetworkStatus: true,
    memoryStrategy: 'sliding-window',
    onExport: action('export'),
    onClear: action('clear'),
  },
  parameters: {
    msw: {
      handlers: [
        createRealisticStreamHandler(
          'Welcome to the full-featured ClarityChat demo! This example showcases:\n\n' +
            '• **Header** with title, subtitle, and message count\n' +
            '• **Token counter** showing real-time usage\n' +
            '• **Network status** indicator\n' +
            '• **Memory** with sliding-window strategy\n' +
            '• **Export & Clear** action buttons\n\n' +
            'Try sending a message to see realistic streaming in action!'
        ),
      ],
    },
    docs: {
      description: {
        story:
          'This example shows ClarityChat with all available features enabled. ' +
          'Use this as a reference for the full capabilities of the component.',
      },
    },
  },
}

/**
 * Empty state before any messages.
 */
export const EmptyState: Story = {
  args: {
    showHeader: true,
    sessionTitle: 'New Conversation',
    sessionSubtitle: 'Start chatting',
  },
  parameters: {
    msw: {
      handlers: [createRealisticStreamHandler(RESPONSES.greeting)],
    },
    docs: {
      description: {
        story:
          'The initial empty state before any messages have been sent. ' +
          'Consider adding placeholder text or suggestions here.',
      },
    },
  },
}
