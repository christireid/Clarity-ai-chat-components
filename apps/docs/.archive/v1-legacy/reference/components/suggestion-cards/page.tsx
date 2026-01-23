'use client'

import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

const suggestionCardsProps: Prop[] = [
  {
    name: 'cards',
    type: 'SuggestionCard[]',
    required: true,
    description: 'Cards to display in the grid.',
  },
  {
    name: 'onCardClick',
    type: '(card: SuggestionCard) => void',
    description: 'Callback when a card is clicked.',
  },
  {
    name: 'categories',
    type: 'CategoryFilter[]',
    description: 'Available categories for filtering.',
  },
  {
    name: 'selectedCategory',
    type: 'string',
    description: 'Currently selected category ID.',
  },
  {
    name: 'onCategoryChange',
    type: '(categoryId: string | null) => void',
    description: 'Callback when category selection changes.',
  },
  {
    name: 'columns',
    type: '1 | 2 | 3 | 4 | "auto"',
    default: '"auto"',
    description: 'Grid layout column configuration.',
  },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: 'Card size variant.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    default: 'false',
    description: 'Show loading state with skeleton cards.',
  },
  {
    name: 'searchQuery',
    type: 'string',
    description: 'Search query for filtering cards.',
  },
  {
    name: 'showCategoryFilter',
    type: 'boolean',
    default: 'true',
    description: 'Show category filter bar.',
  },
  {
    name: 'maxCards',
    type: 'number',
    description: 'Maximum cards to display before "show more".',
  },
]

export default function SuggestionCardsPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>SuggestionCards</h1>

      <p className="lead">
        A responsive grid of interactive suggestion cards with category filtering, search,
        and animated transitions. Perfect for onboarding, feature discovery, and quick actions.
      </p>

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import { SuggestionCards, useSuggestionCards } from '@clarity-chat/react'
import type { SuggestionCard, CategoryFilter } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}
        language="tsx"
      />

      <h2 id="basic-usage">Basic Usage</h2>

      <EnhancedCodeBlock
        code={`import { SuggestionCards } from '@clarity-chat/react'

function Example() {
  const cards = [
    {
      id: '1',
      icon: '📝',
      title: 'Write Content',
      description: 'Generate blog posts, articles, and creative writing',
      category: 'creation'
    },
    {
      id: '2',
      icon: '🔍',
      title: 'Research',
      description: 'Find and analyze information from multiple sources',
      category: 'analysis'
    },
    {
      id: '3',
      icon: '💻',
      title: 'Code Assistant',
      description: 'Write, debug, and explain code',
      category: 'development',
      badge: 'Popular'
    }
  ]

  return (
    <SuggestionCards
      cards={cards}
      onCardClick={(card) => console.log('Selected:', card.title)}
      columns={3}
    />
  )
}`}
        language="tsx"
      />

      <h2 id="with-categories">With Category Filtering</h2>

      <EnhancedCodeBlock
        code={`const categories = [
  { id: 'creation', label: 'Creation', icon: '✨', count: 5 },
  { id: 'analysis', label: 'Analysis', icon: '📊', count: 3 },
  { id: 'development', label: 'Development', icon: '⚙️', count: 8 }
]

<SuggestionCards
  cards={cards}
  categories={categories}
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
  showCategoryFilter
/>`}
        language="tsx"
      />

      <h2 id="with-hook">With useSuggestionCards Hook</h2>

      <EnhancedCodeBlock
        code={`import { SuggestionCards, useSuggestionCards } from '@clarity-chat/react'

function Example() {
  const {
    cards,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    hasMore,
    showMore,
    resetFilters
  } = useSuggestionCards(allCards, {
    initialCategory: 'creation',
    maxCards: 6
  })

  return (
    <>
      <input
        type="text"
        placeholder="Search suggestions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <SuggestionCards
        cards={cards}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        maxCards={6}
        hasMore={hasMore}
        onShowMore={showMore}
      />
    </>
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="with-search">With Search Filtering</h2>

      <EnhancedCodeBlock
        code={`// Cards can include keywords for better search
const cards = [
  {
    icon: '📝',
    title: 'Blog Writing',
    description: 'Create engaging blog posts',
    keywords: ['write', 'article', 'content', 'blog', 'seo']
  }
]

<SuggestionCards
  cards={cards}
  searchQuery={searchQuery}
  onCardClick={handleClick}
/>`}
        language="tsx"
      />

      <h2 id="badges">With Badges</h2>

      <EnhancedCodeBlock
        code={`const cards = [
  {
    icon: '🆕',
    title: 'New Feature',
    description: 'Try our latest capability',
    badge: 'New'
  },
  {
    icon: '🔥',
    title: 'Popular Choice',
    description: 'Most used by the community',
    badge: 'Popular'
  },
  {
    icon: '⭐',
    title: 'Premium Feature',
    description: 'Advanced functionality',
    badge: 'Pro'
  }
]`}
        language="tsx"
      />

      <h2 id="loading-state">Loading State</h2>

      <EnhancedCodeBlock
        code={`<SuggestionCards
  cards={[]}
  isLoading={true}
  loadingCount={6}
  columns={3}
/>`}
        language="tsx"
      />

      <h2 id="empty-state">Custom Empty State</h2>

      <EnhancedCodeBlock
        code={`<SuggestionCards
  cards={[]}
  emptyState={
    <div className="text-center py-8">
      <p className="text-lg font-medium">No suggestions found</p>
      <p className="text-sm text-muted-foreground">
        Try adjusting your filters or search query
      </p>
    </div>
  }
/>`}
        language="tsx"
      />

      <h2 id="column-layouts">Column Layouts</h2>

      <EnhancedCodeBlock
        code={`// Single column - mobile-friendly
<SuggestionCards cards={cards} columns={1} />

// Two columns
<SuggestionCards cards={cards} columns={2} />

// Three columns
<SuggestionCards cards={cards} columns={3} />

// Four columns - large screens
<SuggestionCards cards={cards} columns={4} />

// Auto-responsive (default)
<SuggestionCards cards={cards} columns="auto" />`}
        language="tsx"
      />

      <h2 id="size-variants">Size Variants</h2>

      <EnhancedCodeBlock
        code={`// Small - compact cards
<SuggestionCards cards={cards} size="sm" />

// Medium - balanced (default)
<SuggestionCards cards={cards} size="md" />

// Large - prominent display
<SuggestionCards cards={cards} size="lg" />`}
        language="tsx"
      />

      <h2 id="props">Props</h2>

      <PropsTable props={suggestionCardsProps} />

      <h2 id="types">Type Definitions</h2>

      <EnhancedCodeBlock
        code={`interface SuggestionCard {
  /** Unique identifier */
  id?: string
  /** Icon (emoji or React node) */
  icon: React.ReactNode
  /** Card title */
  title: string
  /** Card description */
  description?: string
  /** Category for filtering */
  category?: string
  /** Keywords for search */
  keywords?: string[]
  /** Badge text (e.g., "Popular", "New") */
  badge?: string
  /** Whether disabled */
  disabled?: boolean
  /** Custom data to pass through onClick */
  data?: Record<string, unknown>
}

interface CategoryFilter {
  /** Category identifier */
  id: string
  /** Display label */
  label: string
  /** Icon for the category */
  icon?: React.ReactNode
  /** Count of items in this category */
  count?: number
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="accessibility">Accessibility</h2>

      <ul>
        <li>✅ Full keyboard navigation</li>
        <li>✅ ARIA labels and roles</li>
        <li>✅ Focus management</li>
        <li>✅ Disabled state handling</li>
        <li>✅ Reduced motion support</li>
      </ul>

      <h2 id="related">Related</h2>

      <ul>
        <li>
          <a href="/reference/components/prompt-container">PromptContainer</a> - Prompt input wrapper
        </li>
        <li>
          <a href="/reference/components/chat-input">ChatInput</a> - Input component
        </li>
      </ul>
    </>
  )
}
