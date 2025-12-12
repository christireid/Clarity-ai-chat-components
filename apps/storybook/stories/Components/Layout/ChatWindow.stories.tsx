import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { useState } from 'react'

/**
 * **ChatWindow Component**
 * 
 * Complete chat window component that orchestrates MessageList and ChatInput
 * to provide a full-featured chat interface.
 * 
 * **Key Features:**
 * - Message display and management
 * - Input handling with send functionality
 * - Loading states
 * - Empty state handling
 * - Auto-scroll to latest message
 * - Keyboard shortcuts (Enter to send, Shift+Enter for new line)
 * 
 * **Use Cases:**
 * - AI chat interfaces
 * - Customer support
 * - Messaging applications
 * - Conversational UIs
 */
const meta: Meta<typeof ChatWindow> = {
  title: 'Components/Layout/ChatWindow',
  component: ChatWindow,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Complete chat window component that orchestrates MessageList and ChatInput
to provide a full-featured chat interface.

## Features

- ✅ Message display and management
- ✅ Input handling with send functionality
- ✅ Loading states
- ✅ Empty state handling
- ✅ Auto-scroll to latest message
- ✅ Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- ✅ Accessible with proper ARIA attributes

## Basic Usage

\`\`\`tsx
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={(content) => {
    // Handle message sending
  }}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    messages: {
      description: 'Array of messages to display',
      control: { type: 'object' },
    },
    isLoading: {
      description: 'Whether a message is currently being processed',
      control: { type: 'boolean' },
    },
    onSendMessage: {
      description: 'Callback function called when a message is sent',
      action: 'message-sent',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', height: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ChatWindow>

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello! Can you help me with React?',
    timestamp: Date.now() - 60000,
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Of course! I\'d be happy to help you with React. What specific topic would you like to discuss?',
    timestamp: Date.now() - 30000,
  },
  {
    id: '3',
    role: 'user',
    content: 'How do I use hooks?',
    timestamp: Date.now() - 10000,
  },
]

export const Default: Story = {
  args: {
    messages: mockMessages,
    isLoading: false,
    onSendMessage: (content: string) => {
      console.log('Message sent:', content)
    },
  },
}

export const Loading: Story = {
  args: {
    messages: mockMessages,
    isLoading: true,
    onSendMessage: (content: string) => {
      console.log('Message sent:', content)
    },
  },
}

export const EmptyChat: Story = {
  args: {
    messages: [],
    isLoading: false,
    onSendMessage: (content: string) => {
      console.log('Message sent:', content)
    },
  },
}

export const LongConversation: Story = {
  args: {
    messages: [
      ...mockMessages,
      {
        id: '4',
        role: 'assistant',
        content: `Hooks are functions that let you "hook into" React state and lifecycle features from function components. Here are the main hooks:

1. **useState** - Manages component state
2. **useEffect** - Handles side effects
3. **useContext** - Accesses context values
4. **useReducer** - Complex state management
5. **useMemo** - Memoizes expensive calculations
6. **useCallback** - Memoizes callback functions`,
        timestamp: Date.now() - 5000,
      },
      {
        id: '5',
        role: 'user',
        content: 'Can you show me an example of useState?',
        timestamp: Date.now() - 2000,
      },
    ],
    isLoading: false,
    onSendMessage: (content: string) => {
      console.log('Message sent:', content)
    },
  },
}

const InteractiveTemplate = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    
    setMessages([...messages, newMessage])
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `You said: "${content}". This is a demo response from the AI assistant.`,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 2000)
  }

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
    />
  )
}

export const Interactive: Story = {
  render: () => <InteractiveTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing real message sending and receiving. Try sending a message!',
      },
    },
  },
}

export const WithError: Story = {
  args: {
    messages: mockMessages,
    isLoading: false,
    error: 'Failed to send message. Please try again.',
    onSendMessage: (content: string) => {
      console.log('Message sent:', content)
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'ChatWindow with error state displayed. Errors are shown prominently to users.',
      },
    },
  },
}

export const Streaming: Story = {
  args: {
    messages: [
      ...mockMessages,
      {
        id: 'streaming',
        role: 'assistant',
        content: 'This is a streaming message that appears word by word...',
        timestamp: Date.now(),
        isStreaming: true,
      },
    ],
    isLoading: true,
    onSendMessage: (content: string) => {
      console.log('Message sent:', content)
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'ChatWindow showing a streaming message. Messages appear in real-time as the AI generates them.',
      },
    },
  },
}

// ============================================================================
// Advanced State Stories
// ============================================================================

/**
 * Realistic streaming demo with actual word-by-word animation
 */
const StreamingAnimationTemplate = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'user',
      content: 'Explain React hooks in simple terms.',
      timestamp: Date.now() - 5000,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Simulate streaming response
    const fullResponse = `React hooks are special functions that let you use React features in functional components.

**useState** - Lets you add state to your component:
\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

**useEffect** - Runs side effects (like fetching data):
\`\`\`jsx
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

The key benefit is that hooks make your code simpler and more reusable!`

    const words = fullResponse.split(' ')
    let accumulated = ''

    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50))
      accumulated += (i === 0 ? '' : ' ') + words[i]
      setStreamingContent(accumulated)
    }

    // Finalize message
    setMessages(prev => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullResponse,
        timestamp: Date.now(),
      },
    ])
    setStreamingContent('')
    setIsLoading(false)
  }

  const displayMessages: Message[] = streamingContent
    ? [
        ...messages,
        {
          id: 'streaming',
          role: 'assistant',
          content: streamingContent,
          timestamp: Date.now(),
          isStreaming: true,
        },
      ]
    : messages

  return (
    <ChatWindow
      messages={displayMessages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
    />
  )
}

export const StreamingAnimation: Story = {
  render: () => <StreamingAnimationTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Realistic streaming demo showing word-by-word message generation. Try sending a message to see the streaming effect.',
      },
    },
  },
}

/**
 * Stop Generation Demo - Shows how to cancel an in-progress response
 */
const StopGenerationTemplate = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! Ask me anything and you can stop my response mid-generation.',
      timestamp: Date.now() - 5000,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [abortController, setAbortController] = useState<AbortController | null>(null)

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    const controller = new AbortController()
    setAbortController(controller)

    const longResponse = `Let me provide a comprehensive answer to your question about "${content}".

First, let's understand the context. This is a demonstration of how streaming responses work and how users can stop them mid-generation.

The key points to understand are:
1. Streaming allows real-time display of AI responses
2. Users can cancel at any time using the Stop button
3. Partial responses are preserved when stopped
4. This improves perceived performance significantly

Now, diving deeper into the technical implementation...
This text continues to demonstrate the streaming behavior.
Each word appears one at a time.
The user can click Stop at any point.
The response will be truncated at that point.
This is a much better UX than waiting for complete responses.`

    const words = longResponse.split(' ')
    let accumulated = ''

    try {
      for (let i = 0; i < words.length; i++) {
        if (controller.signal.aborted) {
          break
        }
        await new Promise(resolve => setTimeout(resolve, 80))
        accumulated += (i === 0 ? '' : ' ') + words[i]
        setStreamingContent(accumulated)
      }
    } catch {
      // Aborted
    }

    // Finalize with whatever content we have
    if (accumulated) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: accumulated + (controller.signal.aborted ? '\n\n*[Response stopped by user]*' : ''),
          timestamp: Date.now(),
        },
      ])
    }
    setStreamingContent('')
    setIsLoading(false)
    setAbortController(null)
  }

  const handleStop = () => {
    if (abortController) {
      abortController.abort()
    }
  }

  const displayMessages: Message[] = streamingContent
    ? [
        ...messages,
        {
          id: 'streaming',
          role: 'assistant',
          content: streamingContent,
          timestamp: Date.now(),
          isStreaming: true,
        },
      ]
    : messages

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {isLoading && (
        <div style={{
          padding: '8px 16px',
          background: '#fef3c7',
          borderBottom: '1px solid #fcd34d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '14px', color: '#92400e' }}>
            AI is generating response...
          </span>
          <button
            onClick={handleStop}
            style={{
              padding: '4px 12px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            Stop
          </button>
        </div>
      )}
      <div style={{ flex: 1 }}>
        <ChatWindow
          messages={displayMessages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  )
}

export const StopGeneration: Story = {
  render: () => <StopGenerationTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the Stop Generation feature. Send a message and click "Stop" to cancel the response mid-stream.',
      },
    },
  },
}

/**
 * Network Error and Retry Demo
 */
const NetworkErrorTemplate = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! This demo simulates network failures. Try sending a message.',
      timestamp: Date.now() - 5000,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [failedMessage, setFailedMessage] = useState<string | null>(null)
  const [simulateFailure, setSimulateFailure] = useState(true)

  const handleSendMessage = async (content: string) => {
    setError(null)
    setFailedMessage(null)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (simulateFailure) {
      setError('Network error: Unable to connect to AI service. Please check your connection and try again.')
      setFailedMessage(content)
      setIsLoading(false)
      // Remove the failed user message
      setMessages(prev => prev.filter(m => m.id !== userMessage.id))
      return
    }

    // Success response
    setMessages(prev => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Great! The network is working now. You said: "${content}"`,
        timestamp: Date.now(),
      },
    ])
    setIsLoading(false)
  }

  const handleRetry = () => {
    if (failedMessage) {
      setSimulateFailure(false) // Next attempt will succeed
      handleSendMessage(failedMessage)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {error && (
        <div style={{
          padding: '12px 16px',
          background: '#fef2f2',
          borderBottom: '1px solid #fecaca',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span style={{ fontSize: '14px', color: '#991b1b' }}>{error}</span>
          </div>
          <button
            onClick={handleRetry}
            style={{
              padding: '6px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            Retry
          </button>
        </div>
      )}
      <div style={{ flex: 1 }}>
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  )
}

export const NetworkError: Story = {
  render: () => <NetworkErrorTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates network error handling with retry functionality. The first message will fail, then clicking Retry will succeed.',
      },
    },
  },
}

/**
 * Mobile View Demo
 */
export const MobileView: Story = {
  args: {
    messages: mockMessages,
    isLoading: false,
    onSendMessage: (content: string) => {
      console.log('Message sent:', content)
    },
  },
  decorators: [
    (Story) => (
      <div style={{
        width: '375px',
        height: '667px',
        border: '8px solid #333',
        borderRadius: '32px',
        overflow: 'hidden',
        background: 'white',
      }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'ChatWindow displayed in a mobile phone frame (iPhone SE dimensions). Tests responsive behavior.',
      },
    },
  },
}

/**
 * With Custom Empty State
 */
export const CustomEmptyState: Story = {
  args: {
    messages: [],
    isLoading: false,
    onSendMessage: (content: string) => {
      console.log('Message sent:', content)
    },
    emptyState: (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '32px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
        <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 600 }}>
          Welcome to AI Assistant
        </h3>
        <p style={{ margin: '0 0 24px', color: '#6b7280', fontSize: '14px' }}>
          I can help you with coding, writing, analysis, and more.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '280px' }}>
          <button style={{
            padding: '10px 16px',
            background: '#f3f4f6',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            textAlign: 'left',
          }}>
            💡 Explain a concept
          </button>
          <button style={{
            padding: '10px 16px',
            background: '#f3f4f6',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            textAlign: 'left',
          }}>
            📝 Help me write something
          </button>
          <button style={{
            padding: '10px 16px',
            background: '#f3f4f6',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            textAlign: 'left',
          }}>
            🔧 Debug my code
          </button>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'ChatWindow with a custom empty state showing starter prompts. This provides a better onboarding experience.',
      },
    },
  },
}

/**
 * With Code Block in Message
 */
export const WithCodeBlock: Story = {
  args: {
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'Show me a React useState example',
        timestamp: Date.now() - 30000,
      },
      {
        id: '2',
        role: 'assistant',
        content: `Here's a complete example of useState with a counter:

\`\`\`tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
    </div>
  );
}

export default Counter;
\`\`\`

The \`useState\` hook returns an array with two elements:
1. The current state value (\`count\`)
2. A function to update it (\`setCount\`)

You can use multiple \`useState\` calls for different pieces of state.`,
        timestamp: Date.now() - 15000,
      },
    ],
    isLoading: false,
    onSendMessage: (content: string) => {
      console.log('Message sent:', content)
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'ChatWindow displaying a message with syntax-highlighted code block. Verify the copy button and highlighting work correctly.',
      },
    },
  },
}

/**
 * Message with Markdown Table
 */
export const WithMarkdownTable: Story = {
  args: {
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'Compare React hooks',
        timestamp: Date.now() - 30000,
      },
      {
        id: '2',
        role: 'assistant',
        content: `Here's a comparison of the most common React hooks:

| Hook | Purpose | Returns | Common Use Case |
|------|---------|---------|-----------------|
| useState | State management | [value, setter] | Form inputs, toggles |
| useEffect | Side effects | void | API calls, subscriptions |
| useContext | Access context | context value | Theme, auth state |
| useRef | Mutable reference | { current } | DOM access, timers |
| useMemo | Memoize values | memoized value | Expensive calculations |
| useCallback | Memoize functions | memoized fn | Event handlers |

**Tips:**
- Use \`useState\` for simple state
- Use \`useReducer\` for complex state logic
- Always include dependencies in \`useEffect\``,
        timestamp: Date.now() - 15000,
      },
    ],
    isLoading: false,
    onSendMessage: (content: string) => {
      console.log('Message sent:', content)
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'ChatWindow displaying a message with a Markdown table. Verify table renders correctly with proper alignment.',
      },
    },
  },
}
