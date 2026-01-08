'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef, useEffect } from 'react';
export default function QuickstartPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    const sendMessage = useCallback(async () => {
        if (!input.trim() || isLoading)
            return;
        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });
            if (!response.ok)
                throw new Error('Failed to send message');
            // Handle streaming response
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantContent = '';
            const assistantId = (Date.now() + 1).toString();
            // Add empty assistant message
            setMessages((prev) => [
                ...prev,
                { id: assistantId, role: 'assistant', content: '' },
            ]);
            while (reader) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]')
                            continue;
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.type === 'text-delta' && parsed.content) {
                                assistantContent += parsed.content;
                                setMessages((prev) => prev.map((m) => m.id === assistantId
                                    ? { ...m, content: assistantContent }
                                    : m));
                            }
                        }
                        catch {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error('Error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: 'Sorry, something went wrong. Please try again.',
                },
            ]);
        }
        finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages]);
    return (_jsxs("div", { className: "min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900", children: [_jsx("header", { className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3", children: _jsxs("div", { className: "max-w-3xl mx-auto flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: "Clarity Chat Quickstart" }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Working demo - add your API key for real AI" })] }), _jsx("span", { className: "px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full", children: "Demo Mode" })] }) }), _jsx("main", { className: "flex-1 overflow-y-auto", children: _jsxs("div", { className: "max-w-3xl mx-auto px-4 py-6 space-y-4", children: [messages.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-2", children: "Welcome to Clarity Chat!" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: "This example works immediately. Try sending a message!" }), _jsx("div", { className: "flex flex-wrap justify-center gap-2", children: ['Hello!', 'How do I add my API key?', 'What can you do?'].map((suggestion) => (_jsx("button", { onClick: () => setInput(suggestion), className: "px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", children: suggestion }, suggestion))) })] })), messages.map((message) => (_jsx("div", { className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[80%] rounded-2xl px-4 py-2 ${message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'}`, children: _jsx("div", { className: "whitespace-pre-wrap", children: message.content }) }) }, message.id))), isLoading && messages[messages.length - 1]?.role === 'user' && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2", children: _jsxs("div", { className: "flex space-x-1", children: [_jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce" }), _jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" }), _jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" })] }) }) })), _jsx("div", { ref: messagesEndRef })] }) }), _jsx("footer", { className: "bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3", children: _jsx("div", { className: "max-w-3xl mx-auto", children: _jsxs("form", { onSubmit: (e) => {
                            e.preventDefault();
                            sendMessage();
                        }, className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Type a message...", className: "flex-1 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500", disabled: isLoading }), _jsx("button", { type: "submit", disabled: isLoading || !input.trim(), className: "px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: "Send" })] }) }) })] }));
}
//# sourceMappingURL=page.js.map