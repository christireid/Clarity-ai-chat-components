import { jsx as _jsx } from "react/jsx-runtime";
/**
 * AI Provider
 *
 * Context provider for AI features (suggestions, moderation, sentiment)
 */
import { createContext, useContext, useCallback, useMemo } from 'react';
const AIContext = createContext(undefined);
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
export function AIProvider({ children, config }) {
    const getSuggestions = useCallback(async (context) => {
        if (!config.enableSuggestions || !config.suggestionProviders?.length) {
            return [];
        }
        try {
            // Get suggestions from all providers
            const results = await Promise.all(config.suggestionProviders.map((provider) => provider(context)));
            // Flatten and deduplicate
            const allSuggestions = results.flat();
            const uniqueSuggestions = Array.from(new Map(allSuggestions.map((s) => [s.text, s])).values());
            // Sort by confidence
            return uniqueSuggestions.sort((a, b) => {
                const confidenceA = a.confidence || 0;
                const confidenceB = b.confidence || 0;
                return confidenceB - confidenceA;
            });
        }
        catch (error) {
            if (config.debug) {
                console.error('[AI] Failed to get suggestions:', error);
            }
            return [];
        }
    }, [config]);
    const moderateContent = useCallback(async (content, context) => {
        if (!config.enableModeration || !config.moderationProvider) {
            // Default: allow everything
            return {
                flagged: false,
                reasons: [],
                action: 'allow',
            };
        }
        try {
            return await config.moderationProvider(content, context);
        }
        catch (error) {
            if (config.debug) {
                console.error('[AI] Failed to moderate content:', error);
            }
            // On error, default to allowing
            return {
                flagged: false,
                reasons: [],
                action: 'allow',
            };
        }
    }, [config]);
    const analyzeSentiment = useCallback(async (text) => {
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
            };
        }
        try {
            return await config.sentimentAnalyzer(text);
        }
        catch (error) {
            if (config.debug) {
                console.error('[AI] Failed to analyze sentiment:', error);
            }
            return {
                sentiment: 'neutral',
                confidence: 0,
                scores: {
                    positive: 0,
                    negative: 0,
                    neutral: 1,
                },
            };
        }
    }, [config]);
    const value = useMemo(() => ({
        getSuggestions,
        moderateContent,
        analyzeSentiment,
        config,
    }), [getSuggestions, moderateContent, analyzeSentiment, config]);
    return _jsx(AIContext.Provider, { value: value, children: children });
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
    const context = useContext(AIContext);
    if (!context) {
        throw new Error('useAI must be used within an AIProvider');
    }
    return context;
}
//# sourceMappingURL=AIProvider.js.map