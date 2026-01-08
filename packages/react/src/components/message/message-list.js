'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from './message';
import { TimeSeparator } from './time-separator';
import { ScrollArea, Button, cn, useA11y, useReducedMotion, } from '@clarity-chat/primitives';
import { useAutoScroll } from '../../hooks/ui/use-auto-scroll';
import { ArrowDownIcon } from '../ui/icons';
import { SkeletonMessage } from '../ui/skeleton';
import { createStaggerContainerVariant, createStaggerChildVariant, } from '../../animations/utils';
import { INTERACTION_VARIANTS, DURATION_SECONDS, } from '../../animations/constants';
import { getMotionSafeDuration, getMotionSafeScale, getMotionSafeValue, } from '../../animations/motion-safe';
import { getMessageGrouping, getTimeSeparator, shouldShowTimeSeparator, } from '../../utils/message/message-grouping';
import { ClarityError } from '../../error/clarity-error';
/**
 * MessageList - Mid-Level Composable Component
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Chat UI
 *
 * A composable message list component with auto-scrolling, animations, and
 * message interaction handlers.
 *
 * For drop-in usage, use top-level `ClarityChat` component instead.
 * For custom message rendering, use low-level `Message` component.
 *
 * React 19 Enhancements:
 * - Removed memo() wrapper - compiler handles optimization
 * - Removed simple useMemo - compiler optimizes static values
 *
 * @param props - MessageList configuration
 * @param props.messages - Array of messages to display (required)
 * @param props.onMessageCopy - Callback when message is copied
 * @param props.onMessageFeedback - Callback for message feedback (up/down)
 * @param props.onMessageRetry - Callback to retry a message
 * @param props.isLoading - Show loading skeleton (default: false)
 * @param props.emptyState - Custom empty state content
 * @returns Message list component
 *
 * @example
 * ```tsx
 * <MessageList
 *   messages={messages}
 *   onMessageCopy={(id, content) => navigator.clipboard.writeText(content)}
 *   onMessageRetry={(id) => retryMessage(id)}
 *   isLoading={isLoading}
 * />
 * ```
 */
export function MessageList({ messages, onMessageCopy, onMessageFeedback, onMessageRetry, onEditMessage, onRegenerateMessage, onDeleteMessage, onStopGeneration, editingMessageId, onSaveEdit, onCancelEdit, isLoading = false, loadingCount = 3, emptyState, enableGrouping = true, showTimeSeparators = true, announceNewMessages = true, className, id, role = 'log', 'aria-label': ariaLabel, 'aria-live': ariaLive = 'polite', }) {
    // Runtime validation with actionable error messages
    if (!Array.isArray(messages)) {
        throw new ClarityError('INVALID_MESSAGES_PROP', '"messages" must be an array', {
            component: 'MessageList',
            prop: 'messages',
            received: typeof messages,
            expected: 'Message[]',
            docs: 'https://clarity-chat.dev/api/message-list#messages',
        });
    }
    // Use auto-scroll hook with smooth scrolling
    const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
        dependencies: [messages],
        behavior: 'smooth',
        threshold: 100,
    });
    // Accessibility: Respect user's motion preferences
    const prefersReducedMotion = useReducedMotion();
    // Accessibility: Screen reader announcements for new messages
    const { announce } = useA11y();
    const prevMessageCountRef = React.useRef(messages.length);
    React.useEffect(() => {
        if (!announceNewMessages)
            return;
        const prevCount = prevMessageCountRef.current;
        const newCount = messages.length;
        // Only announce when new messages are added (not on initial load or deletions)
        if (newCount > prevCount && prevCount > 0) {
            const newMessages = messages.slice(prevCount);
            const latestMessage = newMessages[newMessages.length - 1];
            if (latestMessage) {
                const sender = latestMessage.role === 'user' ? 'You' : 'Assistant';
                const preview = latestMessage.content.length > 100
                    ? `${latestMessage.content.slice(0, 100)}...`
                    : latestMessage.content;
                announce(`New message from ${sender}: ${preview}`, {
                    assertive: false,
                    clearAfter: 3000,
                });
            }
        }
        prevMessageCountRef.current = newCount;
    }, [messages, announceNewMessages, announce]);
    // Track message count when user scrolls away
    const [messageCountWhenScrolledAway, setMessageCountWhenScrolledAway] = React.useState(null);
    const [showPulse, setShowPulse] = React.useState(false);
    // Track when user scrolls away from bottom
    React.useEffect(() => {
        if (!isNearBottom && messageCountWhenScrolledAway === null) {
            setMessageCountWhenScrolledAway(messages.length);
        }
        else if (isNearBottom) {
            setMessageCountWhenScrolledAway(null);
            setShowPulse(false);
        }
    }, [isNearBottom, messageCountWhenScrolledAway, messages.length]);
    // Show pulse animation when new messages arrive while scrolled away
    React.useEffect(() => {
        if (!isNearBottom &&
            messageCountWhenScrolledAway !== null &&
            messages.length > messageCountWhenScrolledAway) {
            setShowPulse(true);
            const timeout = setTimeout(() => setShowPulse(false), 2000);
            return () => clearTimeout(timeout);
        }
        return undefined;
    }, [messages.length, messageCountWhenScrolledAway, isNearBottom]);
    // Keyboard shortcut: End key to jump to bottom
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'End' && !isNearBottom) {
                e.preventDefault();
                scrollToBottom();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isNearBottom, scrollToBottom]);
    // Calculate new message count
    const newMessageCount = messageCountWhenScrolledAway !== null
        ? Math.max(0, messages.length - messageCountWhenScrolledAway)
        : 0;
    // React 19: Static function calls - compiler optimizes, no useMemo needed
    // Apply reduced motion: use opacity-only transitions for accessibility
    const containerVariants = prefersReducedMotion
        ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
        : createStaggerContainerVariant('normal', 0);
    const itemVariants = prefersReducedMotion
        ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
        : createStaggerChildVariant('slide', 'fast');
    // React 19: Simple boolean derivation - compiler optimizes
    const showEmptyState = messages.length === 0 && !isLoading && emptyState;
    // Check if any message is currently streaming (for aria-busy)
    // React 19 compiler auto-memoizes; useMemo added for React 18 compatibility
    const isStreaming = React.useMemo(() => messages.some((m) => m.status === 'streaming'), [messages]);
    return (_jsxs("div", { id: id, className: cn('flex flex-col flex-1 min-h-0 overflow-hidden', className), role: role, "aria-label": ariaLabel ?? 'Chat messages', "aria-live": ariaLive, "aria-relevant": "additions", "aria-busy": isStreaming, tabIndex: -1, children: [_jsx(ScrollArea, { ref: scrollRef, className: "flex-1 min-h-0 bg-transparent px-2 py-4 sm:px-4", children: _jsxs(AnimatePresence, { mode: "wait", initial: false, children: [isLoading && messages.length === 0 && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: DURATION_SECONDS.fast }, className: "space-y-4 px-4 py-6", children: Array.from({ length: loadingCount }).map((_, index) => (_jsx(SkeletonMessage, { role: index % 2 === 0 ? 'user' : 'assistant', lines: index % 2 === 0 ? 2 : 4, variant: "shimmer" }, `skeleton-${index}`))) }, "loading-skeletons")), showEmptyState && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: DURATION_SECONDS.fast }, className: "px-2 py-4", children: emptyState }, "empty-state")), messages.length > 0 && (_jsxs(motion.div, { className: "space-y-3 px-2 pb-6 sm:px-4", variants: containerVariants, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: DURATION_SECONDS.fast }, children: [messages.map((message, index) => {
                                    // Calculate grouping for this message
                                    const grouping = enableGrouping
                                        ? getMessageGrouping(messages, index)
                                        : {
                                            isGroupStart: true,
                                            isGroupEnd: true,
                                            isGrouped: false,
                                            showTimestamp: true,
                                        };
                                    // Check if we should show a time separator before this message
                                    const showSeparator = showTimeSeparators &&
                                        shouldShowTimeSeparator(messages[index - 1], message);
                                    return (_jsxs(motion.div, { initial: {
                                            opacity: 0,
                                            y: prefersReducedMotion ? 0 : 10,
                                        }, animate: { opacity: 1, y: 0 }, transition: {
                                            duration: prefersReducedMotion
                                                ? DURATION_SECONDS.fast
                                                : DURATION_SECONDS.normal,
                                            delay: prefersReducedMotion ? 0 : index * 0.03,
                                        }, className: "w-full", children: [showSeparator && message.createdAt && (_jsx(TimeSeparator, { children: getTimeSeparator(new Date(message.createdAt).toISOString()) })), _jsx(motion.div, { variants: itemVariants, children: _jsx(Message, { message: message, onCopy: (content) => onMessageCopy?.(message.id, content), onFeedback: (type, comment) => onMessageFeedback?.(message.id, type, comment), onRetry: () => onMessageRetry?.(message.id), onEdit: () => onEditMessage?.(message.id), onRegenerate: () => onRegenerateMessage?.(message.id), onDelete: () => onDeleteMessage?.(message.id), onStopGeneration: onStopGeneration, isEditing: editingMessageId === message.id, onSaveEdit: onSaveEdit, onCancelEdit: onCancelEdit, ...grouping }) })] }, message.id));
                                }), isLoading && (_jsx(motion.div, { initial: {
                                        opacity: 0,
                                        y: prefersReducedMotion ? 0 : 10,
                                    }, animate: { opacity: 1, y: 0 }, transition: {
                                        duration: prefersReducedMotion
                                            ? DURATION_SECONDS.fast
                                            : DURATION_SECONDS.normal,
                                    }, children: _jsx(SkeletonMessage, { role: "assistant", lines: 3, variant: prefersReducedMotion ? 'pulse' : 'shimmer' }) }))] }, "messages-container"))] }) }), _jsx(AnimatePresence, { children: !isNearBottom && messages.length > 0 && (_jsx(motion.div, { className: "absolute bottom-6 right-6 z-10", initial: {
                        opacity: 0,
                        y: getMotionSafeValue(prefersReducedMotion, 10, 0),
                        scale: getMotionSafeScale(prefersReducedMotion, 0.9),
                    }, animate: { opacity: 1, y: 0, scale: 1 }, exit: {
                        opacity: 0,
                        y: getMotionSafeValue(prefersReducedMotion, 10, 0),
                        scale: getMotionSafeScale(prefersReducedMotion, 0.9),
                    }, transition: {
                        duration: getMotionSafeDuration(prefersReducedMotion, 0.2),
                        ease: [0.25, 0.1, 0.25, 1],
                    }, children: _jsxs(motion.div, { className: "relative", whileHover: {
                            scale: getMotionSafeScale(prefersReducedMotion, 1.05),
                        }, whileTap: {
                            scale: getMotionSafeScale(prefersReducedMotion, 0.95),
                        }, animate: showPulse && !prefersReducedMotion
                            ? {
                                scale: [1, 1.08, 1],
                                transition: {
                                    duration: DURATION_SECONDS.slower,
                                    repeat: 3,
                                    ease: 'easeInOut',
                                },
                            }
                            : {}, children: [_jsx(AnimatePresence, { children: newMessageCount > 0 && (_jsx(motion.div, { initial: {
                                        scale: getMotionSafeScale(prefersReducedMotion, 0),
                                        opacity: 0,
                                    }, animate: { scale: 1, opacity: 1 }, exit: {
                                        scale: getMotionSafeScale(prefersReducedMotion, 0),
                                        opacity: 0,
                                    }, transition: {
                                        duration: getMotionSafeDuration(prefersReducedMotion, 0.2),
                                        ease: prefersReducedMotion ? 'linear' : 'backOut',
                                    }, className: "absolute -top-2 -right-2 z-20", children: _jsx("div", { className: "bg-primary text-primary-foreground text-xs font-semibold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg border-2 border-background", children: newMessageCount > 99 ? '99+' : newMessageCount }) })) }), _jsx(Button, { size: "icon", variant: "default", onClick: scrollToBottom, className: cn('h-12 w-12 rounded-full shadow-lg hover:shadow-xl', 'bg-primary/95 hover:bg-primary backdrop-blur-md', 'border border-primary-foreground/10', 'transition-all duration-200'), "aria-label": newMessageCount > 0
                                    ? `Jump to bottom (${newMessageCount} new ${newMessageCount === 1 ? 'message' : 'messages'})`
                                    : 'Jump to bottom (End key)', title: newMessageCount > 0
                                    ? `${newMessageCount} new ${newMessageCount === 1 ? 'message' : 'messages'}`
                                    : 'Jump to bottom (End key)', children: _jsx(ArrowDownIcon, { size: 20, className: "text-primary-foreground" }) })] }) })) })] }));
}
MessageList.displayName = 'MessageList';
//# sourceMappingURL=message-list.js.map