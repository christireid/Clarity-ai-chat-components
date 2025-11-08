// @ts-nocheck - Example app needs refactoring for current API
'use client'

import { useState, useCallback } from 'react'
import {
  ChatWindow,
  ThemeProvider,
  themes,
  useMessageOperations,
  // useTokenOptimization, // TODO: Fix metrics structure
  // TokenOptimizationDashboard, // TODO: Fix metrics structure
  AgentRunFeed,
  ContextVisualizer,
  KnowledgeBaseViewer,
  CitationCard,
  ConversationTimeline,
  MemoryInspector,
  SessionSummaryCard,
  AdvancedChatInput,
  CommandPalette,
  useStreamingSSE,
} from '@clarity-chat/react'
import { ResearchAgent } from '@/components/ResearchAgent'
import { KnowledgeGraph } from '@/components/KnowledgeGraph'
import { ResearchDashboard } from '@/components/ResearchDashboard'
import { motion } from 'framer-motion'
import { BookOpen, Brain, Database, Zap, BarChart3, Network } from 'lucide-react'

export default function ResearchPlatform() {
  const [activeView, setActiveView] = useState<'chat' | 'dashboard' | 'knowledge'>('chat')
  const [researchTopic, setResearchTopic] = useState('')
  
  const {
    messages,
    addMessage,
    editMessage,
    regenerateMessage,
    branchConversation,
  } = useMessageOperations()

  // const {
  //   metrics,
  //   enableOptimization,
  //   disableOptimization,
  // } = useTokenOptimization({
  //   enabled: true,
  //   trackMetrics: true,
  // })

  const { streamMessage, isStreaming } = useStreamingSSE({
    url: '/api/research',
    onMessage: (content) => {
      // Handle streaming responses
    },
  })

  const handleResearch = useCallback(async (query: string) => {
    setResearchTopic(query)
    
    // Add user message
    addMessage({
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date(),
    })

    // Stream research response
    await streamMessage({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        agents: ['researcher', 'analyst', 'writer'],
        enableRAG: true,
        includeCitations: true,
      }),
    })
  }, [addMessage, streamMessage])

  return (
    <ThemeProvider theme={themes.ocean}>
      <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI Research Platform
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Multi-Agent RAG System with Knowledge Visualization
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveView('chat')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeView === 'chat'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Chat
                </button>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeView === 'dashboard'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveView('knowledge')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeView === 'knowledge'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Network className="w-4 h-4 inline mr-2" />
                  Knowledge Graph
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {activeView === 'chat' && (
            <div className="h-full flex">
              {/* Sidebar */}
              <aside className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto">
                <div className="p-4 space-y-4">
                  {/* Token Optimization */}
                  {/* Commented out until metrics structure is fixed */}
                  {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <TokenOptimizationDashboard
                      metrics={metrics}
                      showBreakdown={true}
                      compact={true}
                    />
                  </motion.div> */}

                  {/* Research Agents Status */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4"
                  >
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-purple-600" />
                      Active Agents
                    </h3>
                    <ResearchAgent name="Researcher" status="active" progress={65} />
                    <ResearchAgent name="Analyst" status="thinking" progress={40} />
                    <ResearchAgent name="Writer" status="idle" progress={0} />
                  </motion.div>

                  {/* Context Visualizer */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <ContextVisualizer
                      context={{
                        documents: 12,
                        chunks: 245,
                        embeddings: 1024,
                        relevance: 0.87,
                      }}
                    />
                  </motion.div>

                  {/* Conversation Timeline */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <ConversationTimeline
                      messages={messages}
                      onSelectMessage={(msg) => {
                        // Handle message selection
                      }}
                    />
                  </motion.div>
                </div>
              </aside>

              {/* Main Chat Area */}
              <main className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-6">
                  <ChatWindow
                    messages={messages}
                    onSendMessage={handleResearch}
                    renderMessage={(message) => {
                      // Enhanced message rendering with citations
                      if (message.role === 'assistant' && message.citations) {
                        return (
                          <div className="space-y-2">
                            <div>{message.content}</div>
                            <div className="flex flex-wrap gap-2">
                              {message.citations.map((citation, idx) => (
                                <CitationCard
                                  key={idx}
                                  citation={citation}
                                  compact
                                />
                              ))}
                            </div>
                          </div>
                        )
                      }
                      return <div>{message.content}</div>
                    }}
                    showTypingIndicator={isStreaming}
                  />
                </div>

                {/* Advanced Input */}
                <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
                  <AdvancedChatInput
                    onSend={handleResearch}
                    placeholder="Ask a research question or upload documents..."
                    enableVoice={true}
                    enableFileUpload={true}
                    suggestions={[
                      'Compare quantum computing architectures',
                      'Analyze recent AI safety research',
                      'Summarize climate change mitigation strategies',
                    ]}
                  />
                </div>
              </main>

              {/* Right Sidebar - Agent Feed */}
              <aside className="w-96 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto">
                <div className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Database className="w-4 h-4 mr-2" />
                    Agent Activity Feed
                  </h3>
                  <AgentRunFeed
                    runs={[
                      {
                        id: '1',
                        agent: 'Researcher',
                        action: 'Searching academic databases',
                        status: 'running',
                        timestamp: new Date(),
                      },
                      {
                        id: '2',
                        agent: 'Analyst',
                        action: 'Extracting key insights',
                        status: 'completed',
                        timestamp: new Date(Date.now() - 5000),
                      },
                    ]}
                  />

                  {/* Memory Inspector */}
                  <div className="mt-6">
                    <MemoryInspector
                      memories={[
                        { type: 'fact', content: 'Quantum supremacy achieved in 2019', confidence: 0.95 },
                        { type: 'concept', content: 'RAG improves accuracy by 40%', confidence: 0.88 },
                      ]}
                    />
                  </div>
                </div>
              </aside>
            </div>
          )}

          {activeView === 'dashboard' && (
            <div className="h-full p-6 flex items-center justify-center">
              <p className="text-gray-500">Dashboard view - Coming soon</p>
            </div>
            // <ResearchDashboard
            //   messages={messages}
            //   metrics={metrics}
            //   researchTopic={researchTopic}
            // />
          )}

          {activeView === 'knowledge' && (
            <div className="h-full p-6">
              <KnowledgeGraph
                nodes={[
                  { id: '1', label: 'Quantum Computing', type: 'concept' },
                  { id: '2', label: 'Superposition', type: 'concept' },
                  { id: '3', label: 'Entanglement', type: 'concept' },
                ]}
                edges={[
                  { source: '1', target: '2', strength: 0.9 },
                  { id: '3', target: '2', strength: 0.8 },
                ]}
              />
            </div>
          )}
        </div>

        {/* Command Palette */}
        <CommandPalette
          commands={[
            { id: 'new-research', label: 'New Research Topic', action: () => {} },
            { id: 'export', label: 'Export Findings', action: () => {} },
            { id: 'settings', label: 'Settings', action: () => {} },
          ]}
        />
      </div>
    </ThemeProvider>
  )
}
