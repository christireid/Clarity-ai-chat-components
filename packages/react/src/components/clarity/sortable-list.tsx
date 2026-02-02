'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  MoreHorizontal,
  Edit2,
  Copy,
  Check,
  X,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'

// Types
export interface SortableItem {
  id: string
  content: React.ReactNode
  data?: Record<string, unknown>
}

// Sortable List
export interface SortableListProps {
  items: SortableItem[]
  onReorder: (items: SortableItem[]) => void
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
  onDuplicate?: (id: string) => void
  renderItem?: (item: SortableItem, index: number) => React.ReactNode
  className?: string
}

export function SortableList({
  items,
  onReorder,
  onDelete,
  onEdit,
  onDuplicate,
  renderItem,
  className,
}: SortableListProps) {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newItems = [...items]
    const [removed] = newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, removed)
    onReorder(newItems)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const moveItem = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
    if (toIndex < 0 || toIndex >= items.length) return

    const newItems = [...items]
    const [removed] = newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, removed)
    onReorder(newItems)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={() => handleDrop(index)}
          onDragEnd={() => {
            setDraggedIndex(null)
            setDragOverIndex(null)
          }}
          className={cn(
            'flex items-center gap-2 p-3 bg-card border border-border rounded-lg',
            'transition-all cursor-move',
            draggedIndex === index && 'opacity-50',
            dragOverIndex === index && draggedIndex !== index && 'border-accent'
          )}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />

          <div className="flex-1 min-w-0">
            {renderItem ? renderItem(item, index) : item.content}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => moveItem(index, 'up')}
              disabled={index === 0}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => moveItem(index, 'down')}
              disabled={index === items.length - 1}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>

            {(onDelete || onEdit || onDuplicate) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(item.id)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDuplicate && (
                    <DropdownMenuItem onClick={() => onDuplicate(item.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(item.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// Priority List
export interface PriorityItem {
  id: string
  title: string
  priority: 'high' | 'medium' | 'low'
  completed?: boolean
}

export interface PriorityListProps {
  items: PriorityItem[]
  onReorder: (items: PriorityItem[]) => void
  onToggle?: (id: string) => void
  onDelete?: (id: string) => void
  className?: string
}

export function PriorityList({
  items,
  onReorder,
  onToggle,
  onDelete,
  className,
}: PriorityListProps) {
  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  }

  return (
    <SortableList
      items={items.map((item) => ({
        id: item.id,
        content: (
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                priorityColors[item.priority]
              )}
            />
            {onToggle && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggle(item.id)
                }}
                className={cn(
                  'h-5 w-5 rounded border flex items-center justify-center',
                  item.completed
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border'
                )}
              >
                {item.completed && <Check className="h-3 w-3" />}
              </button>
            )}
            <span
              className={cn(
                item.completed && 'line-through text-muted-foreground'
              )}
            >
              {item.title}
            </span>
          </div>
        ),
        data: item,
      }))}
      onReorder={(newItems) =>
        onReorder(newItems.map((item) => item.data as PriorityItem))
      }
      onDelete={onDelete}
      className={className}
    />
  )
}

// Editable List
export interface EditableListProps {
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  maxItems?: number
  className?: string
}

export function EditableList({
  items,
  onChange,
  placeholder = 'Add item...',
  maxItems,
  className,
}: EditableListProps) {
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null)
  const [editValue, setEditValue] = React.useState('')
  const [newItem, setNewItem] = React.useState('')

  const handleAdd = () => {
    if (!newItem.trim() || (maxItems && items.length >= maxItems)) return
    onChange([...items, newItem.trim()])
    setNewItem('')
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditValue(items[index])
  }

  const handleSaveEdit = () => {
    if (editingIndex === null || !editValue.trim()) return
    const newItems = [...items]
    newItems[editingIndex] = editValue.trim()
    onChange(newItems)
    setEditingIndex(null)
    setEditValue('')
  }

  const handleDelete = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const handleReorder = (newItems: SortableItem[]) => {
    onChange(newItems.map((item) => item.content as string))
  }

  return (
    <div className={cn('space-y-3', className)}>
      <SortableList
        items={items.map((item, index) => ({
          id: String(index),
          content:
            editingIndex === index ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-8"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit()
                    if (e.key === 'Escape') setEditingIndex(null)
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleSaveEdit}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setEditingIndex(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <span className="truncate">{item}</span>
            ),
        }))}
        onReorder={handleReorder}
        onEdit={(id) => handleEdit(Number(id))}
        onDelete={(id) => handleDelete(Number(id))}
      />

      {(!maxItems || items.length < maxItems) && (
        <div className="flex items-center gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleAdd}
            disabled={!newItem.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {maxItems && (
        <p className="text-xs text-muted-foreground">
          {items.length} / {maxItems} items
        </p>
      )}
    </div>
  )
}

// Numbered List
export interface NumberedListProps {
  items: string[]
  onReorder?: (items: string[]) => void
  className?: string
}

export function NumberedList({
  items,
  onReorder,
  className,
}: NumberedListProps) {
  if (!onReorder) {
    return (
      <ol className={cn('space-y-2', className)}>
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-sm font-medium shrink-0">
              {index + 1}
            </span>
            <span className="pt-0.5">{item}</span>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <SortableList
      items={items.map((item, index) => ({
        id: String(index),
        content: (
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-sm font-medium shrink-0">
              {index + 1}
            </span>
            <span className="pt-0.5">{item}</span>
          </div>
        ),
      }))}
      onReorder={(newItems) => onReorder(newItems.map((_, i) => items[i]))}
      className={className}
    />
  )
}

// Kanban-style Column List
export interface KanbanItem {
  id: string
  title: string
  description?: string
}

export interface KanbanColumnProps {
  title: string
  items: KanbanItem[]
  onReorder: (items: KanbanItem[]) => void
  onAdd?: () => void
  className?: string
}

export function KanbanColumn({
  title,
  items,
  onReorder,
  onAdd,
  className,
}: KanbanColumnProps) {
  return (
    <div className={cn('bg-muted/50 rounded-lg p-3', className)}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sm">{title}</h4>
        <span className="text-xs text-muted-foreground">{items.length}</span>
      </div>

      <SortableList
        items={items.map((item) => ({
          id: item.id,
          content: (
            <div>
              <p className="font-medium text-sm">{item.title}</p>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          ),
          data: item,
        }))}
        onReorder={(newItems) =>
          onReorder(newItems.map((item) => item.data as KanbanItem))
        }
      />

      {onAdd && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onAdd}
          className="w-full mt-2 justify-start text-muted-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add item
        </Button>
      )}
    </div>
  )
}
