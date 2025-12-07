import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Clarity Memory - React Demo
 *
 * This demo shows how to use Clarity Memory in a React application
 * with hooks, providers, and the DevTools inspector.
 */
import React, { useState } from 'react';
import { MemoryProvider, useMemory, MemoryInspector } from '@clarity-chat/memory/react';
// ============================================
// Main App Component
// ============================================
function App() {
    return (_jsx(MemoryProvider, { config: {
            context: "demo-user",
            store: {
                type: 'indexeddb', // Persists in browser
            },
            tokenBudget: {
                maxTokens: 4000,
                reserveTokens: 500,
            },
        }, children: _jsx(ChatApp, {}) }));
}
// ============================================
// Chat App Component
// ============================================
function ChatApp() {
    const { memory, add, recall, stats } = useMemory();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [showInspector, setShowInspector] = useState(false);
    const handleSend = async () => {
        if (!input.trim())
            return;
        // Add user message
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        // Add to memory
        await add(input, { role: 'user' });
        // Recall relevant context
        const context = await recall(input, { includeSummary: true });
        // Simulate AI response (in real app, call your LLM API)
        const aiResponse = `I found ${context.memories.length} relevant memories. ${context.memories[0]?.content || 'No memories found.'}`;
        const assistantMessage = { role: 'assistant', content: aiResponse };
        setMessages(prev => [...prev, assistantMessage]);
        // Add AI response to memory
        await add(aiResponse, { role: 'assistant' });
        setInput('');
    };
    return (_jsxs("div", { style: { display: 'flex', height: '100vh' }, children: [_jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column' }, children: [_jsxs("div", { style: { padding: '20px', borderBottom: '1px solid #eee' }, children: [_jsx("h1", { children: "Chat with Memory" }), _jsxs("div", { children: [_jsx("strong", { children: "Stats:" }), " ", stats.totalMemories, " memories, ", stats.tokens, " tokens"] }), _jsxs("button", { onClick: () => setShowInspector(!showInspector), children: [showInspector ? 'Hide' : 'Show', " Memory Inspector"] })] }), _jsx("div", { style: { flex: 1, overflow: 'auto', padding: '20px' }, children: messages.map((msg, i) => (_jsxs("div", { style: {
                                marginBottom: '10px',
                                padding: '10px',
                                backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                                borderRadius: '8px',
                            }, children: [_jsxs("strong", { children: [msg.role, ":"] }), " ", msg.content] }, i))) }), _jsx("div", { style: { padding: '20px', borderTop: '1px solid #eee' }, children: _jsxs("div", { style: { display: 'flex', gap: '10px' }, children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSend(), placeholder: "Type a message...", style: { flex: 1, padding: '10px', fontSize: '16px' } }), _jsx("button", { onClick: handleSend, style: { padding: '10px 20px' }, children: "Send" })] }) })] }), showInspector && (_jsx("div", { style: { width: '400px', borderLeft: '1px solid #eee' }, children: _jsx(MemoryInspector, { memory: memory }) }))] }));
}
export default App;
//# sourceMappingURL=react-demo.js.map