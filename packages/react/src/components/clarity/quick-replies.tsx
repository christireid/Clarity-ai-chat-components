'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Zap,
  Plus,
  Pencil,
  Trash2,
  Search,
  Clock,
  Star,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface QuickReply {
  id: string
  title: string
  content: string
  shortcut?: string
  category?: string
  isFavorite?: boolean
  usageCount?: number
  lastUsed?: Date
}

export interface QuickReplyCategory {
  id: string
  name: string
  replies: QuickReply[]
}

// ============================================================================
// QUICK REPLY BUTTON
// ============================================================================

interface QuickReplyButtonProps {
  reply: QuickReply
  onClick: (reply: QuickReply) => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function QuickReplyButton({
  reply,
  onClick,
  variant = 'outline',
  size = 'sm',
  className,
}: QuickReplyButtonProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  return (
    <button
      onClick={() => onClick(reply)}
      className={cn(
        'rounded-full border transition-colors',
        variant === 'default' &&
          'bg-primary text-primary-foreground border-primary hover:bg-primary/90',
        variant === 'outline' &&
          'bg-background border-border hover:bg-muted hover:border-primary/50',
        variant === 'ghost' && 'border-transparent hover:bg-muted',
        sizeClasses[size],
        className
      )}
    >
      {reply.title}
    </button>
  )
}

// ============================================================================
// QUICK REPLIES BAR
// ============================================================================

interface QuickRepliesBarProps {
  replies: QuickReply[]
  onSelect: (reply: QuickReply) => void
  maxVisible?: number
  showMoreButton?: boolean
  onShowMore?: () => void
  className?: string
}

export function QuickReplyBar({
  replies,
  onSelect,
  maxVisible = 5,
  showMoreButton = true,
  onShowMore,
  className,
}: QuickRepliesBarProps) {
  const visibleReplies = replies.slice(0, maxVisible)
  const hasMore = replies.length > maxVisible

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {visibleReplies.map((reply) => (
        <QuickReplyButton key={reply.id} reply={reply} onClick={onSelect} />
      ))}
      {showMoreButton && hasMore && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={onShowMore}
        >
          +{replies.length - maxVisible} more
        </Button>
      )}
    </div>
  )
}

// ============================================================================
// QUICK REPLIES PANEL
// ============================================================================

interface QuickRepliesPanelProps {
  replies: QuickReply[]
  categories?: QuickReplyCategory[]
  onSelect: (reply: QuickReply) => void
  onEdit?: (reply: QuickReply) => void
  onDelete?: (reply: QuickReply) => void
  onToggleFavorite?: (reply: QuickReply) => void
  searchable?: boolean
  className?: string
}

export function QuickRepliesPanel({
  replies,
  categories,
  onSelect,
  onEdit,
  onDelete,
  onToggleFavorite,
  searchable = true,
  className,
}: QuickRepliesPanelProps) {
  const [search, setSearch] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState<string | null>(
    null
  )

  const filteredReplies = React.useMemo(() => {
    let result = activeCategory
      ? categories?.find((c) => c.id === activeCategory)?.replies || []
      : replies

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(searchLower) ||
          r.content.toLowerCase().includes(searchLower)
      )
    }

    return result
  }, [replies, categories, activeCategory, search])

  const favoriteReplies = replies.filter((r) => r.isFavorite)
  const recentReplies = [...replies]
    .filter((r) => r.lastUsed)
    .sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0))
    .slice(0, 5)

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Search */}
      {searchable && (
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quick replies..."
              className="pl-9"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {/* Favorites */}
        {favoriteReplies.length > 0 && !search && !activeCategory && (
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Star className="h-3 w-3" />
              Favorites
            </div>
            <div className="space-y-1">
              {favoriteReplies.map((reply) => (
                <QuickReplyItem
                  key={reply.id}
                  reply={reply}
                  onSelect={onSelect}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent */}
        {recentReplies.length > 0 && !search && !activeCategory && (
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Clock className="h-3 w-3" />
              Recent
            </div>
            <div className="space-y-1">
              {recentReplies.map((reply) => (
                <QuickReplyItem
                  key={reply.id}
                  reply={reply}
                  onSelect={onSelect}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {categories && categories.length > 0 && !search && (
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              Categories
            </div>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() =>
                    setActiveCategory(
                      activeCategory === category.id ? null : category.id
                    )
                  }
                  className={cn(
                    'flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors',
                    activeCategory === category.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  )}
                >
                  <span>{category.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {category.replies.length}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* All Replies */}
        <div className="p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            {activeCategory
              ? categories?.find((c) => c.id === activeCategory)?.name
              : search
                ? 'Search Results'
                : 'All Replies'}
          </div>
          {filteredReplies.length > 0 ? (
            <div className="space-y-1">
              {filteredReplies.map((reply) => (
                <QuickReplyItem
                  key={reply.id}
                  reply={reply}
                  onSelect={onSelect}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No quick replies found
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// QUICK REPLY ITEM
// ============================================================================

interface QuickReplyItemProps {
  reply: QuickReply
  onSelect: (reply: QuickReply) => void
  onEdit?: (reply: QuickReply) => void
  onDelete?: (reply: QuickReply) => void
  onToggleFavorite?: (reply: QuickReply) => void
  className?: string
}

export function QuickReplyItem({
  reply,
  onSelect,
  onEdit,
  onDelete,
  onToggleFavorite,
  className,
}: QuickReplyItemProps) {
  return (
    <div
      className={cn(
        'group flex items-start gap-2 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer',
        className
      )}
      onClick={() => onSelect(reply)}
    >
      <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{reply.title}</span>
          {reply.shortcut && (
            <kbd className="text-[10px] px-1.5 py-0.5 bg-muted rounded border border-border">
              {reply.shortcut}
            </kbd>
          )}
          {reply.isFavorite && (
            <Star className="h-3 w-3 fill-primary text-primary" />
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
          {reply.content}
        </p>
      </div>
      {(onEdit || onDelete || onToggleFavorite) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onToggleFavorite && (
              <DropdownMenuItem onClick={() => onToggleFavorite(reply)}>
                <Star
                  className={cn(
                    'h-4 w-4 mr-2',
                    reply.isFavorite && 'fill-current'
                  )}
                />
                {reply.isFavorite
                  ? 'Remove from favorites'
                  : 'Add to favorites'}
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(reply)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(reply)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
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
// QUICK REPLY EDITOR
// ============================================================================

interface QuickReplyEditorProps {
  reply?: QuickReply
  onSave: (reply: Omit<QuickReply, 'id'>) => void
  onCancel: () => void
  categories?: QuickReplyCategory[]
}

export function QuickReplyEditor({
  reply,
  onSave,
  onCancel,
  categories,
}: QuickReplyEditorProps) {
  const [title, setTitle] = React.useState(reply?.title || '')
  const [content, setContent] = React.useState(reply?.content || '')
  const [shortcut, setShortcut] = React.useState(reply?.shortcut || '')
  const [category, setCategory] = React.useState(reply?.category || '')

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onSave({
        title: title.trim(),
        content: content.trim(),
        shortcut: shortcut.trim() || undefined,
        category: category || undefined,
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quick reply title"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Quick reply content..."
          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Shortcut (optional)</label>
          <Input
            value={shortcut}
            onChange={(e) => setShortcut(e.target.value)}
            placeholder="/shortcut"
          />
        </div>
        {categories && categories.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Category (optional)</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!title.trim() || !content.trim()}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// QUICK REPLY TRIGGER
// ============================================================================

interface QuickReplyTriggerProps {
  replies: QuickReply[]
  onSelect: (reply: QuickReply) => void
  children?: React.ReactNode
  className?: string
}

export function QuickReplyTrigger({
  replies,
  onSelect,
  children,
  className,
}: QuickReplyTriggerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className={className}>
            <Zap className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Quick Replies</DialogTitle>
        </DialogHeader>
        <QuickRepliesPanel replies={replies} onSelect={onSelect} />
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// HOOKS
// ============================================================================

export function useQuickReplies(initialReplies: QuickReply[] = []) {
  const [replies, setReplies] = React.useState<QuickReply[]>(initialReplies)

  const addReply = React.useCallback((reply: Omit<QuickReply, 'id'>) => {
    const newReply: QuickReply = {
      ...reply,
      id: `qr-${Date.now()}`,
      usageCount: 0,
    }
    setReplies((prev) => [...prev, newReply])
    return newReply
  }, [])

  const updateReply = React.useCallback(
    (id: string, updates: Partial<QuickReply>) => {
      setReplies((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      )
    },
    []
  )

  const deleteReply = React.useCallback((id: string) => {
    setReplies((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const useReply = React.useCallback((id: string) => {
    setReplies((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, usageCount: (r.usageCount || 0) + 1, lastUsed: new Date() }
          : r
      )
    )
  }, [])

  const toggleFavorite = React.useCallback((id: string) => {
    setReplies((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    )
  }, [])

  return {
    replies,
    addReply,
    updateReply,
    deleteReply,
    useReply,
    toggleFavorite,
    setReplies,
  }
}
