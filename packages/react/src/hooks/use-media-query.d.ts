/**
 * Track media query matches with SSR support
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * const isDark = useMediaQuery('(prefers-color-scheme: dark)')
 * const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
 *
 * return isMobile ? <MobileNav /> : <DesktopNav />
 * ```
 */
export declare function useMediaQuery(query: string): boolean;
/**
 * Get current breakpoint based on Tailwind's defaults
 *
 * @example
 * ```tsx
 * const breakpoint = useBreakpoint()
 *
 * // Returns: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'base'
 * return breakpoint === 'md' ? <TabletView /> : <MobileView />
 * ```
 */
export declare function useBreakpoint(): 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
//# sourceMappingURL=use-media-query.d.ts.map