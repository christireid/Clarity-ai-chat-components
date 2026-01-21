import type { Meta, StoryObj } from '@storybook/react-vite'
import { PerformanceDashboard } from '@clarity-chat/react'

const meta: Meta<typeof PerformanceDashboard> = {
  title: 'Components/Dashboards/PerformanceDashboard',
  component: PerformanceDashboard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Real-time performance monitoring dashboard for content components. Tracks render times, memory usage, and provides optimization insights.',
      },
    },
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof PerformanceDashboard>

export const Default: Story = {
  args: {
    autoRefresh: true,
    refreshInterval: 5000,
  },
}

export const ManualRefresh: Story = {
  args: {
    autoRefresh: false,
  },
}

export const CompactView: Story = {
  args: {
    autoRefresh: true,
    refreshInterval: 10000,
    className: 'max-w-4xl mx-auto',
  },
}