'use client'

import * as React from 'react'
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Copy,
  Star,
  StarOff,
  Tag,
  Clock,
  ChevronRight,
  FolderOpen,
  FileText,
  MoreHorizontal,
  Download,
  Upload,
  Filter,
  SortAsc,
  SortDesc,
  X,
} from 'lucide-react'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'

export interface PromptTemplate {
  id: string
  name: string
  content: string
  description?: string
  category?: string
  tags?: string[]
  variables?: string[]
  isFavorite?: boolean
  usageCount?: number
  createdAt?: Date
  updatedAt?: Date
}

interface PromptManagerProps {
  prompts: PromptTemplate[]
  onSelect?: (prompt: PromptTemplate) => void
  onSave?: (prompt: PromptTemplate) => void
  onDelete?: (id: string) => void
  onDuplicate?: (prompt: PromptTemplate) => void
  onToggleFavorite?: (id: string) => void
  onImport?: (prompts: PromptTemplate[]) => void
  onExport?: (prompts: PromptTemplate[]) => void
  className?: string
}

export function PromptManager({
  prompts,
  onSelect,
  onSave,
  onDelete,
  onDuplicate,
  onToggleFavorite,
  onImport,
  onExport,
  className,
}: PromptManagerProps) {
  const [search, setSearch] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  )
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])
  const [sortBy, setSortBy] = React.useState<'name' | 'date' | 'usage'>('date')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')
  const [isEditorOpen, setIsEditorOpen] = React.useState(false)
  const [editingPrompt, setEditingPrompt] =
    React.useState<PromptTemplate | null>(null)
  const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false)

  const categories = React.useMemo(() => {
    const cats = new Set<string>()
    prompts.forEach((p) => p.category && cats.add(p.category))
    return Array.from(cats)
  }, [prompts])

  const allTags = React.useMemo(() => {
    const tags = new Set<string>()
    prompts.forEach((p) => p.tags?.forEach((t) => tags.add(t)))
    return Array.from(tags)
  }, [prompts])

  const filteredPrompts = React.useMemo(() => {
    let result = [...prompts]

    if (search) {
      const lowerSearch = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerSearch) ||
          p.content.toLowerCase().includes(lowerSearch) ||
          p.description?.toLowerCase().includes(lowerSearch)
      )
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory)
    }

    if (selectedTags.length > 0) {
      result = result.filter((p) =>
        selectedTags.some((t) => p.tags?.includes(t))
      )
    }

    if (showFavoritesOnly) {
      result = result.filter((p) => p.isFavorite)
    }

    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'date':
          comparison =
            (a.updatedAt?.getTime() || 0) - (b.updatedAt?.getTime() || 0)
          break
        case 'usage':
          comparison = (a.usageCount || 0) - (b.usageCount || 0)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [
    prompts,
    search,
    selectedCategory,
    selectedTags,
    showFavoritesOnly,
    sortBy,
    sortOrder,
  ])

  const handleNewPrompt = () => {
    setEditingPrompt({
      id: crypto.randomUUID(),
      name: '',
      content: '',
      tags: [],
      variables: [],
    })
    setIsEditorOpen(true)
  }

  const handleEditPrompt = (prompt: PromptTemplate) => {
    setEditingPrompt({ ...prompt })
    setIsEditorOpen(true)
  }

  const handleSavePrompt = () => {
    if (editingPrompt && onSave) {
      onSave({
        ...editingPrompt,
        updatedAt: new Date(),
        createdAt: editingPrompt.createdAt || new Date(),
      })
    }
    setIsEditorOpen(false)
    setEditingPrompt(null)
  }

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-lg font-semibold">Prompt Library</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport?.(filteredPrompts)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => onImport?.([])}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button size="sm" onClick={handleNewPrompt}>
            <Plus className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 border-b border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {selectedCategory || 'All Categories'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {sortOrder === 'asc' ? (
                  <SortAsc className="mr-2 h-4 w-4" />
                ) : (
                  <SortDesc className="mr-2 h-4 w-4" />
                )}
                Sort by {sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('date')}>
                Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('usage')}>
                Usage
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOrder('asc')}>
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('desc')}>
                Descending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={showFavoritesOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <Star className="mr-2 h-4 w-4" />
            Favorites
          </Button>
        </div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {allTags.slice(0, 10).map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() =>
                  setSelectedTags((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  )
                }
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Prompt List */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onSelect={() => onSelect?.(prompt)}
              onEdit={() => handleEditPrompt(prompt)}
              onDelete={() => onDelete?.(prompt.id)}
              onDuplicate={() => onDuplicate?.(prompt)}
              onToggleFavorite={() => onToggleFavorite?.(prompt.id)}
            />
          ))}
          {filteredPrompts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText className="mb-4 h-12 w-12" />
              <p>No prompts found</p>
              <Button variant="link" onClick={handleNewPrompt}>
                Create your first prompt
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Prompt Editor Dialog */}
      <PromptEditor
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        prompt={editingPrompt}
        onPromptChange={setEditingPrompt}
        onSave={handleSavePrompt}
        categories={categories}
        allTags={allTags}
      />
    </div>
  )
}

interface PromptCardProps {
  prompt: PromptTemplate
  onSelect?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onToggleFavorite?: () => void
}

function PromptCard({
  prompt,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleFavorite,
}: PromptCardProps) {
  return (
    <div
      className="group flex cursor-pointer items-start gap-4 p-4 transition-colors hover:bg-muted/50"
      onClick={onSelect}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium truncate">{prompt.name}</h3>
          {prompt.isFavorite && (
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          )}
        </div>
        {prompt.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {prompt.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {prompt.category && (
            <Badge variant="secondary" className="text-xs">
              <FolderOpen className="mr-1 h-3 w-3" />
              {prompt.category}
            </Badge>
          )}
          {prompt.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </Badge>
          ))}
          {prompt.variables && prompt.variables.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {prompt.variables.length} variables
            </Badge>
          )}
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          {prompt.usageCount !== undefined && (
            <span>Used {prompt.usageCount} times</span>
          )}
          {prompt.updatedAt && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {prompt.updatedAt.toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite?.()
          }}
        >
          {prompt.isFavorite ? (
            <StarOff className="h-4 w-4" />
          ) : (
            <Star className="h-4 w-4" />
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}

interface PromptEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prompt: PromptTemplate | null
  onPromptChange: (prompt: PromptTemplate | null) => void
  onSave: () => void
  categories: string[]
  allTags: string[]
}

function PromptEditor({
  open,
  onOpenChange,
  prompt,
  onPromptChange,
  onSave,
  categories,
  allTags,
}: PromptEditorProps) {
  const [newTag, setNewTag] = React.useState('')
  const detectedVariables = prompt
    ? [
        ...new Set(
          prompt.content.match(/\{\{(\w+)\}\}/g)?.map((m) => m.slice(2, -2))
        ),
      ]
    : []

  const addTag = () => {
    if (newTag && prompt && !prompt.tags?.includes(newTag)) {
      onPromptChange({
        ...prompt,
        tags: [...(prompt.tags || []), newTag],
      })
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    if (prompt) {
      onPromptChange({
        ...prompt,
        tags: prompt.tags?.filter((t) => t !== tag),
      })
    }
  }

  if (!prompt) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {prompt.createdAt ? 'Edit Prompt' : 'New Prompt'}
          </DialogTitle>
          <DialogDescription>
            Create a reusable prompt template with variables
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={prompt.name}
              onChange={(e) =>
                onPromptChange({ ...prompt, name: e.target.value })
              }
              placeholder="My Prompt Template"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={prompt.description || ''}
              onChange={(e) =>
                onPromptChange({ ...prompt, description: e.target.value })
              }
              placeholder="What does this prompt do?"
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Input
              value={prompt.category || ''}
              onChange={(e) =>
                onPromptChange({ ...prompt, category: e.target.value })
              }
              placeholder="e.g., Writing, Coding, Analysis"
              list="categories"
            />
            <datalist id="categories">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), addTag())
                }
                placeholder="Add a tag"
                list="tags"
              />
              <Button type="button" onClick={addTag}>
                Add
              </Button>
            </div>
            <datalist id="tags">
              {allTags.map((tag) => (
                <option key={tag} value={tag} />
              ))}
            </datalist>
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {prompt.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                      type="button"
                      className="ml-1 hover:text-destructive"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Prompt Content</Label>
              <span className="text-xs text-muted-foreground">
                Use {'{{variable}}'} for dynamic values
              </span>
            </div>
            <Textarea
              value={prompt.content}
              onChange={(e) =>
                onPromptChange({ ...prompt, content: e.target.value })
              }
              placeholder="Enter your prompt template..."
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          {detectedVariables.length > 0 && (
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <Label className="text-sm">Detected Variables</Label>
              <div className="mt-2 flex flex-wrap gap-1">
                {detectedVariables.map((variable) => (
                  <Badge key={variable} variant="outline">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!prompt.name || !prompt.content}>
            Save Prompt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Token Counter Component
interface TokenCounterProps {
  text: string
  maxTokens?: number
  className?: string
}

export function TokenCounter({
  text,
  maxTokens = 4096,
  className,
}: TokenCounterProps) {
  // Simple token estimation (roughly 4 chars per token)
  const estimatedTokens = Math.ceil(text.length / 4)
  const percentage = (estimatedTokens / maxTokens) * 100

  return (
    <div className={cn('flex items-center gap-2 text-xs', className)}>
      <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            'h-full transition-all',
            percentage > 90
              ? 'bg-destructive'
              : percentage > 70
                ? 'bg-yellow-500'
                : 'bg-accent'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span className="text-muted-foreground">
        ~{estimatedTokens.toLocaleString()} / {maxTokens.toLocaleString()}{' '}
        tokens
      </span>
    </div>
  )
}

// Prompt Input with Variable Injection
interface PromptInputProps {
  template: PromptTemplate
  variables: Record<string, string>
  onVariablesChange: (variables: Record<string, string>) => void
  onSubmit?: (prompt: string) => void
  className?: string
}

export function PromptInput({
  template,
  variables,
  onVariablesChange,
  onSubmit,
  className,
}: PromptInputProps) {
  const detectedVariables = React.useMemo(() => {
    const matches = template.content.match(/\{\{(\w+)\}\}/g) || []
    return [...new Set(matches.map((m) => m.slice(2, -2)))]
  }, [template.content])

  const renderedPrompt = React.useMemo(() => {
    let result = template.content
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(
        new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
        value || `{{${key}}}`
      )
    }
    return result
  }, [template.content, variables])

  const allVariablesFilled = detectedVariables.every((v) =>
    variables[v]?.trim()
  )

  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <h4 className="font-medium mb-2">{template.name}</h4>
        {template.description && (
          <p className="text-sm text-muted-foreground mb-4">
            {template.description}
          </p>
        )}

        {detectedVariables.length > 0 && (
          <div className="space-y-3">
            {detectedVariables.map((variable) => (
              <div key={variable} className="space-y-1">
                <Label className="text-sm capitalize">
                  {variable.replace(/_/g, ' ')}
                </Label>
                <Input
                  value={variables[variable] || ''}
                  onChange={(e) =>
                    onVariablesChange({
                      ...variables,
                      [variable]: e.target.value,
                    })
                  }
                  placeholder={`Enter ${variable}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Preview</Label>
        <div className="rounded-lg border border-border bg-background p-4 text-sm whitespace-pre-wrap">
          {renderedPrompt}
        </div>
        <TokenCounter text={renderedPrompt} />
      </div>

      <Button
        onClick={() => onSubmit?.(renderedPrompt)}
        disabled={!allVariablesFilled}
        className="w-full"
      >
        Use Prompt
      </Button>
    </div>
  )
}

// Prompt Chain Builder
interface PromptChainStep {
  id: string
  name: string
  template: string
  inputFrom?: string
  outputTo?: string
  condition?: string
}

interface PromptChainBuilderProps {
  steps: PromptChainStep[]
  onStepsChange?: (steps: PromptChainStep[]) => void
  onRun?: () => void
  isRunning?: boolean
  currentStep?: string
  className?: string
}

export function PromptChainBuilder({
  steps = [],
  onStepsChange,
  onRun,
  isRunning = false,
  currentStep,
  className,
}: PromptChainBuilderProps) {
  const [editingStep, setEditingStep] = React.useState<string | null>(null)
  const safeSteps = steps || []

  const addStep = () => {
    const newStep: PromptChainStep = {
      id: `step-${Date.now()}`,
      name: `Step ${safeSteps.length + 1}`,
      template: '',
    }
    onStepsChange?.([...safeSteps, newStep])
  }

  const updateStep = (id: string, updates: Partial<PromptChainStep>) => {
    onStepsChange?.(
      safeSteps.map((s) => (s.id === id ? { ...s, ...updates } : s))
    )
  }

  const removeStep = (id: string) => {
    onStepsChange?.(safeSteps.filter((s) => s.id !== id))
  }

  const moveStep = (id: string, direction: 'up' | 'down') => {
    const index = safeSteps.findIndex((s) => s.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === safeSteps.length - 1)
    )
      return

    const newSteps = [...safeSteps]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSteps[index], newSteps[targetIndex]] = [
      newSteps[targetIndex],
      newSteps[index],
    ]
    onStepsChange?.(newSteps)
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Prompt Chain</h3>
          <p className="text-sm text-muted-foreground">
            Build multi-step prompt workflows
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={addStep}>
            <Plus className="h-4 w-4 mr-1" />
            Add Step
          </Button>
          <Button
            size="sm"
            onClick={onRun}
            disabled={isRunning || safeSteps.length === 0}
          >
            {isRunning ? (
              <>
                <Clock className="h-4 w-4 mr-1 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <ChevronRight className="h-4 w-4 mr-1" />
                Run Chain
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {safeSteps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              'rounded-lg border border-border p-4 transition-colors',
              currentStep === step.id && 'border-primary bg-primary/5',
              editingStep === step.id && 'ring-2 ring-primary/20'
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium shrink-0',
                  currentStep === step.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                {editingStep === step.id ? (
                  <div className="space-y-3">
                    <Input
                      value={step.name}
                      onChange={(e) =>
                        updateStep(step.id, { name: e.target.value })
                      }
                      placeholder="Step name"
                    />
                    <Textarea
                      value={step.template}
                      onChange={(e) =>
                        updateStep(step.id, { template: e.target.value })
                      }
                      placeholder="Enter prompt template... Use {{variable}} for dynamic values"
                      rows={4}
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        value={step.condition || ''}
                        onChange={(e) =>
                          updateStep(step.id, { condition: e.target.value })
                        }
                        placeholder="Condition (optional)"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingStep(null)}
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{step.name}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => moveStep(step.id, 'up')}
                          disabled={index === 0}
                        >
                          <SortAsc className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => moveStep(step.id, 'down')}
                          disabled={index === safeSteps.length - 1}
                        >
                          <SortDesc className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => setEditingStep(step.id)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive"
                          onClick={() => removeStep(step.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {step.template || 'No template defined'}
                    </p>
                    {step.condition && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        Condition: {step.condition}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
            {index < safeSteps.length - 1 && (
              <div className="flex justify-center mt-3">
                <ChevronRight className="h-4 w-4 text-muted-foreground rotate-90" />
              </div>
            )}
          </div>
        ))}

        {safeSteps.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No steps yet. Add a step to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Prompt Version History
interface PromptVersion {
  id: string
  content: string
  timestamp: Date
  author?: string
  changes?: string
}

interface PromptVersionHistoryProps {
  versions: PromptVersion[]
  currentVersion?: string
  onRestore?: (version: PromptVersion) => void
  onCompare?: (v1: string, v2: string) => void
  className?: string
}

export function PromptVersionHistory({
  versions = [],
  currentVersion,
  onRestore,
  onCompare,
  className,
}: PromptVersionHistoryProps) {
  const [selectedVersions, setSelectedVersions] = React.useState<string[]>([])
  const safeVersions = versions || []

  const toggleVersion = (id: string) => {
    if (selectedVersions.includes(id)) {
      setSelectedVersions(selectedVersions.filter((v) => v !== id))
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, id])
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Version History</h3>
        {selectedVersions.length === 2 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onCompare?.(selectedVersions[0], selectedVersions[1])
            }
          >
            Compare Selected
          </Button>
        )}
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2 pr-4">
          {safeVersions.map((version, index) => (
            <div
              key={version.id}
              className={cn(
                'rounded-lg border border-border p-3 cursor-pointer transition-colors',
                currentVersion === version.id && 'border-primary bg-primary/5',
                selectedVersions.includes(version.id) &&
                  'ring-2 ring-primary/30'
              )}
              onClick={() => toggleVersion(version.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={index === 0 ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      v{safeVersions.length - index}
                    </Badge>
                    {currentVersion === version.id && (
                      <Badge variant="outline" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {version.timestamp.toLocaleString()}
                    {version.author && ` by ${version.author}`}
                  </p>
                  {version.changes && (
                    <p className="text-sm mt-2 line-clamp-2">
                      {version.changes}
                    </p>
                  )}
                </div>
                {currentVersion !== version.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRestore?.(version)
                    }}
                  >
                    Restore
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

// Prompt Testing Panel
interface PromptTestResult {
  id: string
  input: Record<string, string>
  output: string
  tokens: number
  latency: number
  timestamp: Date
  success: boolean
  error?: string
}

interface PromptTestingPanelProps {
  template: PromptTemplate
  results: PromptTestResult[]
  onRunTest?: (variables: Record<string, string>) => void
  isRunning?: boolean
  className?: string
}

export function PromptTestingPanel({
  template,
  results = [],
  onRunTest,
  isRunning = false,
  className,
}: PromptTestingPanelProps) {
  const [variables, setVariables] = React.useState<Record<string, string>>({})
  const safeTemplate = template || {
    id: '',
    name: 'Untitled',
    content: '',
    variables: [],
  }
  const safeResults = results || []

  const detectedVariables = React.useMemo(() => {
    const matches = safeTemplate.content?.match(/\{\{(\w+)\}\}/g) || []
    return [...new Set(matches.map((m) => m.slice(2, -2)))]
  }, [safeTemplate.content])

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Test Prompt</h3>
        <Button
          size="sm"
          onClick={() => onRunTest?.(variables)}
          disabled={isRunning}
        >
          {isRunning ? <Clock className="h-4 w-4 animate-spin" /> : 'Run Test'}
        </Button>
      </div>

      {detectedVariables.length > 0 && (
        <div className="grid gap-3">
          {detectedVariables.map((variable) => (
            <div key={variable} className="space-y-1">
              <Label className="text-sm capitalize">
                {variable.replace(/_/g, ' ')}
              </Label>
              <Input
                value={variables[variable] || ''}
                onChange={(e) =>
                  setVariables({ ...variables, [variable]: e.target.value })
                }
                placeholder={`Enter ${variable}`}
              />
            </div>
          ))}
        </div>
      )}

      {safeResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Results</h4>
          {safeResults.slice(0, 5).map((result) => (
            <div
              key={result.id}
              className={cn(
                'rounded-lg border p-3',
                result.success
                  ? 'border-border'
                  : 'border-destructive/50 bg-destructive/5'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <Badge
                      variant="outline"
                      className="text-green-500 border-green-500/30"
                    >
                      Success
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-destructive border-destructive/30"
                    >
                      Failed
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {result.tokens} tokens | {result.latency}ms
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {result.timestamp.toLocaleTimeString()}
                </span>
              </div>
              {result.success ? (
                <p className="text-sm line-clamp-3">{result.output}</p>
              ) : (
                <p className="text-sm text-destructive">{result.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Prompt Library Browser
interface PromptLibraryProps {
  categories: { id: string; name: string; count: number }[]
  prompts: PromptTemplate[]
  onSelectPrompt?: (prompt: PromptTemplate) => void
  onSelectCategory?: (categoryId: string) => void
  selectedCategory?: string
  className?: string
}

export function PromptLibrary({
  categories = [],
  prompts = [],
  onSelectPrompt,
  onSelectCategory,
  selectedCategory,
  className,
}: PromptLibraryProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const safeCategories = categories || []
  const safePrompts = prompts || []

  const filteredPrompts = safePrompts.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className={cn('flex gap-4', className)}>
      {/* Categories Sidebar */}
      <div className="w-48 shrink-0">
        <h4 className="text-sm font-medium mb-2">Categories</h4>
        <div className="space-y-1">
          <button
            className={cn(
              'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
              !selectedCategory
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
            onClick={() => onSelectCategory?.('')}
          >
            All ({safePrompts.length})
          </button>
          {safeCategories.map((cat) => (
            <button
              key={cat.id}
              className={cn(
                'w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between',
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
              onClick={() => onSelectCategory?.(cat.id)}
            >
              <span>{cat.name}</span>
              <Badge variant="secondary" className="text-xs">
                {cat.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Prompts List */}
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts..."
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="grid gap-3 pr-4">
            {filteredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="rounded-lg border border-border p-4 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => onSelectPrompt?.(prompt)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{prompt.name}</h4>
                      {prompt.isFavorite && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    {prompt.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {prompt.description}
                      </p>
                    )}
                    {prompt.tags && prompt.tags.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 flex-wrap">
                        {prompt.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {prompt.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{prompt.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </div>
              </div>
            ))}
            {filteredPrompts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No prompts found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

// System Prompt Editor
interface SystemPromptEditorProps {
  value: string
  onChange?: (value: string) => void
  presets?: { id: string; name: string; content: string }[]
  maxTokens?: number
  className?: string
}

export function SystemPromptEditor({
  value = '',
  onChange,
  presets = [],
  maxTokens = 4096,
  className,
}: SystemPromptEditorProps) {
  const safeValue = value || ''
  const safePresets = presets || []
  const estimatedTokens = Math.ceil(safeValue.length / 4)

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">System Prompt</h3>
          <p className="text-sm text-muted-foreground">
            Define the AI&apos;s behavior and personality
          </p>
        </div>
        {safePresets.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderOpen className="h-4 w-4 mr-1" />
                Presets
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {safePresets.map((preset) => (
                <DropdownMenuItem
                  key={preset.id}
                  onClick={() => onChange?.(preset.content)}
                >
                  {preset.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Textarea
        value={safeValue}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="You are a helpful AI assistant..."
        rows={8}
        className="font-mono text-sm"
      />

      <div className="flex items-center justify-between text-sm">
        <TokenCounter text={safeValue} maxTokens={maxTokens} />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigator.clipboard.writeText(safeValue)}
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onChange?.('')}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}
