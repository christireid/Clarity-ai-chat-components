'use client';
import { useRef, useState, useCallback, useEffect, useLayoutEffect, } from 'react';
import { useSafeAnimationFrame } from './use-safe-timeout';
/**
 * Auto-scroll to bottom of container when new content is added
 * Only scrolls if user is near bottom to avoid disrupting manual scrolling
 *
 * @example
 * ```tsx
 * const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
 *   dependencies: [messages],
 *   threshold: 50
 * })
 *
 * return (
 *   <div ref={scrollRef} className="overflow-y-auto">
 *     {messages.map(msg => <Message key={msg.id} {...msg} />)}
 *     {!isNearBottom && (
 *       <button onClick={scrollToBottom}>Scroll to bottom</button>
 *     )}
 *   </div>
 * )
 * ```
 */
export function useAutoScroll(options = {}) {
    const { enabled: initialEnabled = true, behavior = 'smooth', threshold = 100, dependencies = [], } = options;
    const scrollRef = useRef(null);
    const [enabled, setEnabled] = useState(initialEnabled);
    const [isNearBottom, setIsNearBottom] = useState(true);
    const { requestSafeAnimationFrame } = useSafeAnimationFrame();
    // Check if user is near bottom (store in ref to avoid dependency issues)
    const checkIfNearBottomRef = useRef(() => {
        const element = scrollRef.current;
        if (!element)
            return false;
        const { scrollTop, scrollHeight, clientHeight } = element;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        return distanceFromBottom <= threshold;
    });
    useLayoutEffect(() => {
        checkIfNearBottomRef.current = () => {
            const element = scrollRef.current;
            if (!element)
                return false;
            const { scrollTop, scrollHeight, clientHeight } = element;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
            return distanceFromBottom <= threshold;
        };
    }, [threshold]);
    // Scroll to bottom (store in ref to avoid dependency issues)
    const scrollToBottomRef = useRef(() => {
        const element = scrollRef.current;
        if (!element)
            return;
        element.scrollTo({
            top: element.scrollHeight,
            behavior,
        });
    });
    useLayoutEffect(() => {
        scrollToBottomRef.current = () => {
            const element = scrollRef.current;
            if (!element)
                return;
            element.scrollTo({
                top: element.scrollHeight,
                behavior,
            });
        };
    }, [behavior]);
    // Public API functions
    const checkIfNearBottom = useCallback(() => {
        return checkIfNearBottomRef.current();
    }, []);
    const scrollToBottom = useCallback(() => {
        scrollToBottomRef.current();
    }, []);
    // Update isNearBottom on scroll
    useEffect(() => {
        const element = scrollRef.current;
        if (!element)
            return;
        const handleScroll = () => {
            setIsNearBottom(checkIfNearBottomRef.current());
        };
        element.addEventListener('scroll', handleScroll, { passive: true });
        return () => element.removeEventListener('scroll', handleScroll);
    }, []); // Function accessed via ref
    // Auto-scroll when dependencies change
    useEffect(() => {
        if (!enabled)
            return;
        const wasNearBottom = checkIfNearBottomRef.current();
        if (wasNearBottom) {
            // Use safe requestAnimationFrame to ensure DOM has updated and cleanup on unmount
            requestSafeAnimationFrame(() => {
                scrollToBottomRef.current();
            });
        }
    }, [enabled, requestSafeAnimationFrame, ...dependencies]); // Functions accessed via refs
    return {
        scrollRef,
        isNearBottom,
        scrollToBottom,
        setEnabled,
    };
}
//# sourceMappingURL=use-auto-scroll.js.map