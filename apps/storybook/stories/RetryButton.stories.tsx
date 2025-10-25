import type { Meta, StoryObj } from '@storybook/react'
import { RetryButton } from '@clarity-chat/react'

const meta: Meta<typeof RetryButton> = {
  title: 'Components/RetryButton',
  component: RetryButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
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
