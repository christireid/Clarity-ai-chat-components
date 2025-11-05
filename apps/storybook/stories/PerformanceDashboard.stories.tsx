import type { Meta, StoryObj } from '@storybook/react'
import { PerformanceDashboard } from '@clarity-chat/react'

const meta: Meta<typeof PerformanceDashboard> = {
  title: 'Components/PerformanceDashboard',
  component: PerformanceDashboard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Real-time performance monitoring dashboard showing render metrics, memory usage, and performance indicators.',
      },
    },
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PerformanceDashboard>

export const Default: Story = {
  args: {},
}

export const Detailed: Story = {
  args: {
    detailed: true,
  },
}

export const FastUpdate: Story = {
  args: {
    detailed: true,
    updateInterval: 500,
  },
}

export const SlowUpdate: Story = {
  args: {
    detailed: true,
    updateInterval: 5000,
  },
}
