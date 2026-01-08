/**
 * Virtual List Component
 * Efficient rendering of large lists using windowing
 * Only renders visible items plus a small buffer
 */
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
/**
 * VirtualList Component
 * Renders only visible items for optimal performance with large lists
 */
export function VirtualList({ items, itemHeight, containerHeight, renderItem, overscan = 3, className, getKey, onScroll, emptyState, }) {
    const containerRef = React.useRef(null);
    const [scrollTop, setScrollTop] = React.useState(0);
    // Calculate visible range
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2;
    const endIndex = Math.min(items.length, startIndex + visibleCount);
    // Get visible items
    const visibleItems = items.slice(startIndex, endIndex);
    // Handle scroll
    const handleScroll = React.useCallback((e) => {
        const newScrollTop = e.currentTarget.scrollTop;
        setScrollTop(newScrollTop);
        onScroll?.(newScrollTop);
    }, [onScroll]);
    // Empty state
    if (items.length === 0) {
        return (_jsx("div", { className: `virtual-list virtual-list-empty ${className || ''}`, style: { height: containerHeight }, children: emptyState || _jsx("div", { className: "virtual-list-no-items", children: "No items" }) }));
    }
    return (_jsx("div", { ref: containerRef, className: `virtual-list ${className || ''}`, style: {
            height: containerHeight,
            overflow: 'auto',
            position: 'relative',
        }, onScroll: handleScroll, role: "list", children: _jsx("div", { style: { height: totalHeight, position: 'relative' }, children: visibleItems.map((item, localIndex) => {
                const actualIndex = startIndex + localIndex;
                const key = getKey ? getKey(item, actualIndex) : actualIndex;
                return (_jsx("div", { role: "listitem", style: {
                        position: 'absolute',
                        top: actualIndex * itemHeight,
                        left: 0,
                        right: 0,
                        height: itemHeight,
                    }, children: renderItem(item, actualIndex) }, key));
            }) }) }));
}
export function AutoSizeVirtualList({ minHeight = 200, maxHeight = 600, ...props }) {
    const containerRef = React.useRef(null);
    const [containerHeight, setContainerHeight] = React.useState(maxHeight);
    // Observe container size changes
    React.useEffect(() => {
        const element = containerRef.current?.parentElement;
        if (!element)
            return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const height = Math.min(Math.max(entry.contentRect.height, minHeight), maxHeight);
                setContainerHeight(height);
            }
        });
        resizeObserver.observe(element);
        return () => resizeObserver.disconnect();
    }, [minHeight, maxHeight]);
    return (_jsx("div", { ref: containerRef, style: { height: '100%' }, children: _jsx(VirtualList, { ...props, containerHeight: containerHeight }) }));
}
/**
 * Scroll to item helper hook
 */
export function useVirtualListScrollTo(items, itemHeight, containerRef) {
    const scrollToIndex = React.useCallback((index, behavior = 'smooth') => {
        if (!containerRef.current)
            return;
        const scrollTop = index * itemHeight;
        containerRef.current.scrollTo({ top: scrollTop, behavior });
    }, [itemHeight, containerRef]);
    const scrollToItem = React.useCallback((predicate, behavior = 'smooth') => {
        const index = items.findIndex(predicate);
        if (index !== -1) {
            scrollToIndex(index, behavior);
        }
    }, [items, scrollToIndex]);
    return { scrollToIndex, scrollToItem };
}
export default VirtualList;
//# sourceMappingURL=virtual-list.js.map