'use client'

import * as React from 'react'
import {
  Zap,
  Scissors,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronRight,
  Settings,
  BarChart3,
  FileText,
  MessageSquare,
  Code,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { Switch } from '@clarity-chat/primitives'
import { Slider } from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'

// Types
export interface TokenBreakdown {
  category: string
  tokens: number
  percentage: number
  icon?: React.ReactNode
  optimizable?: boolean
  savings?: number
}

export interface OptimizationSuggestion {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  savings: number
  type: 'truncation' | 'summarization' | 'compression' | 'removal'
  automated?: boolean
}

// Token Breakdown Visualization
interface TokenBreakdownChartProps {
  breakdown: TokenBreakdown[]
  total: number
  limit: number
}

export function TokenBreakdownChart({
  breakdown,
  total,
  limit,
}: TokenBreakdownChartProps) {
  const usagePercent = (total / limit) * 100
  const isOverLimit = total > limit

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          <span className="font-medium">Token Usage</span>
        </div>
        <div className="text-right">
          <span
            className={cn(
              'text-2xl font-bold',
              isOverLimit && 'text-destructive'
            )}
          >
            {total.toLocaleString()}
          </span>
          <span className="text-muted-foreground">
            {' '}
            / {limit.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="relative">
        <Progress
          value={Math.min(usagePercent, 100)}
          className={cn('h-3', isOverLimit && '[&>div]:bg-destructive')}
        />
        {usagePercent > 75 && usagePercent <= 100 && (
          <div
            className="absolute top-0 h-3 w-px bg-yellow-500"
            style={{ left: '75%' }}
          />
        )}
      </div>

      {isOverLimit && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <span>Over limit by {(total - limit).toLocaleString()} tokens</span>
        </div>
      )}

      <div className="grid gap-2">
        {breakdown.map((item) => (
          <div key={item.category} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
              {item.icon || (
                <FileText className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate">
                  {item.category}
                </span>
                <span className="text-sm text-muted-foreground">
                  {item.tokens.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={item.percentage} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground w-10">
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
            </div>
            {item.optimizable && item.savings && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="text-green-500 border-green-500/30"
                    >
                      -{item.savings}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Potential savings: {item.savings} tokens</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Optimization Suggestions
interface OptimizationSuggestionsProps {
  suggestions: OptimizationSuggestion[]
  onApply?: (id: string) => void
  onDismiss?: (id: string) => void
}

export function OptimizationSuggestions({
  suggestions,
  onApply,
  onDismiss,
}: OptimizationSuggestionsProps) {
  const impactColors = {
    high: 'bg-red-500/10 text-red-500 border-red-500/30',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
    low: 'bg-green-500/10 text-green-500 border-green-500/30',
  }

  const typeIcons = {
    truncation: <Scissors className="h-4 w-4" />,
    summarization: <Sparkles className="h-4 w-4" />,
    compression: <TrendingDown className="h-4 w-4" />,
    removal: <FileText className="h-4 w-4" />,
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Optimization Suggestions</h3>
        <Badge variant="secondary">
          {suggestions.reduce((acc, s) => acc + s.savings, 0).toLocaleString()}{' '}
          tokens saveable
        </Badge>
      </div>

      <div className="space-y-2">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="overflow-hidden">
            <div className="flex items-start gap-3 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted shrink-0">
                {typeIcons[suggestion.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {suggestion.title}
                  </span>
                  <Badge
                    variant="outline"
                    className={impactColors[suggestion.impact]}
                  >
                    {suggestion.impact}
                  </Badge>
                  {suggestion.automated && (
                    <Badge variant="secondary" className="text-xs">
                      Auto
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {suggestion.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-500">
                    Save ~{suggestion.savings.toLocaleString()} tokens
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => onDismiss?.(suggestion.id)}
                    >
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => onApply?.(suggestion.id)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Token Optimizer Settings
interface OptimizerSettingsProps {
  settings: {
    autoTruncate: boolean
    maxHistoryMessages: number
    summarizeThreshold: number
    compressCode: boolean
    removeFormatting: boolean
  }
  onChange?: (settings: OptimizerSettingsProps['settings']) => void
}

export function OptimizerSettings({
  settings,
  onChange,
}: OptimizerSettingsProps) {
  const updateSetting = <K extends keyof OptimizerSettingsProps['settings']>(
    key: K,
    value: OptimizerSettingsProps['settings'][K]
  ) => {
    onChange?.({ ...settings, [key]: value })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-medium">Auto-truncate History</label>
          <p className="text-xs text-muted-foreground">
            Automatically truncate old messages when approaching limit
          </p>
        </div>
        <Switch
          checked={settings.autoTruncate}
          onCheckedChange={(checked) => updateSetting('autoTruncate', checked)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Max History Messages</label>
          <span className="text-sm text-muted-foreground">
            {settings.maxHistoryMessages}
          </span>
        </div>
        <Slider
          value={[settings.maxHistoryMessages]}
          min={5}
          max={50}
          step={5}
          onValueChange={([value]) =>
            updateSetting('maxHistoryMessages', value)
          }
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Summarize Threshold</label>
          <span className="text-sm text-muted-foreground">
            {settings.summarizeThreshold}%
          </span>
        </div>
        <Slider
          value={[settings.summarizeThreshold]}
          min={50}
          max={95}
          step={5}
          onValueChange={([value]) =>
            updateSetting('summarizeThreshold', value)
          }
        />
        <p className="text-xs text-muted-foreground">
          Summarize conversation when usage exceeds this threshold
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-medium">Compress Code Blocks</label>
          <p className="text-xs text-muted-foreground">
            Minify code in messages to reduce token count
          </p>
        </div>
        <Switch
          checked={settings.compressCode}
          onCheckedChange={(checked) => updateSetting('compressCode', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-medium">Remove Extra Formatting</label>
          <p className="text-xs text-muted-foreground">
            Strip unnecessary whitespace and formatting
          </p>
        </div>
        <Switch
          checked={settings.removeFormatting}
          onCheckedChange={(checked) =>
            updateSetting('removeFormatting', checked)
          }
        />
      </div>
    </div>
  )
}

// Full Token Optimizer Panel
interface TokenOptimizerProps {
  breakdown: TokenBreakdown[]
  total: number
  limit: number
  suggestions: OptimizationSuggestion[]
  settings: OptimizerSettingsProps['settings']
  onApplySuggestion?: (id: string) => void
  onDismissSuggestion?: (id: string) => void
  onSettingsChange?: (settings: OptimizerSettingsProps['settings']) => void
  onOptimizeAll?: () => void
}

export function TokenOptimizer({
  breakdown,
  total,
  limit,
  suggestions,
  settings,
  onApplySuggestion,
  onDismissSuggestion,
  onSettingsChange,
  onOptimizeAll,
}: TokenOptimizerProps) {
  const totalSavings = suggestions.reduce((acc, s) => acc + s.savings, 0)
  const afterOptimization = total - totalSavings
  const isOverLimit = total > limit

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 p-4 border-b">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          <h2 className="font-semibold">Token Optimizer</h2>
        </div>
        <Button
          size="sm"
          onClick={onOptimizeAll}
          disabled={suggestions.length === 0}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Optimize All
        </Button>
      </div>

      <Tabs defaultValue="usage" className="flex-1">
        <TabsList className="w-full rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="usage"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-accent"
          >
            Usage
          </TabsTrigger>
          <TabsTrigger
            value="suggestions"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-accent"
          >
            Suggestions
            {suggestions.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {suggestions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-accent"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="flex-1 p-4">
          <TokenBreakdownChart
            breakdown={breakdown}
            total={total}
            limit={limit}
          />

          {isOverLimit && totalSavings > 0 && (
            <Card className="mt-4 border-green-500/30 bg-green-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                    <TrendingDown className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Optimization Available</p>
                    <p className="text-sm text-muted-foreground">
                      Apply suggestions to save {totalSavings.toLocaleString()}{' '}
                      tokens
                      {afterOptimization <= limit && (
                        <span className="text-green-500 ml-1">
                          (within limit)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="suggestions" className="flex-1 p-4 overflow-auto">
          {suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <p className="font-medium">All optimized!</p>
              <p className="text-sm text-muted-foreground">
                No optimization suggestions available
              </p>
            </div>
          ) : (
            <OptimizationSuggestions
              suggestions={suggestions}
              onApply={onApplySuggestion}
              onDismiss={onDismissSuggestion}
            />
          )}
        </TabsContent>

        <TabsContent value="settings" className="flex-1 p-4">
          <OptimizerSettings settings={settings} onChange={onSettingsChange} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Compact Token Status Badge
interface TokenStatusBadgeProps {
  used: number
  limit: number
  className?: string
}

export function TokenStatusBadge({
  used,
  limit,
  className,
}: TokenStatusBadgeProps) {
  const percentage = (used / limit) * 100
  const status =
    percentage > 100
      ? 'over'
      : percentage > 90
        ? 'critical'
        : percentage > 75
          ? 'warning'
          : 'ok'

  const statusConfig = {
    ok: { color: 'text-green-500 bg-green-500/10', icon: CheckCircle2 },
    warning: { color: 'text-yellow-500 bg-yellow-500/10', icon: AlertTriangle },
    critical: {
      color: 'text-orange-500 bg-orange-500/10',
      icon: AlertTriangle,
    },
    over: { color: 'text-destructive bg-destructive/10', icon: AlertTriangle },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium',
        config.color,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>
        {used.toLocaleString()} / {limit.toLocaleString()}
      </span>
    </div>
  )
}

// Token Budget Allocator
interface TokenBudget {
  id: string
  name: string
  allocated: number
  used: number
  priority: 'high' | 'medium' | 'low'
  locked?: boolean
}

interface TokenBudgetAllocatorProps {
  budgets: TokenBudget[]
  totalLimit: number
  onBudgetsChange?: (budgets: TokenBudget[]) => void
  className?: string
}

export function TokenBudgetAllocator({
  budgets = [],
  totalLimit,
  onBudgetsChange,
  className,
}: TokenBudgetAllocatorProps) {
  const safeBudgets = budgets || []
  const totalAllocated = safeBudgets.reduce((acc, b) => acc + b.allocated, 0)
  const remaining = totalLimit - totalAllocated

  const updateBudget = (id: string, allocated: number) => {
    onBudgetsChange?.(
      safeBudgets.map((b) => (b.id === id ? { ...b, allocated } : b))
    )
  }

  const priorityColors = {
    high: 'text-red-500',
    medium: 'text-yellow-500',
    low: 'text-green-500',
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Token Budget</h3>
          <p className="text-sm text-muted-foreground">
            Allocate tokens across different components
          </p>
        </div>
        <div className="text-right">
          <span
            className={cn('font-bold', remaining < 0 && 'text-destructive')}
          >
            {remaining.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-sm"> remaining</span>
        </div>
      </div>

      <Progress
        value={(totalAllocated / totalLimit) * 100}
        className={cn(
          'h-2',
          totalAllocated > totalLimit && '[&>div]:bg-destructive'
        )}
      />

      <div className="space-y-4">
        {safeBudgets.map((budget) => (
          <div key={budget.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{budget.name}</span>
                <Badge
                  variant="outline"
                  className={cn('text-xs', priorityColors[budget.priority])}
                >
                  {budget.priority}
                </Badge>
                {budget.locked && (
                  <Badge variant="secondary" className="text-xs">
                    Locked
                  </Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {budget.used.toLocaleString()} /{' '}
                {budget.allocated.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Slider
                value={[budget.allocated]}
                max={totalLimit / 2}
                min={100}
                step={100}
                disabled={budget.locked}
                onValueChange={([value]) => updateBudget(budget.id, value)}
                className="flex-1"
              />
              <div className="w-20">
                <Progress
                  value={(budget.used / budget.allocated) * 100}
                  className="h-1.5"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Context Window Visualizer
interface ContextItem {
  id: string
  type: 'system' | 'user' | 'assistant' | 'tool' | 'context'
  label: string
  tokens: number
  content?: string
  truncatable?: boolean
}

interface ContextWindowVisualizerProps {
  items: ContextItem[]
  limit: number
  onTruncate?: (id: string) => void
  onRemove?: (id: string) => void
  className?: string
}

export function ContextWindowVisualizer({
  items = [],
  limit,
  onTruncate,
  onRemove,
  className,
}: ContextWindowVisualizerProps) {
  const safeItems = items || []
  const totalTokens = safeItems.reduce((acc, item) => acc + item.tokens, 0)
  const isOverLimit = totalTokens > limit

  const typeColors: Record<string, string> = {
    system: 'bg-purple-500',
    user: 'bg-blue-500',
    assistant: 'bg-green-500',
    tool: 'bg-orange-500',
    context: 'bg-gray-500',
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Context Window</h3>
        <div className="flex items-center gap-2">
          <span className={cn('font-bold', isOverLimit && 'text-destructive')}>
            {totalTokens.toLocaleString()}
          </span>
          <span className="text-muted-foreground">
            / {limit.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Visual bar representation */}
      <div className="h-8 rounded-lg overflow-hidden flex bg-muted">
        {safeItems.map((item) => {
          const width = (item.tokens / limit) * 100
          return (
            <TooltipProvider key={item.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'h-full transition-all cursor-pointer hover:opacity-80',
                      typeColors[item.type]
                    )}
                    style={{ width: `${Math.min(width, 100)}%` }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs">
                    {item.tokens.toLocaleString()} tokens ({width.toFixed(1)}%)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
        {totalTokens < limit && <div className="flex-1 bg-muted" />}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={cn('w-3 h-3 rounded', color)} />
            <span className="capitalize">{type}</span>
          </div>
        ))}
      </div>

      {/* Items list */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {safeItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-2 rounded-lg border border-border"
          >
            <div
              className={cn(
                'w-2 h-8 rounded-full shrink-0',
                typeColors[item.type]
              )}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {item.tokens.toLocaleString()}
                </Badge>
              </div>
              {item.content && (
                <p className="text-xs text-muted-foreground truncate">
                  {item.content}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {item.truncatable && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => onTruncate?.(item.id)}
                >
                  <Scissors className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-destructive"
                onClick={() => onRemove?.(item.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Token Cost Calculator
interface ModelPricing {
  id: string
  name: string
  inputCost: number // per 1M tokens
  outputCost: number // per 1M tokens
  contextLimit: number
}

interface TokenCostCalculatorProps {
  inputTokens: number
  outputTokens: number
  models: ModelPricing[]
  selectedModel?: string
  onModelChange?: (modelId: string) => void
  className?: string
}

export function TokenCostCalculator({
  inputTokens,
  outputTokens,
  models = [],
  selectedModel,
  onModelChange,
  className,
}: TokenCostCalculatorProps) {
  const safeModels = models || []
  const currentModel =
    safeModels.find((m) => m.id === selectedModel) || safeModels[0]

  const calculateCost = (model: ModelPricing) => {
    const inputCost = (inputTokens / 1_000_000) * model.inputCost
    const outputCost = (outputTokens / 1_000_000) * model.outputCost
    return inputCost + outputCost
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Cost Calculator</h3>
        {currentModel && (
          <span className="text-2xl font-bold text-green-500">
            ${calculateCost(currentModel).toFixed(4)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground mb-1">Input Tokens</p>
          <p className="text-lg font-medium">{inputTokens.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground mb-1">Output Tokens</p>
          <p className="text-lg font-medium">{outputTokens.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Model Comparison</p>
        <div className="space-y-2">
          {safeModels.map((model) => {
            const cost = calculateCost(model)
            const isSelected = selectedModel === model.id
            return (
              <div
                key={model.id}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
                onClick={() => onModelChange?.(model.id)}
              >
                <div>
                  <p className="font-medium text-sm">{model.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ${model.inputCost}/M in | ${model.outputCost}/M out
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-500">${cost.toFixed(4)}</p>
                  <p className="text-xs text-muted-foreground">
                    {model.contextLimit.toLocaleString()} ctx
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Token Usage History Chart
interface TokenUsageRecord {
  timestamp: Date
  inputTokens: number
  outputTokens: number
  cost: number
}

interface TokenUsageHistoryProps {
  records: TokenUsageRecord[]
  period: 'day' | 'week' | 'month'
  onPeriodChange?: (period: 'day' | 'week' | 'month') => void
  className?: string
}

export function TokenUsageHistory({
  records = [],
  period,
  onPeriodChange,
  className,
}: TokenUsageHistoryProps) {
  const safeRecords = records || []
  const totalInput = safeRecords.reduce((acc, r) => acc + r.inputTokens, 0)
  const totalOutput = safeRecords.reduce((acc, r) => acc + r.outputTokens, 0)
  const totalCost = safeRecords.reduce((acc, r) => acc + r.cost, 0)
  const maxTokens = Math.max(
    ...safeRecords.map((r) => r.inputTokens + r.outputTokens),
    1
  )

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Usage History</h3>
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          {(['day', 'week', 'month'] as const).map((p) => (
            <Button
              key={p}
              variant={period === p ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 text-xs"
              onClick={() => onPeriodChange?.(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground mb-1">Total Input</p>
          <p className="text-lg font-medium">{totalInput.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground mb-1">Total Output</p>
          <p className="text-lg font-medium">{totalOutput.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
          <p className="text-lg font-medium text-green-500">
            ${totalCost.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Simple bar chart */}
      <div className="h-32 flex items-end gap-1">
        {safeRecords.slice(-14).map((record, index) => {
          const height =
            ((record.inputTokens + record.outputTokens) / maxTokens) * 100
          const inputHeight =
            (record.inputTokens / (record.inputTokens + record.outputTokens)) *
            height
          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-1 flex flex-col justify-end cursor-pointer">
                    <div
                      className="bg-green-500 rounded-t"
                      style={{ height: `${height - inputHeight}%` }}
                    />
                    <div
                      className="bg-blue-500 rounded-b"
                      style={{ height: `${inputHeight}%` }}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {record.timestamp.toLocaleDateString()}
                  </p>
                  <p className="text-xs">
                    Input: {record.inputTokens.toLocaleString()}
                  </p>
                  <p className="text-xs">
                    Output: {record.outputTokens.toLocaleString()}
                  </p>
                  <p className="text-xs">Cost: ${record.cost.toFixed(4)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span>Input</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span>Output</span>
        </div>
      </div>
    </div>
  )
}

// Compression Preview
interface CompressionPreviewProps {
  original: string
  compressed: string
  savings: number
  method: 'summarization' | 'truncation' | 'minification'
  onAccept?: () => void
  onReject?: () => void
  className?: string
}

export function CompressionPreview({
  original = '',
  compressed = '',
  savings,
  method,
  onAccept,
  onReject,
  className,
}: CompressionPreviewProps) {
  const [showOriginal, setShowOriginal] = React.useState(false)
  const safeOriginal = original || ''
  const safeCompressed = compressed || ''

  const methodLabels = {
    summarization: 'Summarized',
    truncation: 'Truncated',
    minification: 'Minified',
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{methodLabels[method]}</Badge>
          <span className="text-sm text-green-500">
            -{savings.toLocaleString()} tokens (
            {((savings / (safeOriginal.length / 4)) * 100).toFixed(0)}%)
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowOriginal(!showOriginal)}
        >
          {showOriginal ? 'Show Compressed' : 'Show Original'}
        </Button>
      </div>

      <div className="rounded-lg border border-border p-4 bg-muted/50 max-h-[200px] overflow-y-auto">
        <pre className="text-sm whitespace-pre-wrap">
          {showOriginal ? safeOriginal : safeCompressed}
        </pre>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={onReject}>
          Keep Original
        </Button>
        <Button onClick={onAccept}>Apply Compression</Button>
      </div>
    </div>
  )
}

// Import icons that may be missing
import { Trash2 } from 'lucide-react'
