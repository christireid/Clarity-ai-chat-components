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
  Code,
  Copy,
  Check,
  Play,
  Terminal,
  FileText,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Download,
  Maximize2,
  CheckCircle,
  XCircle,
  Clock,
  Table,
  ArrowUpDown,
  Filter,
  MoreHorizontal,
} from 'lucide-react'

// ============================================================================
// CODE BLOCK DEMO
// ============================================================================
function CodeBlockDemo() {
  const [copied, setCopied] = useState(false)

  const code = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example usage
console.log(fibonacci(10)); // Output: 55`

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Code Block</CardTitle>
        <CardDescription>
          Syntax-highlighted code with copy functionality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Basic Code Block */}
          <div className="border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-muted border-b">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">fibonacci.js</span>
                <Badge variant="secondary" className="text-xs">
                  JavaScript
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="p-4 bg-[#1e1e1e] overflow-x-auto">
              <pre className="text-sm font-mono">
                <code className="text-[#d4d4d4]">
                  {code.split('\n').map((line, i) => (
                    <div key={i} className="table-row">
                      <span className="table-cell text-right pr-4 text-[#6e7681] select-none w-8">
                        {i + 1}
                      </span>
                      <span className="table-cell">{line}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>

          {/* Inline Code */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm">
              Use the{' '}
              <code className="px-1.5 py-0.5 bg-muted rounded font-mono text-sm">
                useState
              </code>{' '}
              hook to manage state in functional components. Call{' '}
              <code className="px-1.5 py-0.5 bg-muted rounded font-mono text-sm">
                setCount(prev =&gt; prev + 1)
              </code>
              to update.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CODE DIFF DEMO
// ============================================================================
function CodeDiffDemo() {
  const diffLines = [
    { type: 'context', old: 1, new: 1, content: 'import React from "react"' },
    {
      type: 'removed',
      old: 2,
      new: null,
      content: 'import { Component } from "react"',
    },
    {
      type: 'added',
      old: null,
      new: 2,
      content: 'import { useState, useEffect } from "react"',
    },
    { type: 'context', old: 3, new: 3, content: '' },
    {
      type: 'removed',
      old: 4,
      new: null,
      content: 'class Counter extends Component {',
    },
    { type: 'added', old: null, new: 4, content: 'function Counter() {' },
    { type: 'removed', old: 5, new: null, content: '  state = { count: 0 }' },
    {
      type: 'added',
      old: null,
      new: 5,
      content: '  const [count, setCount] = useState(0)',
    },
    { type: 'context', old: 6, new: 6, content: '' },
    { type: 'context', old: 7, new: 7, content: '  return (' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Code Diff</CardTitle>
        <CardDescription>Side-by-side or unified diff view</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-muted border-b">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Counter.tsx
              </Badge>
              <span className="text-xs text-muted-foreground">
                <span className="text-green-500">+2</span>{' '}
                <span className="text-red-500">-3</span>
              </span>
            </div>
          </div>
          <div className="font-mono text-sm overflow-x-auto">
            {diffLines.map((line, i) => (
              <div
                key={i}
                className={cn(
                  'flex',
                  line.type === 'added' && 'bg-green-500/10',
                  line.type === 'removed' && 'bg-red-500/10'
                )}
              >
                <span className="w-10 text-right text-xs text-muted-foreground py-0.5 px-2 select-none border-r">
                  {line.old || ''}
                </span>
                <span className="w-10 text-right text-xs text-muted-foreground py-0.5 px-2 select-none border-r">
                  {line.new || ''}
                </span>
                <span className="w-6 text-center py-0.5 select-none">
                  {line.type === 'added' && (
                    <span className="text-green-500">+</span>
                  )}
                  {line.type === 'removed' && (
                    <span className="text-red-500">-</span>
                  )}
                </span>
                <pre className="flex-1 py-0.5 pr-4">{line.content}</pre>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TERMINAL DEMO
// ============================================================================
function TerminalDemo() {
  const output = [
    { type: 'command', content: '$ npm install @clarity-chat/react' },
    { type: 'output', content: 'Installing dependencies...' },
    { type: 'output', content: '' },
    { type: 'output', content: 'added 127 packages in 4.2s' },
    { type: 'success', content: '✓ Installation complete' },
    { type: 'command', content: '$ npm run build' },
    { type: 'output', content: '> clarity-chat@1.0.0 build' },
    { type: 'output', content: '> tsc && vite build' },
    { type: 'output', content: '' },
    { type: 'output', content: 'vite v5.0.0 building for production...' },
    { type: 'success', content: '✓ 42 modules transformed.' },
    { type: 'success', content: '✓ built in 1.23s' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Terminal</CardTitle>
        <CardDescription>Command-line output display</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden bg-[#1e1e1e]">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] border-b border-[#3d3d3d]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-gray-400">Terminal</span>
          </div>
          <div className="p-4 font-mono text-sm max-h-[300px] overflow-y-auto">
            {output.map((line, i) => (
              <div
                key={i}
                className={cn(
                  'py-0.5',
                  line.type === 'command' && 'text-blue-400',
                  line.type === 'success' && 'text-green-400',
                  line.type === 'output' && 'text-gray-300'
                )}
              >
                {line.content}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// DATA TABLE DEMO
// ============================================================================
function DataTableDemo() {
  const data = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'Admin',
      status: 'active',
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'User',
      status: 'active',
    },
    {
      id: 3,
      name: 'Carol Williams',
      email: 'carol@example.com',
      role: 'Editor',
      status: 'inactive',
    },
    {
      id: 4,
      name: 'David Brown',
      email: 'david@example.com',
      role: 'User',
      status: 'active',
    },
    {
      id: 5,
      name: 'Eve Davis',
      email: 'eve@example.com',
      role: 'Admin',
      status: 'pending',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Data Table</CardTitle>
            <CardDescription>
              Sortable and filterable data display
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">
                  <button className="flex items-center gap-1">
                    Name
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-left p-3 font-medium">Role</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-muted/50">
                  <td className="p-3 font-medium">{row.name}</td>
                  <td className="p-3 text-muted-foreground">{row.email}</td>
                  <td className="p-3">
                    <Badge variant="secondary">{row.role}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge
                      className={cn(
                        row.status === 'active' &&
                          'bg-green-500/20 text-green-600',
                        row.status === 'inactive' &&
                          'bg-gray-500/20 text-gray-600',
                        row.status === 'pending' &&
                          'bg-yellow-500/20 text-yellow-600'
                      )}
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TEST RESULTS DEMO
// ============================================================================
function TestResultsDemo() {
  const tests = [
    { name: 'renders correctly', status: 'passed', duration: '12ms' },
    { name: 'handles click events', status: 'passed', duration: '8ms' },
    { name: 'displays loading state', status: 'passed', duration: '15ms' },
    {
      name: 'validates input',
      status: 'failed',
      duration: '23ms',
      error: 'Expected "valid" but got "invalid"',
    },
    { name: 'submits form', status: 'skipped', duration: '0ms' },
  ]

  const summary = { total: 5, passed: 3, failed: 1, skipped: 1 }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Test Results</CardTitle>
        <CardDescription>Unit test execution summary</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex gap-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">{summary.passed} passed</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm">{summary.failed} failed</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{summary.skipped} skipped</span>
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
                {test.status === 'skipped' && (
                  <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{test.name}</p>
                  {test.error && (
                    <p className="text-xs text-red-500 mt-1 font-mono">
                      {test.error}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {test.duration}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function CodeDataPage() {
  return (
    <div className="space-y-8 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-primary -top-40 -left-40 opacity-20" />
        <div className="orb-cyan bottom-40 -right-40 opacity-20" />
      </div>

      <PageHeader
        title="Code & Data"
        description="Code blocks, diffs, terminal, tables, and test results"
        icon={Code}
        badge="8+ Components"
      />

      <Tabs defaultValue="code" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2 p-1 glass-panel">
          <TabsTrigger value="code">Code Block</TabsTrigger>
          <TabsTrigger value="diff">Code Diff</TabsTrigger>
          <TabsTrigger value="terminal">Terminal</TabsTrigger>
          <TabsTrigger value="table">Data Table</TabsTrigger>
          <TabsTrigger value="tests">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="code">
          <ComponentSection
            title="Code Block"
            description="Syntax highlighting with actions"
          >
            <CodeBlockDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="diff">
          <ComponentSection title="Code Diff" description="Show code changes">
            <CodeDiffDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="terminal">
          <ComponentSection title="Terminal" description="CLI output display">
            <TerminalDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="table">
          <ComponentSection
            title="Data Table"
            description="Structured data display"
          >
            <DataTableDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="tests">
          <ComponentSection
            title="Test Results"
            description="Test execution summary"
          >
            <TestResultsDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
