/**
 * Enhanced Prompt Template Library
 *
 * Comprehensive template management with sharing, categorization,
 * collaboration, and advanced discovery features.
 */

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
  Avatar,
  AvatarImage,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ScrollArea,
  Separator,
  cn,
} from '@clarity-chat/primitives'
import {
  SearchIcon,
  FilterIcon,
  SortIcon,
  StarIcon,
  ShareIcon,
  DownloadIcon,
  UploadIcon,
  PlusIcon,
  MoreVerticalIcon,
  TagIcon,
  UserIcon,
  ClockIcon,
  HeartIcon,
  BookOpenIcon,
  ZapIcon,
  MessageSquareIcon,
  CodeIcon,
  PaletteIcon,
  TrendingUpIcon,
  UsersIcon,
  GlobeIcon,
} from '../ui/icons'
import type {
  PromptTemplate,
  PromptVersion,
  PromptAnalytics,
  PromptEnvironment,
  PromptABTest,
  PromptComment,
} from '../../prompts/types'
import { usePromptLibrary } from '../../prompts/hooks/use-prompt-library'
import { formatRelativeTime } from '../../internal/helpers'

/**
 * Animation duration presets (in seconds for framer-motion)
 */
const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
} as const

export interface PromptLibraryProps {
  /** Initial templates to display */
  initialTemplates?: PromptTemplate[]
  /** Enable sharing features */
  enableSharing?: boolean
  /** Enable collaboration features */
  enableCollaboration?: boolean
  /** Enable analytics display */
  enableAnalytics?: boolean
  /** Enable A/B testing features */
  enableABTesting?: boolean
  /** Custom categories to show */
  categories?: Array<{
    id: string
    name: string
    icon: React.ReactNode
    color: string
  }>
  /** On template select callback */
  onTemplateSelect?: (template: PromptTemplate) => void
  /** On template edit callback */
  onTemplateEdit?: (template: PromptTemplate) => void
  /** On template create callback */
  onTemplateCreate?: () => void
  /** On template share callback */
  onTemplateShare?: (template: PromptTemplate) => void
  /** On template import callback */
  onTemplateImport?: (templates: PromptTemplate[]) => void
  /** Custom class name */
  className?: string
}

/**
 * Category definitions with icons and colors
 */
const DEFAULT_CATEGORIES = [
  {
    id: 'writing',
    name: 'Writing',
    icon: <BookOpenIcon className="w-4 h-4" />,
    color: 'bg-blue-500',
  },
  {
    id: 'coding',
    name: 'Coding',
    icon: <CodeIcon className="w-4 h-4" />,
    color: 'bg-green-500',
  },
  {
    id: 'design',
    name: 'Design',
    icon: <PaletteIcon className="w-4 h-4" />,
    color: 'bg-purple-500',
  },
  {
    id: 'analysis',
    name: 'Analysis',
    icon: <TrendingUpIcon className="w-4 h-4" />,
    color: 'bg-orange-500',
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: <MessageSquareIcon className="w-4 h-4" />,
    color: 'bg-pink-500',
  },
  {
    id: 'automation',
    name: 'Automation',
    icon: <ZapIcon className="w-4 h-4" />,
    color: 'bg-yellow-500',
  },
]

/**
 * Template Card Component
 */
function TemplateCard({
  template,
  analytics,
  abTests,
  comments,
  onSelect,
  onEdit,
  onShare,
  enableSharing,
  enableAnalytics,
  enableABTesting,
  enableCollaboration,
}: {
  template: PromptTemplate
  analytics?: PromptAnalytics
  abTests?: PromptABTest[]
  comments?: PromptComment[]
  onSelect?: (template: PromptTemplate) => void
  onEdit?: (template: PromptTemplate) => void
  onShare?: (template: PromptTemplate) => void
  enableSharing?: boolean
  enableAnalytics?: boolean
  enableABTesting?: boolean
  enableCollaboration?: boolean
}) {
  const [showDetails, setShowDetails] = React.useState(false)
  const category = DEFAULT_CATEGORIES.find((cat) =>
    template.tags?.some((tag) => tag.toLowerCase().includes(cat.id))
  )

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: durations.normal }}
      viewport={{ once: true }}
    >
      <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {category && (
                  <Badge variant="secondary" className="text-xs">
                    {category.icon}
                    <span className="ml-1">{category.name}</span>
                  </Badge>
                )}
                {analytics && (
                  <Badge variant="outline" className="text-xs">
                    <UsersIcon className="w-3 h-3 mr-1" />
                    {analytics.usage.totalUses}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base truncate">
                {template.name}
              </CardTitle>
              {template.description && (
                <CardDescription className="text-sm line-clamp-2">
                  {template.description}
                </CardDescription>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVerticalIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSelect?.(template)}>
                  Use Template
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(template)}>
                  Edit Template
                </DropdownMenuItem>
                {enableSharing && onShare && (
                  <DropdownMenuItem onClick={() => onShare(template)}>
                    <ShareIcon className="w-4 h-4 mr-2" />
                    Share Template
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowDetails(!showDetails)}>
                  {showDetails ? 'Hide' : 'Show'} Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Tags */}
          {template.tags && template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {template.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <TagIcon className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {template.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{template.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Variables */}
          {template.variables && template.variables.length > 0 && (
            <div className="text-xs text-muted-foreground mb-2">
              {template.variables.length} variable
              {template.variables.length !== 1 ? 's' : ''}
            </div>
          )}

          {/* Analytics Preview */}
          {enableAnalytics && analytics && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <HeartIcon className="w-3 h-3" />
                {Math.round(analytics.quality.successRate * 100)}%
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="w-3 h-3" />
                {Math.round(analytics.performance.averageLatency)}ms
              </div>
            </div>
          )}

          {/* Collaboration Indicators */}
          {enableCollaboration && comments && comments.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquareIcon className="w-3 h-3" />
              {comments.length} comment{comments.length !== 1 ? 's' : ''}
            </div>
          )}

          {/* A/B Testing Indicator */}
          {enableABTesting && abTests && abTests.length > 0 && (
            <Badge variant="secondary" className="text-xs mt-2">
              <GlobeIcon className="w-3 h-3 mr-1" />
              A/B Testing
            </Badge>
          )}

          {/* Expanded Details */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t space-y-3"
                viewport={{ once: true }}
              >
                {/* Version Info */}
                {template.version && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Version</span>
                    <Badge variant="outline">{template.version}</Badge>
                  </div>
                )}

                {/* Variables Detail */}
                {template.variables && template.variables.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Variables</span>
                    <div className="space-y-1">
                      {template.variables.map((variable) => (
                        <div
                          key={variable.name}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="font-mono text-xs">
                            {variable.name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {variable.required ? 'Required' : 'Optional'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Template Preview */}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Template Preview</span>
                  <ScrollArea className="h-32">
                    <pre className="text-xs bg-muted p-2 rounded font-mono whitespace-pre-wrap">
                      {template.template.length > 200
                        ? template.template.slice(0, 200) + '...'
                        : template.template}
                    </pre>
                  </ScrollArea>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Template Sharing Dialog
 */
function TemplateShareDialog({
  template,
  open,
  onOpenChange,
  onShare,
}: {
  template: PromptTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onShare?: (
    template: PromptTemplate,
    options: { public: boolean; allowFork: boolean }
  ) => void
}) {
  const [isPublic, setIsPublic] = React.useState(false)
  const [allowFork, setAllowFork] = React.useState(true)

  const handleShare = () => {
    if (template && onShare) {
      onShare(template, { public: isPublic, allowFork })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Template</DialogTitle>
          <DialogDescription>
            Share "{template?.name}" with the community or specific users.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="public">Make publicly available</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="fork"
              checked={allowFork}
              onChange={(e) => setAllowFork(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="fork">Allow others to fork and modify</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleShare}>Share Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Template Import Dialog
 */
function TemplateImportDialog({
  open,
  onOpenChange,
  onImport,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport?: (templates: PromptTemplate[]) => void
}) {
  const [importText, setImportText] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  const handleImport = () => {
    try {
      const templates = JSON.parse(importText)
      if (Array.isArray(templates)) {
        onImport?.(templates)
        setImportText('')
        setError(null)
        onOpenChange(false)
      } else {
        setError('Import data must be an array of templates')
      }
    } catch (err) {
      setError('Invalid JSON format')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Templates</DialogTitle>
          <DialogDescription>
            Paste JSON data containing prompt templates to import them into your
            library.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="import-data">Template JSON</Label>
            <Textarea
              id="import-data"
              placeholder="Paste template JSON here..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="min-h-64 font-mono text-sm"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!importText.trim()}>
            Import Templates
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Main Prompt Library Component
 */
export function PromptLibrary({
  initialTemplates = [],
  enableSharing = true,
  enableCollaboration = false,
  enableAnalytics = true,
  enableABTesting = false,
  categories = DEFAULT_CATEGORIES,
  onTemplateSelect,
  onTemplateEdit,
  onTemplateCreate,
  onTemplateShare,
  onTemplateImport,
  className,
}: PromptLibraryProps) {
  const {
    state,
    actions: {
      addTemplate,
      updateTemplate,
      deleteTemplate,
      searchTemplates,
      filterByCategory,
      sortTemplates,
      importTemplates,
      exportTemplates,
      shareTemplate,
    },
  } = usePromptLibrary({ initialTemplates })

  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [sortBy, setSortBy] = React.useState<'name' | 'recent' | 'popular'>(
    'recent'
  )
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [importDialogOpen, setImportDialogOpen] = React.useState(false)
  const [templateToShare, setTemplateToShare] =
    React.useState<PromptTemplate | null>(null)

  // Filter and sort templates
  const filteredTemplates = React.useMemo(() => {
    let templates = state.templates

    // Search
    if (searchQuery) {
      templates = searchTemplates(searchQuery)
    }

    // Category filter
    if (selectedCategory !== 'all') {
      templates = filterByCategory(selectedCategory)
    }

    // Sort
    templates = sortTemplates(templates, sortBy)

    return templates
  }, [
    state.templates,
    searchQuery,
    selectedCategory,
    sortBy,
    searchTemplates,
    filterByCategory,
    sortTemplates,
  ])

  const handleShare = (template: PromptTemplate) => {
    setTemplateToShare(template)
    setShareDialogOpen(true)
  }

  const handleShareConfirm = (
    template: PromptTemplate,
    options: { public: boolean; allowFork: boolean }
  ) => {
    shareTemplate(template, options)
    onTemplateShare?.(template)
  }

  const handleImport = (templates: PromptTemplate[]) => {
    importTemplates(templates)
    onTemplateImport?.(templates)
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Prompt Library</h2>
          <p className="text-muted-foreground">
            Discover, create, and manage your prompt templates
          </p>
        </div>

        <div className="flex items-center gap-2">
          {enableSharing && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setImportDialogOpen(true)}
              >
                <UploadIcon className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportTemplates()}
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Export
              </Button>
            </>
          )}
          <Button onClick={onTemplateCreate}>
            <PlusIcon className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <FilterIcon className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value: any) => setSortBy(value)}
          >
            <SelectTrigger className="w-32">
              <SortIcon className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.icon}
            {category.name}
          </Button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              analytics={
                enableAnalytics ? state.analytics[template.id] : undefined
              }
              abTests={
                enableABTesting
                  ? state.abTests.filter(
                      (test) => test.templateId === template.id
                    )
                  : undefined
              }
              comments={
                enableCollaboration
                  ? state.history.filter(
                      (entry) => entry.templateId === template.id
                    )
                  : undefined
              }
              onSelect={onTemplateSelect}
              onEdit={onTemplateEdit}
              onShare={enableSharing ? handleShare : undefined}
              enableSharing={enableSharing}
              enableAnalytics={enableAnalytics}
              enableABTesting={enableABTesting}
              enableCollaboration={enableCollaboration}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <BookOpenIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Get started by creating your first prompt template.'}
          </p>
          <Button onClick={onTemplateCreate}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <TemplateShareDialog
        template={templateToShare}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onShare={handleShareConfirm}
      />

      <TemplateImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImport}
      />
    </div>
  )
}

PromptLibrary.displayName = 'PromptLibrary'
