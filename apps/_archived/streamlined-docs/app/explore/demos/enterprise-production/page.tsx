'use client'

import { useState } from 'react'
import {
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Target,
  Zap,
  Shield,
  Code,
} from 'lucide-react'
import Link from 'next/link'
import { InteractivePreview } from '@/components/Enhanced/InteractivePreview'
import { ScrollReveal, KineticText } from '@/components/Enhanced/ScrollReveal'

interface CostMetric {
  date: string
  spend: number
  budget: number
  savings: number
}

interface UserCost {
  userId: string
  name: string
  spend: number
  requests: number
  avgCost: number
}

interface OptimizationStrategy {
  name: string
  description: string
  savings: number
  enabled: boolean
}

// Simulated cost data
const generateCostData = (): CostMetric[] => {
  const days = 30
  const data: CostMetric[] = []
  const baseSpend = 5000
  const budget = 5000

  for (let i = 0; i < days; i++) {
    const daySpend = baseSpend * (0.3 + Math.random() * 0.1) // 30-40% of original
    const daySavings = baseSpend - daySpend
    data.push({
      date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      spend: Math.round(daySpend),
      budget,
      savings: Math.round(daySavings),
    })
  }
  return data
}

const userCosts: UserCost[] = [
  { userId: 'u1', name: 'Sarah Chen', spend: 124.5, requests: 2890, avgCost: 0.043 },
  { userId: 'u2', name: 'Marcus Johnson', spend: 98.2, requests: 1850, avgCost: 0.053 },
  { userId: 'u3', name: 'Emily Rodriguez', spend: 87.3, requests: 2100, avgCost: 0.042 },
  { userId: 'u4', name: 'David Kim', spend: 76.8, requests: 1540, avgCost: 0.05 },
  { userId: 'u5', name: 'Lisa Wang', spend: 65.4, requests: 1320, avgCost: 0.05 },
]

const optimizationStrategies: OptimizationStrategy[] = [
  {
    name: 'Provider Caching',
    description: 'Cache system prompts and repeated content',
    savings: 58,
    enabled: true,
  },
  {
    name: 'Smart Model Routing',
    description: 'Route simple queries to cheaper models',
    savings: 12,
    enabled: true,
  },
  {
    name: 'Context Compression',
    description: 'Compress conversation history',
    savings: 8,
    enabled: true,
  },
  {
    name: 'Batch Processing',
    description: 'Group similar requests together',
    savings: 5,
    enabled: false,
  },
]

export default function EnterpriseProductionDemo() {
  const [costData] = useState<CostMetric[]>(generateCostData())
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'strategies'>('overview')

  // Calculate metrics
  const totalSpend = costData.reduce((sum, d) => sum + d.spend, 0)
  const totalBudget = costData.reduce((sum, d) => sum + d.budget, 0)
  const totalSavings = costData.reduce((sum, d) => sum + d.savings, 0)
  const savingsPercentage = Math.round((totalSavings / totalBudget) * 100)
  const currentDaySpend = costData[costData.length - 1]?.spend || 0
  const currentDayBudget = costData[costData.length - 1]?.budget || 0
  const budgetUtilization = Math.round((currentDaySpend / currentDayBudget) * 100)

  const enabledStrategySavings = optimizationStrategies
    .filter((s) => s.enabled)
    .reduce((sum, s) => sum + s.savings, 0)

  const dashboardCode = `import { CostDashboard, BudgetAlerts } from '@clarity-chat/monitoring'

export default function EnterpriseDashboard() {
  return (
    <div className="grid gap-6">
      {/* Live Cost Tracking */}
      <CostDashboard
        period="daily"
        budget={5000}
        showAlerts
        groupBy="user"
      />

      {/* Budget Alerts */}
      <BudgetAlerts
        thresholds={[0.7, 0.9]}
        recipients={['finance@company.com']}
        channels={['email', 'slack']}
      />

      {/* Per-User Tracking */}
      <UserCostBreakdown
        limit={10}
        sortBy="spend"
        showOptimizationTips
      />

      {/* Optimization Strategies */}
      <OptimizationDashboard
        strategies={['caching', 'routing', 'compression']}
        showSavingsBreakdown
      />
    </div>
  )
}`

  const budgetAlertsCode = `import { BudgetGovernor } from '@clarity-chat/monitoring'

// Configure budget governance
const governor = BudgetGovernor.create({
  daily: {
    organization: 5000,    // $5000/day org-wide
    team: 500,             // $500/day per team
    user: 50,              // $50/day per user
  },
  alerts: {
    thresholds: [0.7, 0.9], // 70% and 90%
    channels: ['email', 'slack', 'pagerduty'],
    recipients: {
      finance: ['finance@company.com'],
      engineering: ['eng-leads@company.com'],
      executives: ['cto@company.com'],
    },
  },
})

// Middleware integration
export async function costGovernanceMiddleware(req, res, next) {
  const { userId, teamId } = req.user

  // Check budget before processing
  const canProceed = await governor.checkBudget({ userId, teamId })

  if (!canProceed) {
    return res.status(429).json({
      error: 'Daily budget exceeded',
      limits: await governor.getLimits({ userId, teamId }),
    })
  }

  next()
}`

  return (
    <div className="container-docs py-8 sm:py-12">
      {/* Hero */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50 rounded-full mb-6">
            <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Enterprise Production
            </span>
          </div>

          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            Cost Governance & Monitoring
          </KineticText>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
            Robust cost tracking, budget alerts, and optimization monitoring for enterprise AI
            deployments at scale.
          </p>

          {/* Total Savings Display - Prominent */}
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-lg mb-8">
            <TrendingDown className="w-8 h-8 text-white" />
            <div className="text-left">
              <div className="text-sm font-medium text-emerald-100">Total Savings (30 days)</div>
              <div className="text-3xl font-bold text-white">{savingsPercentage}%</div>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div className="text-left">
              <div className="text-sm font-medium text-emerald-100">Amount Saved</div>
              <div className="text-2xl font-bold text-white">${totalSavings.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Live Cost Dashboard */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-500" />
            Live Cost Dashboard
          </h2>

          <div className="bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] rounded-xl p-6">
            {/* Period Selector */}
            <div className="flex gap-2 mb-6">
              {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-brand-500 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Spend</div>
                  <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  ${totalSpend.toLocaleString()}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Last 30 days</div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Budget Left
                  </div>
                  <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  ${(totalBudget - totalSpend).toLocaleString()}
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  {100 - Math.round((totalSpend / totalBudget) * 100)}% remaining
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Active Users
                  </div>
                  <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {userCosts.length}
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Tracked users</div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    Today's Usage
                  </div>
                  <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {budgetUtilization}%
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  ${currentDaySpend} of ${currentDayBudget}
                </div>
              </div>
            </div>

            {/* Simple bar chart visualization */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                <span>Last 7 days spending</span>
                <span>
                  Avg: $
                  {Math.round(
                    costData.slice(-7).reduce((sum, d) => sum + d.spend, 0) / 7
                  ).toLocaleString()}
                  /day
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1 h-32">
                {costData.slice(-7).map((day, i) => {
                  const height = (day.spend / day.budget) * 100
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="flex-1 w-full flex items-end">
                        <div
                          className="w-full bg-gradient-to-t from-brand-500 to-brand-400 rounded-t transition-all"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <div className="text-xs text-neutral-500">{day.date.split(' ')[1]}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Budget Alerts & Thresholds */}
      <ScrollReveal direction="up" delay={0.3}>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-amber-500" />
            Budget Alerts & Thresholds
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Alert Thresholds */}
            <div className="bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] rounded-xl p-6">
              <h3 className="font-semibold mb-4">Alert Thresholds</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Warning (70%)</div>
                    <div className="text-xs text-neutral-500">Email to finance team</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Critical (90%)</div>
                    <div className="text-xs text-neutral-500">Slack + Email to executives</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Over Budget (100%)</div>
                    <div className="text-xs text-neutral-500">PagerDuty + Rate limiting</div>
                  </div>
                  <AlertCircle className="w-5 h-5 text-neutral-400" />
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] rounded-xl p-6">
              <h3 className="font-semibold mb-4">Recent Alerts</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                      Under budget
                    </div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-300">
                      Daily spend: ${currentDaySpend} (Target: ${currentDayBudget})
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <Activity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Optimization active
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      {enabledStrategySavings}% savings from enabled strategies
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Tabbed Content */}
      <ScrollReveal direction="up" delay={0.4}>
        <section className="mb-12">
          <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800">
            {[
              { id: 'users', label: 'Per-User Costs', icon: Users },
              { id: 'strategies', label: 'Optimization Strategies', icon: Zap },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'users' && (
            <div className="bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] rounded-xl p-6">
              <h3 className="font-semibold mb-4">Top Users by Cost</h3>
              <div className="space-y-3">
                {userCosts.map((user, i) => (
                  <div
                    key={user.userId}
                    className="flex items-center gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 text-white font-semibold text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-neutral-500">
                        {user.requests.toLocaleString()} requests
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${user.spend.toFixed(2)}</div>
                      <div className="text-sm text-neutral-500">${user.avgCost.toFixed(3)}/req</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'strategies' && (
            <div className="bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] rounded-xl p-6">
              <h3 className="font-semibold mb-4">Optimization Strategy Breakdown</h3>
              <div className="space-y-4">
                {optimizationStrategies.map((strategy) => (
                  <div
                    key={strategy.name}
                    className="flex items-center gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800"
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        strategy.enabled
                          ? 'bg-emerald-100 dark:bg-emerald-900/30'
                          : 'bg-neutral-200 dark:bg-neutral-700'
                      }`}
                    >
                      {strategy.enabled ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-neutral-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{strategy.name}</div>
                      <div className="text-sm text-neutral-500">{strategy.description}</div>
                    </div>
                    <div
                      className={`text-right px-4 py-2 rounded-lg font-semibold ${
                        strategy.enabled
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
                      }`}
                    >
                      {strategy.savings}% savings
                    </div>
                  </div>
                ))}
                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-emerald-900 dark:text-emerald-100">
                        Combined Savings
                      </div>
                      <div className="text-sm text-emerald-700 dark:text-emerald-300">
                        From {optimizationStrategies.filter((s) => s.enabled).length} active strategies
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {enabledStrategySavings}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </ScrollReveal>

      {/* Code Examples */}
      <ScrollReveal direction="up" delay={0.5}>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Code className="w-6 h-6 text-brand-500" />
            Implementation Examples
          </h2>

          <div className="space-y-6">
            <InteractivePreview
              title="Cost Dashboard Setup"
              description="Configure live cost tracking and monitoring"
              code={dashboardCode}
              defaultMode="code"
              showResponsive={false}
            >
              <div className="p-4 text-center text-neutral-500">
                See code example for implementation details
              </div>
            </InteractivePreview>

            <InteractivePreview
              title="Budget Governance & Alerts"
              description="Set up budget limits and alert thresholds"
              code={budgetAlertsCode}
              defaultMode="code"
              showResponsive={false}
            >
              <div className="p-4 text-center text-neutral-500">
                See code example for implementation details
              </div>
            </InteractivePreview>
          </div>
        </section>
      </ScrollReveal>

      {/* Call to Action */}
      <ScrollReveal direction="up" delay={0.6}>
        <section className="bg-gradient-to-br from-brand-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-8 sm:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Ready for Production?</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Implement enterprise-grade cost governance with monitoring, alerts, and optimization tracking.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cookbook/enterprise-production-pipeline"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors"
            >
              <Shield className="w-5 h-5" />
              Enterprise Production Pipeline
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cookbook/achieving-50-percent-reduction"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 rounded-lg font-medium hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors"
            >
              <TrendingDown className="w-5 h-5" />
              View Cost Reduction Guide
            </Link>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: <BarChart3 className="w-5 h-5" />,
                title: 'Real-time Monitoring',
                description: 'Track costs, usage, and savings live',
              },
              {
                icon: <Target className="w-5 h-5" />,
                title: 'Budget Governance',
                description: 'Automatic alerts and rate limiting',
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: '65-85% Savings',
                description: 'Production-validated cost reduction',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-brand-500 mb-3">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
