import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { ABTestingDashboard, type ExperimentResult } from '@clarity-chat/react'

/**
 * Helper to create a Map from variant metrics array
 */
function createMetricsMap(
  metrics: Array<{
    variantId: string
    impressions: number
    conversions: number
    conversionRate: number
    avgEngagementTime: number
    bounceRate: number
    revenue?: number
    users: number
  }>
): Map<string, (typeof metrics)[0]> {
  const map = new Map()
  for (const metric of metrics) {
    map.set(metric.variantId, metric)
  }
  return map
}

const sampleExperiments: ExperimentResult[] = [
  {
    experimentId: 'exp-1',
    experimentName: 'Chat Input Enhancement',
    description: 'Testing new input UI with suggestions',
    status: 'running',
    startDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
    variants: [
      {
        id: 'control',
        name: 'Control',
        description: 'Original chat input',
        isControl: true,
      },
      {
        id: 'variant-a',
        name: 'With Suggestions',
        description: 'Chat input with AI suggestions',
        isControl: false,
      },
      {
        id: 'variant-b',
        name: 'Minimal',
        description: 'Simplified minimal design',
        isControl: false,
      },
    ],
    metrics: createMetricsMap([
      {
        variantId: 'control',
        impressions: 1200,
        conversions: 240,
        conversionRate: 0.2,
        avgEngagementTime: 45000,
        bounceRate: 0.25,
        revenue: 1200,
        users: 400,
      },
      {
        variantId: 'variant-a',
        impressions: 1180,
        conversions: 354,
        conversionRate: 0.3,
        avgEngagementTime: 62000,
        bounceRate: 0.15,
        revenue: 1770,
        users: 393,
      },
      {
        variantId: 'variant-b',
        impressions: 1190,
        conversions: 262,
        conversionRate: 0.22,
        avgEngagementTime: 38000,
        bounceRate: 0.3,
        revenue: 1050,
        users: 397,
      },
    ]),
  },
  {
    experimentId: 'exp-2',
    experimentName: 'Response Format Test',
    description: 'Comparing markdown vs plain text responses',
    status: 'running',
    startDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
    variants: [
      {
        id: 'control',
        name: 'Plain Text',
        description: 'Plain text responses',
        isControl: true,
      },
      {
        id: 'variant-a',
        name: 'Rich Markdown',
        description: 'Full markdown with code blocks',
        isControl: false,
      },
    ],
    metrics: createMetricsMap([
      {
        variantId: 'control',
        impressions: 500,
        conversions: 125,
        conversionRate: 0.25,
        avgEngagementTime: 30000,
        bounceRate: 0.2,
        users: 250,
      },
      {
        variantId: 'variant-a',
        impressions: 520,
        conversions: 182,
        conversionRate: 0.35,
        avgEngagementTime: 55000,
        bounceRate: 0.12,
        users: 260,
      },
    ]),
  },
  {
    experimentId: 'exp-3',
    experimentName: 'Onboarding Flow',
    description: 'Testing new user onboarding experience',
    status: 'completed',
    startDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
    endDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
    winner: 'variant-a',
    variants: [
      { id: 'control', name: 'Tutorial Modal', isControl: true },
      { id: 'variant-a', name: 'Interactive Walkthrough', isControl: false },
    ],
    metrics: createMetricsMap([
      {
        variantId: 'control',
        impressions: 5000,
        conversions: 1250,
        conversionRate: 0.25,
        avgEngagementTime: 120000,
        bounceRate: 0.35,
        users: 5000,
      },
      {
        variantId: 'variant-a',
        impressions: 5100,
        conversions: 1938,
        conversionRate: 0.38,
        avgEngagementTime: 180000,
        bounceRate: 0.18,
        users: 5100,
      },
    ]),
  },
]

const earlyStageExperiments: ExperimentResult[] = [
  {
    experimentId: 'exp-early',
    experimentName: 'Button Color Test',
    description: 'Testing CTA button colors',
    status: 'running',
    startDate: Date.now() - 1 * 24 * 60 * 60 * 1000,
    variants: [
      { id: 'control', name: 'Blue Button', isControl: true },
      { id: 'variant-a', name: 'Green Button', isControl: false },
    ],
    metrics: createMetricsMap([
      {
        variantId: 'control',
        impressions: 45,
        conversions: 9,
        conversionRate: 0.2,
        avgEngagementTime: 25000,
        bounceRate: 0.3,
        users: 45,
      },
      {
        variantId: 'variant-a',
        impressions: 42,
        conversions: 12,
        conversionRate: 0.29,
        avgEngagementTime: 32000,
        bounceRate: 0.24,
        users: 42,
      },
    ]),
  },
]

/**
 * **ABTestingDashboard**
 *
 * Comprehensive A/B testing dashboard for monitoring experiment results
 * with statistical significance testing and winner detection.
 *
 * **Key Features:**
 * - Experiment overview with status indicators
 * - Variant performance comparison
 * - Statistical significance testing (z-test)
 * - Winner recommendation with confidence levels
 * - Keyboard shortcuts for power users
 * - Loading and error states
 *
 * **Keyboard Shortcuts:**
 * - `j` / `↓`: Next experiment
 * - `k` / `↑`: Previous experiment
 * - `r`: Refresh data
 * - `1-3`: Sort by metric
 * - `?`: Show shortcuts help
 */
const meta = {
  title: 'Advanced/Analytics/ABTestingDashboard',
  component: ABTestingDashboard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A/B testing dashboard for monitoring experiment results with statistical
significance testing, winner detection, and keyboard navigation.

## Features

- ✅ Experiment overview with status badges
- ✅ Variant performance comparison
- ✅ Statistical significance testing (z-test for proportions)
- ✅ Winner recommendation with p-values and confidence levels
- ✅ Keyboard shortcuts for power users (j/k navigation, ? for help)
- ✅ Loading and error states
- ✅ Accessible with ARIA labels and keyboard support

## Basic Usage

\`\`\`tsx
import { ABTestingDashboard } from '@clarity-chat/react'

function ExperimentsPage() {
  const { experiments, isLoading, error, refetch } = useExperiments()

  return (
    <ABTestingDashboard
      experiments={experiments}
      isLoading={isLoading}
      error={error}
      onRefresh={refetch}
      onSelectExperiment={(exp) => console.log('Selected:', exp.experimentName)}
      onDeclareWinner={(expId, winnerId) => declareWinner(expId, winnerId)}
    />
  )
}
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    experiments: {
      description: 'Array of experiment results to display',
      control: { type: 'object' },
    },
    showStatistics: {
      description: 'Show detailed statistical analysis for variants',
      control: { type: 'boolean' },
    },
    isLoading: {
      description: 'Show loading skeleton',
      control: { type: 'boolean' },
    },
    error: {
      description: 'Error to display',
      control: { type: 'text' },
    },
    enableKeyboardShortcuts: {
      description: 'Enable keyboard shortcuts for navigation',
      control: { type: 'boolean' },
    },
    onSelectExperiment: {
      description: 'Callback when experiment is selected',
      action: 'experiment-selected',
    },
    onDeclareWinner: {
      description: 'Callback when winner is declared',
      action: 'winner-declared',
    },
    onRefresh: {
      description: 'Callback for refresh button/shortcut',
      action: 'refresh',
    },
  },
  args: {
    experiments: sampleExperiments,
    showStatistics: true,
    enableKeyboardShortcuts: true,
  },
} satisfies Meta<typeof ABTestingDashboard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    experiments: sampleExperiments,
  },
}

export const WithRefresh: Story = {
  name: 'With Refresh Button',
  args: {
    experiments: sampleExperiments,
    onRefresh: () => console.log('Refreshing data...'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dashboard with refresh button. Press `R` to trigger refresh via keyboard shortcut.',
      },
    },
  },
}

export const EarlyStageExperiment: Story = {
  name: 'Early Stage (Low Sample Size)',
  args: {
    experiments: earlyStageExperiments,
    config: {
      minSampleSize: 100,
      confidenceLevel: 0.95,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Experiment with insufficient sample size. Statistical significance cannot be determined until minimum sample size is reached.',
      },
    },
  },
}

export const CompletedExperiment: Story = {
  name: 'Completed with Winner',
  args: {
    experiments: [sampleExperiments[2]], // Onboarding Flow - completed
  },
  parameters: {
    docs: {
      description: {
        story: 'A completed experiment with a declared winner.',
      },
    },
  },
}

export const SignificantResult: Story = {
  name: 'Significant Result Detected',
  args: {
    experiments: [sampleExperiments[1]], // Response Format Test - has significant result
  },
  parameters: {
    docs: {
      description: {
        story:
          'Experiment with statistically significant results showing the winner recommendation banner.',
      },
    },
  },
}

export const WithoutStatistics: Story = {
  name: 'Without Statistics',
  args: {
    experiments: sampleExperiments,
    showStatistics: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard without detailed statistical analysis section.',
      },
    },
  },
}

export const Loading: Story = {
  name: 'Loading State',
  args: {
    experiments: [],
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard in loading state with skeleton UI.',
      },
    },
  },
}

export const Error: Story = {
  name: 'Error State',
  args: {
    experiments: [],
    error: 'Failed to fetch experiments: Network timeout',
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard showing an error state.',
      },
    },
  },
}

export const Empty: Story = {
  name: 'Empty State',
  args: {
    experiments: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard with no experiments to display.',
      },
    },
  },
}

export const KeyboardNavigation: Story = {
  name: 'Keyboard Navigation Demo',
  render: (args) => {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium mb-2">
            Keyboard Shortcuts Available:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>
              <kbd className="px-1.5 py-0.5 bg-muted rounded border text-xs">
                J
              </kbd>{' '}
              /{' '}
              <kbd className="px-1.5 py-0.5 bg-muted rounded border text-xs">
                ↓
              </kbd>{' '}
              - Next experiment
            </div>
            <div>
              <kbd className="px-1.5 py-0.5 bg-muted rounded border text-xs">
                K
              </kbd>{' '}
              /{' '}
              <kbd className="px-1.5 py-0.5 bg-muted rounded border text-xs">
                ↑
              </kbd>{' '}
              - Previous experiment
            </div>
            <div>
              <kbd className="px-1.5 py-0.5 bg-muted rounded border text-xs">
                R
              </kbd>{' '}
              - Refresh data
            </div>
            <div>
              <kbd className="px-1.5 py-0.5 bg-muted rounded border text-xs">
                1
              </kbd>
              -
              <kbd className="px-1.5 py-0.5 bg-muted rounded border text-xs">
                3
              </kbd>{' '}
              - Sort by metric
            </div>
            <div>
              <kbd className="px-1.5 py-0.5 bg-muted rounded border text-xs">
                ?
              </kbd>{' '}
              - Show help overlay
            </div>
          </div>
        </div>
        <ABTestingDashboard {...args} />
      </div>
    )
  },
  args: {
    experiments: sampleExperiments,
    enableKeyboardShortcuts: true,
    onRefresh: () => console.log('Refreshing...'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo showcasing keyboard navigation. Click the dashboard to focus it, then try the keyboard shortcuts.',
      },
    },
  },
}

export const HighConfidence: Story = {
  name: 'High Confidence Configuration',
  args: {
    experiments: sampleExperiments,
    config: {
      confidenceLevel: 0.99,
      minSampleSize: 500,
      minEffect: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dashboard configured for 99% confidence level with stricter requirements.',
      },
    },
  },
}

export const LiveDemo: Story = {
  name: 'Live Data Simulation',
  render: (args) => {
    const [experiments, setExperiments] = React.useState(sampleExperiments)
    const [isRefreshing, setIsRefreshing] = React.useState(false)

    const simulateDataUpdate = () => {
      setIsRefreshing(true)
      setTimeout(() => {
        setExperiments((prev) =>
          prev.map((exp) => ({
            ...exp,
            metrics: new Map(
              Array.from(exp.metrics.entries()).map(([id, metrics]) => [
                id,
                {
                  ...metrics,
                  impressions:
                    metrics.impressions + Math.floor(Math.random() * 50),
                  conversions:
                    metrics.conversions + Math.floor(Math.random() * 15),
                  conversionRate:
                    (metrics.conversions + Math.floor(Math.random() * 15)) /
                    (metrics.impressions + Math.floor(Math.random() * 50)),
                },
              ])
            ),
          }))
        )
        setIsRefreshing(false)
      }, 800)
    }

    return (
      <ABTestingDashboard
        {...args}
        experiments={experiments}
        isLoading={isRefreshing}
        onRefresh={simulateDataUpdate}
      />
    )
  },
  args: {
    showStatistics: true,
    enableKeyboardShortcuts: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Live demo with simulated data updates. Press R or click Refresh to simulate new data.',
      },
    },
  },
}
