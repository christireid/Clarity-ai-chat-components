import { useRef, useState, useCallback, useEffect } from 'react';
/**
 * Custom hook for smart auto-scroll behavior in chat UIs.
 * Only scrolls to bottom when user is near the bottom, respecting manual scrolling.
 *
 * @example
 * ```tsx
 * const { scrollRef, scrollToBottom, isNearBottom, handleScroll } = useAutoScroll(messages.length)
 *
 * return (
 *   <div ref={scrollRef} onScroll={handleScroll}>
 *     {messages.map(...)}
 *   </div>
 * )
 * ```
 */
export function useAutoScroll(messagesLength, options = {}) {
    const { threshold = 100, behavior = 'smooth' } = options;
    const scrollRef = useRef(null);
    const [isNearBottom, setIsNearBottom] = useState(true);
    const scrollToBottom = useCallback(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior,
        });
    }, [behavior]);
    const handleScroll = useCallback(() => {
        if (!scrollRef.current)
            return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        setIsNearBottom(scrollHeight - scrollTop - clientHeight < threshold);
    }, [threshold]);
    useEffect(() => {
        if (isNearBottom) {
            scrollToBottom();
        }
    }, [messagesLength, isNearBottom, scrollToBottom]);
    return { scrollRef, scrollToBottom, isNearBottom, handleScroll };
}
//# sourceMappingURL=useAutoScroll.js.map