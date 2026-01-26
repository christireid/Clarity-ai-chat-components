/**
 * Documentation Components Examples
 *
 * Comprehensive examples demonstrating all documentation UI components
 */

import * as React from 'react'
import {
  APICard,
  APICardGrid,
  CodeBlock,
  InlineCode,
  ExampleSection,
  ExampleGrid,
  RelatedAPIs,
  RelatedAPIsCompact,
  DocsSidebar,
  SearchBar,
  DocPage,
  TwoColumnLayout,
  CopyButton,
  CopyButtonWithContent,
  ToggleCode,
  ToggleCodeGroup,
  type APIMetadata,
  type NavItem,
  type SearchResult,
} from './index'

// ============================================================================
// Sample Data
// ============================================================================

export const sampleAPIs: APIMetadata[] = [
  {
    slug: 'use-chat',
    name: 'useChat',
    type: 'hook',
    description: 'Main hook for managing chat state and streaming responses',
    category: 'Core Hooks',
    isNew: true,
    tags: ['chat', 'state', 'streaming'],
  },
  {
    slug: 'chat-window',
    name: 'ChatWindow',
    type: 'component',
    description: 'Complete chat interface with messages, input, and controls',
    category: 'Core Components',
    tags: ['chat', 'ui', 'messages'],
  },
  {
    slug: 'format-message',
    name: 'formatMessage',
    type: 'utility',
    description: 'Format and sanitize chat messages for display',
    category: 'Utilities',
    tags: ['formatting', 'sanitization'],
  },
  {
    slug: 'use-messages',
    name: 'useMessages',
    type: 'hook',
    description: 'Hook for managing message history and pagination',
    category: 'Core Hooks',
    isExperimental: true,
    tags: ['messages', 'history'],
  },
  {
    slug: 'markdown-renderer',
    name: 'MarkdownRenderer',
    type: 'component',
    description: 'Render markdown content with syntax highlighting',
    category: 'UI Components',
    isDeprecated: true,
    tags: ['markdown', 'rendering'],
  },
]

export const sampleNavItems: NavItem[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Quick Start', href: '/docs/quick-start', isNew: true },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { title: 'Architecture', href: '/docs/architecture' },
      { title: 'State Management', href: '/docs/state' },
      { title: 'Streaming', href: '/docs/streaming', isExperimental: true },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { title: 'Components', href: '/api/components' },
      { title: 'Hooks', href: '/api/hooks' },
      { title: 'Utilities', href: '/api/utilities' },
    ],
  },
]

export const sampleSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'useChat Hook',
    description: 'Main hook for managing chat state and interactions',
    href: '/api/use-chat',
    category: 'Hooks',
    type: 'hook',
    breadcrumb: ['API', 'Hooks', 'useChat'],
  },
  {
    id: '2',
    title: 'ChatWindow Component',
    description: 'Complete chat interface component',
    href: '/api/chat-window',
    category: 'Components',
    type: 'component',
    breadcrumb: ['API', 'Components', 'ChatWindow'],
  },
  {
    id: '3',
    title: 'Getting Started Guide',
    description: 'Learn the basics of Clarity Chat',
    href: '/docs/getting-started',
    category: 'Guides',
    type: 'guide',
    breadcrumb: ['Documentation', 'Getting Started'],
  },
]

const sampleCode = `import { useChat } from '@clarity-chat/react'

export function ChatDemo() {
  const { messages, sendMessage, isLoading } = useChat({
    apiEndpoint: '/api/chat',
    model: 'claude-3-5-sonnet-20241022'
  })

  return (
    <div className="chat-container">
      {messages.map((message) => (
        <div key={message.id} className="message">
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  )
}`

// ============================================================================
// Example Components
// ============================================================================

export function APICardExample() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Single API Card</h3>
        <APICard api={sampleAPIs[0]} />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">API Card Grid</h3>
        <APICardGrid apis={sampleAPIs} />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Filtered by Type</h3>
        <APICardGrid apis={sampleAPIs} filterType="hook" />
      </div>
    </div>
  )
}

export function CodeBlockExample() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Basic Code Block</h3>
        <CodeBlock code={sampleCode} language="typescript" />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">With Line Numbers</h3>
        <CodeBlock
          code={sampleCode}
          language="typescript"
          showLineNumbers
          filename="chat-demo.tsx"
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">With Highlighted Lines</h3>
        <CodeBlock
          code={sampleCode}
          language="typescript"
          showLineNumbers
          highlightLines={[3, 4, 5]}
          filename="chat-demo.tsx"
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Inline Code</h3>
        <p>
          Install with <InlineCode>npm install @clarity-chat/react</InlineCode> or{' '}
          <InlineCode>yarn add @clarity-chat/react</InlineCode>
        </p>
      </div>
    </div>
  )
}

export function ExampleSectionExample() {
  const DemoPreview = () => (
    <div className="p-6 bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-900/20 dark:to-accent-900/20 rounded-lg">
      <h4 className="text-lg font-semibold mb-2">Live Preview</h4>
      <p className="text-muted-foreground">This is where your component preview would render</p>
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Example with Preview</h3>
        <ExampleSection
          title="Basic Chat Hook"
          description="Simple example of using the useChat hook"
          code={sampleCode}
          language="tsx"
          preview={<DemoPreview />}
          defaultShowPreview
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Code Only</h3>
        <ExampleSection
          title="Advanced Configuration"
          code={sampleCode}
          language="tsx"
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Collapsible Example</h3>
        <ExampleSection
          title="Optional Advanced Example"
          description="Click to expand and view the code"
          code={sampleCode}
          language="tsx"
          collapsible
          defaultCollapsed
        />
      </div>
    </div>
  )
}

export function RelatedAPIsExample() {
  const relatedApis = [
    {
      name: 'ChatWindow',
      slug: 'chat-window',
      type: 'component' as const,
      description: 'Main chat UI component',
    },
    {
      name: 'useMessages',
      slug: 'use-messages',
      type: 'hook' as const,
      description: 'Hook for message management',
    },
    {
      name: 'formatMessage',
      slug: 'format-message',
      type: 'utility' as const,
      description: 'Format chat messages',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Standard List</h3>
        <RelatedAPIs apis={relatedApis} />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Grouped by Type</h3>
        <RelatedAPIs apis={relatedApis} groupByType />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Compact Version</h3>
        <RelatedAPIsCompact apis={relatedApis} />
      </div>
    </div>
  )
}

export function DocsSidebarExample() {
  return (
    <div className="h-[600px] border border-border rounded-lg overflow-hidden">
      <DocsSidebar items={sampleNavItems} enableSearch />
    </div>
  )
}

export function SearchBarExample() {
  const [results, setResults] = React.useState<SearchResult[]>([])

  const handleSearch = (query: string) => {
    // Simulate search
    if (query) {
      setResults(sampleSearchResults)
    } else {
      setResults([])
    }
  }

  return (
    <div className="max-w-2xl">
      <SearchBar
        results={results}
        onSearch={handleSearch}
        onSelectResult={(result) => console.log('Selected:', result)}
        showRecent
        recentSearches={['useChat', 'ChatWindow', 'streaming']}
      />
    </div>
  )
}

export function CopyButtonExample() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Button Sizes</h3>
        <div className="flex items-center gap-4">
          <CopyButton text="Small" size="sm" />
          <CopyButton text="Medium" size="md" />
          <CopyButton text="Large" size="lg" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Button Variants</h3>
        <div className="flex items-center gap-4">
          <CopyButton text="Ghost variant" variant="ghost" />
          <CopyButton text="Outline variant" variant="outline" />
          <CopyButton text="Solid variant" variant="solid" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">With Content</h3>
        <CopyButtonWithContent copyText="npm install @clarity-chat/react">
          <code className="px-3 py-1 rounded bg-muted">npm install @clarity-chat/react</code>
        </CopyButtonWithContent>
      </div>
    </div>
  )
}

export function ToggleCodeExample() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Single Toggle</h3>
        <ToggleCode
          code={sampleCode}
          language="typescript"
          title="View implementation"
          filename="chat-demo.tsx"
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Toggle Group</h3>
        <ToggleCodeGroup
          sections={[
            {
              title: 'Client Component',
              code: sampleCode,
              language: 'tsx',
              filename: 'client.tsx',
            },
            {
              title: 'Server Action',
              code: `export async function sendMessage(content: string) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ content })
  })
  return response.json()
}`,
              language: 'typescript',
              filename: 'actions.ts',
            },
          ]}
          allowMultiple
        />
      </div>
    </div>
  )
}

export function CompleteDocPageExample() {
  return (
    <DocPage
      title="useChat Hook"
      description="The main hook for managing chat state and streaming responses in your React application."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'API Reference', href: '/api' },
        { label: 'Hooks', href: '/api/hooks' },
        { label: 'useChat', href: '/api/use-chat' },
      ]}
      previousPage={{ title: 'Installation', href: '/docs/installation' }}
      nextPage={{ title: 'ChatWindow', href: '/api/chat-window' }}
      editUrl="https://github.com/user/repo/edit/main/docs/api/use-chat.md"
      lastUpdated={new Date('2024-01-20')}
      contributors={[
        { name: 'John Doe', avatar: 'https://github.com/johndoe.png' },
        { name: 'Jane Smith' },
      ]}
    >
      <div className="space-y-8">
        <APICard api={sampleAPIs[0]} />

        <section>
          <h2 className="text-2xl font-bold mb-4">Installation</h2>
          <CodeBlock code="npm install @clarity-chat/react" language="bash" />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
          <ExampleSection
            title="Simple Chat"
            code={sampleCode}
            language="tsx"
          />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Related APIs</h2>
          <RelatedAPIs
            apis={[
              { name: 'ChatWindow', slug: 'chat-window', type: 'component' },
              { name: 'useMessages', slug: 'use-messages', type: 'hook' },
            ]}
          />
        </section>
      </div>
    </DocPage>
  )
}

// ============================================================================
// All Examples Page
// ============================================================================

export default function DocsComponentsShowcase() {
  return (
    <div className="container max-w-6xl mx-auto py-12 space-y-16">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Documentation Components Showcase</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive set of reusable UI components for building beautiful, accessible documentation sites.
        </p>
      </header>

      <section id="api-cards">
        <h2 className="text-3xl font-bold mb-6">API Cards</h2>
        <APICardExample />
      </section>

      <section id="code-blocks">
        <h2 className="text-3xl font-bold mb-6">Code Blocks</h2>
        <CodeBlockExample />
      </section>

      <section id="examples">
        <h2 className="text-3xl font-bold mb-6">Example Sections</h2>
        <ExampleSectionExample />
      </section>

      <section id="related-apis">
        <h2 className="text-3xl font-bold mb-6">Related APIs</h2>
        <RelatedAPIsExample />
      </section>

      <section id="sidebar">
        <h2 className="text-3xl font-bold mb-6">Documentation Sidebar</h2>
        <DocsSidebarExample />
      </section>

      <section id="search">
        <h2 className="text-3xl font-bold mb-6">Search Bar</h2>
        <SearchBarExample />
      </section>

      <section id="copy-button">
        <h2 className="text-3xl font-bold mb-6">Copy Buttons</h2>
        <CopyButtonExample />
      </section>

      <section id="toggle-code">
        <h2 className="text-3xl font-bold mb-6">Toggle Code</h2>
        <ToggleCodeExample />
      </section>
    </div>
  )
}
