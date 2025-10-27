/**
 * RAG Workbench - Main UI
 * Document Q&A with Retrieval Augmented Generation
 */

'use client'

import { useState, useRef } from 'react'

interface Document {
  id: string
  name: string
  size: number
  chunks: number
  tokens: number
  createdAt: string
}

interface Source {
  documentName: string
  text: string
  relevanceScore: number
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  tokens?: any
  cost?: number
  responseTime?: number
}

export default function RAGWorkbenchPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [model, setModel] = useState('gpt-3.5-turbo')
  const [provider, setProvider] = useState<'openai' | 'anthropic' | 'google'>('openai')
  const [topK, setTopK] = useState(3)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load documents on mount
  useState(() => {
    loadDocuments()
  })

  async function loadDocuments() {
    try {
      const response = await fetch('/api/documents')
      const data = await response.json()
      setDocuments(data.documents || [])
    } catch (error) {
      console.error('Failed to load documents:', error)
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Upload failed')
        return
      }

      const result = await response.json()
      alert(`Document uploaded: ${result.chunks} chunks created`)
      
      // Reload documents
      loadDocuments()
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  async function handleDeleteDocument(documentId: string) {
    if (!confirm('Delete this document?')) return

    try {
      const response = await fetch(`/api/documents?id=${documentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadDocuments()
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  async function handleSendQuery() {
    if (!query.trim() || isLoading) return

    if (documents.length === 0) {
      alert('Please upload at least one document first')
      return
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query
    }

    setMessages(prev => [...prev, userMessage])
    setQuery('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          topK,
          model,
          provider
        })
      })

      if (!response.ok) {
        throw new Error('Query failed')
      }

      // Stream response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      let assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: '',
        sources: [],
        tokens: null,
        cost: 0,
        responseTime: 0
      }

      setMessages(prev => [...prev, assistantMessage])

      if (!reader) throw new Error('No response body')

      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            try {
              const parsed = JSON.parse(data)

              if (parsed.type === 'metadata') {
                assistantMessage.sources = parsed.sources
                setMessages(prev => [...prev.slice(0, -1), { ...assistantMessage }])
              } else if (parsed.type === 'content') {
                assistantMessage.content += parsed.content
                setMessages(prev => [...prev.slice(0, -1), { ...assistantMessage }])
              } else if (parsed.type === 'done') {
                assistantMessage.tokens = parsed.tokens
                assistantMessage.cost = parsed.cost
                assistantMessage.responseTime = parsed.responseTime
                setMessages(prev => [...prev.slice(0, -1), { ...assistantMessage }])
              } else if (parsed.type === 'error') {
                throw new Error(parsed.error)
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Query error:', error)
      alert('Query failed: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            📚 RAG Workbench
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Document Q&A with Retrieval Augmented Generation
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Documents */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Documents</h2>
              
              {/* Upload Button */}
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={`block w-full text-center px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    isUploading
                      ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                      : 'border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400'
                  }`}
                >
                  {isUploading ? (
                    <span className="text-gray-500">Uploading...</span>
                  ) : (
                    <span className="text-blue-600 font-medium">
                      📄 Upload Document
                    </span>
                  )}
                </label>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  .txt or .md files only
                </p>
              </div>

              {/* Document List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {documents.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>No documents yet</p>
                    <p className="text-sm mt-1">Upload a document to get started</p>
                  </div>
                ) : (
                  documents.map(doc => (
                    <div
                      key={doc.id}
                      className="p-3 bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {doc.chunks} chunks • {doc.tokens.toLocaleString()} tokens
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="ml-2 text-red-500 hover:text-red-700 text-sm"
                          title="Delete document"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Settings */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-semibold mb-3">Settings</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Provider
                    </label>
                    <select
                      value={provider}
                      onChange={(e) => {
                        setProvider(e.target.value as any)
                        if (e.target.value === 'openai') setModel('gpt-3.5-turbo')
                        else if (e.target.value === 'anthropic') setModel('claude-3-haiku')
                        else if (e.target.value === 'google') setModel('gemini-pro')
                      }}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic</option>
                      <option value="google">Google AI</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Model
                    </label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      {provider === 'openai' && (
                        <>
                          <option value="gpt-4-turbo">GPT-4 Turbo</option>
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        </>
                      )}
                      {provider === 'anthropic' && (
                        <>
                          <option value="claude-3-opus">Claude 3 Opus</option>
                          <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                          <option value="claude-3-haiku">Claude 3 Haiku</option>
                        </>
                      )}
                      {provider === 'google' && (
                        <option value="gemini-pro">Gemini Pro</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Chunks to retrieve: {topK}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={topK}
                      onChange={(e) => setTopK(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Area - Chat */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md flex flex-col h-[calc(100vh-200px)]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <p className="text-lg">💬 Ask a question about your documents</p>
                      <p className="text-sm mt-2">Upload a document first, then ask away!</p>
                    </div>
                  </div>
                ) : (
                  messages.map(message => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg px-4 py-3`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        
                        {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            <p className="text-xs font-semibold mb-2">📚 Sources:</p>
                            {message.sources.map((source, idx) => (
                              <details key={idx} className="text-xs mb-1">
                                <summary className="cursor-pointer hover:underline">
                                  {source.documentName} (score: {source.relevanceScore.toFixed(1)})
                                </summary>
                                <p className="mt-1 pl-3 text-gray-600">{source.text}</p>
                              </details>
                            ))}
                          </div>
                        )}
                        
                        {message.role === 'assistant' && message.tokens && (
                          <div className="mt-2 text-xs text-gray-600">
                            <p>
                              📊 {message.tokens.total.toLocaleString()} tokens 
                              ({message.tokens.context} context + {message.tokens.completion} response)
                              • 💰 ${message.cost?.toFixed(6)}
                              • ⏱️ {(message.responseTime! / 1000).toFixed(1)}s
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendQuery()}
                    placeholder={documents.length === 0 ? "Upload a document first..." : "Ask a question..."}
                    disabled={isLoading || documents.length === 0}
                    className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                  <button
                    onClick={handleSendQuery}
                    disabled={isLoading || !query.trim() || documents.length === 0}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isLoading ? 'Thinking...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
