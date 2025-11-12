import type { Meta, StoryObj } from '@storybook/react'
import { ErrorMessage, Input } from '@clarity-chat/primitives'
import { useState } from 'react'

/**
 * ErrorMessage component for displaying form validation errors.
 * 
 * **Key Features:**
 * - Animated appearance
 * - Accessible with ARIA attributes
 * - Consistent styling
 * - Smooth transitions
 * 
 * **Best Practices:**
 * - Always pair with form inputs
 * - Show clear, actionable error messages
 * - Use aria-live for screen readers
 */
const meta = {
  title: 'Primitives/ErrorMessage',
  component: ErrorMessage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Error message component for form validation feedback.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ErrorMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="space-y-2">
      <Input placeholder="Enter email" variant="error" />
      <ErrorMessage error="Please enter a valid email address" />
    </div>
  ),
}

export const WithInput: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const error = value.length > 0 && value.length < 3 ? 'Must be at least 3 characters' : undefined

    return (
      <div className="space-y-2">
        <Input
          placeholder="Username"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          variant={error ? 'error' : 'default'}
        />
        <ErrorMessage error={error} />
      </div>
    )
  },
}

export const MultipleErrors: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input placeholder="Email" variant="error" />
        <ErrorMessage error="Email is required" />
      </div>
      <div className="space-y-2">
        <Input placeholder="Password" variant="error" type="password" />
        <ErrorMessage error="Password must be at least 8 characters" />
      </div>
    </div>
  ),
}

export const NoError: Story = {
  render: () => (
    <div className="space-y-2">
      <Input placeholder="Email" />
      <ErrorMessage error={undefined} />
    </div>
  ),
}

export const LongErrorMessage: Story = {
  render: () => (
    <div className="space-y-2">
      <Input placeholder="Password" variant="error" type="password" />
      <ErrorMessage error="Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character" />
    </div>
  ),
}
