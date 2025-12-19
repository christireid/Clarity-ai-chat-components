import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { TokenOptimizationDashboard } from '@clarity-chat/react/internal'
import type { OptimizationMetrics } from '@clarity-chat/react/internal'

const meta = {
  title: 'Advanced/Analytics/TokenOptimizationDashboard',
  component: TokenOptimizationDashboard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Token Optimization Dashboard

Comprehensive dashboard displaying detailed token optimization metrics, savings breakdown, and technique-specific performance.

## Features

- **Detailed Breakdown**: By optimization technique
- **Real-Time Updates**: Optional live monitoring
- **Cost Calculations**: Accurate dollar amounts
- **Visual Metrics**: Progress bars and percentages
- **Technique Analysis**: Per-optimization strategy stats

## Optimization Techniques Tracked

- **Prompt Compression**: Token reduction via compression
- **Caching**: Response caching benefits
- **Model Routing**: Routing to cheaper models
- **Response Limiting**: Output length constraints
- **Request Batching**: Batch processing savings
- **Smart Throttling**: Throttled request savings
- **Referencing**: Data deduplication

## Use Cases

- Executive dashboards
- Cost optimization analysis
- Performance monitoring
- DevOps tools
`,
      },
    },
  },
  argTypes: {
    showBreakdown: {
      control: 'boolean',
      description: 'Show detailed breakdown by technique',
      table: { defaultValue: { summary: 'true' } },
    },
    realTime: {
      control: 'boolean',
      description: 'Enable real-time updates',
      table: { defaultValue: { summary: 'false' } },
    },
    refreshInterval: {
      control: 'number',
      description: 'Real-time refresh interval (ms)',
      table: { defaultValue: { summary: '5000' } },
    },
    costPerToken: {
      control: 'number',
      description: 'Cost per token for calculations',
      table: { defaultValue: { summary: '0.000002' } },
    },
  },
} satisfies Meta<typeof TokenOptimizationDashboard>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Mock Data
// ============================================================================

const mockMetricsSmall: OptimizationMetrics = {
  totalTokens: 10000,
  tokensSaved: 2500,
  costSaved: 0.075,
  breakdown: {
    promptCompression: { tokens: 800, percent: 32 },
    caching: { hits: 25, savings: 600 },
    modelRouting: { savings: 500, percent: 20 },
    responseLimiting: { tokens: 400, percent: 16 },
    batching: { requests: 15, savings: 150 },
    throttling: { callsSaved: 50 },
    referencing: { bytesSaved: 12000, percent: 48 },
  },
  savingsPercent: 25,
}

const mockMetricsMedium: OptimizationMetrics = {
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

const mockMetricsLarge: OptimizationMetrics = {
  totalTokens: 250000,
  tokensSaved: 90000,
  costSaved: 2.7,
  breakdown: {
    promptCompression: { tokens: 22000, percent: 24 },
    caching: { hits: 850, savings: 28000 },
    modelRouting: { savings: 20000, percent: 45 },
    responseLimiting: { tokens: 12000, percent: 18 },
    batching: { requests: 280, savings: 5000 },
    throttling: { callsSaved: 1200 },
    referencing: { bytesSaved: 280000, percent: 65 },
  },
  savingsPercent: 36,
}

const mockMetricsEnterprise: OptimizationMetrics = {
  totalTokens: 1000000,
  tokensSaved: 380000,
  costSaved: 11.4,
  breakdown: {
    promptCompression: { tokens: 95000, percent: 25 },
    caching: { hits: 4200, savings: 125000 },
    modelRouting: { savings: 85000, percent: 48 },
    responseLimiting: { tokens: 45000, percent: 20 },
    batching: { requests: 1250, savings: 18000 },
    throttling: { callsSaved: 5800 },
    referencing: { bytesSaved: 1200000, percent: 70 },
  },
  savingsPercent: 38,
}

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  args: {
    metrics: mockMetricsMedium,
    showBreakdown: true,
  },
}

export const WithoutBreakdown: Story = {
  args: {
    metrics: mockMetricsMedium,
    showBreakdown: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Simplified dashboard showing only summary metrics.',
      },
    },
  },
}

// ============================================================================
// Scale Examples
// ============================================================================

export const SmallScale: Story = {
  args: {
    metrics: mockMetricsSmall,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard for small-scale usage (10K tokens).',
      },
    },
  },
}

export const MediumScale: Story = {
  args: {
    metrics: mockMetricsMedium,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard for medium-scale usage (50K tokens).',
      },
    },
  },
}

export const LargeScale: Story = {
  args: {
    metrics: mockMetricsLarge,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard for large-scale usage (250K tokens).',
      },
    },
  },
}

export const EnterpriseScale: Story = {
  args: {
    metrics: mockMetricsEnterprise,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard for enterprise-scale usage (1M+ tokens).',
      },
    },
  },
}

// ============================================================================
// Real-Time Updates
// ============================================================================

export const RealTimeMonitoring: Story = {
  render: () => {
    const [metrics, setMetrics] =
      React.useState<OptimizationMetrics>(mockMetricsMedium)

    React.useEffect(() => {
      const interval = setInterval(() => {
        setMetrics((prev) => {
          const additionalTokens = Math.floor(Math.random() * 1000) + 500
          const additionalSavings = Math.floor(Math.random() * 300) + 150

          return {
            totalTokens: prev.totalTokens + additionalTokens,
            tokensSaved: prev.tokensSaved + additionalSavings,
            costSaved: prev.costSaved + additionalSavings * 0.000003,
            breakdown: {
              promptCompression: {
                tokens:
                  prev.breakdown.promptCompression.tokens +
                  Math.floor(Math.random() * 80) +
                  20,
                percent: prev.breakdown.promptCompression.percent,
              },
              caching: {
                hits:
                  prev.breakdown.caching.hits +
                  Math.floor(Math.random() * 3) +
                  1,
                savings:
                  prev.breakdown.caching.savings +
                  Math.floor(Math.random() * 100) +
                  50,
              },
              modelRouting: {
                savings:
                  prev.breakdown.modelRouting.savings +
                  Math.floor(Math.random() * 80) +
                  30,
                percent: prev.breakdown.modelRouting.percent,
              },
              responseLimiting: {
                tokens:
                  prev.breakdown.responseLimiting.tokens +
                  Math.floor(Math.random() * 50) +
                  20,
                percent: prev.breakdown.responseLimiting.percent,
              },
              batching: {
                requests:
                  prev.breakdown.batching.requests +
                  Math.floor(Math.random() * 2),
                savings:
                  prev.breakdown.batching.savings +
                  Math.floor(Math.random() * 30) +
                  10,
              },
              throttling: {
                callsSaved:
                  prev.breakdown.throttling.callsSaved +
                  Math.floor(Math.random() * 5) +
                  1,
              },
              referencing: {
                bytesSaved:
                  prev.breakdown.referencing.bytesSaved +
                  Math.floor(Math.random() * 1000) +
                  500,
                percent: prev.breakdown.referencing.percent,
              },
            },
            savingsPercent: Math.round(
              ((prev.tokensSaved + additionalSavings) /
                (prev.totalTokens + additionalTokens)) *
                100
            ),
          }
        })
      }, 3000)

      return () => clearInterval(interval)
    }, [])

    return (
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Dashboard updates every 3 seconds to simulate real-time monitoring
          </p>
        </div>
        <TokenOptimizationDashboard metrics={metrics} />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Live dashboard with simulated real-time updates.',
      },
    },
  },
}

// ============================================================================
// Comparison Views
// ============================================================================

export const BeforeAfterComparison: Story = {
  render: () => {
    const beforeMetrics: OptimizationMetrics = {
      totalTokens: 50000,
      tokensSaved: 0,
      costSaved: 0,
      breakdown: {
        promptCompression: { tokens: 0, percent: 0 },
        caching: { hits: 0, savings: 0 },
        modelRouting: { savings: 0, percent: 0 },
        responseLimiting: { tokens: 0, percent: 0 },
        batching: { requests: 0, savings: 0 },
        throttling: { callsSaved: 0 },
        referencing: { bytesSaved: 0, percent: 0 },
      },
      savingsPercent: 0,
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-destructive">
            Before Optimization
          </h3>
          <TokenOptimizationDashboard metrics={beforeMetrics} />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-success">
            After Optimization
          </h3>
          <TokenOptimizationDashboard metrics={mockMetricsMedium} />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of before and after optimization.',
      },
    },
  },
}

// ============================================================================
// Interactive Demo
// ============================================================================

export const InteractiveDemo: Story = {
  render: () => {
    const [metrics, setMetrics] =
      React.useState<OptimizationMetrics>(mockMetricsSmall)
    const [showBreakdown, setShowBreakdown] = React.useState(true)

    const simulateUsage = () => {
      setMetrics((prev) => {
        const additionalTokens = Math.floor(Math.random() * 5000) + 2000
        const additionalSavings = Math.floor(Math.random() * 1500) + 600

        return {
          totalTokens: prev.totalTokens + additionalTokens,
          tokensSaved: prev.tokensSaved + additionalSavings,
          costSaved: prev.costSaved + additionalSavings * 0.000003,
          breakdown: {
            promptCompression: {
              tokens:
                prev.breakdown.promptCompression.tokens +
                Math.floor(Math.random() * 400) +
                100,
              percent: prev.breakdown.promptCompression.percent,
            },
            caching: {
              hits:
                prev.breakdown.caching.hits +
                Math.floor(Math.random() * 15) +
                5,
              savings:
                prev.breakdown.caching.savings +
                Math.floor(Math.random() * 500) +
                200,
            },
            modelRouting: {
              savings:
                prev.breakdown.modelRouting.savings +
                Math.floor(Math.random() * 400) +
                150,
              percent: prev.breakdown.modelRouting.percent,
            },
            responseLimiting: {
              tokens:
                prev.breakdown.responseLimiting.tokens +
                Math.floor(Math.random() * 250) +
                100,
              percent: prev.breakdown.responseLimiting.percent,
            },
            batching: {
              requests:
                prev.breakdown.batching.requests +
                Math.floor(Math.random() * 10) +
                3,
              savings:
                prev.breakdown.batching.savings +
                Math.floor(Math.random() * 150) +
                50,
            },
            throttling: {
              callsSaved:
                prev.breakdown.throttling.callsSaved +
                Math.floor(Math.random() * 25) +
                10,
            },
            referencing: {
              bytesSaved:
                prev.breakdown.referencing.bytesSaved +
                Math.floor(Math.random() * 5000) +
                2000,
              percent: prev.breakdown.referencing.percent,
            },
          },
          savingsPercent: Math.round(
            ((prev.tokensSaved + additionalSavings) /
              (prev.totalTokens + additionalTokens)) *
              100
          ),
        }
      })
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={simulateUsage}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Simulate API Usage
          </button>
          <button
            onClick={() => setMetrics(mockMetricsSmall)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80"
          >
            Reset Dashboard
          </button>
        </div>

        <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showBreakdown}
              onChange={(e) => setShowBreakdown(e.target.checked)}
            />
            <span className="text-sm">Show Technique Breakdown</span>
          </label>
        </div>

        <TokenOptimizationDashboard
          metrics={metrics}
          showBreakdown={showBreakdown}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive dashboard with simulated API usage and controls.',
      },
    },
  },
}

// ============================================================================
// Integration Example
// ============================================================================

export const FullPageDashboard: Story = {
  render: () => {
    const [metrics, setMetrics] =
      React.useState<OptimizationMetrics>(mockMetricsMedium)
    const [isRefreshing, setIsRefreshing] = React.useState(false)

    const refresh = async () => {
      setIsRefreshing(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMetrics((prev) => ({
        ...prev,
        totalTokens: prev.totalTokens + Math.floor(Math.random() * 2000) + 1000,
        tokensSaved: prev.tokensSaved + Math.floor(Math.random() * 600) + 300,
        costSaved: prev.costSaved + Math.random() * 0.02,
      }))
      setIsRefreshing(false)
    }

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Token Optimization</h1>
              <p className="text-muted-foreground mt-1">
                Monitor your token usage and cost savings
              </p>
            </div>
            <button
              onClick={refresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </header>

          <TokenOptimizationDashboard metrics={metrics} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Requests
              </h3>
              <p className="text-2xl font-bold mt-2">1,247</p>
              <p className="text-xs text-success mt-1">+12% from last week</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">
                Avg Response Time
              </h3>
              <p className="text-2xl font-bold mt-2">324ms</p>
              <p className="text-xs text-success mt-1">-8% from last week</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">
                Cache Hit Rate
              </h3>
              <p className="text-2xl font-bold mt-2">73%</p>
              <p className="text-xs text-success mt-1">+5% from last week</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Full-page dashboard with additional metrics and controls.',
      },
    },
  },
}
