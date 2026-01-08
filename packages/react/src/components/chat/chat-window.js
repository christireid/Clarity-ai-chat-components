'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Badge, cn } from '@clarity-chat/primitives';
import { duration, DURATION_SECONDS as durations, } from '../../animations/constants';
import { MessageList } from '../message/message-list';
import { ChatInput } from './chat-input';
import { ThinkingIndicator } from '../message/thinking-indicator';
import { BotIcon, SparklesIcon } from '../ui/icons';
import { convertCoreMessagesToMessages } from '../../utils/message/message-conversion';
import { PromptSuggestions, } from '../prompt/prompt-suggestions';
import { useUIEnhancements, getEnhancedClassName, } from '../../contexts/ui-enhancements';
import { usePerformanceMonitoring, useRenderOptimization, use60FPSAnimation, } from '../../utils/performance';
const DefaultEmptyState = ({ starterPrompts, onSelectPrompt, showStarterPrompts = true, }) => (_jsxs(motion.div, { className: "text-center space-y-8 px-4 py-8", initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: duration('slow'), ease: [0.25, 0.1, 0.25, 1] }, children: [_jsxs("div", { className: "relative inline-flex items-center justify-center", children: [_jsx(motion.div, { className: "absolute w-32 h-32 rounded-full border border-primary/10", animate: {
                        scale: [1, 1.05, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }, transition: {
                        duration: duration('slower'),
                        repeat: Infinity,
                        ease: 'easeInOut',
                    } }), _jsx(motion.div, { className: "absolute w-28 h-28 rounded-full border border-primary/20", animate: {
                        scale: [1, 1.03, 1],
                        opacity: [0.6, 1, 0.6],
                    }, transition: {
                        duration: duration('slower'),
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.5,
                    } }), _jsx(motion.div, { className: "relative z-10 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/5 shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.3)] ring-1 ring-primary/20", animate: {
                        scale: [1, 1.02, 1],
                        rotate: [0, 1, -1, 0],
                    }, transition: {
                        duration: duration('slower'),
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }, children: _jsx(motion.div, { animate: {
                            y: [0, -2, 0],
                        }, transition: {
                            duration: duration('slower'),
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }, children: _jsx(BotIcon, { size: 40, className: "text-primary" }) }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent", children: "Start a conversation" }), _jsx("p", { className: "text-sm text-muted-foreground/80 max-w-md mx-auto leading-relaxed", children: "Send a message to begin chatting with the AI assistant. I'm here to help with your questions and tasks." })] }), showStarterPrompts &&
            starterPrompts &&
            starterPrompts.length > 0 &&
            onSelectPrompt && (_jsxs(motion.div, { className: "pt-6", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: {
                delay: 0.2,
                duration: duration('slow'),
                ease: [0.25, 0.1, 0.25, 1],
            }, children: [_jsxs("div", { className: "flex items-center justify-center gap-2 mb-5", children: [_jsx(motion.div, { animate: { rotate: [0, 15, -15, 0] }, transition: {
                                duration: duration('slower'),
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }, children: _jsx(SparklesIcon, { size: 14, className: "text-primary" }) }), _jsx("span", { className: "text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider", children: "Try asking" })] }), _jsx(PromptSuggestions, { suggestions: starterPrompts, onSelect: onSelectPrompt, suggestionType: "starter", layout: "chips", maxSuggestions: 4, className: "justify-center" })] }))] }));
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
export function ChatWindow({ messages, isLoading = false, aiStatus, onSendMessage, onStopGeneration, onMessageCopy, onMessageFeedback, onMessageRetry, onEditMessage, onRegenerateMessage, onDeleteMessage, editingMessageId, onSaveEdit, onCancelEdit, emptyState, showHeader = false, sessionTitle = 'Chat Session', sessionSubtitle, headerActions, showMessageCount = false, onExport, onClear, error, onRetry, onDismissError, className, starterPrompts, followUpSuggestions, showStarterPrompts = true, showFollowUpSuggestions = true, }) {
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
    // Accessibility: Track the latest message for screen reader announcements
    const [lastAnnouncedMessageId, setLastAnnouncedMessageId] = React.useState(null);
    const liveRegionRef = React.useRef(null);
    // Unique IDs for skip link targets
    const chatWindowId = React.useId();
    const messagesId = `${chatWindowId}-messages`;
    const inputId = `${chatWindowId}-input`;
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
            (typeof firstMessage.content === 'string' ||
                Array.isArray(firstMessage.content)) &&
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
    // Handle prompt selection (starter or follow-up)
    const handlePromptSelect = (suggestion) => {
        onSendMessage(suggestion.text);
    };
    // React 19: Simple derivation - compiler optimizes
    const effectiveEmptyState = emptyState || (_jsx(DefaultEmptyState, { starterPrompts: starterPrompts, onSelectPrompt: handlePromptSelect, showStarterPrompts: showStarterPrompts }));
    // Check if we should show follow-up suggestions
    // Only show when: not loading, has messages, last message is from assistant, has suggestions
    const lastMessage = normalizedMessages[normalizedMessages.length - 1];
    const shouldShowFollowUp = showFollowUpSuggestions &&
        !isLoading &&
        followUpSuggestions &&
        followUpSuggestions.length > 0 &&
        lastMessage?.role === 'assistant' &&
        lastMessage?.status !== 'streaming';
    // React 19: Simple string derivation - compiler optimizes
    const messageCountText = normalizedMessages.length === 0
        ? null
        : `${normalizedMessages.length} ${normalizedMessages.length === 1 ? 'message' : 'messages'}`;
    // Accessibility: Announce new messages to screen readers
    React.useEffect(() => {
        if (normalizedMessages.length === 0)
            return;
        const latestMessage = normalizedMessages[normalizedMessages.length - 1];
        if (!latestMessage || latestMessage.id === lastAnnouncedMessageId)
            return;
        // Only announce completed messages (not streaming)
        if (latestMessage.status === 'streaming')
            return;
        setLastAnnouncedMessageId(latestMessage.id);
        // Construct announcement text
        const roleLabel = latestMessage.role === 'assistant' ? 'Assistant' : 'You';
        const contentPreview = typeof latestMessage.content === 'string'
            ? latestMessage.content.slice(0, 100) +
                (latestMessage.content.length > 100 ? '...' : '')
            : 'Message received';
        // Update the live region for screen reader announcement
        if (liveRegionRef.current) {
            liveRegionRef.current.textContent = `${roleLabel} said: ${contentPreview}`;
        }
    }, [normalizedMessages, lastAnnouncedMessageId]);
    // Accessibility: Announce loading state changes
    React.useEffect(() => {
        if (liveRegionRef.current) {
            if (isLoading) {
                liveRegionRef.current.textContent = 'AI is generating a response...';
            }
        }
    }, [isLoading]);
    return (_jsxs(Card, { className: cn('flex h-full flex-col overflow-hidden', 'bg-gradient-to-b from-card via-card to-background/50', 'border-border/30', 'shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)]', 'backdrop-blur-sm', 'relative', // For skip link positioning
        className), role: "region", "aria-label": sessionTitle, children: [_jsx("nav", { className: "sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-0 focus-within:left-0 focus-within:right-0 focus-within:z-50 focus-within:bg-background focus-within:p-2 focus-within:border-b", "aria-label": "Skip links", children: _jsxs("ul", { className: "flex gap-4 justify-center", children: [_jsx("li", { children: _jsx("a", { href: `#${messagesId}`, className: "text-sm font-medium text-primary underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1", children: "Skip to messages" }) }), _jsx("li", { children: _jsx("a", { href: `#${inputId}`, className: "text-sm font-medium text-primary underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1", children: "Skip to chat input" }) })] }) }), _jsx("div", { ref: liveRegionRef, role: "status", "aria-live": "polite", "aria-atomic": "true", className: "sr-only" }), showHeader && (_jsxs(motion.div, { className: "flex items-center justify-between gap-4 border-b border-border/60 bg-card/50 px-5 py-4 sm:px-6 backdrop-blur-md", initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: {
                    duration: duration('slow'),
                    ease: [0.25, 0.1, 0.25, 1],
                }, children: [_jsxs("div", { className: "flex items-center gap-3 min-w-0 flex-1", children: [_jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm ring-1 ring-primary/25", children: _jsx(BotIcon, { size: 22 }) }), _jsxs("div", { className: "min-w-0 flex-1 space-y-0.5 pl-0.5", children: [_jsx("h2", { className: "text-sm font-bold text-foreground truncate leading-tight", children: sessionTitle }), sessionSubtitle && (_jsx("p", { className: "text-xs text-muted-foreground/80 truncate leading-tight", children: sessionSubtitle }))] }), showMessageCount && messageCountText && (_jsx(Badge, { variant: "secondary", className: "shrink-0", "aria-label": messageCountText, children: messageCountText }))] }), _jsxs("div", { className: "flex items-center gap-2.5 shrink-0", children: [headerActions, onExport && normalizedMessages.length > 0 && (_jsxs(Button, { size: "sm", variant: "ghost", onClick: onExport, className: "gap-2 hover:bg-accent/50 transition-colors", title: "Export conversation", children: [_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) }), _jsx("span", { className: "hidden sm:inline", children: "Export" })] })), onClear && normalizedMessages.length > 0 && (_jsxs(Button, { size: "sm", variant: "ghost", onClick: onClear, className: "gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all", title: "Clear conversation", children: [_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }), _jsx("span", { className: "hidden sm:inline", children: "Clear" })] }))] })] })), _jsx(AnimatePresence, { children: error && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: {
                        duration: duration('normal'),
                        ease: [0.25, 0.1, 0.25, 1],
                    }, className: "border-b border-destructive/30 bg-destructive/5", role: "alert", children: _jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3", children: [_jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [_jsx("svg", { className: "h-4 w-4 text-destructive shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }), _jsx("span", { className: "text-sm text-destructive truncate", children: error })] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [onRetry && (_jsx(Button, { size: "sm", variant: "default", onClick: onRetry, className: "h-7 px-3 text-xs font-medium", children: "Retry" })), onDismissError && (_jsx(Button, { size: "sm", variant: "ghost", onClick: onDismissError, className: "h-7 w-7 p-0", "aria-label": "Dismiss error", children: _jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }))] })] }) })) }), _jsx(AnimatePresence, { children: isLoading && onStopGeneration && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: {
                        duration: duration('normal'),
                        ease: [0.25, 0.1, 0.25, 1],
                    }, className: "border-b border-amber-300/50 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700/50", children: _jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-2.5", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx(motion.div, { animate: { rotate: 360 }, transition: {
                                            duration: duration('slower'),
                                            repeat: Infinity,
                                            ease: 'linear',
                                        }, className: "h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full" }), _jsx("span", { className: "text-sm text-amber-700 dark:text-amber-300 font-medium", children: "AI is generating response..." })] }), _jsx(Button, { size: "sm", variant: "destructive", onClick: onStopGeneration, className: "h-7 px-3 text-xs font-medium", children: "Stop" })] }) })) }), _jsxs("div", { className: "flex flex-col flex-1 min-h-0 overflow-hidden", children: [_jsx(MessageList, { id: messagesId, messages: normalizedMessages, isLoading: isLoading, onMessageCopy: onMessageCopy, onMessageFeedback: onMessageFeedback, onMessageRetry: onMessageRetry, onEditMessage: onEditMessage, onRegenerateMessage: onRegenerateMessage, onDeleteMessage: onDeleteMessage, onStopGeneration: onStopGeneration, editingMessageId: editingMessageId, onSaveEdit: onSaveEdit, onCancelEdit: onCancelEdit, emptyState: effectiveEmptyState, className: "flex-1 min-h-0", "aria-label": "Chat messages", role: "log", "aria-live": "polite" }), _jsx(AnimatePresence, { children: shouldShowFollowUp && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: {
                                duration: duration('normal'),
                                ease: [0.25, 0.1, 0.25, 1],
                            }, className: "px-5 pb-3", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(SparklesIcon, { size: 12, className: "text-muted-foreground" }), _jsx("span", { className: "text-xs font-medium text-muted-foreground/80", children: "Suggested follow-ups" })] }), _jsx(PromptSuggestions, { suggestions: followUpSuggestions, onSelect: handlePromptSelect, suggestionType: "follow-up", layout: "chips", maxSuggestions: 3 })] })) }), _jsx(AnimatePresence, { children: isLoading && aiStatus && (_jsx("div", { className: "px-5 pb-3", children: _jsx(ThinkingIndicator, { status: aiStatus }) })) }), _jsx(ChatInput, { id: inputId, value: input, onChange: setInput, onSubmit: handleSubmit, disabled: isLoading, "aria-label": "Type your message" })] })] }));
}
ChatWindow.displayName = 'ChatWindow';
//# sourceMappingURL=chat-window.js.map