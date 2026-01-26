import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { AlertCircle, FileText, Image as ImageIcon, Code2 } from 'lucide-react'

const meta: Meta = {
  title: 'Foundation/Fallback Behavior',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Fallback UI Behavior

Clarity Chat components gracefully degrade when optional peer dependencies are missing.
This ensures your app continues to work even if users don't install heavy features.

## Testing Fallbacks

Use the **Peer Dependencies** toolbar button to simulate missing dependencies:

1. Click the package icon in the toolbar
2. Toggle any optional dependency to "MISSING"
3. See how components adapt with fallback UIs

## Fallback Strategies

### 1. Informative Messages
Show clear messages explaining what's missing and how to enable the feature.

### 2. Alternative Rendering
Use simpler rendering methods when advanced libraries are unavailable.

### 3. Feature Detection
Components automatically detect available features at runtime.

### 4. Graceful Degradation
Core functionality always works, enhanced features are opt-in.
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj

interface FallbackCardProps {
  title: string
  description: string
  missingPeer: string
  fallbackBehavior: string
  children?: React.ReactNode
}

function FallbackCard({
  title,
  description,
  missingPeer,
  fallbackBehavior,
  children,
}: FallbackCardProps) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        background: 'white',
      }}
    >
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
        {title}
      </h3>
      <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px' }}>
        {description}
      </p>

      <div
        style={{
          background: '#f9fafb',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}
        >
          Missing Peer:
        </div>
        <code
          style={{
            fontSize: '13px',
            fontFamily: 'monospace',
            color: '#dc2626',
            fontWeight: '500',
          }}
        >
          {missingPeer}
        </code>
      </div>

      {children && (
        <div
          style={{
            border: '2px dashed #d1d5db',
            borderRadius: '6px',
            padding: '16px',
            marginBottom: '16px',
            background: '#fafafa',
          }}
        >
          {children}
        </div>
      )}

      <div
        style={{
          background: '#ecfdf5',
          padding: '12px',
          borderRadius: '6px',
          borderLeft: '3px solid #10b981',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#065f46',
            marginBottom: '4px',
          }}
        >
          Fallback Behavior:
        </div>
        <div style={{ fontSize: '13px', color: '#047857' }}>
          {fallbackBehavior}
        </div>
      </div>
    </div>
  )
}

function PDFFallback() {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div
        style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 12px',
          background: '#fee2e2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FileText size={32} color="#dc2626" />
      </div>
      <h4 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>
        PDF Support Not Available
      </h4>
      <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px' }}>
        Install <code>pdfjs-dist</code> to enable PDF file uploads
      </p>
      <pre
        style={{
          background: '#1f2937',
          color: '#f3f4f6',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          display: 'inline-block',
          margin: 0,
        }}
      >
        npm install pdfjs-dist
      </pre>
    </div>
  )
}

function MermaidFallback() {
  const code = `graph TD
    A[Start] --> B[Process]
    B --> C[End]`

  return (
    <div>
      <div
        style={{
          background: '#fef3c7',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <AlertCircle size={20} color="#f59e0b" />
        <span style={{ fontSize: '13px', color: '#78350f' }}>
          Mermaid diagrams require the <code>mermaid</code> package
        </span>
      </div>
      <pre
        style={{
          background: '#1f2937',
          color: '#f3f4f6',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '13px',
          fontFamily: 'monospace',
          margin: 0,
          whiteSpace: 'pre-wrap',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

function ShikiFallback() {
  const code = `function hello() {
  console.log("Hello, world!");
}`

  return (
    <div>
      <div
        style={{
          background: '#dbeafe',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Code2 size={20} color="#2563eb" />
        <span style={{ fontSize: '13px', color: '#1e3a8a' }}>
          Using basic syntax highlighting (Prism.js)
        </span>
      </div>
      <pre
        style={{
          background: '#1f2937',
          color: '#f3f4f6',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '13px',
          fontFamily: 'monospace',
          margin: 0,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

function MammothFallback() {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div
        style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 12px',
          background: '#fef3c7',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FileText size={32} color="#f59e0b" />
      </div>
      <h4 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>
        DOCX Support Not Available
      </h4>
      <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px' }}>
        Install <code>mammoth</code> to enable Word document uploads
      </p>
      <pre
        style={{
          background: '#1f2937',
          color: '#f3f4f6',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          display: 'inline-block',
          margin: 0,
        }}
      >
        npm install mammoth
      </pre>
    </div>
  )
}

function CohereFallback() {
  return (
    <div
      style={{
        background: '#eff6ff',
        padding: '16px',
        borderRadius: '6px',
        border: '1px solid #bfdbfe',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px',
        }}
      >
        <AlertCircle size={20} color="#2563eb" />
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
          Reranking Skipped
        </h4>
      </div>
      <p style={{ margin: '0', fontSize: '13px', color: '#1e40af' }}>
        Install <code>cohere-ai</code> to enable semantic reranking for better
        RAG accuracy. Results will be returned in original order.
      </p>
    </div>
  )
}

export const PDFUploadFallback: Story = {
  render: () => (
    <FallbackCard
      title="PDF Upload Fallback"
      description="When pdfjs-dist is not installed, file upload shows an informative error."
      missingPeer="pdfjs-dist"
      fallbackBehavior="Shows installation instructions and prevents PDF uploads until the package is installed."
    >
      <PDFFallback />
    </FallbackCard>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the fallback UI when trying to upload PDF files without pdfjs-dist.',
      },
    },
  },
}

export const MermaidDiagramFallback: Story = {
  render: () => (
    <FallbackCard
      title="Mermaid Diagram Fallback"
      description="When mermaid is not installed, diagrams render as code blocks instead."
      missingPeer="mermaid"
      fallbackBehavior="Renders the diagram code in a syntax-highlighted code block with a warning message."
    >
      <MermaidFallback />
    </FallbackCard>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows how Mermaid diagram code is displayed when the mermaid package is unavailable.',
      },
    },
  },
}

export const SyntaxHighlightingFallback: Story = {
  render: () => (
    <FallbackCard
      title="Syntax Highlighting Fallback"
      description="When shiki is not installed, falls back to Prism.js for basic highlighting."
      missingPeer="shiki"
      fallbackBehavior="Uses Prism.js as a lightweight alternative for syntax highlighting. Code remains readable."
    >
      <ShikiFallback />
    </FallbackCard>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates graceful degradation from Shiki to Prism.js for code highlighting.',
      },
    },
  },
}

export const DOCXUploadFallback: Story = {
  render: () => (
    <FallbackCard
      title="DOCX Upload Fallback"
      description="When mammoth is not installed, Word document uploads are disabled."
      missingPeer="mammoth"
      fallbackBehavior="Shows clear message with installation instructions and filters DOCX from accepted file types."
    >
      <MammothFallback />
    </FallbackCard>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows the fallback UI when attempting to upload Word documents without mammoth.',
      },
    },
  },
}

export const RerankingFallback: Story = {
  render: () => (
    <FallbackCard
      title="Reranking Fallback"
      description="When cohere-ai is not installed, RAG pipeline skips the reranking step."
      missingPeer="cohere-ai"
      fallbackBehavior="RAG pipeline continues to work but returns results in original similarity order without semantic reranking."
    >
      <CohereFallback />
    </FallbackCard>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how RAG continues to function without the optional reranking feature.',
      },
    },
  },
}

function AllFallbacks() {
  return (
    <div
      style={{
        display: 'grid',
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      }}
    >
      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          background: 'white',
        }}
      >
        <h4
          style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}
        >
          PDF Upload
        </h4>
        <PDFFallback />
      </div>

      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          background: 'white',
        }}
      >
        <h4
          style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}
        >
          DOCX Upload
        </h4>
        <MammothFallback />
      </div>

      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          background: 'white',
        }}
      >
        <h4
          style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}
        >
          Mermaid Diagrams
        </h4>
        <MermaidFallback />
      </div>

      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          background: 'white',
        }}
      >
        <h4
          style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}
        >
          Syntax Highlighting
        </h4>
        <ShikiFallback />
      </div>

      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          background: 'white',
        }}
      >
        <h4
          style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}
        >
          RAG Reranking
        </h4>
        <CohereFallback />
      </div>
    </div>
  )
}

export const AllFallbacksOverview: Story = {
  render: () => <AllFallbacks />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Overview of all fallback UIs in one place.',
      },
    },
  },
}
