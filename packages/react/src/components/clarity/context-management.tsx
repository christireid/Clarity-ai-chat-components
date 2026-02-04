'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import { Switch } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import { Slider } from '@clarity-chat/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@clarity-chat/primitives'
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Globe,
  Database,
  Code,
  MessageSquare,
  Sparkles,
  Scissors,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Link2,
  Unlink,
  Lock,
  Unlock,
  Filter,
  SortAsc,
  MoreHorizontal,
  Zap,
  Clock,
  AlertTriangle,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface ContextSource {
  id: string
  name: string
  type: 'document' | 'web' | 'database' | 'code' | 'conversation' | 'custom'
  content: string
  tokens: number
  enabled: boolean
  priority: number
  maxTokens?: number
  lastUpdated?: Date
  metadata?: Record<string, unknown>
}

export interface ContextWindow {
  id: string
  name: string
  sources: ContextSource[]
  totalTokens: number
  maxTokens: number
  strategy: 'priority' | 'recency' | 'relevance' | 'manual'
}

// ============================================================================
// CONTEXT SOURCE CARD
// ============================================================================

interface ContextSourceCardProps {
  source: ContextSource
  onToggle?: (id: string, enabled: boolean) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onPriorityChange?: (id: string, priority: number) => void
  showContent?: boolean
  className?: string
}

const sourceIcons: Record<ContextSource['type'], React.ElementType> = {
  document: FileText,
  web: Globe,
  database: Database,
  code: Code,
  conversation: MessageSquare,
  custom: Sparkles,
}

export function ContextSourceCard({
  source,
  onToggle,
  onEdit,
  onDelete,
  onPriorityChange,
  showContent = false,
  className,
}: ContextSourceCardProps) {
  const [expanded, setExpanded] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const Icon = sourceIcons[source.type]

  const handleCopy = () => {
    navigator.clipboard.writeText(source.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border transition-colors',
        !source.enabled && 'opacity-60',
        className
      )}
    >
      <div className="flex items-center gap-3 p-3">
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg',
            source.enabled
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
          )}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{source.name}</span>
            <Badge variant="secondary" className="text-xs">
              {source.tokens.toLocaleString()} tokens
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground capitalize">
            {source.type}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={source.priority.toString()}
            onValueChange={(v) => onPriorityChange?.(source.id, parseInt(v))}
          >
            <SelectTrigger className="w-20 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Low</SelectItem>
              <SelectItem value="2">Medium</SelectItem>
              <SelectItem value="3">High</SelectItem>
            </SelectContent>
          </Select>

          <Switch
            checked={source.enabled}
            onCheckedChange={(checked) => onToggle?.(source.id, checked)}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setExpanded(!expanded)}>
                {expanded ? (
                  <EyeOff className="h-4 w-4 mr-2" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {expanded ? 'Hide Content' : 'View Content'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                Copy Content
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(source.id)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete?.(source.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {(expanded || showContent) && (
        <div className="px-3 pb-3 pt-0">
          <div className="rounded-md bg-muted/50 p-3 text-xs font-mono max-h-[200px] overflow-y-auto">
            {source.content}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// CONTEXT WINDOW MANAGER
// ============================================================================

interface ContextWindowManagerProps {
  window: ContextWindow
  onSourcesChange?: (sources: ContextSource[]) => void
  onAddSource?: () => void
  onStrategyChange?: (strategy: ContextWindow['strategy']) => void
  className?: string
}

export function ContextWindowManager({
  window,
  onSourcesChange,
  onAddSource,
  onStrategyChange,
  className,
}: ContextWindowManagerProps) {
  const [filter, setFilter] = React.useState<ContextSource['type'] | 'all'>(
    'all'
  )

  const filteredSources =
    filter === 'all'
      ? window.sources
      : window.sources.filter((s) => s.type === filter)

  const enabledTokens = window.sources
    .filter((s) => s.enabled)
    .reduce((acc, s) => acc + s.tokens, 0)

  const utilizationPercent = (enabledTokens / window.maxTokens) * 100
  const isOverLimit = enabledTokens > window.maxTokens

  const handleToggle = (id: string, enabled: boolean) => {
    onSourcesChange?.(
      window.sources.map((s) => (s.id === id ? { ...s, enabled } : s))
    )
  }

  const handleDelete = (id: string) => {
    onSourcesChange?.(window.sources.filter((s) => s.id !== id))
  }

  const handlePriorityChange = (id: string, priority: number) => {
    onSourcesChange?.(
      window.sources.map((s) => (s.id === id ? { ...s, priority } : s))
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{window.name}</h3>
          <p className="text-sm text-muted-foreground">
            Manage context sources for this conversation
          </p>
        </div>
        <Button onClick={onAddSource}>
          <Plus className="h-4 w-4 mr-2" />
          Add Source
        </Button>
      </div>

      {/* Token Usage */}
      <div className="rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Context Usage</span>
          <span
            className={cn(
              'text-sm font-bold',
              isOverLimit ? 'text-destructive' : 'text-green-500'
            )}
          >
            {enabledTokens.toLocaleString()} /{' '}
            {window.maxTokens.toLocaleString()}
          </span>
        </div>
        <Progress
          value={Math.min(utilizationPercent, 100)}
          className={cn('h-2', isOverLimit && '[&>div]:bg-destructive')}
        />
        {isOverLimit && (
          <p className="text-xs text-destructive mt-2 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Context exceeds limit by{' '}
            {(enabledTokens - window.maxTokens).toLocaleString()} tokens
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label className="text-sm">Strategy:</Label>
          <Select
            value={window.strategy}
            onValueChange={(v) =>
              onStrategyChange?.(v as ContextWindow['strategy'])
            }
          >
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="recency">Recency</SelectItem>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-sm">Filter:</Label>
          <Select
            value={filter}
            onValueChange={(v) => setFilter(v as ContextSource['type'] | 'all')}
          >
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="database">Database</SelectItem>
              <SelectItem value="code">Code</SelectItem>
              <SelectItem value="conversation">Conversation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sources List */}
      <ScrollArea className="h-[400px]">
        <div className="space-y-2 pr-4">
          {filteredSources.map((source) => (
            <ContextSourceCard
              key={source.id}
              source={source}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onPriorityChange={handlePriorityChange}
            />
          ))}
          {filteredSources.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No context sources</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// ============================================================================
// CONTEXT INJECTION PANEL
// ============================================================================

interface ContextInjectionPanelProps {
  onInject?: (content: string, type: ContextSource['type']) => void
  className?: string
}

export function ContextInjectionPanel({
  onInject,
  className,
}: ContextInjectionPanelProps) {
  const [content, setContent] = React.useState('')
  const [type, setType] = React.useState<ContextSource['type']>('custom')
  const estimatedTokens = Math.ceil(content.length / 4)

  const handleInject = () => {
    if (content.trim()) {
      onInject?.(content.trim(), type)
      setContent('')
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h4 className="text-sm font-medium mb-2">Quick Context Injection</h4>
        <p className="text-xs text-muted-foreground">
          Add temporary context to the current conversation
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-sm">Type:</Label>
        <Select
          value={type}
          onValueChange={(v) => setType(v as ContextSource['type'])}
        >
          <SelectTrigger className="w-32 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Custom</SelectItem>
            <SelectItem value="document">Document</SelectItem>
            <SelectItem value="code">Code</SelectItem>
            <SelectItem value="web">Web</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste or type context to inject..."
        rows={6}
        className="font-mono text-sm"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          ~{estimatedTokens.toLocaleString()} tokens
        </span>
        <Button onClick={handleInject} disabled={!content.trim()}>
          <Zap className="h-4 w-4 mr-2" />
          Inject Context
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// CONTEXT COMPRESSION TOOL
// ============================================================================

interface ContextCompressionToolProps {
  content: string
  originalTokens: number
  onCompress?: (compressed: string) => void
  className?: string
}

export function ContextCompressionTool({
  content,
  originalTokens,
  onCompress,
  className,
}: ContextCompressionToolProps) {
  const [method, setMethod] = React.useState<
    'summarize' | 'truncate' | 'extract'
  >('summarize')
  const [targetReduction, setTargetReduction] = React.useState(50)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [result, setResult] = React.useState<string | null>(null)

  const targetTokens = Math.ceil(originalTokens * (1 - targetReduction / 100))
  const resultTokens = result ? Math.ceil(result.length / 4) : 0
  const actualReduction = result
    ? Math.round((1 - resultTokens / originalTokens) * 100)
    : 0

  const handleCompress = async () => {
    setIsProcessing(true)
    // Simulated compression - in real implementation, call LLM
    await new Promise((r) => setTimeout(r, 1500))

    if (method === 'truncate') {
      const targetLength = Math.ceil(
        content.length * (1 - targetReduction / 100)
      )
      setResult(content.slice(0, targetLength) + '...')
    } else {
      // Simulate summarization
      setResult(
        content.slice(0, Math.ceil(content.length * 0.4)) + '... [summarized]'
      )
    }
    setIsProcessing(false)
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h4 className="text-sm font-medium mb-2">Context Compression</h4>
        <p className="text-xs text-muted-foreground">
          Reduce context size while preserving important information
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border p-3 text-center">
          <p className="text-xs text-muted-foreground">Original</p>
          <p className="text-lg font-bold">{originalTokens.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">tokens</p>
        </div>
        <div className="rounded-lg border border-border p-3 text-center">
          <p className="text-xs text-muted-foreground">Target</p>
          <p className="text-lg font-bold">{targetTokens.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">tokens</p>
        </div>
        <div className="rounded-lg border border-border p-3 text-center">
          <p className="text-xs text-muted-foreground">Result</p>
          <p
            className={cn(
              'text-lg font-bold',
              result ? 'text-green-500' : 'text-muted-foreground'
            )}
          >
            {result ? resultTokens.toLocaleString() : '—'}
          </p>
          <p className="text-xs text-muted-foreground">
            {result ? `${actualReduction}% saved` : 'tokens'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <Label className="text-sm w-24">Method:</Label>
          <Select
            value={method}
            onValueChange={(v) => setMethod(v as typeof method)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summarize">Summarize (AI)</SelectItem>
              <SelectItem value="truncate">Truncate</SelectItem>
              <SelectItem value="extract">Extract Key Points</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Target Reduction</Label>
            <span className="text-sm text-muted-foreground">
              {targetReduction}%
            </span>
          </div>
          <Slider
            value={[targetReduction]}
            onValueChange={([v]) => setTargetReduction(v)}
            min={10}
            max={90}
            step={10}
          />
        </div>
      </div>

      <Button
        onClick={handleCompress}
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Scissors className="h-4 w-4 mr-2" />
            Compress Context
          </>
        )}
      </Button>

      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Result</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCompress?.(result)}
            >
              <Check className="h-4 w-4 mr-1" />
              Apply
            </Button>
          </div>
          <div className="rounded-md bg-muted/50 p-3 text-xs font-mono max-h-[200px] overflow-y-auto">
            {result}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// SHARED CONTEXT EDITOR
// ============================================================================

interface SharedContextEditorProps {
  value: string
  onChange?: (value: string) => void
  isLocked?: boolean
  onLockToggle?: () => void
  linkedConversations?: { id: string; title: string }[]
  onUnlink?: (id: string) => void
  className?: string
}

export function SharedContextEditor({
  value = '',
  onChange,
  isLocked = false,
  onLockToggle,
  linkedConversations = [],
  onUnlink,
  className,
}: SharedContextEditorProps) {
  const safeValue = value || ''
  const estimatedTokens = Math.ceil(safeValue.length / 4)

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">Shared Context</h4>
          <p className="text-xs text-muted-foreground">
            Context shared across linked conversations
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onLockToggle}>
          {isLocked ? (
            <>
              <Lock className="h-4 w-4 mr-1" />
              Locked
            </>
          ) : (
            <>
              <Unlock className="h-4 w-4 mr-1" />
              Unlocked
            </>
          )}
        </Button>
      </div>

      <Textarea
        value={safeValue}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Enter shared context that will be available to all linked conversations..."
        rows={6}
        disabled={isLocked}
        className="font-mono text-sm"
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>~{estimatedTokens.toLocaleString()} tokens</span>
        <span>{linkedConversations.length} linked conversations</span>
      </div>

      {linkedConversations.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm">Linked Conversations</Label>
          <div className="flex flex-wrap gap-2">
            {linkedConversations.map((conv) => (
              <Badge key={conv.id} variant="secondary" className="gap-1 pr-1">
                <Link2 className="h-3 w-3" />
                {conv.title}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onUnlink?.(conv.id)}
                >
                  <Unlink className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// CONTEXT HISTORY VIEWER
// ============================================================================

interface ContextSnapshot {
  id: string
  timestamp: Date
  totalTokens: number
  enabledSources: number
  totalSources: number
  description?: string
}

interface ContextHistoryViewerProps {
  snapshots: ContextSnapshot[]
  onRestore?: (id: string) => void
  onCompare?: (id1: string, id2: string) => void
  className?: string
}

export function ContextHistoryViewer({
  snapshots = [],
  onRestore,
  onCompare,
  className,
}: ContextHistoryViewerProps) {
  const [selected, setSelected] = React.useState<string[]>([])
  const safeSnapshots = snapshots || []

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id))
    } else if (selected.length < 2) {
      setSelected([...selected, id])
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">Context History</h4>
          <p className="text-xs text-muted-foreground">
            View and restore previous context configurations
          </p>
        </div>
        {selected.length === 2 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCompare?.(selected[0], selected[1])}
          >
            Compare Selected
          </Button>
        )}
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2 pr-4">
          {safeSnapshots.map((snapshot) => (
            <div
              key={snapshot.id}
              className={cn(
                'rounded-lg border border-border p-3 cursor-pointer transition-colors',
                selected.includes(snapshot.id) && 'ring-2 ring-primary/30'
              )}
              onClick={() => toggleSelect(snapshot.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {snapshot.timestamp.toLocaleString()}
                    </span>
                  </div>
                  {snapshot.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {snapshot.description}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <Badge variant="secondary">
                    {snapshot.totalTokens.toLocaleString()} tokens
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {snapshot.enabledSources}/{snapshot.totalSources} sources
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRestore?.(snapshot.id)
                  }}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Restore
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

// ============================================================================
// CONTEXT RULES EDITOR
// ============================================================================

interface ContextRule {
  id: string
  name: string
  condition: string
  action: 'include' | 'exclude' | 'summarize' | 'truncate'
  enabled: boolean
}

interface ContextRulesEditorProps {
  rules: ContextRule[]
  onRulesChange?: (rules: ContextRule[]) => void
  className?: string
}

export function ContextRulesEditor({
  rules = [],
  onRulesChange,
  className,
}: ContextRulesEditorProps) {
  const [editingRule, setEditingRule] = React.useState<ContextRule | null>(null)
  const safeRules = rules || []

  const addRule = () => {
    const newRule: ContextRule = {
      id: `rule-${Date.now()}`,
      name: 'New Rule',
      condition: '',
      action: 'include',
      enabled: true,
    }
    onRulesChange?.([...safeRules, newRule])
    setEditingRule(newRule)
  }

  const updateRule = (id: string, updates: Partial<ContextRule>) => {
    onRulesChange?.(
      safeRules.map((r) => (r.id === id ? { ...r, ...updates } : r))
    )
  }

  const deleteRule = (id: string) => {
    onRulesChange?.(safeRules.filter((r) => r.id !== id))
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">Context Rules</h4>
          <p className="text-xs text-muted-foreground">
            Automated rules for managing context
          </p>
        </div>
        <Button size="sm" onClick={addRule}>
          <Plus className="h-4 w-4 mr-1" />
          Add Rule
        </Button>
      </div>

      <div className="space-y-2">
        {safeRules.map((rule) => (
          <div
            key={rule.id}
            className={cn(
              'rounded-lg border border-border p-3',
              !rule.enabled && 'opacity-60'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={(enabled) =>
                    updateRule(rule.id, { enabled })
                  }
                />
                <div>
                  <p className="text-sm font-medium">{rule.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {rule.condition || 'No condition set'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {rule.action}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingRule(rule)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => deleteRule(rule.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {safeRules.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No rules configured</p>
          </div>
        )}
      </div>

      {/* Edit Rule Dialog */}
      <Dialog open={!!editingRule} onOpenChange={() => setEditingRule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Rule</DialogTitle>
            <DialogDescription>
              Configure when and how this rule applies to context
            </DialogDescription>
          </DialogHeader>
          {editingRule && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Rule Name</Label>
                <Input
                  value={editingRule.name}
                  onChange={(e) =>
                    setEditingRule({ ...editingRule, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Condition</Label>
                <Textarea
                  value={editingRule.condition}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      condition: e.target.value,
                    })
                  }
                  placeholder="e.g., source.type === 'code' && source.tokens > 1000"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Action</Label>
                <Select
                  value={editingRule.action}
                  onValueChange={(v) =>
                    setEditingRule({
                      ...editingRule,
                      action: v as ContextRule['action'],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="include">Include</SelectItem>
                    <SelectItem value="exclude">Exclude</SelectItem>
                    <SelectItem value="summarize">Summarize</SelectItem>
                    <SelectItem value="truncate">Truncate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRule(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingRule) {
                  updateRule(editingRule.id, editingRule)
                  setEditingRule(null)
                }
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
