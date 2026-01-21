import type { Meta, StoryObj } from '@storybook/react'
import { TokenOptimizationDashboard } from './TokenOptimizationDashboard'
import type { OptimizationMetrics } from './TokenOptimizationDashboard'

/**
 * TokenOptimizationDashboard is the most comprehensive optimization display.
 * Shows all metrics, breakdowns, and savings in a premium glassmorphism design.
 *
 * ## Features
 * - Premium glassmorphism design with gradient animations
 * - Comprehensive metrics with semantic colors
 * - Detailed optimization breakdown
 * - Real-time updates support
 * - Loading and error states
 * - Accessible with full ARIA support
 */
const meta = {
  title: 'Components/TokenOptimizationDashboard',
  component: TokenOptimizationDashboard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Comprehensive token optimization dashboard with premium glassmorphism design, detailed breakdowns, and real-time monitoring capabilities.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showBreakdown: {
      control: 'boolean',
      description: 'Show detailed optimization breakdown',
    },
    realTime: {
      control: 'boolean',
      description: 'Enable real-time updates',
    },
    refreshInterval: {
      control: { type: 'number', min: 1000, max: 30000, step: 1000 },
      description: 'Refresh interval in milliseconds',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
  },
} satisfies Meta<typeof TokenOptimizationDashboard>

export default meta
type Story = StoryObj<typeof meta>

const mockMetrics: OptimizationMetrics = {
  totalTokens: 50000,
  tokensSaved: 15000,
  costSaved: 0.45,
  breakdown: {
    promptCompression: { tokens: 4000, percent: 27 },
    caching: { hits: 120, savings: 5000 },
    modelRouting: { savings: 3000, percent: 40 },
    responseLimiting: { tokens: 2000, percent: 15 },
    batching: { requests: 50, savings: 800 },
    throttling: { callsSaved: 200 },
    referencing: { bytesSaved: 50000, percent: 60 },
  },
  savingsPercent: 30,
}

/**
 * Default dashboard with full breakdown
 */
export const Default: Story = {
  args: {
    metrics: mockMetrics,
    showBreakdown: true,
    realTime: false,
  },
}

/**
 * Without breakdown details
 */
export const WithoutBreakdown: Story = {
  args: {
    metrics: mockMetrics,
    showBreakdown: false,
    realTime: false,
  },
}

/**
 * Real-time monitoring mode
 */
export const RealTime: Story = {
  args: {
    metrics: mockMetrics,
    showBreakdown: true,
    realTime: true,
    refreshInterval: 5000,
  },
}

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    metrics: mockMetrics,
    isLoading: true,
  },
}

/**
 * Error state
 */
export const Error: Story = {
  args: {
    metrics: mockMetrics,
    error: 'Failed to load optimization data. Please try again.',
  },
}

/**
 * Minimal optimization scenario
 */
export const MinimalOptimization: Story = {
  args: {
    metrics: {
      totalTokens: 10000,
      tokensSaved: 500,
      costSaved: 0.015,
      breakdown: {
        promptCompression: { tokens: 200, percent: 40 },
        caching: { hits: 3, savings: 150 },
        modelRouting: { savings: 100, percent: 20 },
        responseLimiting: { tokens: 50, percent: 10 },
        batching: { requests: 0, savings: 0 },
        throttling: { callsSaved: 0 },
        referencing: { bytesSaved: 0, percent: 0 },
      },
      savingsPercent: 5,
    },
    showBreakdown: true,
  },
}

/**
 * Excellent optimization scenario
 */
export const ExcellentOptimization: Story = {
  args: {
    metrics: {
      totalTokens: 250000,
      tokensSaved: 175000,
      costSaved: 8.75,
      breakdown: {
        promptCompression: { tokens: 45000, percent: 26 },
        caching: { hits: 2400, savings: 80000 },
        modelRouting: { savings: 30000, percent: 43 },
        responseLimiting: { tokens: 15000, percent: 9 },
        batching: { requests: 580, savings: 3500 },
        throttling: { callsSaved: 1200 },
        referencing: { bytesSaved: 500000, percent: 62 },
      },
      savingsPercent: 70,
    },
    showBreakdown: true,
  },
}

/**
 * Focus on caching optimization
 */
export const CachingHeavy: Story = {
  args: {
    metrics: {
      totalTokens: 100000,
      tokensSaved: 45000,
      costSaved: 1.35,
      breakdown: {
        promptCompression: { tokens: 2000, percent: 4 },
        caching: { hits: 850, savings: 40000 },
        modelRouting: { savings: 2000, percent: 4 },
        responseLimiting: { tokens: 1000, percent: 2 },
        batching: { requests: 0, savings: 0 },
        throttling: { callsSaved: 0 },
        referencing: { bytesSaved: 0, percent: 0 },
      },
      savingsPercent: 45,
    },
    showBreakdown: true,
  },
}

/**
 * Focus on compression optimization
 */
export const CompressionHeavy: Story = {
  args: {
    metrics: {
      totalTokens: 80000,
      tokensSaved: 32000,
      costSaved: 0.96,
      breakdown: {
        promptCompression: { tokens: 25000, percent: 78 },
        caching: { hits: 45, savings: 3000 },
        modelRouting: { savings: 2000, percent: 6 },
        responseLimiting: { tokens: 2000, percent: 6 },
        batching: { requests: 0, savings: 0 },
        throttling: { callsSaved: 0 },
        referencing: { bytesSaved: 0, percent: 0 },
      },
      savingsPercent: 40,
    },
    showBreakdown: true,
  },
}

/**
 * Multiple dashboards showing different projects
 */
export const MultipleProjects: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Token Optimization Overview</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Production API</h3>
          <TokenOptimizationDashboard
            metrics={mockMetrics}
            showBreakdown
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Development</h3>
          <TokenOptimizationDashboard
            metrics={{
              totalTokens: 25000,
              tokensSaved: 8500,
              costSaved: 0.255,
              breakdown: {
                promptCompression: { tokens: 2200, percent: 26 },
                caching: { hits: 68, savings: 3500 },
                modelRouting: { savings: 1800, percent: 21 },
                responseLimiting: { tokens: 1000, percent: 12 },
                batching: { requests: 0, savings: 0 },
                throttling: { callsSaved: 0 },
                referencing: { bytesSaved: 0, percent: 0 },
              },
              savingsPercent: 34,
            }}
            showBreakdown
          />
        </div>
      </div>
    </div>
  ),
}

/**
 * Interactive playground
 */
export const Playground: Story = {
  args: {
    metrics: mockMetrics,
    showBreakdown: true,
    realTime: false,
    refreshInterval: 5000,
  },
}
