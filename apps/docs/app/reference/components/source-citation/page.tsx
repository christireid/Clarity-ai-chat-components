'use client'

import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { SourceCitation, useSourceCitation } from '@clarity-chat/react'

// Define Source interface locally to avoid build-time type resolution issues
interface Source {
  url: string
  title: string
  snippet: string
  favicon?: string
  confidence?: number
  domain?: string
  date?: string | Date
  author?: string
  metadata?: Record<string, string | number | boolean>
}

const sourceCitationProps: Prop[] = [
  {
    name: 'sources',
    type: 'Source[]',
    required: true,
    description: 'Array of source citations to display.',
  },
  {
    name: 'variant',
    type: '"inline" | "card" | "list"',
    default: '"card"',
    description: 'Display variant - inline for text embedding, card for rich display, list for compact.',
  },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: 'Size variant affecting all internal elements.',
  },
  {
    name: 'maxVisible',
    type: 'number',
    description: 'Maximum sources to show before "show more" button.',
  },
  {
    name: 'showConfidence',
    type: 'boolean',
    default: 'false',
    description: 'Show confidence/relevance scores as badges.',
  },
  {
    name: 'showDomain',
    type: 'boolean',
    default: 'true',
    description: 'Show source domain.',
  },
  {
    name: 'showDate',
    type: 'boolean',
    default: 'false',
    description: 'Show publication date.',
  },
  {
    name: 'showAuthor',
    type: 'boolean',
    default: 'false',
    description: 'Show author name.',
  },
  {
    name: 'showFavicons',
    type: 'boolean',
    default: 'true',
    description: 'Show website favicons.',
  },
  {
    name: 'expandOnHover',
    type: 'boolean',
    default: 'true',
    description: 'Expand source details on hover (inline/list variants).',
  },
  {
    name: 'onSourceClick',
    type: '(source: Source, index: number) => void',
    description: 'Callback when a source is clicked.',
  },
  {
    name: 'openInNewTab',
    type: 'boolean',
    default: 'true',
    description: 'Open source links in new tab.',
  },
  {
    name: 'groupByDomain',
    type: 'boolean',
    default: 'false',
    description: 'Group sources by domain.',
  },
  {
    name: 'title',
    type: 'string',
    description: 'Header title for the sources section.',
  },
]

export default function SourceCitationPage() {
  const exampleSources: Source[] = [
    {
      url: 'https://react.dev/learn',
      title: 'React Documentation',
      snippet: 'Learn React with the official React documentation. Covers hooks, components, and best practices.',
      confidence: 0.95,
    },
    {
      url: 'https://nextjs.org/docs',
      title: 'Next.js Documentation',
      snippet: 'The React Framework for Production. Server-side rendering, static generation, and more.',
      confidence: 0.88,
    },
  ]

  return (
    <>
      <Breadcrumbs />

      <h1>SourceCitation</h1>

      <p className="lead">
        Display AI response sources with expandable details, favicons, confidence scores,
        and multiple display variants. Perfect for RAG-based applications and research assistants.
      </p>

      <Callout type="info">
        <p>
          SourceCitation makes AI responses more trustworthy by clearly showing where
          information came from with visual feedback and easy access to original sources.
        </p>
      </Callout>

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import { SourceCitation, useSourceCitation } from '@clarity-chat/react'
import type { Source } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}
        language="tsx"
      />

      <h2 id="basic-usage">Basic Usage</h2>

      <EnhancedCodeBlock
        code={`import { SourceCitation } from '@clarity-chat/react'

function Example() {
  const sources = [
    {
      url: 'https://example.com/article',
      title: 'Relevant Article',
      snippet: 'This article discusses the topic in detail...',
      confidence: 0.92
    },
    {
      url: 'https://docs.example.com',
      title: 'Documentation',
      snippet: 'Official documentation covering key concepts.',
      confidence: 0.85
    }
  ]

  return (
    <SourceCitation
      sources={sources}
      variant="card"
      showConfidence
    />
  )
}`}
        language="tsx"
      />

      <h2 id="variants">Display Variants</h2>

      <EnhancedCodeBlock
        code={`// Card variant - rich display with previews
<SourceCitation
  sources={sources}
  variant="card"
  showConfidence
  showDomain
  showDate
/>

// List variant - compact vertical list
<SourceCitation
  sources={sources}
  variant="list"
  showDomain
/>

// Inline variant - embedded in text
<p>
  Based on research{' '}
  <SourceCitation
    sources={sources}
    variant="inline"
    maxVisible={3}
  />
</p>`}
        language="tsx"
      />

      <h2 id="with-confidence">With Confidence Scores</h2>

      <EnhancedCodeBlock
        code={`const sources = [
  {
    url: 'https://highly-relevant.com',
    title: 'Highly Relevant Source',
    snippet: 'Direct answer to the query.',
    confidence: 0.95, // High - green badge
  },
  {
    url: 'https://somewhat-relevant.com',
    title: 'Somewhat Relevant',
    snippet: 'Related information.',
    confidence: 0.72, // Medium - blue badge
  },
  {
    url: 'https://tangentially-relevant.com',
    title: 'Tangentially Relevant',
    snippet: 'Mentioned in passing.',
    confidence: 0.58, // Low - orange badge
  },
]

<SourceCitation
  sources={sources}
  showConfidence
  variant="card"
/>`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="group-by-domain">Grouped by Domain</h2>

      <EnhancedCodeBlock
        code={`<SourceCitation
  sources={sources}
  groupByDomain
  title="Sources by Website"
  showDomain={false} // Hide individual domain labels
/>`}
        language="tsx"
      />

      <h2 id="with-hook">With useSourceCitation Hook</h2>

      <EnhancedCodeBlock
        code={`import { SourceCitation, useSourceCitation } from '@clarity-chat/react'

function Example() {
  const {
    sources,
    addSource,
    addSources,
    removeSource,
    sortedByConfidence,
    domains
  } = useSourceCitation({
    initialSources: [],
    maxSources: 10
  })

  const handleNewSources = (newSources) => {
    addSources(newSources)
  }

  return (
    <>
      <SourceCitation
        sources={sortedByConfidence}
        showConfidence
        onSourceClick={(source) => {
          console.log('Clicked:', source)
        }}
      />
      <p>Domains: {domains.join(', ')}</p>
    </>
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="metadata">With Metadata</h2>

      <EnhancedCodeBlock
        code={`const sources = [
  {
    url: 'https://example.com/article',
    title: 'Research Article',
    snippet: 'Detailed analysis...',
    date: new Date('2024-01-15'),
    author: 'Dr. Jane Smith',
    metadata: {
      'Publication': 'Nature Journal',
      'Citations': 42,
      'Impact Factor': 9.5
    }
  }
]

<SourceCitation
  sources={sources}
  variant="card"
  showDate
  showAuthor
  // Metadata automatically displayed when available
/>`}
        language="tsx"
      />

      <h2 id="props">Props</h2>

      <PropsTable props={sourceCitationProps} />

      <h2 id="source-type">Source Type</h2>

      <EnhancedCodeBlock
        code={`interface Source {
  /** Source URL */
  url: string
  /** Source title/name */
  title: string
  /** Text snippet/excerpt from the source */
  snippet: string
  /** Optional favicon URL (auto-fetched if not provided) */
  favicon?: string
  /** Relevance/confidence score (0-1) */
  confidence?: number
  /** Source domain (auto-extracted if not provided) */
  domain?: string
  /** Publication date */
  date?: string | Date
  /** Author name */
  author?: string
  /** Additional metadata */
  metadata?: Record<string, string | number | boolean>
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="accessibility">Accessibility</h2>

      <ul>
        <li>✅ Proper link semantics with external link indicators</li>
        <li>✅ Keyboard navigation for all sources</li>
        <li>✅ ARIA labels for citation numbers</li>
        <li>✅ Screen reader friendly expandable sections</li>
        <li>✅ Reduced motion support</li>
      </ul>

      <h2 id="related">Related</h2>

      <ul>
        <li>
          <a href="/guides/rag">RAG Implementation Guide</a> - Building RAG applications
        </li>
        <li>
          <a href="/reference/components/chain-of-thought">ChainOfThought</a> - Reasoning display
        </li>
      </ul>
    </>
  )
}
