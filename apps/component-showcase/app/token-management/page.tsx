'use client'

import { useState } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  cn,
} from '@clarity-chat/primitives'
import {
  Coins,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Settings,
  Zap,
  Target,
  BarChart3,
  RefreshCw,
  Info,
  ChevronRight,
} from 'lucide-react'

// ============================================================================
// TOKEN COUNTER DEMO
// ============================================================================
function TokenCounterDemo() {
  const [tokens, setTokens] = useState(1847)
  const maxTokens = 4096

  const percentage = (tokens / maxTokens) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Token Counter</CardTitle>
        <CardDescription>Real-time token counting for messages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Counter */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Coins className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tokens.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">tokens used</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {maxTokens.toLocaleString()} max
              </p>
              <p className="text-xs text-muted-foreground">
                {(maxTokens - tokens).toLocaleString()} remaining
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Context Usage</span>
              <span
                className={cn(
                  percentage > 90
                    ? 'text-red-500'
                    : percentage > 75
                      ? 'text-yellow-500'
                      : 'text-green-500'
                )}
              >
                {percentage.toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  percentage > 90
                    ? 'bg-red-500'
                    : percentage > 75
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-lg font-bold">423</p>
              <p className="text-xs text-muted-foreground">System</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-lg font-bold">892</p>
              <p className="text-xs text-muted-foreground">User</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-lg font-bold">532</p>
              <p className="text-xs text-muted-foreground">Assistant</p>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTokens(Math.min(tokens + 100, maxTokens))}
            >
              +100 tokens
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTokens(Math.max(tokens - 100, 0))}
            >
              -100 tokens
            </Button>
            <Button variant="outline" size="sm" onClick={() => setTokens(1847)}>
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TOKEN BUDGET DEMO
// ============================================================================
function TokenBudgetDemo() {
  const budget = {
    daily: { used: 45000, limit: 100000 },
    monthly: { used: 890000, limit: 2000000 },
    costDaily: '$1.35',
    costMonthly: '$26.70',
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Token Budget</CardTitle>
            <CardDescription>Track usage against limits</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Daily Budget */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Daily Budget</span>
              <span className="text-sm">
                {(budget.daily.used / 1000).toFixed(0)}K /{' '}
                {(budget.daily.limit / 1000).toFixed(0)}K
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: `${(budget.daily.used / budget.daily.limit) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated cost: {budget.costDaily}
            </p>
          </div>

          {/* Monthly Budget */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Monthly Budget</span>
              <span className="text-sm">
                {(budget.monthly.used / 1000000).toFixed(2)}M /{' '}
                {(budget.monthly.limit / 1000000).toFixed(0)}M
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{
                  width: `${(budget.monthly.used / budget.monthly.limit) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated cost: {budget.costMonthly}
            </p>
          </div>

          {/* Alert */}
          <div className="p-3 border border-yellow-500/50 bg-yellow-500/5 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-600">
                  Budget Alert
                </p>
                <p className="text-xs text-muted-foreground">
                  You&apos;ve used 44.5% of your monthly budget with 15 days
                  remaining
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TOKEN OPTIMIZATION DEMO
// ============================================================================
function TokenOptimizationDemo() {
  const optimizations = [
    {
      id: 'compression',
      name: 'Context Compression',
      description: 'Compress conversation history to save tokens',
      savings: '15-25%',
      enabled: true,
    },
    {
      id: 'truncation',
      name: 'Smart Truncation',
      description: 'Automatically trim older messages when approaching limit',
      savings: '10-20%',
      enabled: true,
    },
    {
      id: 'caching',
      name: 'Response Caching',
      description: 'Cache and reuse similar responses',
      savings: '20-40%',
      enabled: false,
    },
    {
      id: 'summarization',
      name: 'Auto Summarization',
      description: 'Summarize long conversations periodically',
      savings: '30-50%',
      enabled: false,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Token Optimization</CardTitle>
        <CardDescription>Strategies to reduce token usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {optimizations.map((opt) => (
            <div
              key={opt.id}
              className={cn(
                'p-4 border rounded-lg transition-colors',
                opt.enabled && 'border-green-500/50 bg-green-500/5'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{opt.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      {opt.savings}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {opt.description}
                  </p>
                </div>
                <Button variant={opt.enabled ? 'default' : 'outline'} size="sm">
                  {opt.enabled ? 'Enabled' : 'Enable'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// COST TRACKING DEMO
// ============================================================================
function CostTrackingDemo() {
  const models = [
    { name: 'GPT-4o', tokens: 523000, cost: '$15.69', percent: 42 },
    { name: 'Claude 3.5', tokens: 412000, cost: '$12.36', percent: 33 },
    { name: 'GPT-4o-mini', tokens: 189000, cost: '$2.84', percent: 15 },
    { name: 'Claude Haiku', tokens: 123832, cost: '$1.24', percent: 10 },
  ]

  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-orange-500',
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cost Tracking</CardTitle>
        <CardDescription>Token usage and costs by model</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Total Cost */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Total this month</p>
              <p className="text-3xl font-bold">$32.13</p>
            </div>
            <div className="flex items-center gap-2 text-green-500">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">-12% vs last month</span>
            </div>
          </div>

          {/* Model Breakdown */}
          <div>
            <h4 className="text-sm font-medium mb-3">By Model</h4>
            <div className="space-y-3">
              {models.map((model, i) => (
                <div key={model.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-muted-foreground">{model.cost}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', colors[i])}
                      style={{ width: `${model.percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(model.tokens / 1000).toFixed(0)}K tokens ({model.percent}
                    %)
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TOKEN METRICS DEMO
// ============================================================================
function TokenMetricsDemo() {
  const metrics = [
    {
      label: 'Avg tokens per message',
      value: '342',
      change: '-5%',
      positive: true,
    },
    {
      label: 'Avg tokens per conversation',
      value: '4,230',
      change: '+12%',
      positive: false,
    },
    {
      label: 'Context utilization',
      value: '68%',
      change: '+3%',
      positive: true,
    },
    {
      label: 'Compression ratio',
      value: '2.3x',
      change: '+0.2x',
      positive: true,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Token Metrics</CardTitle>
        <CardDescription>Usage statistics and trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-2xl font-bold">{metric.value}</p>
                <span
                  className={cn(
                    'text-xs font-medium flex items-center gap-0.5 mb-1',
                    metric.positive ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {metric.positive ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : (
                    <TrendingUp className="h-3 w-3" />
                  )}
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function TokenManagementPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Token Management"
        description="Token counting, budgets, and optimization"
      />

      <Tabs defaultValue="counter" className="w-full">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="counter">Token Counter</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="cost">Cost Tracking</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="counter">
          <ComponentSection
            title="Token Counter"
            description="Real-time token tracking"
          >
            <TokenCounterDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="budget">
          <ComponentSection
            title="Token Budget"
            description="Usage limits and alerts"
          >
            <TokenBudgetDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="optimization">
          <ComponentSection
            title="Token Optimization"
            description="Reduce usage with smart strategies"
          >
            <TokenOptimizationDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="cost">
          <ComponentSection
            title="Cost Tracking"
            description="Monitor spending by model"
          >
            <CostTrackingDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="metrics">
          <ComponentSection title="Token Metrics" description="Usage analytics">
            <TokenMetricsDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
