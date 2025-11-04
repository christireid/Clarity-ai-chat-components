import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Badge, cn } from '@clarity-chat/primitives';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { ThinkingIndicator } from './thinking-indicator';
import { BotIcon } from './icons';
export const ChatWindow = React.memo(function ChatWindow({ messages, isLoading = false, aiStatus, onSendMessage, onMessageCopy, onMessageFeedback, onMessageRetry, emptyState, showHeader = false, sessionTitle = 'Chat Session', sessionSubtitle, headerActions, showMessageCount = false, onExport, onClear, className, }) {
    const [input, setInput] = React.useState('');
    const handleSubmit = (content) => {
        onSendMessage(content);
        setInput('');
    };
    // Default empty state with animation
    const defaultEmptyState = (_jsxs(motion.div, { className: "text-center space-y-6", initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.3 }, children: [_jsx(motion.div, { className: "inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm ring-1 ring-primary/20", animate: {
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0],
                }, transition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }, children: _jsx(BotIcon, { size: 36, className: "text-primary" }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-xl font-semibold text-foreground", children: "Start a conversation" }), _jsx("p", { className: "text-sm text-muted-foreground max-w-md mx-auto leading-relaxed", children: "Send a message to begin chatting with the AI assistant. I'm here to help with your questions and tasks." })] })] }));
    return (_jsxs(Card, { className: cn('flex h-full flex-col overflow-hidden shadow-lg', className), children: [showHeader && (_jsxs(motion.div, { className: "flex items-center justify-between gap-4 border-b bg-card px-4 py-3 sm:px-6", initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 }, children: [_jsxs("div", { className: "flex items-center gap-3 min-w-0 flex-1", children: [_jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20", children: _jsx(BotIcon, { size: 20 }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("h2", { className: "text-sm font-semibold text-foreground truncate", children: sessionTitle }), sessionSubtitle && (_jsx("p", { className: "text-xs text-muted-foreground truncate", children: sessionSubtitle }))] }), showMessageCount && messages.length > 0 && (_jsxs(Badge, { variant: "secondary", className: "shrink-0", children: [messages.length, ' ', messages.length === 1 ? 'message' : 'messages'] }))] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [headerActions, onExport && messages.length > 0 && (_jsxs(Button, { size: "sm", variant: "ghost", onClick: onExport, className: "gap-1.5", title: "Export conversation", children: [_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) }), _jsx("span", { className: "hidden sm:inline", children: "Export" })] })), onClear && messages.length > 0 && (_jsxs(Button, { size: "sm", variant: "ghost", onClick: onClear, className: "gap-1.5 text-muted-foreground hover:text-destructive", title: "Clear conversation", children: [_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }), _jsx("span", { className: "hidden sm:inline", children: "Clear" })] }))] })] })), _jsxs("div", { className: "flex flex-col h-full", children: [_jsx(MessageList, { messages: messages, isLoading: isLoading, onMessageCopy: onMessageCopy, onMessageFeedback: onMessageFeedback, onMessageRetry: onMessageRetry, emptyState: emptyState || defaultEmptyState, className: "flex-1" }), _jsx(AnimatePresence, { children: isLoading && aiStatus && (_jsx("div", { className: "px-4 pb-2", children: _jsx(ThinkingIndicator, { status: aiStatus }) })) }), _jsx(ChatInput, { value: input, onChange: setInput, onSubmit: handleSubmit, disabled: isLoading })] })] }));
});
ChatWindow.displayName = 'ChatWindow';
//# sourceMappingURL=chat-window.js.map