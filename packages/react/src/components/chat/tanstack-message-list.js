/**
 * TanStack Virtual Message List
 *
 * Modern virtualization using @tanstack/react-virtual for efficient
 * rendering of large conversation lists with dynamic row heights.
 *
 * Key improvements over react-window:
 * - Built-in dynamic height measurement
 * - No external AutoSizer needed
 * - Better TypeScript support
 * - Smaller bundle size
 * - More flexible APIs
 *
 * @see https://tanstack.com/virtual/latest
 * @license MIT (TanStack Virtual)
 */
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@clarity-chat/primitives';
// ============================================================================
// TanStack Virtual Message List Component
// ============================================================================
/**
 * TanStackMessageList - Modern virtualized list using TanStack Virtual
 *
 * Features:
 * - Dynamic row height measurement
 * - Smooth scrolling support
 * - Auto-scroll to bottom
 * - Efficient re-renders with React 19 patterns
 */
export function TanStackMessageList({ messages, renderMessage, estimatedItemSize = 150, overscanCount = 5, autoScrollToBottom = true, onScroll, className, height = '100%', smoothScroll = true, gap = 8, getItemKey, onScrollAwayFromBottom, scrollThreshold = 100, }) {
    const parentRef = React.useRef(null);
    const previousMessagesLength = React.useRef(messages.length);
    const isNearBottomRef = React.useRef(true);
    const lastScrollTop = React.useRef(0);
    // Default key getter
    const itemKey = React.useCallback((index) => {
        if (getItemKey)
            return getItemKey(index);
        return messages[index]?.id || `msg-${index}`;
    }, [getItemKey, messages]);
    // Create virtualizer
    const virtualizer = useVirtualizer({
        count: messages.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => estimatedItemSize,
        overscan: overscanCount,
        getItemKey: itemKey,
        // Enable dynamic measurement
        measureElement: (element) => element.getBoundingClientRect().height + gap,
    });
    // Handle scroll events
    const handleScroll = React.useCallback((e) => {
        const target = e.currentTarget;
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;
        // Check if near bottom
        const wasNearBottom = isNearBottomRef.current;
        isNearBottomRef.current =
            scrollHeight - (scrollTop + clientHeight) < scrollThreshold;
        // Detect scroll away from bottom
        if (wasNearBottom && !isNearBottomRef.current) {
            onScrollAwayFromBottom?.();
        }
        lastScrollTop.current = scrollTop;
        onScroll?.(scrollTop);
    }, [onScroll, onScrollAwayFromBottom, scrollThreshold]);
    // Auto-scroll to bottom on new messages
    React.useEffect(() => {
        if (autoScrollToBottom &&
            messages.length > previousMessagesLength.current &&
            isNearBottomRef.current) {
            virtualizer.scrollToIndex(messages.length - 1, {
                align: 'end',
                behavior: smoothScroll ? 'smooth' : 'auto',
            });
        }
        previousMessagesLength.current = messages.length;
    }, [messages.length, autoScrollToBottom, smoothScroll, virtualizer]);
    // Check if any message is streaming
    const isStreaming = React.useMemo(() => messages.some((m) => m.status === 'streaming'), [messages]);
    // Get virtual items
    const virtualItems = virtualizer.getVirtualItems();
    return (_jsx("div", { ref: parentRef, className: cn('overflow-auto', className), style: { height, contain: 'strict' }, onScroll: handleScroll, role: "log", "aria-label": "Chat messages", "aria-live": "polite", "aria-relevant": "additions", "aria-busy": isStreaming, children: _jsx("div", { style: {
                height: virtualizer.getTotalSize(),
                width: '100%',
                position: 'relative',
            }, children: virtualItems.map((virtualItem) => {
                const message = messages[virtualItem.index];
                if (!message)
                    return null;
                return (_jsx("div", { "data-index": virtualItem.index, ref: virtualizer.measureElement, style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualItem.start}px)`,
                    }, children: renderMessage(message, virtualItem.index) }, virtualItem.key));
            }) }) }));
}
TanStackMessageList.displayName = 'TanStackMessageList';
/**
 * AutoTanStackMessageList - Automatically enables virtualization
 * for large message lists
 */
export function AutoTanStackMessageList({ messages, renderMessage, virtualizationThreshold = 50, className, ...props }) {
    const shouldVirtualize = messages.length > virtualizationThreshold;
    // Check if any message is streaming
    const isStreaming = React.useMemo(() => messages.some((m) => m.status === 'streaming'), [messages]);
    if (shouldVirtualize) {
        return (_jsx(TanStackMessageList, { messages: messages, renderMessage: renderMessage, className: className, ...props }));
    }
    // Standard rendering for small lists
    return (_jsx("div", { className: cn('overflow-auto', className), style: { height: props.height || '100%' }, role: "log", "aria-label": "Chat messages", "aria-live": "polite", "aria-relevant": "additions", "aria-busy": isStreaming, children: messages.map((message, index) => (_jsx("div", { style: { marginBottom: props.gap || 8 }, children: renderMessage(message, index) }, message.id || `msg-${index}`))) }));
}
AutoTanStackMessageList.displayName = 'AutoTanStackMessageList';
/**
 * Hook for controlling scroll behavior in message lists
 */
export function useMessageListScrollControl(virtualizerRef, messageCount, options = {}) {
    const { autoScroll = true, scrollThreshold = 100, smoothScroll = true, } = options;
    const [isNearBottom, setIsNearBottom] = React.useState(true);
    const [userHasScrolledUp, setUserHasScrolledUp] = React.useState(false);
    const [newMessageCount, setNewMessageCount] = React.useState(0);
    const previousMessageCount = React.useRef(messageCount);
    // Track new messages when scrolled away
    React.useEffect(() => {
        if (messageCount > previousMessageCount.current && !isNearBottom) {
            setNewMessageCount((prev) => prev + (messageCount - previousMessageCount.current));
        }
        previousMessageCount.current = messageCount;
    }, [messageCount, isNearBottom]);
    const scrollToBottom = React.useCallback(() => {
        virtualizerRef.current?.scrollToIndex(messageCount - 1, {
            align: 'end',
            behavior: smoothScroll ? 'smooth' : 'auto',
        });
        setUserHasScrolledUp(false);
        setNewMessageCount(0);
        setIsNearBottom(true);
    }, [virtualizerRef, messageCount, smoothScroll]);
    const scrollToIndex = React.useCallback((index) => {
        virtualizerRef.current?.scrollToIndex(index, {
            align: 'center',
            behavior: smoothScroll ? 'smooth' : 'auto',
        });
    }, [virtualizerRef, smoothScroll]);
    const resetNewMessages = React.useCallback(() => {
        setNewMessageCount(0);
    }, []);
    const handleScroll = React.useCallback((_scrollOffset) => {
        // Scroll state is typically managed by the virtualizer
        // This is for external tracking
    }, []);
    return {
        isNearBottom,
        userHasScrolledUp,
        newMessageCount,
        scrollToBottom,
        scrollToIndex,
        resetNewMessages,
        handleScroll,
    };
}
/**
 * Hook for implementing a "Jump to Bottom" button
 */
export function useJumpToBottom(scrollControl) {
    const showButton = !scrollControl.isNearBottom && scrollControl.newMessageCount > 0;
    const handleClick = React.useCallback(() => {
        scrollControl.scrollToBottom();
    }, [scrollControl]);
    return {
        showButton,
        unreadCount: scrollControl.newMessageCount,
        handleClick,
    };
}
// ============================================================================
// Exports
// ============================================================================
export default TanStackMessageList;
//# sourceMappingURL=tanstack-message-list.js.map