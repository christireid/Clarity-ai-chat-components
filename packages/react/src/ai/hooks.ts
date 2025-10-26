/**
 * AI Hooks
 * 
 * Convenience hooks for AI features
 */

import * as React from 'react'
import { useAI } from './AIProvider'
import type { Suggestion, SuggestionContext, ModerationResult, SentimentResult } from './types'

/**
 * Hook for getting suggestions with debouncing
 * 
 * @example
 * ```tsx
 * function ChatInput() {
 *   const [input, setInput] = useState('')
 *   const { suggestions, isLoading } = useSuggestions({
 *     input,
 *     debounceMs: 300
 *   })
 *   
 *   return (
 *     <>
 *       <input value={input} onChange={e => setInput(e.target.value)} />
 *       {suggestions.map(s => (
 *         <button key={s.id} onClick={() => setInput(s.text)}>
 *           {s.text}
 *         </button>
 *       ))}
 *     </>
 *   )
 * }
 * ```
 */
export function useSuggestions(
  context: SuggestionContext,
  options?: {
    debounceMs?: number
    minInputLength?: number
  }
) {
  const { getSuggestions, config } = useAI()
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()
  
  const debounceMs = options?.debounceMs ?? 300
  const minInputLength = options?.minInputLength ?? 0
  
  React.useEffect(() => {
    if (!config.enableSuggestions) {
      setSuggestions([])
      return
    }
    
    if (context.input.length < minInputLength) {
      setSuggestions([])
      return
    }
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Debounce the suggestion fetch
    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const results = await getSuggestions(context)
        setSuggestions(results)
      } catch (error) {
        if (config.debug) {
          console.error('[AI] Failed to get suggestions:', error)
        }
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, debounceMs)
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [context.input, context.cursorPosition, getSuggestions, config, debounceMs, minInputLength])
  
  return { suggestions, isLoading }
}

/**
 * Hook for content moderation
 * 
 * @example
 * ```tsx
 * function MessageInput() {
 *   const { moderateMessage, isChecking, result } = useModeration()
 *   
 *   const handleSubmit = async (message: string) => {
 *     const moderation = await moderateMessage(message)
 *     
 *     if (moderation.action === 'block') {
 *       alert('Message blocked: ' + moderation.reasons.join(', '))
 *       return
 *     }
 *     
 *     if (moderation.action === 'warn') {
 *       if (!confirm('Message may contain inappropriate content. Send anyway?')) {
 *         return
 *       }
 *     }
 *     
 *     // Send message
 *   }
 *   
 *   return <form onSubmit={e => { e.preventDefault(); handleSubmit(input) }} />
 * }
 * ```
 */
export function useModeration() {
  const { moderateContent, config } = useAI()
  const [isChecking, setIsChecking] = React.useState(false)
  const [result, setResult] = React.useState<ModerationResult | null>(null)
  
  const moderateMessage = React.useCallback(
    async (content: string, context?: any): Promise<ModerationResult> => {
      if (!config.enableModeration) {
        const defaultResult: ModerationResult = {
          flagged: false,
          reasons: [],
          action: 'allow',
        }
        setResult(defaultResult)
        return defaultResult
      }
      
      setIsChecking(true)
      try {
        const moderationResult = await moderateContent(content, context)
        setResult(moderationResult)
        return moderationResult
      } finally {
        setIsChecking(false)
      }
    },
    [moderateContent, config.enableModeration]
  )
  
  return { moderateMessage, isChecking, result }
}

/**
 * Hook for sentiment analysis
 * 
 * @example
 * ```tsx
 * function FeedbackForm() {
 *   const [feedback, setFeedback] = useState('')
 *   const { sentiment, isAnalyzing, analyzeFeedback } = useSentimentAnalysis()
 *   
 *   React.useEffect(() => {
 *     if (feedback) {
 *       analyzeFeedback(feedback)
 *     }
 *   }, [feedback, analyzeFeedback])
 *   
 *   return (
 *     <>
 *       <textarea value={feedback} onChange={e => setFeedback(e.target.value)} />
 *       {sentiment && (
 *         <div>Detected sentiment: {sentiment.sentiment} ({sentiment.confidence})</div>
 *       )}
 *     </>
 *   )
 * }
 * ```
 */
export function useSentimentAnalysis(options?: { debounceMs?: number }) {
  const { analyzeSentiment, config } = useAI()
  const [sentiment, setSentiment] = React.useState<SentimentResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()
  
  const debounceMs = options?.debounceMs ?? 500
  
  const analyzeFeedback = React.useCallback(
    (text: string) => {
      if (!config.enableSentiment || !text) {
        setSentiment(null)
        return
      }
      
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      // Debounce the analysis
      timeoutRef.current = setTimeout(async () => {
        setIsAnalyzing(true)
        try {
          const result = await analyzeSentiment(text)
          setSentiment(result)
        } catch (error) {
          if (config.debug) {
            console.error('[AI] Failed to analyze sentiment:', error)
          }
          setSentiment(null)
        } finally {
          setIsAnalyzing(false)
        }
      }, debounceMs)
    },
    [analyzeSentiment, config, debounceMs]
  )
  
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  return { sentiment, isAnalyzing, analyzeFeedback }
}

/**
 * Hook for auto-complete functionality
 * 
 * @example
 * ```tsx
 * function SearchBar() {
 *   const { input, setInput, completions, selectCompletion } = useAutoComplete()
 *   
 *   return (
 *     <>
 *       <input value={input} onChange={e => setInput(e.target.value)} />
 *       {completions.map(c => (
 *         <div key={c.id} onClick={() => selectCompletion(c)}>
 *           {c.text}
 *         </div>
 *       ))}
 *     </>
 *   )
 * }
 * ```
 */
export function useAutoComplete(options?: {
  debounceMs?: number
  minInputLength?: number
  onSelect?: (suggestion: Suggestion) => void
}) {
  const [input, setInput] = React.useState('')
  const { suggestions, isLoading } = useSuggestions(
    { input },
    {
      debounceMs: options?.debounceMs,
      minInputLength: options?.minInputLength,
    }
  )
  
  // Filter to only completion suggestions
  const completions = React.useMemo(
    () => suggestions.filter(s => s.type === 'completion'),
    [suggestions]
  )
  
  const selectCompletion = React.useCallback(
    (suggestion: Suggestion) => {
      setInput(suggestion.text)
      options?.onSelect?.(suggestion)
    },
    [options]
  )
  
  return {
    input,
    setInput,
    completions,
    isLoading,
    selectCompletion,
  }
}
