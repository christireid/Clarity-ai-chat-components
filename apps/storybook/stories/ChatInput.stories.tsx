import type { Meta, StoryObj } from '@storybook/react'
import { ChatInput } from '@clarity-chat/react'
import { useState } from 'react'

/**
 * Enhanced ChatInput component with delightful microanimations and state management.
 * 
 * **Key Features:**
 * - Smooth expand/contract animation as user types
 * - Character counter with color-coded feedback (blue → yellow → red)
 * - Progress bar showing character limit visually
 * - Glowing focus ring with pulse animation
 * - Send button state transitions (idle → loading → success → error)
 * - Auto-resize textarea up to 6 lines
 * - Error shake animation when over limit
 * - Helpful keyboard hints on focus
 * - Accessible with ARIA labels
 * 
 * **Design Philosophy:**
 * - Delightful by Default: Every interaction provides clear feedback
 * - Progressive Disclosure: Advanced features appear contextually
 * - Forgiving UX: Clear warnings before errors, shake on invalid submit
 * - Accessible First: Keyboard shortcuts, screen reader support
 */
const meta = {
  title: 'Components/ChatInput',
  component: ChatInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A delightful chat input component with smooth animations, character counting, and comprehensive state management.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    maxLength: {
      control: { type: 'number', min: 10, max: 2000, step: 10 },
      description: 'Maximum character length',
    },
    showCharCounter: {
      control: 'boolean',
      description: 'Show character counter and progress bar',
    },
    warningThreshold: {
      control: { type: 'number', min: 0, max: 1, step: 0.05 },
      description: 'Warning threshold (0-1) for character counter color change',
    },
    animateHeight: {
      control: 'boolean',
      description: 'Enable smooth height animation',
    },
    glowOnFocus: {
      control: 'boolean',
      description: 'Enable focus ring glow animation',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable input',
    },
  },
} satisfies Meta<typeof ChatInput>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    
    return (
      <div className="max-w-2xl">
        <ChatInput
          value={value}
          onChange={setValue}
          onSubmit={(val) => {
            console.log('Submitted:', val)
            setValue('')
          }}
        />
      </div>
    )
  },
}

export const WithCharacterLimit: Story = {
  render: () => {
    const [value, setValue] = useState('')
    
    return (
      <div className="max-w-2xl">
        <ChatInput
          value={value}
          onChange={setValue}
          onSubmit={(val) => {
            console.log('Submitted:', val)
            setValue('')
          }}
          maxLength={200}
        />
        <p className="mt-2 text-sm text-gray-600">
          Try typing to see the character counter and progress bar
        </p>
      </div>
    )
  },
}

export const CustomPlaceholder: Story = {
  render: () => {
    const [value, setValue] = useState('')
    
    return (
      <div className="max-w-2xl">
        <ChatInput
          value={value}
          onChange={setValue}
          onSubmit={(val) => {
            console.log('Submitted:', val)
            setValue('')
          }}
          placeholder="Ask me anything..."
        />
      </div>
    )
  },
}

// ============================================================================
// Character Counter Variations
// ============================================================================

export const CharacterCounterStates: Story = {
  render: () => {
    const [value1, setValue1] = useState('This is a short message')
    const [value2, setValue2] = useState('This message is getting close to the limit and will show warning colors soon')
    const [value3, setValue3] = useState('This message is way too long and exceeds the maximum character limit! You cannot send this message until you shorten it.')
    
    return (
      <div className="flex flex-col gap-6 max-w-2xl">
        <div>
          <h3 className="text-sm font-medium mb-2">Normal (Blue)</h3>
          <ChatInput
            value={value1}
            onChange={setValue1}
            onSubmit={(val) => {
              console.log('Submitted:', val)
              setValue1('')
            }}
            maxLength={100}
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Warning (Yellow) - 80% of limit</h3>
          <ChatInput
            value={value2}
            onChange={setValue2}
            onSubmit={(val) => {
              console.log('Submitted:', val)
              setValue2('')
            }}
            maxLength={100}
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Error (Red) - Over limit</h3>
          <ChatInput
            value={value3}
            onChange={setValue3}
            onSubmit={(val) => {
              console.log('Submitted:', val)
              setValue3('')
            }}
            maxLength={100}
          />
          <p className="mt-2 text-sm text-gray-600">
            Try pressing Enter to see the shake animation
          </p>
        </div>
      </div>
    )
  },
}

export const CustomWarningThreshold: Story = {
  render: () => {
    const [value, setValue] = useState('Testing custom warning threshold')
    
    return (
      <div className="max-w-2xl">
        <ChatInput
          value={value}
          onChange={setValue}
          onSubmit={(val) => {
            console.log('Submitted:', val)
            setValue('')
          }}
          maxLength={100}
          warningThreshold={0.5} // Warning at 50% instead of 80%
        />
        <p className="mt-2 text-sm text-gray-600">
          Warning shows at 50% (50 characters) instead of 80%
        </p>
      </div>
    )
  },
}

export const NoCharacterCounter: Story = {
  render: () => {
    const [value, setValue] = useState('')
    
    return (
      <div className="max-w-2xl">
        <ChatInput
          value={value}
          onChange={setValue}
          onSubmit={(val) => {
            console.log('Submitted:', val)
            setValue('')
          }}
          maxLength={200}
          showCharCounter={false}
        />
        <p className="mt-2 text-sm text-gray-600">
          Character limit enforced but counter hidden
        </p>
      </div>
    )
  },
}

// ============================================================================
// Send Button States
// ============================================================================

export const SendButtonStates: Story = {
  render: () => {
    const [value, setValue] = useState('Test message')
    const [delay, setDelay] = useState(2000)
    const [shouldFail, setShouldFail] = useState(false)
    
    const handleSubmit = async (val: string) => {
      console.log('Submitting:', val)
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (shouldFail) {
            reject(new Error('Simulated error'))
          } else {
            resolve(val)
          }
        }, delay)
      })
      if (!shouldFail) {
        setValue('')
      }
    }
    
    return (
      <div className="flex flex-col gap-4 max-w-2xl">
        <ChatInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
        />
        
        <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Delay (ms)</label>
            <input
              type="range"
              min="500"
              max="5000"
              step="500"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-xs text-gray-600">{delay}ms</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm">
              <input
                type="checkbox"
                checked={shouldFail}
                onChange={(e) => setShouldFail(e.target.checked)}
                className="mr-2"
              />
              Simulate error
            </label>
          </div>
        </div>
        
        <p className="text-sm text-gray-600">
          Watch the send button transition through states: idle → loading → {shouldFail ? 'error' : 'success'}
        </p>
      </div>
    )
  },
}

// ============================================================================
// Focus & Animation Features
// ============================================================================

export const FocusGlowAnimation: Story = {
  render: () => {
    const [value, setValue] = useState('')
    
    return (
      <div className="flex flex-col gap-6 max-w-2xl">
        <div>
          <h3 className="text-sm font-medium mb-2">With focus glow (default)</h3>
          <ChatInput
            value={value}
            onChange={setValue}
            onSubmit={(val) => {
              console.log('Submitted:', val)
              setValue('')
            }}
            glowOnFocus={true}
          />
          <p className="text-sm text-gray-600 mt-2">
            Click inside to see the glowing focus ring animation
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Without focus glow</h3>
          <ChatInput
            value={value}
            onChange={setValue}
            onSubmit={(val) => {
              console.log('Submitted:', val)
              setValue('')
            }}
            glowOnFocus={false}
          />
        </div>
      </div>
    )
  },
}

export const HeightAnimation: Story = {
  render: () => {
    const [value, setValue] = useState('')
    
    return (
      <div className="flex flex-col gap-6 max-w-2xl">
        <div>
          <h3 className="text-sm font-medium mb-2">With height animation (default)</h3>
          <ChatInput
            value={value}
            onChange={setValue}
            onSubmit={(val) => {
              console.log('Submitted:', val)
              setValue('')
            }}
            animateHeight={true}
          />
          <p className="text-sm text-gray-600 mt-2">
            Type multiple lines (Shift + Enter) to see smooth expansion
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Without height animation</h3>
          <ChatInput
            value={value}
            onChange={setValue}
            onSubmit={(val) => {
              console.log('Submitted:', val)
              setValue('')
            }}
            animateHeight={false}
          />
        </div>
      </div>
    )
  },
}

// ============================================================================
// Real-World Use Cases
// ============================================================================

export const ChatConversation: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [messages, setMessages] = useState([
      { id: 1, text: 'Hello! How can I help you today?', isUser: false },
      { id: 2, text: 'I have a question about your product', isUser: true },
    ])
    
    const handleSubmit = async (val: string) => {
      // Add user message
      const userMsg = { id: Date.now(), text: val, isUser: true }
      setMessages((prev) => [...prev, userMsg])
      setValue('')
      
      // Simulate AI response
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const aiMsg = {
        id: Date.now() + 1,
        text: `You said: "${val}". This is a simulated response.`,
        isUser: false,
      }
      setMessages((prev) => [...prev, aiMsg])
    }
    
    return (
      <div className="flex flex-col h-[500px] border rounded-lg max-w-2xl">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  msg.isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        
        <ChatInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          maxLength={500}
        />
      </div>
    )
  },
}

export const SupportTicket: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [submitted, setSubmitted] = useState(false)
    
    const handleSubmit = async (val: string) => {
      console.log('Ticket submitted:', val)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setValue('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    }
    
    return (
      <div className="flex flex-col gap-4 max-w-2xl p-6 border rounded-lg">
        <h2 className="text-lg font-semibold">Submit a Support Ticket</h2>
        <p className="text-sm text-gray-600">
          Describe your issue in detail. We'll get back to you within 24 hours.
        </p>
        
        <ChatInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder="Describe your issue..."
          maxLength={1000}
        />
        
        {submitted && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-200">
            ✓ Your ticket has been submitted successfully!
          </div>
        )}
      </div>
    )
  },
}

export const CommentSystem: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [comments, setComments] = useState([
      { id: 1, author: 'Alice', text: 'Great article!', time: '2h ago' },
      { id: 2, author: 'Bob', text: 'Very informative, thanks for sharing.', time: '1h ago' },
    ])
    
    const handleSubmit = async (val: string) => {
      const newComment = {
        id: Date.now(),
        author: 'You',
        text: val,
        time: 'Just now',
      }
      setComments((prev) => [...prev, newComment])
      setValue('')
    }
    
    return (
      <div className="flex flex-col gap-4 max-w-2xl">
        <div className="space-y-4">
          <h3 className="font-semibold">Comments ({comments.length})</h3>
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                <div>
                  <p className="font-medium text-sm">{comment.author}</p>
                  <p className="text-xs text-gray-600">{comment.time}</p>
                </div>
              </div>
              <p className="text-sm">{comment.text}</p>
            </div>
          ))}
        </div>
        
        <ChatInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder="Add a comment..."
          maxLength={500}
        />
      </div>
    )
  },
}

// ============================================================================
// Edge Cases & States
// ============================================================================

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = useState('This input is disabled')
    
    return (
      <div className="max-w-2xl">
        <ChatInput
          value={value}
          onChange={setValue}
          onSubmit={(val) => console.log('Submitted:', val)}
          disabled={true}
        />
      </div>
    )
  },
}

export const LongContent: Story = {
  render: () => {
    const [value, setValue] = useState(
      'This is a very long message that spans multiple lines.\n\nIt demonstrates how the textarea automatically expands as you type more content.\n\nThe component handles this gracefully with smooth animations.\n\nYou can add even more lines (up to 6) and it will keep expanding!'
    )
    
    return (
      <div className="max-w-2xl">
        <ChatInput
          value={value}
          onChange={setValue}
          onSubmit={(val) => {
            console.log('Submitted:', val)
            setValue('')
          }}
        />
        <p className="mt-2 text-sm text-gray-600">
          The textarea auto-expands up to 6 lines, then becomes scrollable
        </p>
      </div>
    )
  },
}

export const VeryShortLimit: Story = {
  render: () => {
    const [value, setValue] = useState('Hi!')
    
    return (
      <div className="max-w-2xl">
        <ChatInput
          value={value}
          onChange={setValue}
          onSubmit={(val) => {
            console.log('Submitted:', val)
            setValue('')
          }}
          maxLength={50}
          warningThreshold={0.6}
        />
        <p className="mt-2 text-sm text-gray-600">
          Short limit (50 chars) demonstrates quick color transitions
        </p>
      </div>
    )
  },
}

// ============================================================================
// Accessibility
// ============================================================================

export const Accessibility: Story = {
  render: () => {
    const [value, setValue] = useState('')
    
    return (
      <div className="flex flex-col gap-4 max-w-2xl">
        <ChatInput
          value={value}
          onChange={setValue}
          onSubmit={(val) => {
            console.log('Submitted:', val)
            setValue('')
          }}
          maxLength={200}
        />
        
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm space-y-2">
          <strong>Accessibility Features:</strong>
          <ul className="list-disc list-inside space-y-1">
            <li>Keyboard shortcuts visible on focus</li>
            <li>Send button has descriptive ARIA labels for all states</li>
            <li>Character counter is announced to screen readers</li>
            <li>Error messages clearly visible and announced</li>
            <li>Focus ring clearly visible for keyboard navigation</li>
            <li>Color-independent feedback (progress bar + text)</li>
            <li>Shake animation provides tactile feedback</li>
          </ul>
        </div>
      </div>
    )
  },
}

// ============================================================================
// Playground
// ============================================================================

export const Playground: Story = {
  args: {
    placeholder: 'Type a message...',
    maxLength: 200,
    showCharCounter: true,
    warningThreshold: 0.8,
    animateHeight: true,
    glowOnFocus: true,
    disabled: false,
  },
  render: (args) => {
    const [value, setValue] = useState('')
    
    return (
      <div className="max-w-2xl">
        <ChatInput
          {...args}
          value={value}
          onChange={setValue}
          onSubmit={(val) => {
            console.log('Submitted:', val)
            setValue('')
          }}
        />
        <p className="mt-4 text-sm text-gray-600">
          Adjust the controls to experiment with different settings
        </p>
      </div>
    )
  },
}
