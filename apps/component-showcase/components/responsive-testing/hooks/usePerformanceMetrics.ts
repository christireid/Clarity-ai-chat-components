'use client'

import { useState, useEffect, useCallback } from 'react'

export interface WebVitals {
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  fcp: number // First Contentful Paint
  ttfb: number // Time to First Byte
  tti: number // Time to Interactive
}

export interface PerformanceMetrics extends WebVitals {
  fps: number
  memory: number
  networkLatency: number
  bundleSize: number
}

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({})
  const [isMonitoring, setIsMonitoring] = useState(false)

  const measureWebVitals = useCallback((): Partial<WebVitals> => {
    const vitals: Partial<WebVitals> = {}

    if (typeof window === 'undefined' || !('performance' in window)) {
      return vitals
    }

    try {
      // First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint')
      const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint')
      if (fcp) {
        vitals.fcp = Math.round(fcp.startTime)
      }

      // Time to First Byte
      const navEntries = performance.getEntriesByType('navigation')
      if (navEntries.length > 0) {
        const navEntry = navEntries[0] as PerformanceNavigationTiming
        vitals.ttfb = Math.round(navEntry.responseStart - navEntry.requestStart)
      }

      // Largest Contentful Paint (requires observer)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1] as any
            if (lastEntry) {
              vitals.lcp = Math.round(lastEntry.renderTime || lastEntry.loadTime)
              setMetrics((prev) => ({ ...prev, lcp: vitals.lcp }))
            }
          })
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        } catch (e) {
          console.warn('LCP observation failed:', e)
        }
      }

      // Cumulative Layout Shift (requires observer)
      if ('PerformanceObserver' in window) {
        try {
          let clsValue = 0
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value
                vitals.cls = Math.round(clsValue * 1000) / 1000
                setMetrics((prev) => ({ ...prev, cls: vitals.cls }))
              }
            }
          })
          clsObserver.observe({ entryTypes: ['layout-shift'] })
        } catch (e) {
          console.warn('CLS observation failed:', e)
        }
      }

      // First Input Delay (requires observer)
      if ('PerformanceObserver' in window) {
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const firstInput = entries[0] as any
            if (firstInput) {
              vitals.fid = Math.round(firstInput.processingStart - firstInput.startTime)
              setMetrics((prev) => ({ ...prev, fid: vitals.fid }))
            }
          })
          fidObserver.observe({ entryTypes: ['first-input'] })
        } catch (e) {
          console.warn('FID observation failed:', e)
        }
      }
    } catch (error) {
      console.error('Failed to measure web vitals:', error)
    }

    return vitals
  }, [])

  const measureFPS = useCallback(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let fps = 60

    const countFrame = (time: number) => {
      frameCount++
      const delta = time - lastTime

      if (delta >= 1000) {
        fps = Math.round((frameCount * 1000) / delta)
        frameCount = 0
        lastTime = time
        setMetrics((prev) => ({ ...prev, fps }))
      }

      if (isMonitoring) {
        requestAnimationFrame(countFrame)
      }
    }

    requestAnimationFrame(countFrame)
  }, [isMonitoring])

  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory
      const usagePercent = Math.round((memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100)
      setMetrics((prev) => ({ ...prev, memory: usagePercent }))
    }
  }, [])

  const measureNetworkLatency = useCallback(() => {
    const startTime = performance.now()
    fetch('/api/ping', { method: 'HEAD' })
      .then(() => {
        const latency = Math.round(performance.now() - startTime)
        setMetrics((prev) => ({ ...prev, networkLatency: latency }))
      })
      .catch(() => {
        // Ignore errors
      })
  }, [])

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)
    const vitals = measureWebVitals()
    setMetrics((prev) => ({ ...prev, ...vitals }))
  }, [measureWebVitals])

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
  }, [])

  useEffect(() => {
    if (!isMonitoring) return

    measureFPS()
    measureMemory()
    measureNetworkLatency()

    const memoryInterval = setInterval(measureMemory, 1000)
    const networkInterval = setInterval(measureNetworkLatency, 5000)

    return () => {
      clearInterval(memoryInterval)
      clearInterval(networkInterval)
    }
  }, [isMonitoring, measureFPS, measureMemory, measureNetworkLatency])

  const getScore = useCallback((metric: keyof WebVitals, value: number): number => {
    const thresholds = {
      lcp: { good: 2500, needsImprovement: 4000 },
      fid: { good: 100, needsImprovement: 300 },
      cls: { good: 0.1, needsImprovement: 0.25 },
      fcp: { good: 1800, needsImprovement: 3000 },
      ttfb: { good: 800, needsImprovement: 1800 },
      tti: { good: 3800, needsImprovement: 7300 },
    }

    const threshold = thresholds[metric]
    if (value <= threshold.good) return 100
    if (value <= threshold.needsImprovement) return 50
    return 0
  }, [])

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getScore,
  }
}
