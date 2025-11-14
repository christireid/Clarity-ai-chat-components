import type { Meta, StoryObj } from '@storybook/react'
import { NetworkStatus } from '@clarity-chat/react'

/**
 * **NetworkStatus Component**
 * 
 * Component for displaying network connection status
 * with latency tracking and reconnection attempts.
 * 
 * **Key Features:**
 * - Online/offline status detection
 * - Network latency display
 * - Reconnection attempt tracking
 * - Slow connection detection
 * - Visual status indicators
 * - Accessible with ARIA labels
 * 
 * **Use Cases:**
 * - Network monitoring
 * - Connection status display
 * - Offline mode indicators
 * - Connection quality feedback
 */
const meta: Meta<typeof NetworkStatus> = {
  title: 'Components/NetworkStatus',
  component: NetworkStatus,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Component for displaying network connection status
with latency tracking and reconnection attempts.

## Features

- ✅ Online/offline status detection
- ✅ Network latency display
- ✅ Reconnection attempt tracking
- ✅ Slow connection detection
- ✅ Visual status indicators
- ✅ Accessible with ARIA labels
- ✅ Real-time status updates

## Basic Usage

\`\`\`tsx
<NetworkStatus
  status="online"
  latency={150}
  attempt={1}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      description: 'Network connection status',
      control: 'select',
      options: ['online', 'offline', 'slow', 'reconnecting'],
    },
    latency: {
      description: 'Network latency in milliseconds',
      control: { type: 'number', min: 0, max: 5000 },
    },
    attempt: {
      description: 'Current reconnection attempt number',
      control: { type: 'number', min: 1, max: 10 },
    },
  },
}

export default meta
type Story = StoryObj<typeof NetworkStatus>

export const Online: Story = { args: { status: 'online' } }
export const Offline: Story = { args: { status: 'offline' } }
export const Slow: Story = { args: { status: 'slow', latency: 2500 } }
export const Reconnecting: Story = { args: { status: 'reconnecting', attempt: 2 } }
