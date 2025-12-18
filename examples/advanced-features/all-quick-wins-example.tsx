/**
 * All Quick Wins Together - Complete Example
 *
 * Demonstrates all four Quick Win features working together:
 * 1. Enhanced Follow-up Suggestions
 * 2. Conversation Summarizer
 * 3. Battery-Aware Features
 * 4. Performance Analytics Dashboard
 */

import * as React from 'react'
import {
  useChatEnhanced,
  PromptSuggestionsEnhanced,
  ConversationSummarizer,
  BatteryIndicator,
  PerformanceAnalyticsDashboard,
  useBatteryAware,
  ChatWindow,
} from '@clarity-chat/react'
import { useFocusTrap, useEscapeKey } from '../utils/accessibility'

// 💡 Type definitions for this example
interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  id?: string
}

interface PerformanceData {
  webVitals?: Array<{ name: string; value: number }>
  memoryUsage?: { used: number; limit: number }
  fps?: number
  renderCount?: number
  updateLatency?: number
}

interface SuggestionStats {
  totalSuggestions: number
  acceptedSuggestions: number
  acceptanceRate: number
  averageRelevance: number
}

/**
 * Complete Advanced Chat Application
 *
 * This example shows how to integrate all four Quick Win features
 * for a production-ready, high-performance chat experience.
 */
export function AdvancedChatApplication() {
  const [showPerformancePanel, setShowPerformancePanel] = React.useState(
    process.env.NODE_ENV === 'development'
  )
  const [showSummaryPanel, setShowSummaryPanel] = React.useState(false)

  // Battery-aware optimizations
  const {
    batteryStatus,
    recommendations,
    shouldEnableBatterySaver,
    batteryDescription,
  } = useBatteryAware({
    batterySaverThreshold: 0.2,
    optimizations: {
      reduceAnimations: true,
      throttleUpdates: true,
      deferNonCritical: true,
      reduceStreamingQuality: true,
    },
    autoOptimize: true,
  })

  // Chat state
  const { messages, sendMessage, isLoading, error } = useChatEnhanced({
    api: '/api/chat',
    // Apply battery optimizations
    streamingEnabled: !recommendations.reduceStreaming,
    updateInterval: recommendations.updateInterval,
  })

  // Custom summarization with your LLM API
  const handleGenerateSummary = React.useCallback(
    async (
      messages: ChatMessage[],
      level: 'brief' | 'detailed' | 'comprehensive'
    ) => {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, level }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate summary')
      }

      return response.json()
    },
    []
  )

  // Performance tracking
  const handlePerformanceUpdate = React.useCallback((data: PerformanceData) => {
    // Send to your analytics service
    if (data.webVitals?.length > 0) {
      console.log('Web Vitals:', data.webVitals)

      // Example: Track to analytics
      // analytics.track('web_vitals', {
      //   lcp: data.webVitals.find((v) => v.name === 'LCP')?.value,
      //   fid: data.webVitals.find((v) => v.name === 'FID')?.value,
      //   cls: data.webVitals.find((v) => v.name === 'CLS')?.value,
      // })
    }

    // Monitor memory usage
    if (
      data.memoryUsage &&
      data.memoryUsage.used / data.memoryUsage.limit > 0.8
    ) {
      console.warn('High memory usage detected:', data.memoryUsage)
    }

    // Monitor FPS
    if (data.fps && data.fps < 30) {
      console.warn('Low FPS detected:', data.fps)
    }
  }, [])

  return (
    <div className="relative flex h-screen">
      {/* Battery indicator (fixed position) */}
      <BatteryIndicator
        position="top-right"
        showTooltip
        showLabel={!shouldEnableBatterySaver}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with controls */}
        <header className="border-b p-4 flex items-center justify-between bg-background/95 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Advanced Chat</h1>

            {/* Battery status indicator (inline) */}
            {shouldEnableBatterySaver && (
              <div className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-sm">
                Battery Saver Active ({batteryDescription})
              </div>
            )}

            {/* Performance mode indicator */}
            {recommendations.level !== 'none' && (
              <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm">
                Optimizations: {recommendations.level}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowSummaryPanel(!showSummaryPanel)}
              className="px-3 py-2 text-sm border rounded-lg hover:bg-accent transition-colors"
            >
              {showSummaryPanel ? 'Hide' : 'Show'} Summary
            </button>
            <button
              onClick={() => setShowPerformancePanel(!showPerformancePanel)}
              className="px-3 py-2 text-sm border rounded-lg hover:bg-accent transition-colors"
            >
              {showPerformancePanel ? 'Hide' : 'Show'} Performance
            </button>
          </div>
        </header>

        {/* Chat messages */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            error={error}
            enableAnimations={!recommendations.disableAnimations}
            updateInterval={recommendations.updateInterval}
          />
        </div>

        {/* Enhanced suggestions */}
        <div className="border-t p-4 bg-background">
          <PromptSuggestionsEnhanced
            messages={messages}
            onSelect={(suggestion) => sendMessage(suggestion.text)}
            config={{
              rankingModel: { type: 'hybrid' },
              features: {
                conversationContext: true,
                userHistory: true,
                timeOfDay: true,
                previousSelections: true,
              },
              enableABTesting: true,
              trackEffectiveness: true,
            }}
            maxSuggestions={recommendations.level === 'aggressive' ? 3 : 6}
            layout="chips"
          />
        </div>
      </div>

      {/* Right sidebar - Summary Panel */}
      {showSummaryPanel && (
        <aside className="w-96 border-l overflow-y-auto bg-background">
          <div className="p-4">
            <ConversationSummarizer
              messages={messages}
              config={{
                trigger: 'manual',
                levels: ['brief', 'detailed', 'comprehensive'],
                provider: {
                  type: 'openai',
                  model: 'gpt-4o',
                },
                includeActionItems: true,
                includeKeyTopics: true,
                includeCodeSnippets: true,
              }}
              onSummaryGenerated={(summary) => {
                console.log('Summary generated:', summary)

                // Track to analytics
                // analytics.track('summary_generated', {
                //   level: summary.level,
                //   messageCount: summary.messageRange.totalMessages,
                //   generationTime: summary.generationTime,
                // })
              }}
              onGenerateSummary={handleGenerateSummary}
              showHistory
              defaultLevel="detailed"
            />
          </div>
        </aside>
      )}

      {/* Right sidebar - Performance Panel */}
      {showPerformancePanel && !showSummaryPanel && (
        <aside className="w-96 border-l overflow-y-auto bg-background">
          <div className="p-4">
            <PerformanceAnalyticsDashboard
              updateInterval={recommendations.updateInterval}
              showWebVitals
              showComponentMetrics={process.env.NODE_ENV === 'development'}
              showMemoryUsage
              showFPS
              onDataUpdate={handlePerformanceUpdate}
              compact
            />
          </div>
        </aside>
      )}
    </div>
  )
}

/**
 * Mobile-Optimized Version
 *
 * Demonstrates aggressive battery optimization for mobile devices
 */
export function MobileAdvancedChat() {
  const { recommendations, shouldEnableBatterySaver, batteryDescription } =
    useBatteryAware({
      batterySaverThreshold: 0.3, // More aggressive on mobile
      optimizations: {
        reduceAnimations: true,
        throttleUpdates: true,
        deferNonCritical: true,
        reduceStreamingQuality: true,
      },
      autoOptimize: true,
    })

  const { messages, sendMessage, isLoading } = useChatEnhanced({
    api: '/api/chat',
    streamingEnabled: !recommendations.reduceStreaming,
    updateInterval: recommendations.updateInterval,
  })

  const [showSummary, setShowSummary] = React.useState(false)

  // 🎯 Use accessibility utilities for modal
  const { containerRef: dialogRef } = useFocusTrap({
    enabled: showSummary,
    autoFocus: true,
    returnFocus: true,
  })
  useEscapeKey(() => setShowSummary(false), showSummary)

  return (
    <div className="flex flex-col h-screen">
      {/* Mobile header */}
      <header className="border-b p-3 flex items-center justify-between bg-background sticky top-0 z-10">
        <h1 className="text-lg font-bold">Chat</h1>
        <div className="flex items-center gap-2">
          <BatteryIndicator compact position="inline" />
          <button
            onClick={() => setShowSummary(!showSummary)}
            aria-expanded={showSummary}
            aria-haspopup="dialog"
            className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Summary
          </button>
        </div>
      </header>

      {/* Battery saver notification */}
      {shouldEnableBatterySaver && (
        <div className="px-4 py-2 bg-orange-100 dark:bg-orange-900 text-sm text-center">
          ⚡ Battery Saver Active - Optimizations enabled
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          enableAnimations={!recommendations.disableAnimations}
          updateInterval={recommendations.updateInterval}
        />
      </div>

      {/* Suggestions - mobile optimized */}
      <div className="border-t p-3 bg-background sticky bottom-0">
        <PromptSuggestionsEnhanced
          messages={messages}
          onSelect={(s) => sendMessage(s.text)}
          config={{
            rankingModel: { type: 'hybrid' },
            features: {
              conversationContext: true,
              userHistory: true,
              timeOfDay: true,
              previousSelections: true,
            },
          }}
          maxSuggestions={recommendations.level === 'aggressive' ? 3 : 4}
          layout="chips"
        />
      </div>

      {/* Summary bottom sheet (mobile) */}
      {showSummary && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowSummary(false)}
          role="presentation"
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="summary-title"
            className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 id="summary-title" className="text-lg font-bold">
                  Summary
                </h2>
                <button
                  onClick={() => setShowSummary(false)}
                  aria-label="Close summary panel"
                  className="text-2xl focus:outline-none focus:ring-2 focus:ring-primary rounded"
                >
                  ✕
                </button>
              </div>
              <ConversationSummarizer
                messages={messages}
                config={{
                  trigger: 'manual',
                  levels: ['brief', 'detailed'],
                  provider: {
                    type: 'openai',
                    model: 'gpt-4o-mini', // Lighter model for mobile
                  },
                  includeActionItems: true,
                  includeKeyTopics: true,
                }}
                showHistory={false}
                defaultLevel="brief"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Developer Dashboard Version
 *
 * Includes all features with enhanced debugging and monitoring
 */
export function DeveloperDashboard() {
  const [selectedTab, setSelectedTab] = React.useState<
    'chat' | 'performance' | 'analytics'
  >('chat')

  const {
    recommendations,
    batteryStatus,
    isSupported: batterySupported,
  } = useBatteryAware({
    batterySaverThreshold: 0.2,
    autoOptimize: true,
  })

  const { messages, sendMessage, isLoading } = useChatEnhanced({
    api: '/api/chat',
  })

  const [performanceData, setPerformanceData] =
    React.useState<PerformanceData | null>(null)
  const [suggestionStats, setSuggestionStats] =
    React.useState<SuggestionStats | null>(null)

  return (
    <div className="flex h-screen">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Tab navigation */}
        <header className="border-b p-4 flex items-center gap-4 bg-background">
          <button
            onClick={() => setSelectedTab('chat')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedTab === 'chat'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setSelectedTab('performance')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedTab === 'performance'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setSelectedTab('analytics')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedTab === 'analytics'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
          >
            Analytics
          </button>

          <div className="ml-auto">
            <BatteryIndicator position="inline" showLabel />
          </div>
        </header>

        {/* Tab content */}
        <div className="flex-1 overflow-hidden">
          {selectedTab === 'chat' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <ChatWindow
                  messages={messages}
                  isLoading={isLoading}
                  enableAnimations={!recommendations.disableAnimations}
                />
              </div>

              <div className="border-t p-4 space-y-4">
                <PromptSuggestionsEnhanced
                  messages={messages}
                  onSelect={(s) => sendMessage(s.text)}
                  config={{
                    rankingModel: { type: 'hybrid' },
                    features: {
                      conversationContext: true,
                      userHistory: true,
                      timeOfDay: true,
                      previousSelections: true,
                    },
                    trackEffectiveness: true,
                  }}
                />

                <ConversationSummarizer
                  messages={messages}
                  config={{
                    trigger: 'manual',
                    levels: ['brief', 'detailed'],
                    provider: { type: 'openai', model: 'gpt-4o' },
                    includeActionItems: true,
                    includeKeyTopics: true,
                  }}
                />
              </div>
            </div>
          )}

          {selectedTab === 'performance' && (
            <div className="h-full overflow-y-auto p-6">
              <PerformanceAnalyticsDashboard
                updateInterval={1000}
                showWebVitals
                showComponentMetrics
                showNetworkMetrics
                showMemoryUsage
                showFPS
                onDataUpdate={setPerformanceData}
              />
            </div>
          )}

          {selectedTab === 'analytics' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Suggestion Analytics
                  </h2>
                  {suggestionStats && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">
                          Click-Through Rate
                        </div>
                        <div className="text-3xl font-bold">
                          {(suggestionStats.clickThroughRate * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">
                          Avg Confidence
                        </div>
                        <div className="text-3xl font-bold">
                          {(suggestionStats.averageConfidence * 100).toFixed(0)}
                          %
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Battery Status</h2>
                  {batterySupported && batteryStatus && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">
                          Battery Level
                        </div>
                        <div className="text-3xl font-bold">
                          {Math.round(batteryStatus.level * 100)}%
                        </div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">
                          Optimization Level
                        </div>
                        <div className="text-3xl font-bold capitalize">
                          {recommendations.level}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Performance Snapshot
                  </h2>
                  {performanceData && (
                    <div className="space-y-2">
                      {performanceData.fps && (
                        <div className="flex justify-between border-b pb-2">
                          <span>FPS:</span>
                          <span className="font-bold">
                            {performanceData.fps}
                          </span>
                        </div>
                      )}
                      {performanceData.memoryUsage && (
                        <div className="flex justify-between border-b pb-2">
                          <span>Memory Used:</span>
                          <span className="font-bold">
                            {Math.round(
                              (performanceData.memoryUsage.used /
                                performanceData.memoryUsage.limit) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
