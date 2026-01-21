import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { PerformanceDashboard } from '@clarity-chat/react'

const meta = {
  title: 'Advanced/Analytics/PerformanceDashboard',
  component: PerformanceDashboard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'In-app observability widget mirroring dashboards in Datadog, Vercel, and the Storybook Design System. Useful for monitoring render costs, memory, and perceived latency during AI sessions.',
      },
    },
  },
  argTypes: {
    detailed: { control: 'boolean' },
    updateInterval: {
      control: { type: 'number', min: 500, step: 500 },
    },
  },
  args: {
    detailed: true,
    updateInterval: 2000,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof PerformanceDashboard>

export default meta
type Story = StoryObj<typeof meta>

export const LiveMetrics: Story = {}

export const Compact: Story = {
  args: {
    detailed: false,
    updateInterval: 1000,
  },
}
