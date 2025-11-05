/**
 * AI Provider
 *
 * Context provider for AI features (suggestions, moderation, sentiment)
 */
import * as React from 'react';
import type { AIConfig, Suggestion, SuggestionContext, ModerationResult, ModerationContext, SentimentResult } from './types';
interface AIContextValue {
    /**
     * Get suggestions based on context
     */
    getSuggestions: (context: SuggestionContext) => Promise<Suggestion[]>;
    /**
     * Moderate content
     */
    moderateContent: (content: string, context?: ModerationContext) => Promise<ModerationResult>;
    /**
     * Analyze sentiment
     */
    analyzeSentiment: (text: string) => Promise<SentimentResult>;
    /**
     * Configuration
     */
    config: AIConfig;
}
export interface AIProviderProps {
    children: React.ReactNode;
    config: AIConfig;
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
export declare function AIProvider({ children, config }: AIProviderProps): import("react/jsx-runtime").JSX.Element;
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
export declare function useAI(): AIContextValue;
export {};
//# sourceMappingURL=AIProvider.d.ts.map