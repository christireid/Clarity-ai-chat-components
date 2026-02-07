'use client'

import { useState } from 'react'
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  Button, Badge, cn,
} from '@clarity-chat/primitives'
import {
  Copy,
  Loader2,
  Play,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Folder,
  File,
  GitBranch,
  GitCommit,
  Share,
  RefreshCw,
  ExternalLink,
  Globe,
} from 'lucide-react'

// ============================================================================
// CODE DIFF VIEWER
// ============================================================================
export function CodeDiffViewer() {
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
export function TestRunnerPanel() {
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
export function FileTreeComponent() {
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
export function CommitLog() {
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
export function CodeSandboxPreview() {
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
export function WebPreviewPanel() {
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
