import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTokenOptimization, TokenOptimizationPanel, TokenOptimizationBadge, } from '../hooks/use-token-optimization';
import { useChat } from '../hooks/use-chat-enhanced';
// ============================================================================
// Example 1: Basic Usage with Prompt Shortening
// ============================================================================
export function BasicTokenOptimizationExample() {
    const { optimizePrompt, stats, } = useTokenOptimization({
        enablePromptShortening: true,
        promptShortening: {
            removeFillers: true,
            removeDuplicates: true,
            targetReduction: 0.2,
        },
    });
    const handleSend = async (message) => {
        // Optimize prompt before sending
        const { optimized, savings } = optimizePrompt(message);
        console.log(`Original: ${message}`);
        console.log(`Optimized: ${optimized}`);
        console.log(`Saved ${savings.tokensSaved} tokens (${savings.percentage.toFixed(1)}%)`);
        // Send optimized message to API
        // await sendToAPI(optimized)
    };
    return (_jsx("div", { children: _jsx(TokenOptimizationBadge, { stats: stats, showCost: true }) }));
}
// ============================================================================
// Example 2: Full Optimization Stack
// ============================================================================
export function FullOptimizationExample() {
    const { optimizePrompt, optimizeHistory, getCachedResponse, setCachedResponse, canMakeRequest, recordRequest, routeQuery, limitOutput, stats, } = useTokenOptimization({
        // Enable all optimizations
        enablePromptShortening: true,
        enableHistoryLimiting: true,
        enableCaching: true,
        enableThrottling: true,
        enableModelRouting: true,
        enableOutputLimits: true,
        // Configuration
        promptShortening: {
            removeFillers: true,
            removeDuplicates: true,
            targetReduction: 0.25,
        },
        historyLimiting: {
            strategy: 'smart',
            maxTokens: 2000,
            keepSystemMessage: true,
        },
        caching: {
            storage: 'memory',
            ttl: 3600000, // 1 hour
            maxSize: 100,
        },
        throttling: {
            minDelay: 500,
            maxRequests: 10,
            timeWindow: 60000, // 1 minute
        },
        modelRouting: {
            complexityThreshold: 50,
            simpleModel: 'gpt-3.5-turbo',
            complexModel: 'gpt-4',
            simpleModelCost: 0.0000005,
            complexModelCost: 0.00003,
        },
        outputLimits: {
            maxTokens: 500,
            truncationStrategy: 'smart',
        },
    });
    const { messages, append } = useChat({
        api: '/api/chat',
    });
    const handleSend = async (userInput) => {
        // 1. Check throttling
        if (!canMakeRequest()) {
            alert('Please wait before sending another message');
            return;
        }
        // 2. Optimize prompt
        const { optimized } = optimizePrompt(userInput);
        // 3. Check cache
        const cached = getCachedResponse(optimized);
        if (cached) {
            console.log('Using cached response!');
            append({ role: 'assistant', content: cached });
            return;
        }
        // 4. Route to appropriate model
        const model = routeQuery(optimized);
        // 5. Limit history
        const limitedMessages = optimizeHistory(messages);
        // 6. Record request
        recordRequest();
        // 7. Send to API
        const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                messages: limitedMessages,
                model,
                prompt: optimized,
            }),
        });
        const data = await response.json();
        let responseText = data.content;
        // 8. Limit output
        responseText = limitOutput(responseText);
        // 9. Cache response
        setCachedResponse(optimized, responseText);
        // 10. Add to messages
        append({ role: 'assistant', content: responseText });
    };
    return (_jsx("div", { children: _jsx(TokenOptimizationPanel, { stats: stats, showDetails: true }) }));
}
// ============================================================================
// Example 3: Smart Caching with Similarity
// ============================================================================
export function SimilarityCachingExample() {
    const { getCachedResponse, setCachedResponse, stats, } = useTokenOptimization({
        enableSimilarityCaching: true,
        similarityCaching: {
            similarityThreshold: 0.7,
            useEmbeddings: false, // Set to true if you have embeddings
            ttl: 7200000, // 2 hours
        },
    });
    const handleQuery = async (query) => {
        // Check for similar cached responses
        const cached = getCachedResponse(query);
        if (cached) {
            return cached;
        }
        // Make API call
        const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ query }),
        });
        const data = await response.json();
        // Cache response
        setCachedResponse(query, data.content);
        return data.content;
    };
    return (_jsx("div", { children: _jsx(TokenOptimizationBadge, { stats: stats }) }));
}
// ============================================================================
// Example 4: Request Batching
// ============================================================================
export function BatchingExample() {
    const { batchRequest, stats } = useTokenOptimization({
        enableBatching: true,
        batching: {
            batchSize: 5,
            maxWaitTime: 1000,
            timeWindow: 5000,
        },
    });
    const handleBatchOperation = async () => {
        // These requests will be batched together
        const results = await Promise.all([
            batchRequest(() => fetch('/api/analyze?text=text1').then(r => r.json())),
            batchRequest(() => fetch('/api/analyze?text=text2').then(r => r.json())),
            batchRequest(() => fetch('/api/analyze?text=text3').then(r => r.json())),
        ]);
        return results;
    };
    return (_jsxs("div", { children: [_jsx(TokenOptimizationPanel, { stats: stats }), _jsx("button", { onClick: handleBatchOperation, children: "Run Batch Analysis" })] }));
}
// ============================================================================
// Example 5: Model Routing Based on Complexity
// ============================================================================
export function ModelRoutingExample() {
    const { routeQuery, stats } = useTokenOptimization({
        enableModelRouting: true,
        modelRouting: {
            complexityThreshold: 50,
            simpleModel: 'gpt-3.5-turbo',
            complexModel: 'gpt-4',
            simpleModelCost: 0.0000005,
            complexModelCost: 0.00003,
        },
    });
    const handleQuery = async (query) => {
        // Automatically route to appropriate model
        const model = routeQuery(query);
        console.log(`Query routed to: ${model}`);
        console.log(`Cost savings: $${stats.costSavings.toFixed(4)}`);
        const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                query,
                model,
            }),
        });
        return response.json();
    };
    return (_jsx("div", { children: _jsx(TokenOptimizationBadge, { stats: stats, showCost: true }) }));
}
// ============================================================================
// Example 6: Integration with useChat Hook
// ============================================================================
export function IntegratedChatExample() {
    const optimization = useTokenOptimization({
        enablePromptShortening: true,
        enableHistoryLimiting: true,
        enableCaching: true,
        enableThrottling: true,
        historyLimiting: {
            strategy: 'smart',
            maxTokens: 2000,
        },
    });
    const chat = useChat({
        api: '/api/chat',
        onFinish: (message) => {
            // Cache assistant responses
            if (message.role === 'assistant') {
                const lastUserMessage = chat.messages
                    .filter(m => m.role === 'user')
                    .pop();
                if (lastUserMessage) {
                    const userText = typeof lastUserMessage.content === 'string'
                        ? lastUserMessage.content
                        : JSON.stringify(lastUserMessage.content);
                    optimization.setCachedResponse(userText, message.content);
                }
            }
        },
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const input = chat.input;
        // Check throttling
        if (!optimization.canMakeRequest()) {
            alert('Please wait before sending another message');
            return;
        }
        // Optimize prompt
        const { optimized } = optimization.optimizePrompt(input);
        // Check cache
        const cached = optimization.getCachedResponse(optimized);
        if (cached) {
            chat.append({ role: 'assistant', content: cached });
            return;
        }
        // Limit history
        const limitedMessages = optimization.optimizeHistory(chat.messages);
        // Record request
        optimization.recordRequest();
        // Send with limited history
        await chat.append({ role: 'user', content: optimized }, {
            // Override messages for this request
            experimental_prepareRequestBody: (currentMessages) => {
                return {
                    messages: limitedMessages.map(m => ({
                        role: m.role,
                        content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
                    })),
                };
            },
        });
    };
    return (_jsxs("div", { children: [_jsx(TokenOptimizationPanel, { stats: optimization.stats }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("input", { value: chat.input, onChange: chat.handleInputChange, placeholder: "Type a message..." }), _jsx("button", { type: "submit", disabled: chat.isLoading, children: "Send" })] }), _jsx("div", { children: chat.messages.map((msg) => (_jsxs("div", { children: [_jsxs("strong", { children: [msg.role, ":"] }), " ", typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)] }, msg.id))) })] }));
}
//# sourceMappingURL=token-optimization.example.js.map