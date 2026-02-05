'use client'

import { useState } from 'react'
import { cn } from '@clarity-chat/primitives'
import { useSafeTimeout } from '@clarity-chat/react/internal'
import {
  Server,
  Plus,
  Trash2,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Wrench,
  Globe,
  Code,
  Database,
  FolderOpen,
  X,
  Loader2,
  PlugZap,
} from 'lucide-react'
import { type MCPServer, generateId } from '../../_shared'

interface MCPManagerProps {
  servers: MCPServer[]
  onServersChange: (
    serversOrUpdater: MCPServer[] | ((prev: MCPServer[]) => MCPServer[])
  ) => void
  className?: string
}

const serverIcons: Record<string, React.ElementType> = {
  'Web Search MCP': Globe,
  'Code Execution MCP': Code,
  'Database MCP': Database,
  'File System MCP': FolderOpen,
}

const statusColors: Record<string, string> = {
  connected: 'bg-green-500',
  disconnected: 'bg-red-500',
  error: 'bg-red-500',
  connecting: 'bg-yellow-500',
}

const statusLabels: Record<string, string> = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  error: 'Error',
  connecting: 'Connecting...',
}

export function MCPManager({
  servers,
  onServersChange,
  className,
}: MCPManagerProps) {
  const { setSafeTimeout } = useSafeTimeout()
  const [expandedServer, setExpandedServer] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newServer, setNewServer] = useState({
    name: '',
    endpoint: '',
    authToken: '',
  })

  const toggleServer = (id: string) => {
    onServersChange(
      servers.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    )
  }

  const removeServer = (id: string) => {
    onServersChange(servers.filter((s) => s.id !== id))
  }

  const reconnectServer = (id: string) => {
    onServersChange(
      servers.map((s) =>
        s.id === id ? { ...s, status: 'connecting' as const } : s
      )
    )
    // Simulate reconnection
    setSafeTimeout(() => {
      onServersChange((prev: MCPServer[]) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: 'connected' as const } : s
        )
      )
    }, 1500)
  }

  const addServer = () => {
    if (!newServer.name || !newServer.endpoint) return
    const server: MCPServer = {
      id: generateId(),
      name: newServer.name,
      endpoint: newServer.endpoint,
      authToken: newServer.authToken || undefined,
      status: 'connecting',
      enabled: true,
      tools: ['custom_tool'],
    }
    onServersChange([...servers, server])
    setNewServer({ name: '', endpoint: '', authToken: '' })
    setShowAddForm(false)
    // Simulate connection completing
    setSafeTimeout(() => {
      onServersChange((prev: MCPServer[]) =>
        prev.map((s) =>
          s.id === server.id ? { ...s, status: 'connected' as const } : s
        )
      )
    }, 1500)
  }

  const connectedCount = servers.filter(
    (s) => s.status === 'connected' && s.enabled
  ).length
  const totalTools = servers
    .filter((s) => s.status === 'connected' && s.enabled)
    .reduce((acc, s) => acc + s.tools.length, 0)

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <PlugZap className="h-4 w-4 text-blue-500" />
          MCP Servers
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {connectedCount}/{servers.length} active
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Add server"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 text-xs">
        <div className="flex items-center gap-1.5">
          <Server className="h-3 w-3 text-muted-foreground" />
          <span>{connectedCount} servers</span>
        </div>
        <div className="w-px h-3 bg-border" />
        <div className="flex items-center gap-1.5">
          <Wrench className="h-3 w-3 text-muted-foreground" />
          <span>{totalTools} tools</span>
        </div>
      </div>

      {/* Add Server Form */}
      {showAddForm && (
        <div className="p-3 rounded-xl border bg-card space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium">Add New Server</span>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-0.5 rounded hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Server name"
            value={newServer.name}
            onChange={(e) =>
              setNewServer({ ...newServer, name: e.target.value })
            }
            className="w-full px-2.5 py-1.5 text-xs bg-muted rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
          />
          <input
            type="text"
            placeholder="Endpoint URL (e.g., https://mcp.example.com)"
            value={newServer.endpoint}
            onChange={(e) =>
              setNewServer({ ...newServer, endpoint: e.target.value })
            }
            className="w-full px-2.5 py-1.5 text-xs bg-muted rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
          />
          <input
            type="password"
            placeholder="Auth token (optional)"
            value={newServer.authToken}
            onChange={(e) =>
              setNewServer({ ...newServer, authToken: e.target.value })
            }
            className="w-full px-2.5 py-1.5 text-xs bg-muted rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
          />
          <button
            onClick={addServer}
            disabled={!newServer.name || !newServer.endpoint}
            className={cn(
              'w-full py-1.5 rounded-lg text-xs font-medium transition-colors',
              newServer.name && newServer.endpoint
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            Connect Server
          </button>
        </div>
      )}

      {/* Server List */}
      <div className="space-y-1.5">
        {servers.map((server) => {
          const IconComponent = serverIcons[server.name] || Server
          const isExpanded = expandedServer === server.id

          return (
            <div
              key={server.id}
              className={cn(
                'rounded-xl border transition-all',
                server.enabled && server.status === 'connected'
                  ? 'bg-card/80'
                  : 'bg-muted/20 opacity-75'
              )}
            >
              {/* Server Header */}
              <div className="flex items-center gap-2 px-3 py-2">
                {/* Status Dot */}
                <div
                  className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    statusColors[server.status],
                    server.status === 'connecting' && 'animate-pulse'
                  )}
                />

                {/* Icon */}
                <IconComponent className="h-3.5 w-3.5 text-muted-foreground shrink-0" />

                {/* Name & Status */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">
                    {server.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {statusLabels[server.status]} &middot; {server.tools.length}{' '}
                    tools
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-0.5 shrink-0">
                  {/* Enable/Disable Toggle */}
                  <button
                    onClick={() => toggleServer(server.id)}
                    className={cn(
                      'relative w-7 h-4 rounded-full transition-colors',
                      server.enabled ? 'bg-green-500' : 'bg-muted-foreground/30'
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform shadow-sm',
                        server.enabled ? 'translate-x-3' : 'translate-x-0.5'
                      )}
                    />
                  </button>

                  {/* Reconnect */}
                  {server.status === 'disconnected' && (
                    <button
                      onClick={() => reconnectServer(server.id)}
                      className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="Reconnect"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </button>
                  )}

                  {server.status === 'connecting' && (
                    <div className="p-1">
                      <Loader2 className="h-3 w-3 animate-spin text-yellow-500" />
                    </div>
                  )}

                  {/* Expand Tools */}
                  <button
                    onClick={() =>
                      setExpandedServer(isExpanded ? null : server.id)
                    }
                    className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => removeServer(server.id)}
                    className="p-1 rounded hover:bg-muted hover:text-red-500 transition-colors text-muted-foreground"
                    title="Remove server"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Expanded Tools List */}
              {isExpanded && (
                <div className="px-3 pb-2 border-t mx-2 pt-2 animate-in slide-in-from-top-1 duration-150">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1.5">
                    Available Tools
                  </p>
                  <div className="space-y-1">
                    {server.tools.map((tool: string) => (
                      <div
                        key={tool}
                        className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted/30 text-xs"
                      >
                        <Wrench className="h-2.5 w-2.5 text-muted-foreground" />
                        <span className="font-mono text-[11px]">{tool}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-[10px] text-muted-foreground truncate">
                    {server.endpoint}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
