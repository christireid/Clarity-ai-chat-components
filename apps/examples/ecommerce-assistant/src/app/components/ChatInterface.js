'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { Send } from 'lucide-react';
export function ChatInterface({ onProductsRecommended }) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            id: '1',
            role: 'assistant',
            content: 'Welcome to ShopBot! I can help you find the perfect product. What are you looking for today?',
            timestamp: Date.now(),
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    // Wrapped in useCallback for performance
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading)
            return;
        const userMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: input,
            timestamp: Date.now(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        try {
            // Simulate API call (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 500));
            const assistantMessage = {
                id: `msg-${Date.now()}-assistant`,
                role: 'assistant',
                content: 'I can help you find the perfect product! What are you looking for today?',
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, assistantMessage]);
            // Example: trigger product recommendations
            // onProductsRecommended(['prod-1', 'prod-2'])
        }
        catch (error) {
            console.error('Chat error:', error);
        }
        finally {
            setIsLoading(false);
        }
    }, [input, isLoading, onProductsRecommended]);
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-md h-[600px] flex flex-col", children: [_jsx("div", { className: "p-4 border-b", children: _jsx("h2", { className: "text-lg font-semibold", children: "Chat with ShopBot" }) }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.map((message) => (_jsx("div", { className: `p-3 rounded-lg ${message.role === 'user'
                            ? 'bg-purple-100 ml-auto max-w-[80%]'
                            : 'bg-gray-100 mr-auto max-w-[80%]'}`, children: message.content }, message.id))), isLoading && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [_jsx("div", { className: "w-2 h-2 bg-purple-500 rounded-full animate-bounce" }), _jsx("div", { className: "w-2 h-2 bg-purple-500 rounded-full animate-bounce", style: { animationDelay: '0.1s' } }), _jsx("div", { className: "w-2 h-2 bg-purple-500 rounded-full animate-bounce", style: { animationDelay: '0.2s' } })] }))] }), _jsx("form", { onSubmit: handleSubmit, className: "p-4 border-t", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Ask me anything...", className: "flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" }), _jsx("button", { type: "submit", disabled: isLoading || !input.trim(), className: "px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", "aria-label": "Send message", children: _jsx(Send, { className: "w-5 h-5" }) })] }) })] }));
}
//# sourceMappingURL=ChatInterface.js.map