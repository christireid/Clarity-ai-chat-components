import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { usePromptCompression, useSmartCache, useModelRouter, useResponseLimiter, useRequestBatcher, useSmartThrottle, TokenOptimizationDashboard, ThemeProvider, themes, } from '@clarity-chat/react';
import '@clarity-chat/react/styles.css';
/**
 * Comprehensive Token Optimization Demo
 *
 * Demonstrates all token optimization features working together.
 */
export function App() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // Initialize all optimization features
    const compression = usePromptCompression({
        removeFillers: true,
        useAbbreviations: false, // Keep readable for demo
        trimWhitespace: true,
    });
    const cache = useSmartCache({
        enableSemanticMatching: false, // Set to true with real embeddings
        maxSize: 50,
        defaultTTL: 3600000, // 1 hour
    });
    const router = useModelRouter({
        onRoute: (decision) => {
            console.log(`Routed to ${decision.model.name}`);
            console.log(`Estimated savings: ${decision.savingsPercent.toFixed(1)}%`);
        },
    });
    const limiter = useResponseLimiter({
        preset: 'brief',
        onTruncate: (original, truncated) => {
            console.log(`Truncated ${original.length - truncated.length} characters`);
        },
    });
    const batcher = useRequestBatcher({
        maxBatchSize: 5,
        maxWaitTime: 1000,
        processor: async (queries) => {
            // Simulate batch API call
            console.log(`Processing batch of ${queries.length} queries`);
            return queries.map(q => `Response to: ${q}`);
        },
    });
    const throttle = useSmartThrottle({
        delay: 500,
        adaptive: true,
        minLength: 3,
        trackSavings: true,
    });
    // Calculate combined metrics
    const totalTokensSaved = compression.totalTokensSaved +
        cache.stats.tokensSaved +
        limiter.stats.tokensSaved;
    const totalCostSaved = cache.stats.costSaved +
        router.stats.totalEstimatedCost * 0.3; // Rough estimate
    const metrics = {
        totalTokens: compression.compressionCount * 100 + totalTokensSaved, // Rough estimate
        tokensSaved: totalTokensSaved,
        costSaved: totalCostSaved,
        breakdown: {
            promptCompression: {
                tokens: compression.totalTokensSaved,
                percent: compression.averageSavingsPercent,
            },
            caching: {
                hits: cache.stats.hits,
                savings: cache.stats.tokensSaved,
            },
            modelRouting: {
                savings: router.stats.totalEstimatedCost * 0.4,
                percent: router.stats.averageSavings,
            },
            responseLimiting: {
                tokens: limiter.stats.tokensSaved,
                percent: limiter.stats.savingsPercent,
            },
            batching: {
                requests: batcher.stats.totalBatches,
                savings: batcher.stats.totalBatches * 100, // Rough estimate
            },
            throttling: {
                callsSaved: throttle.callsSaved,
            },
            referencing: {
                bytesSaved: 0, // Not used in this demo
                percent: 0,
            },
        },
        savingsPercent: totalTokensSaved > 0
            ? (totalTokensSaved / (compression.compressionCount * 100 + totalTokensSaved)) * 100
            : 0,
    };
    const handleSend = async () => {
        if (!input.trim())
            return;
        setIsLoading(true);
        try {
            // Step 1: Compress prompt
            const compressionResult = compression.compress(input);
            console.log(`Compressed: ${compressionResult.tokenSavings} tokens saved`);
            // Step 2: Check cache
            const cached = await cache.get(compressionResult.compressed);
            if (cached) {
                console.log('Cache hit!');
                setMessages(prev => [
                    ...prev,
                    { role: 'user', content: input },
                    { role: 'assistant', content: cached },
                ]);
                setInput('');
                return;
            }
            // Step 3: Route to best model
            const routing = router.route(compressionResult.compressed);
            console.log(`Using model: ${routing.model.name}`);
            // Step 4: Create limited prompt
            const limitedPrompt = limiter.createPrompt(compressionResult.compressed);
            console.log(`Constraints: ${limitedPrompt.constraints.join(', ')}`);
            // Step 5: Simulate API call (in real app, call your API here)
            const mockResponse = `This is a simulated response using ${routing.model.name}. ` +
                `Your query was: "${compressionResult.compressed}". ` +
                `Token optimization is active with ${metrics.savingsPercent.toFixed(1)}% savings!`;
            // Step 6: Enforce response limits
            const limitedResponse = limiter.enforce(mockResponse);
            console.log(`Response limited: ${limitedResponse.tokensSaved} tokens saved`);
            // Step 7: Cache result
            await cache.set(compressionResult.compressed, limitedResponse.response);
            // Update messages
            setMessages(prev => [
                ...prev,
                { role: 'user', content: input },
                { role: 'assistant', content: limitedResponse.response },
            ]);
            setInput('');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleReset = () => {
        setMessages([]);
        compression.resetStats();
        cache.clear();
        router.clearHistory();
        limiter.resetStats();
        batcher.clear();
        throttle.resetStats();
    };
    return (_jsx(ThemeProvider, { theme: themes.ocean, children: _jsx("div", { className: "min-h-screen bg-background p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto space-y-6", children: [_jsxs("div", { className: "text-center space-y-2 mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-foreground", children: "Token Optimization Demo" }), _jsx("p", { className: "text-lg text-muted-foreground", children: "Experience all optimization features working together" }), _jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 mt-4", children: [_jsxs("span", { className: "font-medium text-green-600", children: [totalTokensSaved.toLocaleString(), " saved"] }), _jsx("span", { className: "text-muted-foreground", children: "\u2022" }), _jsxs("span", { className: "text-muted-foreground", children: [metrics.savingsPercent.toFixed(1), "%"] })] })] }), _jsx(TokenOptimizationDashboard, { metrics: metrics, showBreakdown: true, realTime: false }), _jsxs("div", { className: "bg-card rounded-xl border border-border p-6 shadow-sm", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Try It Out" }), _jsx("div", { className: "space-y-4 mb-4 min-h-[200px] max-h-[400px] overflow-y-auto", children: messages.length === 0 ? (_jsxs("div", { className: "text-center text-muted-foreground py-8", children: [_jsx("p", { children: "Send a message to see optimizations in action!" }), _jsx("p", { className: "text-sm mt-2", children: "Try: \"What is React?\" or \"Explain machine learning\"" })] })) : (messages.map((msg, i) => (_jsxs("div", { className: `p-4 rounded-lg ${msg.role === 'user'
                                        ? 'bg-primary/10 ml-12'
                                        : 'bg-muted mr-12'}`, children: [_jsx("div", { className: "text-xs font-medium mb-1 text-muted-foreground", children: msg.role === 'user' ? 'You' : 'Assistant' }), _jsx("div", { className: "text-sm", children: msg.content })] }, i)))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && !isLoading && handleSend(), placeholder: "Type your message...", disabled: isLoading, className: "flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" }), _jsx("button", { onClick: handleSend, disabled: isLoading || !input.trim(), className: "px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity", children: isLoading ? 'Sending...' : 'Send' }), _jsx("button", { onClick: handleReset, className: "px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:opacity-90 transition-opacity", children: "Reset" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-card rounded-lg border border-border p-4", children: [_jsx("h3", { className: "text-sm font-medium mb-2", children: "Compression" }), _jsxs("div", { className: "space-y-1 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Compressions:" }), _jsx("span", { className: "font-medium", children: compression.compressionCount })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Avg Savings:" }), _jsxs("span", { className: "font-medium text-success", children: [compression.averageSavingsPercent.toFixed(1), "%"] })] })] })] }), _jsxs("div", { className: "bg-card rounded-lg border border-border p-4", children: [_jsx("h3", { className: "text-sm font-medium mb-2", children: "Cache" }), _jsxs("div", { className: "space-y-1 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Hit Rate:" }), _jsxs("span", { className: "font-medium text-success", children: [cache.stats.hitRate.toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Entries:" }), _jsx("span", { className: "font-medium", children: cache.stats.size })] })] })] }), _jsxs("div", { className: "bg-card rounded-lg border border-border p-4", children: [_jsx("h3", { className: "text-sm font-medium mb-2", children: "Routing" }), _jsxs("div", { className: "space-y-1 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Queries:" }), _jsx("span", { className: "font-medium", children: router.stats.totalQueries })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Avg Savings:" }), _jsxs("span", { className: "font-medium text-success", children: [router.stats.averageSavings.toFixed(1), "%"] })] })] })] })] }), _jsxs("div", { className: "text-center text-sm text-muted-foreground", children: [_jsx("p", { children: "This demo simulates API calls. In production, integrate with your actual API." }), _jsx("p", { className: "mt-1", children: "Check the browser console for detailed optimization logs." })] })] }) }) }));
}
export default App;
//# sourceMappingURL=App.js.map