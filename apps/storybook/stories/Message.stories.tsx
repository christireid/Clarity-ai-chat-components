import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Message } from '../../../packages/react/src/components/message'
import type { Message as MessageType } from '../../../packages/types/src/message'

const meta: Meta<typeof Message> = {
  title: 'Components/Message',
  component: Message,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Enhanced message component with slide-in animations, hover actions, feedback buttons with confetti, streaming cursor pulse, and avatar bounce.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Message>

// ============================================================================
// Mock Data
// ============================================================================

const createUserMessage = (content: string, overrides?: Partial<MessageType>): MessageType => ({
  id: `msg-${Date.now()}`,
  role: 'user',
  content,
  createdAt: Date.now(),
  status: 'sent',
  ...overrides,
})

const createAssistantMessage = (content: string, overrides?: Partial<MessageType>): MessageType => ({
  id: `msg-${Date.now()}`,
  role: 'assistant',
  content,
  createdAt: Date.now(),
  status: 'sent',
  ...overrides,
})

// ============================================================================
// Basic Examples
// ============================================================================

export const UserMessage: Story = {
  render: () => (
    <Message
      message={createUserMessage('Hello! Can you help me with React animations?')}
    />
  ),
}

export const AssistantMessage: Story = {
  render: () => (
    <Message
      message={createAssistantMessage(
        'Of course! React animations can be achieved using libraries like **Framer Motion** or CSS transitions. What specific animation are you trying to create?'
      )}
      onFeedback={(type) => console.log('Feedback:', type)}
    />
  ),
}

export const StreamingMessage: Story = {
  render: () => {
    const [content, setContent] = React.useState('')
    const fullText = 'This is a streaming message that appears character by character...'

    React.useEffect(() => {
      let i = 0
      const interval = setInterval(() => {
        if (i < fullText.length) {
          setContent(fullText.slice(0, i + 1))
          i++
        } else {
          clearInterval(interval)
        }
      }, 50)
      return () => clearInterval(interval)
    }, [])

    return (
      <Message
        message={createAssistantMessage(content, { status: 'streaming' })}
      />
    )
  },
}

// ============================================================================
// Animation Showcase
// ============================================================================

export const SlideInAnimation: Story = {
  render: () => {
    const [messages, setMessages] = React.useState<MessageType[]>([])

    const addMessage = (role: 'user' | 'assistant') => {
      const content = role === 'user' 
        ? 'User message slides in from the right' 
        : 'Assistant message slides in from the left'
      
      const newMessage = role === 'user'
        ? createUserMessage(content)
        : createAssistantMessage(content)
      
      setMessages((prev) => [...prev, newMessage])
    }

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => addMessage('user')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add User Message
          </button>
          <button
            onClick={() => addMessage('assistant')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Assistant Message
          </button>
          <button
            onClick={() => setMessages([])}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Clear
          </button>
        </div>
        <div className="space-y-2">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
        </div>
      </div>
    )
  },
}

export const AvatarBounce: Story = {
  render: () => {
    const [show, setShow] = React.useState(false)

    return (
      <div className="space-y-4">
        <button
          onClick={() => {
            setShow(false)
            setTimeout(() => setShow(true), 100)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Show Avatar Bounce
        </button>
        {show && (
          <Message
            message={createAssistantMessage('Watch the avatar bounce!')}
            showAvatar={true}
          />
        )}
      </div>
    )
  },
}

export const ActionBarReveal: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Hover over the assistant message to see the action bar slide up from below
      </p>
      <Message
        message={createAssistantMessage(
          'Hover over me to reveal the action bar with smooth slide-up animation!'
        )}
        onFeedback={(type) => console.log('Feedback:', type)}
      />
    </div>
  ),
}

export const FeedbackWithConfetti: Story = {
  render: () => {
    const [key, setKey] = React.useState(0)

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Click the thumbs up button to see the confetti effect! 🎉
        </p>
        <button
          onClick={() => setKey((k) => k + 1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Reset Message
        </button>
        <Message
          key={key}
          message={createAssistantMessage(
            'Great question! Click the thumbs up to see the confetti animation.'
          )}
          onFeedback={(type) => console.log('Feedback:', type)}
        />
      </div>
    )
  },
}

export const StreamingCursor: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Watch the streaming cursor pulse smoothly
      </p>
      <Message
        message={createAssistantMessage('This message is streaming', {
          status: 'streaming',
        })}
      />
    </div>
  ),
}

// ============================================================================
// Content Variations
// ============================================================================

export const WithMarkdown: Story = {
  render: () => (
    <Message
      message={createAssistantMessage(`
Here's how to use **Framer Motion**:

1. Install the package: \`npm install framer-motion\`
2. Import motion: \`import { motion } from 'framer-motion'\`
3. Use motion components: \`<motion.div animate={{ x: 100 }} />\`

## Key Concepts

- **Variants**: Define animation states
- **Transitions**: Control timing
- **Gestures**: Handle interactions

### Example Code

\`\`\`jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Hello World
</motion.div>
\`\`\`

Pretty cool, right?
      `)}
      onFeedback={(type) => console.log('Feedback:', type)}
    />
  ),
}

export const WithCodeBlock: Story = {
  render: () => (
    <Message
      message={createAssistantMessage(`
Here's a React component example:

\`\`\`tsx
import React from 'react'
import { motion } from 'framer-motion'

export const AnimatedButton = () => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Click me!
    </motion.button>
  )
}
\`\`\`

Hover over the code block to see the copy button!
      `)}
      onFeedback={(type) => console.log('Feedback:', type)}
    />
  ),
}

export const WithAttachments: Story = {
  render: () => (
    <Message
      message={createUserMessage('Here are the files you requested:', {
        attachments: [
          { id: '1', name: 'document.pdf', type: 'application/pdf', size: 1024000, url: '#' },
          { id: '2', name: 'image.png', type: 'image/png', size: 512000, url: '#' },
          { id: '3', name: 'data.json', type: 'application/json', size: 2048, url: '#' },
        ],
      })}
    />
  ),
}

// ============================================================================
// Status States
// ============================================================================

export const SendingStatus: Story = {
  render: () => (
    <Message
      message={createUserMessage('This message is being sent...', {
        status: 'sending',
      })}
    />
  ),
}

export const ErrorStatus: Story = {
  render: () => (
    <Message
      message={createAssistantMessage('Failed to generate response', {
        status: 'error',
      })}
      onRetry={() => alert('Retrying...')}
    />
  ),
}

export const WithMetadata: Story = {
  render: () => (
    <Message
      message={createAssistantMessage('Response with metadata', {
        metadata: {
          tokens: 156,
          processingTime: 1250,
          model: 'gpt-4',
        },
      })}
      onFeedback={(type) => console.log('Feedback:', type)}
    />
  ),
}

// ============================================================================
// Real-World Conversation
// ============================================================================

export const Conversation: Story = {
  render: () => {
    const messages: MessageType[] = [
      createUserMessage('What is React?'),
      createAssistantMessage(
        'React is a JavaScript library for building user interfaces. It allows you to create reusable UI components and manage application state efficiently.'
      ),
      createUserMessage('Can you show me an example?'),
      createAssistantMessage(`
Sure! Here's a simple React component:

\`\`\`jsx
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>
}

// Usage
<Welcome name="World" />
\`\`\`

This component accepts a \`name\` prop and renders a greeting.
      `),
      createUserMessage('Thanks! That's helpful.'),
      createAssistantMessage(
        'You're welcome! Feel free to ask if you have more questions about React.'
      ),
    ]

    return (
      <div className="space-y-4 max-w-3xl">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            message={msg}
            onFeedback={(type) => console.log(`Feedback for ${msg.id}:`, type)}
          />
        ))}
      </div>
    )
  },
}

// ============================================================================
// Interactive Demo
// ============================================================================

export const InteractiveDemo: Story = {
  render: () => {
    const [messages, setMessages] = React.useState<MessageType[]>([
      createAssistantMessage('Hello! I'm your AI assistant. How can I help you today?'),
    ])
    const [input, setInput] = React.useState('')

    const sendMessage = () => {
      if (!input.trim()) return

      // Add user message
      const userMsg = createUserMessage(input)
      setMessages((prev) => [...prev, userMsg])
      setInput('')

      // Simulate AI response
      setTimeout(() => {
        const responses = [
          'That's a great question! Let me help you with that.',
          'I understand what you're asking. Here's what I think...',
          'Interesting! Here's my perspective on this topic.',
          'Let me break that down for you step by step.',
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        const aiMsg = createAssistantMessage(randomResponse)
        setMessages((prev) => [...prev, aiMsg])
      }, 1000)
    }

    return (
      <div className="space-y-4 max-w-3xl">
        <div className="h-[500px] overflow-y-auto border rounded-lg p-4 space-y-4">
          {messages.map((msg) => (
            <Message
              key={msg.id}
              message={msg}
              onFeedback={(type) => console.log(`Feedback for ${msg.id}:`, type)}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    )
  },
}
