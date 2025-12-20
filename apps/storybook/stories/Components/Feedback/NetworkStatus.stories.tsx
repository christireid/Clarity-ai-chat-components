import type { Meta, StoryObj } from '@storybook/react-vite'
import { NetworkStatus } from '@clarity-chat/react/internal'
import { expect, within } from 'storybook/test'

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
  title: 'Components/Feedback/NetworkStatus',
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
    status: {
      type: 'stable',
    },
    badges: ['stable', 'tested', 'accessible'],
  },
  tags: ['autodocs', 'stable'],
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

export const Online: Story = {
  args: { status: 'online' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test online status displays
    await expect(canvas.getByText(/online/i)).toBeInTheDocument()

    // Test status has proper role for accessibility
    const statusElement = canvas.getByRole('status')
    await expect(statusElement).toBeInTheDocument()
  },
}

export const Offline: Story = {
  args: { status: 'offline' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test offline status displays
    await expect(canvas.getByText(/offline/i)).toBeInTheDocument()

    // Test status role for accessibility
    const statusElement = canvas.getByRole('status')
    await expect(statusElement).toBeInTheDocument()
  },
}

export const Slow: Story = {
  args: { status: 'slow', latency: 2500 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test slow status displays
    await expect(canvas.getByText(/slow/i)).toBeInTheDocument()

    // Test latency value displays
    await expect(canvas.getByText(/2500/)).toBeInTheDocument()

    // Test status role for accessibility
    const statusElement = canvas.getByRole('status')
    await expect(statusElement).toBeInTheDocument()
  },
}

export const Reconnecting: Story = {
  args: { status: 'reconnecting', attempt: 2 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test reconnecting status displays
    await expect(canvas.getByText(/reconnecting/i)).toBeInTheDocument()

    // Test attempt number displays
    await expect(canvas.getByText(/2/)).toBeInTheDocument()

    // Test status role for accessibility
    const statusElement = canvas.getByRole('status')
    await expect(statusElement).toBeInTheDocument()
  },
}
