'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  MessageSquare,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'

// ISR Configuration
export const revalidate = 3600

// ============================================================================
// Mock Data
// ============================================================================

const mockStats = {
  totalConversations: 12487,
  activeUsers: 3542,
  messagesPerDay: 45231,
  avgResponseTime: '2.3s',
  satisfactionScore: 4.8,
  uptime: 99.9,
}

const mockActivity = [
  {
    id: '1',
    user: 'Alice Chen',
    action: 'Started conversation',
    time: '2 min ago',
    type: 'conversation',
  },
  {
    id: '2',
    user: 'Bob Smith',
    action: 'AI response generated',
    time: '5 min ago',
    type: 'ai',
  },
  {
    id: '3',
    user: 'Carol Davis',
    action: 'Conversation completed',
    time: '12 min ago',
    type: 'complete',
  },
  {
    id: '4',
    user: 'System',
    action: 'Weekly backup completed',
    time: '1 hour ago',
    type: 'system',
  },
]

const mockConversations = [
  {
    id: '1',
    user: 'Alice Chen',
    topic: 'Product inquiry',
    status: 'active',
    messages: 8,
    updated: '2m ago',
  },
  {
    id: '2',
    user: 'Bob Smith',
    topic: 'Technical support',
    status: 'pending',
    messages: 15,
    updated: '5m ago',
  },
  {
    id: '3',
    user: 'Carol Davis',
    topic: 'Billing question',
    status: 'resolved',
    messages: 6,
    updated: '12m ago',
  },
  {
    id: '4',
    user: 'David Lee',
    topic: 'Feature request',
    status: 'active',
    messages: 4,
    updated: '18m ago',
  },
]

// ============================================================================
// Interactive Demo Component
// ============================================================================

function EnterpriseDashboardDemo() {
  const [selectedView, setSelectedView] = React.useState<
    'overview' | 'activity' | 'conversations'
  >('overview')
  const [stats, setStats] = React.useState(mockStats)

  // Simulate live updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        totalConversations:
          prev.totalConversations + Math.floor(Math.random() * 3),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        messagesPerDay: prev.messagesPerDay + Math.floor(Math.random() * 10),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-muted/30 rounded-lg">
        {[
          { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
          { id: 'activity' as const, label: 'Activity', icon: Activity },
          {
            id: 'conversations' as const,
            label: 'Conversations',
            icon: MessageSquare,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedView(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
              selectedView === tab.id
                ? 'bg-brand-500 text-white'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Content */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        {selectedView === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: durations.fast }}
            className="p-6 space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Total Conversations
                  </span>
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold">
                  {stats.totalConversations.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% from last week
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Active Users
                  </span>
                  <Users className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold">
                  {stats.activeUsers.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +8% from last week
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Messages/Day
                  </span>
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-2xl font-bold">
                  {stats.messagesPerDay.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +15% from last week
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Avg Response Time
                  </span>
                  <Clock className="w-4 h-4 text-brand-500" />
                </div>
                <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Under 3s target
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Satisfaction
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-brand-500" />
                </div>
                <p className="text-2xl font-bold">
                  {stats.satisfactionScore}/5.0
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on 2,341 ratings
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <Activity className="w-4 h-4 text-brand-500" />
                </div>
                <p className="text-2xl font-bold">{stats.uptime}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Last 30 days
                </p>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="p-6 rounded-lg bg-muted/30 border border-border/50">
              <h3 className="text-sm font-semibold mb-4">
                Message Volume (Last 7 Days)
              </h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {[32, 45, 38, 52, 48, 55, 62].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-brand-500 to-brand-400 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedView === 'activity' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: durations.fast }}
            className="p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {mockActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/40"
                >
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full mt-2 shrink-0',
                      activity.type === 'conversation' && 'bg-blue-500',
                      activity.type === 'ai' && 'bg-purple-500',
                      activity.type === 'complete' && 'bg-green-500',
                      activity.type === 'system' && 'bg-orange-500'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.action}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedView === 'conversations' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: durations.fast }}
            className="p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Active Conversations</h3>
            <div className="space-y-2">
              {mockConversations.map((conv) => (
                <div
                  key={conv.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{conv.user}</p>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          conv.status === 'active' &&
                            'bg-green-500/20 text-green-600 dark:text-green-400',
                          conv.status === 'pending' &&
                            'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
                          conv.status === 'resolved' &&
                            'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                        )}
                      >
                        {conv.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {conv.topic}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {conv.messages} messages
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {conv.updated}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function EnterpriseDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-docs py-8">
        {/* Header */}
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Enterprise Chat Dashboard</h1>
              <p className="text-muted-foreground">
                Complete example with analytics, monitoring, and multi-user
                management
              </p>
            </div>
          </div>

          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                This example demonstrates how to build a robust
                enterprise chat dashboard with real-time analytics, user
                management, conversation monitoring, and system health metrics.
                Perfect for teams managing AI chat at scale.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3">
                Features Included
              </h3>
              <ul className="space-y-2">
                <li>
                  <strong>Real-time Analytics:</strong> Live stats updates with
                  WebSocket integration
                </li>
                <li>
                  <strong>Conversation Management:</strong> Track and monitor
                  all active conversations
                </li>
                <li>
                  <strong>User Activity:</strong> Audit trail of all system
                  actions
                </li>
                <li>
                  <strong>Performance Metrics:</strong> Response times,
                  satisfaction scores, uptime
                </li>
                <li>
                  <strong>Role-Based Access:</strong> Different views for
                  admins, managers, and agents
                </li>
                <li>
                  <strong>Data Export:</strong> CSV/JSON export for all metrics
                </li>
              </ul>
            </div>
          </section>

          {/* Interactive Demo */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Interactive Demo</h2>
            <p className="text-muted-foreground mb-6">
              Explore the dashboard with live-updating stats and activity feed:
            </p>
            <EnterpriseDashboardDemo />
          </section>

          {/* Implementation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Implementation Guide</h2>

            <h3 className="text-xl font-semibold mb-4">1. Dashboard Layout</h3>
            <div className="space-y-4 mb-8">
              <p className="text-muted-foreground">
                Set up the main dashboard structure with navigation and content
                areas:
              </p>

              <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { LayoutDashboard, Users, BarChart3, Settings } from 'lucide-react'

export function EnterpriseDashboard() {
  const [activeView, setActiveView] = useState('overview')

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-card p-4">
        <div className="mb-8">
          <h2 className="text-lg font-bold">Enterprise Chat</h2>
          <p className="text-xs text-muted-foreground">Admin Dashboard</p>
        </div>

        <nav className="space-y-1">
          <NavItem icon={LayoutDashboard} label="Overview" active={activeView === 'overview'} />
          <NavItem icon={Users} label="Users" active={activeView === 'users'} />
          <NavItem icon={BarChart3} label="Analytics" active={activeView === 'analytics'} />
          <NavItem icon={Settings} label="Settings" active={activeView === 'settings'} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {activeView === 'overview' && <OverviewTab />}
        {activeView === 'users' && <UsersTab />}
        {activeView === 'analytics' && <AnalyticsTab />}
        {activeView === 'settings' && <SettingsTab />}
      </main>
    </div>
  )
}`}</code>
                </pre>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">
              2. Real-Time Stats with WebSockets
            </h3>
            <div className="space-y-4 mb-8">
              <p className="text-muted-foreground">
                Connect to WebSocket for live metric updates:
              </p>

              <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { useEffect, useState } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'

export function useRealtimeStats() {
  const [stats, setStats] = useState(null)
  const { data, status } = useWebSocket('/api/stats/stream')

  useEffect(() => {
    if (data) {
      setStats(prev => ({
        ...prev,
        ...data,
      }))
    }
  }, [data])

  return { stats, isConnected: status === 'connected' }
}

// In your component
function StatsOverview() {
  const { stats, isConnected } = useRealtimeStats()

  return (
    <div>
      <ConnectionIndicator connected={isConnected} />

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Active Conversations"
          value={stats?.activeConversations}
          change={stats?.conversationsChange}
        />
        <StatCard
          title="Messages Today"
          value={stats?.messagesToday}
          change={stats?.messagesChange}
        />
        <StatCard
          title="Avg Response Time"
          value={stats?.avgResponseTime}
          change={stats?.responseTimeChange}
        />
      </div>
    </div>
  )
}`}</code>
                </pre>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">
              3. Conversation Monitoring
            </h3>
            <div className="space-y-4 mb-8">
              <p className="text-muted-foreground">
                Display active conversations with filtering and search:
              </p>

              <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { useClarityChat } from '@clarity-chat/react'
import { useConversationList } from '@clarity-chat/enterprise'

export function ConversationMonitor() {
  const [filter, setFilter] = useState('all')
  const { conversations, loading } = useConversationList({
    filter,
    realtime: true,
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
        <button onClick={() => setFilter('resolved')}>Resolved</button>
      </div>

      {/* Conversation List */}
      <div className="space-y-2">
        {conversations.map(conv => (
          <ConversationCard
            key={conv.id}
            conversation={conv}
            onView={() => viewConversation(conv.id)}
            onAssign={() => assignAgent(conv.id)}
          />
        ))}
      </div>
    </div>
  )
}

function ConversationCard({ conversation, onView, onAssign }) {
  const { user, topic, status, lastMessage, unreadCount } = conversation

  return (
    <div className="p-4 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{topic}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <p className="text-sm text-muted-foreground truncate mb-2">
        {lastMessage.content}
      </p>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {formatTimeAgo(lastMessage.timestamp)}
        </span>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <span className="px-2 py-1 rounded-full bg-brand-500 text-white">
              {unreadCount} new
            </span>
          )}
          <button onClick={onView} className="px-3 py-1 rounded bg-muted">
            View
          </button>
        </div>
      </div>
    </div>
  )
}`}</code>
                </pre>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">4. Analytics Charts</h3>
            <div className="space-y-4 mb-8">
              <p className="text-muted-foreground">
                Visualize metrics with charts and graphs:
              </p>

              <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { LineChart, BarChart } from 'recharts'
import { useAnalytics } from '@clarity-chat/enterprise'

export function AnalyticsCharts() {
  const { metrics, timeRange, setTimeRange } = useAnalytics()

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2">
        <button onClick={() => setTimeRange('24h')}>24 Hours</button>
        <button onClick={() => setTimeRange('7d')}>7 Days</button>
        <button onClick={() => setTimeRange('30d')}>30 Days</button>
      </div>

      {/* Message Volume Chart */}
      <div className="p-6 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Message Volume</h3>
        <LineChart
          data={metrics.messageVolume}
          width={600}
          height={300}
        >
          <Line dataKey="messages" stroke="#3b82f6" />
        </LineChart>
      </div>

      {/* Response Time Chart */}
      <div className="p-6 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Response Time Distribution</h3>
        <BarChart
          data={metrics.responseTime}
          width={600}
          height={300}
        >
          <Bar dataKey="time" fill="#10b981" />
        </BarChart>
      </div>

      {/* User Satisfaction */}
      <div className="p-6 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">User Satisfaction</h3>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold">
            {metrics.satisfaction.average}/5.0
          </div>
          <div className="flex-1">
            <RatingDistribution ratings={metrics.satisfaction.distribution} />
          </div>
        </div>
      </div>
    </div>
  )
}`}</code>
                </pre>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">5. User Management</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Manage team members and permissions:
              </p>

              <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { useUsers, useInvite } from '@clarity-chat/enterprise'

export function UserManagement() {
  const { users, loading } = useUsers()
  const { invite, isInviting } = useInvite()

  const handleInvite = async (email: string, role: string) => {
    await invite({
      email,
      role,
      permissions: getRolePermissions(role),
    })
  }

  return (
    <div className="space-y-6">
      {/* Invite Form */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Invite Team Member</h3>
        <InviteForm onInvite={handleInvite} loading={isInviting} />
      </div>

      {/* User List */}
      <div className="space-y-2">
        {users.map(user => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={() => editUser(user)}
            onRemove={() => removeUser(user.id)}
          />
        ))}
      </div>
    </div>
  )
}

function UserCard({ user, onEdit, onRemove }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-3">
        <Avatar src={user.avatar} name={user.name} />
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <RoleBadge role={user.role} />
        <StatusIndicator active={user.isOnline} />
        <button onClick={onEdit}>Edit</button>
        <button onClick={onRemove} className="text-red-500">Remove</button>
      </div>
    </div>
  )
}`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Key Enterprise Features</h2>
            <div className="grid gap-4">
              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">
                      Role-Based Access Control
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Fine-grained permissions for admins, managers, and agents
                      with custom roles
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">
                      Multi-Region Deployment
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Deploy across multiple regions with automatic failover and
                      data residency compliance
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">Audit Logging</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete audit trail of all actions for compliance and
                      security monitoring
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">API Rate Limiting</h4>
                    <p className="text-sm text-muted-foreground">
                      Protect your infrastructure with configurable rate limits
                      per user and organization
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Resources */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Related Resources</h2>
            <div className="grid gap-4">
              <Link
                href="/guides/enterprise"
                className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-brand-500" />
                  <div>
                    <h4 className="font-semibold">Enterprise Guide</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete guide to enterprise features and deployment
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/reference/hooks/use-analytics"
                className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-brand-500" />
                  <div>
                    <h4 className="font-semibold">Analytics API</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete analytics API reference
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
