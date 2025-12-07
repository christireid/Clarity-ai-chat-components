'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Badge, cn } from '@clarity-chat/primitives';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { ThinkingIndicator } from './thinking-indicator';
import { BotIcon } from './icons';
import { convertCoreMessagesToMessages } from '../utils/message-conversion';
// Default empty state component - extracted for better performance
const DefaultEmptyState = () => (_jsxs(motion.div, { className: "text-center space-y-8 px-4", initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }, children: [_jsx(motion.div, { className: "inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg ring-1 ring-primary/30", animate: {
                scale: [1, 1.02, 1],
                rotate: [0, 1, -1, 0],
            }, transition: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
            }, children: _jsx(BotIcon, { size: 40, className: "text-primary" }) }), _jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-2xl font-bold text-foreground", children: "Start a conversation" }), _jsx("p", { className: "text-sm text-muted-foreground/90 max-w-sm mx-auto leading-relaxed", children: "Send a message to begin chatting with the AI assistant. I'm here to help with your questions and tasks." })] })] }));
/**
 * ChatWindow - Mid-Level Composable Component
 *
 * A composable chat window component that accepts messages and handles
 * rendering, input, and user interactions.
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Chat UI
 *
 * For drop-in usage, use top-level `ClarityChat` instead.
 * For custom rendering, use low-level `Message` components.
 *
 * @example
 * ```tsx
 * const chat = useClarityChat({ api: '/api/chat' })
 * const handlers = useChatHandlers({ chat })
 *
 * <ChatWindow
 *   messages={chat.messages}
 *   isLoading={chat.isLoading}
 *   onSendMessage={handlers.onSendMessage}
 * />
 * ```
 *
 * A mid-level building block for rendering chat interfaces. Provides full control
 * over message rendering, input handling, and UI customization.
 *
 * **Features:**
 * - Message list rendering with animations
 * - Chat input with send functionality
 * - Loading states and thinking indicators
 * - Message actions (copy, feedback, retry, edit, delete)
 * - Customizable empty state
 * - Optional header with session info
 * - Export and clear functionality
 *
 * **When to use:**
 * - You need full control over the chat UI
 * - You're using `useChat` or `useClarityChat` hooks
 * - You want to customize message rendering
 *
 * **When NOT to use:**
 * - For simplest setup, use `ClarityChat` component instead
 * - For pre-configured setups, use recipe components (`ChatWithMemory`, etc.)
 *
 * @param props - ChatWindow configuration
 * @param props.messages - Array of messages to display
 * @param props.isLoading - Whether a request is in progress
 * @param props.onSendMessage - Callback when user sends a message
 * @param props.onMessageCopy - Optional callback when message is copied
 * @param props.onMessageFeedback - Optional callback for message feedback (up/down)
 * @param props.onMessageRetry - Optional callback to retry a message
 * @param props.onEditMessage - Optional callback to edit a message
 * @param props.onRegenerateMessage - Optional callback to regenerate a message
 * @param props.onDeleteMessage - Optional callback to delete a message
 * @param props.emptyState - Optional custom empty state component
 * @param props.showHeader - Show header with session info (default: false)
 * @param props.sessionTitle - Session title displayed in header
 * @param props.sessionSubtitle - Session subtitle/description
 * @param props.headerActions - Custom actions in header
 * @param props.showMessageCount - Show message count badge (default: false)
 * @param props.onExport - Optional callback for export functionality
 * @param props.onClear - Optional callback for clear chat functionality
 * @param props.className - Optional CSS class name
 * @param props.aiStatus - Optional AI processing status for thinking indicator
 *
 * @example Basic usage with useChat hook
 * ```tsx
 * import { useChat, ChatWindow } from '@clarity-chat/react'
 *
 * function MyChat() {
 *   const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })
 *
 *   return (
 *     <ChatWindow
 *       messages={messages}
 *       isLoading={isLoading}
 *       onSendMessage={sendMessage}
 *     />
 *   )
 * }
 * ```
 *
 * @example With custom header and actions
 * ```tsx
 * <ChatWindow
 *   messages={messages}
 *   isLoading={isLoading}
 *   onSendMessage={sendMessage}
 *   showHeader
 *   sessionTitle="Customer Support"
 *   sessionSubtitle="We're here to help"
 *   headerActions={<Button>Settings</Button>}
 *   showMessageCount
 *   onExport={() => exportMessages(messages)}
 *   onClear={() => clearMessages()}
 * />
 * ```
 *
 * @example With message callbacks
 * ```tsx
 * <ChatWindow
 *   messages={messages}
 *   isLoading={isLoading}
 *   onSendMessage={sendMessage}
 *   onMessageCopy={(id, content) => {
 *     navigator.clipboard.writeText(content)
 *     toast.success('Copied!')
 *   }}
 *   onMessageFeedback={(id, type) => {
 *     analytics.track('message_feedback', { id, type })
 *   }}
 *   onMessageRetry={(id) => {
 *     retryMessage(id)
 *   }}
 * />
 * ```
 */
export function ChatWindow({ messages, isLoading = false, aiStatus, onSendMessage, onMessageCopy, onMessageFeedback, onMessageRetry, onEditMessage, onRegenerateMessage, onDeleteMessage, emptyState, showHeader = false, sessionTitle = 'Chat Session', sessionSubtitle, headerActions, showMessageCount = false, onExport, onClear, className, }) {
    // Runtime validation
    if (!Array.isArray(messages)) {
        throw new Error('ChatWindow: "messages" prop must be an array.\n\n' +
            'Example:\n' +
            '  <ChatWindow messages={[]} onSendMessage={handleSend} />\n\n' +
            'For more help, see: https://clarity-chat.dev/docs/components');
    }
    if (typeof onSendMessage !== 'function') {
        throw new Error('ChatWindow: "onSendMessage" prop is required and must be a function.\n\n' +
            'Example:\n' +
            '  <ChatWindow messages={messages} onSendMessage={(msg) => sendMessage(msg)} />\n\n' +
            'For more help, see: https://clarity-chat.dev/docs/components');
    }
    const [input, setInput] = React.useState('');
    // Convert CoreMessage[] to Message[] if needed
    // Check if first message has 'content' property that could be string or array
    // CoreMessage has content: string | Array<...>, Message has content: string
    const normalizedMessages = React.useMemo(() => {
        if (messages.length === 0)
            return [];
        // Check if it's CoreMessage[] format by checking first message structure
        const firstMessage = messages[0];
        const isCoreMessage = firstMessage &&
            'content' in firstMessage &&
            (typeof firstMessage.content === 'string' || Array.isArray(firstMessage.content)) &&
            !('status' in firstMessage); // Message has 'status', CoreMessage doesn't
        if (isCoreMessage) {
            return convertCoreMessagesToMessages(messages);
        }
        return messages;
    }, [messages]);
    // React 19: Compiler optimizes - no useCallback needed
    const handleSubmit = (content) => {
        onSendMessage(content);
        setInput('');
    };
    // React 19: Simple derivation - compiler optimizes
    const effectiveEmptyState = emptyState || _jsx(DefaultEmptyState, {});
    // React 19: Simple string derivation - compiler optimizes
    const messageCountText = normalizedMessages.length === 0
        ? null
        : `${normalizedMessages.length} ${normalizedMessages.length === 1 ? 'message' : 'messages'}`;
    return (_jsxs(Card, { className: cn('flex h-full flex-col overflow-hidden shadow-xl border-border/40', className), children: [showHeader && (_jsxs(motion.div, { className: "flex items-center justify-between gap-4 border-b border-border/60 bg-card/50 px-5 py-4 sm:px-6 backdrop-blur-md", initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }, children: [_jsxs("div", { className: "flex items-center gap-3 min-w-0 flex-1", children: [_jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm ring-1 ring-primary/25", children: _jsx(BotIcon, { size: 22 }) }), _jsxs("div", { className: "min-w-0 flex-1 space-y-0.5 pl-0.5", children: [_jsx("h2", { className: "text-sm font-bold text-foreground truncate leading-tight", children: sessionTitle }), sessionSubtitle && (_jsx("p", { className: "text-xs text-muted-foreground/80 truncate leading-tight", children: sessionSubtitle }))] }), showMessageCount && messageCountText && (_jsx(Badge, { variant: "secondary", className: "shrink-0", "aria-label": messageCountText, children: messageCountText }))] }), _jsxs("div", { className: "flex items-center gap-2.5 shrink-0", children: [headerActions, onExport && normalizedMessages.length > 0 && (_jsxs(Button, { size: "sm", variant: "ghost", onClick: onExport, className: "gap-2 hover:bg-accent/50 transition-colors", title: "Export conversation", children: [_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) }), _jsx("span", { className: "hidden sm:inline", children: "Export" })] })), onClear && normalizedMessages.length > 0 && (_jsxs(Button, { size: "sm", variant: "ghost", onClick: onClear, className: "gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all", title: "Clear conversation", children: [_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }), _jsx("span", { className: "hidden sm:inline", children: "Clear" })] }))] })] })), _jsxs("div", { className: "flex flex-col flex-1 min-h-0 overflow-hidden", children: [_jsx(MessageList, { messages: normalizedMessages, isLoading: isLoading, onMessageCopy: onMessageCopy, onMessageFeedback: onMessageFeedback, onMessageRetry: onMessageRetry, onEditMessage: onEditMessage, onRegenerateMessage: onRegenerateMessage, onDeleteMessage: onDeleteMessage, emptyState: effectiveEmptyState, className: "flex-1 min-h-0" }), _jsx(AnimatePresence, { children: isLoading && aiStatus && (_jsx("div", { className: "px-5 pb-3", children: _jsx(ThinkingIndicator, { status: aiStatus }) })) }), _jsx(ChatInput, { value: input, onChange: setInput, onSubmit: handleSubmit, disabled: isLoading })] })] }));
}
ChatWindow.displayName = 'ChatWindow';
//# sourceMappingURL=chat-window.js.map