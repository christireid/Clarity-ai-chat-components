import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Basic Memory System Example
 *
 * Demonstrates how to set up and use the AI Memory & Context system
 */
import React from 'react';
import { MemoryProvider, useMemory, useConversationMemory, } from '@clarity-chat/react/memory';
import { QdrantVectorStore } from '@clarity-chat/react/vector-stores';
import { OpenAIEmbeddings } from '@clarity-chat/react/embeddings';
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
 */
function ChatWithMemory() {
    const [messages, setMessages] = React.useState([]);
    const [input, setInput] = React.useState('');
    // Use conversation memory hook
    const { captureMessage, capturePreference, getRelevantMemories, getRecentHistory, context, } = useConversationMemory({
        userId: 'user-123',
        threadId: 'thread-456',
        sessionId: 'session-789',
        autoCapture: true,
    });
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
                        : 'bg-gray-100 mr-12'}`, children: [_jsx("p", { className: "font-semibold mb-1 capitalize", children: message.role }), _jsx("p", { children: message.content })] }, index))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: e => setInput(e.target.value), onKeyPress: e => e.key === 'Enter' && handleSend(), placeholder: "Type a message...", className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("button", { onClick: handleSend, className: "px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500", children: "Send" })] }), _jsxs("div", { className: "mt-4 space-x-2", children: [_jsx("button", { onClick: async () => {
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
    return (_jsx(MemoryProvider, { config: memoryConfig, vectorStore: vectorStore, embeddings: embeddings, autoStart: true, children: _jsx(ChatWithMemory, {}) }));
}
export default App;
//# sourceMappingURL=memory-system-basic.js.map