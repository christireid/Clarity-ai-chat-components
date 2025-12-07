'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useCallback } from 'react';
import { ChatWindow } from '@clarity-chat/react';
export default function Home() {
    const [messages, setMessages] = useState([
        {
            id: '1',
            chatId: 'streaming-demo',
            role: 'assistant',
            content: 'Hello! I\'m your AI assistant with real-time streaming support. Try asking me something!',
            createdAt: new Date(Date.now() - 5000),
            updatedAt: new Date(Date.now() - 5000),
            status: 'sent',
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const abortControllerRef = useRef(null);
    if (typeof window === 'undefined') {
        return null;
    }
    const handleSendMessage = useCallback(async (content) => {
        // Create user message
        const userMessage = {
            id: Date.now().toString(),
            chatId: 'streaming-demo',
            role: 'user',
            content,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'sent',
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setIsStreaming(true);
        // Create streaming assistant message
        const assistantMessage = {
            id: (Date.now() + 1).toString(),
            chatId: 'streaming-demo',
            role: 'assistant',
            content: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'sending',
        };
        setMessages((prev) => [...prev, assistantMessage]);
        // Create abort controller for cancellation
        abortControllerRef.current = new AbortController();
        try {
            // Call streaming API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
                signal: abortControllerRef.current.signal,
            });
            if (!response.ok) {
                throw new Error('Failed to get response');
            }
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) {
                throw new Error('No reader available');
            }
            let accumulatedContent = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            break;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                accumulatedContent += parsed.content;
                                // Update message with new content
                                setMessages((prev) => prev.map((msg) => msg.id === assistantMessage.id
                                    ? { ...msg, content: accumulatedContent, status: 'sending' }
                                    : msg));
                            }
                        }
                        catch {
                            // Skip invalid JSON
                        }
                    }
                }
            }
            // Mark streaming as complete
            setMessages((prev) => prev.map((msg) => msg.id === assistantMessage.id
                ? { ...msg, status: 'sent', updatedAt: new Date() }
                : msg));
        }
        catch (error) {
            if (error.name === 'AbortError') {
                console.log('Request cancelled');
                // Remove incomplete message
                setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessage.id));
            }
            else {
                console.error('Error:', error);
                // Update message with error
                setMessages((prev) => prev.map((msg) => msg.id === assistantMessage.id
                    ? {
                        ...msg,
                        content: 'Sorry, I encountered an error. Please try again.',
                        status: 'error',
                        updatedAt: new Date(),
                    }
                    : msg));
            }
        }
        finally {
            setIsLoading(false);
            setIsStreaming(false);
            abortControllerRef.current = null;
        }
    }, [messages]);
    const handleCancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsStreaming(false);
            setIsLoading(false);
        }
    }, []);
    return (_jsxs("main", { style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
        }, children: [_jsxs("div", { style: {
                    width: '100%',
                    maxWidth: '900px',
                    marginBottom: '2rem',
                }, children: [_jsx("div", { style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.5rem',
                        }, children: _jsx("h1", { style: {
                                fontSize: '2rem',
                                fontWeight: 'bold',
                            }, children: "Streaming Chat Demo" }) }), _jsx("p", { style: {
                            color: 'var(--foreground)',
                            opacity: 0.7,
                            marginBottom: '0.5rem',
                        }, children: "Real-time AI responses with Server-Sent Events (SSE) streaming" }), isStreaming && (_jsxs("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '6px',
                        }, children: [_jsx("span", { style: { fontSize: '0.875rem' }, children: "\uD83D\uDD34 Streaming in progress..." }), _jsx("button", { onClick: handleCancel, style: {
                                    padding: '0.25rem 0.75rem',
                                    fontSize: '0.875rem',
                                    backgroundColor: 'white',
                                    border: '1px solid rgba(128, 128, 128, 0.3)',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }, children: "Stop" })] }))] }), _jsx("div", { style: {
                    width: '100%',
                    maxWidth: '900px',
                    height: '600px',
                    border: '1px solid rgba(128, 128, 128, 0.2)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                }, children: _jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: handleSendMessage }) })] }));
}
//# sourceMappingURL=page.js.map