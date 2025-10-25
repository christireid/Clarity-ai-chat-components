import type { Meta, StoryObj } from '@storybook/react'
import { NetworkStatus } from '@clarity-chat/react'

const meta: Meta<typeof NetworkStatus> = {
  title: 'Components/NetworkStatus',
  component: NetworkStatus,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NetworkStatus>

export const Online: Story = { args: { status: 'online' } }
export const Offline: Story = { args: { status: 'offline' } }
export const Slow: Story = { args: { status: 'slow', latency: 2500 } }
export const Reconnecting: Story = { args: { status: 'reconnecting', attempt: 2 } }
