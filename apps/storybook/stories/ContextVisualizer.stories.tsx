import type { Meta, StoryObj } from '@storybook/react'
import { ContextVisualizer } from '@clarity-chat/react'

const meta: Meta<typeof ContextVisualizer> = {
  title: 'Components/ContextVisualizer',
  component: ContextVisualizer,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ContextVisualizer>

const mockMessages = [
  { id: '1', role: 'user' as const, content: 'Hello', tokens: 5, isIncluded: true },
  { id: '2', role: 'assistant' as const, content: 'Hi there!', tokens: 8, isIncluded: true },
]

export const Default: Story = {
  args: { messages: mockMessages, maxTokens: 4000, currentTokens: 13, showTokens: true },
}
