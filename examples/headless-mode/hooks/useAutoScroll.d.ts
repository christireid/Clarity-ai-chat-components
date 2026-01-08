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
export declare function useAutoScroll(messagesLength: number, options?: {
    threshold?: number;
    behavior?: ScrollBehavior;
}): {
    scrollRef: any;
    scrollToBottom: any;
    isNearBottom: any;
    handleScroll: any;
};
//# sourceMappingURL=useAutoScroll.d.ts.map