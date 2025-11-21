import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { TokenOptimizationBadge } from '../../../packages/react/src/components/token-optimization-badge'
import type { TokenOptimizationStats } from '../../../packages/react/src/hooks/use-token-optimization'

const meta = {
  title: 'Advanced/Analytics/TokenOptimizationBadge',
  component: TokenOptimizationBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Token Optimization Badge

Compact badge displaying token savings and optimization status. Perfect for headers, toolbars, or anywhere space is limited.

## Features

- **Compact Display**: Minimal footprint
- **Token Savings**: Shows tokens saved
- **Cost Display**: Optional cost savings
- **Multiple Sizes**: SM, MD, LG variants
- **Status Indicator**: Visual optimization status

## Use Cases

- App headers and navigation
- Dashboard widgets
- Compact monitoring displays
- Status bars
`,
      },
    },
  },
  argTypes: {
    showCost: {
      control: 'boolean',
      description: 'Show cost savings',
      table: { defaultValue: { summary: 'false' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Badge size',
      table: { defaultValue: { summary: 'md' } },
    },
  },
} satisfies Meta<typeof TokenOptimizationBadge>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Mock Data
// ============================================================================

const mockStats: TokenOptimizationStats = {
  totalTokens: 15000,
  tokensSaved: 4500,
  costSaved: 0.135,
  cacheHits: 85,
  cacheMisses: 45,
  routedToSmaller: 15,
  compressionRatio: 0.30,
}

const mockStatsHigh: TokenOptimizationStats = {
  totalTokens: 50000,
  tokensSaved: 18000,
  costSaved: 2.45,
  cacheHits: 320,
  cacheMisses: 80,
  routedToSmaller: 65,
  compressionRatio: 0.36,
}

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  args: {
    stats: mockStats,
    showCost: false,
    size: 'md',
  },
}

export const WithCost: Story = {
  args: {
    stats: mockStats,
    showCost: true,
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Badge displaying both token savings and cost savings.',
      },
    },
  },
}

// ============================================================================
// Size Variants
// ============================================================================

export const SmallBadge: Story = {
  args: {
    stats: mockStats,
    size: 'sm',
  },
}

export const MediumBadge: Story = {
  args: {
    stats: mockStats,
    size: 'md',
  },
}

export const LargeBadge: Story = {
  args: {
    stats: mockStats,
    size: 'lg',
  },
}

export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground w-20">Small:</span>
        <TokenOptimizationBadge stats={mockStats} size="sm" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground w-20">Medium:</span>
        <TokenOptimizationBadge stats={mockStats} size="md" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground w-20">Large:</span>
        <TokenOptimizationBadge stats={mockStats} size="lg" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All badge sizes side by side.',
      },
    },
  },
}

// ============================================================================
// Context Examples
// ============================================================================

export const InHeader: Story = {
  render: () => (
    <header className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">AI Chat Dashboard</h1>
        <TokenOptimizationBadge stats={mockStats} showCost={true} size="sm" />
      </div>
      <nav className="flex items-center gap-2">
        <button className="px-3 py-1.5 text-sm rounded hover:bg-accent">Settings</button>
        <button className="px-3 py-1.5 text-sm rounded hover:bg-accent">Help</button>
      </nav>
    </header>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge in a typical application header.',
      },
    },
  },
}

export const InToolbar: Story = {
  render: () => (
    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
      <button className="px-3 py-1.5 text-sm border rounded hover:bg-card">Export</button>
      <button className="px-3 py-1.5 text-sm border rounded hover:bg-card">Share</button>
      <div className="flex-1" />
      <TokenOptimizationBadge stats={mockStats} size="sm" />
      <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90">
        Save
      </button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge in a toolbar with action buttons.',
      },
    },
  },
}

export const InSidebar: Story = {
  render: () => (
    <aside className="w-64 p-4 border-r space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Navigation</h3>
        <nav className="space-y-1">
          <button className="w-full text-left px-3 py-2 text-sm rounded hover:bg-accent">
            Dashboard
          </button>
          <button className="w-full text-left px-3 py-2 text-sm rounded hover:bg-accent">
            Conversations
          </button>
          <button className="w-full text-left px-3 py-2 text-sm rounded hover:bg-accent">
            Settings
          </button>
        </nav>
      </div>
      <div className="pt-4 border-t">
        <h4 className="text-xs font-semibold mb-2 text-muted-foreground">Optimization</h4>
        <TokenOptimizationBadge stats={mockStats} showCost={true} size="sm" />
      </div>
    </aside>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge in a sidebar navigation.',
      },
    },
  },
}

// ============================================================================
// Real-Time Updates
// ============================================================================

export const LiveUpdates: Story = {
  render: () => {
    const [stats, setStats] = React.useState(mockStats)

    React.useEffect(() => {
      const interval = setInterval(() => {
        setStats((prev) => ({
          ...prev,
          totalTokens: prev.totalTokens + Math.floor(Math.random() * 200) + 50,
          tokensSaved: prev.tokensSaved + Math.floor(Math.random() * 50) + 10,
          costSaved: prev.costSaved + Math.random() * 0.01,
        }))
      }, 2000)

      return () => clearInterval(interval)
    }, [])

    return (
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Badge updates every 2 seconds with simulated activity
          </p>
        </div>
        <TokenOptimizationBadge stats={stats} showCost={true} />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Badge with live updating statistics.',
      },
    },
  },
}

// ============================================================================
// Status Levels
// ============================================================================

export const DifferentSavingsLevels: Story = {
  render: () => {
    const lowSavings: TokenOptimizationStats = {
      totalTokens: 5000,
      tokensSaved: 500,
      costSaved: 0.015,
      cacheHits: 10,
      cacheMisses: 40,
      routedToSmaller: 2,
      compressionRatio: 0.10,
    }

    const mediumSavings: TokenOptimizationStats = {
      totalTokens: 15000,
      tokensSaved: 4500,
      costSaved: 0.135,
      cacheHits: 85,
      cacheMisses: 45,
      routedToSmaller: 15,
      compressionRatio: 0.30,
    }

    const highSavings: TokenOptimizationStats = {
      totalTokens: 50000,
      tokensSaved: 20000,
      costSaved: 0.60,
      cacheHits: 320,
      cacheMisses: 80,
      routedToSmaller: 65,
      compressionRatio: 0.40,
    }

    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Low Optimization (10% savings)</h4>
          <TokenOptimizationBadge stats={lowSavings} showCost={true} />
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Medium Optimization (30% savings)</h4>
          <TokenOptimizationBadge stats={mediumSavings} showCost={true} />
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">High Optimization (40% savings)</h4>
          <TokenOptimizationBadge stats={highSavings} showCost={true} />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Badges showing different levels of optimization efficiency.',
      },
    },
  },
}

// ============================================================================
// Interactive Demo
// ============================================================================

export const InteractiveDemo: Story = {
  render: () => {
    const [stats, setStats] = React.useState(mockStats)
    const [showCost, setShowCost] = React.useState(false)
    const [size, setSize] = React.useState<'sm' | 'md' | 'lg'>('md')

    const addActivity = () => {
      setStats((prev) => ({
        ...prev,
        totalTokens: prev.totalTokens + Math.floor(Math.random() * 500) + 200,
        tokensSaved: prev.tokensSaved + Math.floor(Math.random() * 150) + 50,
        costSaved: prev.costSaved + Math.random() * 0.05,
      }))
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={addActivity}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Simulate Activity
          </button>
          <button
            onClick={() => setStats(mockStats)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80"
          >
            Reset
          </button>
        </div>

        <div className="flex flex-wrap gap-4 p-4 bg-muted rounded-lg">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showCost}
              onChange={(e) => setShowCost(e.target.checked)}
            />
            <span className="text-sm">Show Cost</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm">Size:</span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as 'sm' | 'md' | 'lg')}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
        </div>

        <TokenOptimizationBadge stats={stats} showCost={showCost} size={size} />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo with controls to customize the badge.',
      },
    },
  },
}
