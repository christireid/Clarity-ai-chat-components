import type { Meta, StoryObj } from '@storybook/react'
import { SessionSummaryCard } from '@clarity-chat/react'

/**
 * SessionSummaryCard displays a summary of a chat session.
 * 
 * **Key Features:**
 * - Key metrics display
 * - Visual indicators
 * - Action buttons
 * - Responsive layout
 * 
 * **Use Cases:**
 * - Session history
 * - Analytics overview
 * - Quick access
 * - Performance metrics
 */
const meta = {
  title: 'Components/SessionSummaryCard',
  component: SessionSummaryCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Display a summary card for chat sessions with key metrics and actions.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SessionSummaryCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    sessionId: 'session-123',
    title: 'Product Support Chat',
    messageCount: 24,
    duration: 1800,
    participants: ['User', 'Support Bot'],
    status: 'completed',
    timestamp: Date.now() - 3600000,
  },
}

export const ActiveSession: Story = {
  args: {
    sessionId: 'session-456',
    title: 'Technical Discussion',
    messageCount: 12,
    duration: 900,
    participants: ['User', 'AI Assistant', 'Expert'],
    status: 'active',
    timestamp: Date.now() - 900000,
  },
}

export const LongSession: Story = {
  args: {
    sessionId: 'session-789',
    title: 'Comprehensive Code Review',
    messageCount: 156,
    duration: 7200,
    participants: ['Developer', 'AI Code Assistant'],
    status: 'completed',
    timestamp: Date.now() - 86400000,
    tags: ['code-review', 'python', 'refactoring'],
  },
}

export const WithActions: Story = {
  render: () => (
    <SessionSummaryCard
      sessionId="session-101"
      title="Customer Inquiry"
      messageCount={8}
      duration={300}
      participants={['Customer', 'Support Agent']}
      status="completed"
      timestamp={Date.now() - 1800000}
      onView={() => alert('View session')}
      onExport={() => alert('Export session')}
      onDelete={() => alert('Delete session')}
    />
  ),
}

export const SessionList: Story = {
  render: () => (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg mb-4">Recent Sessions</h3>
      
      <SessionSummaryCard
        sessionId="s1"
        title="Getting Started Tutorial"
        messageCount={15}
        duration={600}
        participants={['User', 'Onboarding Bot']}
        status="completed"
        timestamp={Date.now() - 3600000}
        satisfaction={5}
      />
      
      <SessionSummaryCard
        sessionId="s2"
        title="Bug Report Discussion"
        messageCount={32}
        duration={1200}
        participants={['User', 'Tech Support']}
        status="completed"
        timestamp={Date.now() - 7200000}
        satisfaction={4}
      />
      
      <SessionSummaryCard
        sessionId="s3"
        title="Feature Request Chat"
        messageCount={8}
        duration={420}
        participants={['User', 'Product Manager']}
        status="active"
        timestamp={Date.now() - 420000}
      />
      
      <SessionSummaryCard
        sessionId="s4"
        title="Account Setup Help"
        messageCount={6}
        duration={180}
        participants={['New User', 'Support Bot']}
        status="completed"
        timestamp={Date.now() - 10800000}
        satisfaction={5}
      />
    </div>
  ),
}

export const DashboardView: Story = {
  render: () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Session Dashboard</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
            Filter
          </button>
          <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
            Sort
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <SessionSummaryCard
          sessionId="today-1"
          title="Morning Support Session"
          messageCount={45}
          duration={2100}
          participants={['User A', 'Agent 1']}
          status="completed"
          timestamp={Date.now() - 14400000}
          tags={['support', 'billing']}
          satisfaction={5}
        />
        
        <SessionSummaryCard
          sessionId="today-2"
          title="Technical Integration Help"
          messageCount={67}
          duration={3600}
          participants={['Developer', 'Tech Specialist']}
          status="completed"
          timestamp={Date.now() - 10800000}
          tags={['technical', 'api', 'integration']}
          satisfaction={4}
        />
        
        <SessionSummaryCard
          sessionId="today-3"
          title="Product Demo Walkthrough"
          messageCount={28}
          duration={1800}
          participants={['Prospect', 'Sales Rep']}
          status="active"
          timestamp={Date.now() - 1800000}
          tags={['sales', 'demo']}
        />
      </div>
    </div>
  ),
}

export const WithMetrics: Story = {
  args: {
    sessionId: 'metrics-1',
    title: 'Analytics Discussion',
    messageCount: 42,
    duration: 2400,
    participants: ['User', 'Data Analyst AI'],
    status: 'completed',
    timestamp: Date.now() - 7200000,
    metrics: {
      avgResponseTime: 2.3,
      sentiment: 'positive',
      resolved: true,
      toolsUsed: 5,
    },
    tags: ['analytics', 'data-science'],
  },
}

export const CompactMode: Story = {
  render: () => (
    <div className="space-y-2">
      <SessionSummaryCard
        sessionId="c1"
        title="Quick Question"
        messageCount={3}
        duration={60}
        participants={['User', 'Bot']}
        status="completed"
        timestamp={Date.now() - 300000}
        compact
      />
      
      <SessionSummaryCard
        sessionId="c2"
        title="Follow-up Discussion"
        messageCount={7}
        duration={240}
        participants={['User', 'Support']}
        status="completed"
        timestamp={Date.now() - 900000}
        compact
      />
      
      <SessionSummaryCard
        sessionId="c3"
        title="Ongoing Chat"
        messageCount={12}
        duration={600}
        participants={['User', 'AI']}
        status="active"
        timestamp={Date.now() - 600000}
        compact
      />
    </div>
  ),
}
