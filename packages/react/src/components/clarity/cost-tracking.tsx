'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@clarity-chat/primitives'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  CreditCard,
  AlertTriangle,
  Download,
  Calendar,
  Zap,
  ImageIcon,
  MessageSquare,
  FileText,
  BarChart3,
  PieChart,
  ArrowUpRight,
  Info,
} from 'lucide-react'

// Types
export interface CostEntry {
  id: string
  timestamp: Date
  model: string
  operation:
    | 'chat'
    | 'completion'
    | 'embedding'
    | 'image'
    | 'audio'
    | 'fine-tune'
  inputTokens?: number
  outputTokens?: number
  cost: number
  conversationId?: string
}

export interface CostSummary {
  totalCost: number
  periodStart: Date
  periodEnd: Date
  byModel: { model: string; cost: number; percentage: number }[]
  byOperation: { operation: string; cost: number; percentage: number }[]
  trend: number // percentage change from previous period
}

export interface BudgetConfig {
  limit: number
  used: number
  alertThreshold: number // percentage
  period: 'daily' | 'weekly' | 'monthly'
}

// Cost Display
interface CostDisplayProps {
  amount: number
  currency?: string
  size?: 'sm' | 'md' | 'lg'
  showSign?: boolean
  className?: string
}

export function CostDisplay({
  amount,
  currency = 'USD',
  size = 'md',
  showSign = false,
  className,
}: CostDisplayProps) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: amount < 0.01 ? 4 : 2,
    maximumFractionDigits: amount < 0.01 ? 4 : 2,
  }).format(amount)

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl font-bold',
  }

  return (
    <span className={cn(sizes[size], className)}>
      {showSign && amount > 0 && '+'}
      {formatted}
    </span>
  )
}

// Cost Trend Indicator
interface CostTrendProps {
  trend: number
  className?: string
}

export function CostTrend({ trend, className }: CostTrendProps) {
  const isPositive = trend > 0
  const isNeutral = trend === 0

  return (
    <div
      className={cn(
        'flex items-center gap-1 text-sm',
        isPositive
          ? 'text-red-500'
          : isNeutral
            ? 'text-muted-foreground'
            : 'text-green-500',
        className
      )}
    >
      {isPositive ? (
        <TrendingUp className="h-4 w-4" />
      ) : isNeutral ? (
        <Minus className="h-4 w-4" />
      ) : (
        <TrendingDown className="h-4 w-4" />
      )}
      <span>{Math.abs(trend).toFixed(1)}%</span>
    </div>
  )
}

// Budget Progress
interface BudgetProgressProps {
  budget: BudgetConfig
  showAlert?: boolean
  className?: string
}

export function BudgetProgress({
  budget,
  showAlert = true,
  className,
}: BudgetProgressProps) {
  const percentage = (budget.used / budget.limit) * 100
  const isOverThreshold = percentage >= budget.alertThreshold
  const isOverBudget = percentage >= 100

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}{' '}
          Budget
        </span>
        <div className="flex items-center gap-2">
          <CostDisplay amount={budget.used} size="sm" />
          <span className="text-muted-foreground">/</span>
          <CostDisplay
            amount={budget.limit}
            size="sm"
            className="text-muted-foreground"
          />
        </div>
      </div>

      <Progress
        value={Math.min(percentage, 100)}
        className={cn(
          'h-2',
          isOverBudget && '[&>div]:bg-red-500',
          isOverThreshold && !isOverBudget && '[&>div]:bg-yellow-500'
        )}
      />

      {showAlert && isOverThreshold && (
        <div
          className={cn(
            'flex items-center gap-2 text-xs',
            isOverBudget ? 'text-red-500' : 'text-yellow-500'
          )}
        >
          <AlertTriangle className="h-3 w-3" />
          {isOverBudget
            ? 'Budget exceeded!'
            : `${percentage.toFixed(0)}% of budget used`}
        </div>
      )}
    </div>
  )
}

// Cost Summary Card
interface CostSummaryCardProps {
  summary: CostSummary
  budget?: BudgetConfig
  className?: string
}

export function CostSummaryCard({
  summary,
  budget,
  className,
}: CostSummaryCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Cost Summary</CardTitle>
            <CardDescription>
              {summary.periodStart.toLocaleDateString()} -{' '}
              {summary.periodEnd.toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <CostDisplay amount={summary.totalCost} size="lg" />
            <CostTrend trend={summary.trend} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {budget && <BudgetProgress budget={budget} />}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">By Model</p>
            {summary.byModel.slice(0, 4).map((item) => (
              <div
                key={item.model}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground truncate">
                  {item.model}
                </span>
                <div className="flex items-center gap-2">
                  <CostDisplay amount={item.cost} size="sm" />
                  <span className="text-xs text-muted-foreground w-10 text-right">
                    {item.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">By Operation</p>
            {summary.byOperation.slice(0, 4).map((item) => (
              <div
                key={item.operation}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground capitalize">
                  {item.operation}
                </span>
                <div className="flex items-center gap-2">
                  <CostDisplay amount={item.cost} size="sm" />
                  <span className="text-xs text-muted-foreground w-10 text-right">
                    {item.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Cost History Table
interface CostHistoryTableProps {
  entries: CostEntry[]
  onExport?: () => void
  className?: string
}

export function CostHistoryTable({
  entries,
  onExport,
  className,
}: CostHistoryTableProps) {
  const operationIcons = {
    chat: MessageSquare,
    completion: FileText,
    embedding: BarChart3,
    image: ImageIcon,
    audio: Zap,
    'fine-tune': Zap,
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Cost History</CardTitle>
            <CardDescription>Recent API usage and costs</CardDescription>
          </div>
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Operation</TableHead>
              <TableHead className="text-right">Tokens</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => {
              const Icon = operationIcons[entry.operation]
              return (
                <TableRow key={entry.id}>
                  <TableCell className="text-muted-foreground">
                    {entry.timestamp.toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {entry.model}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{entry.operation}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {entry.inputTokens || entry.outputTokens ? (
                      <span>
                        {entry.inputTokens?.toLocaleString() || 0} /{' '}
                        {entry.outputTokens?.toLocaleString() || 0}
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <CostDisplay amount={entry.cost} size="sm" />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Inline Cost Indicator
interface InlineCostIndicatorProps {
  cost: number
  inputTokens?: number
  outputTokens?: number
  showTokens?: boolean
  className?: string
}

export function InlineCostIndicator({
  cost,
  inputTokens,
  outputTokens,
  showTokens = true,
  className,
}: InlineCostIndicatorProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-xs text-muted-foreground',
        className
      )}
    >
      <div className="flex items-center gap-1">
        <DollarSign className="h-3 w-3" />
        <CostDisplay amount={cost} size="sm" />
      </div>
      {showTokens && (inputTokens || outputTokens) && (
        <>
          <span>|</span>
          <span className="font-mono">
            {inputTokens?.toLocaleString() || 0}↑{' '}
            {outputTokens?.toLocaleString() || 0}↓
          </span>
        </>
      )}
    </div>
  )
}

// Cost Alert Banner
interface CostAlertBannerProps {
  budget: BudgetConfig
  onDismiss?: () => void
  onUpgrade?: () => void
  className?: string
}

export function CostAlertBanner({
  budget,
  onDismiss,
  onUpgrade,
  className,
}: CostAlertBannerProps) {
  const percentage = (budget.used / budget.limit) * 100
  const isOverBudget = percentage >= 100

  if (percentage < budget.alertThreshold) return null

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg',
        isOverBudget
          ? 'bg-red-500/10 border border-red-500/20'
          : 'bg-yellow-500/10 border border-yellow-500/20',
        className
      )}
    >
      <AlertTriangle
        className={cn(
          'h-5 w-5',
          isOverBudget ? 'text-red-500' : 'text-yellow-500'
        )}
      />
      <div className="flex-1">
        <p
          className={cn(
            'text-sm font-medium',
            isOverBudget ? 'text-red-500' : 'text-yellow-500'
          )}
        >
          {isOverBudget ? 'Budget Exceeded' : 'Approaching Budget Limit'}
        </p>
        <p className="text-xs text-muted-foreground">
          You've used <CostDisplay amount={budget.used} size="sm" /> of your{' '}
          <CostDisplay amount={budget.limit} size="sm" /> {budget.period} budget
        </p>
      </div>
      <div className="flex items-center gap-2">
        {onUpgrade && (
          <Button variant="default" size="sm" onClick={onUpgrade}>
            Increase Budget
          </Button>
        )}
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            Dismiss
          </Button>
        )}
      </div>
    </div>
  )
}

// Model Pricing Table
interface ModelPricing {
  model: string
  inputPrice: number // per 1M tokens
  outputPrice: number
  contextWindow: number
}

interface ModelPricingTableProps {
  models: ModelPricing[]
  className?: string
}

export function ModelPricingTable({
  models,
  className,
}: ModelPricingTableProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Model Pricing</CardTitle>
        <CardDescription>Cost per 1M tokens</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead className="text-right">Input</TableHead>
              <TableHead className="text-right">Output</TableHead>
              <TableHead className="text-right">Context</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => (
              <TableRow key={model.model}>
                <TableCell className="font-medium">{model.model}</TableCell>
                <TableCell className="text-right">
                  <CostDisplay amount={model.inputPrice} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  <CostDisplay amount={model.outputPrice} size="sm" />
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {(model.contextWindow / 1000).toFixed(0)}K
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Cost Estimation Calculator
interface CostEstimatorProps {
  models: ModelPricing[]
  className?: string
}

export function CostEstimator({ models, className }: CostEstimatorProps) {
  const [selectedModel, setSelectedModel] = React.useState(
    models[0]?.model || ''
  )
  const [inputTokens, setInputTokens] = React.useState(1000)
  const [outputTokens, setOutputTokens] = React.useState(500)
  const [requestsPerDay, setRequestsPerDay] = React.useState(100)

  const model = models.find((m) => m.model === selectedModel)
  const costPerRequest = model
    ? (inputTokens / 1_000_000) * model.inputPrice +
      (outputTokens / 1_000_000) * model.outputPrice
    : 0
  const dailyCost = costPerRequest * requestsPerDay
  const monthlyCost = dailyCost * 30

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Cost Estimator</CardTitle>
        <CardDescription>Estimate your API costs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.model} value={m.model}>
                    {m.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Requests/Day</label>
            <input
              type="number"
              value={requestsPerDay}
              onChange={(e) => setRequestsPerDay(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input Tokens/Request</label>
            <input
              type="number"
              value={inputTokens}
              onChange={(e) => setInputTokens(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Output Tokens/Request</label>
            <input
              type="number"
              value={outputTokens}
              onChange={(e) => setOutputTokens(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Per Request</span>
            <CostDisplay amount={costPerRequest} size="sm" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Daily Estimate
            </span>
            <CostDisplay amount={dailyCost} size="md" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Monthly Estimate</span>
            <CostDisplay
              amount={monthlyCost}
              size="lg"
              className="text-primary"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
