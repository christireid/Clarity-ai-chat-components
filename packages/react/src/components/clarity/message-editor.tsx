'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import { Check, X, CornerDownLeft } from 'lucide-react'

// =============================================================================
// MESSAGE EDITOR - Inline message editing
// =============================================================================

interface MessageEditorProps {
  initialContent: string
  onSave: (content: string) => void
  onCancel: () => void
  placeholder?: string
  minHeight?: number
  maxHeight?: number
  autoFocus?: boolean
  showCharCount?: boolean
  maxChars?: number
  className?: string
}

export function MessageEditor({
  initialContent,
  onSave,
  onCancel,
  placeholder = 'Edit your message...',
  minHeight = 80,
  maxHeight = 300,
  autoFocus = true,
  showCharCount = false,
  maxChars,
  className,
}: MessageEditorProps) {
  const [content, setContent] = React.useState(initialContent)
  const [isSaving, setIsSaving] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
      // Move cursor to end
      textareaRef.current.setSelectionRange(content.length, content.length)
    }
  }, [autoFocus, content.length])

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`
    }
  }, [content, minHeight, maxHeight])

  const handleSave = async () => {
    if (!content.trim() || content === initialContent) {
      onCancel()
      return
    }
    setIsSaving(true)
    try {
      await onSave(content)
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSave()
    }
  }

  const hasChanges = content !== initialContent
  const charCount = content.length
  const isOverLimit = maxChars ? charCount > maxChars : false

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'resize-none pr-4 transition-colors',
            isOverLimit && 'border-destructive focus-visible:ring-destructive'
          )}
          style={{ minHeight, maxHeight }}
          disabled={isSaving}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="h-3 w-3" />
            {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Enter to save
          </span>
          <span>·</span>
          <span>Esc to cancel</span>
        </div>

        <div className="flex items-center gap-2">
          {showCharCount && (
            <span
              className={cn(
                'text-xs tabular-nums',
                isOverLimit ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
              {charCount}
              {maxChars && `/${maxChars}`}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSaving}
            className="h-8"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || isOverLimit || isSaving}
            className="h-8"
          >
            {isSaving ? (
              'Saving...'
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// EDITABLE MESSAGE - Message with edit mode toggle
// =============================================================================

interface EditableMessageProps {
  id: string
  content: string
  onEdit: (id: string, newContent: string) => Promise<void>
  isEditing?: boolean
  onEditingChange?: (isEditing: boolean) => void
  renderContent: (content: string) => React.ReactNode
  className?: string
}

export function EditableMessage({
  id,
  content,
  onEdit,
  isEditing: controlledIsEditing,
  onEditingChange,
  renderContent,
  className,
}: EditableMessageProps) {
  const [internalIsEditing, setInternalIsEditing] = React.useState(false)

  const isEditing =
    controlledIsEditing !== undefined ? controlledIsEditing : internalIsEditing
  const setIsEditing = onEditingChange || setInternalIsEditing

  const handleSave = async (newContent: string) => {
    await onEdit(id, newContent)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <MessageEditor
        initialContent={content}
        onSave={handleSave}
        onCancel={handleCancel}
        className={className}
      />
    )
  }

  return <div className={className}>{renderContent(content)}</div>
}

// =============================================================================
// EDIT HISTORY - Show message edit history
// =============================================================================

interface EditHistoryItem {
  id: string
  content: string
  editedAt: Date
  editedBy?: string
}

interface EditHistoryProps {
  history: EditHistoryItem[]
  currentContent: string
  onRestore?: (content: string) => void
  className?: string
}

export function EditHistory({
  history,
  currentContent,
  onRestore,
  className,
}: EditHistoryProps) {
  const [selectedVersion, setSelectedVersion] = React.useState<string | null>(
    null
  )

  if (history.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-3', className)}>
      <h4 className="text-sm font-medium">Edit History</h4>
      <div className="space-y-2">
        {/* Current version */}
        <div
          className={cn(
            'p-3 rounded-lg border cursor-pointer transition-colors',
            selectedVersion === null
              ? 'border-primary bg-primary/5'
              : 'border-border hover:bg-muted'
          )}
          onClick={() => setSelectedVersion(null)}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium">Current version</span>
            <span className="text-xs text-muted-foreground">Now</span>
          </div>
          <p className="text-sm line-clamp-2">{currentContent}</p>
        </div>

        {/* History items */}
        {history.map((item) => (
          <div
            key={item.id}
            className={cn(
              'p-3 rounded-lg border cursor-pointer transition-colors',
              selectedVersion === item.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:bg-muted'
            )}
            onClick={() => setSelectedVersion(item.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">
                {item.editedBy || 'Edited'}
              </span>
              <span className="text-xs text-muted-foreground">
                {item.editedAt.toLocaleString()}
              </span>
            </div>
            <p className="text-sm line-clamp-2">{item.content}</p>
          </div>
        ))}
      </div>

      {/* Restore button */}
      {selectedVersion && onRestore && (
        <Button
          size="sm"
          onClick={() => {
            const item = history.find((h) => h.id === selectedVersion)
            if (item) {
              onRestore(item.content)
            }
          }}
        >
          Restore this version
        </Button>
      )}
    </div>
  )
}

// =============================================================================
// DIFF VIEW - Show changes between versions
// =============================================================================

interface DiffViewProps {
  oldContent: string
  newContent: string
  showLineNumbers?: boolean
  className?: string
}

export function DiffView({
  oldContent,
  newContent,
  showLineNumbers = true,
  className,
}: DiffViewProps) {
  const oldLines = oldContent.split('\n')
  const newLines = newContent.split('\n')

  // Simple diff - just highlight changed lines
  const maxLines = Math.max(oldLines.length, newLines.length)

  const lines = React.useMemo(() => {
    const result: {
      type: 'same' | 'added' | 'removed' | 'changed'
      old?: string
      new?: string
      lineNumber: number
    }[] = []

    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i]
      const newLine = newLines[i]

      if (oldLine === newLine) {
        result.push({
          type: 'same',
          old: oldLine,
          new: newLine,
          lineNumber: i + 1,
        })
      } else if (oldLine === undefined) {
        result.push({ type: 'added', new: newLine, lineNumber: i + 1 })
      } else if (newLine === undefined) {
        result.push({ type: 'removed', old: oldLine, lineNumber: i + 1 })
      } else {
        result.push({
          type: 'changed',
          old: oldLine,
          new: newLine,
          lineNumber: i + 1,
        })
      }
    }

    return result
  }, [oldLines, newLines, maxLines])

  return (
    <div
      className={cn(
        'font-mono text-sm rounded-lg border border-border overflow-hidden',
        className
      )}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className={cn(
            'flex',
            line.type === 'added' && 'bg-green-500/10',
            line.type === 'removed' && 'bg-red-500/10',
            line.type === 'changed' && 'bg-yellow-500/10'
          )}
        >
          {showLineNumbers && (
            <span className="w-10 px-2 py-1 text-right text-muted-foreground bg-muted/50 border-r border-border select-none">
              {line.lineNumber}
            </span>
          )}
          <span className="w-6 text-center py-1 border-r border-border select-none">
            {line.type === 'added' && <span className="text-green-600">+</span>}
            {line.type === 'removed' && <span className="text-red-600">-</span>}
            {line.type === 'changed' && (
              <span className="text-yellow-600">~</span>
            )}
          </span>
          <span className="flex-1 px-3 py-1 whitespace-pre-wrap break-all">
            {line.type === 'removed' || line.type === 'changed' ? (
              <span
                className={
                  line.type === 'changed' ? 'line-through text-red-600/70' : ''
                }
              >
                {line.old}
              </span>
            ) : null}
            {line.type === 'changed' && ' '}
            {line.type === 'added' || line.type === 'changed' ? (
              <span className={line.type === 'changed' ? 'text-green-600' : ''}>
                {line.new}
              </span>
            ) : null}
            {line.type === 'same' && line.old}
          </span>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// INLINE EDIT BUTTON - Trigger for editing
// =============================================================================

interface InlineEditButtonProps {
  onClick: () => void
  className?: string
}

export function InlineEditButton({
  onClick,
  className,
}: InlineEditButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        'h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity',
        className
      )}
    >
      Edit
    </Button>
  )
}
