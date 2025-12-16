/**
 * Enhanced Follow-up Suggestions Example
 *
 * Demonstrates ML-based suggestion ranking with personalization
 */

import * as React from 'react'
import {
  PromptSuggestionsEnhanced,
import { SecureLogger } from '@/lib/security/secureLogger';
  usePromptSuggestionsEnhanced,
  useChatEnhanced,
} from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { accessibleClickHandler } from '../utils/accessibility'

import { SecureLogger } from '@/lib/security/secureLogger';
// 💡 Type for prompt suggestions used throughout these examples
interface PromptSuggestion {
  id: string
  text: string
  confidence: number
  category?: string
  metadata?: Record<string, unknown>
}

/**
 * Example 1: Drop-in Component Usage
 *
 * Easiest way to use enhanced suggestions - just replace your
 * existing PromptSuggestions component.
 */
export function BasicEnhancedSuggestionsExample() {
  const { messages, sendMessage } = useChatEnhanced({
    api: '/api/chat',
  })

  return (
    <div className="space-y-4">
      {/* Your chat UI */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id}>{msg.content}</div>
        ))}
      </div>

      {/* Enhanced suggestions - drop-in replacement */}
      <PromptSuggestionsEnhanced
        messages={messages}
        onSelect={(suggestion) => sendMessage(suggestion.text)}
        config={{
          rankingModel: { type: 'hybrid' }, // ML + rule-based
          features: {
            conversationContext: true,
            userHistory: true,
            timeOfDay: true,
            previousSelections: true,
          },
          enableABTesting: false,
          trackEffectiveness: true,
        }}
        maxSuggestions={6}
        layout="chips"
      />
    </div>
  )
}

/**
 * Example 2: Advanced Hook Usage with Custom UI
 *
 * Use the hook directly for full control over the UI
 */
export function AdvancedHookExample() {
  const { messages, sendMessage } = useChatEnhanced({
    api: '/api/chat',
  })

  const {
    suggestions,
    trackInteraction,
    stats,
    abVariant,
    userPreferences,
    resetPreferences,
  } = usePromptSuggestionsEnhanced(messages, {
    rankingModel: { type: 'hybrid' },
    features: {
      conversationContext: true,
      userHistory: true,
      timeOfDay: true,
      previousSelections: true,
    },
    enableABTesting: true,
    trackEffectiveness: true,
  })

  const [resolvedSuggestions, setResolvedSuggestions] = React.useState<PromptSuggestion[]>([])

  React.useEffect(() => {
    suggestions.then(setResolvedSuggestions)
  }, [suggestions])

  const handleSelect = (suggestion: PromptSuggestion) => {
    // Track the interaction
    trackInteraction(suggestion, true)

    // Send the message
    sendMessage(suggestion.text)
  }

  const handleDismiss = (suggestion: PromptSuggestion) => {
    // Track that user saw but didn't select
    trackInteraction(suggestion, false)
  }

  return (
    <div className="space-y-6">
      {/* Chat messages */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id}>{msg.content}</div>
        ))}
      </div>

      {/* Custom suggestions UI */}
      <div className="suggestions-container">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Smart Suggestions</h3>
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground">
              CTR: {(stats.clickThroughRate * 100).toFixed(1)}%
            </span>
            <span className="text-sm text-muted-foreground">
              Variant: {abVariant}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {resolvedSuggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              {...accessibleClickHandler(() => handleSelect(suggestion))}
              className="relative p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {/* Confidence badge */}
              {suggestion.confidence !== undefined && (
                <div
                  className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${suggestion.confidence})`,
                    color: suggestion.confidence > 0.5 ? 'white' : 'black',
                  }}
                >
                  {Math.round(suggestion.confidence * 100)}%
                </div>
              )}

              {/* Suggestion content */}
              <div className="font-medium mb-1">{suggestion.label || suggestion.text}</div>
              {suggestion.description && (
                <div className="text-sm text-muted-foreground">{suggestion.description}</div>
              )}

              {/* Keywords */}
              {suggestion.keywords && suggestion.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {suggestion.keywords.slice(0, 3).map((keyword) => (
                    <span key={keyword} className="text-xs px-2 py-0.5 bg-muted rounded">
                      {keyword}
                    </span>
                  ))}
                </div>
              )}

              {/* Dismiss button */}
              <button
                aria-label="Dismiss suggestion"
                className="absolute bottom-2 right-2 text-xs text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDismiss(suggestion)
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stats dashboard */}
      <div className="stats-panel p-4 border rounded-lg bg-muted/50">
        <h4 className="font-semibold mb-3">Suggestion Analytics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Total Suggestions</div>
            <div className="text-2xl font-bold">{stats.totalSuggestions}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Click-Through Rate</div>
            <div className="text-2xl font-bold">{(stats.clickThroughRate * 100).toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-muted-foreground">Avg Confidence</div>
            <div className="text-2xl font-bold">{(stats.averageConfidence * 100).toFixed(0)}%</div>
          </div>
          <div>
            <div className="text-muted-foreground">ML vs Rule-based</div>
            <div className="text-lg font-bold">
              {stats.mlRankingCount} / {stats.ruleBasedCount}
            </div>
          </div>
        </div>

        {/* User preferences insights */}
        <div className="mt-4 pt-4 border-t">
          <h5 className="font-medium mb-2">Your Preferences</h5>
          <div className="text-sm space-y-1">
            <div>
              History: {userPreferences.suggestionHistory.length} interactions tracked
            </div>
            <div>
              Top Keywords:{' '}
              {Array.from(userPreferences.frequentKeywords.entries())
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([keyword]) => keyword)
                .join(', ')}
            </div>
            <div>
              Most Active Hour:{' '}
              {Array.from(userPreferences.timePatterns.entries())
                .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'}
              :00
            </div>
          </div>

          <button
            className="mt-3 text-sm px-3 py-1 border rounded hover:bg-accent"
            onClick={resetPreferences}
          >
            Reset Preferences
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Example 3: A/B Testing Setup
 *
 * Compare ML-based vs rule-based suggestion ranking
 */
export function ABTestingExample() {
  const { messages, sendMessage } = useChatEnhanced({
    api: '/api/chat',
  })

  const {
    suggestions,
    trackInteraction,
    stats,
    abVariant,
  } = usePromptSuggestionsEnhanced(messages, {
    rankingModel: {
      type: abVariant === 'experiment' ? 'ml' : 'rule-based',
    },
    features: {
      conversationContext: true,
      userHistory: abVariant === 'experiment',
      timeOfDay: abVariant === 'experiment',
      previousSelections: abVariant === 'experiment',
    },
    enableABTesting: true,
    trackEffectiveness: true,
  })

  // Log A/B test results to analytics
  React.useEffect(() => {
    // Send to your analytics service
    if (stats.totalInteractions > 0) {
      SecureLogger.debug('A/B Test Results:', {
        variant: abVariant,
        ctr: stats.clickThroughRate,
        avgConfidence: stats.averageConfidence,
        interactions: stats.totalInteractions,
      })

      // Example: Send to PostHog, Mixpanel, etc.
      // analytics.track('suggestion_performance', {
      //   variant: abVariant,
      //   ctr: stats.clickThroughRate,
      //   avgConfidence: stats.averageConfidence,
      // })
    }
  }, [abVariant, stats])

  const [resolvedSuggestions, setResolvedSuggestions] = React.useState<PromptSuggestion[]>([])

  React.useEffect(() => {
    suggestions.then(setResolvedSuggestions)
  }, [suggestions])

  return (
    <div className="space-y-4">
      {/* A/B variant indicator */}
      <div className="px-4 py-2 border rounded-lg bg-blue-50 dark:bg-blue-900">
        <div className="text-sm font-medium">
          A/B Test Active: You're in the <strong>{abVariant}</strong> group
        </div>
        {abVariant === 'experiment' && (
          <div className="text-xs text-muted-foreground mt-1">
            Using ML-based ranking with personalization
          </div>
        )}
        {abVariant === 'control' && (
          <div className="text-xs text-muted-foreground mt-1">
            Using traditional rule-based ranking
          </div>
        )}
      </div>

      {/* Suggestions */}
      <PromptSuggestionsEnhanced
        messages={messages}
        onSelect={(s) => {
          trackInteraction(s, true)
          sendMessage(s.text)
        }}
        config={{
          rankingModel: {
            type: abVariant === 'experiment' ? 'ml' : 'rule-based',
          },
          features: {
            conversationContext: true,
            userHistory: abVariant === 'experiment',
            timeOfDay: abVariant === 'experiment',
            previousSelections: abVariant === 'experiment',
          },
        }}
      />

      {/* Performance comparison */}
      <div className="p-4 border rounded-lg">
        <h4 className="font-semibold mb-3">Your Performance</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Click-Through Rate:</span>
            <span className="font-bold">{(stats.clickThroughRate * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Avg Confidence:</span>
            <span className="font-bold">{(stats.averageConfidence * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Total Interactions:</span>
            <span className="font-bold">{stats.totalInteractions}</span>
          </div>
        </div>

        {/* Historical comparison (mock data) */}
        <div className="mt-4 pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            {abVariant === 'experiment'
              ? 'ML-based ranking typically shows 2-3x higher CTR'
              : 'Control group baseline for comparison'}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Example 4: Custom ML Provider Integration
 *
 * Connect to your own ML ranking service
 */
export function CustomMLProviderExample() {
  const { messages, sendMessage } = useChatEnhanced({
    api: '/api/chat',
  })

  const {
    suggestions,
    trackInteraction,
  } = usePromptSuggestionsEnhanced(messages, {
    rankingModel: {
      type: 'ml',
      provider: 'custom',
      endpoint: '/api/rank-suggestions',
      // Note: API keys should be handled server-side in the /api/rank-suggestions route
      // Never expose API keys with NEXT_PUBLIC_ prefix
    },
    features: {
      conversationContext: true,
      userHistory: true,
      timeOfDay: true,
      previousSelections: true,
    },
    trackEffectiveness: true,
  })

  // The hook will call your custom endpoint with:
  // POST /api/rank-suggestions
  // {
  //   suggestions: PromptSuggestion[],
  //   context: {
  //     messages: Message[],
  //     userHistory: SuggestionInteraction[],
  //     currentTime: number,
  //   }
  // }
  //
  // Expected response:
  // {
  //   rankedSuggestions: PromptSuggestion[] // with updated confidence scores
  // }

  const [resolvedSuggestions, setResolvedSuggestions] = React.useState<PromptSuggestion[]>([])

  React.useEffect(() => {
    suggestions.then(setResolvedSuggestions)
  }, [suggestions])

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Using custom ML ranking service at /api/rank-suggestions
      </div>

      <PromptSuggestionsEnhanced
        messages={messages}
        onSelect={(s) => {
          trackInteraction(s, true)
          sendMessage(s.text)
        }}
        config={{
          rankingModel: {
            type: 'ml',
            provider: 'custom',
            endpoint: '/api/rank-suggestions',
          },
          features: {
            conversationContext: true,
            userHistory: true,
            timeOfDay: true,
            previousSelections: true,
          },
        }}
      />
    </div>
  )
}

// API route example for custom ML provider:
//
// // app/api/rank-suggestions/route.ts
// import { NextResponse } from 'next/server'
//
// export async function POST(request: Request) {
//   const { suggestions, context } = await request.json()
//
//   // Your ML ranking logic here
//   const rankedSuggestions = suggestions.map((suggestion) => {
//     // Calculate confidence based on your model
//     const confidence = yourMLModel.predict(suggestion, context)
//     return {
//       ...suggestion,
//       confidence,
//     }
//   })
//
//   // Sort by confidence
//   rankedSuggestions.sort((a, b) => b.confidence - a.confidence)
//
//   return NextResponse.json({ rankedSuggestions })
// }
