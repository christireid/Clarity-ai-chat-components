'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Basic Chat Component
 *
 * The simplest possible AI chat implementation using @clarity-chat/react.
 * This example demonstrates:
 * - Using the useClarityChat hook from @clarity-chat/react
 * - Message rendering with proper styling
 * - Loading states and error handling
 * - Keyboard shortcuts (Enter to send, Shift+Enter for new line)
 *
 * Total: ~120 lines of code with full functionality
 */
import { useRef, useEffect, FormEvent, useCallback } from 'react';
import { useClarityChat } from '@clarity-chat/react';
// ============================================================================
// Main Component
// ============================================================================
export function BasicChat() {
    const { messages, setMessages, append, isLoading, error, input, setInput } = useClarityChat({
        api: '/api/chat',
    });
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    // Clear messages helper
    const clearMessages = useCallback(() => {
        setMessages([]);
    }, [setMessages]);
    // Send message helper
    const sendMessage = useCallback(async (content) => {
        await append({ role: 'user', content });
        setInput('');
    }, [append, setInput]);
    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    // Focus input after loading completes
    useEffect(() => {
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [isLoading]);
    // Form submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            sendMessage(input.trim());
        }
    };
    // Keyboard handler for textarea
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim() && !isLoading) {
                sendMessage(input.trim());
            }
        }
    };
    return (_jsxs("div", { className: "flex flex-col h-screen max-w-3xl mx-auto", children: [_jsxs("header", { className: "flex items-center justify-between p-4 border-b", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold", children: "Basic Chat" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Powered by @clarity-chat/react" })] }), messages.length > 0 && (_jsx("button", { onClick: clearMessages, className: "text-sm text-muted-foreground hover:text-foreground transition-colors", children: "Clear chat" }))] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", role: "log", "aria-label": "Chat messages", "aria-live": "polite", "data-chat-container": true, children: [messages.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center text-muted-foreground", children: [_jsx("svg", { className: "w-12 h-12 mb-4 opacity-50", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }), _jsx("p", { className: "text-lg", children: "Start a conversation" }), _jsx("p", { className: "text-sm", children: "Type a message below to begin" })] })) : (messages.map((message) => (_jsx("div", { className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[80%] p-4 rounded-2xl ${message.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-md'
                                : 'bg-muted rounded-bl-md'}`, children: [_jsx("p", { className: "whitespace-pre-wrap", children: typeof message.content === 'string'
                                        ? message.content
                                        : JSON.stringify(message.content) }), message.role === 'assistant' &&
                                    isLoading &&
                                    !message.content && (_jsxs("span", { className: "inline-flex gap-1", children: [_jsx("span", { className: "w-2 h-2 bg-current rounded-full animate-bounce", style: { animationDelay: '0ms' } }), _jsx("span", { className: "w-2 h-2 bg-current rounded-full animate-bounce", style: { animationDelay: '150ms' } }), _jsx("span", { className: "w-2 h-2 bg-current rounded-full animate-bounce", style: { animationDelay: '300ms' } })] })), message.role === 'assistant' &&
                                    isLoading &&
                                    message.content && (_jsx("span", { className: "inline-block w-2 h-4 ml-1 bg-current animate-blink", "aria-hidden": "true" }))] }) }, message.id)))), _jsx("div", { ref: messagesEndRef })] }), error && (_jsx("div", { className: "mx-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm", role: "alert", children: error.message })), _jsxs("form", { onSubmit: handleSubmit, className: "p-4 border-t", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("label", { htmlFor: "chat-input", className: "sr-only", children: "Type your message" }), _jsx("textarea", { id: "chat-input", ref: inputRef, value: input, onChange: (e) => setInput(e.target.value), onKeyDown: handleKeyDown, placeholder: "Type a message... (Enter to send)", disabled: isLoading, rows: 1, className: "flex-1 px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed" }), _jsx("button", { type: "submit", disabled: isLoading || !input.trim(), className: "px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: isLoading ? (_jsxs("svg", { className: "w-5 h-5 animate-spin", fill: "none", viewBox: "0 0 24 24", "aria-hidden": "true", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] })) : ('Send') })] }), _jsx("p", { className: "text-xs text-muted-foreground mt-2 text-center", children: "Press Enter to send, Shift+Enter for new line" })] })] }));
}
export default BasicChat;
//# sourceMappingURL=basic-chat.js.map