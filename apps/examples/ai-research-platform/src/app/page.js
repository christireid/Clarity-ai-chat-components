'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { ChatWindow, ThemeProvider, themes, useMessageOperations, 
// useTokenOptimization, // TODO: Fix metrics structure
// TokenOptimizationDashboard, // TODO: Fix metrics structure
AgentRunFeed, ContextVisualizer, CitationCard, ConversationTimeline, MemoryInspector, AdvancedChatInput, CommandPalette, useStreamingSSE, } from '@clarity-chat/react';
import { ResearchAgent } from '@/components/ResearchAgent';
import { KnowledgeGraph } from '@/components/KnowledgeGraph';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Database, Zap, BarChart3, Network } from 'lucide-react';
export default function ResearchPlatform() {
    const [activeView, setActiveView] = useState('chat');
    const [researchTopic, setResearchTopic] = useState('');
    if (typeof window === 'undefined') {
        return null;
    }
    const { messages, addMessage, editMessage, regenerateMessage, branchConversation, } = useMessageOperations();
    // const {
    //   metrics,
    //   enableOptimization,
    //   disableOptimization,
    // } = useTokenOptimization({
    //   enabled: true,
    //   trackMetrics: true,
    // })
    const { streamMessage, isStreaming } = useStreamingSSE({
        url: '/api/research',
        onMessage: (content) => {
            // Handle streaming responses
        },
    });
    const handleResearch = useCallback(async (query) => {
        setResearchTopic(query);
        // Add user message
        addMessage({
            id: `user-${Date.now()}`,
            role: 'user',
            content: query,
            timestamp: new Date(),
        });
        // Stream research response
        await streamMessage({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query,
                agents: ['researcher', 'analyst', 'writer'],
                enableRAG: true,
                includeCitations: true,
            }),
        });
    }, [addMessage, streamMessage]);
    return (_jsx(ThemeProvider, { theme: themes.ocean, children: _jsxs("div", { className: "h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900", children: [_jsx("header", { className: "border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg", children: _jsx(Brain, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "AI Research Platform" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Multi-Agent RAG System with Knowledge Visualization" })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { onClick: () => setActiveView('chat'), className: `px-4 py-2 rounded-lg transition-all ${activeView === 'chat'
                                                ? 'bg-blue-500 text-white shadow-lg'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`, children: [_jsx(BookOpen, { className: "w-4 h-4 inline mr-2" }), "Chat"] }), _jsxs("button", { onClick: () => setActiveView('dashboard'), className: `px-4 py-2 rounded-lg transition-all ${activeView === 'dashboard'
                                                ? 'bg-blue-500 text-white shadow-lg'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`, children: [_jsx(BarChart3, { className: "w-4 h-4 inline mr-2" }), "Dashboard"] }), _jsxs("button", { onClick: () => setActiveView('knowledge'), className: `px-4 py-2 rounded-lg transition-all ${activeView === 'knowledge'
                                                ? 'bg-blue-500 text-white shadow-lg'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`, children: [_jsx(Network, { className: "w-4 h-4 inline mr-2" }), "Knowledge Graph"] })] })] }) }) }), _jsxs("div", { className: "flex-1 overflow-hidden", children: [activeView === 'chat' && (_jsxs("div", { className: "h-full flex", children: [_jsx("aside", { className: "w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto", children: _jsxs("div", { className: "p-4 space-y-4", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4", children: [_jsxs("h3", { className: "font-semibold mb-3 flex items-center", children: [_jsx(Zap, { className: "w-4 h-4 mr-2 text-purple-600" }), "Active Agents"] }), _jsx(ResearchAgent, { name: "Researcher", status: "active", progress: 65 }), _jsx(ResearchAgent, { name: "Analyst", status: "thinking", progress: 40 }), _jsx(ResearchAgent, { name: "Writer", status: "idle", progress: 0 })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, children: _jsx(ContextVisualizer, { context: {
                                                        documents: 12,
                                                        chunks: 245,
                                                        embeddings: 1024,
                                                        relevance: 0.87,
                                                    } }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, children: _jsx(ConversationTimeline, { messages: messages, onSelectMessage: (msg) => {
                                                        // Handle message selection
                                                    } }) })] }) }), _jsxs("main", { className: "flex-1 flex flex-col", children: [_jsx("div", { className: "flex-1 overflow-y-auto p-6", children: _jsx(ChatWindow, { messages: messages, onSendMessage: handleResearch, renderMessage: (message) => {
                                                    // Enhanced message rendering with citations
                                                    if (message.role === 'assistant' && message.citations) {
                                                        return (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { children: message.content }), _jsx("div", { className: "flex flex-wrap gap-2", children: message.citations.map((citation, idx) => (_jsx(CitationCard, { citation: citation, compact: true }, idx))) })] }));
                                                    }
                                                    return _jsx("div", { children: message.content });
                                                }, showTypingIndicator: isStreaming }) }), _jsx("div", { className: "border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900", children: _jsx(AdvancedChatInput, { onSend: handleResearch, placeholder: "Ask a research question or upload documents...", enableVoice: true, enableFileUpload: true, suggestions: [
                                                    'Compare quantum computing architectures',
                                                    'Analyze recent AI safety research',
                                                    'Summarize climate change mitigation strategies',
                                                ] }) })] }), _jsx("aside", { className: "w-96 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto", children: _jsxs("div", { className: "p-4", children: [_jsxs("h3", { className: "font-semibold mb-4 flex items-center", children: [_jsx(Database, { className: "w-4 h-4 mr-2" }), "Agent Activity Feed"] }), _jsx(AgentRunFeed, { runs: [
                                                    {
                                                        id: '1',
                                                        agent: 'Researcher',
                                                        action: 'Searching academic databases',
                                                        status: 'running',
                                                        timestamp: new Date(),
                                                    },
                                                    {
                                                        id: '2',
                                                        agent: 'Analyst',
                                                        action: 'Extracting key insights',
                                                        status: 'completed',
                                                        timestamp: new Date(Date.now() - 5000),
                                                    },
                                                ] }), _jsx("div", { className: "mt-6", children: _jsx(MemoryInspector, { memories: [
                                                        { type: 'fact', content: 'Quantum supremacy achieved in 2019', confidence: 0.95 },
                                                        { type: 'concept', content: 'RAG improves accuracy by 40%', confidence: 0.88 },
                                                    ] }) })] }) })] })), activeView === 'dashboard' && (_jsx("div", { className: "h-full p-6 flex items-center justify-center", children: _jsx("p", { className: "text-gray-500", children: "Dashboard view - Coming soon" }) })
                        // <ResearchDashboard
                        //   messages={messages}
                        //   metrics={metrics}
                        //   researchTopic={researchTopic}
                        // />
                        ), activeView === 'knowledge' && (_jsx("div", { className: "h-full p-6", children: _jsx(KnowledgeGraph, { nodes: [
                                    { id: '1', label: 'Quantum Computing', type: 'concept' },
                                    { id: '2', label: 'Superposition', type: 'concept' },
                                    { id: '3', label: 'Entanglement', type: 'concept' },
                                ], edges: [
                                    { source: '1', target: '2', strength: 0.9 },
                                    { source: '3', target: '2', strength: 0.8 },
                                ] }) }))] }), _jsx(CommandPalette, { commands: [
                        { id: 'new-research', label: 'New Research Topic', action: () => { } },
                        { id: 'export', label: 'Export Findings', action: () => { } },
                        { id: 'settings', label: 'Settings', action: () => { } },
                    ] })] }) }));
}
//# sourceMappingURL=page.js.map