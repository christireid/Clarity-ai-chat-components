'use client'

import * as React from 'react'
import {
  Brain,
  Clock,
  Database,
  Edit3,
  Eye,
  EyeOff,
  Filter,
  History,
  Lightbulb,
  MoreHorizontal,
  Pin,
  PinOff,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Sparkles,
  Star,
  Tag,
  Trash2,
  X,
  ChevronDown,
  ChevronRight,
  Calendar,
  User,
  Zap,
  AlertCircle,
  CheckCircle2,
  Archive,
  Download,
  Upload,
  Layers,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { Switch } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
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
  DialogTrigger,
} from '@clarity-chat/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'

// Types
export interface Memory {
  id: string
  content: string
  type: 'fact' | 'preference' | 'context' | 'instruction' | 'learned'
  source?: 'user' | 'assistant' | 'system' | 'inferred'
  createdAt: Date
  updatedAt?: Date
  lastAccessedAt?: Date
  accessCount?: number
  tags?: string[]
  pinned?: boolean
  archived?: boolean
  confidence?: number
  relatedMemories?: string[]
  metadata?: Record<string, unknown>
}

export interface MemoryCategory {
  id: string
  name: string
  icon?: React.ReactNode
  count: number
  color?: string
}

export interface WorkingMemory {
  id: string
  key: string
  value: string
  ttl?: number
  createdAt: Date
  expiresAt?: Date
}

// Memory Card Component
export interface MemoryCardProps {
  memory: Memory
  onEdit?: (memory: Memory) => void
  onDelete?: (id: string) => void
  onPin?: (id: string) => void
  onArchive?: (id: string) => void
  onTagClick?: (tag: string) => void
  compact?: boolean
  className?: string
}

export function MemoryCard({
  memory,
  onEdit,
  onDelete,
  onPin,
  onArchive,
  onTagClick,
  compact = false,
  className,
}: MemoryCardProps) {
  const [expanded, setExpanded] = React.useState(false)

  const typeConfig = {
    fact: { icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    preference: { icon: Star, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    context: { icon: Layers, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    instruction: {
      icon: Zap,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    learned: { icon: Brain, color: 'text-green-500', bg: 'bg-green-500/10' },
  }

  const config = typeConfig[memory.type]
  const Icon = config.icon

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  if (compact) {
    return (
      <div
        className={cn(
          'group flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors',
          memory.pinned && 'border-accent/50',
          memory.archived && 'opacity-60',
          className
        )}
      >
        <div className={cn('p-1.5 rounded-md', config.bg)}>
          <Icon className={cn('h-3.5 w-3.5', config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{memory.content}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">
              {formatDate(memory.createdAt)}
            </span>
            {memory.confidence && (
              <Badge variant="outline" className="text-xs h-4 px-1">
                {Math.round(memory.confidence * 100)}%
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onPin && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onPin(memory.id)}
            >
              {memory.pinned ? (
                <PinOff className="h-3 w-3" />
              ) : (
                <Pin className="h-3 w-3" />
              )}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive"
              onClick={() => onDelete(memory.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card
      className={cn(
        'group transition-all',
        memory.pinned && 'border-accent/50 shadow-sm',
        memory.archived && 'opacity-60',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('p-2 rounded-lg', config.bg)}>
              <Icon className={cn('h-4 w-4', config.color)} />
            </div>
            <div>
              <Badge variant="secondary" className="text-xs capitalize">
                {memory.type}
              </Badge>
              {memory.pinned && (
                <Badge variant="outline" className="ml-1 text-xs">
                  <Pin className="h-2.5 w-2.5 mr-0.5" />
                  Pinned
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(memory)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {onPin && (
                <DropdownMenuItem onClick={() => onPin(memory.id)}>
                  {memory.pinned ? (
                    <>
                      <PinOff className="h-4 w-4 mr-2" />
                      Unpin
                    </>
                  ) : (
                    <>
                      <Pin className="h-4 w-4 mr-2" />
                      Pin
                    </>
                  )}
                </DropdownMenuItem>
              )}
              {onArchive && (
                <DropdownMenuItem onClick={() => onArchive(memory.id)}>
                  <Archive className="h-4 w-4 mr-2" />
                  {memory.archived ? 'Unarchive' : 'Archive'}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(memory.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{memory.content}</p>

        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {memory.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-muted"
                onClick={() => onTagClick?.(tag)}
              >
                <Tag className="h-2.5 w-2.5 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground"
            >
              {expanded ? (
                <ChevronDown className="h-3 w-3 mr-1" />
              ) : (
                <ChevronRight className="h-3 w-3 mr-1" />
              )}
              Details
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Created: {formatDate(memory.createdAt)}</span>
              </div>
              {memory.updatedAt && (
                <div className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  <span>Updated: {formatDate(memory.updatedAt)}</span>
                </div>
              )}
              {memory.source && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>Source: {memory.source}</span>
                </div>
              )}
              {memory.accessCount !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>Accessed: {memory.accessCount}x</span>
                </div>
              )}
              {memory.confidence !== undefined && (
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>
                    Confidence: {Math.round(memory.confidence * 100)}%
                  </span>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

// Memory Manager Component
export interface MemoryManagerProps {
  memories: Memory[]
  categories?: MemoryCategory[]
  onAddMemory?: (memory: Omit<Memory, 'id' | 'createdAt'>) => void
  onEditMemory?: (memory: Memory) => void
  onDeleteMemory?: (id: string) => void
  onPinMemory?: (id: string) => void
  onArchiveMemory?: (id: string) => void
  onSync?: () => void
  onExport?: () => void
  onImport?: (data: Memory[]) => void
  className?: string
}

export function MemoryManager({
  memories,
  categories,
  onAddMemory,
  onEditMemory,
  onDeleteMemory,
  onPinMemory,
  onArchiveMemory,
  onSync,
  onExport,
  onImport,
  className,
}: MemoryManagerProps) {
  const [search, setSearch] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<string>('all')
  const [showArchived, setShowArchived] = React.useState(false)
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [newMemory, setNewMemory] = React.useState({
    content: '',
    type: 'fact' as Memory['type'],
    tags: '',
  })

  const filteredMemories = React.useMemo(() => {
    return memories.filter((memory) => {
      if (!showArchived && memory.archived) return false
      if (typeFilter !== 'all' && memory.type !== typeFilter) return false
      if (
        search &&
        !memory.content.toLowerCase().includes(search.toLowerCase())
      )
        return false
      return true
    })
  }, [memories, search, typeFilter, showArchived])

  const pinnedMemories = filteredMemories.filter((m) => m.pinned)
  const regularMemories = filteredMemories.filter((m) => !m.pinned)

  const handleAddMemory = () => {
    if (!newMemory.content.trim()) return

    onAddMemory?.({
      content: newMemory.content,
      type: newMemory.type,
      tags: newMemory.tags
        ? newMemory.tags.split(',').map((t) => t.trim())
        : [],
      source: 'user',
    })

    setNewMemory({ content: '', type: 'fact', tags: '' })
    setAddDialogOpen(false)
  }

  const defaultCategories: MemoryCategory[] = [
    { id: 'all', name: 'All Memories', count: memories.length },
    {
      id: 'fact',
      name: 'Facts',
      icon: <Lightbulb className="h-4 w-4" />,
      count: memories.filter((m) => m.type === 'fact').length,
    },
    {
      id: 'preference',
      name: 'Preferences',
      icon: <Star className="h-4 w-4" />,
      count: memories.filter((m) => m.type === 'preference').length,
    },
    {
      id: 'context',
      name: 'Context',
      icon: <Layers className="h-4 w-4" />,
      count: memories.filter((m) => m.type === 'context').length,
    },
    {
      id: 'instruction',
      name: 'Instructions',
      icon: <Zap className="h-4 w-4" />,
      count: memories.filter((m) => m.type === 'instruction').length,
    },
    {
      id: 'learned',
      name: 'Learned',
      icon: <Brain className="h-4 w-4" />,
      count: memories.filter((m) => m.type === 'learned').length,
    },
  ]

  const displayCategories = categories || defaultCategories

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-accent" />
          <h2 className="font-semibold">Memory</h2>
          <Badge variant="secondary">{memories.length}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {onSync && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onSync}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Sync memories</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {onExport && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onExport}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export memories</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Memory
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Memory</DialogTitle>
                <DialogDescription>
                  Add a new piece of information for the AI to remember.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    placeholder="Enter information to remember..."
                    value={newMemory.content}
                    onChange={(e) =>
                      setNewMemory({ ...newMemory, content: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={newMemory.type}
                    onValueChange={(value) =>
                      setNewMemory({
                        ...newMemory,
                        type: value as Memory['type'],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fact">Fact</SelectItem>
                      <SelectItem value="preference">Preference</SelectItem>
                      <SelectItem value="context">Context</SelectItem>
                      <SelectItem value="instruction">Instruction</SelectItem>
                      <SelectItem value="learned">Learned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tags (comma-separated)</Label>
                  <Input
                    placeholder="work, coding, personal..."
                    value={newMemory.tags}
                    onChange={(e) =>
                      setNewMemory({ ...newMemory, tags: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddMemory}>Add Memory</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 space-y-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search memories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {displayCategories.map((category) => (
              <Button
                key={category.id}
                variant={typeFilter === category.id ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setTypeFilter(category.id)}
              >
                {category.icon}
                <span className="ml-1">{category.name}</span>
                <Badge variant="outline" className="ml-1 h-4 px-1 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="show-archived"
              className="text-xs text-muted-foreground"
            >
              Show archived
            </Label>
            <Switch
              id="show-archived"
              checked={showArchived}
              onCheckedChange={setShowArchived}
            />
          </div>
        </div>
      </div>

      {/* Memory List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {pinnedMemories.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Pin className="h-3 w-3" />
                Pinned
              </h3>
              <div className="space-y-2">
                {pinnedMemories.map((memory) => (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    onEdit={onEditMemory}
                    onDelete={onDeleteMemory}
                    onPin={onPinMemory}
                    onArchive={onArchiveMemory}
                    compact
                  />
                ))}
              </div>
            </div>
          )}

          {regularMemories.length > 0 && (
            <div className="space-y-2">
              {pinnedMemories.length > 0 && (
                <h3 className="text-xs font-medium text-muted-foreground">
                  All Memories
                </h3>
              )}
              <div className="space-y-2">
                {regularMemories.map((memory) => (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    onEdit={onEditMemory}
                    onDelete={onDeleteMemory}
                    onPin={onPinMemory}
                    onArchive={onArchiveMemory}
                    compact
                  />
                ))}
              </div>
            </div>
          )}

          {filteredMemories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No memories found</p>
              <p className="text-xs mt-1">
                Add your first memory to get started
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// Working Memory Component
export interface WorkingMemoryProps {
  items: WorkingMemory[]
  onAdd?: (key: string, value: string, ttl?: number) => void
  onRemove?: (id: string) => void
  onClear?: () => void
  maxItems?: number
  className?: string
}

export function WorkingMemoryDisplay({
  items,
  onAdd,
  onRemove,
  onClear,
  maxItems = 10,
  className,
}: WorkingMemoryProps) {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [newItem, setNewItem] = React.useState({ key: '', value: '', ttl: '' })

  const handleAdd = () => {
    if (!newItem.key.trim() || !newItem.value.trim()) return
    onAdd?.(
      newItem.key,
      newItem.value,
      newItem.ttl ? parseInt(newItem.ttl) : undefined
    )
    setNewItem({ key: '', value: '', ttl: '' })
    setAddDialogOpen(false)
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-accent" />
            <CardTitle className="text-sm">Working Memory</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {items.length}/{maxItems}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {onClear && items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={onClear}
              >
                Clear All
              </Button>
            )}
            {onAdd && (
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add to Working Memory</DialogTitle>
                    <DialogDescription>
                      Add temporary context for the current session.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Key</Label>
                      <Input
                        placeholder="e.g., current_task"
                        value={newItem.key}
                        onChange={(e) =>
                          setNewItem({ ...newItem, key: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Textarea
                        placeholder="Enter value..."
                        value={newItem.value}
                        onChange={(e) =>
                          setNewItem({ ...newItem, value: e.target.value })
                        }
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>TTL (seconds, optional)</Label>
                      <Input
                        type="number"
                        placeholder="Leave empty for no expiration"
                        value={newItem.ttl}
                        onChange={(e) =>
                          setNewItem({ ...newItem, ttl: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAdd}>Add</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        <CardDescription className="text-xs">
          Temporary context for the current session
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No working memory items
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex items-start justify-between p-2 rounded-md bg-muted/50 text-sm"
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="font-mono text-xs text-muted-foreground">
                    {item.key}
                  </div>
                  <div className="truncate">{item.value}</div>
                  {item.expiresAt && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Expires: {item.expiresAt.toLocaleTimeString()}
                    </div>
                  )}
                </div>
                {onRemove && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={() => onRemove(item.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Memory Timeline Component
export interface MemoryTimelineProps {
  memories: Memory[]
  onMemoryClick?: (memory: Memory) => void
  className?: string
}

export function MemoryTimeline({
  memories,
  onMemoryClick,
  className,
}: MemoryTimelineProps) {
  const sortedMemories = [...memories].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )

  const groupedByDate = sortedMemories.reduce(
    (acc, memory) => {
      const date = memory.createdAt.toLocaleDateString()
      if (!acc[date]) acc[date] = []
      acc[date].push(memory)
      return acc
    },
    {} as Record<string, Memory[]>
  )

  const typeConfig = {
    fact: { icon: Lightbulb, color: 'bg-yellow-500' },
    preference: { icon: Star, color: 'bg-blue-500' },
    context: { icon: Layers, color: 'bg-purple-500' },
    instruction: { icon: Zap, color: 'bg-orange-500' },
    learned: { icon: Brain, color: 'bg-green-500' },
  }

  return (
    <div className={cn('space-y-6', className)}>
      {Object.entries(groupedByDate).map(([date, dayMemories]) => (
        <div key={date}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{date}</span>
            <Badge variant="outline" className="text-xs">
              {dayMemories.length}
            </Badge>
          </div>
          <div className="relative pl-6 space-y-4">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
            {dayMemories.map((memory) => {
              const config = typeConfig[memory.type]
              const Icon = config.icon
              return (
                <div
                  key={memory.id}
                  className="relative cursor-pointer group"
                  onClick={() => onMemoryClick?.(memory)}
                >
                  <div
                    className={cn(
                      'absolute -left-4 top-1 w-3 h-3 rounded-full border-2 border-background',
                      config.color
                    )}
                  />
                  <div className="p-3 rounded-lg border border-border bg-card group-hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground capitalize">
                        {memory.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {memory.createdAt.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{memory.content}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// Memory Stats Component
export interface MemoryStatsProps {
  memories: Memory[]
  className?: string
}

export function MemoryStats({ memories, className }: MemoryStatsProps) {
  const stats = React.useMemo(() => {
    const byType = memories.reduce(
      (acc, m) => {
        acc[m.type] = (acc[m.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const pinned = memories.filter((m) => m.pinned).length
    const archived = memories.filter((m) => m.archived).length
    const withTags = memories.filter((m) => m.tags && m.tags.length > 0).length
    const avgConfidence =
      memories.reduce((sum, m) => sum + (m.confidence || 0), 0) /
      memories.length

    return {
      byType,
      pinned,
      archived,
      withTags,
      avgConfidence,
      total: memories.length,
    }
  }, [memories])

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Memory Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Memories</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.pinned}</div>
            <div className="text-xs text-muted-foreground">Pinned</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {Math.round(stats.avgConfidence * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Confidence</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.withTags}</div>
            <div className="text-xs text-muted-foreground">Tagged</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs font-medium mb-2">By Type</div>
          <div className="space-y-1">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div
                key={type}
                className="flex items-center justify-between text-xs"
              >
                <span className="capitalize">{type}</span>
                <span className="text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Historical Memories Component
export interface HistoricalMemoriesProps {
  memories: Memory[]
  onRestore?: (memory: Memory) => void
  onPermanentDelete?: (id: string) => void
  className?: string
}

export function HistoricalMemories({
  memories,
  onRestore,
  onPermanentDelete,
  className,
}: HistoricalMemoriesProps) {
  const archivedMemories = memories.filter((m) => m.archived)

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">Archived Memories</h3>
          <Badge variant="secondary">{archivedMemories.length}</Badge>
        </div>
      </div>

      {archivedMemories.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Archive className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No archived memories</p>
        </div>
      ) : (
        <div className="space-y-2">
          {archivedMemories.map((memory) => (
            <div
              key={memory.id}
              className="group flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/30"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">
                  {memory.content}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>Archived {memory.updatedAt?.toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onRestore && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7"
                    onClick={() => onRestore(memory)}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Restore
                  </Button>
                )}
                {onPermanentDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => onPermanentDelete(memory.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// BarChart3 component for stats (simple inline implementation)
function BarChart3(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  )
}
