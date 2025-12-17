import { SecureLogger } from '@/lib/security/secureLogger';
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatInput } from '@clarity-chat/react'
import { useState } from 'react'

const meta: Meta<typeof ChatInput> = {
  title: 'Components/ChatInput/Essentials',
  component: ChatInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The ChatInput component provides a complete input interface for chat applications.
This track shows the essential patterns you'll use in 90% of cases.

## When to Use ChatInput

- ✅ Custom chat layouts (not using ChatWindow)
- ✅ Need input with file upload
- ✅ Want keyboard shortcuts (Enter to send, Shift+Enter for new line)
- ✅ Need auto-resizing textarea

## When NOT to Use ChatInput

- ❌ Using ChatWindow (it includes ChatInput)
- ❌ Need highly custom input behavior
- ❌ Building non-chat interfaces

## Key Features

- **Auto-Resize** - Textarea grows with content
- **File Upload** - Drag & drop or click to upload
- **Keyboard Shortcuts** - Enter to send, Shift+Enter for new line
- **Disabled State** - Disable during loading
- **Accessibility** - WCAG AAA compliant
        `,
      },
    },
  },
  argTypes: {
    value: {
      description: 'Current input value',
      control: { type: 'text' },
    },
    onChange: {
      description: 'Callback when input value changes',
      action: 'changed',
    },
    onSubmit: {
      description: 'Callback when user submits (Enter key or Send button)',
      action: 'submitted',
    },
    placeholder: {
      description: 'Placeholder text',
      control: { type: 'text' },
      defaultValue: 'Type a message...',
    },
    disabled: {
      description: 'Disable input',
      control: { type: 'boolean' },
      defaultValue: false,
    },
    maxLength: {
      description: 'Maximum message length',
      control: { type: 'number' },
    },
    allowFileUpload: {
      description: 'Enable file upload',
      control: { type: 'boolean' },
      defaultValue: true,
    },
    onFileUpload: {
      description: 'Callback for file uploads',
      action: 'file-uploaded',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ChatInput>

export const BasicInput: Story = {
  render: () => {
    const [value, setValue] = useState('')
    
    return (
      <ChatInput
        value={value}
        onChange={setValue}
        onSubmit={(val) => {
          SecureLogger.debug('Submitted:', val)
          setValue('')
        }}
        placeholder="Type a message..."
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
The most basic input setup. This is the foundation for all other patterns.

**Key Points:**
- Controlled component (value + onChange)
- Handle onSubmit callback
- Reset value after submit

This pattern works for 90% of use cases.
        `,
      },
    },
  },
}

export const WithPlaceholder: Story = {
  render: () => {
    const [value, setValue] = useState('')
    
    return (
      <ChatInput
        value={value}
        onChange={setValue}
        onSubmit={(val) => {
          SecureLogger.debug('Submitted:', val)
          setValue('')
        }}
        placeholder="Ask me anything..."
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
Custom placeholder text helps guide users. Use clear, actionable placeholders
that explain what the user should do.
        `,
      },
    },
  },
}

export const DisabledState: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    const handleSubmit = async (val: string) => {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      SecureLogger.debug('Submitted:', val)
      setValue('')
      setIsLoading(false)
    }
    
    return (
      <ChatInput
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        disabled={isLoading}
        placeholder={isLoading ? 'Sending...' : 'Type a message...'}
      />
    )
  },
  parameters: {
    docs: {
      description: `
Disable input during loading states. This prevents duplicate submissions
and provides clear feedback to users.

**Usage:**
1. Set \`disabled={true}\` when loading
2. Update placeholder to show loading state
3. Re-enable when request completes
      `,
    },
  },
}

export const WithMaxLength: Story = {
  render: () => {
    const [value, setValue] = useState('')
    
    return (
      <ChatInput
        value={value}
        onChange={setValue}
        onSubmit={(val) => {
          SecureLogger.debug('Submitted:', val)
          setValue('')
        }}
        maxLength={100}
        placeholder="Type a message (max 100 chars)..."
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
Set maximum length to prevent overly long messages. The input will
prevent typing beyond the limit and provide visual feedback.

**Best Practice:** Set reasonable limits based on your API constraints.
        `,
      },
    },
  },
}

export const WithFileUpload: Story = {
  render: () => {
    const [value, setValue] = useState('')
    
    const handleFileUpload = (file: File) => {
      SecureLogger.debug('File uploaded:', file.name, file.size)
      // Handle file upload
    }
    
    return (
      <ChatInput
        value={value}
        onChange={setValue}
        onSubmit={(val) => {
          SecureLogger.debug('Submitted:', val)
          setValue('')
        }}
        allowFileUpload={true}
        onFileUpload={handleFileUpload}
        placeholder="Type a message or upload a file..."
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
Enable file upload for multimodal interactions. Users can drag & drop
files or click to upload.

**Features:**
- Drag & drop support
- Click to upload
- File type validation (optional)
- File size limits (optional)
        `,
      },
    },
  },
}

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [messages, setMessages] = useState<string[]>([])
    
    const handleSubmit = (val: string) => {
      setMessages([...messages, val])
      setValue('')
    }
    
    return (
      <div>
        <div style={{ marginBottom: '16px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
          <strong>Messages:</strong>
          {messages.length === 0 ? (
            <p style={{ color: '#666', margin: '8px 0 0 0' }}>No messages yet. Try typing and pressing Enter!</p>
          ) : (
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              {messages.map((msg, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
        <ChatInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder="Type a message and press Enter..."
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
Fully interactive example. Try typing a message and pressing Enter or
clicking the Send button.

**This demonstrates:**
- Real-time input updates
- Submit handling
- State management
- Complete input flow

**Try it:** Type a message and press Enter or click Send.
        `,
      },
    },
  },
}
