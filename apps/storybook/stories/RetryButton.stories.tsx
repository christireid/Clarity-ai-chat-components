import type { Meta, StoryObj } from '@storybook/react'
import { RetryButton } from '@clarity-chat/react'

/**
 * **RetryButton Component**
 * 
 * Button component for retrying failed operations
 * with attempt tracking and loading states.
 * 
 * **Key Features:**
 * - Retry functionality
 * - Attempt counter
 * - Loading state during retry
 * - Maximum attempts limit
 * - Accessible with ARIA labels
 * - Visual feedback
 * 
 * **Use Cases:**
 * - Error recovery
 * - Failed API requests
 * - Network error handling
 * - Operation retries
 */
const meta: Meta<typeof RetryButton> = {
  title: 'Components/RetryButton',
  component: RetryButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Button component for retrying failed operations
with attempt tracking and loading states.

## Features

- ✅ Retry functionality
- ✅ Attempt counter
- ✅ Loading state during retry
- ✅ Maximum attempts limit
- ✅ Accessible with ARIA labels
- ✅ Visual feedback
- ✅ Disabled state when max attempts reached

## Basic Usage

\`\`\`tsx
<RetryButton
  onRetry={() => {
    // Retry the operation
  }}
  attempt={1}
  maxAttempts={3}
  isRetrying={false}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onRetry: {
      description: 'Callback when retry button is clicked',
      action: 'retry-clicked',
    },
    attempt: {
      description: 'Current attempt number',
      control: { type: 'number', min: 1, max: 10 },
    },
    maxAttempts: {
      description: 'Maximum number of retry attempts',
      control: { type: 'number', min: 1, max: 10 },
    },
    isRetrying: {
      description: 'Whether retry is currently in progress',
      control: 'boolean',
    },
    disabled: {
      description: 'Disable the retry button',
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof RetryButton>

export const Default: Story = {
  args: { onRetry: () => console.log('Retry clicked') },
}

export const WithAttempts: Story = {
  args: { onRetry: () => {}, attempt: 2, maxAttempts: 3 },
}

export const Loading: Story = {
  args: { onRetry: () => {}, isRetrying: true },
}
