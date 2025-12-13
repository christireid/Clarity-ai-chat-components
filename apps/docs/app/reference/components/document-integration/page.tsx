import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'DocumentIntegration - Clarity Chat Components',
  description:
    'Integrate with document platforms (Google Docs, Notion, Confluence) for content extraction and RAG.',
}

const props: Prop[] = [
  {
    name: 'platforms',
    type: 'DocumentPlatform[]',
    description: 'Enabled platforms',
  },
  {
    name: 'initialDocuments',
    type: 'DocumentMetadata[]',
    description: 'Initial documents',
  },
  {
    name: 'onDocumentSelect',
    type: '(document: DocumentContent) => void',
    description: 'Callback when document selected',
  },
  {
    name: 'onContentExtract',
    type: '(content: DocumentContent) => void',
    description: 'Callback when document content extracted',
  },
  {
    name: 'onExport',
    type: '(documentId: string, options: DocumentExportOptions) => Promise<Blob>',
    description: 'Callback when document exported',
  },
  {
    name: 'fetchDocument',
    type: '(id: string, platform: DocumentPlatform) => Promise<DocumentContent>',
    description: 'Custom fetch function',
  },
  {
    name: 'listDocuments',
    type: '(platform: DocumentPlatform) => Promise<DocumentMetadata[]>',
    description: 'Custom list function',
  },
  {
    name: 'showPlatformSelector',
    type: 'boolean',
    description: 'Show platform selector',
  },
  {
    name: 'multiSelect',
    type: 'boolean',
    description: 'Allow multi-select',
  },
  {
    name: 'maxDocuments',
    type: 'number',
    description: 'Max documents to display',
  },
]

export default function DocumentIntegrationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>DocumentIntegration</h1>
        <p className="docs-lead">
          Integrate with document platforms (Google Docs, Notion, Confluence,
          Dropbox, OneDrive, SharePoint) for content extraction and RAG.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Connect to document platforms',
          'List and select documents',
          'Extract document content',
          'Export documents',
          'Use documents for RAG',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Integrate with document platforms:</p>
        <CodePlayground
          initialCode={`import { DocumentIntegration } from '@clarity-chat/react'

function DocumentSelector() {
  return (
    <DocumentIntegration
      platforms={['google-docs', 'notion', 'confluence']}
      onDocumentSelect={(document) => {
        console.log('Selected document:', document.metadata.title)
        // Use document content for RAG
      }}
      onContentExtract={(content) => {
        console.log('Extracted content:', content.text)
        // Process content chunks
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Fetch Functions</h2>
        <p>Provide custom fetch and list functions:</p>
        <CodePlayground
          initialCode={`import { DocumentIntegration } from '@clarity-chat/react'

function CustomIntegration() {
  return (
    <DocumentIntegration
      platforms={['google-docs']}
      fetchDocument={async (id, platform) => {
        const response = await fetch(\`/api/documents/\${platform}/\${id}\`)
        return response.json()
      }}
      listDocuments={async (platform) => {
        const response = await fetch(\`/api/documents/\${platform}\`)
        return response.json()
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Document Export</h2>
        <p>Export documents in various formats:</p>
        <CodePlayground
          initialCode={`import { DocumentIntegration } from '@clarity-chat/react'

function WithExport() {
  return (
    <DocumentIntegration
      platforms={['google-docs', 'notion']}
      onExport={async (documentId, options) => {
        const response = await fetch(\`/api/documents/\${documentId}/export\`, {
          method: 'POST',
          body: JSON.stringify(options),
        })
        return response.blob()
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Multi-Select</h2>
        <p>Enable multi-select for multiple documents:</p>
        <CodePlayground
          initialCode={`import { DocumentIntegration } from '@clarity-chat/react'

function MultiSelectDocs() {
  return (
    <DocumentIntegration
      platforms={['google-docs', 'notion']}
      multiSelect={true}
      onDocumentSelect={(document) => {
        // Handle multiple document selection
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>RAG Integration</h2>
        <p>Use documents for RAG (Retrieval-Augmented Generation):</p>
        <CodePlayground
          initialCode={`import { DocumentIntegration, useDocumentIntegration } from '@clarity-chat/react'

function RAGIntegration() {
  const { extractChunks } = useDocumentIntegration()

  const handleDocumentSelect = async (document) => {
    // Extract chunks for RAG
    const chunks = await extractChunks(document.id)
    
    // Add to vector store
    await addToVectorStore(chunks)
    
    // Use in chat context
    useInChatContext(chunks)
  }

  return (
    <DocumentIntegration
      platforms={['google-docs', 'notion']}
      onDocumentSelect={handleDocumentSelect}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <PropsTable props={props} />
      </section>

      <section className="docs-section">
        <h2>Supported Platforms</h2>
        <ul>
          <li>
            <strong>google-docs</strong>: Google Docs
          </li>
          <li>
            <strong>google-sheets</strong>: Google Sheets
          </li>
          <li>
            <strong>google-slides</strong>: Google Slides
          </li>
          <li>
            <strong>notion</strong>: Notion
          </li>
          <li>
            <strong>confluence</strong>: Confluence
          </li>
          <li>
            <strong>dropbox</strong>: Dropbox
          </li>
          <li>
            <strong>onedrive</strong>: OneDrive
          </li>
          <li>
            <strong>sharepoint</strong>: SharePoint
          </li>
          <li>
            <strong>local</strong>: Local files
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use custom fetch functions for secure API access</li>
          <li>Extract content chunks for RAG integration</li>
          <li>Enable multi-select for bulk operations</li>
          <li>Export documents in appropriate formats</li>
          <li>Cache document content for performance</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/hooks/use-document-integration">
              useDocumentIntegration
            </a>{' '}
            - Document integration hook
          </li>
          <li>
            <a href="/reference/components/semantic-message-search">
              SemanticMessageSearch
            </a>{' '}
            - Semantic search component
          </li>
        </ul>
      </section>
    </div>
  )
}
