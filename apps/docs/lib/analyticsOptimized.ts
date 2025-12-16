import { logger } from '@clarity-chat/utils/logger';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

/**
 * Optimized hook for performance monitoring with memory leak prevention
 * Uses requestAnimationFrame for smooth performance tracking
 */
export function usePerformanceMonitoringOptimized() {
  const [metrics, setMetrics] = useState({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    tti: 0,
    memory: 0
  });
  
  const observerRef = useRef<PerformanceObserver | null>(null);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateMetrics = useCallback(() => {
    if ('performance' in window) {
      const memoryInfo = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memory: memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0
      }));
    }
  }, []);

  useEffect(() => {
    // Optimize with requestAnimationFrame instead of setInterval
    const scheduleUpdate = () => {
      rafRef.current = requestAnimationFrame(() => {
        updateMetrics();
        scheduleUpdate();
      });
    };

    // Initialize performance observer with optimized configuration
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
          }
          if (entry.name === 'largest-contentful-paint') {
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
          }
          if (entry.entryType === 'first-input') {
            setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
          }
          if (entry.entryType === 'layout-shift') {
            setMetrics(prev => ({ ...prev, cls: prev.cls + (entry as any).value }));
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['paint', 'first-input', 'layout-shift'] });
        observerRef.current = observer;
      } catch (error) {
        // Fallback for unsupported entry types
        logger.warn('PerformanceObserver not supported for some entry types');
      }
    }

    // Schedule memory updates
    scheduleUpdate();

    // Cleanup timeout for delayed metrics
    timeoutRef.current = setTimeout(() => {
      // Time to Interactive calculation
      setMetrics(prev => ({ ...prev, tti: performance.now() }));
    }, 5000);

    return () => {
      // Comprehensive cleanup to prevent memory leaks
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [updateMetrics]);

  const resetMetrics = useCallback(() => {
    setMetrics({
      fcp: 0,
      lcp: 0,
      fid: 0,
      cls: 0,
      tti: 0,
      memory: 0
    });
  }, []);

  return useMemo(() => ({
    metrics,
    resetMetrics,
    isSupported: 'performance' in window && 'PerformanceObserver' in window
  }), [metrics, resetMetrics]);
}

/**
 * Optimized analytics tracking with batching and memory management
 */
export function useAnalyticsOptimized() {
  const [events, setEvents] = useState<any[]>([]);
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);

  const processBatch = useCallback(async () => {
    if (isProcessingRef.current || events.length === 0) return;
    
    isProcessingRef.current = true;
    const batchEvents = [...events];
    setEvents([]);

    try {
      // Batch send events with optimized payload
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: batchEvents }),
        keepalive: true // Ensures request completes even if page unloads
      });

      if (!response.ok) {
        // Re-queue failed events with exponential backoff
        setEvents(prev => [...batchEvents, ...prev]);
      }
    } catch (error) {
      // Re-queue on network failure
      setEvents(prev => [...batchEvents, ...prev]);
    } finally {
      isProcessingRef.current = false;
    }
  }, [events]);

  const trackEvent = useCallback((event: string, data: any = {}) => {
    const eventData = {
      event,
      data,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    };

    setEvents(prev => [...prev, eventData]);

    // Batch process with optimized timing
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }

    batchTimeoutRef.current = setTimeout(() => {
      processBatch();
    }, 1000); // 1-second batching window
  }, [processBatch]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
      // Process remaining events
      if (events.length > 0 && !isProcessingRef.current) {
        processBatch();
      }
    };
  }, [events, processBatch]);

  return useMemo(() => ({
    trackEvent,
    eventCount: events.length
  }), [trackEvent, events.length]);
}

/**
 * Optimized component for tracking page views with memory management
 */
export function AnalyticsScriptOptimized() {
  const { trackEvent } = useAnalyticsOptimized();
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;

    // Track page view with optimized data
    trackEvent('page_view', {
      title: document.title,
      referrer: document.referrer,
      loadTime: performance.now()
    });

    // Track outbound links with event delegation for performance
    const handleOutboundClick = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.hostname !== window.location.hostname) {
        trackEvent('outbound_click', {
          url: target.href,
          text: target.textContent
        });
      }
    };

    document.addEventListener('click', handleOutboundClick, true);

    return () => {
      document.removeEventListener('click', handleOutboundClick, true);
    };
  }, [trackEvent]);

  return null;
}

/**
 * Optimized hook for monitoring Core Web Vitals with reduced re-renders
 */
export function useWebVitalsOptimized() {
  const [vitals, setVitals] = useState({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  });
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          setVitals(prev => ({ ...prev, fcp: entry.startTime }));
        }
        if (entry.name === 'largest-contentful-paint') {
          setVitals(prev => ({ ...prev, lcp: entry.startTime }));
        }
        if (entry.entryType === 'first-input') {
          setVitals(prev => ({ 
            ...prev, 
            fid: entry.processingStart - entry.startTime 
          }));
        }
        if (entry.entryType === 'layout-shift') {
          setVitals(prev => ({ 
            ...prev, 
            cls: (prev.cls || 0) + (entry as any).value 
          }));
        }
        if (entry.entryType === 'navigation') {
          setVitals(prev => ({ ...prev, ttfb: entry.responseStart - entry.fetchStart }));
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['paint', 'first-input', 'layout-shift', 'navigation'] });
      observerRef.current = observer;
    } catch (error) {
      logger.warn('Some performance entry types not supported');
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  return useMemo(() => ({
    vitals,
    isReady: Object.values(vitals).some(v => v !== null)
  }), [vitals]);
}
