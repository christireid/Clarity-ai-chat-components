/**
 * Analytics Hooks
 *
 * Convenience hooks for common analytics patterns
 */
import * as React from 'react';
import { useAnalytics } from './AnalyticsProvider';
import { AnalyticsEvents } from './types';
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
export function useTrackMount(eventName, properties) {
    const { track } = useAnalytics();
    React.useEffect(() => {
        track(eventName, properties);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
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
export function useTrackUnmount(eventName, properties) {
    const { track } = useAnalytics();
    React.useEffect(() => {
        return () => {
            const props = typeof properties === 'function' ? properties() : properties;
            track(eventName, props);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
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
export function useTrackChange(eventName, value, properties) {
    const { track } = useAnalytics();
    const prevValue = React.useRef(value);
    React.useEffect(() => {
        if (prevValue.current !== value) {
            const props = typeof properties === 'function' ? properties(value) : properties;
            track(eventName, { value, ...props });
            prevValue.current = value;
        }
    }, [value, eventName, properties, track]);
}
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
export function useTrackVisibility(eventName, properties, options) {
    const { track } = useAnalytics();
    const ref = React.useRef(null);
    const hasTracked = React.useRef(false);
    React.useEffect(() => {
        const element = ref.current;
        if (!element)
            return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasTracked.current) {
                track(eventName, properties);
                hasTracked.current = true;
            }
        }, options);
        observer.observe(element);
        return () => {
            observer.disconnect();
        };
    }, [eventName, properties, track, options]);
    return ref;
}
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
export function useTrackClick(eventName, properties) {
    const { track } = useAnalytics();
    return React.useCallback((event) => {
        const props = typeof properties === 'function' ? properties(event) : properties;
        track(eventName, props);
    }, [eventName, properties, track]);
}
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
export function useTrackSubmit(eventName, properties) {
    const { track } = useAnalytics();
    return React.useCallback((event) => {
        const props = typeof properties === 'function' ? properties(event) : properties;
        track(eventName, props);
    }, [eventName, properties, track]);
}
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
export function useTrackError() {
    const { track } = useAnalytics();
    return React.useCallback((error, properties) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        track(AnalyticsEvents.ERROR_OCCURRED, {
            error: errorMessage,
            stack: errorStack,
            ...properties,
        });
    }, [track]);
}
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
export function useTrackTiming() {
    const { track } = useAnalytics();
    const timers = React.useRef({});
    const startTimer = React.useCallback((timerName) => {
        timers.current[timerName] = performance.now();
    }, []);
    const endTimer = React.useCallback((timerName, properties) => {
        const startTime = timers.current[timerName];
        if (startTime === undefined) {
            console.warn(`Timer "${timerName}" was not started`);
            return;
        }
        const duration = performance.now() - startTime;
        delete timers.current[timerName];
        track(AnalyticsEvents.PERFORMANCE_MEASURED, {
            timer_name: timerName,
            duration_ms: Math.round(duration),
            ...properties,
        });
    }, [track]);
    return { startTimer, endTimer };
}
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
export function useTrackFeature(eventName, debounceMs = 0) {
    const { track } = useAnalytics();
    const timeoutRef = React.useRef();
    return React.useCallback((properties) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (debounceMs > 0) {
            timeoutRef.current = setTimeout(() => {
                track(eventName, properties);
            }, debounceMs);
        }
        else {
            track(eventName, properties);
        }
    }, [eventName, debounceMs, track]);
}
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
export function useTrackScrollDepth(eventName, thresholds = [25, 50, 75, 100], properties) {
    const { track } = useAnalytics();
    const trackedThresholds = React.useRef(new Set());
    React.useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            thresholds.forEach(threshold => {
                if (scrollPercentage >= threshold && !trackedThresholds.current.has(threshold)) {
                    trackedThresholds.current.add(threshold);
                    track(eventName, {
                        scroll_depth: threshold,
                        ...properties,
                    });
                }
            });
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [eventName, thresholds, properties, track]);
}
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
export function useTrackTimeOnPage(eventName, properties) {
    const { track } = useAnalytics();
    const startTime = React.useRef(Date.now());
    React.useEffect(() => {
        return () => {
            const timeSpent = Date.now() - startTime.current;
            track(eventName, {
                time_spent_ms: timeSpent,
                time_spent_seconds: Math.round(timeSpent / 1000),
                ...properties,
            });
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
//# sourceMappingURL=hooks.js.map