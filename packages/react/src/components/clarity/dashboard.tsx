'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  LayoutDashboard,
  Plus,
  GripVertical,
  Maximize2,
  Minimize2,
  X,
  Settings,
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Users,
  MessageSquare,
  Zap,
  Clock,
  BarChart3,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'

// Types
export interface DashboardWidget {
  id: string
  title: string
  type: 'stat' | 'chart' | 'list' | 'activity' | 'custom'
  size: 'sm' | 'md' | 'lg' | 'xl'
  data?: unknown
  refreshInterval?: number
  render?: () => React.ReactNode
}

export interface DashboardLayout {
  id: string
  name: string
  columns: number
  widgets: string[]
}

// Dashboard Container
interface DashboardContainerProps {
  title?: string
  description?: string
  widgets: DashboardWidget[]
  columns?: 1 | 2 | 3 | 4
  onAddWidget?: () => void
  onRemoveWidget?: (id: string) => void
  onRefresh?: () => void
  isLoading?: boolean
  className?: string
  children?: React.ReactNode
}

export function DashboardContainer({
  title = 'Dashboard',
  description,
  widgets,
  columns = 3,
  onAddWidget,
  onRemoveWidget,
  onRefresh,
  isLoading,
  className,
  children,
}: DashboardContainerProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <LayoutDashboard className="h-6 w-6" />
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={cn('mr-2 h-4 w-4', isLoading && 'animate-spin')}
              />
              Refresh
            </Button>
          )}
          {onAddWidget && (
            <Button size="sm" onClick={onAddWidget}>
              <Plus className="mr-2 h-4 w-4" />
              Add Widget
            </Button>
          )}
        </div>
      </div>

      {/* Widgets Grid */}
      <div className={cn('grid gap-4', gridCols[columns])}>
        {widgets.map((widget) => (
          <DashboardWidgetCard
            key={widget.id}
            widget={widget}
            onRemove={
              onRemoveWidget ? () => onRemoveWidget(widget.id) : undefined
            }
          />
        ))}
        {children}
      </div>
    </div>
  )
}

// Dashboard Widget Card
interface DashboardWidgetCardProps {
  widget: DashboardWidget
  onRemove?: () => void
  onSettings?: () => void
  className?: string
}

export function DashboardWidgetCard({
  widget,
  onRemove,
  onSettings,
  className,
}: DashboardWidgetCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const sizeClasses = {
    sm: '',
    md: 'md:col-span-1',
    lg: 'md:col-span-2',
    xl: 'md:col-span-3',
  }

  return (
    <Card className={cn(sizeClasses[widget.size], className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onSettings && (
                <DropdownMenuItem onClick={onSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              )}
              {onRemove && (
                <DropdownMenuItem
                  onClick={onRemove}
                  className="text-destructive"
                >
                  <X className="mr-2 h-4 w-4" />
                  Remove
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {widget.render ? widget.render() : <WidgetContent widget={widget} />}
      </CardContent>
    </Card>
  )
}

// Widget Content Renderer
function WidgetContent({ widget }: { widget: DashboardWidget }) {
  switch (widget.type) {
    case 'stat':
      return <StatWidgetContent data={widget.data as StatWidgetData} />
    case 'activity':
      return <ActivityWidgetContent data={widget.data as ActivityItem[]} />
    case 'list':
      return <ListWidgetContent data={widget.data as ListItem[]} />
    default:
      return (
        <div className="flex h-24 items-center justify-center text-muted-foreground">
          No content
        </div>
      )
  }
}

// Stat Widget
interface StatWidgetData {
  value: string | number
  label?: string
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
}

function StatWidgetContent({ data }: { data?: StatWidgetData }) {
  if (!data) return null

  const getTrendIcon = () => {
    if (!data.change) return <Minus className="h-4 w-4 text-muted-foreground" />
    if (data.change > 0)
      return <TrendingUp className="h-4 w-4 text-green-500" />
    return <TrendingDown className="h-4 w-4 text-destructive" />
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold">{data.value}</span>
        {data.icon}
      </div>
      {data.change !== undefined && (
        <div className="flex items-center gap-1 text-sm">
          {getTrendIcon()}
          <span
            className={cn(
              data.change > 0
                ? 'text-green-500'
                : data.change < 0
                  ? 'text-destructive'
                  : 'text-muted-foreground'
            )}
          >
            {data.change > 0 ? '+' : ''}
            {data.change}%
          </span>
          {data.changeLabel && (
            <span className="text-muted-foreground">{data.changeLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}

// Activity Widget
interface ActivityItem {
  id: string
  title: string
  description?: string
  timestamp: Date
  icon?: React.ReactNode
}

function ActivityWidgetContent({ data }: { data?: ActivityItem[] }) {
  if (!data?.length) {
    return (
      <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
        No recent activity
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.slice(0, 5).map((item) => (
        <div key={item.id} className="flex items-start gap-3">
          <div className="mt-0.5">
            {item.icon || (
              <Activity className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.title}</p>
            {item.description && (
              <p className="truncate text-xs text-muted-foreground">
                {item.description}
              </p>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(item.timestamp)}
          </span>
        </div>
      ))}
    </div>
  )
}

// List Widget
interface ListItem {
  id: string
  label: string
  value?: string | number
  badge?: string
}

function ListWidgetContent({ data }: { data?: ListItem[] }) {
  if (!data?.length) {
    return (
      <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
        No items
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
        >
          <span className="text-sm">{item.label}</span>
          <div className="flex items-center gap-2">
            {item.value !== undefined && (
              <span className="text-sm font-medium">{item.value}</span>
            )}
            {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
          </div>
        </div>
      ))}
    </div>
  )
}

// Pre-built Stat Cards
interface QuickStatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  className?: string
}

export function QuickStatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  className,
}: QuickStatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <StatWidgetContent
          data={{ value, change, changeLabel, icon: undefined }}
        />
      </CardContent>
    </Card>
  )
}

// AI Dashboard Stats
export function AIDashboardStats({ className }: { className?: string }) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      <QuickStatCard
        title="Total Conversations"
        value="12,345"
        change={12}
        changeLabel="from last month"
        icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
      />
      <QuickStatCard
        title="Active Users"
        value="2,350"
        change={8}
        changeLabel="from last week"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <QuickStatCard
        title="Tokens Used"
        value="1.2M"
        change={-5}
        changeLabel="from yesterday"
        icon={<Zap className="h-4 w-4 text-muted-foreground" />}
      />
      <QuickStatCard
        title="Avg Response Time"
        value="1.2s"
        change={0}
        changeLabel="no change"
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  )
}

// Dashboard Layout Selector
interface DashboardLayoutSelectorProps {
  layouts: DashboardLayout[]
  currentLayout: string
  onLayoutChange: (layoutId: string) => void
  className?: string
}

export function DashboardLayoutSelector({
  layouts,
  currentLayout,
  onLayoutChange,
  className,
}: DashboardLayoutSelectorProps) {
  const current = layouts.find((l) => l.id === currentLayout)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          {current?.name || 'Select Layout'}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {layouts.map((layout) => (
          <DropdownMenuItem
            key={layout.id}
            onClick={() => onLayoutChange(layout.id)}
          >
            {layout.name}
            {layout.id === currentLayout && (
              <Badge variant="secondary" className="ml-2">
                Active
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Helper
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  return `${days}d`
}
