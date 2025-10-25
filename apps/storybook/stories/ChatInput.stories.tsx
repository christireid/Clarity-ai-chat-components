import type { Meta, StoryObj } from '@storybook/react'
import { ChatInput } from '@clarity-chat/react'
import { useState } from 'react'

const meta: Meta<typeof ChatInput> = {
  title: 'Components/ChatInput',
  component: ChatInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Chat input component with auto-resizing textarea. Press Enter to send, Shift+Enter for new line.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ChatInput>

export const Default: Story = {
  args: {
    value: '',
    onChange: () => {},
    onSubmit: (value: string) => {
      console.log('Submitted:', value)
    },
    placeholder: 'Type a message...',
    disabled: false,
  },
}

export const WithText: Story = {
  args: {
    value: 'This is a sample message',
    onChange: () => {},
    onSubmit: (value: string) => {
      console.log('Submitted:', value)
    },
  },
}

export const Disabled: Story = {
  args: {
    value: 'Cannot edit this message',
    onChange: () => {},
    onSubmit: () => {},
    disabled: true,
  },
}

export const WithMaxLength: Story = {
  args: {
    value: '',
    onChange: () => {},
    onSubmit: (value: string) => {
      console.log('Submitted:', value)
    },
    maxLength: 100,
    placeholder: 'Max 100 characters...',
  },
}

export const CustomPlaceholder: Story = {
  args: {
    value: '',
    onChange: () => {},
    onSubmit: (value: string) => {
      console.log('Submitted:', value)
    },
    placeholder: 'Ask me anything...',
  },
}

export const MultilineText: Story = {
  args: {
    value: 'This is a longer message\\nthat spans multiple lines\\nand shows the auto-resize feature',
    onChange: () => {},
    onSubmit: (value: string) => {
      console.log('Submitted:', value)
    },
  },
}

const InteractiveTemplate = () => {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState<string[]>([])

  const handleSubmit = (text: string) => {
    setSubmitted([...submitted, text])
    setValue('')
  }

  return (
    <div>
      <ChatInput
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        placeholder="Type and press Enter to submit..."
      />
      {submitted.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Submitted messages:</h3>
          <ul className="space-y-1">
            {submitted.map((msg, idx) => (
              <li key={idx} className="text-sm">{msg}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveTemplate />,
}
