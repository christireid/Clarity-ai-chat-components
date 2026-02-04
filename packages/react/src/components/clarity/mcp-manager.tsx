'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Server,
  Plus,
  Trash2,
  Settings,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Plug,
  PlugZap,
  Globe,
  Database,
  Code,
  FileText,
  Zap,
  Search,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Switch } from '@clarity-chat/primitives'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@clarity-chat/primitives'

interface MCPServer {
  id: string
  name: string
  url: string
  status: 'connected' | 'disconnected' | 'error' | 'connecting'
  version?: string
  tools?: MCPTool[]
  resources?: MCPResource[]
  enabled: boolean
  lastConnected?: Date
  error?: string
}

interface MCPTool {
  name: string
  description?: string
  inputSchema?: Record<string, unknown>
}

interface MCPResource {
  uri: string
  name: string
  mimeType?: string
}

interface MCPManagerProps {
  servers: MCPServer[]
  onAddServer: (url: string, name: string) => void
  onRemoveServer: (id: string) => void
  onToggleServer: (id: string, enabled: boolean) => void
  onRefreshServer: (id: string) => void
  className?: string
}

export function MCPManager({
  servers,
  onAddServer,
  onRemoveServer,
  onToggleServer,
  onRefreshServer,
  className,
}: MCPManagerProps) {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [newServerUrl, setNewServerUrl] = React.useState('')
  const [newServerName, setNewServerName] = React.useState('')
  const [expandedServers, setExpandedServers] = React.useState<string[]>([])

  const handleAddServer = () => {
    if (newServerUrl.trim()) {
      onAddServer(newServerUrl.trim(), newServerName.trim() || 'MCP Server')
      setNewServerUrl('')
      setNewServerName('')
      setAddDialogOpen(false)
    }
  }

  const toggleExpanded = (id: string) => {
    setExpandedServers((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const statusConfig = {
    connected: {
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      label: 'Connected',
    },
    disconnected: {
      color: 'text-muted-foreground',
      bg: 'bg-muted',
      label: 'Disconnected',
    },
    error: { color: 'text-red-500', bg: 'bg-red-500/10', label: 'Error' },
    connecting: {
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      label: 'Connecting',
    },
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">MCP Servers</h3>
          <p className="text-sm text-muted-foreground">
            Manage your Model Context Protocol servers
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Server
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add MCP Server</DialogTitle>
              <DialogDescription>
                Connect to a Model Context Protocol server to extend AI
                capabilities.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Server Name</label>
                <Input
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                  placeholder="My MCP Server"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Server URL</label>
                <Input
                  value={newServerUrl}
                  onChange={(e) => setNewServerUrl(e.target.value)}
                  placeholder="http://localhost:3001"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddServer}>Add Server</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Server List */}
      <div className="space-y-3">
        {servers.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-lg">
            <Server className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              No MCP servers connected
            </p>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => setAddDialogOpen(true)}
            >
              Add your first server
            </Button>
          </div>
        ) : (
          servers.map((server) => {
            const config = statusConfig[server.status]
            const isExpanded = expandedServers.includes(server.id)

            return (
              <div
                key={server.id}
                className="rounded-lg border border-border bg-card overflow-hidden"
              >
                {/* Server Header */}
                <div className="flex items-center gap-3 p-4">
                  <button
                    onClick={() => toggleExpanded(server.id)}
                    className="shrink-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                      config.bg
                    )}
                  >
                    {server.status === 'connecting' ? (
                      <Loader2
                        className={cn('w-5 h-5 animate-spin', config.color)}
                      />
                    ) : server.status === 'connected' ? (
                      <PlugZap className={cn('w-5 h-5', config.color)} />
                    ) : (
                      <Plug className={cn('w-5 h-5', config.color)} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{server.name}</h4>
                      <Badge variant="outline" className={config.color}>
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {server.url}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={server.enabled}
                      onCheckedChange={(checked) =>
                        onToggleServer(server.id, checked)
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRefreshServer(server.id)}
                      disabled={server.status === 'connecting'}
                    >
                      <RefreshCw
                        className={cn(
                          'w-4 h-4',
                          server.status === 'connecting' && 'animate-spin'
                        )}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => onRemoveServer(server.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Error Message */}
                {server.error && (
                  <div className="px-4 pb-3">
                    <p className="text-sm text-red-500 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {server.error}
                    </p>
                  </div>
                )}

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-border">
                    {/* Tools */}
                    {server.tools && server.tools.length > 0 && (
                      <div className="p-4 border-b border-border">
                        <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                          Tools ({server.tools.length})
                        </h5>
                        <div className="grid grid-cols-2 gap-2">
                          {server.tools.map((tool) => (
                            <div
                              key={tool.name}
                              className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                            >
                              <Zap className="w-4 h-4 text-accent shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {tool.name}
                                </p>
                                {tool.description && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {tool.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resources */}
                    {server.resources && server.resources.length > 0 && (
                      <div className="p-4">
                        <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                          Resources ({server.resources.length})
                        </h5>
                        <div className="space-y-2">
                          {server.resources.map((resource) => (
                            <div
                              key={resource.uri}
                              className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                            >
                              <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">
                                  {resource.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {resource.uri}
                                </p>
                              </div>
                              {resource.mimeType && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs shrink-0"
                                >
                                  {resource.mimeType}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No tools/resources */}
                    {(!server.tools || server.tools.length === 0) &&
                      (!server.resources || server.resources.length === 0) && (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                          {server.status === 'connected'
                            ? 'No tools or resources available'
                            : 'Connect to see available tools and resources'}
                        </div>
                      )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Popular Servers */}
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">Popular MCP Servers</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              name: 'Filesystem',
              description: 'Read and write files',
              icon: FileText,
            },
            {
              name: 'Web Browser',
              description: 'Browse the web',
              icon: Globe,
            },
            {
              name: 'Database',
              description: 'Query databases',
              icon: Database,
            },
            {
              name: 'Code Interpreter',
              description: 'Execute code',
              icon: Code,
            },
          ].map((server) => (
            <button
              key={server.name}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                <server.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{server.name}</p>
                <p className="text-xs text-muted-foreground">
                  {server.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Plugin Manager Component
interface Plugin {
  id: string
  name: string
  description: string
  version: string
  author?: string
  enabled: boolean
  icon?: React.ReactNode
  category?: string
}

interface PluginManagerProps {
  plugins: Plugin[]
  onTogglePlugin: (id: string, enabled: boolean) => void
  onInstallPlugin?: (id: string) => void
  onUninstallPlugin?: (id: string) => void
  className?: string
}

export function PluginManager({
  plugins,
  onTogglePlugin,
  onInstallPlugin,
  onUninstallPlugin,
  className,
}: PluginManagerProps) {
  const [search, setSearch] = React.useState('')

  const filteredPlugins = plugins.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  const categories = Array.from(
    new Set(plugins.map((p) => p.category).filter(Boolean))
  )

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      <div className="relative">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search plugins..."
          className="pl-9"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>

      {/* Plugin Grid */}
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              {category}
            </h4>
            <div className="grid gap-3">
              {filteredPlugins
                .filter((p) => p.category === category)
                .map((plugin) => (
                  <div
                    key={plugin.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      {plugin.icon || (
                        <Plug className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{plugin.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          v{plugin.version}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {plugin.description}
                      </p>
                      {plugin.author && (
                        <p className="text-xs text-muted-foreground mt-1">
                          by {plugin.author}
                        </p>
                      )}
                    </div>
                    <Switch
                      checked={plugin.enabled}
                      onCheckedChange={(checked) =>
                        onTogglePlugin(plugin.id, checked)
                      }
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Token Usage Component
interface TokenUsageProps {
  used: number
  limit: number
  contextWindow: number
  breakdown?: {
    system: number
    user: number
    assistant: number
    tools: number
  }
  className?: string
}

export function TokenUsage({
  used,
  limit,
  contextWindow,
  breakdown,
  className,
}: TokenUsageProps) {
  const percentage = Math.round((used / limit) * 100)
  const isWarning = percentage > 75
  const isDanger = percentage > 90

  return (
    <div
      className={cn('rounded-lg border border-border bg-card p-4', className)}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium">Token Usage</h4>
        <span
          className={cn(
            'text-sm font-mono',
            isDanger && 'text-red-500',
            isWarning && !isDanger && 'text-yellow-500'
          )}
        >
          {used.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
        <div
          className={cn(
            'h-full transition-all',
            isDanger && 'bg-red-500',
            isWarning && !isDanger && 'bg-yellow-500',
            !isWarning && 'bg-accent'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Breakdown */}
      {breakdown && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">System</span>
            <span className="font-mono">
              {breakdown.system.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">User</span>
            <span className="font-mono">{breakdown.user.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Assistant</span>
            <span className="font-mono">
              {breakdown.assistant.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tools</span>
            <span className="font-mono">
              {breakdown.tools.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Context Window Info */}
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Context Window</span>
        <span className="font-mono">
          {contextWindow.toLocaleString()} tokens
        </span>
      </div>
    </div>
  )
}

// MCP Tool Call Display
interface MCPToolCallProps {
  tool: {
    name: string
    description?: string
    input: Record<string, unknown>
    output?: unknown
    status: 'pending' | 'running' | 'success' | 'error'
    duration?: number
    error?: string
  }
  serverId?: string
  serverName?: string
  onRetry?: () => void
  onCancel?: () => void
  className?: string
}

export function MCPToolCall({
  tool,
  serverId,
  serverName,
  onRetry,
  onCancel,
  className,
}: MCPToolCallProps) {
  const [showInput, setShowInput] = React.useState(false)
  const [showOutput, setShowOutput] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const statusConfig = {
    pending: { icon: Clock, color: 'text-muted-foreground', label: 'Pending' },
    running: { icon: Loader2, color: 'text-blue-500', label: 'Running' },
    success: { icon: CheckCircle2, color: 'text-green-500', label: 'Success' },
    error: { icon: XCircle, color: 'text-destructive', label: 'Error' },
  }

  const config = statusConfig[tool.status]
  const StatusIcon = config.icon

  const handleCopy = (content: unknown) => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('rounded-lg border border-border bg-card', className)}>
      <div className="flex items-center gap-3 p-3">
        <div className={cn('p-2 rounded-md bg-muted', config.color)}>
          <StatusIcon
            className={cn(
              'h-4 w-4',
              tool.status === 'running' && 'animate-spin'
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{tool.name}</span>
            {serverName && (
              <Badge variant="outline" className="text-xs">
                {serverName}
              </Badge>
            )}
          </div>
          {tool.description && (
            <p className="text-xs text-muted-foreground truncate">
              {tool.description}
            </p>
          )}
        </div>
        {tool.duration && (
          <span className="text-xs text-muted-foreground">
            {tool.duration}ms
          </span>
        )}
        <div className="flex items-center gap-1">
          {tool.status === 'running' && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={onCancel}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
          {tool.status === 'error' && onRetry && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={onRetry}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Input Section */}
      <Collapsible open={showInput} onOpenChange={setShowInput}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-2 px-3 py-2 border-t border-border text-xs text-muted-foreground hover:bg-muted/50 transition-colors">
            {showInput ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            Input
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="relative p-3 border-t border-border bg-muted/30">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={() => handleCopy(tool.input)}
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
            <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(tool.input, null, 2)}
            </pre>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Output Section */}
      {(tool.output || tool.error) && (
        <Collapsible open={showOutput} onOpenChange={setShowOutput}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center gap-2 px-3 py-2 border-t border-border text-xs text-muted-foreground hover:bg-muted/50 transition-colors">
              {showOutput ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              {tool.error ? 'Error' : 'Output'}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div
              className={cn(
                'relative p-3 border-t border-border',
                tool.error ? 'bg-destructive/10' : 'bg-muted/30'
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={() => handleCopy(tool.error || tool.output)}
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
              <pre
                className={cn(
                  'text-xs font-mono whitespace-pre-wrap overflow-x-auto',
                  tool.error && 'text-destructive'
                )}
              >
                {tool.error || JSON.stringify(tool.output, null, 2)}
              </pre>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}

// MCP Resource Browser
interface MCPResourceBrowserProps {
  resources: MCPResource[]
  onSelect?: (resource: MCPResource) => void
  onRefresh?: () => void
  isLoading?: boolean
  className?: string
}

export function MCPResourceBrowser({
  resources = [],
  onSelect,
  onRefresh,
  isLoading = false,
  className,
}: MCPResourceBrowserProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedType, setSelectedType] = React.useState<string | null>(null)

  const safeResources = resources || []

  const mimeTypes = React.useMemo(() => {
    const types = new Set(safeResources.map((r) => r.mimeType).filter(Boolean))
    return Array.from(types) as string[]
  }, [safeResources])

  const filteredResources = safeResources.filter((resource) => {
    const matchesSearch =
      !searchQuery ||
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.uri.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = !selectedType || resource.mimeType === selectedType
    return matchesSearch && matchesType
  })

  const getResourceIcon = (mimeType?: string) => {
    if (!mimeType) return FileText
    if (mimeType.startsWith('image/')) return ImageIcon
    if (mimeType.startsWith('text/')) return FileText
    if (mimeType.includes('json')) return Code
    return Database
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="pl-9"
          />
        </div>
        {mimeTypes.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                {selectedType || 'All Types'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedType(null)}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {mimeTypes.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          </Button>
        )}
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2 pr-4">
          {filteredResources.map((resource) => {
            const Icon = getResourceIcon(resource.mimeType)
            return (
              <div
                key={resource.uri}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onSelect?.(resource)}
              >
                <div className="p-2 rounded-md bg-muted">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {resource.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {resource.uri}
                  </p>
                </div>
                {resource.mimeType && (
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {resource.mimeType}
                  </Badge>
                )}
              </div>
            )
          })}
          {filteredResources.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No resources found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// MCP Server Health Monitor
interface MCPServerHealthProps {
  servers: {
    id: string
    name: string
    status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown'
    latency?: number
    uptime?: number
    lastCheck?: Date
    metrics?: {
      requestsPerMinute: number
      errorRate: number
      avgLatency: number
    }
  }[]
  onRefresh?: () => void
  className?: string
}

export function MCPServerHealth({
  servers = [],
  onRefresh,
  className,
}: MCPServerHealthProps) {
  const safeServers = servers || []

  const statusConfig = {
    healthy: { color: 'bg-green-500', label: 'Healthy' },
    degraded: { color: 'bg-yellow-500', label: 'Degraded' },
    unhealthy: { color: 'bg-red-500', label: 'Unhealthy' },
    unknown: { color: 'bg-gray-500', label: 'Unknown' },
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Server Health</h3>
        {onRefresh && (
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {safeServers.map((server) => {
          const config = statusConfig[server.status]
          return (
            <div
              key={server.id}
              className="rounded-lg border border-border p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full', config.color)} />
                  <span className="font-medium text-sm">{server.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {config.label}
                  </Badge>
                </div>
                {server.latency && (
                  <span className="text-xs text-muted-foreground">
                    {server.latency}ms
                  </span>
                )}
              </div>

              {server.metrics && (
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground">Requests/min</p>
                    <p className="font-medium">
                      {server.metrics.requestsPerMinute}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Error Rate</p>
                    <p
                      className={cn(
                        'font-medium',
                        server.metrics.errorRate > 5 && 'text-destructive'
                      )}
                    >
                      {server.metrics.errorRate.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Latency</p>
                    <p className="font-medium">{server.metrics.avgLatency}ms</p>
                  </div>
                </div>
              )}

              {server.lastCheck && (
                <p className="text-xs text-muted-foreground">
                  Last checked: {server.lastCheck.toLocaleTimeString()}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// MCP Permission Request Dialog
interface MCPPermissionRequestProps {
  server: { id: string; name: string }
  permissions: {
    id: string
    name: string
    description: string
    required: boolean
  }[]
  onApprove?: (permissionIds: string[]) => void
  onDeny?: () => void
  className?: string
}

export function MCPPermissionRequest({
  server,
  permissions = [],
  onApprove,
  onDeny,
  className,
}: MCPPermissionRequestProps) {
  const [selectedPermissions, setSelectedPermissions] = React.useState<
    string[]
  >(permissions.filter((p) => p.required).map((p) => p.id))

  const safePermissions = permissions || []

  const togglePermission = (id: string, required: boolean) => {
    if (required) return
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <Shield className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium">Permission Request</h3>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">{server.name}</span> is requesting the
          following permissions:
        </p>
      </div>

      <div className="space-y-2">
        {safePermissions.map((permission) => (
          <div
            key={permission.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer',
              selectedPermissions.includes(permission.id)
                ? 'border-primary bg-primary/5'
                : 'border-border hover:bg-muted/50'
            )}
            onClick={() => togglePermission(permission.id, permission.required)}
          >
            <div
              className={cn(
                'w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5',
                selectedPermissions.includes(permission.id)
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-muted-foreground'
              )}
            >
              {selectedPermissions.includes(permission.id) && (
                <Check className="h-3 w-3" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{permission.name}</span>
                {permission.required && (
                  <Badge variant="secondary" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {permission.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="flex-1 bg-transparent"
          onClick={onDeny}
        >
          Deny
        </Button>
        <Button
          className="flex-1"
          onClick={() => onApprove?.(selectedPermissions)}
          disabled={safePermissions.some(
            (p) => p.required && !selectedPermissions.includes(p.id)
          )}
        >
          Approve
        </Button>
      </div>
    </div>
  )
}

// Additional imports needed
import { ImageIcon, Clock, Filter, Shield } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
