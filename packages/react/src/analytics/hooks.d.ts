/**
 * Analytics Hooks
 *
 * Convenience hooks for common analytics patterns
 */
import * as React from 'react';
/**
 * Track when a component mounts
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useTrackMount('my_component_mounted', { source: 'homepage' })
 *   return <div>Content</div>
 * }
 * ```
 */
export declare function useTrackMount(eventName: string, properties?: Record<string, any>): void;
/**
 * Track when a component unmounts
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useTrackUnmount('my_component_unmounted', { duration: performance.now() })
 *   return <div>Content</div>
 * }
 * ```
 */
export declare function useTrackUnmount(eventName: string, properties?: Record<string, any> | (() => Record<string, any>)): void;
/**
 * Track when a value changes
 *
 * @example
 * ```tsx
 * function SearchInput() {
 *   const [query, setQuery] = useState('')
 *
 *   useTrackChange('search_query_changed', query, {
 *     query_length: query.length
 *   })
 *
 *   return <input value={query} onChange={e => setQuery(e.target.value)} />
 * }
 * ```
 */
export declare function useTrackChange(eventName: string, value: any, properties?: Record<string, any> | ((value: any) => Record<string, any>)): void;
/**
 * Track visibility changes (element enters/leaves viewport)
 *
 * @example
 * ```tsx
 * function Banner() {
 *   const ref = useTrackVisibility('banner_viewed', { banner_id: '123' })
 *   return <div ref={ref}>Banner Content</div>
 * }
 * ```
 */
export declare function useTrackVisibility<T extends HTMLElement = HTMLDivElement>(eventName: string, properties?: Record<string, any>, options?: IntersectionObserverInit): React.RefObject<T>;
/**
 * Track click events
 *
 * @example
 * ```tsx
 * function Button() {
 *   const handleClick = useTrackClick('button_clicked', { button_name: 'submit' })
 *   return <button onClick={handleClick}>Submit</button>
 * }
 * ```
 */
export declare function useTrackClick(eventName: string, properties?: Record<string, any> | ((event: React.MouseEvent) => Record<string, any>)): (event: React.MouseEvent) => void;
/**
 * Track form submissions
 *
 * @example
 * ```tsx
 * function ContactForm() {
 *   const handleSubmit = useTrackSubmit('form_submitted', { form_name: 'contact' })
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="email" />
 *       <button type="submit">Submit</button>
 *     </form>
 *   )
 * }
 * ```
 */
export declare function useTrackSubmit(eventName: string, properties?: Record<string, any> | ((event: React.FormEvent) => Record<string, any>)): (event: React.FormEvent) => void;
/**
 * Track errors
 *
 * @example
 * ```tsx
 * function DataFetcher() {
 *   const trackError = useTrackError()
 *
 *   const fetchData = async () => {
 *     try {
 *       await api.getData()
 *     } catch (error) {
 *       trackError(error, { context: 'data_fetch' })
 *     }
 *   }
 *
 *   return <button onClick={fetchData}>Fetch</button>
 * }
 * ```
 */
export declare function useTrackError(): (error: Error | unknown, properties?: Record<string, any>) => void;
/**
 * Track timing/performance metrics
 *
 * @example
 * ```tsx
 * function DataLoader() {
 *   const { startTimer, endTimer } = useTrackTiming()
 *
 *   const loadData = async () => {
 *     startTimer('data_load')
 *     await fetchData()
 *     endTimer('data_load', { data_size: '1MB' })
 *   }
 *
 *   return <button onClick={loadData}>Load Data</button>
 * }
 * ```
 */
export declare function useTrackTiming(): {
    startTimer: (timerName: string) => void;
    endTimer: (timerName: string, properties?: Record<string, any>) => void;
};
/**
 * Track feature usage with debouncing
 *
 * Useful for tracking frequent user actions without overwhelming analytics
 *
 * @example
 * ```tsx
 * function SearchInput() {
 *   const trackSearch = useTrackFeature('search_used', 500)
 *
 *   const handleChange = (e) => {
 *     trackSearch({ query: e.target.value })
 *   }
 *
 *   return <input onChange={handleChange} />
 * }
 * ```
 */
export declare function useTrackFeature(eventName: string, debounceMs?: number): (properties?: Record<string, any>) => void;
/**
 * Track scroll depth
 *
 * Tracks when user scrolls to certain percentages of the page
 *
 * @example
 * ```tsx
 * function Article() {
 *   useTrackScrollDepth('article_scrolled', [25, 50, 75, 100])
 *   return <article>Long content...</article>
 * }
 * ```
 */
export declare function useTrackScrollDepth(eventName: string, thresholds?: number[], properties?: Record<string, any>): void;
/**
 * Track time spent on page
 *
 * @example
 * ```tsx
 * function ArticlePage() {
 *   useTrackTimeOnPage('article_time_spent', { article_id: '123' })
 *   return <article>Content</article>
 * }
 * ```
 */
export declare function useTrackTimeOnPage(eventName: string, properties?: Record<string, any>): void;
//# sourceMappingURL=hooks.d.ts.map