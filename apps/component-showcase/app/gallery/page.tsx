'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Badge,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ScrollArea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  cn,
} from '@clarity-chat/primitives'
import {
  Search,
  Filter,
  Grid3x3,
  List,
  Star,
  Clock,
  ExternalLink,
  Play,
  SortAsc,
  SortDesc,
  Eye,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  MessagesSquare,
  Brain,
  Wrench,
  Keyboard,
  SearchIcon,
  Coins,
  BarChart3,
  Code2,
  FileImage,
  Navigation,
  Bell,
  Lightbulb,
  Palette,
  Loader2,
  Quote,
  Layers,
  Copy,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { PageHeader } from '@/components/component-section'

// Component metadata type
interface ComponentMetadata {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  path: string
  thumbnail?: string
  complexity: 'simple' | 'moderate' | 'complex'
  status: 'stable' | 'beta' | 'new'
  interactive: boolean
  features: string[]
}

// All components data
const allComponents: ComponentMetadata[] = [
  // Core Chat
  {
    id: 'clarity-chat-app',
    name: 'ClarityChatApp',
    description: 'Complete chat application with all features built-in',
    category: 'Core Chat',
    tags: ['chat', 'conversation', 'full-featured', 'streaming'],
    path: '/core-chat',
    complexity: 'complex',
    status: 'stable',
    interactive: true,
    features: ['streaming', 'memory', 'tools', 'voice', 'file-upload'],
  },
  {
    id: 'chat-window',
    name: 'ChatWindow',
    description: 'Message display container with scrolling',
    category: 'Core Chat',
    tags: ['chat', 'messages', 'container', 'scrolling'],
    path: '/core-chat',
    complexity: 'moderate',
    status: 'stable',
    interactive: true,
    features: ['virtualization', 'auto-scroll', 'message-grouping'],
  },
  {
    id: 'chat-input',
    name: 'ChatInput',
    description: 'Input field with rich features and attachments',
    category: 'Core Chat',
    tags: ['input', 'textarea', 'attachments', 'keyboard'],
    path: '/core-chat',
    complexity: 'moderate',
    status: 'stable',
    interactive: true,
    features: ['multi-line', 'auto-resize', 'mentions', 'emoji-picker'],
  },

  // Messages
  {
    id: 'message-bubble',
    name: 'MessageBubble',
    description: 'Individual message display with reactions',
    category: 'Messages',
    tags: ['message', 'bubble', 'reactions', 'timestamp'],
    path: '/messages',
    complexity: 'simple',
    status: 'stable',
    interactive: true,
    features: ['avatars', 'reactions', 'edit', 'delete'],
  },
  {
    id: 'streaming-message',
    name: 'StreamingMessage',
    description: 'Real-time streaming message display',
    category: 'Messages',
    tags: ['streaming', 'real-time', 'animated', 'typing'],
    path: '/messages',
    complexity: 'moderate',
    status: 'stable',
    interactive: true,
    features: ['cursor-animation', 'chunk-rendering', 'markdown'],
  },
  {
    id: 'typing-indicator',
    name: 'TypingIndicator',
    description: 'Shows when AI is typing',
    category: 'Messages',
    tags: ['typing', 'loading', 'indicator', 'animation'],
    path: '/messages',
    complexity: 'simple',
    status: 'stable',
    interactive: true,
    features: ['animated-dots', 'customizable'],
  },

  // AI Reasoning
  {
    id: 'think-component',
    name: 'Think',
    description: 'Display AI reasoning and thought process',
    category: 'AI Reasoning',
    tags: ['thinking', 'reasoning', 'agent', 'transparency'],
    path: '/ai-reasoning',
    complexity: 'moderate',
    status: 'stable',
    interactive: true,
    features: ['expandable', 'step-by-step', 'timing'],
  },
  {
    id: 'chain-of-thought',
    name: 'ChainOfThought',
    description: 'Step-by-step reasoning visualization',
    category: 'AI Reasoning',
    tags: ['reasoning', 'steps', 'visualization', 'thinking'],
    path: '/ai-reasoning',
    complexity: 'moderate',
    status: 'stable',
    interactive: true,
    features: ['timeline', 'collapsible', 'progress'],
  },
  {
    id: 'agent-panel',
    name: 'AgentPanel',
    description: 'Complete agent status and control panel',
    category: 'AI Reasoning',
    tags: ['agent', 'status', 'tools', 'monitoring'],
    path: '/ai-reasoning',
    complexity: 'complex',
    status: 'stable',
    interactive: true,
    features: ['tool-tracking', 'memory-status', 'token-usage'],
  },

  // Tools
  {
    id: 'tool-card',
    name: 'ToolCard',
    description: 'Display individual tool information',
    category: 'Tools',
    tags: ['tool', 'card', 'execution', 'status'],
    path: '/tools',
    complexity: 'simple',
    status: 'stable',
    interactive: true,
    features: ['status-indicator', 'result-display', 'timing'],
  },
  {
    id: 'tool-execution',
    name: 'ToolExecution',
    description: 'Shows tool execution progress and results',
    category: 'Tools',
    tags: ['tool', 'execution', 'progress', 'results'],
    path: '/tools',
    complexity: 'moderate',
    status: 'stable',
    interactive: true,
    features: ['real-time-status', 'error-handling', 'retry'],
  },

  // Input
  {
    id: 'voice-input',
    name: 'VoiceInput',
    description: 'Voice recording and transcription',
    category: 'Input',
    tags: ['voice', 'audio', 'recording', 'speech-to-text'],
    path: '/input',
    complexity: 'complex',
    status: 'stable',
    interactive: true,
    features: ['recording', 'waveform', 'transcription', 'playback'],
  },
  {
    id: 'file-upload',
    name: 'FileUpload',
    description: 'Drag and drop file upload',
    category: 'Input',
    tags: ['file', 'upload', 'drag-drop', 'attachments'],
    path: '/input',
    complexity: 'moderate',
    status: 'stable',
    interactive: true,
    features: ['drag-drop', 'preview', 'progress', 'validation'],
  },
  {
    id: 'mention-input',
    name: 'MentionInput',
    description: 'Input with @mentions and autocomplete',
    category: 'Input',
    tags: ['input', 'mentions', 'autocomplete', 'tagging'],
    path: '/input',
    complexity: 'moderate',
    status: 'stable',
    interactive: true,
    features: ['autocomplete', 'filtering', 'keyboard-nav'],
  },

  // Search
  {
    id: 'message-search',
    name: 'MessageSearch',
    description: 'Full-text message search',
    category: 'Search',
    tags: ['search', 'messages', 'filter', 'find'],
    path: '/search',
    complexity: 'moderate',
    status: 'stable',
    interactive: true,
    features: ['full-text', 'highlighting', 'filters', 'pagination'],
  },
  {
    id: 'semantic-search',
    name: 'SemanticSearch',
    description: 'AI-powered semantic search',
    category: 'Search',
    tags: ['search', 'semantic', 'ai', 'vector'],
    path: '/search',
    complexity: 'complex',
    status: 'beta',
    interactive: true,
    features: ['vector-search', 'similarity', 'embeddings'],
  },

  // Token Management
  {
    id: 'token-counter',
    name: 'TokenCounter',
    description: 'Real-time token counting display',
    category: 'Token Management',
    tags: ['tokens', 'counter', 'budget', 'cost'],
    path: '/token-management',
    complexity: 'simple',
    status: 'stable',
    interactive: true,
    features: ['real-time', 'visual-indicator', 'warnings'],
  },
  {
    id: 'token-budget',
    name: 'TokenBudget',
    description: 'Budget tracking and alerts',
    category: 'Token Management',
    tags: ['tokens', 'budget', 'tracking', 'alerts'],
    path: '/token-management',
    complexity: 'moderate',
    status: 'stable',
    interactive: true,
    features: ['budget-tracking', 'alerts', 'cost-estimation'],
  },

  // Dashboards
  {
    id: 'analytics-dashboard',
    name: 'AnalyticsDashboard',
    description: 'Complete analytics overview',
    category: 'Dashboards',
    tags: ['analytics', 'dashboard', 'metrics', 'charts'],
    path: '/dashboards',
    complexity: 'complex',
    status: 'stable',
    interactive: true,
    features: ['charts', 'real-time', 'export', 'filtering'],
  },
  {
    id: 'performance-dashboard',
    name: 'PerformanceDashboard',
    description: 'Performance metrics and monitoring',
    category: 'Dashboards',
    tags: ['performance', 'monitoring', 'metrics', 'speed'],
    path: '/dashboards',
    complexity: 'complex',
    status: 'stable',
    interactive: true,
    features: ['latency', 'throughput', 'errors', 'alerts'],
  },

  // Code & Data
  {
    id: 'code-block',
    name: 'CodeBlock',
    description: 'Syntax-highlighted code display',
    category: 'Code & Data',
    tags: ['code', 'syntax', 'highlighting', 'copy'],
    path: '/code-data',
    complexity: 'moderate',
    status: 'stable',
    interactive: true,
    features: ['syntax-highlighting', 'line-numbers', 'copy', 'themes'],
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Terminal emulator display',
    category: 'Code & Data',
    tags: ['terminal', 'cli', 'command', 'output'],
    path: '/code-data',
    complexity: 'moderate',
    status: 'stable',
    interactive: true,
    features: ['command-history', 'colors', 'interactive'],
  },
  {
    id: 'data-table',
    name: 'DataTable',
    description: 'Interactive data table',
    category: 'Code & Data',
    tags: ['table', 'data', 'sorting', 'filtering'],
    path: '/code-data',
    complexity: 'complex',
    status: 'stable',
    interactive: true,
    features: ['sorting', 'filtering', 'pagination', 'export'],
  },

  // Media & Files
  {
    id: 'file-tree',
    name: 'FileTree',
    description: 'Hierarchical file browser',
    category: 'Media & Files',
    tags: ['files', 'tree', 'explorer', 'browser'],
    path: '/media-files',
    complexity: 'moderate',
    status: 'stable',
    interactive: true,
    features: ['expandable', 'icons', 'selection', 'search'],
  },
  {
    id: 'image-gallery',
    name: 'ImageGallery',
    description: 'Image gallery with lightbox',
    category: 'Media & Files',
    tags: ['images', 'gallery', 'lightbox', 'preview'],
    path: '/media-files',
    complexity: 'moderate',
    status: 'stable',
    interactive: true,
    features: ['lightbox', 'thumbnails', 'zoom', 'navigation'],
  },

  // Navigation
  {
    id: 'command-palette',
    name: 'CommandPalette',
    description: 'Quick command search and execution',
    category: 'Navigation',
    tags: ['command', 'search', 'keyboard', 'shortcuts'],
    path: '/navigation',
    complexity: 'complex',
    status: 'stable',
    interactive: true,
    features: ['fuzzy-search', 'keyboard-nav', 'groups', 'recent'],
  },
  {
    id: 'conversation-history',
    name: 'ConversationHistory',
    description: 'Browse past conversations',
    category: 'Navigation',
    tags: ['history', 'conversations', 'browse', 'search'],
    path: '/navigation',
    complexity: 'moderate',
    status: 'stable',
    interactive: true,
    features: ['timeline', 'search', 'filtering', 'favorites'],
  },

  // Feedback & Status
  {
    id: 'toast-notifications',
    name: 'ToastNotifications',
    description: 'Non-intrusive notifications',
    category: 'Feedback',
    tags: ['toast', 'notification', 'alert', 'message'],
    path: '/feedback-status',
    complexity: 'simple',
    status: 'stable',
    interactive: true,
    features: ['auto-dismiss', 'stacking', 'actions', 'types'],
  },
  {
    id: 'error-boundary',
    name: 'ErrorBoundary',
    description: 'Graceful error handling',
    category: 'Feedback',
    tags: ['error', 'boundary', 'handling', 'fallback'],
    path: '/feedback-status',
    complexity: 'moderate',
    status: 'stable',
    interactive: false,
    features: ['error-catching', 'recovery', 'logging', 'fallback-ui'],
  },

  // Suggestions
  {
    id: 'follow-up-suggestions',
    name: 'FollowUpSuggestions',
    description: 'Suggested follow-up questions',
    category: 'Suggestions',
    tags: ['suggestions', 'follow-up', 'prompts', 'questions'],
    path: '/suggestions',
    complexity: 'simple',
    status: 'stable',
    interactive: true,
    features: ['clickable', 'contextual', 'dynamic'],
  },
  {
    id: 'prompt-suggestions',
    name: 'PromptSuggestions',
    description: 'Starter prompts and examples',
    category: 'Suggestions',
    tags: ['prompts', 'suggestions', 'examples', 'starters'],
    path: '/suggestions',
    complexity: 'simple',
    status: 'stable',
    interactive: true,
    features: ['categories', 'templates', 'custom'],
  },

  // Theme
  {
    id: 'theme-customizer',
    name: 'ThemeCustomizer',
    description: 'Live theme customization',
    category: 'Theme',
    tags: ['theme', 'customizer', 'colors', 'styling'],
    path: '/theme',
    complexity: 'complex',
    status: 'stable',
    interactive: true,
    features: ['color-picker', 'presets', 'export', 'preview'],
  },
  {
    id: 'theme-switcher',
    name: 'ThemeSwitcher',
    description: 'Dark/light mode toggle',
    category: 'Theme',
    tags: ['theme', 'dark-mode', 'light-mode', 'toggle'],
    path: '/theme',
    complexity: 'simple',
    status: 'stable',
    interactive: true,
    features: ['animated-transition', 'system-detection', 'persistence'],
  },

  // Loading States
  {
    id: 'skeleton-loader',
    name: 'SkeletonLoader',
    description: 'Content loading placeholders',
    category: 'Loading',
    tags: ['loading', 'skeleton', 'placeholder', 'shimmer'],
    path: '/loading-states',
    complexity: 'simple',
    status: 'stable',
    interactive: false,
    features: ['shimmer-effect', 'custom-shapes', 'responsive'],
  },
  {
    id: 'progress-indicator',
    name: 'ProgressIndicator',
    description: 'Progress bars and spinners',
    category: 'Loading',
    tags: ['progress', 'loading', 'spinner', 'indicator'],
    path: '/loading-states',
    complexity: 'simple',
    status: 'stable',
    interactive: false,
    features: ['determinate', 'indeterminate', 'circular', 'linear'],
  },

  // Citations
  {
    id: 'citation-card',
    name: 'CitationCard',
    description: 'Source citation display',
    category: 'Citations',
    tags: ['citation', 'source', 'reference', 'link'],
    path: '/citations',
    complexity: 'simple',
    status: 'stable',
    interactive: true,
    features: ['link-preview', 'metadata', 'numbering'],
  },
  {
    id: 'inline-citation',
    name: 'InlineCitation',
    description: 'In-text citation markers',
    category: 'Citations',
    tags: ['citation', 'inline', 'reference', 'marker'],
    path: '/citations',
    complexity: 'simple',
    status: 'stable',
    interactive: true,
    features: ['hover-preview', 'numbering', 'clickable'],
  },

  // Primitives
  {
    id: 'button',
    name: 'Button',
    description: 'Interactive button component',
    category: 'Primitives',
    tags: ['button', 'action', 'click', 'interactive'],
    path: '/primitives',
    complexity: 'simple',
    status: 'stable',
    interactive: true,
    features: ['variants', 'sizes', 'states', 'icons'],
  },
  {
    id: 'dialog',
    name: 'Dialog',
    description: 'Modal dialog window',
    category: 'Primitives',
    tags: ['dialog', 'modal', 'popup', 'overlay'],
    path: '/primitives',
    complexity: 'moderate',
    status: 'stable',
    interactive: true,
    features: ['overlay', 'focus-trap', 'animations', 'responsive'],
  },
  {
    id: 'dropdown-menu',
    name: 'DropdownMenu',
    description: 'Dropdown menu component',
    category: 'Primitives',
    tags: ['dropdown', 'menu', 'select', 'options'],
    path: '/primitives',
    complexity: 'moderate',
    status: 'stable',
    interactive: true,
    features: ['keyboard-nav', 'positioning', 'icons', 'separators'],
  },
]

// Categories configuration
const categories = [
  {
    id: 'all',
    name: 'All Components',
    icon: Grid3x3,
    color: 'text-gray-500',
  },
  { id: 'Core Chat', name: 'Core Chat', icon: MessageSquare, color: 'text-blue-500' },
  { id: 'Messages', name: 'Messages', icon: MessagesSquare, color: 'text-green-500' },
  { id: 'AI Reasoning', name: 'AI Reasoning', icon: Brain, color: 'text-purple-500' },
  { id: 'Tools', name: 'Tools', icon: Wrench, color: 'text-orange-500' },
  { id: 'Input', name: 'Input', icon: Keyboard, color: 'text-cyan-500' },
  { id: 'Search', name: 'Search', icon: SearchIcon, color: 'text-pink-500' },
  { id: 'Token Management', name: 'Token Management', icon: Coins, color: 'text-yellow-500' },
  { id: 'Dashboards', name: 'Dashboards', icon: BarChart3, color: 'text-indigo-500' },
  { id: 'Code & Data', name: 'Code & Data', icon: Code2, color: 'text-emerald-500' },
  { id: 'Media & Files', name: 'Media & Files', icon: FileImage, color: 'text-rose-500' },
  { id: 'Navigation', name: 'Navigation', icon: Navigation, color: 'text-teal-500' },
  { id: 'Feedback', name: 'Feedback', icon: Bell, color: 'text-red-500' },
  { id: 'Suggestions', name: 'Suggestions', icon: Lightbulb, color: 'text-amber-500' },
  { id: 'Theme', name: 'Theme', icon: Palette, color: 'text-violet-500' },
  { id: 'Loading', name: 'Loading', icon: Loader2, color: 'text-slate-500' },
  { id: 'Citations', name: 'Citations', icon: Quote, color: 'text-sky-500' },
  { id: 'Primitives', name: 'Primitives', icon: Layers, color: 'text-gray-500' },
]

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'complexity'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])
  const [selectedComponent, setSelectedComponent] = useState<ComponentMetadata | null>(null)

  // Load favorites and recent from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('component-favorites')
    const savedRecent = localStorage.getItem('component-recent')
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
    if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent))
  }, [])

  // Save favorites and recent to localStorage
  useEffect(() => {
    localStorage.setItem('component-favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('component-recent', JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  // Toggle favorite
  const toggleFavorite = (componentId: string) => {
    setFavorites((prev) =>
      prev.includes(componentId)
        ? prev.filter((id) => id !== componentId)
        : [...prev, componentId]
    )
  }

  // Add to recently viewed
  const addToRecent = (componentId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== componentId)
      return [componentId, ...filtered].slice(0, 10)
    })
  }

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    allComponents.forEach((comp) => comp.tags.forEach((tag) => tags.add(tag)))
    return Array.from(tags).sort()
  }, [])

  // Filtered components
  const filteredComponents = useMemo(() => {
    let filtered = allComponents

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (comp) =>
          comp.name.toLowerCase().includes(query) ||
          comp.description.toLowerCase().includes(query) ||
          comp.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((comp) => comp.category === selectedCategory)
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((comp) =>
        selectedTags.some((tag) => comp.tags.includes(tag))
      )
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
        case 'complexity':
          const complexityOrder = { simple: 0, moderate: 1, complex: 2 }
          comparison = complexityOrder[a.complexity] - complexityOrder[b.complexity]
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [searchQuery, selectedCategory, selectedTags, sortBy, sortOrder])

  // Get favorites components
  const favoriteComponents = useMemo(
    () => allComponents.filter((comp) => favorites.includes(comp.id)),
    [favorites]
  )

  // Get recently viewed components
  const recentComponents = useMemo(
    () =>
      recentlyViewed
        .map((id) => allComponents.find((comp) => comp.id === id))
        .filter(Boolean) as ComponentMetadata[],
    [recentlyViewed]
  )

  // Component card
  const ComponentCard = ({ component }: { component: ComponentMetadata }) => {
    const isFavorite = favorites.includes(component.id)
    const category = categories.find((cat) => cat.id === component.category)

    return (
      <Card
        className={cn(
          'group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] relative overflow-hidden',
          'glass-card border-0'
        )}
        onClick={() => {
          setSelectedComponent(component)
          addToRecent(component.id)
        }}
      >
        {/* Status Badge */}
        {component.status !== 'stable' && (
          <Badge
            className={cn(
              'absolute top-3 right-3 z-10 text-xs',
              component.status === 'new' && 'bg-green-500',
              component.status === 'beta' && 'bg-yellow-500'
            )}
          >
            {component.status}
          </Badge>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {category && (
                  <category.icon className={cn('h-4 w-4 shrink-0', category.color)} />
                )}
                <CardTitle className="text-base truncate">{component.name}</CardTitle>
              </div>
              <CardDescription className="text-xs line-clamp-2">
                {component.description}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(component.id)
              }}
            >
              {isFavorite ? (
                <BookmarkCheck className="h-4 w-4 text-yellow-500" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {component.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {component.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{component.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Features */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                component.complexity === 'simple' && 'border-green-500/50 text-green-600',
                component.complexity === 'moderate' && 'border-yellow-500/50 text-yellow-600',
                component.complexity === 'complex' && 'border-red-500/50 text-red-600'
              )}
            >
              {component.complexity}
            </Badge>
            {component.interactive && (
              <span className="flex items-center gap-1">
                <Play className="h-3 w-3" />
                Interactive
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <Link href={component.path} className="flex-1">
              <Button size="sm" className="w-full gap-2" onClick={(e) => e.stopPropagation()}>
                <Eye className="h-3 w-3" />
                View Demo
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedComponent(component)
                addToRecent(component.id)
              }}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </Card>
    )
  }

  // Component list item
  const ComponentListItem = ({ component }: { component: ComponentMetadata }) => {
    const isFavorite = favorites.includes(component.id)
    const category = categories.find((cat) => cat.id === component.category)

    return (
      <Card
        className="group cursor-pointer hover:bg-muted/50 transition-colors glass-card border-0"
        onClick={() => {
          setSelectedComponent(component)
          addToRecent(component.id)
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Icon */}
            {category && (
              <div className={cn('icon-container-sm shrink-0', category.color)}>
                <category.icon className="h-4 w-4" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium truncate">{component.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {component.category}
                </Badge>
                {component.status !== 'stable' && (
                  <Badge
                    className={cn(
                      'text-xs',
                      component.status === 'new' && 'bg-green-500',
                      component.status === 'beta' && 'bg-yellow-500'
                    )}
                  >
                    {component.status}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {component.description}
              </p>
            </div>

            {/* Tags */}
            <div className="hidden md:flex flex-wrap gap-1 max-w-xs">
              {component.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(component.id)
                }}
              >
                {isFavorite ? (
                  <BookmarkCheck className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
              <Link href={component.path}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-primary -top-40 -right-40 opacity-20" />
        <div className="orb-violet bottom-40 -left-40 opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Component Gallery"
          description="Browse, search, and explore all 180+ components with live previews"
          icon={Grid3x3}
          badge="180+ Components"
        />

        {/* Search and Filters Bar */}
        <div className="glass-card p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search components by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 shrink-0">
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  Sort by {sortBy}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('name')}>
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('category')}>
                  Category
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('complexity')}>
                  Complexity
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                  {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode */}
            <div className="flex gap-1 shrink-0">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tags Filter */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Filters:</span>
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer gap-1"
                  onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
                >
                  {tag}
                  <span className="ml-1">×</span>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTags([])}
                className="h-6 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Categories */}
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                      selectedCategory === category.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                  >
                    <category.icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {allComponents.filter((c) =>
                        category.id === 'all' ? true : c.category === category.id
                      ).length}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Access */}
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Quick Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="#favorites">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Star className="h-4 w-4" />
                    Favorites
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {favorites.length}
                    </Badge>
                  </Button>
                </Link>
                <Link href="#recent">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Clock className="h-4 w-4" />
                    Recent
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {recentlyViewed.length}
                    </Badge>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 15).map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer text-xs"
                      onClick={() =>
                        setSelectedTags(
                          selectedTags.includes(tag)
                            ? selectedTags.filter((t) => t !== tag)
                            : [...selectedTags, tag]
                        )
                      }
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Components Grid/List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="glass-panel p-1">
                <TabsTrigger value="all" className="gap-2">
                  <Grid3x3 className="h-4 w-4" />
                  All ({filteredComponents.length})
                </TabsTrigger>
                <TabsTrigger value="favorites" className="gap-2">
                  <Star className="h-4 w-4" />
                  Favorites ({favorites.length})
                </TabsTrigger>
                <TabsTrigger value="recent" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Recent ({recentlyViewed.length})
                </TabsTrigger>
              </TabsList>

              {/* All Components */}
              <TabsContent value="all" className="mt-6">
                {filteredComponents.length === 0 ? (
                  <Card className="glass-card border-0">
                    <CardContent className="p-12 text-center">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No components found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Try adjusting your search or filters
                      </p>
                      <Button onClick={() => {
                        setSearchQuery('')
                        setSelectedCategory('all')
                        setSelectedTags([])
                      }}>
                        Clear filters
                      </Button>
                    </CardContent>
                  </Card>
                ) : viewMode === 'grid' ? (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredComponents.map((component) => (
                      <ComponentCard key={component.id} component={component} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredComponents.map((component) => (
                      <ComponentListItem key={component.id} component={component} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Favorites */}
              <TabsContent value="favorites" className="mt-6">
                {favoriteComponents.length === 0 ? (
                  <Card className="glass-card border-0">
                    <CardContent className="p-12 text-center">
                      <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Click the bookmark icon on any component to add it to favorites
                      </p>
                    </CardContent>
                  </Card>
                ) : viewMode === 'grid' ? (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {favoriteComponents.map((component) => (
                      <ComponentCard key={component.id} component={component} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {favoriteComponents.map((component) => (
                      <ComponentListItem key={component.id} component={component} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Recent */}
              <TabsContent value="recent" className="mt-6">
                {recentComponents.length === 0 ? (
                  <Card className="glass-card border-0">
                    <CardContent className="p-12 text-center">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No recent views</h3>
                      <p className="text-sm text-muted-foreground">
                        Components you view will appear here
                      </p>
                    </CardContent>
                  </Card>
                ) : viewMode === 'grid' ? (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {recentComponents.map((component) => (
                      <ComponentCard key={component.id} component={component} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentComponents.map((component) => (
                      <ComponentListItem key={component.id} component={component} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Component Detail Dialog */}
      <Dialog open={!!selectedComponent} onOpenChange={() => setSelectedComponent(null)}>
        <DialogContent className="max-w-3xl">
          {selectedComponent && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <DialogTitle className="text-2xl mb-2">
                      {selectedComponent.name}
                    </DialogTitle>
                    <p className="text-muted-foreground">{selectedComponent.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(selectedComponent.id)}
                  >
                    {favorites.includes(selectedComponent.id) ? (
                      <BookmarkCheck className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                {/* Meta Info */}
                <div className="flex flex-wrap gap-2">
                  <Badge>{selectedComponent.category}</Badge>
                  <Badge variant="outline">{selectedComponent.complexity}</Badge>
                  {selectedComponent.status !== 'stable' && (
                    <Badge
                      className={cn(
                        selectedComponent.status === 'new' && 'bg-green-500',
                        selectedComponent.status === 'beta' && 'bg-yellow-500'
                      )}
                    >
                      {selectedComponent.status}
                    </Badge>
                  )}
                  {selectedComponent.interactive && (
                    <Badge variant="outline" className="gap-1">
                      <Play className="h-3 w-3" />
                      Interactive
                    </Badge>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedComponent.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Features</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {selectedComponent.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <ChevronRight className="h-4 w-4 text-primary" />
                        <span className="capitalize">{feature.replace(/-/g, ' ')}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Link href={selectedComponent.path} className="flex-1">
                    <Button size="lg" className="w-full gap-2">
                      <Eye className="h-4 w-4" />
                      View Full Demo
                    </Button>
                  </Link>
                  <Link href="/chat">
                    <Button variant="outline" size="lg" className="gap-2">
                      <Play className="h-4 w-4" />
                      Try in Playground
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
