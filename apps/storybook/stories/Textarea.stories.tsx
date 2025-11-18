import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from '@clarity-chat/primitives'
import { useState } from 'react'
import { expect, userEvent, within } from '@storybook/test'

/**
 * Textarea component for multi-line text input.
 * 
 * **Key Features:**
 * - Auto-resizing capability
 * - Character count
 * - Disabled and readonly states
 * - Validation support
 * 
 * **Use Cases:**
 * - Message composition
 * - Comments and feedback
 * - Long-form content
 * - Notes and descriptions
 */
const meta = {
  title: 'Primitives/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Multi-line text input component for longer content.',
      },
    },
    status: {
      type: 'stable',
    },
    badges: ['stable', 'tested', 'accessible'],
  },
  tags: ['autodocs', 'stable'],
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Type your message...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test textarea renders
    const textarea = canvas.getByPlaceholderText('Type your message...')
    await expect(textarea).toBeInTheDocument()
    await expect(textarea).not.toBeDisabled()

    // Test typing into textarea
    await userEvent.type(textarea, 'This is a test message\nwith multiple lines')
    await expect(textarea).toHaveValue('This is a test message\nwith multiple lines')
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label className="text-sm font-medium">Message</label>
      <Textarea placeholder="Type your message here..." />
    </div>
  ),
}

export const WithRows: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Small (3 rows)</label>
        <Textarea rows={3} placeholder="Smaller textarea..." />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Default (4 rows)</label>
        <Textarea rows={4} placeholder="Default textarea..." />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Large (8 rows)</label>
        <Textarea rows={8} placeholder="Larger textarea..." />
      </div>
    </div>
  ),
}

export const WithCharacterCount: Story = {
  render: () => {
    const [text, setText] = useState('')
    const maxLength = 200
    
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe your issue..."
          maxLength={maxLength}
        />
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            {text.length}/{maxLength} characters
          </span>
          {text.length > maxLength * 0.9 && (
            <span className="text-orange-500">
              {maxLength - text.length} remaining
            </span>
          )}
        </div>
      </div>
    )
  },
}

export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Default</label>
        <Textarea placeholder="Default state" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Disabled</label>
        <Textarea placeholder="Disabled state" disabled />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Readonly</label>
        <Textarea value="This is read-only content that cannot be edited." readOnly />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test default state
    const defaultTextarea = canvas.getByPlaceholderText('Default state')
    await expect(defaultTextarea).toBeInTheDocument()
    await expect(defaultTextarea).not.toBeDisabled()

    // Test disabled state
    const disabledTextarea = canvas.getByPlaceholderText('Disabled state')
    await expect(disabledTextarea).toBeDisabled()

    // Test readonly state
    const readonlyTextarea = canvas.getByDisplayValue('This is read-only content that cannot be edited.')
    await expect(readonlyTextarea).toHaveAttribute('readonly')
  },
}

export const WithValidation: Story = {
  render: () => {
    const [feedback, setFeedback] = useState('')
    const [error, setError] = useState('')
    const minLength = 10
    
    const validate = (value: string) => {
      if (!value) {
        setError('Feedback is required')
      } else if (value.length < minLength) {
        setError(`Please enter at least ${minLength} characters`)
      } else {
        setError('')
      }
    }
    
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Feedback</label>
        <Textarea
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value)
            validate(e.target.value)
          }}
          onBlur={() => validate(feedback)}
          placeholder="Tell us what you think..."
          className={error ? 'border-red-500' : ''}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {feedback && !error && (
          <p className="text-sm text-green-500">✓ Thank you for your feedback!</p>
        )}
      </div>
    )
  },
}

export const CommentBox: Story = {
  render: () => {
    const [comment, setComment] = useState('')
    
    return (
      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Add a comment</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {comment.length} characters
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setComment('')}
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              disabled={!comment.trim()}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>
    )
  },
}

export const MessageComposer: Story = {
  render: () => {
    const [message, setMessage] = useState('')
    
    const handleSend = () => {
      if (message.trim()) {
        alert(`Message sent: ${message}`)
        setMessage('')
      }
    }
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        handleSend()
      }
    }
    
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-3 py-2 border-b flex items-center gap-2">
          <button className="p-1 hover:bg-gray-200 rounded">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-200 rounded">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-200 rounded">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
        </div>
        
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Cmd/Ctrl+Enter to send)"
          className="border-0 focus:ring-0 resize-none"
          rows={5}
        />
        
        <div className="bg-gray-50 px-3 py-2 border-t flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Cmd/Ctrl + Enter to send
          </span>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>Send</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    )
  },
}

export const AutoGrowing: Story = {
  render: () => {
    const [text, setText] = useState('')
    
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Auto-growing Textarea</label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="This textarea would auto-grow with content..."
          className="resize-none"
          style={{
            minHeight: '80px',
            height: 'auto',
          }}
        />
        <p className="text-xs text-gray-500">
          Tip: In production, use a library like react-textarea-autosize for true auto-growing behavior
        </p>
      </div>
    )
  },
}
