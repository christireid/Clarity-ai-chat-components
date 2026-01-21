/**
 * Template Marketplace Component
 *
 * Browse, discover, and install prompt templates from the community.
 * Provides advanced search, filtering, ratings, and social features.
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  ScrollArea,
  Separator,
  cn,
} from '@clarity-chat/primitives'
import {
  SearchIcon,
  FilterIcon,
  StarIcon,
  DownloadIcon,
  ForkIcon,
  ShareIcon,
  HeartIcon,
  MessageSquareIcon,
  TrendingUpIcon,
  ClockIcon,
  UserIcon,
  GlobeIcon,
  ShieldIcon,
  ZapIcon,
} from '../ui/icons'
import type { SharedTemplate } from '../../prompts/sharing'
import { templateMarketplace } from '../../prompts/sharing'

export interface TemplateMarketplaceProps {
  /** Current user info */
  currentUser?: {
    id: string
    name: string
    avatar?: string
  }
  /** Templates already installed locally */
  installedTemplateIds?: Set<string>
  /** On template install callback */
  onTemplateInstall?: (template: SharedTemplate) => void
  /** On template preview callback */
  onTemplatePreview?: (template: SharedTemplate) => void
  /** On template rate callback */
  onTemplateRate?: (templateId: string, rating: number, review?: string) => void
  /** Custom class name */
  className?: string
}

/**
 * Marketplace Template Card
 */
function MarketplaceTemplateCard({
  template,
  isInstalled,
  onInstall,
  onPreview,
  onRate,
}: {
  template: SharedTemplate
  isInstalled: boolean
  onInstall?: (template: SharedTemplate) => void
  onPreview?: (template: SharedTemplate) => void
  onRate?: (templateId: string, rating: number, review?: string) => void
}) {
  const [showRating, setShowRating] = React.useState(false)
  const [userRating, setUserRating] = React.useState(0)
  const [reviewText, setReviewText] = React.useState('')

  const handleRate = () => {
    if (userRating > 0) {
      onRate?.(template.id, userRating, reviewText.trim() || undefined)
      setShowRating(false)
      setUserRating(0)
      setReviewText('')
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: durations.normal }}
    >
      <Card className="group hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={template.author.avatar} />
                  <AvatarFallback>
                    {template.author.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {template.author.name}
                </span>
                <Badge
                  variant={template.sharing.isPublic ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {template.sharing.isPublic ? <GlobeIcon className="w-3 h-3 mr-1" /> : <ShieldIcon className="w-3 h-3 mr-1" />}
                  {template.sharing.isPublic ? 'Public' : 'Private'}
                </Badge>
              </div>
              <CardTitle className="text-base truncate">{template.name}</CardTitle>
              {template.description && (
                <CardDescription className="text-sm line-clamp-2">
                  {template.description}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Tags */}
          {template.tags && template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {template.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
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

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <DownloadIcon className="w-3 h-3" />
                {template.stats.downloads}
              </div>
              <div className="flex items-center gap-1">
                <ForkIcon className="w-3 h-3" />
                {template.stats.forks}
              </div>
              <div className="flex items-center gap-1">
                <StarIcon className="w-3 h-3" />
                {template.stats.rating.toFixed(1)}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              {new Date(template.sharedAt).toLocaleDateString()}
            </div>
          </div>

          {/* Variables */}
          {template.variables && template.variables.length > 0 && (
            <div className="text-xs text-muted-foreground mb-2">
              {template.variables.length} variable{template.variables.length !== 1 ? 's' : ''}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onPreview?.(template)}
              className="flex-1"
            >
              Preview
            </Button>

            {isInstalled ? (
              <Badge variant="outline" className="px-3 py-1">
                Installed
              </Badge>
            ) : (
              <Button
                size="sm"
                onClick={() => onInstall?.(template)}
                className="flex-1"
              >
                <DownloadIcon className="w-3 h-3 mr-2" />
                Install
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowRating(!showRating)}
            >
              <StarIcon className="w-3 h-3" />
            </Button>
          </div>

          {/* Rating Dialog */}
          <AnimatePresence>
            {showRating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 bg-muted/50 rounded-lg space-y-3"
              >
                <div>
                  <Label className="text-sm font-medium">Rate this template</Label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className={`w-6 h-6 ${
                          star <= userRating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      >
                        <StarIcon className="w-full h-full" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="review" className="text-sm font-medium">
                    Review (optional)
                  </Label>
                  <Textarea
                    id="review"
                    placeholder="Share your thoughts..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="mt-1 text-sm"
                    rows={2}
                  />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={handleRate} disabled={userRating === 0}>
                    Submit Rating
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowRating(false)}
                  >
                    Cancel
                  </Button>
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
 * Template Preview Dialog
 */
function TemplatePreviewDialog({
  template,
  open,
  onOpenChange,
}: {
  template: SharedTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!template) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={template.author.avatar} />
              <AvatarFallback>
                {template.author.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>{template.name}</DialogTitle>
              <DialogDescription>
                by {template.author.name} • {new Date(template.sharedAt).toLocaleDateString()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-96">
          <div className="space-y-6">
            {/* Description */}
            {template.description && (
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{template.stats.downloads}</div>
                <div className="text-sm text-muted-foreground">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{template.stats.forks}</div>
                <div className="text-sm text-muted-foreground">Forks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{template.stats.rating.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{template.stats.reviews}</div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </div>
            </div>

            {/* Tags */}
            {template.tags && template.tags.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Variables */}
            {template.variables && template.variables.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Variables</h4>
                <div className="space-y-2">
                  {template.variables.map((variable) => (
                    <div key={variable.name} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div>
                        <span className="font-mono text-sm">{variable.name}</span>
                        {variable.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {variable.description}
                          </p>
                        )}
                      </div>
                      <Badge variant={variable.required ? 'default' : 'outline'}>
                        {variable.required ? 'Required' : 'Optional'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Template Content */}
            <div>
              <h4 className="font-medium mb-2">Template</h4>
              <ScrollArea className="h-64">
                <pre className="text-sm bg-muted p-4 rounded-lg font-mono whitespace-pre-wrap">
                  {template.template}
                </pre>
              </ScrollArea>
            </div>

            {/* Sharing Info */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {template.sharing.isPublic ? (
                  <GlobeIcon className="w-4 h-4" />
                ) : (
                  <ShieldIcon className="w-4 h-4" />
                )}
                {template.sharing.isPublic ? 'Public' : 'Private'}
              </div>
              {template.sharing.allowFork && (
                <div className="flex items-center gap-1">
                  <ForkIcon className="w-4 h-4" />
                  Forkable
                </div>
              )}
              {template.sharing.requireAttribution && (
                <div className="flex items-center gap-1">
                  <UserIcon className="w-4 h-4" />
                  Attribution Required
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Main Template Marketplace Component
 */
export function TemplateMarketplace({
  currentUser,
  installedTemplateIds = new Set(),
  onTemplateInstall,
  onTemplatePreview,
  onTemplateRate,
  className,
}: TemplateMarketplaceProps) {
  const [templates, setTemplates] = React.useState<SharedTemplate[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [sortBy, setSortBy] = React.useState<'popular' | 'recent' | 'rating' | 'downloads'>('popular')
  const [previewTemplate, setPreviewTemplate] = React.useState<SharedTemplate | null>(null)
  const [showPreview, setShowPreview] = React.useState(false)

  // Load templates on mount
  React.useEffect(() => {
    const loadTemplates = async () => {
      try {
        const sharedTemplates = await templateMarketplace.getSharedTemplates({
          sortBy,
        })
        setTemplates(sharedTemplates)
      } catch (error) {
        console.error('Failed to load marketplace templates:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTemplates()
  }, [sortBy])

  // Filter templates
  const filteredTemplates = React.useMemo(() => {
    let filtered = templates

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        t.author.name.toLowerCase().includes(query)
      )
    }

    // Category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t =>
        t.tags?.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()))
      )
    }

    return filtered
  }, [templates, searchQuery, selectedCategory])

  const handleInstall = async (template: SharedTemplate) => {
    try {
      await templateMarketplace.downloadTemplate(template.id)
      onTemplateInstall?.(template)
    } catch (error) {
      console.error('Failed to install template:', error)
    }
  }

  const handleRate = async (templateId: string, rating: number, review?: string) => {
    try {
      await templateMarketplace.rateTemplate(templateId, rating, review)
      // Refresh templates to show updated ratings
      const updatedTemplates = await templateMarketplace.getSharedTemplates({ sortBy })
      setTemplates(updatedTemplates)
      onTemplateRate?.(templateId, rating, review)
    } catch (error) {
      console.error('Failed to rate template:', error)
    }
  }

  const handlePreview = (template: SharedTemplate) => {
    setPreviewTemplate(template)
    setShowPreview(true)
    onTemplatePreview?.(template)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded mb-4"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-muted rounded flex-1"></div>
                <div className="h-8 bg-muted rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Template Marketplace</h2>
        <p className="text-muted-foreground">
          Discover and install prompt templates shared by the community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search templates, authors, or tags..."
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
              <SelectItem value="writing">Writing</SelectItem>
              <SelectItem value="coding">Coding</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="analysis">Analysis</SelectItem>
              <SelectItem value="communication">Communication</SelectItem>
              <SelectItem value="automation">Automation</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <TrendingUpIcon className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="downloads">Downloads</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
        </span>
        {currentUser && (
          <span>Welcome back, {currentUser.name}!</span>
        )}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTemplates.map((template) => (
            <MarketplaceTemplateCard
              key={template.id}
              template={template}
              isInstalled={installedTemplateIds.has(template.id)}
              onInstall={handleInstall}
              onPreview={handlePreview}
              onRate={handleRate}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <GlobeIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Be the first to share a template!'
            }
          </p>
        </div>
      )}

      {/* Preview Dialog */}
      <TemplatePreviewDialog
        template={previewTemplate}
        open={showPreview}
        onOpenChange={setShowPreview}
      />
    </div>
  )
}

TemplateMarketplace.displayName = 'TemplateMarketplace'