import * as React from 'react';
export interface UseAutoScrollOptions {
    /**
     * Whether auto-scroll is enabled
     * @default true
     */
    enabled?: boolean;
    /**
     * Scroll behavior
     * @default 'smooth'
     */
    behavior?: ScrollBehavior;
    /**
     * Distance from bottom (px) to trigger auto-scroll
     * @default 100
     */
    threshold?: number;
    /**
     * Dependencies that trigger scroll check
     */
    dependencies?: React.DependencyList;
}
export interface UseAutoScrollReturn {
    /**
     * Ref to attach to scrollable container
     */
    scrollRef: React.RefObject<HTMLElement>;
    /**
     * Whether user is near bottom
     */
    isNearBottom: boolean;
    /**
     * Manually scroll to bottom
     */
    scrollToBottom: () => void;
    /**
     * Manually enable/disable auto-scroll
     */
    setEnabled: (enabled: boolean) => void;
}
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
export declare function useAutoScroll(options?: UseAutoScrollOptions): UseAutoScrollReturn;
//# sourceMappingURL=use-auto-scroll.d.ts.map