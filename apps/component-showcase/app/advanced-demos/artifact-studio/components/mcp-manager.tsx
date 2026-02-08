'use client'

import { useState } from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Server,
  Plus,
  X,
  ChevronDown,
  Wrench,
  RefreshCw,
  Power,
  Wifi,
  WifiOff,
  AlertCircle,
} from 'lucide-react'
import type { MCPServer } from '../../_shared/types'
import { generateId } from '../../_shared/types'

interface MCPManagerProps {
  servers: MCPServer[]
  onServersChange: (servers: MCPServer[]) => void
  className?: string
}

export function ArtifactMCPManager({ servers, onServersChange, className }: MCPManagerProps) {
  const [showAdd, setShowAdd] = useState(false)
  const [expandedServer, setExpandedServer] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newEndpoint, setNewEndpoint] = useState('')

  const statusIcons = {
    connected: <Wifi className="h-3 w-3 text-green-500" />,
    disconnected: <WifiOff className="h-3 w-3 text-gray-400" />,
    error: <AlertCircle className="h-3 w-3 text-red-500" />,
    connecting: <RefreshCw className="h-3 w-3 text-yellow-500 animate-spin" />,
  }

  const addServer = () => {
    if (!newName.trim() || !newEndpoint.trim()) return
    onServersChange([...servers, {
      id: generateId(),
      name: newName.trim(),
      endpoint: newEndpoint.trim(),
      status: 'connected',
      enabled: true,
      tools: ['custom_tool'],
    }])
    setNewName('')
    setNewEndpoint('')
    setShowAdd(false)
  }

  const toggleServer = (id: string) => {
    onServersChange(servers.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }

  const removeServer = (id: string) => {
    onServersChange(servers.filter(s => s.id !== id))
  }

  const reconnect = (id: string) => {
    onServersChange(servers.map(s => s.id === id ? { ...s, status: 'connecting' } : s))
    setTimeout(() => {
      onServersChange(servers.map(s => s.id === id ? { ...s, status: 'connected' } : s))
    }, 1500)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Server className="h-4 w-4 text-indigo-500" />
          MCP Servers
        </h4>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-1 rounded hover:bg-muted transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {showAdd && (
        <div className="p-3 rounded-lg bg-muted/30 space-y-2 border border-dashed border-muted-foreground/20">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Server name"
            className="w-full text-xs px-2.5 py-1.5 rounded bg-background border border-muted-foreground/10 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <input
            value={newEndpoint}
            onChange={e => setNewEndpoint(e.target.value)}
            placeholder="Endpoint URL"
            className="w-full text-xs px-2.5 py-1.5 rounded bg-background border border-muted-foreground/10 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <div className="flex gap-2">
            <button onClick={addServer} className="flex-1 text-xs py-1.5 rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              Add
            </button>
            <button onClick={() => setShowAdd(false)} className="flex-1 text-xs py-1.5 rounded bg-muted hover:bg-muted/80 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        {servers.map(server => (
          <div key={server.id} className="rounded-lg border bg-card/50 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2">
              {statusIcons[server.status]}
              <span className={cn('text-sm flex-1 truncate', !server.enabled && 'text-muted-foreground line-through')}>
                {server.name}
              </span>
              <button
                onClick={() => toggleServer(server.id)}
                className={cn('p-1 rounded transition-colors', server.enabled ? 'text-green-500' : 'text-muted-foreground')}
                title={server.enabled ? 'Disable' : 'Enable'}
              >
                <Power className="h-3 w-3" />
              </button>
              <button
                onClick={() => setExpandedServer(expandedServer === server.id ? null : server.id)}
                className="p-1 rounded hover:bg-muted transition-colors"
              >
                <ChevronDown className={cn('h-3 w-3 transition-transform', expandedServer === server.id && 'rotate-180')} />
              </button>
            </div>
            {expandedServer === server.id && (
              <div className="px-3 pb-2 pt-0 border-t space-y-2">
                <div className="text-[10px] text-muted-foreground truncate">{server.endpoint || 'localhost:3001'}</div>
                <div className="flex flex-wrap gap-1">
                  {server.tools.map(tool => (
                    <span key={tool} className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500">{tool}</span>
                  ))}
                </div>
                <div className="flex gap-1">
                  {server.status === 'disconnected' && (
                    <button onClick={() => reconnect(server.id)} className="text-[10px] text-blue-500 hover:underline">Reconnect</button>
                  )}
                  <button onClick={() => removeServer(server.id)} className="text-[10px] text-red-500 hover:underline ml-auto">Remove</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
