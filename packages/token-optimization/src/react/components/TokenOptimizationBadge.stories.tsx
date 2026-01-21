import type { Meta, StoryObj } from '@storybook/react'
import { TokenOptimizationBadge } from './TokenOptimizationBadge'
import type { TokenOptimizationStats } from '../hooks/use-token-optimization-stats'

/**
 * TokenOptimizationBadge is a compact indicator showing token savings.
 * Perfect for headers, toolbars, or anywhere you need a quick overview.
 *
 * ## Features
 * - Compact, minimal design
 * - Shows tokens saved and percentage
 * - Optional cost display
 * - Glassmorphism with success gradient
 * - Multiple size variants
 */
const meta = {
  title: 'Components/TokenOptimizationBadge',
  component: TokenOptimizationBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A compact badge component displaying token optimization statistics. Perfect for headers, toolbars, or inline displays.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showCost: {
      control: 'boolean',
      description: 'Display cost savings',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Badge size',
    },
  },
} satisfies Meta<typeof TokenOptimizationBadge>

export default meta
type Story = StoryObj<typeof meta>

const mockStats: TokenOptimizationStats = {
  tokensSaved: 1250,
  percentageSaved: 32.5,
  costSavings: 0.045,
  cacheHits: 12,
  cacheMisses: 3,
  requestsThrottled: 5,
  simpleModelRoutes: 8,
  complexModelRoutes: 4,
}

/**
 * Default badge showing token savings
 */
export const Default: Story = {
  args: {
    stats: mockStats,
    showCost: false,
    size: 'md',
  },
}

/**
 * Badge with cost savings displayed
 */
export const WithCost: Story = {
  args: {
    stats: mockStats,
    showCost: true,
    size: 'md',
  },
}

/**
 * Small size variant for compact displays
 */
export const Small: Story = {
  args: {
    stats: mockStats,
    showCost: true,
    size: 'sm',
  },
}

/**
 * Large size variant for prominent displays
 */
export const Large: Story = {
  args: {
    stats: {
      ...mockStats,
      tokensSaved: 15420,
      percentageSaved: 45.2,
      costSavings: 1.25,
    },
    showCost: true,
    size: 'lg',
  },
}

/**
 * Minimal savings example
 */
export const MinimalSavings: Story = {
  args: {
    stats: {
      ...mockStats,
      tokensSaved: 50,
      percentageSaved: 5.2,
      costSavings: 0.002,
    },
    showCost: true,
  },
}

/**
 * Significant savings example
 */
export const SignificantSavings: Story = {
  args: {
    stats: {
      ...mockStats,
      tokensSaved: 50000,
      percentageSaved: 67.8,
      costSavings: 8.45,
    },
    showCost: true,
    size: 'lg',
  },
}

/**
 * Multiple badges showing different states
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-16">Small:</span>
        <TokenOptimizationBadge stats={mockStats} showCost size="sm" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-16">Medium:</span>
        <TokenOptimizationBadge stats={mockStats} showCost size="md" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-16">Large:</span>
        <TokenOptimizationBadge stats={mockStats} showCost size="lg" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

/**
 * In a realistic toolbar context
 */
export const InToolbar: Story = {
  render: () => (
    <div className="w-full max-w-4xl bg-card border rounded-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold">Chat Interface</h2>
        </div>
        <div className="flex items-center gap-3">
          <TokenOptimizationBadge stats={mockStats} showCost size="sm" />
          <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            New Chat
          </button>
        </div>
      </div>
      <div className="p-6 text-muted-foreground">
        <p>Toolbar example with optimization badge...</p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}
