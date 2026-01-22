import type { Meta, StoryObj } from '@storybook/react'
import { TokenOptimizationPanel } from './TokenOptimizationPanel'
import type { TokenOptimizationStats } from '../hooks/use-token-optimization-stats'

/**
 * TokenOptimizationPanel displays comprehensive token optimization statistics.
 * Perfect for dedicated optimization panels or dashboards.
 *
 * ## Features
 * - Glassmorphism design with premium gradients
 * - Multiple metric cards with semantic colors
 * - Detailed breakdown toggle
 * - Cache and routing statistics
 * - Multiple size variants
 */
const meta = {
  title: 'Components/TokenOptimizationPanel',
  component: TokenOptimizationPanel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Comprehensive token optimization panel with detailed statistics, glassmorphism design, and semantic color gradients.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showDetails: {
      control: 'boolean',
      description: 'Show detailed statistics breakdown',
    },
    showCacheStats: {
      control: 'boolean',
      description: 'Display cache performance metrics',
    },
    showRoutingStats: {
      control: 'boolean',
      description: 'Display model routing statistics',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Panel size variant',
    },
  },
} satisfies Meta<typeof TokenOptimizationPanel>

export default meta
type Story = StoryObj<typeof meta>

const mockStats: TokenOptimizationStats = {
  tokensSaved: 15420,
  percentageSaved: 35.8,
  costSavings: 0.842,
  cacheHits: 245,
  cacheMisses: 58,
  requestsThrottled: 42,
  simpleModelRoutes: 156,
  complexModelRoutes: 89,
}

/**
 * Default panel with all features enabled
 */
export const Default: Story = {
  args: {
    stats: mockStats,
    showDetails: true,
    showCacheStats: true,
    showRoutingStats: true,
    size: 'md',
  },
}

/**
 * Compact view without details
 */
export const Compact: Story = {
  args: {
    stats: mockStats,
    showDetails: false,
    showCacheStats: true,
    showRoutingStats: true,
    size: 'md',
  },
}

/**
 * Without cache statistics
 */
export const NoCacheStats: Story = {
  args: {
    stats: mockStats,
    showDetails: true,
    showCacheStats: false,
    showRoutingStats: true,
    size: 'md',
  },
}

/**
 * Without routing statistics
 */
export const NoRoutingStats: Story = {
  args: {
    stats: mockStats,
    showDetails: true,
    showCacheStats: true,
    showRoutingStats: false,
    size: 'md',
  },
}

/**
 * Small size variant
 */
export const Small: Story = {
  args: {
    stats: mockStats,
    showDetails: true,
    showCacheStats: true,
    showRoutingStats: true,
    size: 'sm',
  },
}

/**
 * Large size variant
 */
export const Large: Story = {
  args: {
    stats: {
      ...mockStats,
      tokensSaved: 125000,
      percentageSaved: 62.5,
      costSavings: 12.45,
    },
    showDetails: true,
    showCacheStats: true,
    showRoutingStats: true,
    size: 'lg',
  },
}

/**
 * Minimal savings scenario
 */
export const MinimalSavings: Story = {
  args: {
    stats: {
      tokensSaved: 420,
      percentageSaved: 8.2,
      costSavings: 0.015,
      cacheHits: 5,
      cacheMisses: 12,
      requestsThrottled: 2,
      simpleModelRoutes: 8,
      complexModelRoutes: 9,
    },
    showDetails: true,
    showCacheStats: true,
    showRoutingStats: true,
  },
}

/**
 * Excellent optimization scenario
 */
export const ExcellentOptimization: Story = {
  args: {
    stats: {
      tokensSaved: 250000,
      percentageSaved: 78.5,
      costSavings: 45.82,
      cacheHits: 1245,
      cacheMisses: 42,
      requestsThrottled: 356,
      simpleModelRoutes: 892,
      complexModelRoutes: 198,
    },
    showDetails: true,
    showCacheStats: true,
    showRoutingStats: true,
    size: 'lg',
  },
}

/**
 * Panel in dashboard layout
 */
export const InDashboard: Story = {
  render: () => (
    <div className="w-full max-w-6xl space-y-6">
      <h1 className="text-2xl font-bold">Token Optimization Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TokenOptimizationPanel
          stats={mockStats}
          showDetails
          showCacheStats
          showRoutingStats
        />
        <TokenOptimizationPanel
          stats={{
            tokensSaved: 8920,
            percentageSaved: 42.1,
            costSavings: 0.524,
            cacheHits: 124,
            cacheMisses: 35,
            requestsThrottled: 18,
            simpleModelRoutes: 86,
            complexModelRoutes: 38,
          }}
          showDetails
          showCacheStats
          showRoutingStats
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}
