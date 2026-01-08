'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback, useId, FormEvent, } from 'react';
import { Send, Loader2, Bot, User, Sparkles } from 'lucide-react';
// =============================================================================
// Custom Hook: useStreamingChat
// =============================================================================
/**
 * Custom hook for managing streaming chat state and API communication.
 *
 * In a production app, you would use @clarity-chat/react's useChat hook
 * or integrate with your preferred AI SDK. This demo shows the pattern.
 */
function useStreamingChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const sendMessage = useCallback(async (content) => {
        if (!content.trim() || isLoading)
            return;
        setError(null);
        setIsLoading(true);
        // Add user message
        const userMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: content.trim(),
            timestamp: Date.now(),
        };
        // Add assistant message placeholder
        const assistantId = `assistant-${Date.now()}`;
        const assistantMessage = {
            id: assistantId,
            role: 'assistant',
            content: '',
            timestamp: Date.now(),
            isStreaming: true,
        };
        setMessages((prev) => [...prev, userMessage, assistantMessage]);
        setInput('');
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
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            if (!response.body) {
                throw new Error('No response body');
            }
            // Read streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let streamedContent = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                const chunk = decoder.decode(value, { stream: true });
                streamedContent += chunk;
                // Update message with streamed content
                setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: streamedContent } : m));
            }
            // Mark streaming as complete
            setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, isStreaming: false } : m));
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
            // Remove the empty assistant message on error
            setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        }
        finally {
            setIsLoading(false);
        }
    }, [messages, isLoading]);
    const clearMessages = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);
    return {
        messages,
        input,
        setInput,
        isLoading,
        error,
        sendMessage,
        clearMessages,
    };
}
// =============================================================================
// Components
// =============================================================================
/**
 * Chat message component with role-based styling
 */
function ChatMessage({ message }) {
    const isUser = message.role === 'user';
    return (_jsxs("div", { className: `flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`, role: "article", "aria-label": `${message.role} message`, children: [_jsx("div", { className: `flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'}`, "aria-hidden": "true", children: isUser ? _jsx(User, { className: "w-4 h-4" }) : _jsx(Bot, { className: "w-4 h-4" }) }), _jsxs("div", { className: `max-w-[80%] px-4 py-3 rounded-2xl ${isUser
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-secondary text-secondary-foreground rounded-tl-sm'}`, children: [_jsx("p", { className: "whitespace-pre-wrap break-words", children: message.content }), message.isStreaming && (_jsxs("span", { className: "inline-flex items-center gap-1 mt-2 text-xs opacity-70", children: [_jsx("span", { className: "w-1.5 h-1.5 bg-current rounded-full typing-dot" }), _jsx("span", { className: "w-1.5 h-1.5 bg-current rounded-full typing-dot" }), _jsx("span", { className: "w-1.5 h-1.5 bg-current rounded-full typing-dot" }), _jsx("span", { className: "sr-only", children: "Typing..." })] }))] })] }));
}
/**
 * Empty state when no messages exist
 */
function EmptyState() {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center px-4", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4", children: _jsx(Sparkles, { className: "w-8 h-8 text-primary", "aria-hidden": "true" }) }), _jsx("h2", { className: "text-xl font-semibold mb-2", children: "Start a conversation" }), _jsx("p", { className: "text-muted-foreground max-w-md", children: "Type a message below to begin chatting with the AI assistant. Your messages will appear here in real-time." })] }));
}
/**
 * Error display component
 */
function ErrorDisplay({ error, onRetry, }) {
    return (_jsxs("div", { role: "alert", className: "mx-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg", children: [_jsx("p", { className: "text-destructive font-medium mb-2", children: "Error sending message" }), _jsx("p", { className: "text-sm text-muted-foreground mb-3", children: error.message }), _jsx("button", { onClick: onRetry, className: "text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded", children: "Try again" })] }));
}
/**
 * Chat input with accessibility support
 */
function ChatInput({ value, onChange, onSubmit, isLoading, }) {
    const inputId = useId();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim() && !isLoading) {
            onSubmit();
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "relative", children: [_jsx("label", { htmlFor: inputId, className: "sr-only", children: "Message input" }), _jsx("input", { id: inputId, type: "text", value: value, onChange: (e) => onChange(e.target.value), placeholder: "Type your message...", disabled: isLoading, className: "w-full px-4 py-3 pr-12 bg-secondary text-secondary-foreground rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed", "aria-describedby": `${inputId}-hint` }), _jsx("p", { id: `${inputId}-hint`, className: "sr-only", children: "Press Enter to send your message" }), _jsx("button", { type: "submit", disabled: !value.trim() || isLoading, "aria-label": isLoading ? 'Sending message...' : 'Send message', className: "absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-ring", children: isLoading ? (_jsx(Loader2, { className: "w-5 h-5 animate-spin", "aria-hidden": "true" })) : (_jsx(Send, { className: "w-5 h-5", "aria-hidden": "true" })) })] }));
}
// =============================================================================
// Main Page
// =============================================================================
export default function StreamingChatPage() {
    const { messages, input, setInput, isLoading, error, sendMessage, clearMessages, } = useStreamingChat();
    const messagesEndRef = useRef(null);
    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    return (_jsxs("div", { className: "flex flex-col h-screen", children: [_jsx("header", { className: "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", children: _jsxs("div", { className: "container flex h-14 items-center justify-between px-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Bot, { className: "w-6 h-6 text-primary", "aria-hidden": "true" }), _jsx("h1", { className: "text-lg font-semibold", children: "Streaming Chat" })] }), messages.length > 0 && (_jsx("button", { onClick: clearMessages, className: "text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1", children: "Clear chat" }))] }) }), _jsx("main", { className: "flex-1 overflow-y-auto chat-scroll", children: _jsx("div", { className: "max-w-3xl mx-auto p-4 space-y-4 min-h-full", children: messages.length === 0 ? (_jsx(EmptyState, {})) : (_jsxs(_Fragment, { children: [messages.map((message) => (_jsx(ChatMessage, { message: message }, message.id))), error && (_jsx(ErrorDisplay, { error: error, onRetry: () => messages.length > 0 &&
                                    sendMessage(messages[messages.length - 1].content) })), _jsx("div", { ref: messagesEndRef, "aria-hidden": "true" })] })) }) }), _jsx("footer", { className: "border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4", children: _jsxs("div", { className: "max-w-3xl mx-auto", children: [_jsx(ChatInput, { value: input, onChange: setInput, onSubmit: () => sendMessage(input), isLoading: isLoading }), _jsxs("p", { className: "text-xs text-muted-foreground text-center mt-2", children: ["Powered by ", _jsx("span", { className: "font-medium", children: "Clarity Chat" })] })] }) }), _jsx("div", { role: "status", "aria-live": "polite", "aria-atomic": "true", className: "sr-only", children: isLoading ? 'AI is responding...' : '' })] }));
}
//# sourceMappingURL=page.js.map