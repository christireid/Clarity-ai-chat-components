// @ts-nocheck
// TODO: Fix lucide-react icon imports
'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  X,
  Home,
  Plus,
  MoreVertical,
  ExternalLink,
  Copy,
  Bookmark,
  BookmarkPlus,
  Shield,
  ShieldAlert,
  Loader2,
  Globe,
  Lock,
  Search,
  Maximize2,
  Minimize2,
  PanelLeft,
} from 'lucide-react'

// Browser Tab
export interface BrowserTab {
  id: string
  url: string
  title: string
  favicon?: string
  loading?: boolean
  error?: string
}

// Browser Frame
export interface BrowserFrameProps {
  url?: string
  title?: string
  showAddressBar?: boolean
  showNavigation?: boolean
  isSecure?: boolean
  isLoading?: boolean
  className?: string
  children?: React.ReactNode
}

export function BrowserFrame({
  url = 'https://example.com',
  title = 'Example',
  showAddressBar = true,
  showNavigation = true,
  isSecure = true,
  isLoading = false,
  className,
  children,
}: BrowserFrameProps) {
  const [currentUrl, setCurrentUrl] = React.useState(url)

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        className
      )}
    >
      {/* Browser Chrome */}
      <div className="bg-muted/50 border-b border-border">
        {/* Tab Bar */}
        <div className="flex items-center px-2 pt-2">
          <div className="flex items-center gap-1 bg-card rounded-t-lg px-3 py-1.5 border border-b-0 border-border max-w-48">
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
            ) : (
              <Globe className="h-3 w-3 text-muted-foreground" />
            )}
            <span className="text-xs truncate">{title}</span>
            <button className="ml-auto p-0.5 hover:bg-muted rounded">
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
          <button className="p-1.5 hover:bg-muted rounded ml-1">
            <Plus className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>

        {/* Address Bar */}
        {showAddressBar && (
          <div className="flex items-center gap-2 px-2 pb-2 pt-1">
            {showNavigation && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  {isLoading ? (
                    <X className="h-3.5 w-3.5" />
                  ) : (
                    <RotateCw className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Home className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}

            <div className="flex-1 relative">
              <div className="flex items-center gap-2 bg-background rounded-full px-3 py-1.5 border border-border">
                {isSecure ? (
                  <Lock className="h-3 w-3 text-green-500" />
                ) : (
                  <ShieldAlert className="h-3 w-3 text-amber-500" />
                )}
                <input
                  type="text"
                  value={currentUrl}
                  onChange={(e) => setCurrentUrl(e.target.value)}
                  className="flex-1 bg-transparent text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <BookmarkPlus className="h-3.5 w-3.5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in new tab
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Bookmark className="h-4 w-4 mr-2" />
                    Bookmarks
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>

      {/* Browser Content */}
      <div className="bg-background min-h-[200px]">{children}</div>
    </div>
  )
}

// Multi-Tab Browser
export interface MultiBrowserProps {
  tabs: BrowserTab[]
  activeTabId: string
  onTabChange: (id: string) => void
  onTabClose: (id: string) => void
  onTabAdd: () => void
  onNavigate: (id: string, url: string) => void
  className?: string
  children?: React.ReactNode
}

export function MultiBrowser({
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  onTabAdd,
  onNavigate,
  className,
  children,
}: MultiBrowserProps) {
  const activeTab = tabs.find((t) => t.id === activeTabId)
  const [urlInput, setUrlInput] = React.useState(activeTab?.url || '')

  React.useEffect(() => {
    setUrlInput(activeTab?.url || '')
  }, [activeTab?.url])

  const handleNavigate = () => {
    if (activeTab) {
      onNavigate(activeTab.id, urlInput)
    }
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden flex flex-col',
        className
      )}
    >
      {/* Tab Bar */}
      <div className="bg-muted/50 border-b border-border">
        <div className="flex items-center px-2 pt-2 gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-t-lg border border-b-0 max-w-40 min-w-24 text-left transition-colors',
                tab.id === activeTabId
                  ? 'bg-card border-border'
                  : 'bg-transparent border-transparent hover:bg-muted/50'
              )}
            >
              {tab.loading ? (
                <Loader2 className="h-3 w-3 animate-spin flex-shrink-0" />
              ) : tab.favicon ? (
                <img
                  src={tab.favicon || '/placeholder.svg'}
                  alt=""
                  className="h-3 w-3 flex-shrink-0"
                />
              ) : (
                <Globe className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
              )}
              <span className="text-xs truncate flex-1">
                {tab.title || 'New Tab'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onTabClose(tab.id)
                }}
                className="p-0.5 hover:bg-muted rounded flex-shrink-0"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </button>
          ))}
          <button
            onClick={onTabAdd}
            className="p-1.5 hover:bg-muted rounded flex-shrink-0"
          >
            <Plus className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex items-center gap-2 px-2 pb-2 pt-1">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              {activeTab?.loading ? (
                <X className="h-3.5 w-3.5" />
              ) : (
                <RotateCw className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>

          <div className="flex-1">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleNavigate()
              }}
              className="flex items-center gap-2 bg-background rounded-full px-3 py-1.5 border border-border"
            >
              <Lock className="h-3 w-3 text-green-500" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 bg-transparent text-xs outline-none"
                placeholder="Search or enter URL"
              />
              <Search className="h-3 w-3 text-muted-foreground" />
            </form>
          </div>

          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-background min-h-[300px] overflow-auto">
        {activeTab?.error ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
            <h3 className="font-semibold mb-2">This site can't be reached</h3>
            <p className="text-sm text-muted-foreground">{activeTab.error}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

// Simple URL Bar
export interface URLBarProps {
  url: string
  isSecure?: boolean
  isLoading?: boolean
  onChange?: (url: string) => void
  onSubmit?: (url: string) => void
  className?: string
}

export function URLBar({
  url,
  isSecure = true,
  isLoading = false,
  onChange,
  onSubmit,
  className,
}: URLBarProps) {
  const [value, setValue] = React.useState(url)

  React.useEffect(() => {
    setValue(url)
  }, [url])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(value)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex items-center gap-2 bg-muted rounded-lg px-3 py-2 border border-border',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : isSecure ? (
        <Lock className="h-4 w-4 text-green-500" />
      ) : (
        <Globe className="h-4 w-4 text-muted-foreground" />
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          onChange?.(e.target.value)
        }}
        className="flex-1 bg-transparent text-sm outline-none"
        placeholder="Enter URL..."
      />
      <Button type="submit" variant="ghost" size="icon" className="h-6 w-6">
        <ArrowRight className="h-3 w-3" />
      </Button>
    </form>
  )
}

// Dev Tools Panel
export interface DevToolsPanelProps {
  activeTab?: 'elements' | 'console' | 'network' | 'sources'
  consoleMessages?: Array<{
    type: 'log' | 'warn' | 'error' | 'info'
    message: string
    timestamp?: Date
  }>
  networkRequests?: Array<{
    method: string
    url: string
    status: number
    size?: string
    time?: string
  }>
  className?: string
}

export function DevToolsPanel({
  activeTab = 'console',
  consoleMessages = [],
  networkRequests = [],
  className,
}: DevToolsPanelProps) {
  const [tab, setTab] = React.useState(activeTab)

  return (
    <div className={cn('border-t border-border bg-card', className)}>
      {/* Tab Bar */}
      <div className="flex items-center border-b border-border">
        {['elements', 'console', 'network', 'sources'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as typeof tab)}
            className={cn(
              'px-4 py-2 text-xs font-medium capitalize transition-colors',
              tab === t
                ? 'text-accent border-b-2 border-accent'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="h-48 overflow-auto p-2 font-mono text-xs">
        {tab === 'console' && (
          <div className="space-y-1">
            {consoleMessages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-2 px-2 py-1 rounded',
                  msg.type === 'error' && 'bg-destructive/10 text-destructive',
                  msg.type === 'warn' && 'bg-amber-500/10 text-amber-600',
                  msg.type === 'info' && 'bg-blue-500/10 text-blue-600'
                )}
              >
                <span className="opacity-50">{'>'}</span>
                <span className="flex-1">{msg.message}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'network' && (
          <table className="w-full">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="px-2 py-1">Method</th>
                <th className="px-2 py-1">URL</th>
                <th className="px-2 py-1">Status</th>
                <th className="px-2 py-1">Size</th>
                <th className="px-2 py-1">Time</th>
              </tr>
            </thead>
            <tbody>
              {networkRequests.map((req, i) => (
                <tr key={i} className="hover:bg-muted/50">
                  <td className="px-2 py-1">
                    <Badge variant="outline" className="text-[10px]">
                      {req.method}
                    </Badge>
                  </td>
                  <td className="px-2 py-1 truncate max-w-xs">{req.url}</td>
                  <td
                    className={cn(
                      'px-2 py-1',
                      req.status >= 400 ? 'text-destructive' : 'text-green-500'
                    )}
                  >
                    {req.status}
                  </td>
                  <td className="px-2 py-1 text-muted-foreground">
                    {req.size}
                  </td>
                  <td className="px-2 py-1 text-muted-foreground">
                    {req.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
