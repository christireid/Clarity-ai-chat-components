/**
 * Virtualized Message List
 *
 * Efficient rendering for large conversations (1000+ messages) using
 * react-window for virtual scrolling.
 *
 * @blueprint Feature 6.1 - Virtual Scrolling
 * @priority HIGH
 * @status NEW - Implementation based on blueprint analysis
 */
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback, useEffect, useReducer, useRef, useState, } from 'react';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
// Type assertions for react-window v1.8.11 with React 19
// AutoSizer component type assertion for compatibility
const AutoSizerComponent = AutoSizer;
// List component - using 'as any' to work around strict generic type constraints with refs
// Note: react-window v2 has breaking API changes, staying on v1.8.11 for compatibility
const ListComponent = List;
// ============================================================================
// Message Height Cache
// ============================================================================
class MessageHeightCache {
    heights = new Map();
    defaultHeight;
    constructor(defaultHeight = 150) {
        this.defaultHeight = defaultHeight;
    }
    setHeight(key, height) {
        this.heights.set(key, height);
    }
    getHeight(key) {
        return this.heights.get(key) || this.defaultHeight;
    }
    hasHeight(key) {
        return this.heights.has(key);
    }
    clear() {
        this.heights.clear();
    }
}
function MessageItem({ index, style, data }) {
    const { messages, renderMessage, heightCache, setItemHeight } = data;
    const message = messages[index];
    const itemRef = React.useRef(null);
    React.useEffect(() => {
        if (itemRef.current && message) {
            const height = itemRef.current.offsetHeight;
            const messageKey = message.id || `msg-${index}`;
            if (!heightCache.hasHeight(messageKey) ||
                heightCache.getHeight(messageKey) !== height) {
                heightCache.setHeight(messageKey, height);
                setItemHeight(index, height);
            }
        }
    }, [message, index, heightCache, setItemHeight]);
    if (!message) {
        return _jsx("div", { style: style });
    }
    return (_jsx("div", { style: style, children: _jsx("div", { ref: itemRef, children: renderMessage(message, index) }) }));
}
// ============================================================================
// Virtualized Message List Component
// ============================================================================
/**
 * VirtualizedMessageList - Enhanced with React 19 features
 *
 * React 19 Enhancements:
 * - Keeps performance-critical useCallback (for react-window integration)
 * - Compiler optimizes the rest automatically
 * - Note: Some callbacks kept for stable refs required by react-window
 */
export function VirtualizedMessageList({ messages, renderMessage, estimatedItemSize = 150, overscanCount = 3, autoScrollToBottom = true, onScroll, className, itemKey, }) {
    const listRef = React.useRef(null);
    const heightCacheRef = React.useRef(new MessageHeightCache(estimatedItemSize));
    // Replace force update anti-pattern with useReducer
    const [, forceRender] = React.useReducer((x) => x + 1, 0);
    const previousMessagesLength = React.useRef(messages.length);
    const isNearBottomRef = React.useRef(true);
    // Track if user is near bottom
    // React 19: Keep useCallback for stable ref (required by react-window)
    const handleScroll = React.useCallback(({ scrollOffset, scrollUpdateWasRequested, }) => {
        if (!scrollUpdateWasRequested && listRef.current) {
            const list = listRef.current;
            const scrollHeight = messages.reduce((sum, msg, i) => sum + heightCacheRef.current.getHeight(msg.id || `msg-${i}`), 0);
            const clientHeight = list._outerRef
                ?.clientHeight || 600;
            const threshold = 100; // px from bottom
            isNearBottomRef.current =
                scrollHeight - (scrollOffset + clientHeight) < threshold;
        }
        onScroll?.(scrollOffset);
    }, [messages, onScroll]);
    // Auto-scroll to bottom on new messages
    React.useEffect(() => {
        if (autoScrollToBottom &&
            messages.length > previousMessagesLength.current &&
            isNearBottomRef.current &&
            listRef.current) {
            listRef.current.scrollToItem(messages.length - 1, 'end');
        }
        previousMessagesLength.current = messages.length;
    }, [messages.length, autoScrollToBottom]);
    // Get item height from cache
    // React 19: Keep useCallback - passed to react-window, needs stable ref
    const getItemSize = React.useCallback((index) => {
        const message = messages[index];
        const key = message?.id || `msg-${index}`;
        return heightCacheRef.current.getHeight(key);
    }, [messages]);
    // Update item height and trigger re-render
    // React 19: Keep useCallback - passed to child components, needs stable ref
    const setItemHeight = React.useCallback((index, height) => {
        if (listRef.current) {
            listRef.current.resetAfterIndex(index, false);
            forceRender();
        }
    }, []);
    // Get item key
    // React 19: Keep useCallback - passed to react-window, needs stable ref
    const getItemKey = React.useCallback((index, data) => {
        return (itemKey?.(index, data.messages) ||
            data.messages[index]?.id ||
            `msg-${index}`);
    }, [itemKey]);
    // Clear cache when messages change dramatically
    React.useEffect(() => {
        if (Math.abs(messages.length - previousMessagesLength.current) > 50) {
            heightCacheRef.current.clear();
        }
    }, [messages.length]);
    // Check if any message is currently streaming (for aria-busy)
    // React 19 compiler auto-memoizes; useMemo added for React 18 compatibility
    const isStreaming = React.useMemo(() => messages.some((m) => m.status === 'streaming'), [messages]);
    return (_jsx("div", { className: className, style: { height: '100%', width: '100%' }, role: "log", "aria-label": "Chat messages", "aria-live": "polite", "aria-relevant": "additions", "aria-busy": isStreaming, children: _jsx(AutoSizerComponent, { children: ({ height: _height, width }) => (_jsx(ListComponent, { ref: listRef, height: _height, width: width, itemCount: messages.length, itemSize: getItemSize, itemData: {
                    messages,
                    renderMessage,
                    heightCache: heightCacheRef.current,
                    setItemHeight,
                }, itemKey: getItemKey, overscanCount: overscanCount, onScroll: handleScroll, children: MessageItem })) }) }));
}
// ============================================================================
// Smart Message List (Auto-enables virtualization)
// ============================================================================
export function AutoVirtualizedMessageList({ messages, renderMessage, virtualizationThreshold = 100, ...props }) {
    const shouldVirtualize = messages.length > virtualizationThreshold;
    if (shouldVirtualize) {
        return (_jsx(VirtualizedMessageList, { messages: messages, renderMessage: renderMessage, ...props }));
    }
    // Standard rendering for small lists
    // Check if any message is currently streaming (for aria-busy)
    // React 19 compiler auto-memoizes; useMemo added for React 18 compatibility
    const isStreaming = React.useMemo(() => messages.some((m) => m.status === 'streaming'), [messages]);
    return (_jsx("div", { className: props.className, role: "log", "aria-label": "Chat messages", "aria-live": "polite", "aria-relevant": "additions", "aria-busy": isStreaming, children: messages.map((message, index) => (_jsx("div", { children: renderMessage(message, index) }, message.id || `msg-${index}`))) }));
}
// ============================================================================
// Utility Hooks
// ============================================================================
/**
 * Hook to manage scroll position and auto-scroll behavior
 */
export function useMessageListScroll(messages, options = {}) {
    const { autoScroll = true, scrollThreshold = 100 } = options;
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [userHasScrolledUp, setUserHasScrolledUp] = useState(false);
    const handleScroll = useCallback((_scrollOffset) => {
        // This would need the total height to work properly
        // Implementation depends on the container
        setUserHasScrolledUp(!isNearBottom);
    }, [isNearBottom]);
    const scrollToBottom = useCallback(() => {
        // Implementation depends on ref to list component
        setUserHasScrolledUp(false);
        setIsNearBottom(true);
    }, []);
    return {
        isNearBottom,
        userHasScrolledUp,
        handleScroll,
        scrollToBottom,
        shouldAutoScroll: autoScroll && isNearBottom,
    };
}
/**
 * Hook to implement "Jump to bottom" button
 */
export function useJumpToBottom(isNearBottom) {
    const [showButton, setShowButton] = useState(false);
    const [newMessageCount, setNewMessageCount] = useState(0);
    useEffect(() => {
        setShowButton(!isNearBottom && newMessageCount > 0);
    }, [isNearBottom, newMessageCount]);
    const incrementNewMessages = useCallback(() => {
        if (!isNearBottom) {
            setNewMessageCount((prev) => prev + 1);
        }
    }, [isNearBottom]);
    const resetNewMessages = useCallback(() => {
        setNewMessageCount(0);
        setShowButton(false);
    }, []);
    return {
        showButton,
        newMessageCount,
        incrementNewMessages,
        resetNewMessages,
    };
}
// ============================================================================
// Performance Monitoring
// ============================================================================
export function useMessageListPerformance(messages) {
    const [metrics, setMetrics] = useState({
        renderTime: 0,
        messageCount: 0,
        averageHeight: 0,
    });
    useEffect(() => {
        const startTime = performance.now();
        // Measure after render
        requestIdleCallback(() => {
            const endTime = performance.now();
            setMetrics({
                renderTime: endTime - startTime,
                messageCount: messages.length,
                averageHeight: 150, // Would calculate from actual heights
            });
        });
    }, [messages.length]);
    return metrics;
}
export default VirtualizedMessageList;
//# sourceMappingURL=virtualized-message-list.js.map