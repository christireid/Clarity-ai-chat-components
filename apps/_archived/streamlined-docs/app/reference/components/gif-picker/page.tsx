'use client'

/**
 * GifPicker Component - API Reference Documentation
 *
 * Animated GIF picker with Tenor/Giphy integration, trending GIFs, and search
 * for rich multimedia messaging in chat interfaces.
 */

import * as React from 'react'
import { useState } from 'react'
import {
  Image,
  Search,
  TrendingUp,
  Zap,
  Shield,
  Code,
  Database,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { DocumentationPage } from '../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../components/Docs/Section'
import { SubSection } from '../../../../components/Docs/Section'
import { PropsTable, type PropDefinition } from '../../../../components/Docs/PropsTable'
import { CodeBlock } from '../../../../components/Docs/CodeBlock'
import { cn } from '../../../../lib/utils'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

// ============================================================================
// Page Configuration
// ============================================================================

const features = [
  {
    icon: Database,
    label: 'Tenor/Giphy APIs',
    description: 'Multiple provider support',
  },
  {
    icon: TrendingUp,
    label: 'Trending GIFs',
    description: 'Popular GIFs updated hourly',
  },
  {
    icon: Search,
    label: 'Search',
    description: 'Fast search with auto-complete',
  },
  {
    icon: Zap,
    label: 'Preview',
    description: 'Hover to preview animation',
  },
]

const tableOfContents = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'installation', title: 'Installation', level: 2 },
  { id: 'demo', title: 'Live Demo', level: 2 },
  { id: 'basic-usage', title: 'Basic Usage', level: 2 },
  {
    id: 'props',
    title: 'Props Reference',
    level: 2,
    children: [
      { id: 'core-props', title: 'Core Props', level: 3 },
      { id: 'api-props', title: 'API Configuration', level: 3 },
      { id: 'search-props', title: 'Search Settings', level: 3 },
      { id: 'ui-props', title: 'UI Customization', level: 3 },
    ],
  },
  { id: 'provider-comparison', title: 'Provider Comparison', level: 2 },
  { id: 'api-keys', title: 'API Keys Setup', level: 2 },
  { id: 'examples', title: 'Code Examples', level: 2 },
  { id: 'rate-limiting', title: 'Rate Limiting', level: 2 },
  { id: 'accessibility', title: 'Accessibility', level: 2 },
  { id: 'related', title: 'Related', level: 2 },
]

const relatedAPIs = [
  {
    name: 'FileUpload',
    type: 'component' as const,
    description: 'File upload component for sending media attachments',
    href: '/reference/components/file-upload',
  },
  {
    name: 'ChatInput',
    type: 'component' as const,
    description: 'Text input component that can integrate GIF picker',
    href: '/reference/components/chat-input',
  },
  {
    name: 'EmojiPicker',
    type: 'component' as const,
    description: 'Emoji picker for expressive messaging',
    href: '/reference/components/emoji-picker',
  },
]

const footerNavigation = [
  {
    label: 'EmojiPicker',
    href: '/reference/components/emoji-picker',
    direction: 'previous' as const,
  },
  {
    label: 'FileUpload',
    href: '/reference/components/file-upload',
    direction: 'next' as const,
  },
]

// ============================================================================
// Props Data
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'onSelect',
    type: '(gif: GifObject) => void',
    required: true,
    description:
      'Callback fired when a GIF is selected. Receives a GifObject containing URL, dimensions, and metadata.',
  },
  {
    name: 'provider',
    type: "'tenor' | 'giphy'",
    default: "'tenor'",
    description: 'GIF provider to use for fetching and searching GIFs.',
  },
  {
    name: 'open',
    type: 'boolean',
    default: 'false',
    description: 'Control picker visibility (for controlled components).',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Callback when picker visibility changes.',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    default: 'false',
    description: 'Initial open state for uncontrolled picker.',
  },
]

const apiProps: PropDefinition[] = [
  {
    name: 'tenorApiKey',
    type: 'string',
    description: 'Tenor API key (required if provider="tenor"). Get from developers.google.com/tenor',
  },
  {
    name: 'giphyApiKey',
    type: 'string',
    description: 'Giphy API key (required if provider="giphy"). Get from developers.giphy.com',
  },
  {
    name: 'locale',
    type: 'string',
    default: "'en_US'",
    description: 'Locale for search results and trending GIFs (e.g., "en_US", "es_ES", "ja_JP").',
  },
  {
    name: 'contentFilter',
    type: "'off' | 'low' | 'medium' | 'high'",
    default: "'medium'",
    description: 'Content filtering level for safe content. "high" filters most aggressively.',
  },
  {
    name: 'limit',
    type: 'number',
    default: '50',
    description: 'Maximum number of GIFs to fetch per request (1-50 for Tenor, 1-100 for Giphy).',
  },
]

const searchProps: PropDefinition[] = [
  {
    name: 'searchEnabled',
    type: 'boolean',
    default: 'true',
    description: 'Enable search functionality.',
  },
  {
    name: 'searchPlaceholder',
    type: 'string',
    default: "'Search GIFs...'",
    description: 'Placeholder text for search input.',
  },
  {
    name: 'searchAutoFocus',
    type: 'boolean',
    default: 'true',
    description: 'Auto-focus search input when picker opens.',
  },
  {
    name: 'searchDebounceMs',
    type: 'number',
    default: '300',
    description: 'Debounce delay for search queries in milliseconds.',
  },
  {
    name: 'suggestedSearches',
    type: 'string[]',
    description: 'Array of suggested search terms to display (e.g., ["happy", "excited", "thumbs up"]).',
  },
  {
    name: 'onSearchChange',
    type: '(query: string) => void',
    description: 'Callback when search query changes.',
  },
]

const uiProps: PropDefinition[] = [
  {
    name: 'showTrending',
    type: 'boolean',
    default: 'true',
    description: 'Show trending GIFs when no search query is active.',
  },
  {
    name: 'columns',
    type: 'number',
    default: '3',
    description: 'Number of columns in GIF grid (2-5).',
  },
  {
    name: 'width',
    type: 'number | string',
    default: '400',
    description: 'Picker width in pixels or CSS value.',
  },
  {
    name: 'height',
    type: 'number | string',
    default: '500',
    description: 'Picker height in pixels or CSS value.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the picker container.',
  },
  {
    name: 'theme',
    type: "'light' | 'dark' | 'auto'",
    default: "'auto'",
    description: 'Color theme for the picker.',
  },
  {
    name: 'showAttribution',
    type: 'boolean',
    default: 'true',
    description: 'Show "Powered by Tenor/Giphy" attribution (required by API terms).',
  },
]

// ============================================================================
// Live Demo Component
// ============================================================================

interface MockGif {
  id: string
  title: string
  url: string
  preview: string
  width: number
  height: number
}

function LiveDemo() {
  const [selectedGif, setSelectedGif] = useState<MockGif | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [provider, setProvider] = useState<'tenor' | 'giphy'>('tenor')
  const [showTrending, setShowTrending] = useState(true)

  // Mock GIF data
  const mockGifs: MockGif[] = [
    {
      id: '1',
      title: 'Happy Dance',
      url: 'https://media.tenor.com/...',
      preview: 'https://media.tenor.com/.../preview',
      width: 498,
      height: 280,
    },
    {
      id: '2',
      title: 'Thumbs Up',
      url: 'https://media.tenor.com/...',
      preview: 'https://media.tenor.com/.../preview',
      width: 498,
      height: 280,
    },
    {
      id: '3',
      title: 'Excited',
      url: 'https://media.tenor.com/...',
      preview: 'https://media.tenor.com/.../preview',
      width: 498,
      height: 280,
    },
    {
      id: '4',
      title: 'Clapping',
      url: 'https://media.tenor.com/...',
      preview: 'https://media.tenor.com/.../preview',
      width: 498,
      height: 280,
    },
    {
      id: '5',
      title: 'Mind Blown',
      url: 'https://media.tenor.com/...',
      preview: 'https://media.tenor.com/.../preview',
      width: 498,
      height: 280,
    },
    {
      id: '6',
      title: 'High Five',
      url: 'https://media.tenor.com/...',
      preview: 'https://media.tenor.com/.../preview',
      width: 498,
      height: 280,
    },
  ]

  const filteredGifs = searchQuery
    ? mockGifs.filter((gif) => gif.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : mockGifs

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Provider:</label>
          <div className="flex gap-1">
            <button
              onClick={() => setProvider('tenor')}
              className={cn(
                'px-3 py-1 rounded text-sm transition-colors',
                provider === 'tenor'
                  ? 'bg-brand-500 text-white'
                  : 'bg-muted hover:bg-muted/70 text-muted-foreground'
              )}
            >
              Tenor
            </button>
            <button
              onClick={() => setProvider('giphy')}
              className={cn(
                'px-3 py-1 rounded text-sm transition-colors',
                provider === 'giphy'
                  ? 'bg-brand-500 text-white'
                  : 'bg-muted hover:bg-muted/70 text-muted-foreground'
              )}
            >
              Giphy
            </button>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showTrending}
            onChange={(e) => setShowTrending(e.target.checked)}
            className="rounded"
          />
          Show Trending
        </label>
        {selectedGif && (
          <div className="ml-auto text-sm">
            Selected: <span className="font-medium">{selectedGif.title}</span>
          </div>
        )}
      </div>

      {/* GIF Picker Demo */}
      <div className="relative rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        {/* Search Bar */}
        <div className="p-3 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search GIFs..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border/50 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>
        </div>

        {/* Trending/Search Label */}
        <div className="px-3 py-2 bg-muted/20 border-b border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {searchQuery ? (
              <>
                <Search className="w-4 h-4" />
                Search results for "{searchQuery}"
              </>
            ) : showTrending ? (
              <>
                <TrendingUp className="w-4 h-4" />
                Trending GIFs
              </>
            ) : (
              <>
                <Image className="w-4 h-4" />
                All GIFs
              </>
            )}
          </div>
        </div>

        {/* GIF Grid */}
        <div className="h-[400px] overflow-y-auto p-3 bg-background/50">
          {filteredGifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Search className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No GIFs found</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {filteredGifs.map((gif) => (
                <button
                  key={gif.id}
                  onClick={() => setSelectedGif(gif)}
                  className={cn(
                    'relative aspect-video rounded-lg overflow-hidden',
                    'bg-muted hover:ring-2 hover:ring-brand-500/50 transition-all',
                    selectedGif?.id === gif.id && 'ring-2 ring-brand-500'
                  )}
                  aria-label={`Select ${gif.title}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                    {gif.title}
                  </div>
                  {/* In real implementation, this would be an animated GIF */}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Attribution */}
        <div className="px-3 py-2 bg-muted/20 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            Powered by {provider === 'tenor' ? 'Tenor' : 'Giphy'}
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Provider Comparison Table
// ============================================================================

function ProviderComparisonTable() {
  const features = [
    {
      feature: 'API Key Required',
      tenor: 'Yes (Free)',
      giphy: 'Yes (Free)',
    },
    {
      feature: 'Rate Limit (Free)',
      tenor: '1M requests/month',
      giphy: '1000 requests/day',
    },
    {
      feature: 'Content Library',
      tenor: '12B+ GIFs',
      giphy: '10B+ GIFs',
    },
    {
      feature: 'Search Quality',
      tenor: 'Excellent',
      giphy: 'Excellent',
    },
    {
      feature: 'Trending GIFs',
      tenor: 'Yes',
      giphy: 'Yes',
    },
    {
      feature: 'Categories',
      tenor: 'Yes',
      giphy: 'Yes',
    },
    {
      feature: 'Content Filtering',
      tenor: 'Yes (4 levels)',
      giphy: 'Yes (G, PG, PG-13, R)',
    },
    {
      feature: 'Attribution Required',
      tenor: 'Yes',
      giphy: 'Yes',
    },
    {
      feature: 'Localization',
      tenor: '100+ languages',
      giphy: '100+ languages',
    },
    {
      feature: 'Response Format',
      tenor: 'JSON',
      giphy: 'JSON',
    },
  ]

  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">Feature</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Tenor</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Giphy</th>
          </tr>
        </thead>
        <tbody>
          {features.map((item, index) => (
            <tr
              key={item.feature}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              )}
            >
              <td className="px-4 py-3 font-medium text-foreground">{item.feature}</td>
              <td className="px-4 py-3 text-muted-foreground">{item.tenor}</td>
              <td className="px-4 py-3 text-muted-foreground">{item.giphy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Code Examples
// ============================================================================

const basicUsageCode = `import { GifPicker } from '@clarity-chat/react'
import { useState } from 'react'

function MyGifPicker() {
  const [selectedGif, setSelectedGif] = useState<GifObject | null>(null)

  const handleGifSelect = (gif: GifObject) => {
    console.log('Selected GIF:', gif)
    setSelectedGif(gif)
    // gif.url - Full-size GIF URL
    // gif.preview - Preview/thumbnail URL
    // gif.width - Original width
    // gif.height - Original height
    // gif.title - GIF title/description
  }

  return (
    <div>
      <GifPicker
        provider="tenor"
        tenorApiKey={process.env.NEXT_PUBLIC_TENOR_API_KEY}
        onSelect={handleGifSelect}
      />
      {selectedGif && (
        <img src={selectedGif.url} alt={selectedGif.title} />
      )}
    </div>
  )
}`

const tenorIntegrationCode = `import { GifPicker } from '@clarity-chat/react'

function TenorGifPicker() {
  return (
    <GifPicker
      provider="tenor"
      tenorApiKey={process.env.NEXT_PUBLIC_TENOR_API_KEY}
      onSelect={(gif) => console.log(gif)}

      // Search configuration
      searchEnabled={true}
      searchAutoFocus={true}
      searchDebounceMs={300}
      suggestedSearches={['happy', 'excited', 'celebrate', 'thumbs up']}

      // Content filtering
      contentFilter="medium"
      locale="en_US"

      // UI customization
      showTrending={true}
      columns={3}
      width={400}
      height={500}
      showAttribution={true}
    />
  )
}`

const giphyIntegrationCode = `import { GifPicker } from '@clarity-chat/react'

function GiphyGifPicker() {
  return (
    <GifPicker
      provider="giphy"
      giphyApiKey={process.env.NEXT_PUBLIC_GIPHY_API_KEY}
      onSelect={(gif) => console.log(gif)}

      // Giphy-specific rating
      contentFilter="pg"  // g, pg, pg-13, r

      // Search configuration
      searchEnabled={true}
      searchPlaceholder="Search Giphy..."
      suggestedSearches={['funny', 'reaction', 'cat', 'meme']}

      // UI configuration
      showTrending={true}
      columns={3}
      width={400}
      height={500}
    />
  )
}`

const inlinePickerCode = `import { GifPicker } from '@clarity-chat/react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Image } from 'lucide-react'
import { useState } from 'react'

function InlineGifPicker() {
  const [open, setOpen] = useState(false)
  const [gifUrl, setGifUrl] = useState('')

  const handleGifSelect = (gif: GifObject) => {
    setGifUrl(gif.url)
    setOpen(false) // Close picker after selection
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={gifUrl}
        readOnly
        placeholder="No GIF selected"
        className="flex-1 px-3 py-2 rounded-lg border"
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="p-2 rounded-lg hover:bg-muted"
            aria-label="Add GIF"
          >
            <Image className="w-5 h-5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto" align="end">
          <GifPicker
            provider="tenor"
            tenorApiKey={process.env.NEXT_PUBLIC_TENOR_API_KEY}
            onSelect={handleGifSelect}
            width={380}
            height={450}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}`

const typescriptCode = `// GIF object type
interface GifObject {
  id: string                 // Unique identifier
  url: string               // Full-size GIF URL
  preview: string           // Preview/thumbnail URL
  width: number             // Original width
  height: number            // Original height
  title: string             // GIF title/description
  tags?: string[]           // Search tags
  created?: string          // Creation date (ISO 8601)
}

// Picker props
interface GifPickerProps {
  // Core
  onSelect: (gif: GifObject) => void
  provider: 'tenor' | 'giphy'

  // API Configuration
  tenorApiKey?: string
  giphyApiKey?: string
  locale?: string
  contentFilter?: 'off' | 'low' | 'medium' | 'high'
  limit?: number

  // Search
  searchEnabled?: boolean
  searchPlaceholder?: string
  searchAutoFocus?: boolean
  searchDebounceMs?: number
  suggestedSearches?: string[]
  onSearchChange?: (query: string) => void

  // UI
  showTrending?: boolean
  columns?: number
  width?: number | string
  height?: number | string
  className?: string
  theme?: 'light' | 'dark' | 'auto'
  showAttribution?: boolean

  // Visibility
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function GifPickerPage() {
  return (
    <DocumentationPage
      title="GifPicker"
      description="Animated GIF picker with Tenor/Giphy integration, trending GIFs, and search for rich multimedia messaging"
      icon={Image}
      badges={[{ label: 'Beta', variant: 'beta' }]}
      packageName="@clarity-chat/react"
      features={features}
      tableOfContents={tableOfContents}
      relatedAPIs={relatedAPIs}
      footerNavigation={footerNavigation}
    >
      {/* Overview */}
      <Section id="overview" title="Overview">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            <code>GifPicker</code> is a comprehensive GIF selection component with support for
            both Tenor and Giphy APIs. It provides trending GIFs, fast search, and seamless
            integration for chat applications and messaging interfaces.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">Key Features</h4>
          <ul className="space-y-2">
            <li>
              <strong>Dual Provider Support:</strong> Choose between Tenor and Giphy APIs
            </li>
            <li>
              <strong>Trending GIFs:</strong> Display popular GIFs updated hourly
            </li>
            <li>
              <strong>Fast Search:</strong> Debounced search with suggested terms
            </li>
            <li>
              <strong>Preview on Hover:</strong> Smooth GIF previews before selection
            </li>
            <li>
              <strong>Content Filtering:</strong> Multiple safety levels for appropriate content
            </li>
            <li>
              <strong>Localization:</strong> Support for 100+ languages
            </li>
            <li>
              <strong>Responsive Grid:</strong> Configurable columns (2-5)
            </li>
            <li>
              <strong>Rate Limit Handling:</strong> Built-in retry and error handling
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">When to Use</h4>
          <ul className="space-y-2">
            <li>Chat applications requiring rich media messaging</li>
            <li>Social media platforms with GIF reactions</li>
            <li>Comment systems with multimedia support</li>
            <li>Customer support chat with expressive responses</li>
            <li>Any interface where animated GIFs enhance communication</li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Best Practices</h4>
          <ul className="space-y-2">
            <li>Always enable content filtering for public-facing applications</li>
            <li>Show attribution as required by API terms of service</li>
            <li>Implement rate limiting and error handling</li>
            <li>Use suggested searches to guide users</li>
            <li>Consider caching popular GIFs to reduce API calls</li>
          </ul>
        </div>
      </Section>

      {/* Installation */}
      <Section id="installation" title="Installation">
        <div className="space-y-4">
          <CodeBlock
            code="npm install @clarity-chat/react"
            language="bash"
            filename="Terminal"
            showDownloadButton={false}
          />

          <p className="text-muted-foreground">Import the component:</p>

          <CodeBlock
            code={`import { GifPicker } from '@clarity-chat/react'
import type { GifObject } from '@clarity-chat/react'`}
            language="tsx"
            filename="App.tsx"
            showDownloadButton={false}
          />
        </div>
      </Section>

      {/* Live Demo */}
      <Section id="demo" title="Live Demo">
        <p className="text-muted-foreground mb-6">
          Interact with the GifPicker component. Try switching providers, searching, and
          selecting GIFs.
        </p>

        <LiveDemo />
      </Section>

      {/* Basic Usage */}
      <Section id="basic-usage" title="Basic Usage">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            The simplest implementation requires a provider, API key, and selection callback:
          </p>

          <CodeBlock code={basicUsageCode} language="tsx" filename="GifPicker.tsx" />
        </div>
      </Section>

      {/* Props API */}
      <Section id="props" title="Props Reference">
        <SubSection id="core-props" title="Core Props">
          <PropsTable props={coreProps} />
        </SubSection>

        <SubSection id="api-props" title="API Configuration">
          <p className="text-sm text-muted-foreground mb-4">
            Configure API provider settings and content filtering:
          </p>
          <PropsTable props={apiProps} />
        </SubSection>

        <SubSection id="search-props" title="Search Settings">
          <p className="text-sm text-muted-foreground mb-4">
            Customize search functionality and suggestions:
          </p>
          <PropsTable props={searchProps} />
        </SubSection>

        <SubSection id="ui-props" title="UI Customization">
          <p className="text-sm text-muted-foreground mb-4">
            Customize appearance and layout:
          </p>
          <PropsTable props={uiProps} />
        </SubSection>
      </Section>

      {/* Provider Comparison */}
      <Section id="provider-comparison" title="Provider Comparison">
        <p className="text-muted-foreground mb-4">
          Both Tenor and Giphy offer excellent GIF APIs with similar features. Choose based on
          your specific needs:
        </p>

        <ProviderComparisonTable />

        <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-muted-foreground">
            <strong>Recommendation:</strong> Tenor offers higher rate limits on the free tier (1M
            requests/month vs 1000/day), making it better for production applications. Giphy has a
            slightly larger library and may have better coverage for certain types of content.
          </p>
        </div>
      </Section>

      {/* API Keys Setup */}
      <Section id="api-keys" title="API Keys Setup">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Getting a Tenor API Key</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                Visit{' '}
                <a
                  href="https://developers.google.com/tenor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-500 hover:underline"
                >
                  developers.google.com/tenor
                </a>
              </li>
              <li>Sign in with your Google account</li>
              <li>Click "Get API Key" and accept the terms of service</li>
              <li>Copy your API key (it starts with "AIza...")</li>
              <li>
                Add to your <code>.env.local</code> file:
              </li>
            </ol>
            <CodeBlock
              code="NEXT_PUBLIC_TENOR_API_KEY=AIza..."
              language="bash"
              filename=".env.local"
              className="mt-3"
              showDownloadButton={false}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Getting a Giphy API Key</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                Visit{' '}
                <a
                  href="https://developers.giphy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-500 hover:underline"
                >
                  developers.giphy.com
                </a>
              </li>
              <li>Create a Giphy account or sign in</li>
              <li>Go to "Create an App" in the dashboard</li>
              <li>Choose "API" as the product and submit</li>
              <li>Copy your API key</li>
              <li>
                Add to your <code>.env.local</code> file:
              </li>
            </ol>
            <CodeBlock
              code="NEXT_PUBLIC_GIPHY_API_KEY=your_giphy_key_here"
              language="bash"
              filename=".env.local"
              className="mt-3"
              showDownloadButton={false}
            />
          </div>

          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-1">
                  Security Note
                </h4>
                <p className="text-sm text-muted-foreground">
                  API keys prefixed with <code>NEXT_PUBLIC_</code> are exposed to the client.
                  For production, consider proxying API requests through your backend to keep keys
                  secure and implement rate limiting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Code Examples */}
      <Section id="examples" title="Code Examples">
        <div className="space-y-8">
          <div>
            <h4 className="font-semibold mb-3">Basic Usage</h4>
            <CodeBlock code={basicUsageCode} language="tsx" filename="BasicPicker.tsx" />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Tenor Integration</h4>
            <CodeBlock code={tenorIntegrationCode} language="tsx" filename="TenorPicker.tsx" />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Giphy Integration</h4>
            <CodeBlock code={giphyIntegrationCode} language="tsx" filename="GiphyPicker.tsx" />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Inline Picker with Popover</h4>
            <CodeBlock code={inlinePickerCode} language="tsx" filename="InlinePicker.tsx" />
          </div>

          <div>
            <h4 className="font-semibold mb-3">TypeScript Types</h4>
            <CodeBlock code={typescriptCode} language="tsx" filename="types.ts" />
          </div>
        </div>
      </Section>

      {/* Rate Limiting */}
      <Section id="rate-limiting" title="Rate Limiting">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h4 className="text-lg font-semibold mt-6 mb-3">Understanding Rate Limits</h4>
          <p>Both Tenor and Giphy enforce rate limits on their free tiers:</p>

          <ul className="space-y-2">
            <li>
              <strong>Tenor:</strong> 1 million requests per month (~33,000/day)
            </li>
            <li>
              <strong>Giphy:</strong> 1,000 requests per day (~42/hour)
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Best Practices</h4>
          <ul className="space-y-2">
            <li>
              <strong>Implement Caching:</strong> Cache popular/trending GIFs to reduce API calls
            </li>
            <li>
              <strong>Debounce Search:</strong> Use the built-in <code>searchDebounceMs</code>{' '}
              prop (default 300ms)
            </li>
            <li>
              <strong>Limit Results:</strong> Set a reasonable <code>limit</code> prop (default
              50)
            </li>
            <li>
              <strong>Monitor Usage:</strong> Track API usage in your analytics
            </li>
            <li>
              <strong>Handle Errors:</strong> Implement graceful degradation when rate limited
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Server-Side Proxy Pattern</h4>
          <p>For production applications, proxy API requests through your backend:</p>

          <CodeBlock
            code={`// app/api/gif-search/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const provider = searchParams.get('provider') || 'tenor'

  // Implement rate limiting per user/IP
  const rateLimitKey = \`gif:\${getUserId()}:\${Date.now()}\`
  // ... rate limit logic ...

  // Forward request to Tenor/Giphy
  const apiKey = provider === 'tenor'
    ? process.env.TENOR_API_KEY
    : process.env.GIPHY_API_KEY

  const response = await fetch(\`https://api.tenor.com/v1/search?q=\${query}&key=\${apiKey}\`)
  const data = await response.json()

  return Response.json(data)
}`}
            language="tsx"
            filename="route.ts"
          />
        </div>
      </Section>

      {/* Accessibility */}
      <Section id="accessibility" title="Accessibility">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h4 className="text-lg font-semibold mt-6 mb-3">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Tab</kbd> - Navigate between
              search and GIF grid
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Arrow Keys</kbd> - Navigate GIF
              grid
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Enter</kbd> - Select focused GIF
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Escape</kbd> - Close picker
              (when in popover)
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Home/End</kbd> - Jump to
              first/last GIF
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>All GIFs have descriptive alt text from title metadata</li>
            <li>
              Search input has <code>role="searchbox"</code> and <code>aria-label</code>
            </li>
            <li>
              GIF grid uses <code>role="grid"</code> with proper navigation
            </li>
            <li>Loading states announced with aria-live regions</li>
            <li>Error messages announced immediately</li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">WCAG 2.1 AA Compliance</h4>
          <ul className="space-y-2">
            <li>All interactive elements have 44x44px touch targets</li>
            <li>Focus indicators visible on all focusable elements</li>
            <li>Color contrast meets AA standards (4.5:1 minimum)</li>
            <li>No keyboard traps</li>
            <li>Respects prefers-reduced-motion</li>
          </ul>
        </div>
      </Section>
    </DocumentationPage>
  )
}
