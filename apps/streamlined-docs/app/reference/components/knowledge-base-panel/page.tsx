'use client'

import * as React from 'react'
import { Database, FileText, Filter, Upload } from 'lucide-react'
import { DocumentationPage } from '@/components/Docs/DocumentationPage'
import { Section } from '@/components/Docs/Section'
import { PropsTable } from '@/components/Docs/PropsTable'
import { CodeBlock } from '@/components/Docs/CodeBlock'
import { DemoContainer } from '@/components/Demos/DemoContainer'

export default function KnowledgeBasePanelPage() {
  const tableOfContents = [
    { id: 'overview', label: 'Overview', level: 2 },
    { id: 'features', label: 'Key Features', level: 2 },
    { id: 'installation', label: 'Installation', level: 2 },
    { id: 'props', label: 'Props', level: 2 },
    { id: 'basic-usage', label: 'Basic Usage', level: 2 },
    { id: 'with-file-upload', label: 'With File Upload', level: 2 },
    { id: 'with-filtering', label: 'With Filtering', level: 2 },
    { id: 'rag-integration', label: 'RAG Integration', level: 2 },
    { id: 'context-types', label: 'Context Types', level: 2 },
    { id: 'demo', label: 'Live Demo', level: 2 },
    { id: 'accessibility', label: 'Accessibility', level: 2 },
    { id: 'related', label: 'Related APIs', level: 2 },
  ]

  const relatedAPIs = [
    {
      name: 'ContextVisualizer',
      type: 'component' as const,
      description: 'Visualize context window usage and message inclusion',
      href: '/reference/components/context-visualizer',
    },
    {
      name: 'ContextCard',
      type: 'component' as const,
      description: 'Individual context item card with actions',
      href: '/reference/components/context-card',
    },
    {
      name: 'useRAGPipeline',
      type: 'hook' as const,
      description: 'Hook for retrieval-augmented generation with vector stores',
      href: '/reference/hooks/use-rag-pipeline',
    },
    {
      name: 'FileUpload',
      type: 'component' as const,
      description: 'File upload component with drag-and-drop',
      href: '/reference/components/file-upload',
    },
  ]

  const props = [
    {
      name: 'contexts',
      type: 'Context[]',
      required: true,
      description: 'Array of context objects to display and manage',
    },
    {
      name: 'onAdd',
      type: '(contexts: Context[]) => void',
      required: true,
      description: 'Callback when new contexts are added',
    },
    {
      name: 'onRemove',
      type: '(id: string) => void',
      required: true,
      description: 'Callback when a context is removed',
    },
    {
      name: 'onToggle',
      type: '(id: string) => void',
      required: true,
      description: 'Callback when a context active state is toggled',
    },
    {
      name: 'onPreview',
      type: '(context: Context) => void',
      required: false,
      description: 'Callback when a context is clicked for preview',
    },
    {
      name: 'maxContexts',
      type: 'number',
      default: '20',
      description: 'Maximum number of contexts allowed',
    },
    {
      name: 'allowedTypes',
      type: 'ContextType[]',
      default: "['document', 'image', 'video', 'link', 'text']",
      description: 'Allowed context types for filtering and upload',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      description: 'Additional CSS classes for styling',
    },
  ]

  return (
    <DocumentationPage
      title="KnowledgeBasePanel (ContextManager)"
      description="A comprehensive component for managing knowledge base contexts including documents, images, videos, and other content types that provide context for AI conversations."
      icon={Database}
      badges={[{ label: 'Beta', variant: 'beta' }]}
      packageName="@clarity-chat/react"
      features={[
        {
          icon: Upload,
          label: 'File Upload',
          description: 'Drag-and-drop support for multiple file types',
        },
        {
          icon: Filter,
          label: 'Smart Filtering',
          description: 'Filter by context type with live statistics',
        },
        {
          icon: FileText,
          label: 'Multiple Formats',
          description: 'Supports documents, images, videos, audio, and links',
        },
        {
          icon: Database,
          label: 'RAG Ready',
          description: 'Integrates with vector stores for RAG pipelines',
        },
      ]}
      tableOfContents={tableOfContents}
      relatedAPIs={relatedAPIs}
      footerNavigation={[
        {
          label: 'ContextVisualizer',
          href: '/reference/components/context-visualizer',
          direction: 'previous',
        },
        {
          label: 'RAG Configuration',
          href: '/guides/rag-configuration',
          direction: 'next',
        },
      ]}
    >
      {/* Overview */}
      <Section id="overview" title="Overview">
        <p className="text-muted-foreground leading-relaxed">
          The KnowledgeBasePanel (exported as <code>ContextManager</code>) is a full-featured component for managing
          knowledge base contexts. It provides a complete UI for uploading, organizing, and activating different types
          of content that serve as context for AI conversations. Perfect for building RAG (Retrieval-Augmented
          Generation) applications, document Q&A systems, or any scenario where you need to manage reference materials.
        </p>

        <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
          <p className="text-sm">
            <strong className="text-blue-600 dark:text-blue-400">Note:</strong> This component is designed to work
            seamlessly with <code>useRAGPipeline</code> hook and vector stores like Pinecone, Qdrant, Weaviate, or
            Chroma for production RAG implementations.
          </p>
        </div>
      </Section>

      {/* Key Features */}
      <Section id="features" title="Key Features">
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>
              <strong className="text-foreground">Multi-Format Support:</strong> Handle documents (PDF, DOC, TXT),
              images, videos, audio files, links, and plain text
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>
              <strong className="text-foreground">File Upload:</strong> Built-in file upload with drag-and-drop,
              configurable file types and size limits
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>
              <strong className="text-foreground">Type Filtering:</strong> Filter contexts by type with live statistics
              showing count per type
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>
              <strong className="text-foreground">Activation Control:</strong> Toggle individual or bulk activate/deactivate
              contexts to control what's used
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>
              <strong className="text-foreground">Preview Support:</strong> Preview context content before using with
              optional callback
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>
              <strong className="text-foreground">Capacity Management:</strong> Configure maximum contexts with visual
              indicators of usage
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>
              <strong className="text-foreground">Responsive Design:</strong> Works seamlessly on mobile, tablet, and
              desktop devices
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>
              <strong className="text-foreground">Accessibility:</strong> Full keyboard navigation, screen reader
              support, and WCAG 2.1 AA compliance
            </span>
          </li>
        </ul>
      </Section>

      {/* Installation */}
      <Section id="installation" title="Installation">
        <CodeBlock
          language="bash"
          code={`npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
# or
yarn add @clarity-chat/react`}
        />
      </Section>

      {/* Props */}
      <Section id="props" title="Props">
        <PropsTable props={props} />
      </Section>

      {/* Basic Usage */}
      <Section id="basic-usage" title="Basic Usage">
        <p className="text-muted-foreground mb-4">
          Here's a simple example showing how to use the KnowledgeBasePanel with state management:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { useState } from 'react'
import { ContextManager } from '@clarity-chat/react'
import type { Context } from '@clarity-chat/types'

function MyApp() {
  const [contexts, setContexts] = useState<Context[]>([])

  const handleAdd = (newContexts: Context[]) => {
    setContexts((prev) => [...prev, ...newContexts])
  }

  const handleRemove = (id: string) => {
    setContexts((prev) => prev.filter((c) => c.id !== id))
  }

  const handleToggle = (id: string) => {
    setContexts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      )
    )
  }

  const handlePreview = (context: Context) => {
    console.log('Preview context:', context)
    // Open preview modal/dialog
  }

  return (
    <ContextManager
      contexts={contexts}
      onAdd={handleAdd}
      onRemove={handleRemove}
      onToggle={handleToggle}
      onPreview={handlePreview}
      maxContexts={20}
    />
  )
}`}
        />
      </Section>

      {/* With File Upload */}
      <Section id="with-file-upload" title="With File Upload">
        <p className="text-muted-foreground mb-4">
          The component includes built-in file upload with automatic context creation:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { ContextManager } from '@clarity-chat/react'

function DocumentQA() {
  const [contexts, setContexts] = useState<Context[]>([])

  const handleAdd = async (newContexts: Context[]) => {
    // Process uploaded files
    const processedContexts = await Promise.all(
      newContexts.map(async (context) => {
        // Extract text from documents
        if (context.type === 'document') {
          const text = await extractTextFromDocument(context.url)
          return {
            ...context,
            content: text,
            metadata: {
              ...context.metadata,
              extractedText: text.slice(0, 200),
            },
          }
        }
        return context
      })
    )

    setContexts((prev) => [...prev, ...processedContexts])
  }

  return (
    <ContextManager
      contexts={contexts}
      onAdd={handleAdd}
      onRemove={(id) => setContexts((prev) => prev.filter((c) => c.id !== id))}
      onToggle={(id) =>
        setContexts((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          )
        )
      }
      allowedTypes={['document', 'image']}
      maxContexts={10}
    />
  )
}`}
        />
      </Section>

      {/* With Filtering */}
      <Section id="with-filtering" title="With Filtering">
        <p className="text-muted-foreground mb-4">
          Filter contexts by type with automatic statistics:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { ContextManager } from '@clarity-chat/react'

function FilterableKnowledgeBase() {
  const [contexts, setContexts] = useState<Context[]>([
    {
      id: '1',
      projectId: 'proj-1',
      type: 'document',
      name: 'Product Guide.pdf',
      content: 'Full product documentation...',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      projectId: 'proj-1',
      type: 'image',
      name: 'Architecture Diagram.png',
      url: '/images/architecture.png',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      projectId: 'proj-1',
      type: 'link',
      name: 'API Documentation',
      url: 'https://docs.example.com/api',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])

  return (
    <ContextManager
      contexts={contexts}
      onAdd={(newContexts) => setContexts((prev) => [...prev, ...newContexts])}
      onRemove={(id) => setContexts((prev) => prev.filter((c) => c.id !== id))}
      onToggle={(id) =>
        setContexts((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          )
        )
      }
      // All types enabled by default
      allowedTypes={['document', 'image', 'video', 'audio', 'link', 'text']}
    />
  )
}

// Component automatically shows:
// - All (3)
// - Document (1)
// - Image (1)
// - Video (0) - disabled
// - Audio (0) - disabled
// - Link (1)
// - Text (0) - disabled`}
        />
      </Section>

      {/* RAG Integration */}
      <Section id="rag-integration" title="RAG Integration">
        <p className="text-muted-foreground mb-4">
          Integrate with RAG pipeline for semantic search and context-aware responses:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { useState, useEffect } from 'react'
import { ContextManager } from '@clarity-chat/react'
import { useRAGPipeline } from '@clarity-chat/react'
import type { Context } from '@clarity-chat/types'

function RAGEnabledChat() {
  const [contexts, setContexts] = useState<Context[]>([])

  // Initialize RAG pipeline
  const rag = useRAGPipeline({
    vectorStore: 'pinecone',
    embeddingProvider: 'openai',
    apiKeys: {
      vectorStore: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
      embeddings: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    },
  })

  // Index contexts when they're added or activated
  useEffect(() => {
    const activeContexts = contexts.filter((c) => c.isActive)

    // Index documents in vector store
    activeContexts.forEach(async (context) => {
      if (context.content) {
        // Store in vector database for semantic search
        await indexDocument({
          id: context.id,
          content: context.content,
          metadata: {
            name: context.name,
            type: context.type,
            ...context.metadata,
          },
        })
      }
    })
  }, [contexts])

  const handleAdd = async (newContexts: Context[]) => {
    // Extract text and prepare for indexing
    const processedContexts = await Promise.all(
      newContexts.map(async (context) => {
        let content = context.content

        // Extract text from different file types
        if (context.type === 'document') {
          content = await extractTextFromPDF(context.url)
        } else if (context.type === 'image') {
          content = await extractTextFromImage(context.url) // OCR
        }

        return { ...context, content }
      })
    )

    setContexts((prev) => [...prev, ...processedContexts])
  }

  const handleQuery = async (query: string) => {
    // Retrieve relevant contexts
    const results = await rag.retrieve(query, 5)

    // Use results to augment the prompt
    const contextText = results
      .map((r) => r.content)
      .join('\\n\\n')

    return \`Context:\\n\${contextText}\\n\\nQuestion: \${query}\`
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1">
        <ContextManager
          contexts={contexts}
          onAdd={handleAdd}
          onRemove={(id) => {
            setContexts((prev) => prev.filter((c) => c.id !== id))
            // Also remove from vector store
            removeFromVectorStore(id)
          }}
          onToggle={(id) =>
            setContexts((prev) =>
              prev.map((c) =>
                c.id === id ? { ...c, isActive: !c.isActive } : c
              )
            )
          }
        />
      </div>
      <div className="col-span-2">
        <ChatInterface onQuery={handleQuery} />
      </div>
    </div>
  )
}

// Helper functions
async function extractTextFromPDF(url: string): Promise<string> {
  // Use PDF.js or similar library
  return 'Extracted PDF text...'
}

async function extractTextFromImage(url: string): Promise<string> {
  // Use Tesseract.js or cloud OCR service
  return 'Extracted image text...'
}

async function indexDocument(doc: {
  id: string
  content: string
  metadata: Record<string, any>
}): Promise<void> {
  // Index in your vector store (Pinecone, Qdrant, etc.)
  console.log('Indexing document:', doc.id)
}

async function removeFromVectorStore(id: string): Promise<void> {
  // Remove from vector store
  console.log('Removing from vector store:', id)
}`}
        />
      </Section>

      {/* Context Types */}
      <Section id="context-types" title="Context Types">
        <p className="text-muted-foreground mb-4">
          The component supports multiple context types with specific handling:
        </p>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
            <h4 className="font-semibold text-foreground mb-2">Document</h4>
            <p className="text-sm text-muted-foreground">
              PDF, Word, text files. Supports text extraction, page count, and file size display.
            </p>
            <CodeBlock
              language="typescript"
              code={`{
  type: 'document',
  name: 'User Manual.pdf',
  url: '/documents/manual.pdf',
  metadata: {
    fileSize: 2048000,
    pageCount: 45,
    mimeType: 'application/pdf',
  }
}`}
            />
          </div>

          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
            <h4 className="font-semibold text-foreground mb-2">Image</h4>
            <p className="text-sm text-muted-foreground">
              PNG, JPEG, GIF images. Supports thumbnails and OCR text extraction.
            </p>
            <CodeBlock
              language="typescript"
              code={`{
  type: 'image',
  name: 'Product Photo.jpg',
  url: '/images/product.jpg',
  metadata: {
    fileSize: 512000,
    thumbnail: '/thumbs/product.jpg',
    mimeType: 'image/jpeg',
  }
}`}
            />
          </div>

          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
            <h4 className="font-semibold text-foreground mb-2">Video</h4>
            <p className="text-sm text-muted-foreground">
              MP4, WebM videos. Supports duration display and thumbnail extraction.
            </p>
            <CodeBlock
              language="typescript"
              code={`{
  type: 'video',
  name: 'Tutorial.mp4',
  url: '/videos/tutorial.mp4',
  metadata: {
    fileSize: 15360000,
    duration: 180, // seconds
    mimeType: 'video/mp4',
  }
}`}
            />
          </div>

          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
            <h4 className="font-semibold text-foreground mb-2">Audio</h4>
            <p className="text-sm text-muted-foreground">
              MP3, WAV audio files. Supports duration and transcription.
            </p>
            <CodeBlock
              language="typescript"
              code={`{
  type: 'audio',
  name: 'Podcast Episode.mp3',
  url: '/audio/podcast.mp3',
  metadata: {
    fileSize: 8192000,
    duration: 3600, // seconds
    mimeType: 'audio/mpeg',
  }
}`}
            />
          </div>

          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
            <h4 className="font-semibold text-foreground mb-2">Link</h4>
            <p className="text-sm text-muted-foreground">
              Web URLs. Supports fetching and indexing external content.
            </p>
            <CodeBlock
              language="typescript"
              code={`{
  type: 'link',
  name: 'Documentation',
  url: 'https://docs.example.com',
  content: 'Fetched content...',
  metadata: {
    favicon: 'https://docs.example.com/favicon.ico',
  }
}`}
            />
          </div>

          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
            <h4 className="font-semibold text-foreground mb-2">Text</h4>
            <p className="text-sm text-muted-foreground">
              Plain text snippets or notes added directly without file upload.
            </p>
            <CodeBlock
              language="typescript"
              code={`{
  type: 'text',
  name: 'Project Notes',
  content: 'Important project context and notes...',
  metadata: {
    characterCount: 250,
  }
}`}
            />
          </div>
        </div>
      </Section>

      {/* Live Demo */}
      <Section id="demo" title="Live Demo">
        <p className="text-muted-foreground mb-4">
          Interactive demo showing file upload, filtering, and context management:
        </p>
        <DemoContainer>
          <div className="p-6 bg-muted/30 rounded-lg border border-border/50">
            <p className="text-sm text-muted-foreground text-center">
              Live demo component would go here. Shows:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• File upload with drag-and-drop</li>
              <li>• Type filtering (All, Document, Image, Video, etc.)</li>
              <li>• Context activation/deactivation</li>
              <li>• Preview functionality</li>
              <li>• Bulk operations (activate all, clear all)</li>
              <li>• Statistics (X active • Y total)</li>
            </ul>
          </div>
        </DemoContainer>
      </Section>

      {/* Accessibility */}
      <Section id="accessibility" title="Accessibility">
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>
              <strong className="text-foreground">Keyboard Navigation:</strong> Full keyboard support with Tab, Enter,
              Space, and Escape keys
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>
              <strong className="text-foreground">Screen Readers:</strong> Comprehensive ARIA labels and live regions
              for status updates
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>
              <strong className="text-foreground">Focus Management:</strong> Clear focus indicators and logical tab
              order
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>
              <strong className="text-foreground">Color Contrast:</strong> WCAG 2.1 AA compliant color combinations
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>
              <strong className="text-foreground">Reduced Motion:</strong> Respects prefers-reduced-motion settings
            </span>
          </li>
        </ul>
      </Section>
    </DocumentationPage>
  )
}
