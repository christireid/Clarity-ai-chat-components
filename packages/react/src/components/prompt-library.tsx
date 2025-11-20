'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Badge,
  ScrollArea,
  Textarea,
  cn,
} from '@clarity-chat/primitives'
import type { SavedPrompt, PromptCategory } from '@clarity-chat/types'

export interface PromptLibraryProps {
  prompts: SavedPrompt[]
  categories?: PromptCategory[]
  onUsePrompt: (prompt: SavedPrompt) => void
  onSave?: (prompt: Omit<SavedPrompt, 'id' | 'createdAt' | 'updatedAt'>) => void
  onEdit?: (promptId: string, updates: Partial<SavedPrompt>) => void
  onDelete?: (promptId: string) => void
  onToggleFavorite?: (promptId: string) => void
  className?: string
}

export function PromptLibrary({
  prompts,
  categories = [],
  onUsePrompt,
  onSave,
  onEdit,
  onDelete,
  onToggleFavorite,
  className,
}: PromptLibraryProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<
    string | 'all'
  >('all')
  const [showCreate, setShowCreate] = React.useState(false)
  const [editingPrompt, setEditingPrompt] = React.useState<SavedPrompt | null>(
    null
  )
  const [sortBy, setSortBy] = React.useState<'name' | 'usage' | 'recent'>(
    'recent'
  )

  // Create form state
  const [newPrompt, setNewPrompt] = React.useState({
    name: '',
    content: '',
    description: '',
    category: '',
    tags: [] as string[],
  })

  // Edit form state
  const [editForm, setEditForm] = React.useState({
    name: '',
    content: '',
    description: '',
    category: '',
    tags: [] as string[],
  })

  const filteredPrompts = React.useMemo(() => {
    let filtered = prompts

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.content.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'usage') return b.usageCount - a.usageCount
      if (sortBy === 'recent') {
        if (!a.lastUsed && !b.lastUsed) return 0
        if (!a.lastUsed) return 1
        if (!b.lastUsed) return -1
        return b.lastUsed.getTime() - a.lastUsed.getTime()
      }
      return 0
    })

    return filtered
  }, [prompts, searchQuery, selectedCategory, sortBy])

  const categoryStats = React.useMemo(() => {
    const stats: Record<string, number> = {}
    prompts.forEach((p) => {
      const cat = p.category || 'uncategorized'
      stats[cat] = (stats[cat] || 0) + 1
    })
    return stats
  }, [prompts])

  const handleSavePrompt = () => {
    if (!newPrompt.name || !newPrompt.content) return

    onSave?.({
      userId: '', // Will be set by parent
      name: newPrompt.name,
      content: newPrompt.content,
      description: newPrompt.description,
      category: newPrompt.category,
      tags: newPrompt.tags,
      variables: [],
      usageCount: 0,
      isFavorite: false,
    })

    setNewPrompt({
      name: '',
      content: '',
      description: '',
      category: '',
      tags: [],
    })
    setShowCreate(false)
  }

  const handleEditPrompt = (prompt: SavedPrompt) => {
    setEditingPrompt(prompt)
    setEditForm({
      name: prompt.name,
      content: prompt.content,
      description: prompt.description || '',
      category: prompt.category || '',
      tags: prompt.tags || [],
    })
    setShowCreate(false) // Close create form if open
  }

  const handleSaveEdit = () => {
    if (!editingPrompt || !editForm.name || !editForm.content) return

    onEdit?.(editingPrompt.id, {
      name: editForm.name,
      content: editForm.content,
      description: editForm.description,
      category: editForm.category,
      tags: editForm.tags,
    })

    setEditingPrompt(null)
    setEditForm({
      name: '',
      content: '',
      description: '',
      category: '',
      tags: [],
    })
  }

  const handleCancelEdit = () => {
    setEditingPrompt(null)
    setEditForm({
      name: '',
      content: '',
      description: '',
      category: '',
      tags: [],
    })
  }

  const favorites = prompts.filter((p) => p.isFavorite)

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Prompt Library
              <Badge variant="secondary">{prompts.length}</Badge>
            </CardTitle>
            <CardDescription>
              {favorites.length} favorites •{' '}
              {prompts.reduce((sum, p) => sum + p.usageCount, 0)} total uses
            </CardDescription>
          </div>
          {onSave && (
            <Button onClick={() => setShowCreate(!showCreate)} size="sm">
              {showCreate ? '✕ Cancel' : '+ New Prompt'}
            </Button>
          )}
        </div>

        {/* Search & Filters */}
        <div className="space-y-2 mt-4">
          <Input
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<span>🔍</span>}
            iconPosition="left"
          />

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'name' | 'usage' | 'recent')
              }
              className="text-sm border rounded px-2 py-1 bg-background"
            >
              <option value="recent">Recently Used</option>
              <option value="name">Name</option>
              <option value="usage">Most Used</option>
            </select>

            <div className="flex flex-wrap gap-1 flex-1">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All ({prompts.length})
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={
                    selectedCategory === cat.name ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  {cat.icon} {cat.name} ({categoryStats[cat.name] || 0})
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        {/* Create Prompt Form */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 border rounded-lg space-y-3"
            >
              <h3 className="font-semibold text-sm">Create New Prompt</h3>
              <Input
                placeholder="Prompt name"
                value={newPrompt.name}
                onChange={(e) =>
                  setNewPrompt({ ...newPrompt, name: e.target.value })
                }
              />
              <Textarea
                placeholder="Prompt content... Use {{variable}} for variables"
                value={newPrompt.content}
                onChange={(e) =>
                  setNewPrompt({ ...newPrompt, content: e.target.value })
                }
                rows={4}
              />
              <Input
                placeholder="Description (optional)"
                value={newPrompt.description}
                onChange={(e) =>
                  setNewPrompt({ ...newPrompt, description: e.target.value })
                }
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSavePrompt}
                  disabled={!newPrompt.name || !newPrompt.content}
                >
                  Save Prompt
                </Button>
                <Button variant="outline" onClick={() => setShowCreate(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Prompt Form */}
        <AnimatePresence>
          {editingPrompt && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 border border-primary rounded-lg space-y-3 bg-primary/5"
            >
              <h3 className="font-semibold text-sm flex items-center gap-2">
                ✏️ Edit Prompt: {editingPrompt.name}
              </h3>
              <Input
                placeholder="Prompt name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
              <Textarea
                placeholder="Prompt content... Use {{variable}} for variables"
                value={editForm.content}
                onChange={(e) =>
                  setEditForm({ ...editForm, content: e.target.value })
                }
                rows={4}
              />
              <Input
                placeholder="Description (optional)"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveEdit}
                  disabled={!editForm.name || !editForm.content}
                >
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prompts List */}
        <ScrollArea className="h-full">
          {filteredPrompts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-6xl mb-4">💡</div>
              <p className="text-sm font-medium">No prompts found</p>
              <p className="text-xs text-muted-foreground mt-1">
                {searchQuery
                  ? 'Try a different search'
                  : 'Create your first prompt to get started'}
              </p>
              {!searchQuery && onSave && (
                <Button
                  onClick={() => setShowCreate(true)}
                  className="mt-4"
                  size="sm"
                >
                  Create First Prompt
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2 pb-4">
              <AnimatePresence>
                {filteredPrompts.map((prompt) => (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <Card className="group hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] transition-shadow duration-150 ease-out">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm">
                                  {prompt.name}
                                </h4>
                                {prompt.isFavorite && (
                                  <span className="text-sm">⭐</span>
                                )}
                              </div>
                              {prompt.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {prompt.description}
                                </p>
                              )}
                            </div>
                            <Badge
                              variant="outline"
                              className="flex-shrink-0 text-xs"
                            >
                              {prompt.usageCount} uses
                            </Badge>
                          </div>

                          {/* Content Preview */}
                          <p className="text-sm bg-muted/50 p-2 rounded text-muted-foreground line-clamp-2">
                            {prompt.content}
                          </p>

                          {/* Tags */}
                          {prompt.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {prompt.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              onClick={() => onUsePrompt(prompt)}
                            >
                              Use Prompt
                            </Button>
                            {onToggleFavorite && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onToggleFavorite(prompt.id)}
                              >
                                {prompt.isFavorite
                                  ? '⭐ Unfavorite'
                                  : '☆ Favorite'}
                              </Button>
                            )}
                            {onEdit && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditPrompt(prompt)}
                              >
                                ✏️ Edit
                              </Button>
                            )}
                            {onDelete && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (
                                    confirm(`Delete prompt "${prompt.name}"?`)
                                  ) {
                                    onDelete(prompt.id)
                                  }
                                }}
                                className="ml-auto text-destructive"
                              >
                                🗑️ Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

PromptLibrary.displayName = 'PromptLibrary'
