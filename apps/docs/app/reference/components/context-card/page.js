import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { CodePlayground } from '@/components/Playground/CodePlayground';
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Context Card - Clarity Chat Components',
    description: 'Display RAG context sources with file metadata, thumbnails, and management actions.',
};
export default function ContextCardPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "Context Card" }), _jsx("p", { className: "docs-lead", children: "Display RAG context sources with rich metadata, thumbnails, and management actions. Perfect for showing documents, images, videos, and other context attached to AI conversations." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsxs("p", { children: ["The ", _jsx("code", { children: "ContextCard" }), " component displays a single context item (document, image, video, etc.) with its metadata, status, and actions. It's commonly used in RAG (Retrieval-Augmented Generation) systems to show what sources the AI is using."] }), _jsx(Callout, { type: "info", title: "What's RAG?", children: "RAG (Retrieval-Augmented Generation) means the AI can access your documents, images, and other files to give better answers. Each context card represents one piece of information the AI can use." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function SimpleContext() {
  const context = {
    id: '1',
    type: 'document',
    name: 'Product Roadmap 2024.pdf',
    isActive: true,
    createdAt: new Date(),
    metadata: {
      fileSize: 2457600, // 2.4 MB
      pageCount: 15,
      extractedText: 'Our product roadmap for 2024 includes...'
    }
  }

  return (
    <ContextCard context={context} />
  )
}

render(<SimpleContext />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Context Types" }), _jsx("p", { children: "Context cards automatically show appropriate icons and colors based on the content type." }), _jsx(CodePlayground, { initialCode: `function ContextTypes() {
  const contexts = [
    {
      id: '1',
      type: 'document',
      name: 'Annual Report.pdf',
      isActive: true,
      createdAt: new Date(),
      metadata: { fileSize: 1024000, pageCount: 25 }
    },
    {
      id: '2',
      type: 'image',
      name: 'Product Screenshot.png',
      isActive: true,
      createdAt: new Date(),
      metadata: { fileSize: 512000 }
    },
    {
      id: '3',
      type: 'video',
      name: 'Tutorial Video.mp4',
      isActive: false,
      createdAt: new Date(),
      metadata: { fileSize: 5242880, duration: 180 }
    },
    {
      id: '4',
      type: 'link',
      name: 'Documentation Site',
      isActive: true,
      createdAt: new Date(),
      metadata: { url: 'https://docs.example.com' }
    }
  ]

  return (
    <div className="grid gap-3">
      {contexts.map(context => (
        <ContextCard key={context.id} context={context} />
      ))}
    </div>
  )
}

render(<ContextTypes />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Actions" }), _jsx("p", { children: "Add management actions like toggle, preview, and remove." }), _jsx(CodePlayground, { initialCode: `import { useState } from 'react'

function InteractiveContext() {
  const [contexts, setContexts] = useState([
    {
      id: '1',
      type: 'document',
      name: 'User Guide.pdf',
      isActive: true,
      createdAt: new Date(),
      metadata: {
        fileSize: 1536000,
        pageCount: 42,
        extractedText: 'This guide covers all features...'
      }
    }
  ])

  const handleToggle = (id: string) => {
    setContexts(prev => prev.map(ctx =>
      ctx.id === id ? { ...ctx, isActive: !ctx.isActive } : ctx
    ))
  }

  const handleRemove = (id: string) => {
    setContexts(prev => prev.filter(ctx => ctx.id !== id))
  }

  const handlePreview = (context) => {
    alert(\`Previewing: \${context.name}\`)
  }

  return (
    <div className="space-y-3">
      {contexts.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No contexts. Try reloading the demo.
        </p>
      ) : (
        contexts.map(context => (
          <ContextCard
            key={context.id}
            context={context}
            onToggle={handleToggle}
            onRemove={handleRemove}
            onPreview={handlePreview}
            showActions={true}
          />
        ))
      )}
    </div>
  )
}

render(<InteractiveContext />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Thumbnails" }), _jsx("p", { children: "Show visual previews for images and videos." }), _jsx(CodePlayground, { initialCode: `function ThumbnailContexts() {
  const contexts = [
    {
      id: '1',
      type: 'image',
      name: 'Product Hero Image.jpg',
      isActive: true,
      createdAt: new Date(),
      metadata: {
        fileSize: 825000,
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop'
      }
    },
    {
      id: '2',
      type: 'video',
      name: 'Demo Recording.mp4',
      isActive: true,
      createdAt: new Date(),
      metadata: {
        fileSize: 4200000,
        duration: 240,
        thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=100&h=100&fit=crop'
      }
    }
  ]

  return (
    <div className="grid gap-3">
      {contexts.map(context => (
        <ContextCard key={context.id} context={context} />
      ))}
    </div>
  )
}

render(<ThumbnailContexts />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Real-World Example: RAG Document Manager" }), _jsx("p", { children: "Build a complete document management interface for RAG applications." }), _jsx(CodePlayground, { initialCode: `import { useState } from 'react'

function RAGDocumentManager() {
  const [documents, setDocuments] = useState([
    {
      id: 'doc-1',
      type: 'document',
      name: 'Q4 2024 Strategy.pdf',
      isActive: true,
      createdAt: new Date('2024-10-15'),
      metadata: {
        fileSize: 2100000,
        pageCount: 18,
        extractedText: 'Our Q4 strategy focuses on market expansion...',
        author: 'Strategy Team',
        date: '2024-10-15'
      }
    },
    {
      id: 'doc-2',
      type: 'document',
      name: 'Customer Survey Results.xlsx',
      isActive: true,
      createdAt: new Date('2024-10-20'),
      metadata: {
        fileSize: 856000,
        extractedText: 'Survey data from 1,245 respondents...'
      }
    },
    {
      id: 'doc-3',
      type: 'link',
      name: 'Competitor Analysis Article',
      isActive: false,
      createdAt: new Date('2024-10-22'),
      metadata: {
        url: 'https://example.com/analysis',
        extractedText: 'Industry trends and competitive landscape...'
      }
    }
  ])

  const toggleActive = (id: string) => {
    setDocuments(prev => prev.map(doc =>
      doc.id === id ? { ...doc, isActive: !doc.isActive } : doc
    ))
  }

  const removeDocument = (id: string) => {
    if (confirm('Remove this context from the conversation?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== id))
    }
  }

  const activeCount = documents.filter(d => d.isActive).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div>
          <h3 className="font-semibold text-sm">Active Contexts</h3>
          <p className="text-xs text-muted-foreground">
            {activeCount} of {documents.length} contexts active
          </p>
        </div>
        <button
          onClick={() => setDocuments(prev => 
            prev.map(d => ({ ...d, isActive: true }))
          )}
          className="text-xs text-primary hover:underline"
        >
          Activate All
        </button>
      </div>

      <div className="grid gap-3">
        {documents.map(doc => (
          <ContextCard
            key={doc.id}
            context={doc}
            onToggle={toggleActive}
            onRemove={removeDocument}
            onPreview={(ctx) => console.log('Preview:', ctx)}
            showActions={true}
          />
        ))}
      </div>

      {documents.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No documents added yet
        </div>
      )}
    </div>
  )
}

render(<RAGDocumentManager />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "ContextCard Props", data: contextCardProps })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Context Type" }), _jsx("p", { children: "The Context object structure:" }), _jsx("pre", { children: _jsx("code", { children: `interface Context {
  id: string
  type: 'document' | 'image' | 'video' | 'audio' | 'link' | 'text'
  name: string
  isActive: boolean
  createdAt: Date
  metadata: {
    fileSize?: number          // Size in bytes
    pageCount?: number         // For documents
    duration?: number          // For audio/video (seconds)
    extractedText?: string     // Preview text
    thumbnail?: string         // Preview image URL
    url?: string              // For link type
    author?: string           // Document author
    date?: string            // Document date
    [key: string]: any       // Additional metadata
  }
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsx("h3", { children: "When to Use" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Showing RAG documents attached to a conversation" }), _jsx("li", { children: "\u2705 Managing knowledge base sources" }), _jsx("li", { children: "\u2705 Displaying file uploads with metadata" }), _jsx("li", { children: "\u2705 Building document selection interfaces" })] }), _jsx("h3", { children: "Guidelines" }), _jsxs("ul", { children: [_jsx("li", { children: "Show active/inactive status clearly for RAG systems" }), _jsx("li", { children: "Provide preview functionality for better UX" }), _jsx("li", { children: "Include file size and other metadata for transparency" }), _jsx("li", { children: "Use thumbnails when available for visual recognition" }), _jsx("li", { children: "Confirm before removing contexts" })] }), _jsx(Callout, { type: "tip", title: "Performance Tip", children: "For large lists of contexts, use virtualization with VirtualizedList to maintain smooth performance." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Accessibility" }), _jsxs("ul", { children: [_jsx("li", { children: "Cards are keyboard navigable with focus indicators" }), _jsx("li", { children: "Action buttons have clear hover states" }), _jsx("li", { children: "Status is communicated visually and with badges" }), _jsx("li", { children: "File metadata is screen reader accessible" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "TypeScript" }), _jsx("pre", { children: _jsx("code", { children: `import { ContextCard, type ContextCardProps, type Context } from '@clarity-chat/react'

// Full type definition
interface ContextCardProps {
  context: Context
  onRemove?: (id: string) => void
  onToggle?: (id: string) => void
  onPreview?: (context: Context) => void
  showActions?: boolean
  className?: string
}

// Usage with state
const [contexts, setContexts] = useState<Context[]>([])

const handleToggle = (id: string) => {
  setContexts(prev => prev.map(ctx =>
    ctx.id === id ? { ...ctx, isActive: !ctx.isActive } : ctx
  ))
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/components/context-manager", className: "docs-card", children: [_jsx("h3", { children: "Context Manager" }), _jsx("p", { children: "Full context management UI" })] }), _jsxs("a", { href: "/reference/components/context-visualizer", className: "docs-card", children: [_jsx("h3", { children: "Context Visualizer" }), _jsx("p", { children: "Visual context relationships" })] }), _jsxs("a", { href: "/reference/components/file-upload", className: "docs-card", children: [_jsx("h3", { children: "File Upload" }), _jsx("p", { children: "Upload context files" })] }), _jsxs("a", { href: "/reference/components/citation-card", className: "docs-card", children: [_jsx("h3", { children: "Citation Card" }), _jsx("p", { children: "Display RAG citations" })] })] })] })] }));
}
const contextCardProps = [
    {
        name: 'context',
        type: 'Context',
        required: true,
        description: 'Context data object with metadata'
    },
    {
        name: 'onRemove',
        type: '(id: string) => void',
        required: false,
        description: 'Callback when remove button is clicked'
    },
    {
        name: 'onToggle',
        type: '(id: string) => void',
        required: false,
        description: 'Callback when activate/deactivate is clicked'
    },
    {
        name: 'onPreview',
        type: '(context: Context) => void',
        required: false,
        description: 'Callback when card or preview button is clicked'
    },
    {
        name: 'showActions',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Show action buttons (toggle, preview, remove)'
    },
    {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes'
    }
];
//# sourceMappingURL=page.js.map