import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Chat Interface Component
 * Full-featured chat UI with message history and streaming support
 */
import { useState } from 'react';
export function ChatInterface({ onSendMessage, messages = [], isLoading = false, placeholder = 'Type your message...', className = '', }) {
    const [input, setInput] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading)
            return;
        await onSendMessage(input);
        setInput('');
    };
    return (_jsxs("div", { className: `flex flex-col h-full ${className}`, children: [_jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.map((message) => (_jsx("div", { className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-900'}`, children: message.content }) }, message.id))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-gray-200 rounded-lg px-4 py-2", children: _jsx("span", { className: "animate-pulse", children: "Thinking..." }) }) }))] }), _jsx("form", { onSubmit: handleSubmit, className: "border-t p-4", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: placeholder, disabled: isLoading, className: "flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("button", { type: "submit", disabled: isLoading || !input.trim(), className: "px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed", children: "Send" })] }) })] }));
}
//# sourceMappingURL=ChatInterface.js.map