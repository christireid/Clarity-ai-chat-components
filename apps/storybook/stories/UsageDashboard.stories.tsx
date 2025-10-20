import type { Meta, StoryObj } from '@storybook/react'
import { UsageDashboard } from '@clarity-chat/react'
import type { UsageStats } from '@clarity-chat/types'

const meta = {
  title: 'Components/UsageDashboard',
  component: UsageDashboard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UsageDashboard>

export default meta
type Story = StoryObj<typeof meta>

const baseStats: UsageStats = {
  id: 'stats-1',
  userId: 'user-1',
  period: 'monthly',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  balance: {
    total: 1000,
    used: 350,
    remaining: 650,
  },
  usage: {
    messages: 150,
    tokens: 45000,
    files: 12,
    exports: 5,
    storage: 250,
    apiCalls: 200,
  },
  limits: {
    messages: 500,
    tokens: 100000,
    files: 50,
    exports: 20,
    storage: 1000,
    apiCalls: 1000,
  },
  costs: [
    {
      category: 'Messages',
      amount: 150,
      unit: '$0.01 per message',
    },
    {
      category: 'Tokens',
      amount: 90,
      unit: '$0.002 per 1k tokens',
    },
    {
      category: 'Files',
      amount: 60,
      unit: '$5 per file',
    },
    {
      category: 'Exports',
      amount: 25,
      unit: '$5 per export',
    },
    {
      category: 'Storage',
      amount: 25,
      unit: '$0.10 per MB',
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const Default: Story = {
  args: {
    stats: baseStats,
  },
}

export const LowBalance: Story = {
  args: {
    stats: {
      ...baseStats,
      balance: {
        total: 1000,
        used: 850,
        remaining: 150,
      },
      usage: {
        ...baseStats.usage,
        messages: 450,
        tokens: 95000,
      },
    },
  },
}

export const CriticalBalance: Story = {
  args: {
    stats: {
      ...baseStats,
      balance: {
        total: 1000,
        used: 950,
        remaining: 50,
      },
      usage: {
        ...baseStats.usage,
        messages: 480,
        tokens: 98000,
        files: 48,
      },
    },
  },
}

export const HighUsage: Story = {
  args: {
    stats: {
      ...baseStats,
      usage: {
        messages: 450,
        tokens: 95000,
        files: 48,
        exports: 18,
        storage: 950,
        apiCalls: 950,
      },
      balance: {
        total: 1000,
        used: 800,
        remaining: 200,
      },
      costs: [
        {
          category: 'Messages',
          amount: 450,
          unit: '$0.01 per message',
        },
        {
          category: 'Tokens',
          amount: 190,
          unit: '$0.002 per 1k tokens',
        },
        {
          category: 'Files',
          amount: 240,
          unit: '$5 per file',
        },
        {
          category: 'Exports',
          amount: 90,
          unit: '$5 per export',
        },
        {
          category: 'Storage',
          amount: 95,
          unit: '$0.10 per MB',
        },
      ],
    },
  },
}

export const MinimalUsage: Story = {
  args: {
    stats: {
      ...baseStats,
      usage: {
        messages: 10,
        tokens: 3000,
        files: 2,
        exports: 0,
        storage: 50,
        apiCalls: 15,
      },
      balance: {
        total: 1000,
        used: 50,
        remaining: 950,
      },
      costs: [
        {
          category: 'Messages',
          amount: 10,
          unit: '$0.01 per message',
        },
        {
          category: 'Tokens',
          amount: 6,
          unit: '$0.002 per 1k tokens',
        },
        {
          category: 'Files',
          amount: 10,
          unit: '$5 per file',
        },
        {
          category: 'Storage',
          amount: 5,
          unit: '$0.10 per MB',
        },
      ],
    },
  },
}

export const NoLimits: Story = {
  args: {
    stats: {
      ...baseStats,
      limits: undefined,
    },
  },
}
