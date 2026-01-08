import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Basic Memory System Example
 *
 * Demonstrates how to set up and use the AI Memory & Context system
 */
import React from 'react';
import { ErrorBoundary, LoadingSpinner } from '../utils/error-boundary';
// 📚 IMPORT PATTERN:
// All @clarity-chat/react exports come from the main package entry point.
// The library uses a flat export structure for simpler imports.
import { MemoryProvider, useMemoryContext, QdrantVectorStore, OpenAIEmbeddings, } from '@clarity-chat/react';
// Memory configuration
const memoryConfig = {
    tokenOptimization: {
        maxContextWindow: 4096,
        allocation: {
            systemPrompt: 0.10,
            userPreferences: 0.15,
            recentContext: 0.30,
            semanticMemory: 0.25,
            episodicMemory: 0.15,
            responseReserve: 0.05,
        },
        dynamicAllocation: true,
        enableCompression: true,
        compressionRatio: 0.6,
        enableChunking: true,
        chunkSize: 200,
        chunkOverlap: 50,
    },
    persistence: {
        useVectorStore: true,
        vectorStoreNamespace: 'chat-memories',
        useCache: true,
        cacheTTL: 3600,
        useDatabase: false,
    },
    enableAutoSummarization: true,
    summarizationInterval: 300000, // 5 minutes
    enableAutoCleanup: true,
    cleanupInterval: 3600000, // 1 hour
    retentionPolicy: {
        shortTerm: 3600, // 1 hour
        session: 86400, // 24 hours
        thread: 604800, // 7 days
        global: 0, // Never expires
    },
    debug: true,
};
// Initialize vector store and embeddings
const vectorStore = new QdrantVectorStore({
    provider: 'qdrant',
    endpoint: process.env.QDRANT_URL || 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY,
    indexName: 'chat-memories',
    dimension: 1536, // OpenAI text-embedding-3-small
    metric: 'cosine',
});
const embeddings = new OpenAIEmbeddings({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'text-embedding-3-small',
});
/**
 * Chat component with memory
 *
 * 📚 WHAT THIS DEMONSTRATES:
 * This component shows how to integrate the memory context provider
 * with a simple chat interface, allowing the AI to remember
 * conversation history and user preferences.
 */
function ChatWithMemory() {
    const [messages, setMessages] = React.useState([]);
    const [input, setInput] = React.useState('');
    // 🎯 useMemoryContext provides access to the memory system
    // configured via the MemoryProvider wrapper component.
    // In production, you would destructure the methods you need:
    // const { addMemory, searchMemories, getRecentMemories } = useMemoryContext()
    const memoryContext = useMemoryContext();
    // Suppress unused variable warning - memoryContext is shown for educational purposes
    // In production, you would use it directly instead of the mock functions below
    void memoryContext;
    // ============================================================================
    // 🔧 DEMO IMPLEMENTATION - Replace These in Production
    // ============================================================================
    // The functions below are PLACEHOLDERS showing the intended API pattern.
    // They use console.log for demonstration. In a real application:
    // 1. Remove the console.log statements
    // 2. Replace with actual memoryContext method calls
    // 3. See @clarity-chat/react docs for the real implementation
    // ============================================================================
    // DEMO ONLY: Remove console.log in production
    const captureMessage = async (content, role) => {
        // DEMO: Logs to console for demonstration purposes
        console.log(`[Memory] Capturing ${role} message:`, content.substring(0, 50));
        // PRODUCTION: Uncomment and use the real API:
        // await memoryContext.addMemory({ content, type: 'episodic', metadata: { role } })
    };
    // DEMO ONLY: Remove console.log in production
    const capturePreference = async (key, value) => {
        // DEMO: Logs to console for demonstration purposes
        console.log(`[Memory] Capturing preference: ${key} = ${value}`);
        // PRODUCTION: Uncomment and use the real API:
        // await memoryContext.addMemory({ content: `${key}: ${value}`, type: 'semantic' })
    };
    // DEMO ONLY: Remove console.log in production
    const getRelevantMemories = async (query) => {
        // DEMO: Logs to console for demonstration purposes
        console.log(`[Memory] Searching for memories related to:`, query.substring(0, 50));
        // PRODUCTION: Uncomment and use the real API:
        // return await memoryContext.searchMemories(query)
        return [];
    };
    // DEMO ONLY: Remove console.log in production
    const getRecentHistory = async () => {
        // DEMO: Logs to console for demonstration purposes
        console.log(`[Memory] Fetching recent history`);
        // PRODUCTION: Uncomment and use the real API:
        // return await memoryContext.getRecentMemories()
        return messages;
    };
    // ============================================================================
    // End of Demo Implementation
    // ============================================================================
    // Mock context stats for demonstration
    // PRODUCTION: Use real stats from memoryContext.getStats()
    const context = {
        stats: {
            totalMemories: messages.length,
            totalTokens: messages.reduce((acc, m) => acc + m.content.length / 4, 0),
        },
        conversationActivity: messages.length > 5 ? 'high' : 'low',
        preferenceRichness: 'medium',
    };
    const handleSend = async () => {
        if (!input.trim())
            return;
        // Add user message
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        // Capture in memory
        await captureMessage(input, 'user');
        // Get relevant memories for context
        const relevantMemories = await getRelevantMemories(input);
        // Simulate AI response (in real app, call your LLM here)
        const assistantResponse = `I understand you said: "${input}". I found ${relevantMemories.length} relevant memories.`;
        const assistantMessage = { role: 'assistant', content: assistantResponse };
        setMessages(prev => [...prev, assistantMessage]);
        // Capture assistant response
        await captureMessage(assistantResponse, 'assistant');
        setInput('');
    };
    // Display memory context stats
    const stats = context?.stats;
    return (_jsxs("div", { className: "flex flex-col h-screen max-w-4xl mx-auto p-4", children: [_jsxs("div", { className: "mb-4 p-4 bg-blue-50 rounded-lg", children: [_jsx("h3", { className: "font-semibold mb-2", children: "Memory Context" }), stats && (_jsxs("div", { className: "text-sm space-y-1", children: [_jsxs("p", { children: ["Total Memories: ", stats.totalMemories] }), _jsxs("p", { children: ["Total Tokens: ", stats.totalTokens] }), _jsxs("p", { children: ["Conversation Activity: ", context.conversationActivity] }), _jsxs("p", { children: ["Preference Richness: ", context.preferenceRichness] })] }))] }), _jsx("div", { className: "flex-1 overflow-y-auto space-y-4 mb-4", children: messages.map((message, index) => (_jsxs("div", { className: `p-4 rounded-lg ${message.role === 'user'
                        ? 'bg-blue-100 ml-12'
                        : 'bg-gray-100 mr-12'}`, children: [_jsx("p", { className: "font-semibold mb-1 capitalize", children: message.role }), _jsx("p", { children: message.content })] }, index))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: e => setInput(e.target.value), onKeyDown: e => e.key === 'Enter' && !e.shiftKey && handleSend(), placeholder: "Type a message...", className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("button", { onClick: handleSend, className: "px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500", children: "Send" })] }), _jsxs("div", { className: "mt-4 space-x-2", children: [_jsx("button", { onClick: async () => {
                            await capturePreference('theme', 'dark');
                            alert('Preference captured!');
                        }, className: "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600", children: "Save Theme Preference" }), _jsx("button", { onClick: async () => {
                            const history = await getRecentHistory();
                            console.log('Recent history:', history);
                            alert(`Found ${history.length} recent messages`);
                        }, className: "px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600", children: "View Recent History" })] })] }));
}
/**
 * App with Memory Provider
 */
export function App() {
    return (_jsx(ErrorBoundary, { onError: (error) => console.error('Memory system error:', error), showReset: true, children: _jsx(MemoryProvider, { config: memoryConfig, vectorStore: vectorStore, embeddings: embeddings, autoStart: true, children: _jsx(ChatWithMemory, {}) }) }));
}
export default App;
//# sourceMappingURL=memory-system-basic.js.map