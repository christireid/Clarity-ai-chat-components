import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Virtualized Message List
 *
 * High-performance message list using virtual scrolling for large datasets.
 * Only renders visible messages to maintain performance with 1000+ messages.
 *
 * Note: This is an optimized version that manually implements virtualization
 * without external dependencies. For production use with react-window, see docs.
 */
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from './message';
import { ScrollArea, Button } from '@clarity-chat/primitives';
import { useAutoScroll } from '../hooks/use-auto-scroll';
import { ArrowDownIcon } from './icons';
import { SkeletonMessage } from './skeleton';
import { INTERACTION_VARIANTS } from '../animations/constants';
/**
 * Custom hook for virtual scrolling
 */
function useVirtualization(itemCount, containerRef, estimatedItemHeight, overscan = 3) {
    const [scrollTop, setScrollTop] = React.useState(0);
    const [containerHeight, setContainerHeight] = React.useState(0);
    // Measure container height
    React.useEffect(() => {
        const container = containerRef.current;
        if (!container)
            return;
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setContainerHeight(entry.contentRect.height);
            }
        });
        observer.observe(container);
        return () => observer.disconnect();
    }, [containerRef]);
    // Track scroll position
    React.useEffect(() => {
        const container = containerRef.current;
        if (!container)
            return;
        const handleScroll = () => {
            setScrollTop(container.scrollTop);
        };
        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, [containerRef]);
    // Calculate visible range
    const startIndex = Math.max(0, Math.floor(scrollTop / estimatedItemHeight) - overscan);
    const endIndex = Math.min(itemCount, Math.ceil((scrollTop + containerHeight) / estimatedItemHeight) + overscan);
    const visibleItems = Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i);
    const totalHeight = itemCount * estimatedItemHeight;
    const offsetY = startIndex * estimatedItemHeight;
    return {
        visibleItems,
        totalHeight,
        offsetY,
        startIndex,
        endIndex,
    };
}
/**
 * Virtualized message list component
 */
export const VirtualizedMessageList = ({ messages, onMessageCopy, onMessageFeedback, onMessageRetry, isLoading = false, loadingCount = 3, emptyState, enableVirtualization = true, estimatedMessageHeight = 120, overscan = 3, className, }) => {
    const containerRef = React.useRef(null);
    const contentRef = React.useRef(null);
    // Use auto-scroll hook
    const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
        dependencies: [messages],
        behavior: 'smooth',
        threshold: 100,
    });
    // Virtual scrolling
    const { visibleItems, totalHeight, offsetY, } = useVirtualization(messages.length, containerRef, estimatedMessageHeight, overscan);
    // Show empty state if no messages and not loading
    const showEmptyState = messages.length === 0 && !isLoading && emptyState;
    // Use virtualization only for large lists
    const shouldVirtualize = enableVirtualization && messages.length > 50;
    return (_jsxs("div", { className: "relative h-full", children: [_jsxs(ScrollArea, { ref: (node) => {
                    scrollRef.current = node;
                    containerRef.current = node;
                }, className: className, children: [isLoading && messages.length === 0 && (_jsx("div", { className: "space-y-4 p-4", children: Array.from({ length: loadingCount }).map((_, index) => (_jsx(SkeletonMessage, { role: index % 2 === 0 ? 'user' : 'assistant', lines: index % 2 === 0 ? 2 : 4, variant: "shimmer" }, `skeleton-${index}`))) })), showEmptyState && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "flex items-center justify-center h-full p-8", children: emptyState })), messages.length > 0 && shouldVirtualize && (_jsxs("div", { ref: contentRef, className: "relative", style: { height: totalHeight }, children: [_jsx("div", { className: "absolute top-0 left-0 right-0 space-y-4 p-4", style: { transform: `translateY(${offsetY}px)` }, children: visibleItems.map((index) => {
                                    const message = messages[index];
                                    if (!message)
                                        return null;
                                    return (_jsx(Message, { message: message, onCopy: (content) => onMessageCopy?.(message.id, content), onFeedback: (type) => onMessageFeedback?.(message.id, type), onRetry: () => onMessageRetry?.(message.id) }, message.id));
                                }) }), isLoading && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: _jsx(SkeletonMessage, { role: "assistant", lines: 3, variant: "shimmer" }) }))] })), messages.length > 0 && !shouldVirtualize && (_jsxs("div", { className: "space-y-4 p-4", children: [messages.map((message) => (_jsx(Message, { message: message, onCopy: (content) => onMessageCopy?.(message.id, content), onFeedback: (type) => onMessageFeedback?.(message.id, type), onRetry: () => onMessageRetry?.(message.id) }, message.id))), isLoading && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, children: _jsx(SkeletonMessage, { role: "assistant", lines: 3, variant: "shimmer" }) }))] }))] }), _jsx(AnimatePresence, { children: !isNearBottom && messages.length > 0 && (_jsx(motion.div, { className: "absolute bottom-4 right-4", initial: { opacity: 0, y: 20, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 20, scale: 0.9 }, transition: { duration: 0.2 }, children: _jsx(motion.div, { whileHover: INTERACTION_VARIANTS.button.hover, whileTap: INTERACTION_VARIANTS.button.tap, transition: INTERACTION_VARIANTS.button.transition, children: _jsxs(Button, { size: "sm", variant: "secondary", onClick: scrollToBottom, className: "shadow-lg gap-1.5", children: [_jsx(ArrowDownIcon, { size: 16 }), "Scroll to bottom"] }) }) })) })] }));
};
/**
 * Performance tip component for virtualization threshold
 */
export const VirtualizationTip = ({ messageCount }) => {
    if (messageCount < 50)
        return null;
    return (_jsxs("div", { className: "text-xs text-muted-foreground p-2 border-t", children: ["\uD83D\uDCA1 Tip: Virtual scrolling is enabled for better performance with ", messageCount, " messages"] }));
};
//# sourceMappingURL=virtualized-message-list.js.map