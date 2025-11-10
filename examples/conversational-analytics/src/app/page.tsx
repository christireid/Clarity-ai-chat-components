// @ts-nocheck - Known issue: lucide-react icon components incompatible with TypeScript 5.x + React 18 types
'use client'

export const dynamic = 'force-dynamic'

import { useState, useCallback, useMemo } from 'react'
import {
  ChatWindow,
  ThemeProvider,
  themes,
  useMessageOperations,
  AdvancedChatInput,
  CommandPalette,
  useStreamingSSE,
  InteractiveCard,
  FollowUpSuggestions,
} from '@clarity-chat/react'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { QueryBuilder } from '@/components/QueryBuilder'
import { InsightCards } from '@/components/InsightCards'
import { ChartGallery } from '@/components/ChartGallery'
import { DataExplorer } from '@/components/DataExplorer'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Database, Sparkles, TrendingUp, Zap, Lightbulb } from 'lucide-react'

export default function ConversationalAnalytics() {
  const [activeView, setActiveView] = useState<'chat' | 'dashboard' | 'explorer'>('chat')
  const [currentQuery, setCurrentQuery] = useState('')
  const [generatedCharts, setGeneratedCharts] = useState<any[]>([])
  const [insights, setInsights] = useState<any[]>([])

  if (typeof window === 'undefined') {
    return null
  }

  const messageOps = useMessageOperations() || {}
  const messages = messageOps.messages ?? []
  const addMessage = messageOps.addMessage ?? (() => {})

  const { streamMessage, isStreaming } = useStreamingSSE({
    url: '/api/analytics',
    onMessage: (content) => {
      // Handle streaming responses
    },
  })

  const handleQuery = useCallback(async (query: string) => {
    setCurrentQuery(query)
    
    addMessage({
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date(),
    })

    // Simulate analytics query processing
    const mockResponse = {
      type: 'chart',
      data: {
        chartType: 'bar',
        title: 'Sales by Region',
        data: [
          { region: 'North', sales: 45000 },
          { region: 'South', sales: 52000 },
          { region: 'East', sales: 38000 },
          { region: 'West', sales: 61000 },
        ],
      },
      insights: [
        'West region shows highest sales at $61k',
        'Sales increased 12% month-over-month',
        'Recommendation: Expand marketing in West region',
      ],
    }

    // Add chart to gallery
    setGeneratedCharts(prev => [...prev, mockResponse.data])
    setInsights(prev => [...prev, ...mockResponse.insights.map((text, idx) => ({
      id: `insight-${Date.now()}-${idx}`,
      text,
      timestamp: new Date(),
    }))])

    addMessage({
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: `I've analyzed your data and created a chart showing ${mockResponse.data.title}. Here are the key insights:\n\n${mockResponse.insights.map(i => `• ${i}`).join('\n')}`,
      timestamp: new Date(),
      metadata: {
        chartType: mockResponse.data.chartType,
        insights: mockResponse.insights,
      },
    })
  }, [addMessage])

  const suggestedQueries = useMemo(() => [
    'Show me sales trends for the last quarter',
    'Compare revenue by product category',
    'What are the top performing regions?',
    'Analyze customer retention rates',
    'Create a dashboard for marketing metrics',
  ], [])

  return (
    <ThemeProvider theme={themes.minimal}>
      <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Conversational Analytics
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ask questions in natural language, get instant insights
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveView('chat')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeView === 'chat'
                      ? 'bg-indigo-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Zap className="w-4 h-4 inline mr-2" />
                  Chat
                </button>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeView === 'dashboard'
                      ? 'bg-indigo-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveView('explorer')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeView === 'explorer'
                      ? 'bg-indigo-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Database className="w-4 h-4 inline mr-2" />
                  Explorer
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeView === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex"
              >
                {/* Left Sidebar - Query Builder */}
                <aside className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto">
                  <div className="p-4 space-y-4">
                    <QueryBuilder
                      onQuery={(query) => handleQuery(query)}
                      suggestedQueries={suggestedQueries}
                    />
                    
                    {insights.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-3 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                          Key Insights
                        </h3>
                        <InsightCards insights={insights.slice(-5)} />
                      </div>
                    )}
                  </div>
                </aside>

                {/* Main Chat Area */}
                <main className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto p-6">
                    <ChatWindow
                      messages={messages}
                      onSendMessage={handleQuery}
                      renderMessage={(message) => {
                        if (message.role === 'assistant' && message.metadata?.chartType) {
                          return (
                            <div className="space-y-4">
                              <div className="prose dark:prose-invert max-w-none">
                                {message.content}
                              </div>
                                {Array.isArray(message.metadata?.insights) && (
                                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                                    <h4 className="font-semibold mb-2 flex items-center">
                                      <Sparkles className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                                      AI Insights
                                    </h4>
                                    <ul className="space-y-1">
                                      {message.metadata?.insights?.map((insight: string, idx: number) => (
                                        <li key={idx} className="text-sm">{insight}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                            </div>
                          )
                        }
                        return <div className="prose dark:prose-invert max-w-none">{message.content}</div>
                      }}
                      showTypingIndicator={isStreaming}
                    />
                  </div>

                  {/* Advanced Input with Suggestions */}
                  <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
                    <FollowUpSuggestions
                      suggestions={suggestedQueries.slice(0, 3)}
                      onSelect={(suggestion) => handleQuery(suggestion)}
                    />
                    <div className="mt-3">
                      <AdvancedChatInput
                        onSend={handleQuery}
                        placeholder="Ask a question about your data... (e.g., 'Show sales by region')"
                        enableVoice={true}
                        suggestions={suggestedQueries}
                      />
                    </div>
                  </div>
                </main>

                {/* Right Sidebar - Chart Gallery */}
                <aside className="w-96 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto">
                  <div className="p-4">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Generated Charts
                    </h3>
                    <ChartGallery charts={generatedCharts} />
                  </div>
                </aside>
              </motion.div>
            )}

            {activeView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full overflow-y-auto"
              >
                <AnalyticsDashboard
                  charts={generatedCharts}
                  insights={insights}
                  currentQuery={currentQuery}
                />
              </motion.div>
            )}

            {activeView === 'explorer' && (
              <motion.div
                key="explorer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full overflow-y-auto"
              >
                <DataExplorer />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Command Palette */}
        <CommandPalette
          commands={[
            { id: 'new-query', label: 'New Query', action: () => {} },
            { id: 'export-data', label: 'Export Data', action: () => {} },
            { id: 'save-dashboard', label: 'Save Dashboard', action: () => {} },
          ]}
        />
      </div>
    </ThemeProvider>
  )
}
