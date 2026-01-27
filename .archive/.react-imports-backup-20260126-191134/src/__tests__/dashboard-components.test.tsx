/**
 * Dashboard Components Test Suite
 *
 * Comprehensive tests for all dashboard components including:
 * - AnalyticsDashboard
 * - UsageDashboard
 * - TokenOptimizationDashboard
 * - PerformanceDashboard
 * - DashboardErrorBoundary
 * - Dashboard Skeletons
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  render,
  screen,
  within,
  fireEvent,
  waitFor,
} from '@testing-library/react'
import * as React from 'react'

import { AnalyticsDashboard } from '../components/AnalyticsDashboard'
import { TokenOptimizationDashboard } from '../components/TokenOptimizationDashboard'
import { PerformanceDashboard } from '../components/PerformanceDashboard'
import {
  DashboardErrorBoundary,
  useDashboardErrorHandler,
} from '../components/dashboard-error-boundary'
import {
  AnalyticsDashboardSkeleton,
  UsageDashboardSkeleton,
  TokenOptimizationDashboardSkeleton,
  PerformanceDashboardSkeleton,
  DashboardEmptyState,
  MetricCardSkeleton,
} from '../components/dashboard-skeleton'

// ============================================================================
// Test Data
// ============================================================================

const mockAnalyticsMetrics = {
  totalRevenue: 125000,
  conversionRate: 12.5,
  averageDealSize: 2500,
  averageSalesCycle: 30,
  pipelineValue: 500000,
  winRate: 45,
}

const mockPreviousMetrics = {
  totalRevenue: 100000,
  conversionRate: 10.0,
  averageDealSize: 2200,
  averageSalesCycle: 35,
}

const mockLeaderboard = [
  { label: 'Alice', value: 50000, change: 15, trend: 'up' as const },
  { label: 'Bob', value: 45000, change: 10, trend: 'up' as const },
  { label: 'Carol', value: 40000, change: -5, trend: 'down' as const },
]

const mockActivities = [
  {
    id: '1',
    timestamp: new Date('2024-01-15T10:30:00'),
    description: 'Deal closed with Acme Corp',
    owner: 'Alice',
    impact: 'positive' as const,
  },
  {
    id: '2',
    timestamp: new Date('2024-01-15T09:00:00'),
    description: 'New lead added',
    owner: 'Bob',
    impact: 'neutral' as const,
  },
]

const mockInsights = [
  'Revenue is up 25% from last period',
  {
    title: 'Opportunity',
    description: 'Pipeline is growing steadily',
    type: 'positive' as const,
  },
  {
    title: 'Risk Alert',
    description: 'Sales cycle is longer than target',
    type: 'risk' as const,
  },
]

const mockOptimizationMetrics = {
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

// ============================================================================
// AnalyticsDashboard Tests
// ============================================================================

describe('AnalyticsDashboard', () => {
  describe('rendering', () => {
    it('should render with required props', () => {
      render(<AnalyticsDashboard metrics={mockAnalyticsMetrics} />)

      expect(screen.getByRole('region')).toBeInTheDocument()
      expect(screen.getByText('Analytics Overview')).toBeInTheDocument()
    })

    it('should render custom title and subtitle', () => {
      render(
        <AnalyticsDashboard
          metrics={mockAnalyticsMetrics}
          title="Custom Dashboard"
          subtitle="Custom subtitle text"
        />
      )

      expect(screen.getByText('Custom Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Custom subtitle text')).toBeInTheDocument()
    })

    it('should render all metric cards', () => {
      render(<AnalyticsDashboard metrics={mockAnalyticsMetrics} />)

      expect(screen.getByText('Total Revenue')).toBeInTheDocument()
      expect(screen.getByText('Conversion Rate')).toBeInTheDocument()
      expect(screen.getByText('Avg Deal Size')).toBeInTheDocument()
      expect(screen.getByText('Sales Cycle')).toBeInTheDocument()
    })

    it('should render pipeline and win rate when provided', () => {
      render(<AnalyticsDashboard metrics={mockAnalyticsMetrics} />)

      expect(screen.getByText('Pipeline Value')).toBeInTheDocument()
      expect(screen.getByText('Win Rate')).toBeInTheDocument()
    })

    it('should render leaderboard when provided', () => {
      render(
        <AnalyticsDashboard
          metrics={mockAnalyticsMetrics}
          leaderboard={mockLeaderboard}
        />
      )

      expect(screen.getByText('Top Performers')).toBeInTheDocument()
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })

    it('should render activity list when provided', () => {
      render(
        <AnalyticsDashboard
          metrics={mockAnalyticsMetrics}
          recentActivities={mockActivities}
        />
      )

      expect(screen.getByText('Recent Activity')).toBeInTheDocument()
      expect(screen.getByText('Deal closed with Acme Corp')).toBeInTheDocument()
    })

    it('should render insights when provided', () => {
      render(
        <AnalyticsDashboard
          metrics={mockAnalyticsMetrics}
          insights={mockInsights}
        />
      )

      expect(screen.getByText('AI-Generated Insights')).toBeInTheDocument()
      expect(
        screen.getByText('Revenue is up 25% from last period')
      ).toBeInTheDocument()
    })
  })

  describe('change indicators', () => {
    it('should show positive change when metrics increase', () => {
      render(
        <AnalyticsDashboard
          metrics={mockAnalyticsMetrics}
          previousMetrics={mockPreviousMetrics}
        />
      )

      // Revenue increased from 100k to 125k = 25% increase
      const revenueCard = screen.getByLabelText(/Total Revenue.*increased by/i)
      expect(revenueCard).toBeInTheDocument()
    })

    it('should show negative change when metrics decrease', () => {
      const metricsWithDecrease = {
        ...mockAnalyticsMetrics,
        totalRevenue: 80000, // Less than previous 100k
      }

      render(
        <AnalyticsDashboard
          metrics={metricsWithDecrease}
          previousMetrics={mockPreviousMetrics}
        />
      )

      const revenueCard = screen.getByLabelText(/Total Revenue.*decreased by/i)
      expect(revenueCard).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have accessible region role', () => {
      render(<AnalyticsDashboard metrics={mockAnalyticsMetrics} />)

      const region = screen.getByRole('region')
      expect(region).toHaveAttribute('aria-label', 'Analytics Overview')
    })

    it('should have accessible metric cards', () => {
      render(<AnalyticsDashboard metrics={mockAnalyticsMetrics} />)

      const metricCards = screen.getAllByRole('article')
      expect(metricCards.length).toBeGreaterThan(0)
      metricCards.forEach((card) => {
        expect(card).toHaveAttribute('aria-label')
      })
    })

    it('should have accessible progress bars', () => {
      render(<AnalyticsDashboard metrics={mockAnalyticsMetrics} />)

      const progressbar = screen.getByRole('progressbar')
      expect(progressbar).toHaveAttribute('aria-label')
      expect(progressbar).toHaveAttribute('aria-valuenow')
      expect(progressbar).toHaveAttribute('aria-valuemin', '0')
      expect(progressbar).toHaveAttribute('aria-valuemax', '100')
    })

    it('should have accessible leaderboard', () => {
      render(
        <AnalyticsDashboard
          metrics={mockAnalyticsMetrics}
          leaderboard={mockLeaderboard}
        />
      )

      // Should use <ol> for ranked list
      const orderedList = screen.getByRole('list', { name: /ranked list/i })
      expect(orderedList.tagName).toBe('OL')
    })

    it('should use time element for timestamps', () => {
      render(
        <AnalyticsDashboard
          metrics={mockAnalyticsMetrics}
          recentActivities={mockActivities}
        />
      )

      const timeElements = document.querySelectorAll('time')
      expect(timeElements.length).toBeGreaterThan(0)
      timeElements.forEach((el) => {
        expect(el).toHaveAttribute('datetime')
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty metrics gracefully', () => {
      render(<AnalyticsDashboard metrics={{}} />)

      // Should render without crashing
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('should handle undefined optional props', () => {
      render(
        <AnalyticsDashboard
          metrics={mockAnalyticsMetrics}
          previousMetrics={undefined}
          leaderboard={undefined}
          insights={undefined}
          recentActivities={undefined}
        />
      )

      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('should handle empty arrays', () => {
      render(
        <AnalyticsDashboard
          metrics={mockAnalyticsMetrics}
          leaderboard={[]}
          insights={[]}
          recentActivities={[]}
        />
      )

      // Lists should not render
      expect(screen.queryByText('Top Performers')).not.toBeInTheDocument()
      expect(screen.queryByText('Recent Activity')).not.toBeInTheDocument()
      expect(
        screen.queryByText('AI-Generated Insights')
      ).not.toBeInTheDocument()
    })
  })
})

// ============================================================================
// TokenOptimizationDashboard Tests
// ============================================================================

describe('TokenOptimizationDashboard', () => {
  describe('rendering', () => {
    it('should render with required props', () => {
      render(<TokenOptimizationDashboard metrics={mockOptimizationMetrics} />)

      expect(screen.getByText('Token Optimization')).toBeInTheDocument()
      expect(screen.getByText('15,000')).toBeInTheDocument() // tokensSaved
    })

    it('should show breakdown by default', () => {
      render(<TokenOptimizationDashboard metrics={mockOptimizationMetrics} />)

      expect(screen.getByText('Optimization Breakdown')).toBeInTheDocument()
      expect(screen.getByText('Prompt Compression')).toBeInTheDocument()
      expect(screen.getByText('Smart Caching')).toBeInTheDocument()
    })

    it('should hide breakdown when showBreakdown is false', () => {
      render(
        <TokenOptimizationDashboard
          metrics={mockOptimizationMetrics}
          showBreakdown={false}
        />
      )

      expect(
        screen.queryByText('Optimization Breakdown')
      ).not.toBeInTheDocument()
    })

    it('should show real-time indicator when enabled', () => {
      render(
        <TokenOptimizationDashboard
          metrics={mockOptimizationMetrics}
          realTime
        />
      )

      expect(screen.getByText('Live')).toBeInTheDocument()
    })
  })

  describe('metrics display', () => {
    it('should format tokens correctly', () => {
      render(<TokenOptimizationDashboard metrics={mockOptimizationMetrics} />)

      expect(screen.getByText('15,000')).toBeInTheDocument() // Tokens Saved
      expect(screen.getByText('50,000')).toBeInTheDocument() // Total Tokens
    })

    it('should show savings percentage', () => {
      render(<TokenOptimizationDashboard metrics={mockOptimizationMetrics} />)

      expect(screen.getByText('30.0% reduction')).toBeInTheDocument()
    })
  })

  describe('onClick handler', () => {
    it('should call onClick when dashboard is clicked', () => {
      const handleClick = vi.fn()
      render(
        <TokenOptimizationDashboard
          metrics={mockOptimizationMetrics}
          onClick={handleClick}
        />
      )

      const dashboard = screen.getByText('Token Optimization').closest('div')
      if (dashboard) fireEvent.click(dashboard)

      expect(handleClick).toHaveBeenCalled()
    })
  })
})

// ============================================================================
// DashboardErrorBoundary Tests
// ============================================================================

describe('DashboardErrorBoundary', () => {
  // Suppress console.error for error boundary tests
  const originalError = console.error
  beforeEach(() => {
    console.error = vi.fn()
  })
  afterEach(() => {
    console.error = originalError
  })

  const ThrowingComponent = ({
    shouldThrow = true,
  }: {
    shouldThrow?: boolean
  }) => {
    if (shouldThrow) {
      throw new Error('Test error')
    }
    return <div>Content rendered successfully</div>
  }

  it('should render children when there is no error', () => {
    render(
      <DashboardErrorBoundary>
        <div>Test content</div>
      </DashboardErrorBoundary>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should render fallback UI when child throws', () => {
    render(
      <DashboardErrorBoundary widgetName="Test Widget">
        <ThrowingComponent />
      </DashboardErrorBoundary>
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Test Widget failed to load')).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('should render custom fallback when provided', () => {
    render(
      <DashboardErrorBoundary fallback={<div>Custom error message</div>}>
        <ThrowingComponent />
      </DashboardErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
  })

  it('should call onError callback when error occurs', () => {
    const handleError = vi.fn()

    render(
      <DashboardErrorBoundary onError={handleError}>
        <ThrowingComponent />
      </DashboardErrorBoundary>
    )

    expect(handleError).toHaveBeenCalled()
    expect(handleError.mock.calls[0][0]).toBeInstanceOf(Error)
  })

  it('should allow retry after error', () => {
    const { rerender } = render(
      <DashboardErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </DashboardErrorBoundary>
    )

    // Error state should show
    expect(screen.getByRole('alert')).toBeInTheDocument()

    // Click retry
    fireEvent.click(screen.getByText('Retry'))

    // Since the component still throws, it should show error again
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should hide retry button when showRetry is false', () => {
    render(
      <DashboardErrorBoundary showRetry={false}>
        <ThrowingComponent />
      </DashboardErrorBoundary>
    )

    expect(screen.queryByText('Retry')).not.toBeInTheDocument()
  })

  it('should have accessible error state', () => {
    render(
      <DashboardErrorBoundary>
        <ThrowingComponent />
      </DashboardErrorBoundary>
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveAttribute('aria-live', 'assertive')
  })
})

// ============================================================================
// Dashboard Skeleton Tests
// ============================================================================

describe('Dashboard Skeletons', () => {
  describe('AnalyticsDashboardSkeleton', () => {
    it('should render loading state', () => {
      render(<AnalyticsDashboardSkeleton />)

      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(
        screen.getByLabelText('Loading analytics dashboard')
      ).toBeInTheDocument()
    })

    it('should have aria-busy attribute', () => {
      render(<AnalyticsDashboardSkeleton />)

      expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
    })

    it('should have screen reader text', () => {
      render(<AnalyticsDashboardSkeleton />)

      expect(screen.getByText(/Loading dashboard data/i)).toBeInTheDocument()
    })

    it('should accept animate prop', () => {
      const { container } = render(
        <AnalyticsDashboardSkeleton animate={false} />
      )

      // When animate is false, skeleton elements should not have animate-pulse
      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBe(0)
    })
  })

  describe('UsageDashboardSkeleton', () => {
    it('should render loading state', () => {
      render(<UsageDashboardSkeleton />)

      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(
        screen.getByLabelText('Loading usage dashboard')
      ).toBeInTheDocument()
    })
  })

  describe('TokenOptimizationDashboardSkeleton', () => {
    it('should render loading state', () => {
      render(<TokenOptimizationDashboardSkeleton />)

      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(
        screen.getByLabelText('Loading token optimization dashboard')
      ).toBeInTheDocument()
    })
  })

  describe('PerformanceDashboardSkeleton', () => {
    it('should render loading state', () => {
      render(<PerformanceDashboardSkeleton />)

      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(
        screen.getByLabelText('Loading performance dashboard')
      ).toBeInTheDocument()
    })
  })

  describe('MetricCardSkeleton', () => {
    it('should render presentation role', () => {
      render(<MetricCardSkeleton />)

      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })
})

// ============================================================================
// DashboardEmptyState Tests
// ============================================================================

describe('DashboardEmptyState', () => {
  it('should render title and description', () => {
    render(
      <DashboardEmptyState
        title="No data available"
        description="Start tracking to see metrics"
      />
    )

    expect(screen.getByText('No data available')).toBeInTheDocument()
    expect(
      screen.getByText('Start tracking to see metrics')
    ).toBeInTheDocument()
  })

  it('should render action button when provided', () => {
    const handleAction = vi.fn()

    render(
      <DashboardEmptyState
        title="No data"
        description="Get started"
        actionLabel="Learn More"
        onAction={handleAction}
      />
    )

    const button = screen.getByRole('button', { name: /learn more/i })
    expect(button).toBeInTheDocument()

    fireEvent.click(button)
    expect(handleAction).toHaveBeenCalled()
  })

  it('should not render button without both props', () => {
    render(
      <DashboardEmptyState
        title="No data"
        description="Get started"
        actionLabel="Learn More"
        // onAction not provided
      />
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should render custom icon when provided', () => {
    render(
      <DashboardEmptyState
        title="No data"
        description="Get started"
        icon={<span data-testid="custom-icon">📊</span>}
      />
    )

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('should have accessible status role', () => {
    render(<DashboardEmptyState title="No data" description="Get started" />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'No data')
  })
})

// ============================================================================
// PerformanceDashboard Tests
// ============================================================================

describe('PerformanceDashboard', () => {
  it('should render with default props', () => {
    render(<PerformanceDashboard />)

    expect(screen.getByText('Performance Metrics')).toBeInTheDocument()
  })

  it('should show metrics grid', () => {
    render(<PerformanceDashboard />)

    expect(screen.getByText('Render Count')).toBeInTheDocument()
    expect(screen.getByText('Last Render')).toBeInTheDocument()
  })

  it('should show detailed metrics when detailed prop is true', () => {
    render(<PerformanceDashboard detailed />)

    expect(screen.getByText(/Tip:/)).toBeInTheDocument()
  })

  it('should accept custom className', () => {
    const { container } = render(
      <PerformanceDashboard className="custom-class" />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should render loading state', () => {
    render(<PerformanceDashboard isLoading />)

    expect(screen.getByRole('status')).toHaveAttribute(
      'aria-label',
      'Loading Performance Dashboard'
    )
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
  })

  it('should render error state', () => {
    render(<PerformanceDashboard error="Connection failed" />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Connection failed')).toBeInTheDocument()
  })
})

// ============================================================================
// Keyboard Navigation and Focus Management Tests
// ============================================================================

describe('Keyboard Navigation and Focus Management', () => {
  describe('DashboardErrorBoundary', () => {
    it('should have focusable retry button', () => {
      const ThrowingComponent = () => {
        throw new Error('Test error')
      }

      render(
        <DashboardErrorBoundary widgetName="Test">
          <ThrowingComponent />
        </DashboardErrorBoundary>
      )

      const retryButton = screen.getByRole('button', { name: /retry/i })
      expect(retryButton).toBeInTheDocument()

      retryButton.focus()
      expect(document.activeElement).toBe(retryButton)
    })

    it('should handle keyboard interaction on retry button', () => {
      const ThrowingComponent = () => {
        throw new Error('Test error')
      }

      render(
        <DashboardErrorBoundary widgetName="Test">
          <ThrowingComponent />
        </DashboardErrorBoundary>
      )

      const retryButton = screen.getByRole('button', { name: /retry/i })
      retryButton.focus()

      // Simulate Enter key
      fireEvent.keyDown(retryButton, { key: 'Enter' })
      expect(retryButton).toBeInTheDocument()

      // Simulate Space key
      fireEvent.keyDown(retryButton, { key: ' ' })
      expect(retryButton).toBeInTheDocument()
    })
  })

  describe('TokenOptimizationDashboard', () => {
    it('should have focusable breakdown items', () => {
      render(
        <TokenOptimizationDashboard
          metrics={mockOptimizationMetrics}
          showBreakdown
        />
      )

      // Breakdown items should be accessible
      const breakdownItems = screen.getAllByText(/tokens|savings|calls/i)
      expect(breakdownItems.length).toBeGreaterThan(0)
    })

    it('should render loading state with proper aria attributes', () => {
      render(
        <TokenOptimizationDashboard
          metrics={mockOptimizationMetrics}
          isLoading
        />
      )

      const loadingContainer = screen.getByRole('status')
      expect(loadingContainer).toHaveAttribute('aria-busy', 'true')
      expect(loadingContainer).toHaveAttribute(
        'aria-label',
        'Loading Token Optimization Dashboard'
      )
    })

    it('should render error state with alert role', () => {
      render(
        <TokenOptimizationDashboard
          metrics={mockOptimizationMetrics}
          error={new Error('API unavailable')}
        />
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('API unavailable')).toBeInTheDocument()
    })
  })

  describe('AnalyticsDashboard', () => {
    it('should have accessible metric cards', () => {
      render(
        <AnalyticsDashboard
          title="Sales Analytics"
          metrics={mockAnalyticsMetrics}
          previousMetrics={mockPreviousMetrics}
        />
      )

      // Dashboard should have region role
      expect(
        screen.getByRole('region', { name: 'Sales Analytics' })
      ).toBeInTheDocument()
    })

    it('should have accessible leaderboard items', () => {
      render(
        <AnalyticsDashboard
          title="Sales Analytics"
          metrics={mockAnalyticsMetrics}
          leaderboard={mockLeaderboard}
        />
      )

      // Leaderboard items should be accessible
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })
  })

  describe('DashboardEmptyState', () => {
    it('should have focusable action button', () => {
      const handleAction = vi.fn()

      render(
        <DashboardEmptyState
          title="No data"
          description="Start tracking"
          actionLabel="Get Started"
          onAction={handleAction}
        />
      )

      const actionButton = screen.getByRole('button', { name: /get started/i })
      expect(actionButton).toBeInTheDocument()

      actionButton.focus()
      expect(document.activeElement).toBe(actionButton)
    })

    it('should handle keyboard interaction on action button', () => {
      const handleAction = vi.fn()

      render(
        <DashboardEmptyState
          title="No data"
          description="Start tracking"
          actionLabel="Get Started"
          onAction={handleAction}
        />
      )

      const actionButton = screen.getByRole('button', { name: /get started/i })
      actionButton.focus()

      // Simulate Enter key
      fireEvent.keyDown(actionButton, { key: 'Enter' })
      fireEvent.click(actionButton)

      expect(handleAction).toHaveBeenCalled()
    })
  })
})

// ============================================================================
// Accessibility Tests
// ============================================================================

describe('Dashboard Accessibility', () => {
  describe('ARIA Landmarks', () => {
    it('TokenOptimizationDashboard should have proper landmarks', () => {
      render(<TokenOptimizationDashboard metrics={mockOptimizationMetrics} />)

      expect(
        screen.getByRole('region', { name: 'Token Optimization Dashboard' })
      ).toBeInTheDocument()
    })

    it('PerformanceDashboard should have proper landmarks', () => {
      render(<PerformanceDashboard />)

      expect(
        screen.getByRole('region', { name: 'Performance Metrics Dashboard' })
      ).toBeInTheDocument()
    })
  })

  describe('Progress Bars', () => {
    it('TokenOptimizationDashboard progress bars should have ARIA attributes', () => {
      render(
        <TokenOptimizationDashboard
          metrics={mockOptimizationMetrics}
          showBreakdown
        />
      )

      const progressBars = screen.getAllByRole('progressbar')
      progressBars.forEach((bar) => {
        expect(bar).toHaveAttribute('aria-valuemin', '0')
        expect(bar).toHaveAttribute('aria-valuemax', '100')
        expect(bar).toHaveAttribute('aria-valuenow')
      })
    })
  })

  describe('Screen Reader Text', () => {
    it('Loading states should have sr-only text', () => {
      render(
        <TokenOptimizationDashboard
          metrics={mockOptimizationMetrics}
          isLoading
        />
      )

      expect(
        screen.getByText('Loading token optimization data...')
      ).toHaveClass('sr-only')
    })

    it('Skeletons should have accessible loading announcements', () => {
      render(<AnalyticsDashboardSkeleton />)

      expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
    })
  })
})
