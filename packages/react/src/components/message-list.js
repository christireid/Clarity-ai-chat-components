import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from './message';
import { ScrollArea, Button, cn } from '@clarity-chat/primitives';
import { useAutoScroll } from '../hooks/use-auto-scroll';
import { ArrowDownIcon } from './icons';
import { SkeletonMessage } from './skeleton';
import { createStaggerContainerVariant, createStaggerChildVariant, } from '../animations/utils';
import { INTERACTION_VARIANTS } from '../animations/constants';
export const MessageList = React.memo(function MessageList({ messages, onMessageCopy, onMessageFeedback, onMessageRetry, isLoading = false, loadingCount = 3, emptyState, className, }) {
    // Use auto-scroll hook with smooth scrolling
    const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
        dependencies: [messages],
        behavior: 'smooth',
        threshold: 100,
    });
    // Animation variants
    const containerVariants = createStaggerContainerVariant('normal', 0);
    const itemVariants = createStaggerChildVariant('slide', 'fast');
    // Show empty state if no messages and not loading
    const showEmptyState = messages.length === 0 && !isLoading && emptyState;
    return (_jsxs("div", { className: "relative h-full", children: [_jsxs(ScrollArea, { ref: scrollRef, className: cn('h-full bg-transparent px-2 py-4 sm:px-4', className), children: [isLoading && messages.length === 0 && (_jsx("div", { className: "space-y-4 px-4 py-6", children: Array.from({ length: loadingCount }).map((_, index) => (_jsx(SkeletonMessage, { role: index % 2 === 0 ? 'user' : 'assistant', lines: index % 2 === 0 ? 2 : 4, variant: "shimmer" }, `skeleton-${index}`))) })), showEmptyState && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "flex h-full items-center justify-center px-6 py-12", children: emptyState })), messages.length > 0 && (_jsxs(motion.div, { className: "space-y-3 px-2 pb-6 sm:px-4", variants: containerVariants, initial: "initial", animate: "animate", children: [_jsx(AnimatePresence, { mode: "popLayout", children: messages.map((message) => (_jsx(motion.div, { variants: itemVariants, layout: true, children: _jsx(Message, { message: message, onCopy: (content) => onMessageCopy?.(message.id, content), onFeedback: (type) => onMessageFeedback?.(message.id, type), onRetry: () => onMessageRetry?.(message.id) }) }, message.id))) }), isLoading && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, children: _jsx(SkeletonMessage, { role: "assistant", lines: 3, variant: "shimmer" }) }))] }))] }), _jsx(AnimatePresence, { children: !isNearBottom && messages.length > 0 && (_jsx(motion.div, { className: "absolute bottom-4 right-4", initial: { opacity: 0, y: 20, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 20, scale: 0.9 }, transition: { duration: 0.2 }, children: _jsx(motion.div, { whileHover: INTERACTION_VARIANTS.button.hover, whileTap: INTERACTION_VARIANTS.button.tap, transition: INTERACTION_VARIANTS.button.transition, children: _jsxs(Button, { size: "sm", variant: "default", onClick: scrollToBottom, className: "shadow-xl gap-1.5 bg-primary/95 hover:bg-primary backdrop-blur-sm", children: [_jsx(ArrowDownIcon, { size: 16 }), "Scroll to bottom"] }) }) })) })] }));
});
MessageList.displayName = 'MessageList';
//# sourceMappingURL=message-list.js.map