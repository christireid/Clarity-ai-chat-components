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
} from 'lucide-react'

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
// MAIN PAGE
// ============================================================================
export default function FeaturesPage() {
  return (
    <div className="space-y-12">
      <PageHeader
        title="Feature Components"
        description="Advanced components for development, code editing, and AI workflows"
      />

      <Tabs defaultValue="code" className="w-full">
        <TabsList className="mb-8 flex-wrap h-auto gap-2 bg-transparent p-0">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
