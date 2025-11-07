import * as React from 'react';
/**
 * Observe element intersection with viewport using IntersectionObserver
 * Perfect for lazy loading, infinite scroll, and animations on scroll
 *
 * @example
 * ```tsx
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0.5,
 *   freezeOnceVisible: true
 * })
 *
 * return (
 *   <div
 *     ref={ref}
 *     className={isIntersecting ? 'animate-fade-in' : 'opacity-0'}
 *   >
 *     Content that fades in when 50% visible
 *   </div>
 * )
 * ```
 */
export function useIntersectionObserver(options = {}) {
    const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options;
    const ref = React.useRef(null);
    const [entry, setEntry] = React.useState();
    const frozen = entry?.isIntersecting && freezeOnceVisible;
    React.useEffect(() => {
        const node = ref.current;
        const hasIOSupport = !!window.IntersectionObserver;
        if (!hasIOSupport || frozen || !node)
            return;
        const observerParams = { threshold, root, rootMargin };
        const observer = new IntersectionObserver(([entry]) => setEntry(entry), observerParams);
        observer.observe(node);
        return () => observer.disconnect();
    }, [threshold, root, rootMargin, frozen]);
    return {
        ref,
        entry,
        isIntersecting: !!entry?.isIntersecting,
    };
}
//# sourceMappingURL=use-intersection-observer.js.map