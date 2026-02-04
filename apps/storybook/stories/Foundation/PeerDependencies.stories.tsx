import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

const meta: Meta = {
  title: 'Foundation/Peer Dependencies',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Peer Dependencies Guide

Clarity Chat Components use a flexible peer dependency system to optimize bundle size.

## Required Peers

These dependencies are always required:

- **react** (^18.0.0 || ^19.0.0) - Core React library (~100KB)
- **framer-motion** (^12.0.0) - Animation library (~80KB)
- **lucide-react** (^0.500.0) - Icon library (~50KB)
- **zod** (^3.24.0) - Schema validation (~60KB)

## Optional Peers

These dependencies are only needed for specific features:

### Document Processing
- **pdfjs-dist** (~2.5MB) - PDF parsing and rendering
- **mammoth** (~200KB) - DOCX document parsing

### Advanced Features
- **flowtoken** (~30KB) - Advanced token streaming
- **mermaid** (~500KB) - Diagram rendering
- **cohere-ai** (~150KB) - Reranking service
- **shiki** (~400KB) - Advanced syntax highlighting

### Markdown Rendering
- **react-markdown** (~40KB) - Base markdown renderer
- **remark-gfm** (~20KB) - GitHub Flavored Markdown
- **rehype-highlight** (~15KB) - Syntax highlighting
- **prismjs** (~30KB) - Alternative syntax highlighting

### Utilities
- **jszip** (~100KB) - ZIP file handling
- **react-dom** (~130KB) - Optional for SSR environments

## Installation

### Minimal Install (Core Features Only)
\`\`\`bash
npm install @clarity-chat/react react framer-motion lucide-react zod
\`\`\`

### Full Install (All Features)
\`\`\`bash
npm install @clarity-chat/react react framer-motion lucide-react zod \\
  pdfjs-dist mammoth flowtoken mermaid cohere-ai shiki \\
  jszip prismjs react-markdown remark-gfm rehype-highlight
\`\`\`

### Install Script
Use our helper script to install all peers:
\`\`\`bash
npm run install-peers
\`\`\`

## Fallback Behavior

When optional peers are missing, components gracefully degrade:

1. **PDF Upload** - Shows "PDF support not available" message
2. **DOCX Upload** - Shows "DOCX support not available" message
3. **Mermaid Diagrams** - Renders as code block instead
4. **Advanced Syntax Highlighting** - Falls back to basic highlighting
5. **Reranking** - Skips reranking step in RAG pipeline

## Testing Missing Peers

Use the Storybook toolbar to simulate missing dependencies and test fallback UIs.
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj

function PeerDependencyTable() {
  const peers = [
    {
      name: 'react',
      version: '^18.0.0 || ^19.0.0',
      size: '~100KB',
      required: true,
      category: 'Core',
      description: 'React library for UI components',
    },
    {
      name: 'framer-motion',
      version: '^12.0.0',
      size: '~80KB',
      required: true,
      category: 'Core',
      description: 'Animation and motion library',
    },
    {
      name: 'lucide-react',
      version: '^0.500.0',
      size: '~50KB',
      required: true,
      category: 'Core',
      description: 'Icon library',
    },
    {
      name: 'zod',
      version: '^3.24.0',
      size: '~60KB',
      required: true,
      category: 'Core',
      description: 'Schema validation',
    },
    {
      name: 'pdfjs-dist',
      version: '^3.0.0 || ^4.0.0',
      size: '~2.5MB',
      required: false,
      category: 'Documents',
      description: 'PDF parsing and rendering',
    },
    {
      name: 'mammoth',
      version: '^1.0.0',
      size: '~200KB',
      required: false,
      category: 'Documents',
      description: 'DOCX document parsing',
    },
    {
      name: 'flowtoken',
      version: '^1.0.0',
      size: '~30KB',
      required: false,
      category: 'Advanced',
      description: 'Token streaming',
    },
    {
      name: 'mermaid',
      version: '^11.0.0',
      size: '~500KB',
      required: false,
      category: 'Advanced',
      description: 'Diagram rendering',
    },
    {
      name: 'cohere-ai',
      version: '^7.0.0',
      size: '~150KB',
      required: false,
      category: 'Advanced',
      description: 'Reranking service',
    },
    {
      name: 'shiki',
      version: '^3.0.0',
      size: '~400KB',
      required: false,
      category: 'Markdown',
      description: 'Syntax highlighting',
    },
    {
      name: 'react-markdown',
      version: '^10.0.0',
      size: '~40KB',
      required: false,
      category: 'Markdown',
      description: 'Markdown renderer',
    },
    {
      name: 'prismjs',
      version: '^1.29.0',
      size: '~30KB',
      required: false,
      category: 'Markdown',
      description: 'Basic syntax highlighting',
    },
  ]

  const groupedPeers = peers.reduce(
    (acc, peer) => {
      if (!acc[peer.category]) {
        acc[peer.category] = []
      }
      acc[peer.category].push(peer)
      return acc
    },
    {} as Record<string, typeof peers>
  )

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <div
        style={{
          background: '#f0f9ff',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
          borderLeft: '4px solid #0284c7',
        }}
      >
        <h3 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>
          Bundle Size Optimization
        </h3>
        <p style={{ margin: 0, color: '#075985', fontSize: '14px' }}>
          Clarity Chat uses peer dependencies to keep the core bundle small.
          Install only what you need for your use case.
        </p>
      </div>

      {Object.entries(groupedPeers).map(([category, categoryPeers]) => (
        <div key={category} style={{ marginBottom: '32px' }}>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '12px',
              color: '#1f2937',
            }}
          >
            {category}
          </h3>
          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
              }}
            >
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Package
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Version
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Size
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryPeers.map((peer, idx) => (
                  <tr
                    key={peer.name}
                    style={{
                      borderTop: idx > 0 ? '1px solid #e5e7eb' : 'none',
                    }}
                  >
                    <td style={{ padding: '12px' }}>
                      <div>
                        <code
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '13px',
                            fontWeight: '500',
                          }}
                        >
                          {peer.name}
                        </code>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            marginTop: '4px',
                          }}
                        >
                          {peer.description}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#6b7280' }}>
                      <code style={{ fontSize: '12px' }}>{peer.version}</code>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#059669',
                        }}
                      >
                        {peer.size}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {peer.required ? (
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            background: '#fee2e2',
                            color: '#991b1b',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          Required
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            background: '#dbeafe',
                            color: '#1e40af',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          Optional
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div
        style={{
          background: '#fef3c7',
          padding: '16px',
          borderRadius: '8px',
          marginTop: '24px',
          borderLeft: '4px solid #f59e0b',
        }}
      >
        <h4 style={{ margin: '0 0 8px 0', color: '#92400e' }}>
          Testing Fallbacks
        </h4>
        <p style={{ margin: 0, color: '#78350f', fontSize: '14px' }}>
          Use the <strong>Peer Dependencies</strong> toolbar button above to
          simulate missing dependencies and see how components gracefully
          degrade.
        </p>
      </div>
    </div>
  )
}

export const Overview: Story = {
  render: () => <PeerDependencyTable />,
  parameters: {
    docs: {
      description: {
        story:
          'Complete overview of peer dependencies, their sizes, and requirements.',
      },
    },
  },
}

function InstallationGuide() {
  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '800px',
        lineHeight: '1.6',
      }}
    >
      <h2 style={{ marginTop: 0 }}>Installation Options</h2>

      <div
        style={{
          background: '#f9fafb',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '24px',
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: '600' }}>
          1. Minimal Install (Recommended)
        </h3>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Install only core dependencies for basic chat functionality:
        </p>
        <pre
          style={{
            background: '#1f2937',
            color: '#f3f4f6',
            padding: '16px',
            borderRadius: '6px',
            overflow: 'auto',
            fontSize: '13px',
            fontFamily: 'monospace',
          }}
        >
          <code>npm install @clarity-chat/react react framer-motion lucide-react zod</code>
        </pre>
        <div
          style={{
            marginTop: '12px',
            fontSize: '13px',
            color: '#059669',
            fontWeight: '500',
          }}
        >
          Core bundle size: ~290KB (all required peers included)
        </div>
      </div>

      <div
        style={{
          background: '#f9fafb',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '24px',
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: '600' }}>
          2. Add Markdown Support
        </h3>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          For markdown message rendering with syntax highlighting:
        </p>
        <pre
          style={{
            background: '#1f2937',
            color: '#f3f4f6',
            padding: '16px',
            borderRadius: '6px',
            overflow: 'auto',
            fontSize: '13px',
            fontFamily: 'monospace',
          }}
        >
          <code>npm install react-markdown remark-gfm rehype-highlight prismjs</code>
        </pre>
        <div
          style={{
            marginTop: '12px',
            fontSize: '13px',
            color: '#059669',
            fontWeight: '500',
          }}
        >
          +105KB for full markdown support
        </div>
      </div>

      <div
        style={{
          background: '#f9fafb',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '24px',
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: '600' }}>
          3. Add Document Processing
        </h3>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          For PDF and DOCX file upload support:
        </p>
        <pre
          style={{
            background: '#1f2937',
            color: '#f3f4f6',
            padding: '16px',
            borderRadius: '6px',
            overflow: 'auto',
            fontSize: '13px',
            fontFamily: 'monospace',
          }}
        >
          <code>npm install pdfjs-dist mammoth</code>
        </pre>
        <div
          style={{
            marginTop: '12px',
            fontSize: '13px',
            color: '#d97706',
            fontWeight: '500',
          }}
        >
          +2.7MB (only loaded when processing documents)
        </div>
      </div>

      <div
        style={{
          background: '#f9fafb',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '24px',
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: '600' }}>
          4. Full Install
        </h3>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Use the helper script to install all features:
        </p>
        <pre
          style={{
            background: '#1f2937',
            color: '#f3f4f6',
            padding: '16px',
            borderRadius: '6px',
            overflow: 'auto',
            fontSize: '13px',
            fontFamily: 'monospace',
          }}
        >
          <code>npm run install-peers</code>
        </pre>
        <div
          style={{
            marginTop: '12px',
            fontSize: '13px',
            color: '#dc2626',
            fontWeight: '500',
          }}
        >
          Total: ~4.5MB (includes all optional features)
        </div>
      </div>

      <div
        style={{
          background: '#eff6ff',
          padding: '16px',
          borderRadius: '8px',
          borderLeft: '4px solid #3b82f6',
        }}
      >
        <h4 style={{ margin: '0 0 8px 0', color: '#1e40af' }}>
          Tree-Shaking Benefits
        </h4>
        <p style={{ margin: 0, color: '#1e3a8a', fontSize: '14px' }}>
          Optional dependencies are dynamically imported only when features are
          used. Your final bundle only includes what your users actually need.
        </p>
      </div>
    </div>
  )
}

export const InstallationInstructions: Story = {
  render: () => <InstallationGuide />,
  parameters: {
    docs: {
      description: {
        story: 'Step-by-step installation guide for different use cases.',
      },
    },
  },
}
