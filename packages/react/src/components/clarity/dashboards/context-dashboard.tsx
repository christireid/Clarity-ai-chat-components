'use client'

import * as React from 'react'
import {
  Archive,
  ArrowRight,
  BookOpen,
  Brain,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Database,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  GitBranch,
  Globe,
  Hash,
  History,
  Layers,
  List,
  Loader2,
  MemoryStick,
  MessageSquare,
  MoreVertical,
  Network,
  Pin,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Upload,
  User,
  Users,
  Zap,
} from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
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
import { Avatar, AvatarFallback, AvatarImage } from '@clarity-chat/primitives'
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import { Switch } from '@clarity-chat/primitives'
import { Slider } from '@clarity-chat/primitives'

interface Conversation {
  id: string
  title: string
  preview: string
  messageCount: number
  tokenCount: number
  createdAt: Date
  updatedAt: Date
  isPinned: boolean
  isArchived: boolean
  tags: string[]
  model: string
  branchCount?: number
}

interface MemoryItem {
  id: string
  type: 'fact' | 'preference' | 'context' | 'summary'
  content: string
  source: string
  confidence: number
  createdAt: Date
  lastAccessed: Date
  accessCount: number
}

interface ContextWindow {
  used: number
  total: number
  systemPrompt: number
  memory: number
  history: number
  currentMessage: number
}

// Conversation Card Component
function ConversationCard({
  conversation,
  selected,
  onSelect,
}: {
  conversation: Conversation
  selected: boolean
  onSelect: () => void
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border border-border cursor-pointer transition-colors hover:bg-muted/50',
        selected && 'bg-muted/50 border-primary'
      )}
      onClick={onSelect}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <MessageSquare className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {conversation.isPinned && <Pin className="h-3 w-3 text-amber-500" />}
          <p className="font-medium truncate">{conversation.title}</p>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {conversation.preview}
        </p>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {conversation.messageCount}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {conversation.tokenCount.toLocaleString()}
          </span>
          {conversation.branchCount && conversation.branchCount > 1 && (
            <span className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              {conversation.branchCount}
            </span>
          )}
          <span>{formatDate(conversation.updatedAt)}</span>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Pin className="mr-2 h-4 w-4" />
            {conversation.isPinned ? 'Unpin' : 'Pin'}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download className="mr-2 h-4 w-4" />
            Export
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Memory Item Component
function MemoryItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: MemoryItem
  onEdit: () => void
  onDelete: () => void
}) {
  const typeConfig = {
    fact: { label: 'Fact', color: 'bg-blue-500/10 text-blue-500' },
    preference: {
      label: 'Preference',
      color: 'bg-purple-500/10 text-purple-500',
    },
    context: { label: 'Context', color: 'bg-emerald-500/10 text-emerald-500' },
    summary: { label: 'Summary', color: 'bg-amber-500/10 text-amber-500' },
  }

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Brain className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={typeConfig[item.type].color}
              >
                {typeConfig[item.type].label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {item.confidence}% confidence
              </span>
            </div>
            <p className="text-sm mt-2">{item.content}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Source: {item.source} | Accessed {item.accessCount} times
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// Context Window Visualizer
function ContextWindowVisualizer({ context }: { context: ContextWindow }) {
  const segments = [
    {
      label: 'System Prompt',
      value: context.systemPrompt,
      color: 'bg-purple-500',
    },
    { label: 'Memory', value: context.memory, color: 'bg-blue-500' },
    { label: 'History', value: context.history, color: 'bg-emerald-500' },
    { label: 'Current', value: context.currentMessage, color: 'bg-amber-500' },
  ]

  const usedPercentage = (context.used / context.total) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Context Window
        </CardTitle>
        <CardDescription>
          {context.used.toLocaleString()} / {context.total.toLocaleString()}{' '}
          tokens ({usedPercentage.toFixed(1)}%)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-6 rounded-full bg-muted flex overflow-hidden">
          {segments.map((segment) => (
            <div
              key={segment.label}
              className={cn('h-full', segment.color)}
              style={{ width: `${(segment.value / context.total) * 100}%` }}
              title={`${segment.label}: ${segment.value.toLocaleString()} tokens`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {segments.map((segment) => (
            <div key={segment.label} className="flex items-center gap-2">
              <div className={cn('h-3 w-3 rounded', segment.color)} />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{segment.label}</p>
                <p className="text-sm font-medium">
                  {segment.value.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Available</span>
            <span className="font-medium">
              {(context.total - context.used).toLocaleString()} tokens
            </span>
          </div>
          <Progress value={usedPercentage} className="h-2 mt-2" />
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function
function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString()
}

// Main Dashboard Component
export function ConversationHistoryDashboard() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filterType, setFilterType] = React.useState('all')
  const [selectedConversation, setSelectedConversation] = React.useState<
    string | null
  >(null)

  const conversations: Conversation[] = [
    {
      id: '1',
      title: 'Building a REST API with Node.js',
      preview:
        'We discussed setting up Express routes, middleware, and authentication...',
      messageCount: 24,
      tokenCount: 15600,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-22'),
      isPinned: true,
      isArchived: false,
      tags: ['development', 'nodejs', 'api'],
      model: 'gpt-4o',
      branchCount: 3,
    },
    {
      id: '2',
      title: 'Marketing Strategy Q1 2024',
      preview:
        'Analyzed competitor strategies and identified key growth opportunities...',
      messageCount: 18,
      tokenCount: 12400,
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-21'),
      isPinned: false,
      isArchived: false,
      tags: ['marketing', 'strategy'],
      model: 'gpt-4o',
    },
    {
      id: '3',
      title: 'Code Review: Payment Module',
      preview:
        'Reviewed the payment processing code and suggested security improvements...',
      messageCount: 32,
      tokenCount: 21000,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-19'),
      isPinned: false,
      isArchived: false,
      tags: ['code-review', 'security'],
      model: 'claude-3-5-sonnet',
      branchCount: 2,
    },
    {
      id: '4',
      title: 'Database Schema Design',
      preview: 'Designed the schema for the new user management system...',
      messageCount: 15,
      tokenCount: 9800,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-15'),
      isPinned: true,
      isArchived: false,
      tags: ['database', 'design'],
      model: 'gpt-4o',
    },
  ]

  const memoryItems: MemoryItem[] = [
    {
      id: '1',
      type: 'fact',
      content: 'User prefers TypeScript over JavaScript for all projects',
      source: 'Conversation: Building a REST API',
      confidence: 95,
      createdAt: new Date('2024-01-20'),
      lastAccessed: new Date('2024-01-22'),
      accessCount: 12,
    },
    {
      id: '2',
      type: 'preference',
      content: 'Prefers concise code explanations with practical examples',
      source: 'Multiple conversations',
      confidence: 88,
      createdAt: new Date('2024-01-15'),
      lastAccessed: new Date('2024-01-22'),
      accessCount: 28,
    },
    {
      id: '3',
      type: 'context',
      content: 'Working on an e-commerce platform using Next.js and PostgreSQL',
      source: 'Project context',
      confidence: 100,
      createdAt: new Date('2024-01-10'),
      lastAccessed: new Date('2024-01-22'),
      accessCount: 45,
    },
    {
      id: '4',
      type: 'summary',
      content:
        'Recently focused on API development and security best practices',
      source: 'Auto-generated',
      confidence: 82,
      createdAt: new Date('2024-01-21'),
      lastAccessed: new Date('2024-01-21'),
      accessCount: 5,
    },
  ]

  const contextWindow: ContextWindow = {
    used: 12500,
    total: 128000,
    systemPrompt: 1200,
    memory: 2800,
    history: 7500,
    currentMessage: 1000,
  }

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.preview.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'pinned' && conv.isPinned) ||
      (filterType === 'archived' && conv.isArchived)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Conversation History & Memory</h2>
          <p className="text-muted-foreground">
            Manage conversation history and persistent memory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <MessageSquare className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversations</p>
                <p className="text-2xl font-bold">{conversations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                <Brain className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Memory Items</p>
                <p className="text-2xl font-bold">{memoryItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                <Zap className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tokens</p>
                <p className="text-2xl font-bold">
                  {conversations
                    .reduce((acc, c) => acc + c.tokenCount, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                <GitBranch className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Branches</p>
                <p className="text-2xl font-bold">
                  {conversations.reduce(
                    (acc, c) => acc + (c.branchCount || 1),
                    0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="conversations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="conversations">
            <MessageSquare className="mr-2 h-4 w-4" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="memory">
            <Brain className="mr-2 h-4 w-4" />
            Memory
          </TabsTrigger>
          <TabsTrigger value="context">
            <Layers className="mr-2 h-4 w-4" />
            Context
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pinned">Pinned</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-3">
              {filteredConversations.map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
                  selected={selectedConversation === conversation.id}
                  onSelect={() => setSelectedConversation(conversation.id)}
                />
              ))}
            </div>

            <div className="space-y-4">
              <ContextWindowVisualizer context={contextWindow} />

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Archive Old Conversations
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Summarize All
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-500 bg-transparent"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear History
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Memory Tab */}
        <TabsContent value="memory" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="fact">Facts</SelectItem>
                  <SelectItem value="preference">Preferences</SelectItem>
                  <SelectItem value="context">Context</SelectItem>
                  <SelectItem value="summary">Summaries</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Memory
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {memoryItems.map((item) => (
              <MemoryItemCard
                key={item.id}
                item={item}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        </TabsContent>

        {/* Context Tab */}
        <TabsContent value="context" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <ContextWindowVisualizer context={contextWindow} />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Context Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">
                      Max History Messages
                    </label>
                    <span className="text-sm text-muted-foreground">20</span>
                  </div>
                  <Slider defaultValue={[20]} max={100} step={5} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Memory Limit</label>
                    <span className="text-sm text-muted-foreground">
                      5,000 tokens
                    </span>
                  </div>
                  <Slider defaultValue={[5000]} max={20000} step={1000} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Auto-summarize</p>
                    <p className="text-xs text-muted-foreground">
                      Automatically summarize long conversations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Include memory</p>
                    <p className="text-xs text-muted-foreground">
                      Add relevant memories to context
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>History & Memory Settings</CardTitle>
              <CardDescription>
                Configure how conversations and memory are stored and managed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-save conversations</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically save all conversations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Learn from conversations</p>
                  <p className="text-sm text-muted-foreground">
                    Extract facts and preferences from chats
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sync across devices</p>
                  <p className="text-sm text-muted-foreground">
                    Keep history in sync across all devices
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">End-to-end encryption</p>
                  <p className="text-sm text-muted-foreground">
                    Encrypt all stored conversations
                  </p>
                </div>
                <Switch />
              </div>
              <div>
                <p className="font-medium mb-2">Retention period</p>
                <Select defaultValue="forever">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 days</SelectItem>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="90d">90 days</SelectItem>
                    <SelectItem value="1y">1 year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ConversationHistoryDashboard
