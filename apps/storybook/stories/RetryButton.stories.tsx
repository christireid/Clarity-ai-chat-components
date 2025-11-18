import type { Meta, StoryObj } from '@storybook/react'
import { RetryButton } from '@clarity-chat/react'
import { expect, userEvent, within } from '@storybook/test'

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
    status: {
      type: 'stable',
    },
    badges: ['stable', 'tested', 'accessible'],
  },
  tags: ['autodocs', 'stable'],
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test retry button renders
    const retryButton = canvas.getByRole('button')
    await expect(retryButton).toBeInTheDocument()
    await expect(retryButton).not.toBeDisabled()

    // Test button text contains "Retry"
    await expect(retryButton).toHaveTextContent(/retry/i)

    // Test clicking retry button
    await userEvent.click(retryButton)
  },
}

export const WithAttempts: Story = {
  args: { onRetry: () => {}, attempt: 2, maxAttempts: 3 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test retry button with attempt counter renders
    const retryButton = canvas.getByRole('button')
    await expect(retryButton).toBeInTheDocument()

    // Test attempt counter is displayed (2/3)
    await expect(retryButton).toHaveTextContent(/2/)
    await expect(retryButton).toHaveTextContent(/3/)
  },
}

export const Loading: Story = {
  args: { onRetry: () => {}, isRetrying: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test retry button in loading state
    const retryButton = canvas.getByRole('button')
    await expect(retryButton).toBeInTheDocument()
    await expect(retryButton).toBeDisabled()
  },
}
