import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * React Example
 *
 * Example usage of Clarity Memory in a React component
 */
// @ts-expect-error - React is used in JSX
import React, { useState } from 'react';
import { useMemory } from '../react/use-memory';
import { MemoryInspector } from '../react/memory-inspector';
export function ChatApp() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    // @ts-expect-error - Example code uses partial config for demonstration
    const memoryHook = useMemory({
        storage: { type: 'indexeddb' },
    });
    const { add, recall, context, initialized, loading, error, memory } = memoryHook;
    const handleSend = async () => {
        if (!message.trim() || !initialized)
            return;
        try {
            // Add user message to memory
            await add(message, {
                type: 'episodic',
                scope: 'session',
                importance: 0.7,
            });
            // Recall relevant memories (for context building)
            await recall(message, { limit: 5 });
            // Get optimized context
            const ctx = await context({ maxTokens: 2000 });
            // Simulate LLM response (in real app, call your LLM API)
            const response = `Based on context: ${ctx.formatted?.slice(0, 100)}...`;
            // Add assistant response to memory
            await add(response, {
                type: 'episodic',
                scope: 'session',
                importance: 0.6,
            });
            setMessages(prev => [
                ...prev,
                { role: 'user', content: message },
                { role: 'assistant', content: response },
            ]);
            setMessage('');
        }
        catch (err) {
            console.error('Error:', err);
        }
    };
    if (loading) {
        return _jsx("div", { children: "Initializing memory..." });
    }
    if (error) {
        return _jsxs("div", { children: ["Error: ", error.message] });
    }
    return (_jsxs("div", { style: { display: 'flex', gap: '20px', padding: '20px' }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsx("h2", { children: "Chat" }), _jsx("div", { style: { border: '1px solid #ddd', padding: '10px', minHeight: '400px', marginBottom: '10px' }, children: messages.map((msg, idx) => (_jsxs("div", { style: { marginBottom: '10px' }, children: [_jsxs("strong", { children: [msg.role, ":"] }), " ", msg.content] }, idx))) }), _jsxs("div", { style: { display: 'flex', gap: '10px' }, children: [_jsx("input", { type: "text", value: message, onChange: (e) => setMessage(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSend(), placeholder: "Type a message...", style: { flex: 1, padding: '8px' } }), _jsx("button", { onClick: handleSend, disabled: !initialized, children: "Send" })] })] }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("h2", { children: "Memory Inspector" }), initialized && memory && _jsx(MemoryInspector, { memory: memory })] })] }));
}
//# sourceMappingURL=react-example.js.map