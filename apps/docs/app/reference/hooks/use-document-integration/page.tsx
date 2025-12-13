import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'


export const metadata: Metadata = {
  title: 'useDocumentIntegration - Clarity Chat Components',
  description: 'Hook for integrating with document platforms to fetch, extract, and export documents.',
}

const optionsProps: Prop[] = [
  {
    name: 'platform',
    type: 'DocumentPlatform',
    description: 'Default document platform',
  },
  {
    name: 'apiEndpoint',
    type: 'string',
    description: 'API endpoint for document operations',
  },
  {
    name: 'apiKey',
    type: 'string',
    description: 'API key for authentication',
  },
]

export default function UseDocumentIntegrationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useDocumentIntegration</h1>
        <p className="docs-lead">
          Hook for integrating with document platforms (Google Docs, Notion, Confluence) to fetch, extract content, and export documents.
        </p>
      </div>

      <YouWillLearn
        items={[
          'List documents from platforms',
          'Fetch document content',
          'Extract content chunks for RAG',
          'Export documents',
          'Manage document state',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>
          Integrate with document platforms:
        </p>
        <CodePlayground
          initialCode={`import { useDocumentIntegration } from '@clarity-chat/react'

function DocumentManager() {
  const {
    documents,
    loading,
    error,
    listDocuments,
    fetchDocument,
    extractContent,
  } = useDocumentIntegration({
    platform: 'google-docs',
    apiEndpoint: '/api/documents',
  })

  React.useEffect(() => {
    listDocuments('google-docs')
  }, [])

  const handleSelect = async (documentId: string) => {
    const document = await fetchDocument(documentId, 'google-docs')
    const chunks = await extractContent(document)
    // Use chunks for RAG
  }

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {documents.map(doc => (
        <div key={doc.id}>{doc.title}</div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Content Extraction for RAG</h2>
        <p>
          Extract content chunks for RAG:
        </p>
        <CodePlayground
          initialCode={`import { useDocumentIntegration } from '@clarity-chat/react'

function RAGExtraction() {
  const { fetchDocument, extractContent } = useDocumentIntegration()

  const processDocument = async (documentId: string) => {
    // Fetch document
    const document = await fetchDocument(documentId)
    
    // Extract chunks
    const chunks = await extractContent(document, 1000, 200) // chunkSize, overlap
    
    // Add to vector store
    for (const chunk of chunks) {
      await addToVectorStore({
        id: chunk.id,
        content: chunk.content,
        metadata: {
          documentId: document.id,
          startIndex: chunk.startIndex,
          endIndex: chunk.endIndex,
        },
      })
    }
  }

  return <button onClick={() => processDocument('doc-123')}>Process Document</button>
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Document Export</h2>
        <p>
          Export documents in various formats:
        </p>
        <CodePlayground
          initialCode={`import { useDocumentIntegration } from '@clarity-chat/react'

function DocumentExporter() {
  const { exportDocument } = useDocumentIntegration()

  const handleExport = async (documentId: string) => {
    const blob = await exportDocument(documentId, {
      format: 'pdf',
      includeComments: true,
      includeImages: true,
    })
    
    // Download file
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = \`document-\${documentId}.pdf\`
    a.click()
  }

  return <button onClick={() => handleExport('doc-123')}>Export PDF</button>
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Options</h2>
        <PropsTable props={optionsProps} />
      </section>

      <section className="docs-section">
        <h2>Return Values</h2>
        <ul>
          <li><code>documents</code>: Array of document metadata</li>
          <li><code>loading</code>: Whether operation is in progress</li>
          <li><code>error</code>: Error message if any</li>
          <li><code>listDocuments</code>: Function to list documents from platform</li>
          <li><code>fetchDocument</code>: Function to fetch document content</li>
          <li><code>extractContent</code>: Function to extract content chunks</li>
          <li><code>exportDocument</code>: Function to export document</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use <code>apiEndpoint</code> for secure server-side document access</li>
          <li>Extract chunks with appropriate size and overlap for RAG</li>
          <li>Cache document content for performance</li>
          <li>Handle errors gracefully</li>
          <li>Use appropriate export formats based on use case</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/components/document-integration">DocumentIntegration</a> - Document integration component</li>
          <li><a href="/reference/components/semantic-message-search">SemanticMessageSearch</a> - Semantic search component</li>
        </ul>
      </section>
    </div>
  )
}
