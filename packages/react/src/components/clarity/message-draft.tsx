'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Save,
  Trash2,
  Clock,
  FileText,
  MoreVertical,
  Send,
  Edit3,
  Copy,
  Star,
  StarOff,
  Archive,
  FolderOpen,
} from 'lucide-react'

// Types
export interface MessageDraft {
  id: string
  content: string
  title?: string
  createdAt: Date
  updatedAt: Date
  starred?: boolean
  tags?: string[]
  conversationId?: string
}

// Draft Editor Component
interface DraftEditorProps {
  draft?: MessageDraft
  onSave: (content: string, title?: string) => void
  onSend?: (content: string) => void
  onCancel?: () => void
  placeholder?: string
  autoSave?: boolean
  autoSaveDelay?: number
  className?: string
}

export function DraftEditor({
  draft,
  onSave,
  onSend,
  onCancel,
  placeholder = 'Start typing your message...',
  autoSave = true,
  autoSaveDelay = 2000,
  className,
}: DraftEditorProps) {
  const [content, setContent] = React.useState(draft?.content || '')
  const [title, setTitle] = React.useState(draft?.title || '')
  const [lastSaved, setLastSaved] = React.useState<Date | null>(
    draft?.updatedAt || null
  )
  const [isSaving, setIsSaving] = React.useState(false)
  const autoSaveTimerRef = React.useRef<ReturnType<typeof setTimeout>>()

  React.useEffect(() => {
    if (autoSave && content) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
      autoSaveTimerRef.current = setTimeout(() => {
        handleSave()
      }, autoSaveDelay)
    }
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [content, autoSave, autoSaveDelay])

  const handleSave = () => {
    if (!content.trim()) return
    setIsSaving(true)
    onSave(content, title || undefined)
    setLastSaved(new Date())
    setTimeout(() => setIsSaving(false), 500)
  }

  const handleSend = () => {
    if (!content.trim() || !onSend) return
    onSend(content)
    setContent('')
    setTitle('')
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Draft title (optional)"
            className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isSaving && (
              <span className="flex items-center gap-1">
                <Save className="h-3 w-3 animate-pulse" />
                Saving...
              </span>
            )}
            {lastSaved && !isSaving && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Saved {formatRelativeTime(lastSaved)}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="min-h-[150px] resize-none"
        />
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {content.length} characters
          </div>
          <div className="flex items-center gap-2">
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            {onSend && (
              <Button size="sm" onClick={handleSend} disabled={!content.trim()}>
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Draft List Component
interface DraftListProps {
  drafts: MessageDraft[]
  onSelect: (draft: MessageDraft) => void
  onDelete: (id: string) => void
  onStar?: (id: string) => void
  onDuplicate?: (draft: MessageDraft) => void
  selectedId?: string
  className?: string
}

export function DraftList({
  drafts,
  onSelect,
  onDelete,
  onStar,
  onDuplicate,
  selectedId,
  className,
}: DraftListProps) {
  const sortedDrafts = [...drafts].sort((a, b) => {
    if (a.starred && !b.starred) return -1
    if (!a.starred && b.starred) return 1
    return b.updatedAt.getTime() - a.updatedAt.getTime()
  })

  if (drafts.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-12 text-center',
          className
        )}
      >
        <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <p className="text-sm font-medium">No drafts yet</p>
        <p className="text-xs text-muted-foreground">
          Your saved drafts will appear here
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {sortedDrafts.map((draft) => (
        <DraftCard
          key={draft.id}
          draft={draft}
          isSelected={selectedId === draft.id}
          onSelect={() => onSelect(draft)}
          onDelete={() => onDelete(draft.id)}
          onStar={onStar ? () => onStar(draft.id) : undefined}
          onDuplicate={onDuplicate ? () => onDuplicate(draft) : undefined}
        />
      ))}
    </div>
  )
}

// Draft Card Component
interface DraftCardProps {
  draft: MessageDraft
  isSelected?: boolean
  onSelect: () => void
  onDelete: () => void
  onStar?: () => void
  onDuplicate?: () => void
}

function DraftCard({
  draft,
  isSelected,
  onSelect,
  onDelete,
  onStar,
  onDuplicate,
}: DraftCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-colors hover:bg-muted/50',
        isSelected && 'border-accent bg-accent/5'
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {draft.starred && (
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              )}
              <h4 className="truncate text-sm font-medium">
                {draft.title || 'Untitled Draft'}
              </h4>
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {draft.content}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(draft.updatedAt)}
              </span>
              {draft.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSelect}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {onDuplicate && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicate()
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
              )}
              {onStar && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onStar()
                  }}
                >
                  {draft.starred ? (
                    <>
                      <StarOff className="mr-2 h-4 w-4" />
                      Unstar
                    </>
                  ) : (
                    <>
                      <Star className="mr-2 h-4 w-4" />
                      Star
                    </>
                  )}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}

// Draft Manager Component
interface DraftManagerProps {
  drafts: MessageDraft[]
  onSave: (content: string, title?: string) => void
  onUpdate: (id: string, content: string, title?: string) => void
  onDelete: (id: string) => void
  onSend?: (content: string) => void
  onStar?: (id: string) => void
  className?: string
}

export function DraftManager({
  drafts,
  onSave,
  onUpdate,
  onDelete,
  onSend,
  onStar,
  className,
}: DraftManagerProps) {
  const [selectedDraft, setSelectedDraft] = React.useState<MessageDraft | null>(
    null
  )
  const [isCreating, setIsCreating] = React.useState(false)

  const handleSave = (content: string, title?: string) => {
    if (selectedDraft) {
      onUpdate(selectedDraft.id, content, title)
    } else {
      onSave(content, title)
      setIsCreating(false)
    }
  }

  const handleDuplicate = (draft: MessageDraft) => {
    onSave(draft.content, `${draft.title || 'Untitled'} (Copy)`)
  }

  return (
    <div className={cn('flex h-full gap-4', className)}>
      {/* Draft List */}
      <div className="w-80 flex-shrink-0 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Drafts</h3>
          <Button
            size="sm"
            onClick={() => {
              setSelectedDraft(null)
              setIsCreating(true)
            }}
          >
            New Draft
          </Button>
        </div>
        <DraftList
          drafts={drafts}
          selectedId={selectedDraft?.id}
          onSelect={(draft) => {
            setSelectedDraft(draft)
            setIsCreating(false)
          }}
          onDelete={onDelete}
          onStar={onStar}
          onDuplicate={handleDuplicate}
        />
      </div>

      {/* Draft Editor */}
      <div className="flex-1">
        {selectedDraft || isCreating ? (
          <DraftEditor
            draft={selectedDraft || undefined}
            onSave={handleSave}
            onSend={onSend}
            onCancel={() => {
              setSelectedDraft(null)
              setIsCreating(false)
            }}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <FolderOpen className="mb-4 h-16 w-16 text-muted-foreground/30" />
            <p className="text-lg font-medium">Select a draft to edit</p>
            <p className="text-sm text-muted-foreground">
              Or create a new draft to get started
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Draft Indicator Component
interface DraftIndicatorProps {
  hasDraft?: boolean
  lastSaved?: Date
  onClick?: () => void
  className?: string
}

export function DraftIndicator({
  hasDraft,
  lastSaved,
  onClick,
  className,
}: DraftIndicatorProps) {
  if (!hasDraft) return null

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn('h-auto gap-2 px-2 py-1 text-xs', className)}
    >
      <FileText className="h-3 w-3" />
      <span>Draft saved</span>
      {lastSaved && (
        <span className="text-muted-foreground">
          {formatRelativeTime(lastSaved)}
        </span>
      )}
    </Button>
  )
}

// Auto-save Draft Hook
export function useAutoDraft(
  key: string,
  initialContent: string = '',
  delay: number = 2000
) {
  const [content, setContent] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`draft-${key}`)
      return saved || initialContent
    }
    return initialContent
  })
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (content) {
        localStorage.setItem(`draft-${key}`, content)
        setLastSaved(new Date())
      }
    }, delay)
    return () => clearTimeout(timer)
  }, [content, key, delay])

  const clearDraft = React.useCallback(() => {
    localStorage.removeItem(`draft-${key}`)
    setContent('')
    setLastSaved(null)
  }, [key])

  return { content, setContent, lastSaved, clearDraft }
}

// Helper function
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}
