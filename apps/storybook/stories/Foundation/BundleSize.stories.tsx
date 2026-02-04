import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Package, AlertCircle, CheckCircle2, TrendingDown } from 'lucide-react'

const meta: Meta = {
  title: 'Foundation/Bundle Size',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Bundle Size Optimization

Clarity Chat Components are designed for optimal bundle size through:

1. **Peer Dependencies** - Core libraries are externalized
2. **Tree-Shaking** - Only import what you use
3. **Code Splitting** - Lazy load heavy features
4. **Optional Features** - Install only needed dependencies

## Bundle Size Analysis

Use the **Bundle Size** panel (database icon in toolbar) to view:

- Raw component size
- Gzipped size
- Total size with dependencies
- Individual dependency contributions
- Required vs optional peer indicators

## Size Comparison

| Configuration | Bundle Size | Description |
|--------------|-------------|-------------|
| Core Only | ~290KB | Basic chat with required peers |
| + Markdown | ~395KB | Adds markdown rendering |
| + Documents | ~2.9MB | Adds PDF/DOCX support |
| Full Install | ~4.5MB | All features enabled |

## Optimization Strategies

### 1. Import Specific Components

\`\`\`typescript
// Good - Tree-shakeable
import { ChatInput, MessageList } from '@clarity-chat/react'

// Avoid - Imports everything
import * as Clarity from '@clarity-chat/react'
\`\`\`

### 2. Use Dynamic Imports

\`\`\`typescript
// Lazy load heavy features
const PDFViewer = React.lazy(() =>
  import('@clarity-chat/react').then(m => ({ default: m.PDFViewer }))
)
\`\`\`

### 3. Install Only Needed Peers

\`\`\`bash
# Minimal install
npm install @clarity-chat/react react framer-motion lucide-react zod

# Add features as needed
npm install react-markdown  # Markdown support
npm install pdfjs-dist      # PDF support
\`\`\`

### 4. Use Code Splitting

\`\`\`typescript
// Split by route
const ChatPage = React.lazy(() => import('./pages/ChatPage'))
const AdminPage = React.lazy(() => import('./pages/AdminPage'))
\`\`\`
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj

interface BundleConfig {
  name: string
  totalSize: string
  gzippedSize: string
  components: Array<{
    name: string
    size: string
    required: boolean
  }>
  description: string
}

const BUNDLE_CONFIGS: BundleConfig[] = [
  {
    name: 'Core Only',
    totalSize: '290KB',
    gzippedSize: '85KB',
    description: 'Minimal install with basic chat functionality',
    components: [
      { name: '@clarity-chat/react (core)', size: '45KB', required: true },
      { name: 'react', size: '100KB', required: true },
      { name: 'framer-motion', size: '80KB', required: true },
      { name: 'lucide-react', size: '50KB', required: true },
      { name: 'zod', size: '15KB', required: true },
    ],
  },
  {
    name: 'With Markdown',
    totalSize: '395KB',
    gzippedSize: '110KB',
    description: 'Adds markdown rendering and syntax highlighting',
    components: [
      { name: 'Core bundle', size: '290KB', required: true },
      { name: 'react-markdown', size: '40KB', required: false },
      { name: 'remark-gfm', size: '20KB', required: false },
      { name: 'rehype-highlight', size: '15KB', required: false },
      { name: 'prismjs', size: '30KB', required: false },
    ],
  },
  {
    name: 'With Documents',
    totalSize: '2.9MB',
    gzippedSize: '780KB',
    description: 'Adds PDF and DOCX document processing',
    components: [
      { name: 'Core + Markdown', size: '395KB', required: true },
      { name: 'pdfjs-dist', size: '2.5MB', required: false },
      { name: 'mammoth', size: '200KB', required: false },
    ],
  },
  {
    name: 'Full Install',
    totalSize: '4.5MB',
    gzippedSize: '1.2MB',
    description: 'All features enabled (typically not needed)',
    components: [
      { name: 'Core + Markdown + Docs', size: '2.9MB', required: true },
      { name: 'mermaid', size: '500KB', required: false },
      { name: 'shiki', size: '400KB', required: false },
      { name: 'cohere-ai', size: '150KB', required: false },
      { name: 'flowtoken', size: '30KB', required: false },
      { name: 'jszip', size: '100KB', required: false },
    ],
  },
]

function BundleConfigCard({ config }: { config: BundleConfig }) {
  // Calculate if this is an optimal config
  const sizeNum = parseFloat(config.totalSize)
  const isOptimal = sizeNum < 500

  return (
    <div
      style={{
        border: '2px solid',
        borderColor: isOptimal ? '#10b981' : '#6b7280',
        borderRadius: '12px',
        padding: '20px',
        background: 'white',
        position: 'relative',
      }}
    >
      {isOptimal && (
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            right: '20px',
            background: '#10b981',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <CheckCircle2 size={14} />
          Recommended
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <h3
          style={{
            margin: '0 0 8px 0',
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
          }}
        >
          {config.name}
        </h3>
        <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
          {config.description}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '20px',
          padding: '16px',
          background: '#f9fafb',
          borderRadius: '8px',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Total Size
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: isOptimal ? '#10b981' : '#dc2626',
            }}
          >
            {config.totalSize}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Gzipped
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#6b7280' }}>
            {config.gzippedSize}
          </div>
        </div>
      </div>

      <div>
        <h4
          style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
          }}
        >
          Dependencies
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {config.components.map((comp) => (
            <div
              key={comp.name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                background: comp.required ? '#fef3c7' : '#f0f9ff',
                borderRadius: '6px',
                fontSize: '13px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={16} color={comp.required ? '#f59e0b' : '#3b82f6'} />
                <span style={{ fontWeight: '500' }}>{comp.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  {comp.size}
                </span>
                {!comp.required && (
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      background: '#dbeafe',
                      color: '#1e40af',
                      fontWeight: '600',
                    }}
                  >
                    OPT
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BundleComparison() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '32px',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <TrendingDown size={32} />
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>
            Bundle Size Optimization
          </h2>
        </div>
        <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
          Choose the right configuration for your use case. Most apps only need the Core
          or Core + Markdown bundles.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {BUNDLE_CONFIGS.map((config) => (
          <BundleConfigCard key={config.name} config={config} />
        ))}
      </div>

      <div
        style={{
          background: '#eff6ff',
          padding: '20px',
          borderRadius: '12px',
          border: '2px solid #3b82f6',
        }}
      >
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e40af',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={20} />
          Optimization Tips
        </h3>
        <ul
          style={{
            margin: 0,
            paddingLeft: '24px',
            fontSize: '14px',
            color: '#1e3a8a',
            lineHeight: '1.8',
          }}
        >
          <li>
            <strong>Start with Core Only</strong> - Add features incrementally as needed
          </li>
          <li>
            <strong>Use Dynamic Imports</strong> - Lazy load heavy components like PDF
            viewers
          </li>
          <li>
            <strong>Tree-Shake Effectively</strong> - Import only specific components you
            use
          </li>
          <li>
            <strong>Monitor Bundle Size</strong> - Use the Bundle Size panel to track
            impact
          </li>
          <li>
            <strong>Consider Your Users</strong> - Not everyone needs document processing
          </li>
        </ul>
      </div>
    </div>
  )
}

export const Overview: Story = {
  render: () => <BundleComparison />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Compare different bundle configurations and their sizes.',
      },
    },
  },
}

function TreeShakingDemo() {
  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
        Tree-Shaking Examples
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div
          style={{
            border: '2px solid #10b981',
            borderRadius: '8px',
            padding: '20px',
            background: '#f0fdf4',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            <CheckCircle2 size={20} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
              Good - Tree-Shakeable
            </h3>
          </div>
          <pre
            style={{
              background: '#1f2937',
              color: '#f3f4f6',
              padding: '16px',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '14px',
              fontFamily: 'monospace',
              margin: 0,
            }}
          >
            <code>{`// Named imports (tree-shakeable)
import { ChatInput, MessageList, useClarityChat } from '@clarity-chat/react'

// Only these components are bundled
const App = () => {
  const { messages, append } = useClarityChat()

  return (
    <>
      <MessageList messages={messages} />
      <ChatInput onSubmit={append} />
    </>
  )
}`}</code>
          </pre>
          <div
            style={{
              marginTop: '12px',
              fontSize: '13px',
              color: '#065f46',
              fontWeight: '500',
            }}
          >
            Bundle size: ~45KB (only ChatInput + MessageList)
          </div>
        </div>

        <div
          style={{
            border: '2px solid #dc2626',
            borderRadius: '8px',
            padding: '20px',
            background: '#fef2f2',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            <AlertCircle size={20} color="#dc2626" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
              Bad - Imports Everything
            </h3>
          </div>
          <pre
            style={{
              background: '#1f2937',
              color: '#f3f4f6',
              padding: '16px',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '14px',
              fontFamily: 'monospace',
              margin: 0,
            }}
          >
            <code>{`// Namespace import (not tree-shakeable)
import * as Clarity from '@clarity-chat/react'

// Bundles EVERYTHING, even unused components
const App = () => {
  const { messages, append } = Clarity.useClarityChat()

  return (
    <>
      <Clarity.MessageList messages={messages} />
      <Clarity.ChatInput onSubmit={append} />
    </>
  )
}`}</code>
          </pre>
          <div
            style={{
              marginTop: '12px',
              fontSize: '13px',
              color: '#991b1b',
              fontWeight: '500',
            }}
          >
            Bundle size: ~200KB+ (includes all components)
          </div>
        </div>

        <div
          style={{
            border: '2px solid #3b82f6',
            borderRadius: '8px',
            padding: '20px',
            background: '#eff6ff',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            <CheckCircle2 size={20} color="#3b82f6" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
              Best - Dynamic Imports
            </h3>
          </div>
          <pre
            style={{
              background: '#1f2937',
              color: '#f3f4f6',
              padding: '16px',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '14px',
              fontFamily: 'monospace',
              margin: 0,
            }}
          >
            <code>{`// Dynamic imports for code splitting
const PDFViewer = React.lazy(() =>
  import('@clarity-chat/react').then(m => ({
    default: m.PDFViewer
  }))
)

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      {/* Only loaded when rendering PDF */}
      <PDFViewer file={pdfFile} />
    </Suspense>
  )
}`}</code>
          </pre>
          <div
            style={{
              marginTop: '12px',
              fontSize: '13px',
              color: '#1e40af',
              fontWeight: '500',
            }}
          >
            Initial bundle: ~45KB, PDF chunk: ~2.5MB (loaded on demand)
          </div>
        </div>
      </div>
    </div>
  )
}

export const TreeShakingExamples: Story = {
  render: () => <TreeShakingDemo />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Learn how to optimize bundle size with proper import techniques.',
      },
    },
  },
}
