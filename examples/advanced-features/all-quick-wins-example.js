import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * All Quick Wins Together - Complete Example
 *
 * Demonstrates all four Quick Win features working together:
 * 1. Enhanced Follow-up Suggestions
 * 2. Conversation Summarizer
 * 3. Battery-Aware Features
 * 4. Performance Analytics Dashboard
 */
import * as React from 'react';
import { useChatEnhanced, PromptSuggestionsEnhanced, ConversationSummarizer, BatteryIndicator, PerformanceAnalyticsDashboard, useBatteryAware, ChatWindow, } from '@clarity-chat/react';
import { useFocusTrap, useEscapeKey } from '../utils/accessibility';
/**
 * Complete Advanced Chat Application
 *
 * This example shows how to integrate all four Quick Win features
 * for a production-ready, high-performance chat experience.
 */
export function AdvancedChatApplication() {
    const [showPerformancePanel, setShowPerformancePanel] = React.useState(process.env.NODE_ENV === 'development');
    const [showSummaryPanel, setShowSummaryPanel] = React.useState(false);
    // Battery-aware optimizations
    const { batteryStatus, recommendations, shouldEnableBatterySaver, batteryDescription, } = useBatteryAware({
        batterySaverThreshold: 0.2,
        optimizations: {
            reduceAnimations: true,
            throttleUpdates: true,
            deferNonCritical: true,
            reduceStreamingQuality: true,
        },
        autoOptimize: true,
    });
    // Chat state
    const { messages, sendMessage, isLoading, error } = useChatEnhanced({
        api: '/api/chat',
        // Apply battery optimizations
        streamingEnabled: !recommendations.reduceStreaming,
        updateInterval: recommendations.updateInterval,
    });
    // Custom summarization with your LLM API
    const handleGenerateSummary = React.useCallback(async (messages, level) => {
        const response = await fetch('/api/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages, level }),
        });
        if (!response.ok) {
            throw new Error('Failed to generate summary');
        }
        return response.json();
    }, []);
    // Performance tracking
    const handlePerformanceUpdate = React.useCallback((data) => {
        // Send to your analytics service
        if (data.webVitals?.length > 0) {
            console.log('Web Vitals:', data.webVitals);
            // Example: Track to analytics
            // analytics.track('web_vitals', {
            //   lcp: data.webVitals.find((v) => v.name === 'LCP')?.value,
            //   fid: data.webVitals.find((v) => v.name === 'FID')?.value,
            //   cls: data.webVitals.find((v) => v.name === 'CLS')?.value,
            // })
        }
        // Monitor memory usage
        if (data.memoryUsage && data.memoryUsage.used / data.memoryUsage.limit > 0.8) {
            console.warn('High memory usage detected:', data.memoryUsage);
        }
        // Monitor FPS
        if (data.fps && data.fps < 30) {
            console.warn('Low FPS detected:', data.fps);
        }
    }, []);
    return (_jsxs("div", { className: "relative flex h-screen", children: [_jsx(BatteryIndicator, { position: "top-right", showTooltip: true, showLabel: !shouldEnableBatterySaver }), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("header", { className: "border-b p-4 flex items-center justify-between bg-background/95 backdrop-blur-sm", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("h1", { className: "text-xl font-bold", children: "Advanced Chat" }), shouldEnableBatterySaver && (_jsxs("div", { className: "px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-sm", children: ["Battery Saver Active (", batteryDescription, ")"] })), recommendations.level !== 'none' && (_jsxs("div", { className: "px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm", children: ["Optimizations: ", recommendations.level] }))] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => setShowSummaryPanel(!showSummaryPanel), className: "px-3 py-2 text-sm border rounded-lg hover:bg-accent transition-colors", children: [showSummaryPanel ? 'Hide' : 'Show', " Summary"] }), _jsxs("button", { onClick: () => setShowPerformancePanel(!showPerformancePanel), className: "px-3 py-2 text-sm border rounded-lg hover:bg-accent transition-colors", children: [showPerformancePanel ? 'Hide' : 'Show', " Performance"] })] })] }), _jsx("div", { className: "flex-1 overflow-hidden", children: _jsx(ChatWindow, { messages: messages, isLoading: isLoading, error: error, enableAnimations: !recommendations.disableAnimations, updateInterval: recommendations.updateInterval }) }), _jsx("div", { className: "border-t p-4 bg-background", children: _jsx(PromptSuggestionsEnhanced, { messages: messages, onSelect: (suggestion) => sendMessage(suggestion.text), config: {
                                rankingModel: { type: 'hybrid' },
                                features: {
                                    conversationContext: true,
                                    userHistory: true,
                                    timeOfDay: true,
                                    previousSelections: true,
                                },
                                enableABTesting: true,
                                trackEffectiveness: true,
                            }, maxSuggestions: recommendations.level === 'aggressive' ? 3 : 6, layout: "chips" }) })] }), showSummaryPanel && (_jsx("aside", { className: "w-96 border-l overflow-y-auto bg-background", children: _jsx("div", { className: "p-4", children: _jsx(ConversationSummarizer, { messages: messages, config: {
                            trigger: 'manual',
                            levels: ['brief', 'detailed', 'comprehensive'],
                            provider: {
                                type: 'openai',
                                model: 'gpt-4o',
                            },
                            includeActionItems: true,
                            includeKeyTopics: true,
                            includeCodeSnippets: true,
                        }, onSummaryGenerated: (summary) => {
                            console.log('Summary generated:', summary);
                            // Track to analytics
                            // analytics.track('summary_generated', {
                            //   level: summary.level,
                            //   messageCount: summary.messageRange.totalMessages,
                            //   generationTime: summary.generationTime,
                            // })
                        }, onGenerateSummary: handleGenerateSummary, showHistory: true, defaultLevel: "detailed" }) }) })), showPerformancePanel && !showSummaryPanel && (_jsx("aside", { className: "w-96 border-l overflow-y-auto bg-background", children: _jsx("div", { className: "p-4", children: _jsx(PerformanceAnalyticsDashboard, { updateInterval: recommendations.updateInterval, showWebVitals: true, showComponentMetrics: process.env.NODE_ENV === 'development', showMemoryUsage: true, showFPS: true, onDataUpdate: handlePerformanceUpdate, compact: true }) }) }))] }));
}
/**
 * Mobile-Optimized Version
 *
 * Demonstrates aggressive battery optimization for mobile devices
 */
export function MobileAdvancedChat() {
    const { recommendations, shouldEnableBatterySaver, batteryDescription, } = useBatteryAware({
        batterySaverThreshold: 0.3, // More aggressive on mobile
        optimizations: {
            reduceAnimations: true,
            throttleUpdates: true,
            deferNonCritical: true,
            reduceStreamingQuality: true,
        },
        autoOptimize: true,
    });
    const { messages, sendMessage, isLoading } = useChatEnhanced({
        api: '/api/chat',
        streamingEnabled: !recommendations.reduceStreaming,
        updateInterval: recommendations.updateInterval,
    });
    const [showSummary, setShowSummary] = React.useState(false);
    // 🎯 Use accessibility utilities for modal
    const { containerRef: dialogRef } = useFocusTrap({
        enabled: showSummary,
        autoFocus: true,
        returnFocus: true,
    });
    useEscapeKey(() => setShowSummary(false), showSummary);
    return (_jsxs("div", { className: "flex flex-col h-screen", children: [_jsxs("header", { className: "border-b p-3 flex items-center justify-between bg-background sticky top-0 z-10", children: [_jsx("h1", { className: "text-lg font-bold", children: "Chat" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(BatteryIndicator, { compact: true, position: "inline" }), _jsx("button", { onClick: () => setShowSummary(!showSummary), "aria-expanded": showSummary, "aria-haspopup": "dialog", className: "px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary", children: "Summary" })] })] }), shouldEnableBatterySaver && (_jsx("div", { className: "px-4 py-2 bg-orange-100 dark:bg-orange-900 text-sm text-center", children: "\u26A1 Battery Saver Active - Optimizations enabled" })), _jsx("div", { className: "flex-1 overflow-y-auto p-4", children: _jsx(ChatWindow, { messages: messages, isLoading: isLoading, enableAnimations: !recommendations.disableAnimations, updateInterval: recommendations.updateInterval }) }), _jsx("div", { className: "border-t p-3 bg-background sticky bottom-0", children: _jsx(PromptSuggestionsEnhanced, { messages: messages, onSelect: (s) => sendMessage(s.text), config: {
                        rankingModel: { type: 'hybrid' },
                        features: {
                            conversationContext: true,
                            userHistory: true,
                            timeOfDay: true,
                            previousSelections: true,
                        },
                    }, maxSuggestions: recommendations.level === 'aggressive' ? 3 : 4, layout: "chips" }) }), showSummary && (_jsx("div", { className: "fixed inset-0 bg-black/50 z-50", onClick: () => setShowSummary(false), role: "presentation", children: _jsx("div", { ref: dialogRef, role: "dialog", "aria-modal": "true", "aria-labelledby": "summary-title", className: "absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl max-h-[80vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { id: "summary-title", className: "text-lg font-bold", children: "Summary" }), _jsx("button", { onClick: () => setShowSummary(false), "aria-label": "Close summary panel", className: "text-2xl focus:outline-none focus:ring-2 focus:ring-primary rounded", children: "\u2715" })] }), _jsx(ConversationSummarizer, { messages: messages, config: {
                                    trigger: 'manual',
                                    levels: ['brief', 'detailed'],
                                    provider: {
                                        type: 'openai',
                                        model: 'gpt-4o-mini', // Lighter model for mobile
                                    },
                                    includeActionItems: true,
                                    includeKeyTopics: true,
                                }, showHistory: false, defaultLevel: "brief" })] }) }) }))] }));
}
/**
 * Developer Dashboard Version
 *
 * Includes all features with enhanced debugging and monitoring
 */
export function DeveloperDashboard() {
    const [selectedTab, setSelectedTab] = React.useState('chat');
    const { recommendations, batteryStatus, isSupported: batterySupported, } = useBatteryAware({
        batterySaverThreshold: 0.2,
        autoOptimize: true,
    });
    const { messages, sendMessage, isLoading } = useChatEnhanced({
        api: '/api/chat',
    });
    const [performanceData, setPerformanceData] = React.useState(null);
    const [suggestionStats, setSuggestionStats] = React.useState(null);
    return (_jsx("div", { className: "flex h-screen", children: _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsxs("header", { className: "border-b p-4 flex items-center gap-4 bg-background", children: [_jsx("button", { onClick: () => setSelectedTab('chat'), className: `px-4 py-2 rounded-lg transition-colors ${selectedTab === 'chat'
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-accent'}`, children: "Chat" }), _jsx("button", { onClick: () => setSelectedTab('performance'), className: `px-4 py-2 rounded-lg transition-colors ${selectedTab === 'performance'
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-accent'}`, children: "Performance" }), _jsx("button", { onClick: () => setSelectedTab('analytics'), className: `px-4 py-2 rounded-lg transition-colors ${selectedTab === 'analytics'
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-accent'}`, children: "Analytics" }), _jsx("div", { className: "ml-auto", children: _jsx(BatteryIndicator, { position: "inline", showLabel: true }) })] }), _jsxs("div", { className: "flex-1 overflow-hidden", children: [selectedTab === 'chat' && (_jsxs("div", { className: "h-full flex flex-col", children: [_jsx("div", { className: "flex-1 overflow-y-auto", children: _jsx(ChatWindow, { messages: messages, isLoading: isLoading, enableAnimations: !recommendations.disableAnimations }) }), _jsxs("div", { className: "border-t p-4 space-y-4", children: [_jsx(PromptSuggestionsEnhanced, { messages: messages, onSelect: (s) => sendMessage(s.text), config: {
                                                rankingModel: { type: 'hybrid' },
                                                features: {
                                                    conversationContext: true,
                                                    userHistory: true,
                                                    timeOfDay: true,
                                                    previousSelections: true,
                                                },
                                                trackEffectiveness: true,
                                            } }), _jsx(ConversationSummarizer, { messages: messages, config: {
                                                trigger: 'manual',
                                                levels: ['brief', 'detailed'],
                                                provider: { type: 'openai', model: 'gpt-4o' },
                                                includeActionItems: true,
                                                includeKeyTopics: true,
                                            } })] })] })), selectedTab === 'performance' && (_jsx("div", { className: "h-full overflow-y-auto p-6", children: _jsx(PerformanceAnalyticsDashboard, { updateInterval: 1000, showWebVitals: true, showComponentMetrics: true, showNetworkMetrics: true, showMemoryUsage: true, showFPS: true, onDataUpdate: setPerformanceData }) })), selectedTab === 'analytics' && (_jsx("div", { className: "h-full overflow-y-auto p-6", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Suggestion Analytics" }), suggestionStats && (_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Click-Through Rate" }), _jsxs("div", { className: "text-3xl font-bold", children: [(suggestionStats.clickThroughRate * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Avg Confidence" }), _jsxs("div", { className: "text-3xl font-bold", children: [(suggestionStats.averageConfidence * 100).toFixed(0), "%"] })] })] }))] }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Battery Status" }), batterySupported && batteryStatus && (_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Battery Level" }), _jsxs("div", { className: "text-3xl font-bold", children: [Math.round(batteryStatus.level * 100), "%"] })] }), _jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Optimization Level" }), _jsx("div", { className: "text-3xl font-bold capitalize", children: recommendations.level })] })] }))] }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Performance Snapshot" }), performanceData && (_jsxs("div", { className: "space-y-2", children: [performanceData.fps && (_jsxs("div", { className: "flex justify-between border-b pb-2", children: [_jsx("span", { children: "FPS:" }), _jsx("span", { className: "font-bold", children: performanceData.fps })] })), performanceData.memoryUsage && (_jsxs("div", { className: "flex justify-between border-b pb-2", children: [_jsx("span", { children: "Memory Used:" }), _jsxs("span", { className: "font-bold", children: [Math.round((performanceData.memoryUsage.used /
                                                                        performanceData.memoryUsage.limit) *
                                                                        100), "%"] })] }))] }))] })] }) }))] })] }) }));
}
//# sourceMappingURL=all-quick-wins-example.js.map