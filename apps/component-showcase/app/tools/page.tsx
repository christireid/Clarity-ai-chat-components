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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@clarity-chat/primitives'
import {
  Wrench,
  Search,
  Code,
  FileText,
  Database,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Play,
  Terminal,
  Zap,
  Settings,
  AlertTriangle,
  Copy,
  Eye,
  Shield,
  ExternalLink,
} from 'lucide-react'

// ============================================================================
// TOOL CARD DEMO
// ============================================================================
function ToolCardDemo() {
  const tools = [
    {
      name: 'web_search',
      description: 'Search the web for information',
      icon: <Globe className="h-4 w-4" />,
      status: 'available',
    },
    {
      name: 'read_file',
      description: 'Read contents of a file',
      icon: <FileText className="h-4 w-4" />,
      status: 'available',
    },
    {
      name: 'write_code',
      description: 'Generate and write code',
      icon: <Code className="h-4 w-4" />,
      status: 'available',
    },
    {
      name: 'query_database',
      description: 'Execute database queries',
      icon: <Database className="h-4 w-4" />,
      status: 'restricted',
    },
    {
      name: 'run_terminal',
      description: 'Execute terminal commands',
      icon: <Terminal className="h-4 w-4" />,
      status: 'disabled',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tool Cards</CardTitle>
        <CardDescription>
          Display available tools with status indicators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className={cn(
                'p-4 rounded-lg border transition-colors',
                tool.status === 'disabled' && 'opacity-50',
                tool.status === 'restricted' &&
                  'border-yellow-500/50 bg-yellow-500/5'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      tool.status === 'available'
                        ? 'bg-primary/10 text-primary'
                        : tool.status === 'restricted'
                          ? 'bg-yellow-500/10 text-yellow-600'
                          : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {tool.icon}
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    'text-xs',
                    tool.status === 'available' &&
                      'bg-green-500/20 text-green-600',
                    tool.status === 'restricted' &&
                      'bg-yellow-500/20 text-yellow-600',
                    tool.status === 'disabled' &&
                      'bg-muted text-muted-foreground'
                  )}
                >
                  {tool.status}
                </Badge>
              </div>
              <div className="mt-3">
                <h4 className="font-mono text-sm font-medium">{tool.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {tool.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TOOL EXECUTION DEMO
// ============================================================================
function ToolExecutionDemo() {
  const [expanded, setExpanded] = useState<string[]>(['exec-1'])

  const executions = [
    {
      id: 'exec-1',
      tool: 'web_search',
      input: { query: 'React 19 new features', max_results: 5 },
      output: [
        { title: 'React 19 Beta Release', url: 'react.dev/blog' },
        { title: 'New Hooks in React 19', url: 'dev.to/react' },
      ],
      status: 'success',
      duration: '1.2s',
    },
    {
      id: 'exec-2',
      tool: 'read_file',
      input: { path: '/src/components/Button.tsx' },
      output: 'export function Button({ children }) { ... }',
      status: 'success',
      duration: '0.1s',
    },
    {
      id: 'exec-3',
      tool: 'query_database',
      input: { query: 'SELECT * FROM users LIMIT 10' },
      output: null,
      error: 'Permission denied: insufficient privileges',
      status: 'error',
      duration: '0.3s',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tool Execution History</CardTitle>
        <CardDescription>View tool calls with input/output</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {executions.map((exec) => (
            <div
              key={exec.id}
              className={cn(
                'rounded-lg border overflow-hidden',
                exec.status === 'error' && 'border-red-500/50'
              )}
            >
              <button
                className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
                onClick={() =>
                  setExpanded((prev) =>
                    prev.includes(exec.id)
                      ? prev.filter((e) => e !== exec.id)
                      : [...prev, exec.id]
                  )
                }
              >
                {exec.status === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="font-mono text-sm font-medium">
                  {exec.tool}
                </span>
                <Badge variant="secondary" className="text-xs ml-auto mr-2">
                  {exec.duration}
                </Badge>
                {expanded.includes(exec.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expanded.includes(exec.id) && (
                <div className="border-t p-3 bg-muted/30 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <span>Input</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <pre className="text-xs font-mono bg-background p-2 rounded overflow-x-auto">
                      {JSON.stringify(exec.input, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <span>{exec.error ? 'Error' : 'Output'}</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <pre
                      className={cn(
                        'text-xs font-mono p-2 rounded overflow-x-auto',
                        exec.error
                          ? 'bg-red-500/10 text-red-600'
                          : 'bg-background'
                      )}
                    >
                      {exec.error || JSON.stringify(exec.output, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// WEB SEARCH RESULTS
// ============================================================================
function WebSearchResultsDemo() {
  const results = [
    {
      title: 'Next.js 14 | Next.js',
      url: 'https://nextjs.org/blog/next-14',
      snippet:
        'Next.js 14 includes Server Actions, Partial Prerendering, and more...',
    },
    {
      title: 'Understanding Next.js 14 Server Components',
      url: 'https://dev.to/nextjs',
      snippet: 'A deep dive into the new Server Components architecture...',
    },
    {
      title: 'Migrating to Next.js 14',
      url: 'https://vercel.com/guides',
      snippet: 'Step-by-step guide to upgrading your application...',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Web Search Results</CardTitle>
        <CardDescription>
          Display search results from web_search tool
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Search className="h-4 w-4" />
            <span>Query: &quot;Next.js 14 features&quot;</span>
          </div>
          <div className="space-y-3">
            {results.map((result, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 group"
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-primary group-hover:underline">
                      {result.title}
                    </h4>
                    <p className="text-xs text-green-600 mt-0.5">
                      {result.url}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {result.snippet}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TOOL APPROVAL DEMO
// ============================================================================
function ToolApprovalDemo() {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>(
    'pending'
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Tool Approval (Human-in-the-Loop)
        </CardTitle>
        <CardDescription>
          Request user approval for sensitive operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'pending' ? (
          <div className="p-4 border rounded-lg border-yellow-500/50 bg-yellow-500/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">Approval Required</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  The AI wants to execute the following tool:
                </p>
                <div className="mt-3 p-3 bg-background rounded-lg">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-primary" />
                    <span className="font-mono text-sm font-medium">
                      run_terminal
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-yellow-500/20 text-yellow-600"
                    >
                      Medium Risk
                    </Badge>
                  </div>
                  <pre className="mt-2 text-xs font-mono text-muted-foreground">
                    {`{\n  "command": "npm install lodash",\n  "cwd": "/project"\n}`}
                  </pre>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Button size="sm" onClick={() => setStatus('approved')}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setStatus('rejected')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Deny
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4 mr-2" />
                    Review Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'p-4 border rounded-lg',
              status === 'approved'
                ? 'border-green-500/50 bg-green-500/5'
                : 'border-red-500/50 bg-red-500/5'
            )}
          >
            <div className="flex items-center gap-3">
              {status === 'approved' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <div>
                <h4 className="font-medium text-sm">
                  {status === 'approved' ? 'Tool Approved' : 'Tool Rejected'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {status === 'approved'
                    ? 'Execution completed successfully'
                    : 'Tool execution was blocked'}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={() => setStatus('pending')}
            >
              Reset Demo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CONFIRMATION DIALOG DEMO
// ============================================================================
function ConfirmationDialogDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Confirmation Dialog</CardTitle>
        <CardDescription>
          Modal confirmation for critical actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Delete Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  user data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Play className="h-4 w-4" />
                Deploy
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deploy to Production?</DialogTitle>
                <DialogDescription>
                  This will deploy the current build to production servers. Make
                  sure all tests have passed before proceeding.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Deploy Now</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TOOL REGISTRY DEMO
// ============================================================================
function ToolRegistryDemo() {
  const categories = [
    {
      name: 'Search & Retrieval',
      tools: ['web_search', 'file_search', 'semantic_search'],
    },
    {
      name: 'Code Operations',
      tools: ['read_file', 'write_file', 'execute_code'],
    },
    {
      name: 'Data Management',
      tools: ['query_database', 'update_record', 'delete_record'],
    },
    {
      name: 'External Services',
      tools: ['send_email', 'call_api', 'upload_file'],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Tool Registry</CardTitle>
            <CardDescription>
              Manage available tools by category
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.name}>
              <h4 className="text-sm font-medium mb-2">{category.name}</h4>
              <div className="flex flex-wrap gap-2">
                {category.tools.map((tool) => (
                  <Badge
                    key={tool}
                    variant="secondary"
                    className="font-mono text-xs py-1 px-2"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TOOL METRICS DEMO
// ============================================================================
function ToolMetricsDemo() {
  const metrics = [
    { tool: 'web_search', calls: 156, avgDuration: '1.2s', successRate: 98 },
    { tool: 'read_file', calls: 423, avgDuration: '0.1s', successRate: 100 },
    { tool: 'write_code', calls: 89, avgDuration: '2.5s', successRate: 95 },
    { tool: 'query_database', calls: 67, avgDuration: '0.3s', successRate: 87 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tool Metrics</CardTitle>
        <CardDescription>Performance analytics for tool usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-3 bg-muted text-xs font-medium text-muted-foreground">
            <span>Tool</span>
            <span>Calls</span>
            <span>Avg Duration</span>
            <span>Success Rate</span>
          </div>
          <div className="divide-y">
            {metrics.map((metric) => (
              <div
                key={metric.tool}
                className="grid grid-cols-4 gap-4 p-3 items-center"
              >
                <span className="font-mono text-sm">{metric.tool}</span>
                <span className="text-sm">{metric.calls}</span>
                <span className="text-sm">{metric.avgDuration}</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        metric.successRate >= 95
                          ? 'bg-green-500'
                          : metric.successRate >= 90
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      )}
                      style={{ width: `${metric.successRate}%` }}
                    />
                  </div>
                  <span className="text-sm w-10 text-right">
                    {metric.successRate}%
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

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function ToolsPage() {
  return (
    <div className="space-y-8 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-primary -top-40 -right-40 opacity-20" />
        <div className="orb-violet bottom-40 -left-40 opacity-20" />
      </div>

      <PageHeader
        title="Tools"
        description="Tool cards, execution displays, and approval workflows"
        icon={Wrench}
        badge="10+ Components"
      />

      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2 p-1 glass-panel">
          <TabsTrigger value="cards">Tool Cards</TabsTrigger>
          <TabsTrigger value="execution">Execution</TabsTrigger>
          <TabsTrigger value="search">Search Results</TabsTrigger>
          <TabsTrigger value="approval">Approval</TabsTrigger>
          <TabsTrigger value="confirmation">Confirmation</TabsTrigger>
          <TabsTrigger value="registry">Registry</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="cards">
          <ComponentSection
            title="Tool Cards"
            description="Display available tools with status"
          >
            <ToolCardDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="execution">
          <ComponentSection
            title="Tool Execution"
            description="View tool call history"
          >
            <ToolExecutionDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="search">
          <ComponentSection
            title="Search Results"
            description="Web search results display"
          >
            <WebSearchResultsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="approval">
          <ComponentSection
            title="Tool Approval"
            description="Human-in-the-loop approval"
          >
            <ToolApprovalDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="confirmation">
          <ComponentSection
            title="Confirmation"
            description="Modal confirmation dialogs"
          >
            <ConfirmationDialogDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="registry">
          <ComponentSection
            title="Tool Registry"
            description="Organized tool management"
          >
            <ToolRegistryDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="metrics">
          <ComponentSection
            title="Tool Metrics"
            description="Performance tracking"
          >
            <ToolMetricsDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
