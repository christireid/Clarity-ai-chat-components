'use client'

import * as React from 'react'
import {
  ArrowRight,
  Book,
  BookMarked,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  Copy,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Folder,
  FolderOpen,
  GitBranch,
  Globe,
  Hash,
  History,
  LayoutGrid,
  List,
  MoreVertical,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Sparkles,
  Star,
  Tag,
  TestTube,
  Trash2,
  Upload,
  Users,
  Zap,
} from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import { Avatar, AvatarFallback } from '@clarity-chat/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import { Switch } from '@clarity-chat/primitives'

interface Prompt {
  id: string
  name: string
  description: string
  content: string
  category: string
  tags: string[]
  version: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  isPublic: boolean
  isFavorite: boolean
  usageCount: number
  avgTokens: number
  variables?: string[]
}

interface PromptCategory {
  id: string
  name: string
  icon: React.ElementType
  count: number
}

// Prompt Card Component
function PromptCard({
  prompt,
  onSelect,
  onFavorite,
  selected,
}: {
  prompt: Prompt
  onSelect: () => void
  onFavorite: () => void
  selected: boolean
}) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        selected && 'ring-2 ring-primary'
      )}
      onClick={onSelect}
    >
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium truncate">{prompt.name}</h4>
              {prompt.isPublic && (
                <Globe className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {prompt.description}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onFavorite()
            }}
            className="ml-2"
          >
            <Star
              className={cn(
                'h-4 w-4',
                prompt.isFavorite
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-muted-foreground'
              )}
            />
          </button>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {prompt.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {prompt.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{prompt.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {prompt.avgTokens}
            </span>
            <span className="flex items-center gap-1">
              <Play className="h-3 w-3" />
              {prompt.usageCount}
            </span>
          </div>
          <span>v{prompt.version}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Prompt List Item Component
function PromptListItem({
  prompt,
  onSelect,
  selected,
}: {
  prompt: Prompt
  onSelect: () => void
  selected: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg border border-border cursor-pointer transition-colors hover:bg-muted/50',
        selected && 'bg-muted/50 border-primary'
      )}
      onClick={onSelect}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <FileText className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{prompt.name}</p>
          {prompt.isFavorite && (
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {prompt.description}
        </p>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{prompt.usageCount} uses</span>
        <Badge variant="outline">v{prompt.version}</Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <History className="mr-2 h-4 w-4" />
              Version History
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// Category Sidebar Item
function CategoryItem({
  category,
  selected,
  onSelect,
  expanded,
  onToggle,
}: {
  category: PromptCategory
  selected: boolean
  onSelect: () => void
  expanded?: boolean
  onToggle?: () => void
}) {
  const Icon = category.icon
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
        selected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1 text-sm">{category.name}</span>
      <Badge variant="secondary" className="text-xs">
        {category.count}
      </Badge>
    </button>
  )
}

// Prompt Editor Component
function PromptEditor({
  prompt,
  onSave,
}: {
  prompt: Prompt | null
  onSave: (prompt: Partial<Prompt>) => void
}) {
  const [content, setContent] = React.useState(prompt?.content || '')
  const [name, setName] = React.useState(prompt?.name || '')
  const [description, setDescription] = React.useState(
    prompt?.description || ''
  )

  React.useEffect(() => {
    if (prompt) {
      setContent(prompt.content)
      setName(prompt.name)
      setDescription(prompt.description)
    }
  }, [prompt])

  if (!prompt) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="font-medium">No Prompt Selected</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select a prompt from the library to view and edit
        </p>
      </div>
    )
  }

  const variables =
    content
      .match(/\{\{([^}]+)\}\}/g)
      ?.map((v) => v.replace(/\{\{|\}\}/g, '')) || []

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex-1 min-w-0">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-lg font-medium border-0 p-0 h-auto focus-visible:ring-0"
            placeholder="Prompt name"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-sm text-muted-foreground border-0 p-0 h-auto mt-1 focus-visible:ring-0"
            placeholder="Description"
          />
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button variant="outline" size="sm">
            <TestTube className="mr-2 h-4 w-4" />
            Test
          </Button>
          <Button
            size="sm"
            onClick={() => onSave({ name, description, content })}
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex">
        {/* Main Editor */}
        <div className="flex-1 p-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-full resize-none font-mono text-sm"
            placeholder="Enter your prompt template..."
          />
        </div>

        {/* Variables Sidebar */}
        <div className="w-64 border-l border-border p-4">
          <h4 className="font-medium text-sm mb-3">Variables</h4>
          {variables.length > 0 ? (
            <div className="space-y-2">
              {variables.map((variable) => (
                <div
                  key={variable}
                  className="flex items-center gap-2 rounded-lg border border-border p-2"
                >
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono">{variable}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Use {'{{variable}}'} syntax to add variables
            </p>
          )}

          <h4 className="font-medium text-sm mt-6 mb-3">Metadata</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Version</span>
              <Badge variant="outline">v{prompt.version}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Avg Tokens</span>
              <span>{prompt.avgTokens}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Uses</span>
              <span>{prompt.usageCount}</span>
            </div>
          </div>

          <h4 className="font-medium text-sm mt-6 mb-3">Tags</h4>
          <div className="flex flex-wrap gap-1">
            {prompt.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Dashboard Component
export function PromptLibraryDashboard() {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [selectedPrompt, setSelectedPrompt] = React.useState<Prompt | null>(
    null
  )
  const [showEditor, setShowEditor] = React.useState(false)

  const categories: PromptCategory[] = [
    { id: 'all', name: 'All Prompts', icon: Folder, count: 24 },
    { id: 'favorites', name: 'Favorites', icon: Star, count: 5 },
    { id: 'recent', name: 'Recently Used', icon: Clock, count: 8 },
    { id: 'system', name: 'System Prompts', icon: Settings, count: 6 },
    { id: 'templates', name: 'Templates', icon: FileText, count: 12 },
    { id: 'shared', name: 'Shared with Me', icon: Users, count: 3 },
  ]

  const prompts: Prompt[] = [
    {
      id: '1',
      name: 'Code Review Assistant',
      description:
        'Analyzes code and provides detailed review feedback with suggestions',
      content:
        'You are a senior software engineer conducting a code review.\n\nAnalyze the following {{language}} code and provide:\n1. Code quality assessment\n2. Potential bugs or issues\n3. Performance suggestions\n4. Best practice recommendations\n\nCode:\n{{code}}',
      category: 'templates',
      tags: ['code', 'review', 'development'],
      version: '2.1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      createdBy: 'user1',
      isPublic: false,
      isFavorite: true,
      usageCount: 245,
      avgTokens: 1250,
      variables: ['language', 'code'],
    },
    {
      id: '2',
      name: 'Meeting Summary',
      description: 'Generates concise meeting summaries from transcripts',
      content:
        'Summarize the following meeting transcript into:\n1. Key decisions made\n2. Action items with owners\n3. Open questions\n4. Next steps\n\nTranscript:\n{{transcript}}',
      category: 'templates',
      tags: ['meetings', 'summary', 'productivity'],
      version: '1.3',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      createdBy: 'user1',
      isPublic: true,
      isFavorite: false,
      usageCount: 189,
      avgTokens: 890,
      variables: ['transcript'],
    },
    {
      id: '3',
      name: 'API Documentation',
      description: 'Creates comprehensive API documentation from code',
      content:
        'Generate API documentation for the following endpoint:\n\n{{endpoint_code}}\n\nInclude:\n- Description\n- Parameters\n- Request/Response examples\n- Error codes',
      category: 'templates',
      tags: ['api', 'documentation', 'development'],
      version: '1.0',
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08'),
      createdBy: 'user2',
      isPublic: true,
      isFavorite: true,
      usageCount: 156,
      avgTokens: 1100,
      variables: ['endpoint_code'],
    },
    {
      id: '4',
      name: 'Customer Support Agent',
      description: 'System prompt for customer support chatbot',
      content:
        'You are a helpful customer support agent for {{company_name}}.\n\nGuidelines:\n- Be polite and professional\n- Provide accurate information\n- Escalate when necessary\n- Reference documentation when available',
      category: 'system',
      tags: ['support', 'chatbot', 'customer-service'],
      version: '3.2',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-22'),
      createdBy: 'user1',
      isPublic: false,
      isFavorite: false,
      usageCount: 1250,
      avgTokens: 320,
      variables: ['company_name'],
    },
  ]

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'favorites' && prompt.isFavorite) ||
      prompt.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="h-[800px] flex rounded-lg border border-border overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-muted/30 flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <BookMarked className="h-5 w-5" />
            Prompt Library
          </h2>
        </div>

        <ScrollArea className="flex-1 p-3">
          <div className="space-y-1">
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                selected={selectedCategory === category.id}
                onSelect={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground px-3 mb-2">
              FOLDERS
            </p>
            <div className="space-y-1">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
              >
                <FolderOpen className="h-4 w-4" />
                <span>Marketing</span>
                <Badge variant="secondary" className="text-xs ml-auto">
                  4
                </Badge>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
              >
                <FolderOpen className="h-4 w-4" />
                <span>Engineering</span>
                <Badge variant="secondary" className="text-xs ml-auto">
                  8
                </Badge>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted text-muted-foreground"
              >
                <Plus className="h-4 w-4" />
                <span>New Folder</span>
              </button>
            </div>
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-border">
          <Button className="w-full" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex">
          {/* Prompt List/Grid */}
          <ScrollArea
            className={cn(
              'flex-1 p-4',
              showEditor && 'w-1/2 border-r border-border'
            )}
          >
            {viewMode === 'grid' ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    selected={selectedPrompt?.id === prompt.id}
                    onSelect={() => {
                      setSelectedPrompt(prompt)
                      setShowEditor(true)
                    }}
                    onFavorite={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPrompts.map((prompt) => (
                  <PromptListItem
                    key={prompt.id}
                    prompt={prompt}
                    selected={selectedPrompt?.id === prompt.id}
                    onSelect={() => {
                      setSelectedPrompt(prompt)
                      setShowEditor(true)
                    }}
                  />
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Editor Panel */}
          {showEditor && (
            <div className="w-1/2">
              <PromptEditor
                prompt={selectedPrompt}
                onSave={(updates) => console.log('Save:', updates)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PromptLibraryDashboard
