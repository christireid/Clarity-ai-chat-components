'use client'

import * as React from 'react'
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Brain,
  Check,
  ChevronDown,
  Clock,
  Cpu,
  Database,
  DollarSign,
  FileText,
  Filter,
  Gauge,
  GitBranch,
  Globe,
  Layers,
  LayoutGrid,
  LineChart,
  List,
  MoreVertical,
  Network,
  Percent,
  PieChart,
  RefreshCw,
  Route,
  Settings,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import { Switch } from '@clarity-chat/primitives'
import { Slider } from '@clarity-chat/primitives'

// Stat Card Component
function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  subtitle,
}: {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ElementType
  subtitle?: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        {change && (
          <div className="mt-3 flex items-center gap-1 text-sm">
            {changeType === 'positive' && (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            )}
            {changeType === 'negative' && (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span
              className={cn(
                changeType === 'positive' && 'text-emerald-500',
                changeType === 'negative' && 'text-red-500',
                changeType === 'neutral' && 'text-muted-foreground'
              )}
            >
              {change}
            </span>
            <span className="text-muted-foreground">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Compression Method Card
function CompressionCard({
  name,
  enabled,
  ratio,
  tokensProcessed,
  tokensSaved,
  onToggle,
}: {
  name: string
  enabled: boolean
  ratio: number
  tokensProcessed: number
  tokensSaved: number
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            enabled ? 'bg-primary/10' : 'bg-muted'
          )}
        >
          <Layers
            className={cn(
              'h-5 w-5',
              enabled ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{ratio}% compression</span>
            <span>|</span>
            <span>{tokensSaved.toLocaleString()} saved</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right text-sm">
          <p className="font-medium">{tokensProcessed.toLocaleString()}</p>
          <p className="text-muted-foreground">processed</p>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
    </div>
  )
}

// Cache Entry Card
function CacheEntry({
  key: cacheKey,
  hits,
  size,
  ttl,
  lastAccessed,
}: {
  key: string
  hits: number
  size: number
  ttl: string
  lastAccessed: string
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
      <div className="flex items-center gap-3">
        <Database className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="font-medium font-mono text-xs">{cacheKey}</p>
          <p className="text-xs text-muted-foreground">{lastAccessed}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="secondary">{hits} hits</Badge>
        <span className="text-muted-foreground">{size} tokens</span>
        <span className="text-muted-foreground">{ttl}</span>
      </div>
    </div>
  )
}

// Route Card
function RouteCard({
  name,
  model,
  requests,
  avgLatency,
  costPerRequest,
  successRate,
}: {
  name: string
  model: string
  requests: number
  avgLatency: number
  costPerRequest: number
  successRate: number
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Route className="h-4 w-4 text-primary" />
          <span className="font-medium">{name}</span>
        </div>
        <Badge variant="outline">{model}</Badge>
      </div>
      <div className="grid grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Requests</p>
          <p className="font-medium">{requests.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Avg Latency</p>
          <p className="font-medium">{avgLatency}ms</p>
        </div>
        <div>
          <p className="text-muted-foreground">Cost/Req</p>
          <p className="font-medium">${costPerRequest.toFixed(4)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Success</p>
          <p className="font-medium">{successRate}%</p>
        </div>
      </div>
    </div>
  )
}

// Main Dashboard Component
export function TokenOptimizationDashboard() {
  const [timeRange, setTimeRange] = React.useState('24h')
  const [compressionMethods, setCompressionMethods] = React.useState({
    contextTruncation: true,
    messageSummarization: true,
    codeMinification: false,
    redundancyRemoval: true,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Token Optimization</h2>
          <p className="text-muted-foreground">
            Monitor and optimize token usage across your AI workflows
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tokens Used"
          value="2.4M"
          change="+12%"
          changeType="negative"
          icon={Zap}
          subtitle="This period"
        />
        <StatCard
          title="Tokens Saved"
          value="847K"
          change="+34%"
          changeType="positive"
          icon={TrendingDown}
          subtitle="Via optimization"
        />
        <StatCard
          title="Cache Hit Rate"
          value="73.2%"
          change="+5.4%"
          changeType="positive"
          icon={Database}
          subtitle="Semantic cache"
        />
        <StatCard
          title="Cost Savings"
          value="$127.40"
          change="+28%"
          changeType="positive"
          icon={DollarSign}
          subtitle="This period"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="compression" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="compression">
            <Layers className="mr-2 h-4 w-4" />
            Compression
          </TabsTrigger>
          <TabsTrigger value="caching">
            <Database className="mr-2 h-4 w-4" />
            Caching
          </TabsTrigger>
          <TabsTrigger value="routing">
            <Route className="mr-2 h-4 w-4" />
            Routing
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Compression Tab */}
        <TabsContent value="compression" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Compression Methods */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Compression Methods</CardTitle>
                <CardDescription>
                  Enable or disable different optimization strategies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <CompressionCard
                  name="Context Truncation"
                  enabled={compressionMethods.contextTruncation}
                  ratio={42}
                  tokensProcessed={1240000}
                  tokensSaved={520800}
                  onToggle={() =>
                    setCompressionMethods((prev) => ({
                      ...prev,
                      contextTruncation: !prev.contextTruncation,
                    }))
                  }
                />
                <CompressionCard
                  name="Message Summarization"
                  enabled={compressionMethods.messageSummarization}
                  ratio={65}
                  tokensProcessed={890000}
                  tokensSaved={578500}
                  onToggle={() =>
                    setCompressionMethods((prev) => ({
                      ...prev,
                      messageSummarization: !prev.messageSummarization,
                    }))
                  }
                />
                <CompressionCard
                  name="Code Minification"
                  enabled={compressionMethods.codeMinification}
                  ratio={28}
                  tokensProcessed={340000}
                  tokensSaved={95200}
                  onToggle={() =>
                    setCompressionMethods((prev) => ({
                      ...prev,
                      codeMinification: !prev.codeMinification,
                    }))
                  }
                />
                <CompressionCard
                  name="Redundancy Removal"
                  enabled={compressionMethods.redundancyRemoval}
                  ratio={31}
                  tokensProcessed={560000}
                  tokensSaved={173600}
                  onToggle={() =>
                    setCompressionMethods((prev) => ({
                      ...prev,
                      redundancyRemoval: !prev.redundancyRemoval,
                    }))
                  }
                />
              </CardContent>
            </Card>

            {/* Compression Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overall Efficiency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="relative mx-auto h-32 w-32">
                    <svg className="h-full w-full -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        strokeDasharray={`${0.35 * 352} 352`}
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">35%</span>
                      <span className="text-xs text-muted-foreground">
                        reduced
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Input Tokens</span>
                    <span className="font-medium">1.8M</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Output Tokens</span>
                    <span className="font-medium">1.17M</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Saved</span>
                    <span className="font-medium text-emerald-500">630K</span>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm font-medium">Recommendation</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enable code minification to save an additional 12% on
                    code-heavy conversations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compression Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compression Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">
                        Max Context Length
                      </label>
                      <span className="text-sm text-muted-foreground">
                        8,000 tokens
                      </span>
                    </div>
                    <Slider defaultValue={[8000]} max={32000} step={1000} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">
                        Summarization Threshold
                      </label>
                      <span className="text-sm text-muted-foreground">70%</span>
                    </div>
                    <Slider defaultValue={[70]} max={100} step={5} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">
                        History Retention
                      </label>
                      <span className="text-sm text-muted-foreground">
                        20 messages
                      </span>
                    </div>
                    <Slider defaultValue={[20]} max={100} step={5} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">
                        Compression Level
                      </label>
                      <span className="text-sm text-muted-foreground">
                        Medium
                      </span>
                    </div>
                    <Slider defaultValue={[50]} max={100} step={25} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Caching Tab */}
        <TabsContent value="caching" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Cache Entries</CardTitle>
                  <CardDescription>
                    Semantic and exact match cache entries
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    <CacheEntry
                      key="prompt:greeting:en"
                      hits={1247}
                      size={128}
                      ttl="23h remaining"
                      lastAccessed="2 min ago"
                    />
                    <CacheEntry
                      key="embedding:doc:a1b2c3"
                      hits={856}
                      size={1536}
                      ttl="6d remaining"
                      lastAccessed="5 min ago"
                    />
                    <CacheEntry
                      key="response:faq:pricing"
                      hits={643}
                      size={512}
                      ttl="12h remaining"
                      lastAccessed="8 min ago"
                    />
                    <CacheEntry
                      key="summary:conv:xyz789"
                      hits={234}
                      size={256}
                      ttl="3h remaining"
                      lastAccessed="15 min ago"
                    />
                    <CacheEntry
                      key="prompt:code:python"
                      hits={189}
                      size={384}
                      ttl="18h remaining"
                      lastAccessed="22 min ago"
                    />
                    <CacheEntry
                      key="embedding:user:profile"
                      hits={156}
                      size={768}
                      ttl="5d remaining"
                      lastAccessed="1h ago"
                    />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cache Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Hit Rate</span>
                      <span className="font-medium">73.2%</span>
                    </div>
                    <Progress value={73.2} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Memory Used</span>
                      <span className="font-medium">2.4 GB / 4 GB</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Entries</span>
                      <span className="font-medium">12,847</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cache Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Semantic Cache</p>
                      <p className="text-xs text-muted-foreground">
                        Match similar queries
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Exact Match</p>
                      <p className="text-xs text-muted-foreground">
                        Cache identical requests
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Auto Eviction</p>
                      <p className="text-xs text-muted-foreground">
                        Remove stale entries
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Routing Tab */}
        <TabsContent value="routing" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Active Routes</CardTitle>
                <CardDescription>
                  Model routing based on task complexity and cost
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <RouteCard
                  name="Simple Queries"
                  model="gpt-4o-mini"
                  requests={45230}
                  avgLatency={120}
                  costPerRequest={0.0002}
                  successRate={99.8}
                />
                <RouteCard
                  name="Complex Reasoning"
                  model="gpt-4o"
                  requests={12450}
                  avgLatency={890}
                  costPerRequest={0.0045}
                  successRate={99.2}
                />
                <RouteCard
                  name="Code Generation"
                  model="claude-3-5-sonnet"
                  requests={8920}
                  avgLatency={650}
                  costPerRequest={0.0038}
                  successRate={99.5}
                />
                <RouteCard
                  name="Embeddings"
                  model="text-embedding-3-small"
                  requests={234500}
                  avgLatency={45}
                  costPerRequest={0.00002}
                  successRate={99.9}
                />
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Routing Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Cost Optimization</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Latency Priority</span>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Quality First</span>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Auto Fallback</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cost by Model</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>gpt-4o-mini</span>
                      <span className="font-medium">$9.05</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>gpt-4o</span>
                      <span className="font-medium">$56.03</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>claude-3-5-sonnet</span>
                      <span className="font-medium">$33.90</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>embeddings</span>
                      <span className="font-medium">$4.69</span>
                    </div>
                    <Progress value={6} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <Zap className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Request</p>
                    <p className="text-2xl font-bold">1,247</p>
                    <p className="text-xs text-muted-foreground">tokens</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Clock className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Latency</p>
                    <p className="text-2xl font-bold">245</p>
                    <p className="text-xs text-muted-foreground">ms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                    <Activity className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Throughput</p>
                    <p className="text-2xl font-bold">847</p>
                    <p className="text-xs text-muted-foreground">req/min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-500/10">
                    <Target className="h-6 w-6 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                    <p className="text-2xl font-bold">0.12%</p>
                    <p className="text-xs text-muted-foreground">last 24h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Token Usage Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border border-dashed border-border rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Token usage chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border border-dashed border-border rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Cost distribution chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TokenOptimizationDashboard
