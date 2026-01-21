import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnalyticsDashboard } from '@clarity-chat/react'

const meta = {
  title: 'Advanced/Analytics/AnalyticsDashboard',
  component: AnalyticsDashboard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Comprehensive analytics dashboard showing metrics, leaderboards, insights, and recent activities.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-6xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AnalyticsDashboard>

export default meta
type Story = StoryObj<typeof meta>

const sampleMetrics = {
  totalMessages: 1250,
  activeUsers: 342,
  avgResponseTime: 1.2,
  satisfactionScore: 4.5,
}

const previousMetrics = {
  totalMessages: 1100,
  activeUsers: 298,
  avgResponseTime: 1.5,
  satisfactionScore: 4.3,
}

const sampleLeaderboard = [
  { id: '1', name: 'Alice Johnson', value: 245, change: '+12%' },
  { id: '2', name: 'Bob Smith', value: 198, change: '+8%' },
  { id: '3', name: 'Charlie Brown', value: 156, change: '-3%' },
  { id: '4', name: 'Diana Prince', value: 134, change: '+15%' },
  { id: '5', name: 'Eve Wilson', value: 98, change: '+5%' },
]

const sampleInsights = [
  {
    id: '1',
    type: 'success' as const,
    title: 'Performance Improved',
    description: 'Average response time decreased by 20% this week',
  },
  {
    id: '2',
    type: 'info' as const,
    title: 'Feature Adoption',
    description: '45% of users are using the new voice input feature',
  },
  {
    id: '3',
    type: 'warning' as const,
    title: 'Usage Pattern',
    description: 'Peak usage hours are between 2-4 PM',
  },
]

const sampleActivities = [
  {
    id: '1',
    user: 'Alice Johnson',
    action: 'sent a message',
    time: '2 minutes ago',
  },
  {
    id: '2',
    user: 'Bob Smith',
    action: 'completed a task',
    time: '5 minutes ago',
  },
  {
    id: '3',
    user: 'Charlie Brown',
    action: 'shared a document',
    time: '10 minutes ago',
  },
  {
    id: '4',
    user: 'Diana Prince',
    action: 'created a conversation',
    time: '15 minutes ago',
  },
]

export const Default: Story = {
  args: {
    metrics: sampleMetrics,
    previousMetrics,
    leaderboard: sampleLeaderboard,
    insights: sampleInsights,
    recentActivities: sampleActivities,
  },
}

export const WithoutPreviousMetrics: Story = {
  args: {
    metrics: sampleMetrics,
    leaderboard: sampleLeaderboard,
    insights: sampleInsights,
    recentActivities: sampleActivities,
  },
}

export const Minimal: Story = {
  args: {
    metrics: sampleMetrics,
  },
}

export const CustomTitle: Story = {
  args: {
    metrics: sampleMetrics,
    previousMetrics,
    leaderboard: sampleLeaderboard,
    insights: sampleInsights,
    recentActivities: sampleActivities,
    title: 'Team Analytics Dashboard',
    subtitle: 'Real-time metrics and activity feed',
  },
}
