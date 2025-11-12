/**
 * Advanced Memory System Example
 * 
 * Demonstrates advanced features:
 * - Token optimization
 * - Memory compression
 * - Memory promotion
 * - Event listeners
 * - Custom memory queries
 */

import React from 'react'
import {
  MemoryProvider,
  useMemory,
  useMemoryQuery,
  useMemoryStats,
  useMemoryEvents,
  useTokenOptimization,
  type MemoryServiceConfig,
  type MemoryItem,
} from '@clarity-chat/react/memory'

// Advanced configuration with compression
const memoryConfig: MemoryServiceConfig = {
  tokenOptimization: {
    maxContextWindow: 8192,
    allocation: {
      systemPrompt: 0.12,
      userPreferences: 0.18,
      recentContext: 0.28,
      semanticMemory: 0.22,
      episodicMemory: 0.15,
      responseReserve: 0.05,
    },
    dynamicAllocation: true,
    enableCompression: true,
    compressionRatio: 0.5,
    enableChunking: true,
    chunkSize: 250,
    chunkOverlap: 75,
  },
  persistence: {
    useVectorStore: true,
    vectorStoreNamespace: 'advanced-memories',
    useCache: true,
    cacheTTL: 7200,
    useDatabase: true,
    databaseUrl: process.env.DATABASE_URL,
    batchSize: 50,
  },
  enableAutoSummarization: true,
  summarizationInterval: 180000, // 3 minutes
  enableAutoCleanup: true,
  cleanupInterval: 1800000, // 30 minutes
  retentionPolicy: {
    shortTerm: 1800,
    session: 43200,
    thread: 259200,
    global: 0,
  },
  debug: true,
}

/**
 * Memory Dashboard Component
 */
function MemoryDashboard() {
  const { stats, refresh } = useMemoryStats(5000) // Refresh every 5s
  const [events, setEvents] = React.useState<string[]>([])

  // Listen to memory events
  useMemoryEvents('memory:created', event => {
    setEvents(prev => [...prev.slice(-9), `Created: ${event.memory?.content.slice(0, 50)}...`])
  })

  useMemoryEvents('memory:compressed', event => {
    setEvents(prev => [...prev.slice(-9), `Compressed: ${event.data?.compressionRatio.toFixed(2)}x`])
  })

  useMemoryEvents('memory:promoted', event => {
    setEvents(prev => [...prev.slice(-9), `Promoted: ${event.data?.from} → ${event.data?.to}`])
  })

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Memory Dashboard</h2>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded">
          <p className="text-sm text-gray-600">Total Memories</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="p-4 bg-green-50 rounded">
          <p className="text-sm text-gray-600">Total Tokens</p>
          <p className="text-3xl font-bold">{stats.totalTokens.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-purple-50 rounded">
          <p className="text-sm text-gray-600">Avg Confidence</p>
          <p className="text-3xl font-bold">{(stats.averageConfidence * 100).toFixed(0)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold mb-2">By Type</h3>
          <div className="space-y-1 text-sm">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="flex justify-between">
                <span className="capitalize">{type}:</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">By Scope</h3>
          <div className="space-y-1 text-sm">
            {Object.entries(stats.byScope).map(([scope, count]) => (
              <div key={scope} className="flex justify-between">
                <span className="capitalize">{scope}:</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Recent Events</h3>
        <div className="space-y-1 text-sm max-h-40 overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-gray-500">No events yet</p>
          ) : (
            events.map((event, i) => (
              <p key={i} className="text-gray-700">{event}</p>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Memory Query Component
 */
function MemoryQueryPanel() {
  const { addMemory, compressMemory, promoteMemory, deleteMemory } = useMemory()
  const [queryText, setQueryText] = React.useState('')
  const [selectedMemory, setSelectedMemory] = React.useState<string | null>(null)

  // Query memories with the text
  const { data: results, isLoading, refetch } = useMemoryQuery(
    {
      query: queryText,
      limit: 10,
      minConfidence: 0.5,
      tokenBudget: 1000,
    },
    {
      enabled: queryText.length > 2,
    }
  )

  const handleAddMemory = async () => {
    if (!queryText.trim()) return

    await addMemory(
      queryText,
      'semantic',
      'thread',
      { source: 'user-input' },
      { priority: 'high', confidence: 0.9 }
    )

    setQueryText('')
    refetch()
  }

  const handleCompress = async (memoryId: string) => {
    await compressMemory(memoryId, 0.5)
    refetch()
  }

  const handlePromote = async (memoryId: string) => {
    await promoteMemory(memoryId, 'global')
    refetch()
  }

  const handleDelete = async (memoryId: string) => {
    await deleteMemory(memoryId)
    setSelectedMemory(null)
    refetch()
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Memory Query</h2>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={queryText}
            onChange={e => setQueryText(e.target.value)}
            placeholder="Search memories or add new..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddMemory}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add
          </button>
        </div>
      </div>

      {isLoading && <p className="text-gray-500">Searching...</p>}

      <div className="space-y-2">
        {results.map(result => (
          <div
            key={result.memory.id}
            className={`p-4 border rounded cursor-pointer transition-colors ${
              selectedMemory === result.memory.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedMemory(result.memory.id)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  {result.memory.type} • {result.memory.scope}
                </span>
              </div>
              <span className="text-sm font-semibold text-blue-600">
                {(result.relevance * 100).toFixed(0)}% match
              </span>
            </div>
            
            <p className="text-sm mb-2">{result.memory.content}</p>
            
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{result.memory.tokens} tokens</span>
              <span>{(result.memory.confidence * 100).toFixed(0)}% confidence</span>
            </div>

            {selectedMemory === result.memory.id && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={e => {
                    e.stopPropagation()
                    handleCompress(result.memory.id)
                  }}
                  className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                >
                  Compress
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    handlePromote(result.memory.id)
                  }}
                  className="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
                >
                  Promote
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    handleDelete(result.memory.id)
                  }}
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Token Optimization Panel
 */
function TokenOptimizationPanel() {
  const [systemPrompt, setSystemPrompt] = React.useState('You are a helpful AI assistant.')
  const [messages, setMessages] = React.useState<string[]>([
    'Hello, how are you?',
    'I need help with my code.',
    'Can you explain recursion?',
  ])

  const { optimizedContext, isOptimizing, reoptimize } = useTokenOptimization({
    systemPrompt,
    userPreferences: { theme: 'dark', language: 'en' },
    recentMessages: messages,
    includeSemanticMemory: true,
    includeEpisodicMemory: true,
  })

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Token Optimization</h2>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">System Prompt</label>
        <textarea
          value={systemPrompt}
          onChange={e => setSystemPrompt(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <button
        onClick={reoptimize}
        disabled={isOptimizing}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 mb-4"
      >
        {isOptimizing ? 'Optimizing...' : 'Optimize Context'}
      </button>

      {optimizedContext && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded">
            <h3 className="font-semibold mb-2">Optimization Stats</h3>
            <div className="space-y-1 text-sm">
              <p>Total Tokens: {optimizedContext.stats.totalTokens}</p>
              <p>Compression Ratio: {optimizedContext.stats.compressionRatio.toFixed(2)}x</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Allocation</h3>
            <div className="space-y-1 text-sm">
              {Object.entries(optimizedContext.stats.allocation).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="font-semibold">{value} tokens</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Main App
 */
export function App() {
  return (
    <MemoryProvider config={memoryConfig} autoStart={true}>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Advanced Memory System
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MemoryDashboard />
          <MemoryQueryPanel />
        </div>

        <div className="mt-6">
          <TokenOptimizationPanel />
        </div>
      </div>
    </MemoryProvider>
  )
}

export default App
