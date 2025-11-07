/**
 * AI Hooks
 *
 * Convenience hooks for AI features
 */
import * as React from 'react';
import type { Suggestion, SuggestionContext, ModerationResult, SentimentResult } from './types';
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
export declare function useSuggestions(context: SuggestionContext, options?: {
    debounceMs?: number;
    minInputLength?: number;
}): {
    suggestions: Suggestion[];
    isLoading: boolean;
};
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
export declare function useModeration(): {
    moderateMessage: (content: string, context?: any) => Promise<ModerationResult>;
    isChecking: boolean;
    result: ModerationResult | null;
};
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
export declare function useSentimentAnalysis(options?: {
    debounceMs?: number;
}): {
    sentiment: SentimentResult | null;
    isAnalyzing: boolean;
    analyzeFeedback: (text: string) => void;
};
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
export declare function useAutoComplete(options?: {
    debounceMs?: number;
    minInputLength?: number;
    onSelect?: (suggestion: Suggestion) => void;
}): {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    completions: Suggestion[];
    isLoading: boolean;
    selectCompletion: (suggestion: Suggestion) => void;
};
//# sourceMappingURL=hooks.d.ts.map