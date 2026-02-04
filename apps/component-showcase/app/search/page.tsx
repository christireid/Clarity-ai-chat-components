'use client'

import { useState } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ScrollArea,
  Input,
  cn,
} from '@clarity-chat/primitives'
import {
  Search,
  Filter,
  Calendar,
  User,
  Bot,
  Tag,
  Clock,
  X,
  ChevronDown,
  Star,
  MessageSquare,
  FileText,
  Code,
  Image,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

// ============================================================================
// MESSAGE SEARCH DEMO
// ============================================================================
function MessageSearchDemo() {
  const [query, setQuery] = useState('React hooks')

  const results = [
    {
      id: '1',
      content:
        'React Hooks are a powerful feature that allows you to use state...',
      highlight: 'React Hooks',
      from: 'AI Assistant',
      date: 'Today, 10:30 AM',
      conversation: 'React Tutorial',
    },
    {
      id: '2',
      content: 'Can you explain how React hooks work with examples?',
      highlight: 'React hooks',
      from: 'You',
      date: 'Today, 10:29 AM',
      conversation: 'React Tutorial',
    },
    {
      id: '3',
      content:
        'The most commonly used React hooks include useState, useEffect...',
      highlight: 'React hooks',
      from: 'AI Assistant',
      date: 'Yesterday, 3:45 PM',
      conversation: 'Learning React',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Message Search</CardTitle>
        <CardDescription>
          Search across all conversations with highlighting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search messages..."
              className="pl-9 pr-20"
            />
            {query && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {results.length} results
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => setQuery('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="space-y-2">
            {results.map((result) => (
              <div
                key={result.id}
                className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm">
                      {result.content
                        .split(result.highlight)
                        .map((part, i, arr) => (
                          <span key={i}>
                            {part}
                            {i < arr.length - 1 && (
                              <mark className="bg-yellow-200 dark:bg-yellow-900 px-0.5 rounded">
                                {result.highlight}
                              </mark>
                            )}
                          </span>
                        ))}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {result.from === 'You' ? (
                          <User className="h-3 w-3" />
                        ) : (
                          <Bot className="h-3 w-3" />
                        )}
                        {result.from}
                      </span>
                      <span>•</span>
                      <span>{result.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {result.conversation}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SEARCH FILTERS DEMO
// ============================================================================
function SearchFiltersDemo() {
  const [activeFilters, setActiveFilters] = useState<string[]>(['date'])

  const filters = [
    {
      id: 'date',
      label: 'Date Range',
      icon: <Calendar className="h-4 w-4" />,
      value: 'Last 7 days',
    },
    {
      id: 'from',
      label: 'From',
      icon: <User className="h-4 w-4" />,
      value: 'All',
    },
    {
      id: 'type',
      label: 'Content Type',
      icon: <FileText className="h-4 w-4" />,
      value: 'All types',
    },
    {
      id: 'conversation',
      label: 'Conversation',
      icon: <MessageSquare className="h-4 w-4" />,
      value: 'All',
    },
  ]

  const contentTypes = [
    {
      id: 'text',
      label: 'Text',
      icon: <FileText className="h-4 w-4" />,
      count: 234,
    },
    {
      id: 'code',
      label: 'Code',
      icon: <Code className="h-4 w-4" />,
      count: 56,
    },
    {
      id: 'images',
      label: 'Images',
      icon: <Image className="h-4 w-4" />,
      count: 12,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Search Filters</CardTitle>
        <CardDescription>
          Filter search results by various criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={
                  activeFilters.includes(filter.id) ? 'default' : 'outline'
                }
                size="sm"
                className="gap-2"
                onClick={() =>
                  setActiveFilters((prev) =>
                    prev.includes(filter.id)
                      ? prev.filter((f) => f !== filter.id)
                      : [...prev, filter.id]
                  )
                }
              >
                {filter.icon}
                {filter.label}
                <ChevronDown className="h-3 w-3" />
              </Button>
            ))}
          </div>

          {/* Content Type Filter */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Content Type</h4>
            <div className="grid grid-cols-3 gap-2">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  className="flex items-center gap-2 p-3 border rounded-lg hover:bg-background transition-colors"
                >
                  {type.icon}
                  <span className="text-sm">{type.label}</span>
                  <Badge variant="secondary" className="text-xs ml-auto">
                    {type.count}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Active filters:
            </span>
            <Badge variant="secondary" className="gap-1">
              Last 7 days
              <X className="h-3 w-3 cursor-pointer" />
            </Badge>
            <Button variant="ghost" size="sm" className="text-xs h-6">
              Clear all
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SEMANTIC SEARCH DEMO
// ============================================================================
function SemanticSearchDemo() {
  const [query, setQuery] = useState('')

  const semanticResults = [
    {
      id: '1',
      content: "Here's how to implement a custom hook for API fetching...",
      relevance: 95,
      tags: ['hooks', 'api', 'data fetching'],
    },
    {
      id: '2',
      content:
        'The useQuery hook from React Query is similar to what you described...',
      relevance: 87,
      tags: ['react-query', 'hooks'],
    },
    {
      id: '3',
      content: 'For handling async operations in React, consider using...',
      relevance: 78,
      tags: ['async', 'react', 'best practices'],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Semantic Search</CardTitle>
        <CardDescription>
          AI-powered search that understands meaning
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe what you're looking for..."
              className="pl-9"
            />
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Using AI to find semantically similar content
          </div>

          {/* Results with Relevance */}
          <div className="space-y-2">
            {semanticResults.map((result) => (
              <div
                key={result.id}
                className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {result.relevance}%
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{result.content}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// RECENT SEARCHES DEMO
// ============================================================================
function RecentSearchesDemo() {
  const recentSearches = [
    { query: 'React hooks tutorial', count: 5, date: '2 hours ago' },
    { query: 'API error handling', count: 3, date: 'Yesterday' },
    { query: 'TypeScript generics', count: 8, date: '2 days ago' },
    { query: 'CSS grid layout', count: 2, date: '3 days ago' },
  ]

  const savedSearches = [
    { query: 'authentication flow', starred: true },
    { query: 'database optimization', starred: true },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Search History</CardTitle>
        <CardDescription>Recent and saved searches</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Saved Searches */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Saved Searches
            </h4>
            <div className="space-y-1">
              {savedSearches.map((search, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm flex-1 text-left">
                    {search.query}
                  </span>
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Searches
              </h4>
              <Button variant="ghost" size="sm" className="text-xs h-6">
                Clear all
              </Button>
            </div>
            <div className="space-y-1">
              {recentSearches.map((search, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm flex-1 text-left">
                    {search.query}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {search.count} results
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {search.date}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function SearchPage() {
  return (
    <div className="space-y-8 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-violet -top-40 -right-40 opacity-20" />
        <div className="orb-cyan bottom-40 -left-40 opacity-20" />
      </div>

      <PageHeader
        title="Search"
        description="Message search, filters, and semantic search"
        icon={Search}
        badge="6+ Components"
      />

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2 p-1 glass-panel">
          <TabsTrigger value="messages">Message Search</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="semantic">Semantic Search</TabsTrigger>
          <TabsTrigger value="history">Search History</TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <ComponentSection
            title="Message Search"
            description="Full-text search with highlighting"
          >
            <MessageSearchDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="filters">
          <ComponentSection
            title="Search Filters"
            description="Advanced filtering options"
          >
            <SearchFiltersDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="semantic">
          <ComponentSection
            title="Semantic Search"
            description="AI-powered contextual search"
          >
            <SemanticSearchDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="history">
          <ComponentSection
            title="Search History"
            description="Recent and saved searches"
          >
            <RecentSearchesDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
