/**
 * AI Provider
 * 
 * Context provider for AI features (suggestions, moderation, sentiment)
 */

import * as React from 'react'
import type {
  AIConfig,
  Suggestion,
  SuggestionContext,
  ModerationResult,
  ModerationContext,
  SentimentResult,
} from './types'

interface AIContextValue {
  /**
   * Get suggestions based on context
   */
  getSuggestions: (context: SuggestionContext) => Promise<Suggestion[]>
  
  /**
   * Moderate content
   */
  moderateContent: (content: string, context?: ModerationContext) => Promise<ModerationResult>
  
  /**
   * Analyze sentiment
   */
  analyzeSentiment: (text: string) => Promise<SentimentResult>
  
  /**
   * Configuration
   */
  config: AIConfig
}

const AIContext = React.createContext<AIContextValue | undefined>(undefined)

export interface AIProviderProps {
  children: React.ReactNode
  config: AIConfig
}

/**
 * AI Provider Component
 * 
 * Provides AI features to all child components
 * 
 * @example
 * ```tsx
 * import { AIProvider } from '@/ai'
 * import { quickReplyProvider } from '@/ai/providers'
 * 
 * <AIProvider
 *   config={{
 *     enableSuggestions: true,
 *     enableModeration: true,
 *     suggestionProviders: [quickReplyProvider],
 *   }}
 * >
 *   <App />
 * </AIProvider>
 * ```
 */
export function AIProvider({ children, config }: AIProviderProps) {
  const getSuggestions = React.useCallback(
    async (context: SuggestionContext): Promise<Suggestion[]> => {
      if (!config.enableSuggestions || !config.suggestionProviders?.length) {
        return []
      }
      
      try {
        // Get suggestions from all providers
        const results = await Promise.all(
          config.suggestionProviders.map(provider => provider(context))
        )
        
        // Flatten and deduplicate
        const allSuggestions = results.flat()
        const uniqueSuggestions = Array.from(
          new Map(allSuggestions.map(s => [s.text, s])).values()
        )
        
        // Sort by confidence
        return uniqueSuggestions.sort((a, b) => {
          const confidenceA = a.confidence || 0
          const confidenceB = b.confidence || 0
          return confidenceB - confidenceA
        })
      } catch (error) {
        if (config.debug) {
          console.error('[AI] Failed to get suggestions:', error)
        }
        return []
      }
    },
    [config]
  )
  
  const moderateContent = React.useCallback(
    async (content: string, context?: ModerationContext): Promise<ModerationResult> => {
      if (!config.enableModeration || !config.moderationProvider) {
        // Default: allow everything
        return {
          flagged: false,
          reasons: [],
          action: 'allow',
        }
      }
      
      try {
        return await config.moderationProvider(content, context)
      } catch (error) {
        if (config.debug) {
          console.error('[AI] Failed to moderate content:', error)
        }
        // On error, default to allowing
        return {
          flagged: false,
          reasons: [],
          action: 'allow',
        }
      }
    },
    [config]
  )
  
  const analyzeSentiment = React.useCallback(
    async (text: string): Promise<SentimentResult> => {
      if (!config.enableSentiment || !config.sentimentAnalyzer) {
        // Default: neutral
        return {
          sentiment: 'neutral',
          confidence: 0,
          scores: {
            positive: 0,
            negative: 0,
            neutral: 1,
          },
        }
      }
      
      try {
        return await config.sentimentAnalyzer(text)
      } catch (error) {
        if (config.debug) {
          console.error('[AI] Failed to analyze sentiment:', error)
        }
        return {
          sentiment: 'neutral',
          confidence: 0,
          scores: {
            positive: 0,
            negative: 0,
            neutral: 1,
          },
        }
      }
    },
    [config]
  )
  
  const value = React.useMemo<AIContextValue>(
    () => ({
      getSuggestions,
      moderateContent,
      analyzeSentiment,
      config,
    }),
    [getSuggestions, moderateContent, analyzeSentiment, config]
  )
  
  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  )
}

/**
 * Hook to access AI context
 * 
 * @example
 * ```tsx
 * function ChatInput() {
 *   const { getSuggestions, moderateContent } = useAI()
 *   
 *   const handleInput = async (text: string) => {
 *     const suggestions = await getSuggestions({ input: text })
 *     const moderation = await moderateContent(text)
 *     
 *     if (moderation.action === 'block') {
 *       alert('Message blocked: ' + moderation.reasons.join(', '))
 *     }
 *   }
 *   
 *   return <input onChange={e => handleInput(e.target.value)} />
 * }
 * ```
 */
export function useAI() {
  const context = React.useContext(AIContext)
  
  if (!context) {
    throw new Error('useAI must be used within an AIProvider')
  }
  
  return context
}
