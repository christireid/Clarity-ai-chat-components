import type { Meta, StoryObj } from '@storybook/react'
import { StreamCancellation } from '@clarity-chat/react'

const meta: Meta<typeof StreamCancellation> = {
  title: 'Components/StreamCancellation',
  component: StreamCancellation,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StreamCancellation>

export const Default: Story = {
  args: { isStreaming: true, onCancel: () => console.log('Cancelled') },
}

export const WithProgress: Story = {
  args: { isStreaming: true, progress: 65, onCancel: () => {} },
}
