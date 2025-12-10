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

/**
 * Mock handlers for MSW - Simulates streaming AI responses
 */
const createMockHandlers = (
  responseText: string = "Hello! I'm an AI assistant powered by Clarity Chat. How can I help you today?"
) => [
  http.post('/api/chat', async () => {
    await delay(300)

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const words = responseText.split(' ')

        for (const word of words) {
          await delay(50)
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
      headers: {
        'Content-Type': 'text/event-stream',
      },
    })
  }),
]

/**
 * The default ClarityChat configuration. Just provide an API endpoint
 * and you have a fully functional AI chat interface.
 */
export const Default: Story = {
  parameters: {
    msw: { handlers: createMockHandlers() },
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
    msw: { handlers: createMockHandlers() },
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
    onExport: action('action'),
    onClear: action('action'),
  },
  parameters: {
    msw: { handlers: createMockHandlers() },
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
    msw: { handlers: createMockHandlers() },
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
 * The conversation context is maintained using the sliding-window strategy.
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
      handlers: createMockHandlers(
        "I'll remember our conversation! I'm using a sliding-window memory strategy to maintain context across multiple turns."
      ),
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
 * Loading state demonstration - shows the thinking indicator.
 */
export const LoadingState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('/api/chat', async () => {
          await delay(60000) // Very long delay to show loading state
          return new HttpResponse(null, { status: 200 })
        }),
      ],
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
 * Error state when the API fails.
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('/api/chat', () => {
          return new HttpResponse(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500 }
          )
        }),
      ],
    },
    docs: {
      description: {
        story:
          'When an API error occurs, the error is passed to the onError callback. ' +
          'You can use this to display error messages to the user.',
      },
    },
  },
}

/**
 * Mobile viewport demonstration showing responsive design.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    msw: { handlers: createMockHandlers() },
    docs: {
      description: {
        story:
          'ClarityChat is fully responsive and adapts to mobile viewports. ' +
          'The input area stays fixed at the bottom for easy thumb access.',
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
    msw: { handlers: createMockHandlers() },
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
    onExport: action('action'),
    onClear: action('action'),
  },
  parameters: {
    msw: {
      handlers: createMockHandlers(
        'This is a full-featured chat with all options enabled: header, memory, token counting, network status, and action buttons.'
      ),
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
 * Code assistant example with markdown rendering.
 */
export const CodeAssistant: Story = {
  args: {
    showHeader: true,
    sessionTitle: 'Code Assistant',
    sessionSubtitle: 'Ask me about code',
  },
  parameters: {
    msw: {
      handlers: createMockHandlers(
        "Here's an example of a React hook:\n\n```tsx\nfunction useCounter(initial = 0) {\n  const [count, setCount] = useState(initial)\n  const increment = () => setCount(c => c + 1)\n  const decrement = () => setCount(c => c - 1)\n  return { count, increment, decrement }\n}\n```\n\nThis hook provides a simple counter with increment and decrement functions."
      ),
    },
    docs: {
      description: {
        story:
          'ClarityChat supports markdown rendering, including code blocks with syntax highlighting. ' +
          'Perfect for code assistant applications.',
      },
    },
  },
}
