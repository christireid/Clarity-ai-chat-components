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
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ScrollArea,
  Separator,
  cn,
} from '@clarity-chat/primitives'
import {
  Coins,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Copy,
  Star,
  StarOff,
  MessageSquare,
  Calendar,
  User,
  Bot,
  Activity,
  Cpu,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Play,
  Pause,
  XCircle,
  ChevronRight,
  MoreHorizontal,
  Download,
  Upload,
  Settings,
  Eye,
  Zap,
  Target,
  Layers,
  Bug,
  Timer,
  GitCompare,
  Network,
  History,
  TerminalSquare,
  FileJson,
  Gauge,
  Rewind,
  FastForward,
  SkipBack,
  AlertCircle,
} from 'lucide-react'

// ============================================================================
// TOKEN OPTIMIZATION DASHBOARD
// ============================================================================
function TokenOptimizationDashboard() {
  const [selectedModel, setSelectedModel] = useState('gpt-4o')

  const tokenMetrics = {
    totalUsed: 1247832,
    totalBudget: 2000000,
    avgPerConversation: 3450,
    savingsPercent: 23,
  }

  const modelUsage = [
    { model: 'GPT-4o', tokens: 523000, cost: '$15.69', percent: 42 },
    { model: 'Claude 3.5', tokens: 412000, cost: '$12.36', percent: 33 },
    { model: 'GPT-4o-mini', tokens: 189000, cost: '$2.84', percent: 15 },
    { model: 'Claude Haiku', tokens: 123832, cost: '$1.24', percent: 10 },
  ]

  const optimizationTips = [
    {
      tip: 'Enable context compression',
      savings: '15-20%',
      status: 'available',
    },
    {
      tip: 'Use smaller model for simple queries',
      savings: '40-60%',
      status: 'enabled',
    },
    {
      tip: 'Implement conversation summarization',
      savings: '10-15%',
      status: 'available',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Tokens Used
                </p>
                <p className="text-2xl font-bold">
                  {(tokenMetrics.totalUsed / 1000000).toFixed(2)}M
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Coins className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500">12%</span>
              <span className="text-muted-foreground">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Budget Remaining
                </p>
                <p className="text-2xl font-bold">
                  {(
                    (tokenMetrics.totalBudget - tokenMetrics.totalUsed) /
                    1000000
                  ).toFixed(2)}
                  M
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${((tokenMetrics.totalBudget - tokenMetrics.totalUsed) / tokenMetrics.totalBudget) * 100}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg per Conversation
                </p>
                <p className="text-2xl font-bold">
                  {tokenMetrics.avgPerConversation.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm">
              <TrendingDown className="h-4 w-4 text-green-500" />
              <span className="text-green-500">8%</span>
              <span className="text-muted-foreground">reduction</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost Savings</p>
                <p className="text-2xl font-bold">
                  {tokenMetrics.savingsPercent}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">
                $47.20 saved this month
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Model Usage Breakdown */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Token Usage by Model</CardTitle>
            <CardDescription>
              Distribution across different AI models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modelUsage.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium">{item.model}</div>
                  <div className="flex-1">
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          i === 0
                            ? 'bg-blue-500'
                            : i === 1
                              ? 'bg-orange-500'
                              : i === 2
                                ? 'bg-emerald-500'
                                : 'bg-purple-500'
                        )}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right text-sm text-muted-foreground">
                    {(item.tokens / 1000).toFixed(0)}K
                  </div>
                  <div className="w-16 text-right text-sm font-medium">
                    {item.cost}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optimization Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Optimization Tips</CardTitle>
            <CardDescription>Recommendations to reduce costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {optimizationTips.map((tip, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{tip.tip}</p>
                    {tip.status === 'enabled' ? (
                      <Badge className="bg-green-500/20 text-green-600">
                        Enabled
                      </Badge>
                    ) : (
                      <Button size="sm" variant="outline">
                        Enable
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Potential savings: {tip.savings}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ============================================================================
// PROMPT MANAGEMENT DASHBOARD
// ============================================================================
function PromptManagementDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const prompts = [
    {
      id: 1,
      name: 'Code Review Assistant',
      category: 'Development',
      uses: 234,
      rating: 4.8,
      starred: true,
    },
    {
      id: 2,
      name: 'Technical Writer',
      category: 'Writing',
      uses: 189,
      rating: 4.6,
      starred: true,
    },
    {
      id: 3,
      name: 'Data Analyst',
      category: 'Analysis',
      uses: 156,
      rating: 4.5,
      starred: false,
    },
    {
      id: 4,
      name: 'Customer Support',
      category: 'Support',
      uses: 312,
      rating: 4.9,
      starred: true,
    },
    {
      id: 5,
      name: 'Marketing Copywriter',
      category: 'Marketing',
      uses: 98,
      rating: 4.3,
      starred: false,
    },
  ]

  const categories = [
    'all',
    'Development',
    'Writing',
    'Analysis',
    'Support',
    'Marketing',
  ]

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="capitalize"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Prompt
        </Button>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-2 gap-4">
        {prompts.map((prompt) => (
          <Card
            key={prompt.id}
            className="hover:border-primary/50 transition-colors"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{prompt.name}</h3>
                    <Badge variant="secondary">{prompt.category}</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Activity className="h-3.5 w-3.5" />
                      {prompt.uses} uses
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                      {prompt.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {prompt.starred ? (
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Upload className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="font-medium text-sm">Import Prompts</p>
              <p className="text-xs text-muted-foreground">From JSON or CSV</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Download className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-medium text-sm">Export Library</p>
              <p className="text-xs text-muted-foreground">
                Backup all prompts
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Layers className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="font-medium text-sm">Manage Categories</p>
              <p className="text-xs text-muted-foreground">Organize prompts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Settings className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="font-medium text-sm">Library Settings</p>
              <p className="text-xs text-muted-foreground">
                Configure defaults
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ============================================================================
// CONVERSATION HISTORY DASHBOARD
// ============================================================================
function ConversationHistoryDashboard() {
  const conversations = [
    {
      id: 1,
      title: 'Building a React Dashboard',
      messages: 24,
      date: '2024-01-15',
      model: 'GPT-4o',
      tokens: 4520,
    },
    {
      id: 2,
      title: 'Python Data Analysis Help',
      messages: 18,
      date: '2024-01-14',
      model: 'Claude 3.5',
      tokens: 3210,
    },
    {
      id: 3,
      title: 'API Design Best Practices',
      messages: 32,
      date: '2024-01-14',
      model: 'GPT-4o',
      tokens: 6780,
    },
    {
      id: 4,
      title: 'Debug Authentication Issue',
      messages: 15,
      date: '2024-01-13',
      model: 'Claude 3.5',
      tokens: 2890,
    },
    {
      id: 5,
      title: 'Write Unit Tests',
      messages: 21,
      date: '2024-01-13',
      model: 'GPT-4o-mini',
      tokens: 1950,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Conversations</p>
            <p className="text-2xl font-bold">1,247</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-2xl font-bold">48</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg Messages</p>
            <p className="text-2xl font-bold">22</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg Duration</p>
            <p className="text-2xl font-bold">8m 24s</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search conversations..." className="pl-9" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Date Range
        </Button>
      </div>

      {/* Conversation List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{conv.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{conv.messages} messages</span>
                      <span>•</span>
                      <span>{conv.tokens.toLocaleString()} tokens</span>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs">
                        {conv.model}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {conv.date}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// AGENT OBSERVABILITY DASHBOARD
// ============================================================================
function AgentObservabilityDashboard() {
  const agents = [
    {
      id: 1,
      name: 'Research Agent',
      status: 'running',
      tasks: 3,
      completed: 12,
      avgTime: '2m 34s',
    },
    {
      id: 2,
      name: 'Code Agent',
      status: 'idle',
      tasks: 0,
      completed: 28,
      avgTime: '4m 12s',
    },
    {
      id: 3,
      name: 'Writing Agent',
      status: 'running',
      tasks: 1,
      completed: 19,
      avgTime: '1m 45s',
    },
    {
      id: 4,
      name: 'Analysis Agent',
      status: 'error',
      tasks: 0,
      completed: 7,
      avgTime: '3m 21s',
    },
  ]

  const recentTasks = [
    {
      id: 1,
      agent: 'Research Agent',
      task: 'Analyze competitor data',
      status: 'completed',
      time: '2m 12s',
    },
    {
      id: 2,
      agent: 'Code Agent',
      task: 'Generate unit tests',
      status: 'completed',
      time: '3m 45s',
    },
    {
      id: 3,
      agent: 'Writing Agent',
      task: 'Draft blog post',
      status: 'running',
      time: '1m 23s',
    },
    {
      id: 4,
      agent: 'Research Agent',
      task: 'Market research',
      status: 'running',
      time: '0m 45s',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Agent Cards */}
      <div className="grid grid-cols-4 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      agent.status === 'running'
                        ? 'bg-green-500 animate-pulse'
                        : agent.status === 'idle'
                          ? 'bg-gray-400'
                          : 'bg-red-500'
                    )}
                  />
                  <h4 className="font-medium text-sm">{agent.name}</h4>
                </div>
                <Badge
                  className={cn(
                    agent.status === 'running'
                      ? 'bg-green-500/20 text-green-600'
                      : agent.status === 'idle'
                        ? 'bg-gray-500/20 text-gray-600'
                        : 'bg-red-500/20 text-red-600'
                  )}
                >
                  {agent.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold">{agent.tasks}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{agent.completed}</p>
                  <p className="text-xs text-muted-foreground">Done</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{agent.avgTime}</p>
                  <p className="text-xs text-muted-foreground">Avg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Tasks</CardTitle>
            <CardDescription>Live task execution feed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    {task.status === 'running' ? (
                      <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{task.task}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.agent}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {task.time}
                    </span>
                    <Badge
                      className={cn(
                        task.status === 'running'
                          ? 'bg-blue-500/20 text-blue-600'
                          : 'bg-green-500/20 text-green-600'
                      )}
                    >
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance</CardTitle>
            <CardDescription>System health metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-medium">96.8%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: '96.8%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">
                    Avg Response Time
                  </span>
                  <span className="font-medium">2.4s</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: '76%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Queue Length</span>
                  <span className="font-medium">4 tasks</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: '40%' }}
                  />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-500">99.9%</p>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">847</p>
                  <p className="text-xs text-muted-foreground">Tasks Today</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ============================================================================
// SDK DEVTOOLS DASHBOARD
// ============================================================================
function SDKDevToolsDashboard() {
  const [selectedTab, setSelectedTab] = useState('inspector')
  const [isRecording, setIsRecording] = useState(false)

  const apiCalls = [
    {
      id: 1,
      method: 'POST',
      endpoint: '/v1/chat/completions',
      status: 200,
      duration: '234ms',
      tokens: 1250,
    },
    {
      id: 2,
      method: 'POST',
      endpoint: '/v1/chat/completions',
      status: 200,
      duration: '456ms',
      tokens: 2340,
    },
    {
      id: 3,
      method: 'POST',
      endpoint: '/v1/embeddings',
      status: 200,
      duration: '89ms',
      tokens: 512,
    },
    {
      id: 4,
      method: 'POST',
      endpoint: '/v1/chat/completions',
      status: 429,
      duration: '12ms',
      tokens: 0,
    },
  ]

  const performanceMetrics = [
    {
      metric: 'Time to First Token',
      value: '145ms',
      benchmark: '< 200ms',
      status: 'good',
    },
    {
      metric: 'Tokens per Second',
      value: '62.4',
      benchmark: '> 50',
      status: 'good',
    },
    {
      metric: 'Memory Usage',
      value: '124MB',
      benchmark: '< 150MB',
      status: 'good',
    },
    {
      metric: 'API Latency (p95)',
      value: '456ms',
      benchmark: '< 500ms',
      status: 'warning',
    },
  ]

  const stateSnapshots = [
    {
      id: 1,
      timestamp: '10:24:32',
      event: 'Message sent',
      state: 'messages: 5, tokens: 1240',
    },
    {
      id: 2,
      timestamp: '10:24:33',
      event: 'Stream started',
      state: 'streaming: true',
    },
    {
      id: 3,
      timestamp: '10:24:35',
      event: 'Stream complete',
      state: 'streaming: false, messages: 6',
    },
    {
      id: 4,
      timestamp: '10:24:36',
      event: 'Token count updated',
      state: 'tokens: 1890',
    },
  ]

  const modelComparisons = [
    { model: 'GPT-4o', latency: '234ms', cost: '$0.015', quality: 4.8 },
    {
      model: 'Claude 3.5 Sonnet',
      latency: '198ms',
      cost: '$0.012',
      quality: 4.7,
    },
    { model: 'GPT-4o-mini', latency: '89ms', cost: '$0.002', quality: 4.2 },
    { model: 'Claude 3 Haiku', latency: '67ms', cost: '$0.001', quality: 4.0 },
  ]

  return (
    <div className="space-y-6">
      {/* DevTools Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-lg border border-violet-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <Bug className="h-5 w-5 text-violet-500" />
          </div>
          <div>
            <h3 className="font-semibold">SDK Developer Tools</h3>
            <p className="text-sm text-muted-foreground">
              Debug, inspect, and optimize your AI integration
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isRecording ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => setIsRecording(!isRecording)}
            className="gap-2"
          >
            {isRecording ? (
              <>
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Recording...
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-red-500" />
                Start Recording
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Tool Panels */}
      <div className="grid grid-cols-4 gap-4">
        <Card
          className={cn(
            'cursor-pointer transition-all hover:border-violet-500/50',
            selectedTab === 'inspector' && 'border-violet-500 bg-violet-500/5'
          )}
          onClick={() => setSelectedTab('inspector')}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Network className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">API Inspector</p>
              <p className="text-xs text-muted-foreground">Monitor API calls</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            'cursor-pointer transition-all hover:border-violet-500/50',
            selectedTab === 'profiler' && 'border-violet-500 bg-violet-500/5'
          )}
          onClick={() => setSelectedTab('profiler')}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Gauge className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-medium">Performance Profiler</p>
              <p className="text-xs text-muted-foreground">Analyze metrics</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            'cursor-pointer transition-all hover:border-violet-500/50',
            selectedTab === 'timetravel' && 'border-violet-500 bg-violet-500/5'
          )}
          onClick={() => setSelectedTab('timetravel')}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <History className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="font-medium">Time-Travel Debug</p>
              <p className="text-xs text-muted-foreground">
                Replay state changes
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            'cursor-pointer transition-all hover:border-violet-500/50',
            selectedTab === 'compare' && 'border-violet-500 bg-violet-500/5'
          )}
          onClick={() => setSelectedTab('compare')}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <GitCompare className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="font-medium">Model Comparison</p>
              <p className="text-xs text-muted-foreground">Compare responses</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Inspector Panel */}
      {selectedTab === 'inspector' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">API Request Inspector</CardTitle>
                <CardDescription>
                  Real-time monitoring of all API calls
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-2 text-xs font-medium text-muted-foreground grid grid-cols-6">
                <span>Method</span>
                <span className="col-span-2">Endpoint</span>
                <span>Status</span>
                <span>Duration</span>
                <span>Tokens</span>
              </div>
              <div className="divide-y">
                {apiCalls.map((call) => (
                  <div
                    key={call.id}
                    className="px-4 py-3 grid grid-cols-6 items-center hover:bg-muted/50 cursor-pointer text-sm"
                  >
                    <Badge className="w-fit" variant="outline">
                      {call.method}
                    </Badge>
                    <span className="col-span-2 font-mono text-xs">
                      {call.endpoint}
                    </span>
                    <Badge
                      className={cn(
                        'w-fit',
                        call.status === 200
                          ? 'bg-green-500/20 text-green-600'
                          : 'bg-red-500/20 text-red-600'
                      )}
                    >
                      {call.status}
                    </Badge>
                    <span className="text-muted-foreground">
                      {call.duration}
                    </span>
                    <span className="font-mono">
                      {call.tokens.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Profiler Panel */}
      {selectedTab === 'profiler' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Profiler</CardTitle>
            <CardDescription>
              Real-time performance metrics and benchmarks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {performanceMetrics.map((metric, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {metric.metric}
                    </span>
                    {metric.status === 'good' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span className="text-xs text-muted-foreground">
                      {metric.benchmark}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Timeline */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">
                Response Time Timeline
              </h4>
              <div className="h-24 bg-muted rounded-lg flex items-end gap-1 p-2">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-violet-500 rounded-t transition-all hover:bg-violet-400"
                    style={{ height: `${20 + Math.random() * 80}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>30s ago</span>
                <span>Now</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time-Travel Debugger Panel */}
      {selectedTab === 'timetravel' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Time-Travel Debugger</CardTitle>
                <CardDescription>
                  Step through state changes over time
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Rewind className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <FastForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stateSnapshots.map((snapshot, i) => (
                <div
                  key={snapshot.id}
                  className={cn(
                    'flex items-center gap-4 p-3 rounded-lg border transition-colors cursor-pointer',
                    i === 2
                      ? 'border-violet-500 bg-violet-500/5'
                      : 'hover:bg-muted/50'
                  )}
                >
                  <div className="w-16 text-xs font-mono text-muted-foreground">
                    {snapshot.timestamp}
                  </div>
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full',
                      i === 2 ? 'bg-violet-500' : 'bg-muted-foreground'
                    )}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{snapshot.event}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {snapshot.state}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Jump
                  </Button>
                </div>
              ))}
            </div>

            {/* State Diff Viewer */}
            <div className="mt-6 p-4 bg-[#1e1e1e] rounded-lg font-mono text-sm">
              <p className="text-xs text-gray-500 mb-2">State Diff</p>
              <div className="space-y-1">
                <p>
                  <span className="text-red-400">- streaming: true</span>
                </p>
                <p>
                  <span className="text-green-400">+ streaming: false</span>
                </p>
                <p>
                  <span className="text-green-400">
                    + messages: [..., {"{ role: 'assistant', content: '...' }"}]
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model Comparison Panel */}
      {selectedTab === 'compare' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Model Comparison</CardTitle>
            <CardDescription>
              Compare AI model performance, cost, and quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-3 text-sm font-medium text-muted-foreground grid grid-cols-5">
                <span>Model</span>
                <span>Latency</span>
                <span>Cost / 1K tokens</span>
                <span>Quality Score</span>
                <span>Actions</span>
              </div>
              <div className="divide-y">
                {modelComparisons.map((model, i) => (
                  <div
                    key={i}
                    className="px-4 py-4 grid grid-cols-5 items-center hover:bg-muted/50 text-sm"
                  >
                    <span className="font-medium">{model.model}</span>
                    <span>{model.latency}</span>
                    <span className="font-mono">{model.cost}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full"
                          style={{ width: `${(model.quality / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground">
                        {model.quality}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      Test
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Side-by-side Response Comparison */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <Badge>GPT-4o</Badge>
                  <span className="text-xs text-muted-foreground">234ms</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  The answer to your question involves several key
                  considerations. First, let me explain the fundamental
                  concepts...
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <Badge>Claude 3.5 Sonnet</Badge>
                  <span className="text-xs text-muted-foreground">198ms</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Great question! There are a few important aspects to consider
                  here. Let me walk you through each one...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function DashboardsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboards"
        description="Analytics and management interfaces for AI operations"
      />

      <Tabs defaultValue="tokens" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="tokens" className="gap-2">
            <Coins className="h-4 w-4" />
            Token Optimization
          </TabsTrigger>
          <TabsTrigger value="prompts" className="gap-2">
            <FileText className="h-4 w-4" />
            Prompt Library
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Conversation History
          </TabsTrigger>
          <TabsTrigger value="agents" className="gap-2">
            <Bot className="h-4 w-4" />
            Agent Observability
          </TabsTrigger>
          <TabsTrigger value="devtools" className="gap-2">
            <Bug className="h-4 w-4" />
            SDK DevTools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tokens">
          <TokenOptimizationDashboard />
        </TabsContent>
        <TabsContent value="prompts">
          <PromptManagementDashboard />
        </TabsContent>
        <TabsContent value="history">
          <ConversationHistoryDashboard />
        </TabsContent>
        <TabsContent value="agents">
          <AgentObservabilityDashboard />
        </TabsContent>
        <TabsContent value="devtools">
          <SDKDevToolsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
