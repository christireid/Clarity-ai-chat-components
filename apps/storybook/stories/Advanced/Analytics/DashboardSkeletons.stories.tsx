import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import {
  AnalyticsDashboardSkeleton,
  UsageDashboardSkeleton,
  TokenOptimizationDashboardSkeleton,
  PerformanceDashboardSkeleton,
  DashboardEmptyState,
  MetricCardSkeleton,
  ProgressWidgetSkeleton,
  ListItemSkeleton,
  ChartSkeleton,
} from '@clarity-chat/react'

/**
 * **Dashboard Skeletons**
 *
 * Loading states for dashboard components. Skeletons provide
 * visual feedback during data fetching and respect user's
 * prefers-reduced-motion settings.
 *
 * **Key Features:**
 * - Type-specific skeletons matching dashboard layouts
 * - Animation respects prefers-reduced-motion
 * - Accessible loading announcements
 * - Empty state for no-data scenarios
 *
 * **Use Cases:**
 * - Initial data loading
 * - Dashboard refresh states
 * - Lazy loading placeholders
 */
const meta = {
  title: 'Advanced/Analytics/DashboardSkeletons',
  component: AnalyticsDashboardSkeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Loading states for dashboard components. Provides visual feedback
during data fetching with accessibility support.

## Features

- ✅ Type-specific skeletons matching dashboard layouts
- ✅ Animation respects prefers-reduced-motion
- ✅ Accessible loading announcements (aria-busy, sr-only)
- ✅ Empty state for no-data scenarios
- ✅ Composable skeleton primitives

## Basic Usage

\`\`\`tsx
import {
  AnalyticsDashboardSkeleton,
  DashboardEmptyState,
} from '@clarity-chat/react'

function Dashboard({ data, isLoading }) {
  if (isLoading) {
    return <AnalyticsDashboardSkeleton />
  }

  if (!data) {
    return (
      <DashboardEmptyState
        title="No data available"
        description="Start a conversation to see analytics"
      />
    )
  }

  return <AnalyticsDashboard data={data} />
}
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    animate: {
      description: 'Whether to animate the skeleton (respects reduced motion)',
      control: { type: 'boolean' },
    },
    className: {
      description: 'Additional CSS classes',
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof AnalyticsDashboardSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const AnalyticsSkeleton: Story = {
  name: 'Analytics Dashboard Skeleton',
  render: (args) => (
    <div className="max-w-3xl">
      <AnalyticsDashboardSkeleton {...args} />
    </div>
  ),
  args: {
    animate: true,
  },
}

export const UsageSkeleton: Story = {
  name: 'Usage Dashboard Skeleton',
  render: (args) => (
    <div className="max-w-md">
      <UsageDashboardSkeleton animate={args.animate} />
    </div>
  ),
  args: {
    animate: true,
  },
}

export const TokenOptimizationSkeleton: Story = {
  name: 'Token Optimization Skeleton',
  render: (args) => (
    <div className="max-w-2xl">
      <TokenOptimizationDashboardSkeleton animate={args.animate} />
    </div>
  ),
  args: {
    animate: true,
  },
}

export const PerformanceSkeleton: Story = {
  name: 'Performance Dashboard Skeleton',
  render: (args) => (
    <div className="max-w-2xl">
      <PerformanceDashboardSkeleton animate={args.animate} />
    </div>
  ),
  args: {
    animate: true,
  },
}

export const SkeletonPrimitives: Story = {
  name: 'Skeleton Primitives',
  render: (args) => (
    <div className="space-y-6 max-w-md">
      <div>
        <h3 className="text-sm font-semibold mb-3">Metric Card Skeleton</h3>
        <MetricCardSkeleton animate={args.animate} />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Progress Widget Skeleton</h3>
        <ProgressWidgetSkeleton animate={args.animate} />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">List Item Skeleton</h3>
        <div className="space-y-2">
          <ListItemSkeleton animate={args.animate} />
          <ListItemSkeleton animate={args.animate} />
          <ListItemSkeleton animate={args.animate} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Chart Skeleton</h3>
        <ChartSkeleton animate={args.animate} />
      </div>
    </div>
  ),
  args: {
    animate: true,
  },
}

export const EmptyState: Story = {
  name: 'Empty State',
  render: () => (
    <div className="max-w-md">
      <DashboardEmptyState
        title="No analytics data"
        description="Start a conversation to see metrics and insights appear here."
      />
    </div>
  ),
}

export const EmptyStateWithAction: Story = {
  name: 'Empty State with Action',
  render: () => (
    <div className="max-w-md">
      <DashboardEmptyState
        title="No usage data"
        description="Your usage statistics will appear here once you start using the API."
        action={{
          label: 'View Documentation',
          onClick: () => alert('Opening documentation...'),
        }}
      />
    </div>
  ),
}

export const EmptyStateWithIcon: Story = {
  name: 'Empty State with Custom Icon',
  render: () => (
    <div className="max-w-md">
      <DashboardEmptyState
        title="No experiments running"
        description="Create your first A/B test to start optimizing your chat experience."
        icon={
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        }
        action={{
          label: 'Create Experiment',
          onClick: () => alert('Creating experiment...'),
        }}
      />
    </div>
  ),
}

export const LoadingToContent: Story = {
  name: 'Loading to Content Transition',
  render: () => {
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 3000)
      return () => clearTimeout(timer)
    }, [])

    return (
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
            onClick={() => setIsLoading(true)}
          >
            Reload
          </button>
          <span className="text-xs text-muted-foreground">
            {isLoading ? 'Loading...' : 'Content loaded!'}
          </span>
        </div>

        {isLoading ? (
          <AnalyticsDashboardSkeleton />
        ) : (
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your dashboard content has loaded successfully.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                { label: 'Messages', value: '1,234' },
                { label: 'Tokens', value: '52.3K' },
                { label: 'Conversations', value: '89' },
              ].map((metric) => (
                <div key={metric.label} className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  },
}

export const ReducedMotion: Story = {
  name: 'Reduced Motion (No Animation)',
  render: () => (
    <div className="space-y-6 max-w-3xl">
      <p className="text-sm text-muted-foreground">
        These skeletons have animation disabled, simulating
        prefers-reduced-motion.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-semibold mb-2">Metric Card</h4>
          <MetricCardSkeleton animate={false} />
        </div>
        <div>
          <h4 className="text-xs font-semibold mb-2">Progress Widget</h4>
          <ProgressWidgetSkeleton animate={false} />
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold mb-2">Analytics Dashboard</h4>
        <AnalyticsDashboardSkeleton animate={false} />
      </div>
    </div>
  ),
}
