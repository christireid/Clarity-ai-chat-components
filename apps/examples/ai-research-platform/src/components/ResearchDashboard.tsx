'use client'

import { useMemo, memo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, FileText, Clock, Zap } from 'lucide-react'

interface Message {
  role: string
  citations?: Array<{ id: string; source: string }>
}

interface Metrics {
  tokensSaved?: number
  totalTokens?: number
  savingsPercent?: number
}

interface ResearchDashboardProps {
  messages: Message[]
  metrics: Metrics
  researchTopic: string
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  color: 'blue' | 'purple' | 'green' | 'orange'
}

// Extract and memoize StatCard component
const StatCard = memo<StatCardProps>(({ icon, label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
})
StatCard.displayName = 'StatCard'

export function ResearchDashboard({ messages, metrics, researchTopic }: ResearchDashboardProps) {
  const stats = useMemo(() => {
    const agentMessages = messages.filter(m => m.role === 'assistant')
    const citations = messages.reduce((acc, m) => acc + (m.citations?.length || 0), 0)
    
    return {
      totalMessages: messages.length,
      agentResponses: agentMessages.length,
      citationsFound: citations,
      avgResponseTime: 2.3,
      documentsProcessed: 12,
      chunksAnalyzed: 245,
    }
  }, [messages])

  // Memoize chart data to prevent recreation
  const chartData = useMemo(() => [
    { name: 'Researcher', value: 45, color: '#6366f1' },
    { name: 'Analyst', value: 30, color: '#8b5cf6' },
    { name: 'Writer', value: 25, color: '#ec4899' },
  ], [])

  const timelineData = useMemo(() => [
    { time: '00:00', queries: 12 },
    { time: '01:00', queries: 19 },
    { time: '02:00', queries: 8 },
    { time: '03:00', queries: 15 },
    { time: '04:00', queries: 22 },
  ], [])

  return (
    <div className="h-full overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Research Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {researchTopic || 'No active research topic'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<FileText className="w-5 h-5" />}
            label="Documents Processed"
            value={stats.documentsProcessed}
            color="blue"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Citations Found"
            value={stats.citationsFound}
            color="purple"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Avg Response Time"
            value={`${stats.avgResponseTime}s`}
            color="green"
          />
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="Tokens Saved"
            value={`${metrics?.tokensSaved || 0}`}
            color="orange"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Agent Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Query Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Query Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="queries" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Token Optimization Metrics */}
        {metrics && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Token Optimization</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tokens</p>
                <p className="text-2xl font-bold">{metrics.totalTokens?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tokens Saved</p>
                <p className="text-2xl font-bold text-green-600">
                  {metrics.tokensSaved?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Savings %</p>
                <p className="text-2xl font-bold text-purple-600">
                  {metrics.savingsPercent || 0}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
