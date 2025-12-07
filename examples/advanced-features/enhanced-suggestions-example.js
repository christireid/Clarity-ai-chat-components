import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Enhanced Follow-up Suggestions Example
 *
 * Demonstrates ML-based suggestion ranking with personalization
 */
import * as React from 'react';
import { PromptSuggestionsEnhanced, usePromptSuggestionsEnhanced, useChatEnhanced, } from '@clarity-chat/react';
/**
 * Example 1: Drop-in Component Usage
 *
 * Easiest way to use enhanced suggestions - just replace your
 * existing PromptSuggestions component.
 */
export function BasicEnhancedSuggestionsExample() {
    const { messages, sendMessage } = useChatEnhanced({
        api: '/api/chat',
    });
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "chat-messages", children: messages.map((msg) => (_jsx("div", { children: msg.content }, msg.id))) }), _jsx(PromptSuggestionsEnhanced, { messages: messages, onSelect: (suggestion) => sendMessage(suggestion.text), config: {
                    rankingModel: { type: 'hybrid' }, // ML + rule-based
                    features: {
                        conversationContext: true,
                        userHistory: true,
                        timeOfDay: true,
                        previousSelections: true,
                    },
                    enableABTesting: false,
                    trackEffectiveness: true,
                }, maxSuggestions: 6, layout: "chips" })] }));
}
/**
 * Example 2: Advanced Hook Usage with Custom UI
 *
 * Use the hook directly for full control over the UI
 */
export function AdvancedHookExample() {
    const { messages, sendMessage } = useChatEnhanced({
        api: '/api/chat',
    });
    const { suggestions, trackInteraction, stats, abVariant, userPreferences, resetPreferences, } = usePromptSuggestionsEnhanced(messages, {
        rankingModel: { type: 'hybrid' },
        features: {
            conversationContext: true,
            userHistory: true,
            timeOfDay: true,
            previousSelections: true,
        },
        enableABTesting: true,
        trackEffectiveness: true,
    });
    const [resolvedSuggestions, setResolvedSuggestions] = React.useState([]);
    React.useEffect(() => {
        suggestions.then(setResolvedSuggestions);
    }, [suggestions]);
    const handleSelect = (suggestion) => {
        // Track the interaction
        trackInteraction(suggestion, true);
        // Send the message
        sendMessage(suggestion.text);
    };
    const handleDismiss = (suggestion) => {
        // Track that user saw but didn't select
        trackInteraction(suggestion, false);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "chat-messages", children: messages.map((msg) => (_jsx("div", { children: msg.content }, msg.id))) }), _jsxs("div", { className: "suggestions-container", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Smart Suggestions" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("span", { className: "text-sm text-muted-foreground", children: ["CTR: ", (stats.clickThroughRate * 100).toFixed(1), "%"] }), _jsxs("span", { className: "text-sm text-muted-foreground", children: ["Variant: ", abVariant] })] })] }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: resolvedSuggestions.map((suggestion, index) => (_jsxs("div", { className: "relative p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors", onClick: () => handleSelect(suggestion), children: [suggestion.confidence !== undefined && (_jsxs("div", { className: "absolute top-2 right-2 text-xs px-2 py-1 rounded-full", style: {
                                        backgroundColor: `rgba(59, 130, 246, ${suggestion.confidence})`,
                                        color: suggestion.confidence > 0.5 ? 'white' : 'black',
                                    }, children: [Math.round(suggestion.confidence * 100), "%"] })), _jsx("div", { className: "font-medium mb-1", children: suggestion.label || suggestion.text }), suggestion.description && (_jsx("div", { className: "text-sm text-muted-foreground", children: suggestion.description })), suggestion.keywords && suggestion.keywords.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: suggestion.keywords.slice(0, 3).map((keyword) => (_jsx("span", { className: "text-xs px-2 py-0.5 bg-muted rounded", children: keyword }, keyword))) })), _jsx("button", { className: "absolute bottom-2 right-2 text-xs text-muted-foreground hover:text-foreground", onClick: (e) => {
                                        e.stopPropagation();
                                        handleDismiss(suggestion);
                                    }, children: "\u2715" })] }, suggestion.id))) })] }), _jsxs("div", { className: "stats-panel p-4 border rounded-lg bg-muted/50", children: [_jsx("h4", { className: "font-semibold mb-3", children: "Suggestion Analytics" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("div", { className: "text-muted-foreground", children: "Total Suggestions" }), _jsx("div", { className: "text-2xl font-bold", children: stats.totalSuggestions })] }), _jsxs("div", { children: [_jsx("div", { className: "text-muted-foreground", children: "Click-Through Rate" }), _jsxs("div", { className: "text-2xl font-bold", children: [(stats.clickThroughRate * 100).toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-muted-foreground", children: "Avg Confidence" }), _jsxs("div", { className: "text-2xl font-bold", children: [(stats.averageConfidence * 100).toFixed(0), "%"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-muted-foreground", children: "ML vs Rule-based" }), _jsxs("div", { className: "text-lg font-bold", children: [stats.mlRankingCount, " / ", stats.ruleBasedCount] })] })] }), _jsxs("div", { className: "mt-4 pt-4 border-t", children: [_jsx("h5", { className: "font-medium mb-2", children: "Your Preferences" }), _jsxs("div", { className: "text-sm space-y-1", children: [_jsxs("div", { children: ["History: ", userPreferences.suggestionHistory.length, " interactions tracked"] }), _jsxs("div", { children: ["Top Keywords:", ' ', Array.from(userPreferences.frequentKeywords.entries())
                                                .sort(([, a], [, b]) => b - a)
                                                .slice(0, 5)
                                                .map(([keyword]) => keyword)
                                                .join(', ')] }), _jsxs("div", { children: ["Most Active Hour:", ' ', Array.from(userPreferences.timePatterns.entries())
                                                .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A', ":00"] })] }), _jsx("button", { className: "mt-3 text-sm px-3 py-1 border rounded hover:bg-accent", onClick: resetPreferences, children: "Reset Preferences" })] })] })] }));
}
/**
 * Example 3: A/B Testing Setup
 *
 * Compare ML-based vs rule-based suggestion ranking
 */
export function ABTestingExample() {
    const { messages, sendMessage } = useChatEnhanced({
        api: '/api/chat',
    });
    const { suggestions, trackInteraction, stats, abVariant, } = usePromptSuggestionsEnhanced(messages, {
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
    });
    // Log A/B test results to analytics
    React.useEffect(() => {
        // Send to your analytics service
        if (stats.totalInteractions > 0) {
            console.log('A/B Test Results:', {
                variant: abVariant,
                ctr: stats.clickThroughRate,
                avgConfidence: stats.averageConfidence,
                interactions: stats.totalInteractions,
            });
            // Example: Send to PostHog, Mixpanel, etc.
            // analytics.track('suggestion_performance', {
            //   variant: abVariant,
            //   ctr: stats.clickThroughRate,
            //   avgConfidence: stats.averageConfidence,
            // })
        }
    }, [abVariant, stats]);
    const [resolvedSuggestions, setResolvedSuggestions] = React.useState([]);
    React.useEffect(() => {
        suggestions.then(setResolvedSuggestions);
    }, [suggestions]);
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "px-4 py-2 border rounded-lg bg-blue-50 dark:bg-blue-900", children: [_jsxs("div", { className: "text-sm font-medium", children: ["A/B Test Active: You're in the ", _jsx("strong", { children: abVariant }), " group"] }), abVariant === 'experiment' && (_jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Using ML-based ranking with personalization" })), abVariant === 'control' && (_jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Using traditional rule-based ranking" }))] }), _jsx(PromptSuggestionsEnhanced, { messages: messages, onSelect: (s) => {
                    trackInteraction(s, true);
                    sendMessage(s.text);
                }, config: {
                    rankingModel: {
                        type: abVariant === 'experiment' ? 'ml' : 'rule-based',
                    },
                    features: {
                        conversationContext: true,
                        userHistory: abVariant === 'experiment',
                        timeOfDay: abVariant === 'experiment',
                        previousSelections: abVariant === 'experiment',
                    },
                } }), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("h4", { className: "font-semibold mb-3", children: "Your Performance" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Click-Through Rate:" }), _jsxs("span", { className: "font-bold", children: [(stats.clickThroughRate * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Avg Confidence:" }), _jsxs("span", { className: "font-bold", children: [(stats.averageConfidence * 100).toFixed(0), "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Total Interactions:" }), _jsx("span", { className: "font-bold", children: stats.totalInteractions })] })] }), _jsx("div", { className: "mt-4 pt-4 border-t", children: _jsx("div", { className: "text-xs text-muted-foreground", children: abVariant === 'experiment'
                                ? 'ML-based ranking typically shows 2-3x higher CTR'
                                : 'Control group baseline for comparison' }) })] })] }));
}
/**
 * Example 4: Custom ML Provider Integration
 *
 * Connect to your own ML ranking service
 */
export function CustomMLProviderExample() {
    const { messages, sendMessage } = useChatEnhanced({
        api: '/api/chat',
    });
    const { suggestions, trackInteraction, } = usePromptSuggestionsEnhanced(messages, {
        rankingModel: {
            type: 'ml',
            provider: 'custom',
            endpoint: '/api/rank-suggestions',
            apiKey: process.env.NEXT_PUBLIC_ML_API_KEY,
        },
        features: {
            conversationContext: true,
            userHistory: true,
            timeOfDay: true,
            previousSelections: true,
        },
        trackEffectiveness: true,
    });
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
    const [resolvedSuggestions, setResolvedSuggestions] = React.useState([]);
    React.useEffect(() => {
        suggestions.then(setResolvedSuggestions);
    }, [suggestions]);
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Using custom ML ranking service at /api/rank-suggestions" }), _jsx(PromptSuggestionsEnhanced, { messages: messages, onSelect: (s) => {
                    trackInteraction(s, true);
                    sendMessage(s.text);
                }, config: {
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
                } })] }));
}
//# sourceMappingURL=enhanced-suggestions-example.js.map