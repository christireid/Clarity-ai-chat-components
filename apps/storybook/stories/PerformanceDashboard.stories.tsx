import type { Meta, StoryObj } from '@storybook/react'
import { PerformanceDashboard } from '@clarity-chat/react'

/**
 * PerformanceDashboard displays real-time performance metrics.
 * 
 * **Key Features:**
 * - Response time tracking
 * - Token usage monitoring
 * - Error rate visualization
 * - Cost analysis
 * 
 * **Use Cases:**
 * - System monitoring
 * - Performance optimization
 * - Cost management
 * - SLA tracking
 */
const meta = {
  title: 'Components/PerformanceDashboard',
  component: PerformanceDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Real-time performance monitoring dashboard with metrics and visualizations.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PerformanceDashboard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    metrics: {
      avgResponseTime: 1234,
      p95ResponseTime: 2100,
      p99ResponseTime: 3400,
      totalRequests: 15420,
      errorRate: 0.02,
      tokensUsed: 1250000,
      totalCost: 45.67,
      uptime: 99.97,
    },
  },
}

export const HighPerformance: Story = {
  args: {
    metrics: {
      avgResponseTime: 450,
      p95ResponseTime: 800,
      p99ResponseTime: 1200,
      totalRequests: 50000,
      errorRate: 0.001,
      tokensUsed: 5000000,
      totalCost: 125.50,
      uptime: 99.99,
    },
  },
}

export const WithAlerts: Story = {
  args: {
    metrics: {
      avgResponseTime: 3500,
      p95ResponseTime: 5200,
      p99ResponseTime: 8100,
      totalRequests: 8420,
      errorRate: 0.08,
      tokensUsed: 850000,
      totalCost: 78.90,
      uptime: 98.5,
    },
    alerts: [
      { type: 'warning', message: 'Response time above threshold' },
      { type: 'error', message: 'Error rate elevated' },
      { type: 'warning', message: 'Uptime below SLA' },
    ],
  },
}

export const WithTrends: Story = {
  args: {
    metrics: {
      avgResponseTime: 1234,
      p95ResponseTime: 2100,
      p99ResponseTime: 3400,
      totalRequests: 15420,
      errorRate: 0.02,
      tokensUsed: 1250000,
      totalCost: 45.67,
      uptime: 99.97,
    },
    trends: {
      responseTime: [1100, 1150, 1200, 1180, 1234],
      errorRate: [0.015, 0.018, 0.020, 0.019, 0.020],
      requests: [12000, 13500, 14200, 14800, 15420],
    },
  },
}

export const RealTimeUpdates: Story = {
  render: () => {
    const [metrics, setMetrics] = React.useState({
      avgResponseTime: 1234,
      p95ResponseTime: 2100,
      p99ResponseTime: 3400,
      totalRequests: 15420,
      errorRate: 0.02,
      tokensUsed: 1250000,
      totalCost: 45.67,
      uptime: 99.97,
    })
    
    React.useEffect(() => {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          avgResponseTime: prev.avgResponseTime + (Math.random() - 0.5) * 100,
          totalRequests: prev.totalRequests + Math.floor(Math.random() * 10),
          tokensUsed: prev.tokensUsed + Math.floor(Math.random() * 1000),
        }))
      }, 2000)
      
      return () => clearInterval(interval)
    }, [])
    
    return <PerformanceDashboard metrics={metrics} realTime />
  },
}
