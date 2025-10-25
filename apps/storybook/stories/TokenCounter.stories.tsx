import type { Meta, StoryObj } from '@storybook/react'
import { TokenCounter } from '@clarity-chat/react'

const meta: Meta<typeof TokenCounter> = {
  title: 'Components/TokenCounter',
  component: TokenCounter,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TokenCounter>

export const Default: Story = {
  args: { tokens: 1250, maxTokens: 4000, cost: 0.0025 },
}

export const NearLimit: Story = {
  args: { tokens: 3800, maxTokens: 4000, cost: 0.0095 },
}

export const OverLimit: Story = {
  args: { tokens: 4500, maxTokens: 4000, cost: 0.0113 },
}
