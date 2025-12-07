import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Advanced Memory System Example
 *
 * Demonstrates advanced features:
 * - Token optimization
 * - Memory compression
 * - Memory promotion
 * - Event listeners
 * - Custom memory queries
 */
import React from 'react';
import { MemoryProvider, useMemory, useMemoryQuery, useMemoryStats, useMemoryEvents, useTokenOptimization, } from '@clarity-chat/react/memory';
// Advanced configuration with compression
const memoryConfig = {
    tokenOptimization: {
        maxContextWindow: 8192,
        allocation: {
            systemPrompt: 0.12,
            userPreferences: 0.18,
            recentContext: 0.28,
            semanticMemory: 0.22,
            episodicMemory: 0.15,
            responseReserve: 0.05,
        },
        dynamicAllocation: true,
        enableCompression: true,
        compressionRatio: 0.5,
        enableChunking: true,
        chunkSize: 250,
        chunkOverlap: 75,
    },
    persistence: {
        useVectorStore: true,
        vectorStoreNamespace: 'advanced-memories',
        useCache: true,
        cacheTTL: 7200,
        useDatabase: true,
        databaseUrl: process.env.DATABASE_URL,
        batchSize: 50,
    },
    enableAutoSummarization: true,
    summarizationInterval: 180000, // 3 minutes
    enableAutoCleanup: true,
    cleanupInterval: 1800000, // 30 minutes
    retentionPolicy: {
        shortTerm: 1800,
        session: 43200,
        thread: 259200,
        global: 0,
    },
    debug: true,
};
/**
 * Memory Dashboard Component
 */
function MemoryDashboard() {
    const { stats, refresh } = useMemoryStats(5000); // Refresh every 5s
    const [events, setEvents] = React.useState([]);
    // Listen to memory events
    useMemoryEvents('memory:created', event => {
        setEvents(prev => [...prev.slice(-9), `Created: ${event.memory?.content.slice(0, 50)}...`]);
    });
    useMemoryEvents('memory:compressed', event => {
        setEvents(prev => [...prev.slice(-9), `Compressed: ${event.data?.compressionRatio.toFixed(2)}x`]);
    });
    useMemoryEvents('memory:promoted', event => {
        setEvents(prev => [...prev.slice(-9), `Promoted: ${event.data?.from} → ${event.data?.to}`]);
    });
    return (_jsxs("div", { className: "p-6 bg-white rounded-lg shadow-lg", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Memory Dashboard" }), _jsx("button", { onClick: refresh, className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600", children: "Refresh" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4 mb-6", children: [_jsxs("div", { className: "p-4 bg-blue-50 rounded", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total Memories" }), _jsx("p", { className: "text-3xl font-bold", children: stats.total })] }), _jsxs("div", { className: "p-4 bg-green-50 rounded", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total Tokens" }), _jsx("p", { className: "text-3xl font-bold", children: stats.totalTokens.toLocaleString() })] }), _jsxs("div", { className: "p-4 bg-purple-50 rounded", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Avg Confidence" }), _jsxs("p", { className: "text-3xl font-bold", children: [(stats.averageConfidence * 100).toFixed(0), "%"] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-2", children: "By Type" }), _jsx("div", { className: "space-y-1 text-sm", children: Object.entries(stats.byType).map(([type, count]) => (_jsxs("div", { className: "flex justify-between", children: [_jsxs("span", { className: "capitalize", children: [type, ":"] }), _jsx("span", { className: "font-semibold", children: count })] }, type))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-2", children: "By Scope" }), _jsx("div", { className: "space-y-1 text-sm", children: Object.entries(stats.byScope).map(([scope, count]) => (_jsxs("div", { className: "flex justify-between", children: [_jsxs("span", { className: "capitalize", children: [scope, ":"] }), _jsx("span", { className: "font-semibold", children: count })] }, scope))) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-2", children: "Recent Events" }), _jsx("div", { className: "space-y-1 text-sm max-h-40 overflow-y-auto", children: events.length === 0 ? (_jsx("p", { className: "text-gray-500", children: "No events yet" })) : (events.map((event, i) => (_jsx("p", { className: "text-gray-700", children: event }, i)))) })] })] }));
}
/**
 * Memory Query Component
 */
function MemoryQueryPanel() {
    const { addMemory, compressMemory, promoteMemory, deleteMemory } = useMemory();
    const [queryText, setQueryText] = React.useState('');
    const [selectedMemory, setSelectedMemory] = React.useState(null);
    // Query memories with the text
    const { data: results, isLoading, refetch } = useMemoryQuery({
        query: queryText,
        limit: 10,
        minConfidence: 0.5,
        tokenBudget: 1000,
    }, {
        enabled: queryText.length > 2,
    });
    const handleAddMemory = async () => {
        if (!queryText.trim())
            return;
        await addMemory(queryText, 'semantic', 'thread', { source: 'user-input' }, { priority: 'high', confidence: 0.9 });
        setQueryText('');
        refetch();
    };
    const handleCompress = async (memoryId) => {
        await compressMemory(memoryId, 0.5);
        refetch();
    };
    const handlePromote = async (memoryId) => {
        await promoteMemory(memoryId, 'global');
        refetch();
    };
    const handleDelete = async (memoryId) => {
        await deleteMemory(memoryId);
        setSelectedMemory(null);
        refetch();
    };
    return (_jsxs("div", { className: "p-6 bg-white rounded-lg shadow-lg", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Memory Query" }), _jsx("div", { className: "mb-4", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: queryText, onChange: e => setQueryText(e.target.value), placeholder: "Search memories or add new...", className: "flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("button", { onClick: handleAddMemory, className: "px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600", children: "Add" })] }) }), isLoading && _jsx("p", { className: "text-gray-500", children: "Searching..." }), _jsx("div", { className: "space-y-2", children: results.map(result => (_jsxs("div", { className: `p-4 border rounded cursor-pointer transition-colors ${selectedMemory === result.memory.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'}`, onClick: () => setSelectedMemory(result.memory.id), children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("div", { children: _jsxs("span", { className: "text-xs font-semibold text-gray-500 uppercase", children: [result.memory.type, " \u2022 ", result.memory.scope] }) }), _jsxs("span", { className: "text-sm font-semibold text-blue-600", children: [(result.relevance * 100).toFixed(0), "% match"] })] }), _jsx("p", { className: "text-sm mb-2", children: result.memory.content }), _jsxs("div", { className: "flex justify-between items-center text-xs text-gray-500", children: [_jsxs("span", { children: [result.memory.tokens, " tokens"] }), _jsxs("span", { children: [(result.memory.confidence * 100).toFixed(0), "% confidence"] })] }), selectedMemory === result.memory.id && (_jsxs("div", { className: "mt-3 flex gap-2", children: [_jsx("button", { onClick: e => {
                                        e.stopPropagation();
                                        handleCompress(result.memory.id);
                                    }, className: "px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600", children: "Compress" }), _jsx("button", { onClick: e => {
                                        e.stopPropagation();
                                        handlePromote(result.memory.id);
                                    }, className: "px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600", children: "Promote" }), _jsx("button", { onClick: e => {
                                        e.stopPropagation();
                                        handleDelete(result.memory.id);
                                    }, className: "px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600", children: "Delete" })] }))] }, result.memory.id))) })] }));
}
/**
 * Token Optimization Panel
 */
function TokenOptimizationPanel() {
    const [systemPrompt, setSystemPrompt] = React.useState('You are a helpful AI assistant.');
    const [messages, setMessages] = React.useState([
        'Hello, how are you?',
        'I need help with my code.',
        'Can you explain recursion?',
    ]);
    const { optimizedContext, isOptimizing, reoptimize } = useTokenOptimization({
        systemPrompt,
        userPreferences: { theme: 'dark', language: 'en' },
        recentMessages: messages,
        includeSemanticMemory: true,
        includeEpisodicMemory: true,
    });
    return (_jsxs("div", { className: "p-6 bg-white rounded-lg shadow-lg", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Token Optimization" }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-semibold mb-2", children: "System Prompt" }), _jsx("textarea", { value: systemPrompt, onChange: e => setSystemPrompt(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500", rows: 3 })] }), _jsx("button", { onClick: reoptimize, disabled: isOptimizing, className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 mb-4", children: isOptimizing ? 'Optimizing...' : 'Optimize Context' }), optimizedContext && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 bg-green-50 rounded", children: [_jsx("h3", { className: "font-semibold mb-2", children: "Optimization Stats" }), _jsxs("div", { className: "space-y-1 text-sm", children: [_jsxs("p", { children: ["Total Tokens: ", optimizedContext.stats.totalTokens] }), _jsxs("p", { children: ["Compression Ratio: ", optimizedContext.stats.compressionRatio.toFixed(2), "x"] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "font-semibold", children: "Allocation" }), _jsx("div", { className: "space-y-1 text-sm", children: Object.entries(optimizedContext.stats.allocation).map(([key, value]) => (_jsxs("div", { className: "flex justify-between", children: [_jsxs("span", { className: "capitalize", children: [key.replace(/([A-Z])/g, ' $1').trim(), ":"] }), _jsxs("span", { className: "font-semibold", children: [value, " tokens"] })] }, key))) })] })] }))] }));
}
/**
 * Main App
 */
export function App() {
    return (_jsx(MemoryProvider, { config: memoryConfig, autoStart: true, children: _jsxs("div", { className: "min-h-screen bg-gray-100 p-8", children: [_jsx("h1", { className: "text-4xl font-bold text-center mb-8", children: "Advanced Memory System" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(MemoryDashboard, {}), _jsx(MemoryQueryPanel, {})] }), _jsx("div", { className: "mt-6", children: _jsx(TokenOptimizationPanel, {}) })] }) }));
}
export default App;
//# sourceMappingURL=memory-system-advanced.js.map