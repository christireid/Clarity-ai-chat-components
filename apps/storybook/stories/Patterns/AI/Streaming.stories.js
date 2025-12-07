import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChatWindow, ChatInput, Message, ThinkingIndicator } from '@clarity-chat/react';
import { StatusBadge } from '../../../.storybook/blocks';
import { useState, useRef } from 'react';
const meta = {
    title: 'Patterns/AI/Streaming Responses',
    parameters: {
        docs: {
            description: {
                component: `
# Streaming Responses Pattern

Learn how to implement streaming AI responses for better user experience. This pattern demonstrates progressive text rendering as tokens arrive.

## Problem

Users must wait for the entire AI response to complete before seeing any output. For long responses (30+ seconds), this creates a poor experience.

## Solution

Stream tokens as they're generated and render them progressively:
1. Start rendering immediately upon first token
2. Show typing indicator before streaming starts
3. Allow cancellation mid-stream
4. Handle network errors gracefully
5. Maintain message integrity on completion

## Key Benefits

- **Better UX** - Users see progress immediately
- **Perceived Performance** - Feels 3-5x faster
- **Cancellation** - Stop unwanted responses
- **Error Recovery** - Graceful failure handling
- **Lower Latency** - First token in ~200ms vs full response in 30s

## Implementation Approaches

1. **Server-Sent Events (SSE)** - Simple, one-way streaming
2. **WebSockets** - Bidirectional, real-time
3. **ReadableStream** - Fetch API streaming
4. **Custom Protocol** - Advanced use cases
        `,
            },
        },
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};
export default meta;
// Simulated streaming function
const simulateStreamingResponse = (message, onToken, onComplete, onError, signal) => {
    const response = generateResponse(message);
    const words = response.split(' ');
    let currentIndex = 0;
    const streamInterval = setInterval(() => {
        if (signal?.aborted) {
            clearInterval(streamInterval);
            onComplete();
            return;
        }
        if (currentIndex >= words.length) {
            clearInterval(streamInterval);
            onComplete();
            return;
        }
        // Simulate occasional errors (5% chance)
        if (Math.random() < 0.05 && currentIndex > words.length / 2) {
            clearInterval(streamInterval);
            onError(new Error('Network connection lost'));
            return;
        }
        const token = (currentIndex === 0 ? '' : ' ') + words[currentIndex];
        onToken(token);
        currentIndex++;
    }, 50 + Math.random() * 100); // Variable token timing
};
const generateResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('explain') && lowerMessage.includes('streaming')) {
        return 'Streaming responses work by sending text tokens as they are generated, rather than waiting for the complete response. This is achieved through Server-Sent Events (SSE) or WebSocket connections. The key benefit is improved perceived performance - users see progress immediately instead of staring at a loading indicator. Implementation involves maintaining a persistent connection, handling partial text updates, and gracefully managing connection errors or cancellations.';
    }
    if (lowerMessage.includes('code') || lowerMessage.includes('example')) {
        return 'Here is a basic implementation of streaming in React: First, establish a connection to your streaming endpoint using fetch with a ReadableStream. Then, create a reader from the response body and process chunks as they arrive. Update your UI state with each token, building up the complete message progressively. Make sure to handle cleanup properly to avoid memory leaks, and provide a way for users to cancel the stream if needed.';
    }
    return 'I understand you are asking about "' + message + '". Streaming responses provide a better user experience by showing progress in real-time. Instead of waiting 30 seconds for a complete answer, users see text appearing word by word, similar to how humans type. This makes the interaction feel more natural and responsive. The technical implementation uses protocols like Server-Sent Events or WebSockets to maintain a connection and transmit data progressively.';
};
export const BasicStreaming = {
    render: () => {
        const [messages, setMessages] = useState([
            {
                id: '1',
                role: 'assistant',
                content: 'Hello! Ask me anything and watch my response stream in real-time.',
                timestamp: new Date(Date.now() - 60000),
            },
        ]);
        const [input, setInput] = useState('');
        const [isStreaming, setIsStreaming] = useState(false);
        const abortControllerRef = useRef(null);
        const handleSubmit = () => {
            if (!input.trim() || isStreaming)
                return;
            // Add user message
            const userMessage = {
                id: Date.now().toString(),
                role: 'user',
                content: input,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMessage]);
            setInput('');
            // Create assistant message placeholder
            const assistantMessageId = (Date.now() + 1).toString();
            const assistantMessage = {
                id: assistantMessageId,
                role: 'assistant',
                content: '',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
            // Start streaming
            setIsStreaming(true);
            abortControllerRef.current = new AbortController();
            simulateStreamingResponse(input, 
            // On token received
            (token) => {
                setMessages((prev) => prev.map((msg) => msg.id === assistantMessageId
                    ? { ...msg, content: msg.content + token }
                    : msg));
            }, 
            // On complete
            () => {
                setIsStreaming(false);
                abortControllerRef.current = null;
            }, 
            // On error
            (error) => {
                setIsStreaming(false);
                setMessages((prev) => prev.map((msg) => msg.id === assistantMessageId
                    ? { ...msg, content: msg.content + '\n\n[Error: ' + error.message + ']' }
                    : msg));
                abortControllerRef.current = null;
            }, abortControllerRef.current.signal);
        };
        const handleCancel = () => {
            abortControllerRef.current?.abort();
            setIsStreaming(false);
        };
        return (_jsxs("div", { className: "p-8 max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Basic Streaming" }), _jsx(StatusBadge, { status: "stable" })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Watch responses stream in real-time as tokens are generated. Notice how text appears progressively." })] }), _jsx("div", { className: "bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden", children: _jsx(ChatWindow, { className: "h-[600px]", children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-4", children: [messages.map((message) => (_jsx(Message, { message: message }, message.id))), isStreaming && messages[messages.length - 1]?.content === '' && (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-medium", children: "AI" }), _jsx(ThinkingIndicator, {})] }))] }), _jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 p-4", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "flex-1", children: _jsx(ChatInput, { value: input, onChange: (e) => setInput(e.target.value), onSubmit: handleSubmit, placeholder: "Ask a question to see streaming...", disabled: isStreaming }) }), isStreaming && (_jsx("button", { onClick: handleCancel, className: "px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium", children: "Cancel" }))] }) })] }) }) }), _jsxs("div", { className: "mt-8 grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "Try These Questions" }), _jsxs("ul", { className: "space-y-2 text-sm", children: [_jsx("li", { children: "\"Explain how streaming works\"" }), _jsx("li", { children: "\"Show me a code example\"" }), _jsx("li", { children: "\"What are the benefits of streaming?\"" }), _jsx("li", { children: "\"How do I handle errors?\"" })] })] }), _jsxs("div", { className: "p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "Features Demonstrated" }), _jsxs("ul", { className: "space-y-2 text-sm", children: [_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-green-500 font-bold", children: "\u2713" }), _jsx("span", { children: "Progressive text rendering" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-green-500 font-bold", children: "\u2713" }), _jsx("span", { children: "Cancellation support" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-green-500 font-bold", children: "\u2713" }), _jsx("span", { children: "Error handling" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-green-500 font-bold", children: "\u2713" }), _jsx("span", { children: "Typing indicators" })] })] })] })] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Basic streaming implementation with token-by-token rendering and cancellation support.',
            },
        },
    },
};
export const WithRetryAndRegenerate = {
    render: () => {
        const [messages, setMessages] = useState([
            {
                id: '1',
                role: 'assistant',
                content: 'I can help you with streaming responses. Try asking a question, and you can regenerate responses if needed.',
                timestamp: new Date(Date.now() - 120000),
            },
        ]);
        const [input, setInput] = useState('');
        const [isStreaming, setIsStreaming] = useState(false);
        const abortControllerRef = useRef(null);
        const [streamStats, setStreamStats] = useState({ tokensReceived: 0, duration: 0 });
        const startStreaming = (userInput) => {
            const assistantMessageId = Date.now().toString();
            const startTime = Date.now();
            let tokenCount = 0;
            const assistantMessage = {
                id: assistantMessageId,
                role: 'assistant',
                content: '',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
            setIsStreaming(true);
            setStreamStats({ tokensReceived: 0, duration: 0 });
            abortControllerRef.current = new AbortController();
            simulateStreamingResponse(userInput, (token) => {
                tokenCount++;
                setMessages((prev) => prev.map((msg) => msg.id === assistantMessageId
                    ? { ...msg, content: msg.content + token }
                    : msg));
                setStreamStats({
                    tokensReceived: tokenCount,
                    duration: Math.round((Date.now() - startTime) / 1000),
                });
            }, () => {
                setIsStreaming(false);
                abortControllerRef.current = null;
            }, (error) => {
                setIsStreaming(false);
                setMessages((prev) => prev.map((msg) => msg.id === assistantMessageId
                    ? { ...msg, content: msg.content + '\n\n[Error: ' + error.message + ' - Click Retry to try again]' }
                    : msg));
                abortControllerRef.current = null;
            }, abortControllerRef.current.signal);
        };
        const handleSubmit = () => {
            if (!input.trim() || isStreaming)
                return;
            const userMessage = {
                id: Date.now().toString(),
                role: 'user',
                content: input,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMessage]);
            const currentInput = input;
            setInput('');
            startStreaming(currentInput);
        };
        const handleRegenerate = (messageId) => {
            const messageIndex = messages.findIndex((m) => m.id === messageId);
            if (messageIndex === -1 || messageIndex === 0)
                return;
            const previousUserMessage = messages[messageIndex - 1];
            if (previousUserMessage.role !== 'user')
                return;
            // Remove the assistant message and regenerate
            setMessages((prev) => prev.slice(0, messageIndex));
            startStreaming(previousUserMessage.content);
        };
        const handleCancel = () => {
            abortControllerRef.current?.abort();
            setIsStreaming(false);
        };
        return (_jsxs("div", { className: "p-8 max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "With Retry & Regenerate" }), _jsx(StatusBadge, { status: "stable" })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Advanced streaming with regeneration support and streaming statistics. Hover over responses to regenerate." })] }), _jsx("div", { className: "bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden", children: _jsx(ChatWindow, { className: "h-[600px]", children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-4", children: [messages.map((message, index) => (_jsxs("div", { className: "group relative", children: [_jsx(Message, { message: message }), message.role === 'assistant' && index > 0 && (_jsx("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity", children: _jsx("button", { onClick: () => handleRegenerate(message.id), disabled: isStreaming, className: "px-3 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50", children: "Regenerate" }) }))] }, message.id))), isStreaming && messages[messages.length - 1]?.content === '' && (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-medium", children: "AI" }), _jsx(ThinkingIndicator, {})] }))] }), _jsxs("div", { className: "border-t border-gray-200 dark:border-gray-700 p-4 space-y-2", children: [isStreaming && (_jsxs("div", { className: "flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 px-2", children: [_jsxs("span", { children: ["Streaming... ", streamStats.tokensReceived, " tokens in ", streamStats.duration, "s"] }), _jsxs("span", { className: "text-xs", children: ["~", streamStats.duration > 0 ? Math.round(streamStats.tokensReceived / streamStats.duration) : 0, " tokens/sec"] })] })), _jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "flex-1", children: _jsx(ChatInput, { value: input, onChange: (e) => setInput(e.target.value), onSubmit: handleSubmit, placeholder: "Type a message...", disabled: isStreaming }) }), isStreaming && (_jsx("button", { onClick: handleCancel, className: "px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium", children: "Cancel" }))] })] })] }) }) }), _jsxs("div", { className: "mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "Implementation Notes" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { className: "block mb-2", children: "Streaming Stats" }), _jsxs("ul", { className: "space-y-1 text-gray-600 dark:text-gray-400", children: [_jsx("li", { children: "\u2022 Track tokens received" }), _jsx("li", { children: "\u2022 Measure streaming duration" }), _jsx("li", { children: "\u2022 Calculate throughput" }), _jsx("li", { children: "\u2022 Display to users" })] })] }), _jsxs("div", { children: [_jsx("strong", { className: "block mb-2", children: "Regeneration" }), _jsxs("ul", { className: "space-y-1 text-gray-600 dark:text-gray-400", children: [_jsx("li", { children: "\u2022 Remove previous response" }), _jsx("li", { children: "\u2022 Replay user message" }), _jsx("li", { children: "\u2022 Start new stream" }), _jsx("li", { children: "\u2022 Maintain conversation flow" })] })] })] })] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Advanced streaming with response regeneration and real-time statistics.',
            },
        },
    },
};
//# sourceMappingURL=Streaming.stories.js.map