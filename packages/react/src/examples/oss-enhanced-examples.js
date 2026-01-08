import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * OSS-Enhanced Examples
 *
 * These examples demonstrate the new components powered by MIT-licensed
 * open-source packages:
 * - ResizableChatLayout (react-resizable-panels)
 * - TanStackMessageList (@tanstack/react-virtual)
 * - ClarityToaster/toast (sonner)
 * - FlowTokenStreamingText (flowtoken - optional)
 * - Sanitization (isomorphic-dompurify)
 */
import * as React from 'react';
import '@clarity-chat/react/styles.css';
import { ResizableChatLayout, TanStackMessageList, AutoTanStackMessageList, ClarityToaster, toast, FlowTokenStreamingText, useFlowToken, useClarityChat, ChatInput, } from '../public-api';
// ============================================================================
// Example 1: Resizable Chat Layout (20 lines)
// ============================================================================
/**
 * Chat with resizable sidebar using react-resizable-panels
 */
export function ResizableChatExample() {
    const chat = useClarityChat({ api: '/api/chat' });
    return (_jsx(ResizableChatLayout, { sidebar: _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "font-semibold", children: "Conversations" }), _jsxs("div", { className: "mt-2 space-y-1", children: [_jsx("div", { className: "p-2 rounded hover:bg-muted cursor-pointer", children: "Chat 1" }), _jsx("div", { className: "p-2 rounded hover:bg-muted cursor-pointer", children: "Chat 2" })] })] }), header: _jsx("div", { className: "p-3 font-semibold", children: "AI Assistant" }), footer: _jsx(ChatInput, { onSubmit: (msg) => chat.append({ role: 'user', content: msg }) }), defaultSidebarSize: 25, collapsible: true, persistLayout: true, children: _jsx("div", { className: "p-4", children: chat.messages.map((msg) => (_jsx("div", { className: "mb-2", children: String(msg.content) }, msg.id))) }) }));
}
// ============================================================================
// Example 2: TanStack Virtual Message List (25 lines)
// ============================================================================
/**
 * High-performance virtualized message list for long conversations
 */
export function VirtualizedChatExample() {
    const [messages] = React.useState(() => Array.from({ length: 500 }, (_, i) => ({
        id: `msg-${i}`,
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `Message ${i + 1}: This is a sample message for testing virtualization.`,
        createdAt: new Date(),
    })));
    return (_jsx("div", { className: "h-[500px]", children: _jsx(TanStackMessageList, { messages: messages, renderMessage: (message) => (_jsx("div", { className: `p-3 rounded-lg mb-2 ${message.role === 'assistant'
                    ? 'bg-muted ml-4'
                    : 'bg-primary text-primary-foreground mr-4'}`, children: message.content })), autoScrollToBottom: true, smoothScroll: true }) }));
}
// ============================================================================
// Example 3: Auto-Virtualized Message List (15 lines)
// ============================================================================
/**
 * Automatically switches to virtualization for large lists
 */
export function AutoVirtualizedChatExample() {
    const chat = useClarityChat({ api: '/api/chat' });
    return (_jsx(AutoTanStackMessageList, { messages: chat.messages, renderMessage: (message) => (_jsx("div", { className: "p-3 rounded-lg mb-2 bg-muted", children: message.content })), virtualizationThreshold: 50, height: "400px" }));
}
// ============================================================================
// Example 4: Sonner Toast Notifications (20 lines)
// ============================================================================
/**
 * Modern toast notifications with promise support
 */
export function ToastExample() {
    const handleSave = async () => {
        const savePromise = new Promise((resolve) => setTimeout(resolve, 2000));
        toast.promise(savePromise, {
            loading: 'Saving...',
            success: 'Saved successfully!',
            error: 'Failed to save',
        });
    };
    const handleError = () => {
        toast.error('Something went wrong', {
            description: 'Please try again or contact support.',
            action: {
                label: 'Retry',
                onClick: () => toast.info('Retrying...'),
            },
        });
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(ClarityToaster, { position: "bottom-right", richColors: true }), _jsx("button", { onClick: handleSave, className: "px-4 py-2 rounded bg-primary text-primary-foreground", children: "Save with Promise" }), _jsx("button", { onClick: handleError, className: "px-4 py-2 rounded bg-destructive text-white", children: "Show Error" })] }));
}
// ============================================================================
// Example 5: FlowToken Streaming (Optional) (25 lines)
// ============================================================================
/**
 * Enhanced streaming animations (requires flowtoken package)
 */
export function FlowTokenStreamingExample() {
    const [content, setContent] = React.useState('');
    const [isStreaming, setIsStreaming] = React.useState(false);
    const { isAvailable, isLoading } = useFlowToken();
    const simulateStream = () => {
        const text = 'This is a demonstration of FlowToken streaming animations. Each word animates in smoothly.';
        setContent('');
        setIsStreaming(true);
        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                setContent(text.slice(0, index + 1));
                index++;
            }
            else {
                setIsStreaming(false);
                clearInterval(interval);
            }
        }, 30);
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "text-sm text-muted-foreground", children: ["FlowToken:", ' ', isLoading
                        ? 'Loading...'
                        : isAvailable
                            ? '✅ Available'
                            : '⚠️ Using fallback'] }), _jsx("button", { onClick: simulateStream, className: "px-4 py-2 rounded bg-primary text-primary-foreground", children: "Start Streaming" }), _jsx("div", { className: "p-4 rounded-lg bg-muted min-h-[100px]", children: _jsx(FlowTokenStreamingText, { content: content, isStreaming: isStreaming, animation: "blur-in" }) })] }));
}
// ============================================================================
// Example 6: Complete Chat with All Features (40 lines)
// ============================================================================
/**
 * Full-featured chat combining all OSS-enhanced components
 */
export function CompleteChatExample() {
    const chat = useClarityChat({ api: '/api/chat' });
    const handleSend = async (message) => {
        try {
            await chat.append({ role: 'user', content: message });
            toast.success('Message sent');
        }
        catch {
            toast.error('Failed to send message');
        }
    };
    return (_jsxs("div", { className: "h-screen", children: [_jsx(ClarityToaster, { position: "bottom-right", richColors: true }), _jsx(ResizableChatLayout, { sidebar: _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "font-semibold mb-4", children: "History" }), _jsx("button", { onClick: () => {
                                chat.setMessages([]);
                                toast.info('Chat cleared');
                            }, className: "w-full px-3 py-2 text-sm rounded bg-muted hover:bg-muted/80", children: "Clear Chat" })] }), header: _jsxs("div", { className: "p-3 border-b flex items-center justify-between", children: [_jsx("span", { className: "font-semibold", children: "AI Assistant" }), chat.isLoading && (_jsx("span", { className: "text-sm text-muted-foreground", children: "Thinking..." }))] }), footer: _jsx("div", { className: "p-3 border-t", children: _jsx(ChatInput, { onSubmit: handleSend, disabled: chat.isLoading }) }), defaultSidebarSize: 20, collapsible: true, children: _jsx(AutoTanStackMessageList, { messages: chat.messages, renderMessage: (message) => (_jsx("div", { className: `p-3 rounded-lg mb-2 ${message.role === 'assistant'
                            ? 'bg-muted ml-4'
                            : 'bg-primary text-primary-foreground mr-4'}`, children: message.status === 'streaming' ? (_jsx(FlowTokenStreamingText, { content: message.content, isStreaming: true, animation: "fade" })) : message.content })), virtualizationThreshold: 50, height: "100%" }) })] }));
}
//# sourceMappingURL=oss-enhanced-examples.js.map