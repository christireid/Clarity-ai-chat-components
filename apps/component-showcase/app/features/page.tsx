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
  Checkbox,
  Kbd,
  cn,
} from '@clarity-chat/primitives'
import {
  Code,
  FileText,
  GitCommit,
  GitBranch,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Folder,
  FolderOpen,
  File,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  Terminal,
  Globe,
  Eye,
  EyeOff,
  AlertTriangle,
  Info,
  Bookmark,
  BookmarkPlus,
  Brain,
  Lightbulb,
  Link,
  DollarSign,
  Table2,
  FormInput,
  Lock,
  Key,
  Inbox,
  Search,
  RefreshCw,
  Copy,
  Trash2,
  Edit,
  MoreHorizontal,
  ExternalLink,
  Check,
  X,
  Loader2,
  Sparkles,
  User,
  Bot,
  Workflow,
  Layers,
  PanelTop,
  Settings,
  Download,
  Share,
  MessageSquare,
  Hash,
  Mic,
  Volume2,
  Pause,
  SkipBack,
  SkipForward,
  List,
  Grid,
  Filter,
  SortAsc,
  Tag,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bell,
  BellOff,
  Mail,
  Send,
  Paperclip,
  Image,
  Video,
  Zap,
  Activity,
  PieChart,
  TrendingUp,
  Calendar,
  MapPin,
  Navigation,
  Compass,
  Target,
  Award,
  Gift,
  ShoppingCart,
  CreditCard,
  Wallet,
  Building,
  Home,
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  MessageCircle,
  LayoutGrid,
  Columns,
  Rows,
  Maximize,
  Minimize,
  Move,
  Grip,
  Menu,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  RotateCcw,
  Undo,
  Redo,
  Save,
  Upload,
  CloudUpload,
  Database,
  Server,
  Wifi,
  WifiOff,
  Bluetooth,
  Power,
  Battery,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Keyboard,
} from 'lucide-react'
import {
  ErrorDisplayDemo,
  ErrorBoundaryDemo,
  RetryCountdownDemo,
  CircuitBreakerDemo,
  ErrorToastDemo,
} from './demos/error-demos'
import {
  TokenOptimizationDashboardDemo,
  TokenOptimizationPanelDemo,
  TokenCostPreviewDemo,
  TokenUsageMeterDemo,
  TokenCounterDemo,
  TokenBudgetBarDemo,
  TokenOptimizationBadgeDemo,
  TokenROICalculatorDemo,
} from './demos/token-demos'
import {
  StreamingTextShimmerDemo,
  TextShimmerDemo,
  StreamProgressDemo,
  StreamingCursorDemo,
  TypingIndicatorDemo,
  StreamingMessageDemo,
} from './demos/streaming-demos'

// ============================================================================
// CODE DIFF VIEWER
// ============================================================================
function CodeDiffViewer() {
  const diffLines = [
    {
      type: 'context',
      lineOld: 1,
      lineNew: 1,
      content: 'import React from "react"',
    },
    {
      type: 'context',
      lineOld: 2,
      lineNew: 2,
      content: 'import { useState } from "react"',
    },
    {
      type: 'removed',
      lineOld: 3,
      lineNew: null,
      content: 'import { Button } from "./Button"',
    },
    {
      type: 'added',
      lineOld: null,
      lineNew: 3,
      content: 'import { Button } from "@clarity-chat/primitives"',
    },
    { type: 'context', lineOld: 4, lineNew: 4, content: '' },
    {
      type: 'context',
      lineOld: 5,
      lineNew: 5,
      content: 'export function MyComponent() {',
    },
    {
      type: 'removed',
      lineOld: 6,
      lineNew: null,
      content: '  const [count, setCount] = useState(0)',
    },
    {
      type: 'added',
      lineOld: null,
      lineNew: 6,
      content: '  const [count, setCount] = useState<number>(0)',
    },
    {
      type: 'added',
      lineOld: null,
      lineNew: 7,
      content: '  const [loading, setLoading] = useState(false)',
    },
    { type: 'context', lineOld: 7, lineNew: 8, content: '' },
    { type: 'context', lineOld: 8, lineNew: 9, content: '  return (' },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">MyComponent.tsx</Badge>
            <span className="text-sm text-muted-foreground">+2 -2</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              View Full File
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="font-mono text-sm border-t overflow-x-auto">
          {diffLines.map((line, i) => (
            <div
              key={i}
              className={cn(
                'flex',
                line.type === 'added' && 'bg-green-500/10',
                line.type === 'removed' && 'bg-red-500/10'
              )}
            >
              <div className="w-12 text-right text-muted-foreground text-xs py-0.5 px-2 select-none border-r">
                {line.lineOld || ''}
              </div>
              <div className="w-12 text-right text-muted-foreground text-xs py-0.5 px-2 select-none border-r">
                {line.lineNew || ''}
              </div>
              <div className="w-6 text-center py-0.5 select-none">
                {line.type === 'added' && (
                  <span className="text-green-500">+</span>
                )}
                {line.type === 'removed' && (
                  <span className="text-red-500">-</span>
                )}
              </div>
              <pre className="flex-1 py-0.5 pr-4">{line.content}</pre>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TEST RUNNER
// ============================================================================
function TestRunnerPanel() {
  const [isRunning, setIsRunning] = useState(false)

  const tests = [
    { name: 'should render correctly', status: 'passed', duration: '12ms' },
    { name: 'should handle click events', status: 'passed', duration: '8ms' },
    {
      name: 'should display loading state',
      status: 'passed',
      duration: '15ms',
    },
    {
      name: 'should validate input',
      status: 'failed',
      duration: '23ms',
      error: 'Expected "valid" but got "invalid"',
    },
    { name: 'should submit form', status: 'running', duration: null },
  ]

  const summary = { total: 5, passed: 3, failed: 1, running: 1 }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Test Runner</CardTitle>
            <CardDescription>Unit test execution and results</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsRunning(!isRunning)} className="gap-2">
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Tests
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="flex gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">{summary.passed} passed</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm">{summary.failed} failed</span>
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
            <span className="text-sm">{summary.running} running</span>
          </div>
        </div>

        {/* Test List */}
        <div className="space-y-2">
          {tests.map((test, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border',
                test.status === 'failed' && 'border-red-500/50 bg-red-500/5'
              )}
            >
              {test.status === 'passed' && (
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              )}
              {test.status === 'failed' && (
                <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
              )}
              {test.status === 'running' && (
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{test.name}</p>
                {test.error && (
                  <p className="text-xs text-red-500 mt-1 font-mono">
                    {test.error}
                  </p>
                )}
              </div>
              {test.duration && (
                <span className="text-xs text-muted-foreground">
                  {test.duration}
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// FILE TREE
// ============================================================================
function FileTreeComponent() {
  const [expanded, setExpanded] = useState<string[]>(['src', 'components'])

  const toggleExpand = (path: string) => {
    setExpanded((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    )
  }

  const fileTree = [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'Button.tsx', type: 'file' },
            { name: 'Card.tsx', type: 'file' },
            { name: 'Input.tsx', type: 'file' },
          ],
        },
        {
          name: 'hooks',
          type: 'folder',
          children: [
            { name: 'useChat.ts', type: 'file' },
            { name: 'useAuth.ts', type: 'file' },
          ],
        },
        { name: 'App.tsx', type: 'file' },
        { name: 'index.tsx', type: 'file' },
      ],
    },
    { name: 'package.json', type: 'file' },
    { name: 'tsconfig.json', type: 'file' },
    { name: 'README.md', type: 'file' },
  ]

  const renderTree = (items: any[], depth = 0) => {
    return items.map((item, i) => (
      <div key={i}>
        <button
          className={cn(
            'w-full flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted text-sm text-left',
            depth > 0 && 'ml-4'
          )}
          onClick={() => item.type === 'folder' && toggleExpand(item.name)}
        >
          {item.type === 'folder' ? (
            <>
              {expanded.includes(item.name) ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              {expanded.includes(item.name) ? (
                <FolderOpen className="h-4 w-4 text-yellow-500" />
              ) : (
                <Folder className="h-4 w-4 text-yellow-500" />
              )}
            </>
          ) : (
            <>
              <span className="w-4" />
              <File className="h-4 w-4 text-muted-foreground" />
            </>
          )}
          <span>{item.name}</span>
        </button>
        {item.type === 'folder' &&
          expanded.includes(item.name) &&
          item.children &&
          renderTree(item.children, depth + 1)}
      </div>
    ))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">File Explorer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-2">{renderTree(fileTree)}</div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// COMMIT LOG
// ============================================================================
function CommitLog() {
  const commits = [
    {
      hash: 'a3f2e1d',
      message: 'feat: Add new chat components',
      author: 'user',
      time: '2 hours ago',
      branch: 'main',
    },
    {
      hash: 'b4c3d2e',
      message: 'fix: Resolve token counting issue',
      author: 'user',
      time: '5 hours ago',
      branch: 'main',
    },
    {
      hash: 'c5d4e3f',
      message: 'refactor: Improve streaming performance',
      author: 'user',
      time: '1 day ago',
      branch: 'main',
    },
    {
      hash: 'd6e5f4g',
      message: 'docs: Update README',
      author: 'user',
      time: '2 days ago',
      branch: 'main',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Commit History</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <GitBranch className="h-3 w-3" />
              main
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {commits.map((commit, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <GitCommit className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{commit.message}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <code className="text-primary">{commit.hash}</code>
                  <span>•</span>
                  <span>{commit.author}</span>
                  <span>•</span>
                  <span>{commit.time}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CODE SANDBOX
// ============================================================================
function CodeSandboxPreview() {
  const [code, setCode] = useState(`function Hello() {
  return <h1>Hello World!</h1>
}`)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Code Sandbox</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Play className="h-4 w-4" />
              Run
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 divide-x">
          <div className="p-4 bg-[#1e1e1e] font-mono text-sm min-h-[200px]">
            <pre className="text-gray-300 whitespace-pre-wrap">{code}</pre>
          </div>
          <div className="p-4 min-h-[200px] flex items-center justify-center bg-white">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Hello World!</h1>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// WEB PREVIEW
// ============================================================================
function WebPreviewPanel() {
  const [url] = useState('https://example.com')

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Web Preview</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Browser Chrome */}
        <div className="border-t">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted border-b">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 flex items-center gap-2 bg-background rounded px-3 py-1 text-sm">
              <Globe className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">{url}</span>
            </div>
          </div>
          <div className="h-[200px] bg-white flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Web preview area</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// HUMAN IN THE LOOP
// ============================================================================
function HumanInTheLoop() {
  const [decision, setDecision] = useState<string | null>(null)

  return (
    <Card className="border-yellow-500/50 bg-yellow-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-lg">Human Review Required</CardTitle>
        </div>
        <CardDescription>
          The AI has generated a response that requires your approval before
          proceeding.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted rounded-lg mb-4">
          <p className="text-sm font-medium mb-2">Proposed Action:</p>
          <p className="text-sm text-muted-foreground">
            Delete all files in the /temp directory and restart the server
            process.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setDecision('approved')}
            className="gap-2"
            disabled={decision !== null}
          >
            <Check className="h-4 w-4" />
            Approve
          </Button>
          <Button
            onClick={() => setDecision('rejected')}
            variant="outline"
            className="gap-2"
            disabled={decision !== null}
          >
            <X className="h-4 w-4" />
            Reject
          </Button>
          <Button
            onClick={() => setDecision('modified')}
            variant="outline"
            className="gap-2"
            disabled={decision !== null}
          >
            <Edit className="h-4 w-4" />
            Modify
          </Button>
        </div>
        {decision && (
          <Badge
            className="mt-3"
            variant={decision === 'approved' ? 'default' : 'secondary'}
          >
            {decision === 'approved'
              ? 'Approved'
              : decision === 'rejected'
                ? 'Rejected'
                : 'Modification Requested'}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CONFIRMATION DIALOG
// ============================================================================
function ConfirmationDialogDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Confirmation Dialogs</CardTitle>
        <CardDescription>
          Various confirmation patterns for user actions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Danger Confirmation */}
        <div className="p-4 border border-red-500/50 rounded-lg bg-red-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-red-600">Delete Conversation?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                This action cannot be undone. All messages will be permanently
                deleted.
              </p>
              <div className="flex gap-2 mt-3">
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Confirmation */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium">Save Changes?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                You have unsaved changes. Would you like to save them before
                leaving?
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm">Save</Button>
                <Button variant="outline" size="sm">
                  Don&apos;t Save
                </Button>
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// COMPONENT CARDS
// ============================================================================
function ComponentCardsDemo() {
  const components = [
    {
      name: 'ChatInput',
      status: 'stable',
      downloads: '12.5k',
      version: '2.1.0',
    },
    {
      name: 'MessageList',
      status: 'stable',
      downloads: '10.2k',
      version: '2.1.0',
    },
    {
      name: 'TokenMeter',
      status: 'beta',
      downloads: '5.4k',
      version: '1.0.0-beta',
    },
    {
      name: 'VoiceInput',
      status: 'experimental',
      downloads: '2.1k',
      version: '0.5.0',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {components.map((comp, i) => (
        <Card
          key={i}
          className="hover:border-primary/50 transition-colors cursor-pointer"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{comp.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  v{comp.version}
                </p>
              </div>
              <Badge
                variant={
                  comp.status === 'stable'
                    ? 'default'
                    : comp.status === 'beta'
                      ? 'secondary'
                      : 'outline'
                }
              >
                {comp.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                {comp.downloads}
              </span>
              <Button variant="ghost" size="sm" className="ml-auto">
                View Docs
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ============================================================================
// TASK ORCHESTRATOR
// ============================================================================
function TaskOrchestratorDemo() {
  const workflow = [
    { name: 'Parse Input', status: 'completed', duration: '0.2s' },
    { name: 'Validate Request', status: 'completed', duration: '0.1s' },
    { name: 'Generate Response', status: 'running', duration: '2.3s' },
    { name: 'Format Output', status: 'pending', duration: null },
    { name: 'Send Response', status: 'pending', duration: null },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Workflow className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Task Orchestrator</CardTitle>
        </div>
        <CardDescription>
          Visualize multi-step AI task execution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {workflow.map((step, i) => (
            <div key={i} className="flex items-center gap-4 mb-4 last:mb-0">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                  step.status === 'completed' && 'bg-green-500/20',
                  step.status === 'running' && 'bg-blue-500/20',
                  step.status === 'pending' && 'bg-muted'
                )}
              >
                {step.status === 'completed' && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                {step.status === 'running' && (
                  <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                )}
                {step.status === 'pending' && (
                  <span className="text-xs text-muted-foreground">{i + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={cn(
                    'text-sm font-medium',
                    step.status === 'pending' && 'text-muted-foreground'
                  )}
                >
                  {step.name}
                </p>
              </div>
              {step.duration && (
                <span className="text-xs text-muted-foreground">
                  {step.duration}
                </span>
              )}
              {i < workflow.length - 1 && (
                <div
                  className="absolute left-4 ml-3.5 w-px h-4 bg-border"
                  style={{ top: `${(i + 1) * 48 - 8}px` }}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// ARTIFACT PANEL
// ============================================================================
function ArtifactPanel() {
  const artifacts = [
    { type: 'code', title: 'React Component', language: 'typescript' },
    { type: 'document', title: 'API Documentation', format: 'markdown' },
    { type: 'diagram', title: 'System Architecture', format: 'mermaid' },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <PanelTop className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Artifacts</CardTitle>
        </div>
        <CardDescription>Generated content and outputs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {artifacts.map((artifact, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
            >
              {artifact.type === 'code' && (
                <Code className="h-5 w-5 text-blue-500" />
              )}
              {artifact.type === 'document' && (
                <FileText className="h-5 w-5 text-green-500" />
              )}
              {artifact.type === 'diagram' && (
                <Layers className="h-5 w-5 text-purple-500" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{artifact.title}</p>
                <p className="text-xs text-muted-foreground">
                  {artifact.language || artifact.format}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// BOOKMARKS
// ============================================================================
function BookmarksPanel() {
  const bookmarks = [
    {
      title: 'React Hooks Explanation',
      date: '2 hours ago',
      tags: ['react', 'tutorial'],
    },
    {
      title: 'API Rate Limiting Discussion',
      date: '1 day ago',
      tags: ['api', 'performance'],
    },
    {
      title: 'TypeScript Best Practices',
      date: '3 days ago',
      tags: ['typescript'],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Bookmarks</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            <BookmarkPlus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bookmarks.map((bookmark, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50"
            >
              <Bookmark className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">{bookmark.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {bookmark.date}
                  </span>
                  <div className="flex gap-1">
                    {bookmark.tags.map((tag, j) => (
                      <Badge key={j} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CHAIN OF THOUGHT
// ============================================================================
function ChainOfThoughtDemo() {
  const steps = [
    {
      step: 1,
      thought:
        'First, I need to understand what the user is asking about React hooks...',
    },
    {
      step: 2,
      thought:
        'The question involves useEffect, so I should explain the dependency array...',
    },
    {
      step: 3,
      thought: 'I should provide a code example to illustrate the concept...',
    },
    {
      step: 4,
      thought: 'Finally, I&apos;ll mention common pitfalls to avoid...',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          <CardTitle className="text-lg">Chain of Thought</CardTitle>
        </div>
        <CardDescription>AI reasoning process visualization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 bg-purple-500/5 rounded-lg border border-purple-500/20"
            >
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-medium text-purple-600">
                  {step.step}
                </span>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "{step.thought}"
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CITATION CHIPS
// ============================================================================
function CitationChipsDemo() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Citation Chips</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">
            React hooks were introduced in React 16.8
            <Badge
              variant="secondary"
              className="ml-1 cursor-pointer hover:bg-primary/20"
            >
              <Link className="h-3 w-3 mr-1" />
              [1]
            </Badge>
            . The useEffect hook allows you to perform side effects in function
            components
            <Badge
              variant="secondary"
              className="ml-1 cursor-pointer hover:bg-primary/20"
            >
              <Link className="h-3 w-3 mr-1" />
              [2]
            </Badge>
            . It combines the functionality of componentDidMount,
            componentDidUpdate, and componentWillUnmount
            <Badge
              variant="secondary"
              className="ml-1 cursor-pointer hover:bg-primary/20"
            >
              <Link className="h-3 w-3 mr-1" />
              [3]
            </Badge>
            .
          </p>
          <Separator className="my-4" />
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Sources:
            </p>
            {[
              { num: 1, title: 'React Hooks Documentation', url: 'react.dev' },
              { num: 2, title: 'useEffect API Reference', url: 'react.dev' },
              { num: 3, title: 'React Blog Announcement', url: 'reactjs.org' },
            ].map((source) => (
              <div key={source.num} className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="w-6 h-6 p-0 justify-center">
                  {source.num}
                </Badge>
                <span className="font-medium">{source.title}</span>
                <span className="text-muted-foreground">— {source.url}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// COST TRACKER
// ============================================================================
function CostTrackerDemo() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          <CardTitle className="text-lg">Cost Tracker</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-green-500">$0.034</p>
            <p className="text-xs text-muted-foreground">This message</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">$2.45</p>
            <p className="text-xs text-muted-foreground">Today</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">$47.82</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </div>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: '48%' }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          48% of $100 monthly budget
        </p>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// DATA TABLE
// ============================================================================
function DataTableDemo() {
  const data = [
    { id: 1, name: 'GPT-4o', requests: 1234, tokens: '2.4M', cost: '$72.00' },
    {
      id: 2,
      name: 'Claude 3.5',
      requests: 856,
      tokens: '1.7M',
      cost: '$51.00',
    },
    {
      id: 3,
      name: 'GPT-4o-mini',
      requests: 2341,
      tokens: '4.2M',
      cost: '$12.60',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Data Table</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t">
          <div className="grid grid-cols-5 gap-4 px-4 py-2 bg-muted text-sm font-medium text-muted-foreground">
            <span>Model</span>
            <span>Requests</span>
            <span>Tokens</span>
            <span>Cost</span>
            <span>Actions</span>
          </div>
          {data.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-5 gap-4 px-4 py-3 border-t text-sm hover:bg-muted/50"
            >
              <span className="font-medium">{row.name}</span>
              <span>{row.requests.toLocaleString()}</span>
              <span>{row.tokens}</span>
              <span className="font-mono">{row.cost}</span>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// DYNAMIC FORM
// ============================================================================
function DynamicFormDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Dynamic Form</CardTitle>
        <CardDescription>AI-generated form based on schema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Project Name *</label>
          <Input placeholder="Enter project name" className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Input placeholder="Enter description" className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Model Selection *</label>
          <div className="mt-2 space-y-2">
            {['GPT-4o', 'Claude 3.5 Sonnet', 'GPT-4o-mini'].map((model) => (
              <label
                key={model}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox />
                <span className="text-sm">{model}</span>
              </label>
            ))}
          </div>
        </div>
        <Button className="w-full">Submit</Button>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================
function EnvironmentVariablesDemo() {
  const envVars = [
    { key: 'OPENAI_API_KEY', value: 'sk-...abc123', masked: true },
    { key: 'ANTHROPIC_API_KEY', value: 'sk-ant-...xyz789', masked: true },
    { key: 'MODEL_TEMPERATURE', value: '0.7', masked: false },
    { key: 'MAX_TOKENS', value: '4096', masked: false },
  ]

  const [showValues, setShowValues] = useState<{ [key: string]: boolean }>({})

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-lg">Environment Variables</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {envVars.map((env, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
            >
              <code className="text-sm font-medium text-primary">
                {env.key}
              </code>
              <span className="text-muted-foreground">=</span>
              <code className="text-sm flex-1 font-mono">
                {env.masked && !showValues[env.key] ? '••••••••••' : env.value}
              </code>
              {env.masked && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    setShowValues((prev) => ({
                      ...prev,
                      [env.key]: !prev[env.key],
                    }))
                  }
                >
                  {showValues[env.key] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// EMPTY STATE
// ============================================================================
function EmptyStateDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-8">
        <div className="text-center">
          <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-1">No messages yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start a conversation to see messages here
          </p>
          <Button>Start Chat</Button>
        </div>
      </Card>

      <Card className="p-8">
        <div className="text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-1">No results found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try adjusting your search or filters
          </p>
          <Button variant="outline">Clear Filters</Button>
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// SNIPPET MANAGER
// ============================================================================
function SnippetManagerDemo() {
  const snippets = [
    { name: 'React useEffect', language: 'typescript', category: 'Hooks' },
    { name: 'API Fetch Pattern', language: 'typescript', category: 'Async' },
    { name: 'Error Boundary', language: 'tsx', category: 'Components' },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Snippet Manager</CardTitle>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Snippet
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {snippets.map((snippet, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50"
            >
              <Code className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{snippet.name}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {snippet.language}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {snippet.category}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Use
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SCHEMA DISPLAY
// ============================================================================
function SchemaDisplayDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Schema Display</CardTitle>
        <CardDescription>API or data schema visualization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="font-mono text-sm bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-purple-500">interface</span>
            <span className="text-blue-500">Message</span>
            <span>{'{'}</span>
          </div>
          <div className="pl-4 space-y-1">
            <div>
              <span className="text-muted-foreground">id:</span>{' '}
              <span className="text-green-500">string</span>
            </div>
            <div>
              <span className="text-muted-foreground">role:</span>{' '}
              <span className="text-orange-500">"user" | "assistant"</span>
            </div>
            <div>
              <span className="text-muted-foreground">content:</span>{' '}
              <span className="text-green-500">string</span>
            </div>
            <div>
              <span className="text-muted-foreground">timestamp:</span>{' '}
              <span className="text-green-500">Date</span>
            </div>
            <div>
              <span className="text-muted-foreground">metadata?:</span>{' '}
              <span className="text-blue-500">
                Record{'<'}string, any{'>'}
              </span>
            </div>
          </div>
          <div>{'}'}</div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// STATS DISPLAY
// ============================================================================
function StatsDisplayDemo() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {[
        {
          label: 'Total Messages',
          value: '12,847',
          change: '+12%',
          positive: true,
        },
        {
          label: 'Avg Response Time',
          value: '1.2s',
          change: '-8%',
          positive: true,
        },
        {
          label: 'Active Users',
          value: '3,421',
          change: '+24%',
          positive: true,
        },
        {
          label: 'Error Rate',
          value: '0.3%',
          change: '+0.1%',
          positive: false,
        },
      ].map((stat, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p
              className={cn(
                'text-xs mt-1',
                stat.positive ? 'text-green-500' : 'text-red-500'
              )}
            >
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ============================================================================
// BEFORE/AFTER COMPARISON
// ============================================================================
function BeforeAfterDemo() {
  const [position, setPosition] = useState(50)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Before/After Slider</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-48 bg-muted rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
            <span className="text-sm font-medium">Before (Original)</span>
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center bg-green-500/20 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <span className="text-sm font-medium">After (Optimized)</span>
          </div>
          <div
            className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
            style={{ left: `${position}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <ArrowLeft className="h-3 w-3 text-primary-foreground" />
              <ArrowRight className="h-3 w-3 text-primary-foreground" />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <input
            type="range"
            min="0"
            max="100"
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground text-center mt-1">
            {position}%
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// LINK PREVIEW
// ============================================================================
function LinkPreviewDemo() {
  const links = [
    {
      url: 'https://github.com/clarity-chat/react',
      title: 'Clarity Chat React Components',
      description:
        'Production-ready AI chat components for React with streaming, memory, and more.',
      image: null,
      favicon: '🔗',
    },
    {
      url: 'https://docs.anthropic.com',
      title: 'Anthropic Documentation',
      description: 'Official documentation for Claude API and best practices.',
      image: null,
      favicon: '📚',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Link Previews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {links.map((link, i) => (
          <div
            key={i}
            className="flex gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">
              {link.favicon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{link.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {link.description}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-primary truncate">
                  {link.url}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CONTEXT MENU
// ============================================================================
function ContextMenuDemo() {
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
    setShowMenu(true)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Context Menu</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="relative h-40 bg-muted rounded-lg flex items-center justify-center cursor-context-menu"
          onContextMenu={handleContextMenu}
          onClick={() => setShowMenu(false)}
        >
          <p className="text-sm text-muted-foreground">Right-click anywhere</p>
          {showMenu && (
            <div
              className="absolute z-10 bg-popover border rounded-lg shadow-lg py-1 min-w-[160px]"
              style={{ left: menuPosition.x, top: menuPosition.y }}
            >
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                <Copy className="h-4 w-4" /> Copy
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                <Edit className="h-4 w-4" /> Edit
              </button>
              <Separator className="my-1" />
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-destructive">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MODEL SELECTOR
// ============================================================================
function ModelSelectorDemo() {
  const [selectedModel, setSelectedModel] = useState('claude-3-5-sonnet')
  const models = [
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      speed: 'Fast',
      quality: '95%',
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      speed: 'Medium',
      quality: '99%',
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      speed: 'Fast',
      quality: '94%',
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      provider: 'OpenAI',
      speed: 'Very Fast',
      quality: '85%',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Model Selector</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => setSelectedModel(model.id)}
            className={cn(
              'w-full flex items-center justify-between p-3 rounded-lg border transition-colors text-left',
              selectedModel === model.id
                ? 'border-primary bg-primary/5'
                : 'hover:bg-muted'
            )}
          >
            <div>
              <p className="font-medium text-sm">{model.name}</p>
              <p className="text-xs text-muted-foreground">{model.provider}</p>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-xs">
                {model.speed}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {model.quality} quality
              </p>
            </div>
            {selectedModel === model.id && (
              <Check className="h-4 w-4 text-primary ml-2" />
            )}
          </button>
        ))}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================
function KeyboardShortcutsDemo() {
  const shortcuts = [
    { shortcut: 'mod+k', action: 'Open Command Palette' },
    { shortcut: 'mod+enter', action: 'Send Message' },
    { shortcut: 'mod+shift+c', action: 'Copy Code' },
    { shortcut: 'escape', action: 'Close Dialog' },
    { shortcut: 'mod+/', action: 'Toggle Sidebar' },
    { shortcut: 'mod+b', action: 'Bold Text' },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Keyboard className="h-5 w-5" />
          Keyboard Shortcuts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {shortcuts.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-lg bg-muted"
            >
              <span className="text-sm">{item.action}</span>
              <Kbd shortcut={item.shortcut} size="sm" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SUGGESTION CHIPS
// ============================================================================
function SuggestionChipsDemo() {
  const suggestions = [
    'How does this work?',
    'Show me an example',
    'What are the alternatives?',
    'Explain in simple terms',
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Suggestion Chips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              {s}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// STEPS INDICATOR
// ============================================================================
function StepsIndicatorDemo() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Steps Indicator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {[
            { step: 1, label: 'Setup', status: 'completed' },
            { step: 2, label: 'Configure', status: 'completed' },
            { step: 3, label: 'Deploy', status: 'current' },
            { step: 4, label: 'Verify', status: 'upcoming' },
          ].map((item, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    item.status === 'completed' && 'bg-green-500 text-white',
                    item.status === 'current' &&
                      'bg-primary text-primary-foreground',
                    item.status === 'upcoming' &&
                      'bg-muted text-muted-foreground'
                  )}
                >
                  {item.status === 'completed' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    item.step
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs mt-1',
                    item.status === 'current'
                      ? 'font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </span>
              </div>
              {i < 3 && (
                <div
                  className={cn(
                    'w-16 h-0.5 mx-2',
                    item.status === 'completed' ? 'bg-green-500' : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// THREADS VIEW
// ============================================================================
function ThreadsViewDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Conversation Threads</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            {
              title: 'React Performance Discussion',
              replies: 5,
              unread: 2,
              time: '2m ago',
            },
            {
              title: 'API Design Question',
              replies: 12,
              unread: 0,
              time: '1h ago',
            },
            {
              title: 'Bug Report #1234',
              replies: 8,
              unread: 3,
              time: '3h ago',
            },
          ].map((thread, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Bot className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{thread.title}</p>
                  {thread.unread > 0 && (
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      {thread.unread}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {thread.replies} replies · {thread.time}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PROGRESS INDICATORS
// ============================================================================
function ProgressIndicatorsDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Linear Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Uploading files...</span>
              <span>67%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: '67%' }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Processing...</span>
              <span>Indeterminate</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'CPU', value: 45, color: 'bg-green-500' },
          { label: 'Memory', value: 72, color: 'bg-yellow-500' },
          { label: 'Disk', value: 89, color: 'bg-red-500' },
        ].map((item, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className={item.color.replace('bg-', 'text-')}
                    strokeDasharray={`${item.value * 2.26} 226`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                  {item.value}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// REALTIME INDICATOR
// ============================================================================
function RealtimeIndicatorDemo() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Realtime Status</CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-500">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { event: 'User joined conversation', time: 'Just now', icon: User },
            { event: 'Message received', time: '2s ago', icon: Bot },
            { event: 'File uploaded', time: '5s ago', icon: FileText },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
            >
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm flex-1">{item.event}</span>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SAFETY BANNER
// ============================================================================
function SafetyComponentsDemo() {
  return (
    <div className="space-y-4">
      <Card className="border-red-500/50 bg-red-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-600">Content Warning</h4>
            <p className="text-sm text-muted-foreground mt-1">
              This response may contain sensitive content. User discretion is
              advised.
            </p>
            <div className="flex gap-2 mt-3">
              <Button variant="destructive" size="sm">
                Show Anyway
              </Button>
              <Button variant="outline" size="sm">
                Hide
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-600">Rate Limit Warning</h4>
            <p className="text-sm text-muted-foreground mt-1">
              You are approaching your API rate limit. 85% of quota used.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-500/50 bg-green-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-600">Content Verified</h4>
            <p className="text-sm text-muted-foreground mt-1">
              This response has been verified for accuracy and safety.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// CALENDAR COMPONENT
// ============================================================================
function CalendarDemo() {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const dates = Array.from({ length: 35 }, (_, i) => i - 3)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">January 2024</CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((day) => (
            <div key={day} className="text-xs text-muted-foreground py-2">
              {day}
            </div>
          ))}
          {dates.map((date, i) => (
            <button
              key={i}
              className={cn(
                'h-8 w-8 rounded-full text-sm',
                date <= 0 || date > 31
                  ? 'text-muted-foreground/50'
                  : 'hover:bg-muted',
                date === 15 && 'bg-primary text-primary-foreground'
              )}
            >
              {date <= 0 ? 31 + date : date > 31 ? date - 31 : date}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MESSAGE ACTIONS
// ============================================================================
function MessageActionsDemo() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Message Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm mb-3">
            This is an AI response that can have various actions.
          </p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Share className="h-3.5 w-3.5" />
              Share
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Bookmark className="h-3.5 w-3.5" />
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// VOICE COMPONENTS
// ============================================================================
function VoiceComponentsDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Voice Input</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-2xl">🎤</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Listening...</p>
            <div className="flex gap-1 mt-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${8 + Math.random() * 24}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Audio Player</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Button size="icon" className="h-10 w-10 rounded-full">
              <Play className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: '35%' }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1:24</span>
                <span>4:02</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// QUEUE DISPLAY
// ============================================================================
function QueueDisplayDemo() {
  const queueItems = [
    { position: 1, task: 'Generate report', status: 'processing' },
    { position: 2, task: 'Analyze data', status: 'waiting' },
    { position: 3, task: 'Send notifications', status: 'waiting' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Task Queue</CardTitle>
        <CardDescription>3 tasks in queue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {queueItems.map((item) => (
            <div
              key={item.position}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                {item.position}
              </div>
              <span className="flex-1 text-sm">{item.task}</span>
              {item.status === 'processing' ? (
                <Badge className="bg-blue-500/20 text-blue-600 gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Processing
                </Badge>
              ) : (
                <Badge variant="secondary">Waiting</Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PRESETS SELECTOR
// ============================================================================
function PresetsSelectorDemo() {
  const presets = [
    { name: 'Creative Writing', temperature: 0.9, maxTokens: 2000 },
    { name: 'Code Generation', temperature: 0.2, maxTokens: 4000 },
    { name: 'Balanced', temperature: 0.7, maxTokens: 1000 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Model Presets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {presets.map((preset, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors',
                i === 2 && 'border-primary bg-primary/5'
              )}
            >
              <div
                className={cn(
                  'w-4 h-4 rounded-full border-2',
                  i === 2
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground'
                )}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{preset.name}</p>
                <p className="text-xs text-muted-foreground">
                  Temp: {preset.temperature} · Max: {preset.maxTokens}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// RAG SOURCES
// ============================================================================
function RAGSourcesDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Retrieved Sources (RAG)</CardTitle>
        <CardDescription>
          Documents used to generate this response
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { title: 'Company Policy Document', relevance: 0.95, chunks: 3 },
            { title: 'Product Documentation', relevance: 0.87, chunks: 2 },
            { title: 'FAQ Database', relevance: 0.72, chunks: 1 },
          ].map((source, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{source.title}</p>
                <p className="text-xs text-muted-foreground">
                  {source.chunks} chunks retrieved
                </p>
              </div>
              <Badge variant="outline">
                {Math.round(source.relevance * 100)}% match
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// RICH EMBED
// ============================================================================
function RichEmbedDemo() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        <Play className="h-16 w-16 text-white opacity-80" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
            <Globe className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">youtube.com</p>
            <h3 className="font-medium">Introduction to AI Chat Components</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Learn how to build powerful AI chat interfaces with Clarity
              Chat...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// READ RECEIPT
// ============================================================================
function ReadReceiptDemo() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Read Receipts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-2 max-w-[70%]">
              <p className="text-sm">Here is the report you requested.</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-70">10:24 AM</span>
                <CheckCircle className="h-3 w-3 text-blue-300" />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-2 max-w-[70%]">
              <p className="text-sm">Let me know if you have questions.</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-70">10:25 AM</span>
                <Check className="h-3 w-3 opacity-70" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// RETRY LOGIC
// ============================================================================
function RetryLogicDemo() {
  return (
    <Card className="border-red-500/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <RefreshCw className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">Request Failed</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Connection timed out. Retrying automatically...
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span>Attempt 2 of 3</span>
                  <span>Retrying in 3s</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full animate-pulse"
                    style={{ width: '66%' }}
                  />
                </div>
              </div>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SETTINGS PANEL
// ============================================================================
function SettingsPanelDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { label: 'Dark Mode', description: 'Use dark theme', enabled: true },
          {
            label: 'Notifications',
            description: 'Receive push notifications',
            enabled: true,
          },
          {
            label: 'Sound Effects',
            description: 'Play sounds for events',
            enabled: false,
          },
          {
            label: 'Auto-save',
            description: 'Save conversations automatically',
            enabled: true,
          },
        ].map((setting, i) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{setting.label}</p>
              <p className="text-xs text-muted-foreground">
                {setting.description}
              </p>
            </div>
            <div
              className={cn(
                'w-11 h-6 rounded-full relative cursor-pointer transition-colors',
                setting.enabled ? 'bg-primary' : 'bg-muted'
              )}
            >
              <div
                className={cn(
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                  setting.enabled ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MCP MANAGER
// ============================================================================
function MCPManagerDemo() {
  const mcpServers = [
    { name: 'filesystem', status: 'connected', tools: 12, version: '1.2.0' },
    { name: 'database', status: 'connected', tools: 8, version: '2.0.1' },
    { name: 'web-search', status: 'disconnected', tools: 5, version: '1.0.0' },
    {
      name: 'code-interpreter',
      status: 'connected',
      tools: 15,
      version: '3.1.0',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">MCP Servers</CardTitle>
            <CardDescription>
              Model Context Protocol connections
            </CardDescription>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Server
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mcpServers.map((server, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  server.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                )}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium font-mono">{server.name}</p>
                  <Badge variant="outline" className="text-xs">
                    v{server.version}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {server.tools} tools available
                </p>
              </div>
              <Badge
                variant={
                  server.status === 'connected' ? 'default' : 'secondary'
                }
              >
                {server.status}
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total tools available</span>
          <span className="font-medium">40 tools from 4 servers</span>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// LOGIN FORM
// ============================================================================
function LoginFormDemo() {
  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input type="email" placeholder="you@example.com" className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <Input type="password" placeholder="••••••••" className="mt-1" />
        </div>
        <Button className="w-full">Sign In</Button>
        <div className="relative">
          <Separator />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or continue with
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline">Google</Button>
          <Button variant="outline">GitHub</Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PASSWORD INPUT
// ============================================================================
function PasswordInputDemo() {
  const [show, setShow] = useState(false)
  const [strength, setStrength] = useState(2)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Password Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Input
            type={show ? 'text' : 'password'}
            placeholder="Enter password"
            className="pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full w-10"
            onClick={() => setShow(!show)}
          >
            {show ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 flex-1 rounded-full',
                  i <= strength
                    ? strength === 1
                      ? 'bg-red-500'
                      : strength === 2
                        ? 'bg-yellow-500'
                        : strength >= 3
                          ? 'bg-green-500'
                          : 'bg-muted'
                    : 'bg-muted'
                )}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Password strength:{' '}
            {strength === 1
              ? 'Weak'
              : strength === 2
                ? 'Fair'
                : strength === 3
                  ? 'Good'
                  : 'Strong'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PINNED MESSAGES
// ============================================================================
function PinnedMessagesDemo() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Pinned Messages</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            {
              content: 'API documentation for the new endpoints',
              author: 'AI',
              time: '2h ago',
            },
            {
              content: 'Important: Security update required by Friday',
              author: 'You',
              time: '1d ago',
            },
          ].map((msg, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg"
            >
              <Bookmark className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {msg.author} · {msg.time}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// REACTIONS
// ============================================================================
function ReactionsDemo() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Message Reactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm mb-3">
            This is a message that users can react to.
          </p>
          <div className="flex items-center gap-2">
            {[
              { emoji: '👍', count: 5 },
              { emoji: '❤️', count: 3 },
              { emoji: '🎉', count: 2 },
              { emoji: '😄', count: 1 },
            ].map((reaction, i) => (
              <button
                key={i}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-sm"
              >
                <span>{reaction.emoji}</span>
                <span className="text-xs text-muted-foreground">
                  {reaction.count}
                </span>
              </button>
            ))}
            <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted text-muted-foreground">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// QUICK REPLY
// ============================================================================
function QuickReplyDemo() {
  const replies = [
    'Got it, thanks!',
    'Can you explain more?',
    'Let me check and get back to you',
    'Perfect!',
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Replies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {replies.map((reply, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              {reply}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SOCIAL POSTS
// ============================================================================
function SocialPostsDemo() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">AI Assistant</span>
              <span className="text-xs text-muted-foreground">
                @ai_assistant · 2h
              </span>
            </div>
            <p className="text-sm mt-1">
              Just launched our new chat components library! 🚀 Check out the
              150+ components for building AI interfaces.
            </p>
            <div className="flex items-center gap-6 mt-3 text-muted-foreground">
              <button className="flex items-center gap-1 text-xs hover:text-primary">
                <MessageSquare className="h-4 w-4" />
                24
              </button>
              <button className="flex items-center gap-1 text-xs hover:text-green-500">
                <RefreshCw className="h-4 w-4" />
                12
              </button>
              <button className="flex items-center gap-1 text-xs hover:text-red-500">
                ❤️ 128
              </button>
              <button className="flex items-center gap-1 text-xs hover:text-primary">
                <Share className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SORTABLE LIST
// ============================================================================
function SortableListDemo() {
  const items = ['First item', 'Second item', 'Third item', 'Fourth item']

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Sortable List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border rounded-lg bg-card cursor-move hover:border-primary/50"
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground rotate-90" />
              <span className="text-sm flex-1">{item}</span>
              <Badge variant="outline">{i + 1}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TABLE OF CONTENTS
// ============================================================================
function TableOfContentsDemo() {
  const sections = [
    { title: 'Getting Started', level: 1, active: false },
    { title: 'Installation', level: 2, active: false },
    { title: 'Quick Start', level: 2, active: true },
    { title: 'Components', level: 1, active: false },
    { title: 'Chat Input', level: 2, active: false },
    { title: 'Message List', level: 2, active: false },
    { title: 'API Reference', level: 1, active: false },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Table of Contents</CardTitle>
      </CardHeader>
      <CardContent>
        <nav className="space-y-1">
          {sections.map((section, i) => (
            <a
              key={i}
              href="#"
              className={cn(
                'block text-sm py-1 transition-colors',
                section.level === 1 ? 'font-medium' : 'ml-4',
                section.active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {section.title}
            </a>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TRACE VIEW
// ============================================================================
function TraceViewDemo() {
  const traces = [
    {
      name: 'HTTP Request',
      duration: '245ms',
      status: 'success',
      children: [
        { name: 'Parse Body', duration: '12ms', status: 'success' },
        { name: 'Validate Token', duration: '34ms', status: 'success' },
        { name: 'Process Request', duration: '189ms', status: 'success' },
      ],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trace View</CardTitle>
        <CardDescription>Request execution timeline</CardDescription>
      </CardHeader>
      <CardContent>
        {traces.map((trace, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium flex-1">{trace.name}</span>
              <span className="text-xs text-muted-foreground">
                {trace.duration}
              </span>
            </div>
            <div className="ml-4 space-y-1">
              {trace.children?.map((child, j) => (
                <div key={j} className="flex items-center gap-3 p-2 rounded-lg">
                  <Check className="h-3 w-3 text-green-500" />
                  <span className="text-sm flex-1">{child.name}</span>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${parseInt(child.duration, 10) / 2.5}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {child.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// WEB SEARCH COMPONENT
// ============================================================================
function WebSearchDemo() {
  const results = [
    {
      title: 'React Documentation',
      url: 'react.dev',
      snippet: 'The library for web and native user interfaces...',
    },
    {
      title: 'React Hooks Guide',
      url: 'react.dev/hooks',
      snippet: 'Hooks let you use state and other React features...',
    },
    {
      title: 'Next.js Documentation',
      url: 'nextjs.org',
      snippet: 'The React Framework for the Web...',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Web Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input placeholder="Search the web..." className="flex-1" />
          <Button className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
        <div className="space-y-4">
          {results.map((result, i) => (
            <div key={i} className="group cursor-pointer">
              <p className="text-xs text-muted-foreground">{result.url}</p>
              <p className="text-sm font-medium text-primary group-hover:underline">
                {result.title}
              </p>
              <p className="text-sm text-muted-foreground">{result.snippet}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// WORKFLOW NODES
// ============================================================================
function WorkflowNodesDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Workflow Nodes</CardTitle>
        <CardDescription>Visual node-based workflow builder</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-64 bg-muted/30 rounded-lg p-4 overflow-hidden">
          {/* Start Node */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-24 p-2 bg-green-500/20 border border-green-500/50 rounded-lg text-center">
            <Play className="h-4 w-4 text-green-500 mx-auto mb-1" />
            <span className="text-xs font-medium">Start</span>
          </div>
          {/* Line */}
          <div className="absolute left-28 top-1/2 w-12 h-0.5 bg-muted-foreground/30" />
          {/* Process Node */}
          <div className="absolute left-40 top-1/2 -translate-y-1/2 w-28 p-2 bg-blue-500/20 border border-blue-500/50 rounded-lg text-center">
            <Brain className="h-4 w-4 text-blue-500 mx-auto mb-1" />
            <span className="text-xs font-medium">AI Process</span>
          </div>
          {/* Line */}
          <div className="absolute left-[17rem] top-1/2 w-12 h-0.5 bg-muted-foreground/30" />
          {/* Branch */}
          <div className="absolute left-[19.5rem] top-1/2 -translate-y-1/2 w-24 p-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-center">
            <GitBranch className="h-4 w-4 text-yellow-500 mx-auto mb-1" />
            <span className="text-xs font-medium">Branch</span>
          </div>
          {/* End nodes */}
          <div className="absolute right-4 top-8 w-24 p-2 bg-purple-500/20 border border-purple-500/50 rounded-lg text-center">
            <CheckCircle className="h-4 w-4 text-purple-500 mx-auto mb-1" />
            <span className="text-xs font-medium">Success</span>
          </div>
          <div className="absolute right-4 bottom-8 w-24 p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
            <XCircle className="h-4 w-4 text-red-500 mx-auto mb-1" />
            <span className="text-xs font-medium">Error</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// BRANCH PICKER
// ============================================================================
function BranchPickerDemo() {
  const branches = [
    { name: 'main', current: true, commits: 234 },
    { name: 'develop', current: false, commits: 156 },
    { name: 'feature/chat-ui', current: false, commits: 12 },
    { name: 'fix/token-count', current: false, commits: 3 },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Branch Picker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {branches.map((branch, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                branch.current
                  ? 'bg-primary/10 border border-primary/50'
                  : 'hover:bg-muted'
              )}
            >
              <GitBranch
                className={cn(
                  'h-4 w-4',
                  branch.current ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <span
                className={cn(
                  'text-sm flex-1 font-mono',
                  branch.current && 'font-medium'
                )}
              >
                {branch.name}
              </span>
              {branch.current && <Badge className="bg-primary">Current</Badge>}
              <span className="text-xs text-muted-foreground">
                {branch.commits} commits
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CHAT SIDEBAR
// ============================================================================
function ChatSidebarDemo() {
  const conversations = [
    {
      title: 'React Hooks Help',
      preview: 'Can you explain useEffect...',
      time: '2m',
      unread: 2,
    },
    {
      title: 'API Design',
      preview: 'The endpoints should be...',
      time: '1h',
      unread: 0,
    },
    {
      title: 'Code Review',
      preview: 'Looks good overall, but...',
      time: '3h',
      unread: 0,
    },
    {
      title: 'Bug Investigation',
      preview: 'Found the issue in...',
      time: '1d',
      unread: 0,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Conversations</CardTitle>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {conversations.map((conv, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50',
                i === 0 && 'bg-muted/50'
              )}
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{conv.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {conv.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {conv.preview}
                </p>
              </div>
              {conv.unread > 0 && (
                <Badge className="bg-primary shrink-0">{conv.unread}</Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// COPY BUTTON
// ============================================================================
function CopyButtonDemo() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Copy Button</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <code className="text-sm flex-1 font-mono">
              npm install @clarity-chat/react
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Copy className="h-4 w-4" />
              Copy as Markdown
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CONVERSATION MANAGER
// ============================================================================
function ConversationManagerDemo() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Conversation Manager</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export All
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            {
              title: 'Project Planning',
              messages: 24,
              tokens: '12.4k',
              date: 'Today',
            },
            {
              title: 'Code Review Session',
              messages: 56,
              tokens: '28.1k',
              date: 'Yesterday',
            },
            {
              title: 'Debug Session',
              messages: 18,
              tokens: '8.2k',
              date: '3 days ago',
            },
          ].map((conv, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              <Checkbox />
              <div className="flex-1">
                <p className="text-sm font-medium">{conv.title}</p>
                <p className="text-xs text-muted-foreground">
                  {conv.messages} messages · {conv.tokens} tokens · {conv.date}
                </p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share className="h-4 w-4" />
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
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// DEV TOOLS DEMOS
// ============================================================================
function DevToolsDashboardDemo() {
  const [activeTab, setActiveTab] = useState('api')

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Dev Tools Dashboard
          </CardTitle>
          <Badge className="bg-green-500/20 text-green-600">Connected</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="perf">Performance</TabsTrigger>
            <TabsTrigger value="state">State</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
          </TabsList>
          <TabsContent value="api" className="space-y-2">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="font-mono text-sm">POST /api/chat</span>
                </div>
                <Badge variant="outline">200 OK</Badge>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span>234ms</span>
                <span>2.1KB</span>
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="font-mono text-sm">GET /api/models</span>
                </div>
                <Badge variant="outline">200 OK</Badge>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span>45ms</span>
                <span>512B</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="perf"
            className="text-center py-8 text-muted-foreground"
          >
            Performance metrics panel
          </TabsContent>
          <TabsContent
            value="state"
            className="text-center py-8 text-muted-foreground"
          >
            State time travel panel
          </TabsContent>
          <TabsContent
            value="models"
            className="text-center py-8 text-muted-foreground"
          >
            Model comparison panel
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function APIInspectorDemo() {
  const requests = [
    {
      id: 1,
      method: 'POST',
      endpoint: '/api/chat',
      status: 200,
      time: '234ms',
      size: '2.1KB',
    },
    {
      id: 2,
      method: 'GET',
      endpoint: '/api/models',
      status: 200,
      time: '45ms',
      size: '512B',
    },
    {
      id: 3,
      method: 'POST',
      endpoint: '/api/stream',
      status: 200,
      time: '1.2s',
      size: '15KB',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">API Inspector</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              3 requests
            </Badge>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {requests.map((req) => (
          <div
            key={req.id}
            className="flex items-center gap-3 p-2 bg-muted rounded-lg text-sm"
          >
            <Badge
              className={cn(
                'font-mono text-xs',
                req.method === 'POST'
                  ? 'bg-blue-500/20 text-blue-600'
                  : 'bg-green-500/20 text-green-600'
              )}
            >
              {req.method}
            </Badge>
            <span className="font-mono flex-1 truncate">{req.endpoint}</span>
            <Badge variant="outline">{req.status}</Badge>
            <span className="text-muted-foreground text-xs">{req.time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ProfilerPanelDemo() {
  const metrics = [
    { name: 'Render Time', value: '12.3ms', trend: 'down' },
    { name: 'Re-renders', value: '3', trend: 'neutral' },
    { name: 'Memory', value: '45MB', trend: 'up' },
    { name: 'FPS', value: '60', trend: 'neutral' },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Performance Profiler</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Activity className="h-3.5 w-3.5" />
            Record
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <div key={metric.name} className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">{metric.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-lg font-bold">{metric.value}</p>
                {metric.trend === 'down' && (
                  <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />
                )}
                {metric.trend === 'up' && (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function TimeTravelDemo() {
  const [currentIndex, setCurrentIndex] = useState(3)
  const states = [
    { id: 0, action: 'INIT', time: '0:00' },
    { id: 1, action: 'SET_MESSAGE', time: '0:02' },
    { id: 2, action: 'SEND_REQUEST', time: '0:03' },
    { id: 3, action: 'RECEIVE_RESPONSE', time: '0:05' },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">State Time Travel</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            >
              <SkipBack className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() =>
                setCurrentIndex(Math.min(states.length - 1, currentIndex + 1))
              }
            >
              <SkipForward className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {states.map((state, i) => (
          <button
            key={state.id}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              'w-full flex items-center gap-3 p-2 rounded-lg text-sm text-left transition-colors',
              i === currentIndex
                ? 'bg-primary/10 border border-primary/30'
                : 'hover:bg-muted'
            )}
          >
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-mono">
              {i}
            </span>
            <span className="flex-1 font-mono">{state.action}</span>
            <span className="text-xs text-muted-foreground">{state.time}</span>
          </button>
        ))}
      </CardContent>
    </Card>
  )
}

function ModelComparisonDemo() {
  const models = [
    { name: 'GPT-4o', cost: '$0.005', latency: '234ms', quality: 95 },
    { name: 'Claude 3.5', cost: '$0.003', latency: '198ms', quality: 97 },
    { name: 'GPT-4o-mini', cost: '$0.0001', latency: '89ms', quality: 85 },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Model Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {models.map((model, i) => (
            <div
              key={model.name}
              className={cn(
                'p-3 rounded-lg border',
                i === 0 && 'border-primary bg-primary/5'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{model.name}</span>
                {i === 0 && <Badge>Best Value</Badge>}
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Cost</p>
                  <p className="font-mono">{model.cost}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Latency</p>
                  <p className="font-mono">{model.latency}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Quality</p>
                  <p className="font-mono">{model.quality}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// AI ADAPTER DEMOS
// ============================================================================

function MultiProviderAdapterDemo() {
  const [selectedProvider, setSelectedProvider] = useState<
    'openai' | 'anthropic' | 'google'
  >('openai')
  const [isConnecting, setIsConnecting] = useState(false)
  const [status, setStatus] = useState<
    'disconnected' | 'connecting' | 'connected'
  >('disconnected')

  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      color: 'bg-green-500',
      icon: '🟢',
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
      color: 'bg-orange-500',
      icon: '🟠',
    },
    {
      id: 'google',
      name: 'Google',
      models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
      color: 'bg-blue-500',
      icon: '🔵',
    },
  ]

  const handleConnect = () => {
    setIsConnecting(true)
    setStatus('connecting')
    setTimeout(() => {
      setIsConnecting(false)
      setStatus('connected')
    }, 1500)
  }

  const currentProvider = providers.find((p) => p.id === selectedProvider)!

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Provider Selector */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Select Provider</h4>
          <div className="grid grid-cols-3 gap-3">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => {
                  setSelectedProvider(provider.id as typeof selectedProvider)
                  setStatus('disconnected')
                }}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all text-left',
                  selectedProvider === provider.id
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent bg-muted/50 hover:bg-muted'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{provider.icon}</span>
                  <span className="font-medium">{provider.name}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {provider.models.length} models
                </div>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-3 h-3 rounded-full',
                status === 'connected'
                  ? 'bg-green-500'
                  : status === 'connecting'
                    ? 'bg-yellow-500 animate-pulse'
                    : 'bg-muted-foreground'
              )}
            />
            <div>
              <p className="font-medium">{currentProvider.name} Adapter</p>
              <p className="text-xs text-muted-foreground capitalize">
                {status}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleConnect}
            disabled={isConnecting || status === 'connected'}
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : status === 'connected' ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Connected
              </>
            ) : (
              'Connect'
            )}
          </Button>
        </div>

        {/* Available Models */}
        {status === 'connected' && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Available Models</h4>
            <div className="flex flex-wrap gap-2">
              {currentProvider.models.map((model) => (
                <Badge key={model} variant="secondary">
                  {model}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Code Example */}
        <div className="p-3 rounded-lg bg-muted font-mono text-xs overflow-x-auto">
          <pre>{`import { getAdapter } from '@clarity-chat/react/adapters'

const adapter = getAdapter('${selectedProvider}')
const response = await adapter.chat({
  model: '${currentProvider.models[0]}',
  messages: [{ role: 'user', content: 'Hello!' }]
})`}</pre>
        </div>
      </CardContent>
    </Card>
  )
}

function AdapterModelSelectorDemo() {
  const [selectedModel, setSelectedModel] = useState('gpt-4o')

  const models = [
    {
      id: 'gpt-4o',
      provider: 'OpenAI',
      name: 'GPT-4o',
      speed: 4,
      quality: 5,
      cost: 4,
      context: '128K',
    },
    {
      id: 'claude-3-sonnet',
      provider: 'Anthropic',
      name: 'Claude 3 Sonnet',
      speed: 4,
      quality: 5,
      cost: 3,
      context: '200K',
    },
    {
      id: 'gemini-1.5-pro',
      provider: 'Google',
      name: 'Gemini 1.5 Pro',
      speed: 5,
      quality: 4,
      cost: 3,
      context: '1M',
    },
    {
      id: 'gpt-3.5-turbo',
      provider: 'OpenAI',
      name: 'GPT-3.5 Turbo',
      speed: 5,
      quality: 3,
      cost: 1,
      context: '16K',
    },
  ]

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              'h-3 w-3',
              i <= count ? 'fill-yellow-500 text-yellow-500' : 'text-muted'
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <ScrollArea className="h-[250px]">
          <div className="space-y-2 pr-4">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={cn(
                  'w-full p-3 rounded-lg border text-left transition-all',
                  selectedModel === model.id
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent bg-muted/30 hover:bg-muted/50'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {model.provider}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {model.context}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Speed</span>
                    {renderStars(model.speed)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quality</span>
                    {renderStars(model.quality)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cost</span>
                    {renderStars(model.cost)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function ProviderHealthDemo() {
  const [metrics, setMetrics] = useState({
    openai: { latency: 245, uptime: 99.9, errors: 0.1 },
    anthropic: { latency: 312, uptime: 99.8, errors: 0.2 },
    google: { latency: 189, uptime: 99.7, errors: 0.3 },
  })

  const providers = [
    { id: 'openai', name: 'OpenAI', icon: '🟢' },
    { id: 'anthropic', name: 'Anthropic', icon: '🟠' },
    { id: 'google', name: 'Google', icon: '🔵' },
  ]

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        {providers.map((provider) => {
          const m = metrics[provider.id as keyof typeof metrics]
          const healthScore = m.uptime - m.errors * 10
          const status =
            healthScore >= 99
              ? 'healthy'
              : healthScore >= 95
                ? 'degraded'
                : 'down'

          return (
            <div
              key={provider.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <span>{provider.icon}</span>
                <div>
                  <p className="font-medium text-sm">{provider.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.latency}ms avg latency
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-xs">
                  <p className="text-green-500">{m.uptime}% uptime</p>
                  <p className="text-muted-foreground">{m.errors}% errors</p>
                </div>
                <div
                  className={cn(
                    'w-2.5 h-2.5 rounded-full',
                    status === 'healthy'
                      ? 'bg-green-500'
                      : status === 'degraded'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  )}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

function RetryCircuitBreakerDemo() {
  const [state, setState] = useState<'closed' | 'open' | 'half-open'>('closed')
  const [attempts, setAttempts] = useState(0)
  const [lastError, setLastError] = useState<string | null>(null)

  const simulateRequest = () => {
    if (state === 'open') {
      setLastError('Circuit breaker is OPEN - requests blocked')
      return
    }

    setAttempts((prev) => prev + 1)

    // Simulate random failure
    if (Math.random() < 0.4) {
      setLastError('Request failed - retrying with exponential backoff...')
      if (attempts >= 2) {
        setState('open')
        setTimeout(() => setState('half-open'), 3000)
      }
    } else {
      setLastError(null)
      setState('closed')
      setAttempts(0)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-4 h-4 rounded-full',
                state === 'closed'
                  ? 'bg-green-500'
                  : state === 'open'
                    ? 'bg-red-500'
                    : 'bg-yellow-500 animate-pulse'
              )}
            />
            <div>
              <p className="font-medium">Circuit Breaker</p>
              <p className="text-xs text-muted-foreground capitalize">
                State: {state}
              </p>
            </div>
          </div>
          <Badge variant={state === 'closed' ? 'secondary' : 'destructive'}>
            {attempts} attempts
          </Badge>
        </div>

        {lastError && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
            <span className="text-red-700 dark:text-red-300">{lastError}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" onClick={simulateRequest}>
            Send Request
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setState('closed')
              setAttempts(0)
              setLastError(null)
            }}
          >
            Reset
          </Button>
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
          <p className="font-medium mb-1">Retry Config:</p>
          <p>Max retries: 3 | Backoff: 1s, 2s, 4s | Circuit threshold: 3</p>
        </div>
      </CardContent>
    </Card>
  )
}

function RequestInspectorDemo() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      method: 'POST',
      endpoint: '/v1/chat/completions',
      status: 200,
      latencyMs: 120,
      tokens: 156,
    },
    {
      id: 2,
      method: 'POST',
      endpoint: '/v1/chat/completions',
      status: 200,
      latencyMs: 350,
      tokens: 342,
    },
    {
      id: 3,
      method: 'POST',
      endpoint: '/v1/embeddings',
      status: 429,
      latencyMs: 500,
      tokens: 0,
    },
  ])

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm"
            >
              <div className="flex items-center gap-3">
                <Badge
                  variant={req.status === 200 ? 'secondary' : 'destructive'}
                  className="font-mono"
                >
                  {req.status}
                </Badge>
                <span className="font-mono text-xs">{req.method}</span>
                <span className="text-muted-foreground text-xs">
                  {req.endpoint}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">{req.latencyMs}ms</span>
                {req.tokens > 0 && (
                  <span className="text-green-500">{req.tokens} tok</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            setRequests((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                method: 'POST',
                endpoint: '/v1/chat/completions',
                status: Math.random() > 0.2 ? 200 : 429,
                latencyMs: Math.floor(Math.random() * 500) + 100,
                tokens: Math.floor(Math.random() * 300) + 50,
              },
            ])
          }
        >
          Simulate Request
        </Button>
      </CardContent>
    </Card>
  )
}

function AdapterConfigDemo() {
  const [config, setConfig] = useState({
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 4096,
    timeout: 30000,
    retries: 3,
    streaming: true,
  })

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Provider</label>
              <div className="flex gap-2">
                {['openai', 'anthropic', 'google'].map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={config.provider === p ? 'default' : 'outline'}
                    onClick={() =>
                      setConfig((prev) => ({ ...prev, provider: p }))
                    }
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Temperature</label>
                <span className="text-sm font-mono">{config.temperature}</span>
              </div>
              <input
                type="range"
                min={0}
                max={2}
                step={0.1}
                value={config.temperature}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    temperature: Number(e.target.value),
                  }))
                }
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Max Tokens</label>
                <span className="text-sm font-mono">{config.maxTokens}</span>
              </div>
              <input
                type="range"
                min={256}
                max={16384}
                step={256}
                value={config.maxTokens}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    maxTokens: Number(e.target.value),
                  }))
                }
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Timeout (ms)</label>
                <span className="text-sm font-mono">{config.timeout}</span>
              </div>
              <input
                type="range"
                min={5000}
                max={120000}
                step={5000}
                value={config.timeout}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    timeout: Number(e.target.value),
                  }))
                }
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Max Retries</label>
                <span className="text-sm font-mono">{config.retries}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={config.retries}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    retries: Number(e.target.value),
                  }))
                }
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <label className="text-sm font-medium">Enable Streaming</label>
              <Checkbox
                checked={config.streaming}
                onCheckedChange={(checked) =>
                  setConfig((prev) => ({
                    ...prev,
                    streaming: checked as boolean,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Config Preview */}
        <div className="p-3 rounded-lg bg-muted font-mono text-xs overflow-x-auto">
          <pre>{JSON.stringify(config, null, 2)}</pre>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function FeaturesPage() {
  return (
    <div className="space-y-12 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-violet -top-40 -left-40 opacity-20" />
        <div className="orb-primary bottom-40 -right-40 opacity-20" />
      </div>

      <PageHeader
        title="Feature Components"
        description="Advanced components for development, code editing, and AI workflows"
        icon={Sparkles}
        badge="60+ Components"
      />

      <Tabs defaultValue="code" className="w-full">
        <TabsList className="mb-8 flex-wrap h-auto gap-2 p-1 glass-panel">
          <TabsTrigger value="code" className="rounded-lg">
            Code & Dev
          </TabsTrigger>
          <TabsTrigger value="workflow" className="rounded-lg">
            Workflows
          </TabsTrigger>
          <TabsTrigger value="data" className="rounded-lg">
            Data & Forms
          </TabsTrigger>
          <TabsTrigger value="ui" className="rounded-lg">
            UI Patterns
          </TabsTrigger>
          <TabsTrigger value="realtime" className="rounded-lg">
            Realtime & Status
          </TabsTrigger>
          <TabsTrigger value="voice" className="rounded-lg">
            Voice & Media
          </TabsTrigger>
          <TabsTrigger value="auth" className="rounded-lg">
            Auth & Settings
          </TabsTrigger>
          <TabsTrigger value="social" className="rounded-lg">
            Social & Chat
          </TabsTrigger>
          <TabsTrigger value="tools" className="rounded-lg">
            Tools & Search
          </TabsTrigger>
          <TabsTrigger value="devtools" className="rounded-lg">
            Dev Tools
          </TabsTrigger>
          <TabsTrigger value="errors" className="rounded-lg">
            Error Handling
          </TabsTrigger>
          <TabsTrigger value="tokens" className="rounded-lg">
            Token Optimization
          </TabsTrigger>
          <TabsTrigger value="streaming" className="rounded-lg">
            Streaming
          </TabsTrigger>
          <TabsTrigger value="adapters" className="rounded-lg">
            AI Adapters
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="space-y-8">
          <ComponentSection
            title="Code Diff Viewer"
            description="Visualize code changes with syntax highlighting"
          >
            <CodeDiffViewer />
          </ComponentSection>

          <ComponentSection
            title="Test Runner"
            description="Execute and monitor test results"
          >
            <TestRunnerPanel />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="File Explorer"
              description="Navigate project structure"
            >
              <FileTreeComponent />
            </ComponentSection>

            <ComponentSection
              title="Commit History"
              description="View version control commits"
            >
              <CommitLog />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Code Sandbox"
            description="Live code editor with preview"
          >
            <CodeSandboxPreview />
          </ComponentSection>

          <ComponentSection
            title="Web Preview"
            description="Browser-style preview panel"
          >
            <WebPreviewPanel />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-8">
          <ComponentSection
            title="Human in the Loop"
            description="Require human approval for sensitive actions"
          >
            <HumanInTheLoop />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Task Orchestrator"
              description="Visualize multi-step task execution"
            >
              <TaskOrchestratorDemo />
            </ComponentSection>

            <ComponentSection
              title="Artifacts"
              description="Generated outputs and content"
            >
              <ArtifactPanel />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Chain of Thought"
            description="Visualize AI reasoning process"
          >
            <ChainOfThoughtDemo />
          </ComponentSection>

          <ComponentSection
            title="Bookmarks"
            description="Save and organize important content"
          >
            <BookmarksPanel />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="data" className="space-y-8">
          <ComponentSection
            title="Data Table"
            description="Display structured data"
          >
            <DataTableDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Dynamic Form"
              description="AI-generated form fields"
            >
              <DynamicFormDemo />
            </ComponentSection>

            <ComponentSection
              title="Cost Tracker"
              description="Monitor API usage costs"
            >
              <CostTrackerDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Environment Variables"
            description="Manage configuration secrets"
          >
            <EnvironmentVariablesDemo />
          </ComponentSection>

          <ComponentSection
            title="Citation Chips"
            description="Inline source references"
          >
            <CitationChipsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="ui" className="space-y-8">
          <ComponentSection
            title="Confirmation Dialogs"
            description="User confirmation patterns"
          >
            <ConfirmationDialogDemo />
          </ComponentSection>

          <ComponentSection
            title="Component Cards"
            description="Display component information"
          >
            <ComponentCardsDemo />
          </ComponentSection>

          <ComponentSection
            title="Empty States"
            description="Handle empty content gracefully"
          >
            <EmptyStateDemo />
          </ComponentSection>

          <ComponentSection
            title="Suggestion Chips"
            description="Quick action buttons"
          >
            <SuggestionChipsDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Snippet Manager"
              description="Save and reuse code snippets"
            >
              <SnippetManagerDemo />
            </ComponentSection>

            <ComponentSection
              title="Schema Display"
              description="Visualize data structures"
            >
              <SchemaDisplayDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Stats Display"
            description="Key metrics at a glance"
          >
            <StatsDisplayDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Before/After Comparison"
              description="Image or content comparison slider"
            >
              <BeforeAfterDemo />
            </ComponentSection>

            <ComponentSection
              title="Link Preview"
              description="URL preview cards"
            >
              <LinkPreviewDemo />
            </ComponentSection>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Context Menu"
              description="Right-click context menus"
            >
              <ContextMenuDemo />
            </ComponentSection>

            <ComponentSection
              title="Model Selector"
              description="AI model selection interface"
            >
              <ModelSelectorDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Keyboard Shortcuts"
            description="Accessible keyboard navigation"
          >
            <KeyboardShortcutsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-8">
          <ComponentSection
            title="Progress Indicators"
            description="Show loading and completion states"
          >
            <ProgressIndicatorsDemo />
          </ComponentSection>

          <ComponentSection
            title="Steps Indicator"
            description="Multi-step workflow progress"
          >
            <StepsIndicatorDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Realtime Status"
              description="Live event streaming"
            >
              <RealtimeIndicatorDemo />
            </ComponentSection>

            <ComponentSection
              title="Task Queue"
              description="Queued job management"
            >
              <QueueDisplayDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Conversation Threads"
            description="Threaded discussions"
          >
            <ThreadsViewDemo />
          </ComponentSection>

          <ComponentSection
            title="Safety Components"
            description="Warnings and content moderation"
          >
            <SafetyComponentsDemo />
          </ComponentSection>

          <ComponentSection
            title="Retry Logic"
            description="Handle failures gracefully"
          >
            <RetryLogicDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="voice" className="space-y-8">
          <ComponentSection
            title="Voice Components"
            description="Audio input and playback"
          >
            <VoiceComponentsDemo />
          </ComponentSection>

          <ComponentSection
            title="Rich Embed"
            description="Media preview cards"
          >
            <RichEmbedDemo />
          </ComponentSection>

          <ComponentSection
            title="Message Actions"
            description="Quick action buttons for messages"
          >
            <MessageActionsDemo />
          </ComponentSection>

          <ComponentSection
            title="Read Receipts"
            description="Message delivery status"
          >
            <ReadReceiptDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="RAG Sources"
              description="Retrieved document references"
            >
              <RAGSourcesDemo />
            </ComponentSection>

            <ComponentSection
              title="Calendar"
              description="Date picker component"
            >
              <CalendarDemo />
            </ComponentSection>
          </div>
        </TabsContent>

        <TabsContent value="auth" className="space-y-8">
          <ComponentSection title="Login Form" description="Authentication UI">
            <LoginFormDemo />
          </ComponentSection>

          <ComponentSection
            title="Settings Panel"
            description="Configuration toggles"
          >
            <SettingsPanelDemo />
          </ComponentSection>

          <ComponentSection
            title="Model Presets"
            description="Quick configuration selection"
          >
            <PresetsSelectorDemo />
          </ComponentSection>

          <ComponentSection
            title="MCP Manager"
            description="Model Context Protocol server management"
          >
            <MCPManagerDemo />
          </ComponentSection>

          <ComponentSection
            title="Environment Variables"
            description="Secure configuration management"
          >
            <EnvironmentVariablesDemo />
          </ComponentSection>

          <ComponentSection
            title="Password Input"
            description="Secure password entry with strength indicator"
          >
            <PasswordInputDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="social" className="space-y-8">
          <ComponentSection
            title="Reactions"
            description="Emoji reactions for messages"
          >
            <ReactionsDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Quick Replies"
              description="Pre-defined response options"
            >
              <QuickReplyDemo />
            </ComponentSection>

            <ComponentSection
              title="Pinned Messages"
              description="Highlight important content"
            >
              <PinnedMessagesDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Social Posts"
            description="Social media style content"
          >
            <SocialPostsDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Chat Sidebar"
              description="Conversation list navigation"
            >
              <ChatSidebarDemo />
            </ComponentSection>

            <ComponentSection
              title="Copy Button"
              description="One-click content copying"
            >
              <CopyButtonDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Conversation Manager"
            description="Manage and export conversations"
          >
            <ConversationManagerDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="tools" className="space-y-8">
          <ComponentSection
            title="Web Search"
            description="Search the web interface"
          >
            <WebSearchDemo />
          </ComponentSection>

          <ComponentSection
            title="Trace View"
            description="Request execution timeline"
          >
            <TraceViewDemo />
          </ComponentSection>

          <ComponentSection
            title="Workflow Nodes"
            description="Visual workflow builder"
          >
            <WorkflowNodesDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Branch Picker"
              description="Git branch selection"
            >
              <BranchPickerDemo />
            </ComponentSection>

            <ComponentSection
              title="Table of Contents"
              description="Document navigation"
            >
              <TableOfContentsDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Sortable List"
            description="Drag and drop reordering"
          >
            <SortableListDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="devtools" className="space-y-8">
          <ComponentSection
            title="Developer Tools Dashboard"
            description="Comprehensive debugging and profiling tools"
          >
            <DevToolsDashboardDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="API Inspector"
              description="Monitor API calls in real-time"
            >
              <APIInspectorDemo />
            </ComponentSection>

            <ComponentSection
              title="Performance Profiler"
              description="Track component performance metrics"
            >
              <ProfilerPanelDemo />
            </ComponentSection>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="State Time Travel"
              description="Debug state changes with history"
            >
              <TimeTravelDemo />
            </ComponentSection>

            <ComponentSection
              title="Model Comparison"
              description="Compare AI model responses"
            >
              <ModelComparisonDemo />
            </ComponentSection>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-8">
          <ComponentSection
            title="Error Display"
            description="Beautiful error presentation with severity levels"
          >
            <ErrorDisplayDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Error Boundary"
              description="React error boundary with recovery"
            >
              <ErrorBoundaryDemo />
            </ComponentSection>

            <ComponentSection
              title="Retry Countdown"
              description="Automatic retry with countdown timer"
            >
              <RetryCountdownDemo />
            </ComponentSection>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Circuit Breaker"
              description="Resilience pattern for API calls"
            >
              <CircuitBreakerDemo />
            </ComponentSection>

            <ComponentSection
              title="Error Toast"
              description="Toast notifications for errors"
            >
              <ErrorToastDemo />
            </ComponentSection>
          </div>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-8">
          <ComponentSection
            title="Token Optimization Dashboard"
            description="Comprehensive token savings and efficiency metrics"
          >
            <TokenOptimizationDashboardDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Token Optimization Panel"
              description="Compact optimization statistics display"
            >
              <TokenOptimizationPanelDemo />
            </ComponentSection>

            <ComponentSection
              title="Token Cost Preview"
              description="Real-time cost estimation as you type"
            >
              <TokenCostPreviewDemo />
            </ComponentSection>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Token Usage Meter"
              description="Live token consumption display for streaming"
            >
              <TokenUsageMeterDemo />
            </ComponentSection>

            <ComponentSection
              title="Token Counter"
              description="Track token usage with warnings"
            >
              <TokenCounterDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Token Budget Bar"
            description="Visual progress bar for token budget utilization"
          >
            <TokenBudgetBarDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Token Optimization Badge"
              description="Compact badge showing token savings"
            >
              <TokenOptimizationBadgeDemo />
            </ComponentSection>

            <ComponentSection
              title="Token ROI Calculator"
              description="Calculate ROI for token optimization strategies"
            >
              <TokenROICalculatorDemo />
            </ComponentSection>
          </div>
        </TabsContent>

        <TabsContent value="streaming" className="space-y-8">
          <ComponentSection
            title="Streaming Text Shimmer"
            description="Shimmer effect for streaming text content"
          >
            <StreamingTextShimmerDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Text Shimmer Placeholders"
              description="Animated loading placeholders for text"
            >
              <TextShimmerDemo />
            </ComponentSection>

            <ComponentSection
              title="Streaming Progress"
              description="Progress indicator with token count and throughput"
            >
              <StreamProgressDemo />
            </ComponentSection>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Streaming Cursor"
              description="Animated cursor for active streaming"
            >
              <StreamingCursorDemo />
            </ComponentSection>

            <ComponentSection
              title="Typing Indicator"
              description="AI typing indicator with variants"
            >
              <TypingIndicatorDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Streaming Message"
            description="Full streaming message with tool calls and thinking"
          >
            <StreamingMessageDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="adapters" className="space-y-8">
          <ComponentSection
            title="Multi-Provider Adapter"
            description="Switch between AI providers at runtime"
          >
            <MultiProviderAdapterDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Model Selector"
              description="Select from available models with capabilities"
            >
              <AdapterModelSelectorDemo />
            </ComponentSection>

            <ComponentSection
              title="Provider Health Monitor"
              description="Track provider status and latency"
            >
              <ProviderHealthDemo />
            </ComponentSection>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Retry & Circuit Breaker"
              description="Resilience patterns for API calls"
            >
              <RetryCircuitBreakerDemo />
            </ComponentSection>

            <ComponentSection
              title="Request Inspector"
              description="Debug and inspect API requests"
            >
              <RequestInspectorDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Adapter Configuration"
            description="Configure provider-specific settings"
          >
            <AdapterConfigDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
