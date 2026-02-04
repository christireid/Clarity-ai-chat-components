'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import {
  MessageSquare,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Pin,
  Archive,
  ChevronRight,
  Search,
  Sparkles,
  Check,
  X,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface ConversationItem {
  key: string
  label: React.ReactNode
  icon?: React.ReactNode
  group?: string
  disabled?: boolean
  pinned?: boolean
  timestamp?: Date
  preview?: string
  unread?: boolean
}

export interface ConversationGroup {
  key: string
  label: React.ReactNode
  collapsible?: boolean
  defaultExpanded?: boolean
}

export interface ConversationsListProps {
  items: ConversationItem[]
  activeKey?: string
  defaultActiveKey?: string
  onActiveChange?: (key: string) => void
  groups?: ConversationGroup[]
  groupable?: boolean
  searchable?: boolean
  creatable?: boolean
  onCreate?: () => void
  onDelete?: (key: string) => void
  onRename?: (key: string, newLabel: string) => void
  onPin?: (key: string) => void
  onArchive?: (key: string) => void
  createLabel?: React.ReactNode
  emptyLabel?: React.ReactNode
  searchPlaceholder?: string
  variant?: 'default' | 'compact' | 'minimal'
  showTimestamp?: boolean
  showPreview?: boolean
  className?: string
  shortcutKeys?: {
    creation?: string[]
    items?: string[]
  }
}

// ============================================================================
// CONVERSATION ITEM
// ============================================================================

interface ConversationItemComponentProps {
  item: ConversationItem
  isActive: boolean
  onClick: () => void
  onDelete?: () => void
  onRename?: (newLabel: string) => void
  onPin?: () => void
  onArchive?: () => void
  variant: 'default' | 'compact' | 'minimal'
  showTimestamp?: boolean
  showPreview?: boolean
}

function ConversationItemComponent({
  item,
  isActive,
  onClick,
  onDelete,
  onRename,
  onPin,
  onArchive,
  variant,
  showTimestamp,
  showPreview,
}: ConversationItemComponentProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editValue, setEditValue] = React.useState(
    typeof item.label === 'string' ? item.label : ''
  )
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleRename = () => {
    if (editValue.trim() && onRename) {
      onRename(editValue.trim())
    }
    setIsEditing(false)
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2 transition-all cursor-pointer',
        'hover:bg-muted/50',
        isActive && 'bg-primary/10 text-primary',
        item.disabled && 'opacity-50 pointer-events-none',
        variant === 'compact' && 'py-1.5 px-2',
        variant === 'minimal' && 'py-1 px-2 gap-2'
      )}
      onClick={onClick}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex-shrink-0',
          variant === 'minimal' ? 'w-4 h-4' : 'w-5 h-5'
        )}
      >
        {item.icon || (
          <MessageSquare
            className={cn(
              'w-full h-full',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename()
                if (e.key === 'Escape') setIsEditing(false)
              }}
              onClick={(e) => e.stopPropagation()}
              className="h-6 text-sm py-0"
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                handleRename()
              }}
            >
              <Check className="w-3 h-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(false)
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'truncate font-medium',
                  variant === 'minimal' ? 'text-xs' : 'text-sm',
                  item.unread && 'font-semibold'
                )}
              >
                {item.label}
              </span>
              {item.pinned && (
                <Pin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              )}
              {item.unread && (
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              )}
            </div>
            {showPreview && item.preview && variant !== 'minimal' && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {item.preview}
              </p>
            )}
          </>
        )}
      </div>

      {/* Timestamp */}
      {showTimestamp &&
        item.timestamp &&
        !isEditing &&
        variant !== 'minimal' && (
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatTimestamp(item.timestamp)}
          </span>
        )}

      {/* Actions Menu */}
      {!isEditing && (onDelete || onRename || onPin || onArchive) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                'h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0',
                'focus:opacity-100'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {onRename && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
            )}
            {onPin && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onPin()
                }}
              >
                <Pin className="w-4 h-4 mr-2" />
                {item.pinned ? 'Unpin' : 'Pin'}
              </DropdownMenuItem>
            )}
            {onArchive && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onArchive()
                }}
              >
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

// ============================================================================
// CONVERSATIONS LIST
// ============================================================================

export function ConversationsList({
  items,
  activeKey,
  defaultActiveKey,
  onActiveChange,
  groups,
  groupable = false,
  searchable = false,
  creatable = true,
  onCreate,
  onDelete,
  onRename,
  onPin,
  onArchive,
  createLabel = 'New Chat',
  emptyLabel = 'No conversations yet',
  searchPlaceholder = 'Search conversations...',
  variant = 'default',
  showTimestamp = true,
  showPreview = true,
  className,
  shortcutKeys,
}: ConversationsListProps) {
  const [internalActiveKey, setInternalActiveKey] =
    React.useState(defaultActiveKey)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    () => {
      const initial = new Set<string>()
      groups?.forEach((g) => {
        if (g.defaultExpanded !== false) {
          initial.add(g.key)
        }
      })
      return initial
    }
  )

  const currentActiveKey = activeKey ?? internalActiveKey

  const handleActiveChange = (key: string) => {
    setInternalActiveKey(key)
    onActiveChange?.(key)
  }

  // Filter items based on search
  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) return items
    const query = searchQuery.toLowerCase()
    return items.filter((item) => {
      const label = typeof item.label === 'string' ? item.label : ''
      const preview = item.preview || ''
      return (
        label.toLowerCase().includes(query) ||
        preview.toLowerCase().includes(query)
      )
    })
  }, [items, searchQuery])

  // Group items
  const groupedItems = React.useMemo(() => {
    if (!groupable) return { ungrouped: filteredItems }

    const grouped: Record<string, ConversationItem[]> = {}
    const pinnedItems: ConversationItem[] = []

    filteredItems.forEach((item) => {
      if (item.pinned) {
        pinnedItems.push(item)
      } else {
        const groupKey = item.group || 'ungrouped'
        if (!grouped[groupKey]) grouped[groupKey] = []
        grouped[groupKey].push(item)
      }
    })

    if (pinnedItems.length > 0) {
      grouped['pinned'] = pinnedItems
    }

    return grouped
  }, [filteredItems, groupable])

  // Keyboard shortcuts
  React.useEffect(() => {
    if (!shortcutKeys) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Creation shortcut (e.g., Cmd+K)
      if (shortcutKeys.creation && onCreate) {
        const isMatch = shortcutKeys.creation.every((key) => {
          if (key === 'meta' || key === 'cmd') return e.metaKey
          if (key === 'ctrl') return e.ctrlKey
          if (key === 'alt') return e.altKey
          if (key === 'shift') return e.shiftKey
          return e.key.toLowerCase() === key.toLowerCase()
        })
        if (isMatch) {
          e.preventDefault()
          onCreate()
        }
      }

      // Number shortcuts for items
      if (shortcutKeys.items && e.altKey && !e.metaKey && !e.ctrlKey) {
        const num = parseInt(e.key)
        if (num >= 1 && num <= 9 && num <= items.length) {
          e.preventDefault()
          handleActiveChange(items[num - 1].key)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcutKeys, onCreate, items])

  const renderGroup = (groupKey: string, groupItems: ConversationItem[]) => {
    const group = groups?.find((g) => g.key === groupKey)
    const isExpanded = expandedGroups.has(groupKey)
    const label =
      group?.label ||
      (groupKey === 'pinned'
        ? 'Pinned'
        : groupKey === 'ungrouped'
          ? undefined
          : groupKey)
    const isCollapsible =
      group?.collapsible !== false && groupKey !== 'ungrouped'

    const content = (
      <div className="space-y-0.5">
        {groupItems.map((item) => (
          <ConversationItemComponent
            key={item.key}
            item={item}
            isActive={currentActiveKey === item.key}
            onClick={() => handleActiveChange(item.key)}
            onDelete={onDelete ? () => onDelete(item.key) : undefined}
            onRename={
              onRename ? (newLabel) => onRename(item.key, newLabel) : undefined
            }
            onPin={onPin ? () => onPin(item.key) : undefined}
            onArchive={onArchive ? () => onArchive(item.key) : undefined}
            variant={variant}
            showTimestamp={showTimestamp}
            showPreview={showPreview}
          />
        ))}
      </div>
    )

    if (!label) return content

    if (isCollapsible) {
      return (
        <Collapsible
          key={groupKey}
          open={isExpanded}
          onOpenChange={(open) => {
            setExpandedGroups((prev) => {
              const next = new Set(prev)
              if (open) next.add(groupKey)
              else next.delete(groupKey)
              return next
            })
          }}
        >
          <CollapsibleTrigger className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight
              className={cn(
                'w-3 h-3 transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
            {label}
            <span className="ml-auto text-muted-foreground/60">
              {groupItems.length}
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent>{content}</CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <div key={groupKey}>
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
          {label}
        </div>
        {content}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Create Button */}
      {creatable && onCreate && (
        <div className="p-3 border-b border-border">
          <Button
            onClick={onCreate}
            className="w-full justify-start gap-2 bg-transparent"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
            {createLabel}
            {shortcutKeys?.creation && (
              <kbd className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {shortcutKeys.creation.join('+')}
              </kbd>
            )}
          </Button>
        </div>
      )}

      {/* Search */}
      {searchable && (
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>
        </div>
      )}

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Sparkles className="w-8 h-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">{emptyLabel}</p>
              {creatable && onCreate && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={onCreate}
                  className="mt-2"
                >
                  Start a new conversation
                </Button>
              )}
            </div>
          ) : groupable ? (
            <div className="space-y-2">
              {Object.entries(groupedItems).map(([groupKey, groupItems]) =>
                renderGroup(groupKey, groupItems)
              )}
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredItems.map((item) => (
                <ConversationItemComponent
                  key={item.key}
                  item={item}
                  isActive={currentActiveKey === item.key}
                  onClick={() => handleActiveChange(item.key)}
                  onDelete={onDelete ? () => onDelete(item.key) : undefined}
                  onRename={
                    onRename
                      ? (newLabel) => onRename(item.key, newLabel)
                      : undefined
                  }
                  onPin={onPin ? () => onPin(item.key) : undefined}
                  onArchive={onArchive ? () => onArchive(item.key) : undefined}
                  variant={variant}
                  showTimestamp={showTimestamp}
                  showPreview={showPreview}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// ============================================================================
// CONVERSATIONS DIVIDER
// ============================================================================

export interface ConversationsDividerProps {
  label?: React.ReactNode
  dashed?: boolean
  className?: string
}

export function ConversationsDivider({
  label,
  dashed = false,
  className,
}: ConversationsDividerProps) {
  return (
    <div className={cn('flex items-center gap-3 py-2 px-3', className)}>
      <div
        className={cn(
          'flex-1 h-px bg-border',
          dashed && 'border-t border-dashed border-border bg-transparent'
        )}
      />
      {label && (
        <>
          <span className="text-xs text-muted-foreground">{label}</span>
          <div
            className={cn(
              'flex-1 h-px bg-border',
              dashed && 'border-t border-dashed border-border bg-transparent'
            )}
          />
        </>
      )}
    </div>
  )
}

export default ConversationsList
