'use client'

import { useState } from 'react'
import { ThemeProvider } from '@clarity-chat/react'
import { OpsHeader } from '@/components/OpsHeader'
import { MetricsOverview } from '@/components/MetricsOverview'
import { RealTimeMonitor } from '@/components/RealTimeMonitor'
import { AlertPanel } from '@/components/AlertPanel'
import { Shield, TrendingUp, Activity, Zap } from 'lucide-react'

export default function EnterpriseAIOps() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'safety' | 'evaluation' | 'testing' | 'tokens' | 'performance'
  >('overview')

  const mockMetrics = {
    totalRequests: 125430,
    successRate: 98.5,
    avgLatency: 245,
    p95Latency: 580,
    errorRate: 1.5,
    activeUsers: 1247,
    tokensUsed: 12500000,
    tokensSaved: 3750000,
    costSaved: 1125.5,
    safetyViolations: 3,
    qualityScore: 92.3,
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'safety', label: 'Safety', icon: Shield },
    { id: 'evaluation', label: 'Evaluation', icon: TrendingUp },
    { id: 'testing', label: 'Testing', icon: Zap },
    { id: 'tokens', label: 'Token Ops', icon: TrendingUp },
    { id: 'performance', label: 'Performance', icon: Activity },
  ]

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <OpsHeader />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Alert Panel */}
          {mockMetrics.safetyViolations > 0 && (
            <AlertPanel
              type="warning"
              title={`${mockMetrics.safetyViolations} Safety Violations Detected`}
              message="Review safety console for details"
              onDismiss={() => {}}
            />
          )}

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <MetricsOverview metrics={mockMetrics} />
              <RealTimeMonitor />
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Safety Review Console</h2>
                <p className="text-gray-500">
                  Enterprise safety monitoring components coming soon.
                  This demo showcases the AI Ops dashboard layout.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'evaluation' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Evaluation Dashboard</h2>
              <p className="text-gray-500">
                Enterprise evaluation components coming soon.
                This demo showcases the AI Ops dashboard layout.
              </p>
            </div>
          )}

          {activeTab === 'testing' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Prompt Test Harness</h2>
              <p className="text-gray-500">
                Enterprise testing components coming soon.
                This demo showcases the AI Ops dashboard layout.
              </p>
            </div>
          )}

          {activeTab === 'tokens' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Token Optimization Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-500">Total Tokens Used</p>
                    <p className="text-2xl font-bold">{(mockMetrics.tokensUsed / 1000000).toFixed(1)}M</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-500">Tokens Saved</p>
                    <p className="text-2xl font-bold text-green-600">{(mockMetrics.tokensSaved / 1000000).toFixed(1)}M</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-500">Cost Saved</p>
                    <p className="text-2xl font-bold text-green-600">${mockMetrics.costSaved.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Performance Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500">Avg Latency</p>
                  <p className="text-2xl font-bold">{mockMetrics.avgLatency}ms</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500">P95 Latency</p>
                  <p className="text-2xl font-bold">{mockMetrics.p95Latency}ms</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500">Error Rate</p>
                  <p className="text-2xl font-bold text-red-500">{mockMetrics.errorRate}%</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">{mockMetrics.successRate}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  )
}
