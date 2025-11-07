import { useState } from 'react'
import {
  ChatWindow,
  ThemeProvider,
  themes,
  useChat,
  useVectorStore,
  useEmbeddings,
  useSmartCache,
  useMultiTenancy,
  useRBAC,
  FileUpload,
  KnowledgeBaseViewer,
  DocumentViewer,
  CitationCard,
  UsageDashboard,
  AuditLogViewer,
  TokenOptimizationDashboard,
} from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'
import { DocumentLibrary } from './components/DocumentLibrary'
import { SearchFilters } from './components/SearchFilters'
import { TenantSelector } from './components/TenantSelector'
import { UploadProgress } from './components/UploadProgress'
import { DocumentStats } from './components/DocumentStats'
import { QuickActions } from './components/QuickActions'
import type { Document, SearchFilters as IFilters } from './types'

function App() {
  const [theme, setTheme] = useState('glassmorphism')
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [filters, setFilters] = useState<IFilters>({})
  const [showUpload, setShowUpload] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showAudit, setShowAudit] = useState(false)

  // Multi-tenancy & RBAC
  const { currentTenant, switchTenant } = useMultiTenancy()
  const { hasPermission, currentRole } = useRBAC()

  // Vector store & embeddings
  const vectorStore = useVectorStore({
    provider: 'pinecone',
    config: {
      apiKey: import.meta.env.VITE_PINECONE_API_KEY,
      environment: import.meta.env.VITE_PINECONE_ENVIRONMENT,
      indexName: 'knowledge-hub',
    },
  })

  const embeddings = useEmbeddings({
    provider: 'openai',
    model: 'text-embedding-ada-002',
  })

  const cache = useSmartCache({
    enableSemanticMatching: true,
    ttl: 3600000, // 1 hour
  })

  // Chat with RAG
  const {
    messages,
    isLoading,
    sendMessage,
  } = useChat({
    api: '/api/knowledge-chat',
    onMessage: async (message) => {
      // Generate embedding for semantic search
      const embedding = await embeddings.embed(message.content)
      
      // Search vector store
      const results = await vectorStore.search(embedding, {
        topK: 5,
        filter: {
          tenant: currentTenant.id,
          ...filters,
        },
      })

      // Return results for context
      return results
    },
  })

  // Handle file upload
  const handleFileUpload = async (files: File[]) => {
    const canUpload = hasPermission('documents.upload')
    if (!canUpload) {
      alert('You do not have permission to upload documents')
      return
    }

    for (const file of files) {
      try {
        // 1. Upload file
        const formData = new FormData()
        formData.append('file', file)
        formData.append('tenant', currentTenant.id)

        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        })

        const { documentId, chunks } = await response.json()

        // 2. Generate embeddings
        const embeddings_results = await Promise.all(
          chunks.map((chunk: string) => embeddings.embed(chunk))
        )

        // 3. Store in vector database
        await vectorStore.addDocuments(
          chunks.map((chunk: string, i: number) => ({
            id: `${documentId}-${i}`,
            content: chunk,
            embedding: embeddings_results[i],
            metadata: {
              documentId,
              fileName: file.name,
              tenant: currentTenant.id,
              uploadedAt: new Date().toISOString(),
            },
          }))
        )

        // 4. Update local state
        setDocuments((prev) => [
          ...prev,
          {
            id: documentId,
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date(),
            chunks: chunks.length,
            tenant: currentTenant.id,
          },
        ])
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }

    setShowUpload(false)
  }

  // Handle document search with filters
  const handleSearch = async (query: string) => {
    if (!query.trim()) return

    // Check cache first
    const cached = await cache.get(query)
    if (cached) {
      console.log('⚡ Cache hit!')
      return cached
    }

    // Generate embedding and search
    const embedding = await embeddings.embed(query)
    const results = await vectorStore.search(embedding, {
      topK: 10,
      filter: {
        tenant: currentTenant.id,
        ...filters,
      },
    })

    // Cache results
    await cache.set(query, results)

    return results
  }

  return (
    <ThemeProvider theme={themes[theme as keyof typeof themes]}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        {/* Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  📚
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Knowledge Hub
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    RAG-Powered Document Intelligence
                  </p>
                </div>
              </div>

              {/* Center - Tenant Selector */}
              <TenantSelector
                currentTenant={currentTenant}
                onSwitch={switchTenant}
              />

              {/* Right - Actions */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {currentRole.name}
                </span>
                
                {hasPermission('analytics.view') && (
                  <button
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium transition-colors"
                  >
                    📊 Analytics
                  </button>
                )}

                {hasPermission('documents.upload') && (
                  <button
                    onClick={() => setShowUpload(!showUpload)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-sm font-medium transition-colors"
                  >
                    ⬆️ Upload
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          {/* Stats Dashboard */}
          <DocumentStats documents={documents} />

          <div className="grid grid-cols-12 gap-6 mt-6">
            {/* Left Sidebar - Document Library */}
            <div className="col-span-3">
              <div className="space-y-4">
                <SearchFilters
                  filters={filters}
                  onChange={setFilters}
                />
                
                <DocumentLibrary
                  documents={documents}
                  selectedDoc={selectedDoc}
                  onSelectDoc={setSelectedDoc}
                  onDeleteDoc={(doc) => {
                    if (hasPermission('documents.delete')) {
                      setDocuments((prev) => prev.filter((d) => d.id !== doc.id))
                    }
                  }}
                />
              </div>
            </div>

            {/* Main Content - Chat + Document Viewer */}
            <div className="col-span-9">
              <div className="grid grid-cols-2 gap-6 h-[calc(100vh-280px)]">
                {/* Chat Interface */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    💬 Ask Questions
                  </h2>
                  
                  <ChatWindow
                    messages={messages}
                    onSendMessage={sendMessage}
                    placeholder="Ask anything about your documents..."
                    isLoading={isLoading}
                    showVoiceInput
                    className="h-[calc(100%-60px)]"
                  />

                  {/* Quick Actions */}
                  <QuickActions
                    onAction={(action) => sendMessage(action)}
                  />
                </div>

                {/* Document Viewer */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 overflow-y-auto">
                  {selectedDoc ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          📄 {selectedDoc.name}
                        </h2>
                        <button
                          onClick={() => setSelectedDoc(null)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <DocumentViewer
                        document={selectedDoc}
                        highlightQuery={messages[messages.length - 1]?.content}
                      />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📄</div>
                        <p>Select a document to preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">📤 Upload Documents</h2>
                <button
                  onClick={() => setShowUpload(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <FileUpload
                onFilesSelected={handleFileUpload}
                accept=".pdf,.docx,.txt,.md,.xlsx,.pptx"
                multiple
                maxSize={10 * 1024 * 1024} // 10MB
              />
            </div>
          </div>
        )}

        {/* Analytics Dashboard */}
        {showAnalytics && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">📊 Analytics Dashboard</h2>
                  <button
                    onClick={() => setShowAnalytics(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <UsageDashboard
                    metrics={{
                      totalQueries: 1234,
                      totalDocuments: documents.length,
                      cacheHitRate: 70,
                      avgResponseTime: 1.2,
                    }}
                  />
                  
                  <TokenOptimizationDashboard
                    metrics={{
                      totalTokens: 50000,
                      tokensSaved: 35000,
                      costSaved: 1.05,
                      savingsPercent: 70,
                    }}
                  />
                </div>

                {hasPermission('audit.view') && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Audit Log</h3>
                    <AuditLogViewer
                      logs={[]}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  )
}

export default App
