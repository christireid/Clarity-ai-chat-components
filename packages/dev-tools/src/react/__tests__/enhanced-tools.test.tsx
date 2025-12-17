/**
 * Comprehensive tests for enhanced developer tools
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import * as React from 'react'

// Debug tools
import {
  EnhancedConsole,
  createEnhancedConsole,
  getEnhancedConsole,
} from '../../debug/enhanced-console'

import {
  ComponentMonitor,
  createComponentMonitor,
  getComponentMonitor,
} from '../../debug/component-monitor'

import {
  TokenTracker,
  createTokenTracker,
  getTokenTracker,
} from '../../debug/token-tracker'

import {
  StateDiff,
  createStateDiff,
  getStateDiff,
  quickDiff,
} from '../../debug/state-diff'

import {
  NetworkTimeline,
  createNetworkTimeline,
  getNetworkTimeline,
} from '../../debug/network-timeline'

import {
  ErrorTracker,
  createErrorTracker,
  getErrorTracker,
} from '../../debug/error-tracker'

import {
  DevNotifications,
  createDevNotifications,
  getDevNotifications,
} from '../../debug/dev-notifications'

// React hooks
import { useComponentMonitor } from '../hooks/use-component-monitor'
import { useTokenTracker } from '../hooks/use-token-tracker'
import { useStateDiff } from '../hooks/use-state-diff'
import { useErrorTracker } from '../hooks/use-error-tracker'
import { useDevNotifications } from '../hooks/use-dev-notifications'

describe('Enhanced Console', () => {
  let console_: EnhancedConsole

  beforeEach(() => {
    console_ = createEnhancedConsole({ enabled: true, maxEntries: 100 })
  })

  afterEach(() => {
    console_.clear()
  })

  it('should log messages at different levels', () => {
    console_.trace('trace message')
    console_.debug('debug message')
    console_.info('info message')
    console_.warn('warn message')
    console_.error('error message')
    console_.fatal('fatal message')

    const entries = console_.getEntries()
    expect(entries.length).toBeGreaterThanOrEqual(5) // trace might be filtered
  })

  it('should filter entries by level', () => {
    console_.setLevel('warn')
    console_.debug('should be filtered')
    console_.warn('should be logged')

    const entries = console_.getEntries()
    const warnEntries = entries.filter(e => e.level === 'warn')
    expect(warnEntries.length).toBe(1)
  })

  it('should support context logging', () => {
    const logger = console_.withContext({ userId: '123' })
    logger.info('test message')

    const entries = console_.getEntries()
    expect(entries[entries.length - 1].context?.userId).toBe('123')
  })

  it('should support tags', () => {
    const logger = console_.withTags('auth', 'security')
    logger.info('tagged message')

    const entries = console_.getEntries({ tags: ['auth'] })
    expect(entries.length).toBe(1)
  })

  it('should export in different formats', () => {
    console_.info('test message')

    const json = console_.export({ format: 'json' })
    expect(JSON.parse(json)).toBeInstanceOf(Array)

    const csv = console_.export({ format: 'csv' })
    expect(csv).toContain('timestamp')

    const markdown = console_.export({ format: 'markdown' })
    expect(markdown).toContain('# Debug Console Export')
  })

  it('should provide statistics', () => {
    console_.info('info 1')
    console_.info('info 2')
    console_.error('error 1')

    const stats = console_.getStats()
    expect(stats.total).toBeGreaterThanOrEqual(3)
    expect(stats.byLevel.info).toBeGreaterThanOrEqual(2)
    expect(stats.byLevel.error).toBeGreaterThanOrEqual(1)
  })
})

describe('Component Monitor', () => {
  let monitor: ComponentMonitor

  beforeEach(() => {
    monitor = createComponentMonitor({ enabled: true })
  })

  afterEach(() => {
    monitor.clear()
  })

  it('should track component mounts', () => {
    monitor.onMount('TestComponent', 'instance-1')

    const metrics = monitor.getMetrics('instance-1')
    expect(metrics).toBeDefined()
    expect(metrics?.componentName).toBe('TestComponent')
  })

  it('should track renders', () => {
    monitor.onMount('TestComponent', 'instance-1')
    monitor.onRender('instance-1', 5)
    monitor.onRender('instance-1', 10)

    const metrics = monitor.getMetrics('instance-1')
    expect(metrics?.renderCount).toBe(2)
    expect(metrics?.avgRenderTime).toBe(7.5)
  })

  it('should detect performance issues', () => {
    monitor.setThresholds({ maxRenderDuration: 5 })
    monitor.onMount('SlowComponent', 'instance-1')
    monitor.onRender('instance-1', 20)

    const metrics = monitor.getMetrics('instance-1')
    expect(metrics?.warnings.length).toBeGreaterThan(0)
    expect(metrics?.warnings.some(w => w.includes('Slow render'))).toBe(true)
  })

  it('should provide recommendations', () => {
    const recommendations = monitor.getRecommendations()
    expect(recommendations).toBeInstanceOf(Array)
  })

  it('should track component unmounts', () => {
    monitor.onMount('TestComponent', 'instance-1')
    monitor.onUnmount('instance-1')

    const metrics = monitor.getMetrics('instance-1')
    expect(metrics?.unmountTime).toBeDefined()
  })

  it('should export metrics', () => {
    monitor.onMount('TestComponent', 'instance-1')
    monitor.onRender('instance-1', 5)

    const exported = JSON.parse(monitor.export())
    expect(exported.metrics).toBeInstanceOf(Array)
    expect(exported.globalStats).toBeDefined()
  })
})

describe('Token Tracker', () => {
  let tracker: TokenTracker

  beforeEach(() => {
    tracker = createTokenTracker({ enabled: true })
  })

  afterEach(() => {
    tracker.clear()
  })

  it('should track token usage', () => {
    tracker.track({
      provider: 'openai',
      model: 'gpt-4o-mini',
      usage: {
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
      },
    })

    const stats = tracker.getStats()
    expect(stats.totalTokens).toBe(150)
    expect(stats.totalPromptTokens).toBe(100)
    expect(stats.totalCompletionTokens).toBe(50)
  })

  it('should calculate costs', () => {
    const event = tracker.track({
      provider: 'openai',
      model: 'gpt-4o-mini',
      usage: {
        promptTokens: 1000000,
        completionTokens: 1000000,
        totalTokens: 2000000,
      },
    })

    expect(event.cost.totalCost).toBeGreaterThan(0)
    expect(event.cost.currency).toBe('USD')
  })

  it('should estimate costs', () => {
    const estimate = tracker.estimateCost('gpt-4o-mini', 1000, 500)
    expect(estimate.totalCost).toBeGreaterThan(0)
  })

  it('should provide optimization recommendations', () => {
    // Track some usage
    for (let i = 0; i < 5; i++) {
      tracker.track({
        provider: 'openai',
        model: 'gpt-4',
        usage: {
          promptTokens: 5000,
          completionTokens: 1000,
          totalTokens: 6000,
        },
      })
    }

    const recommendations = tracker.getOptimizationRecommendations()
    expect(recommendations).toBeInstanceOf(Array)
    expect(recommendations.length).toBeGreaterThan(0)
  })

  it('should support custom pricing', () => {
    tracker.addPricing('custom-model', {
      promptPricePerMillion: 1,
      completionPricePerMillion: 2,
      currency: 'USD',
    })

    const event = tracker.track({
      provider: 'custom',
      model: 'custom-model',
      usage: {
        promptTokens: 1000000,
        completionTokens: 1000000,
        totalTokens: 2000000,
      },
    })

    expect(event.cost.promptCost).toBe(1)
    expect(event.cost.completionCost).toBe(2)
  })
})

describe('State Diff', () => {
  let differ: StateDiff

  beforeEach(() => {
    differ = createStateDiff()
  })

  afterEach(() => {
    differ.clear()
  })

  it('should detect added properties', () => {
    const oldState = { a: 1 }
    const newState = { a: 1, b: 2 }

    const diff = differ.diff(oldState, newState)
    expect(diff.stats.added).toBe(1)
    expect(diff.entries.some(e => e.path === 'b' && e.type === 'added')).toBe(true)
  })

  it('should detect removed properties', () => {
    const oldState = { a: 1, b: 2 }
    const newState = { a: 1 }

    const diff = differ.diff(oldState, newState)
    expect(diff.stats.removed).toBe(1)
    expect(diff.entries.some(e => e.path === 'b' && e.type === 'removed')).toBe(true)
  })

  it('should detect changed properties', () => {
    const oldState = { a: 1 }
    const newState = { a: 2 }

    const diff = differ.diff(oldState, newState)
    expect(diff.stats.changed).toBe(1)
  })

  it('should handle nested objects', () => {
    const oldState = { nested: { value: 1 } }
    const newState = { nested: { value: 2 } }

    const diff = differ.diff(oldState, newState)
    expect(diff.entries.some(e => e.path === 'nested.value')).toBe(true)
  })

  it('should handle arrays', () => {
    const oldState = { items: [1, 2] }
    const newState = { items: [1, 2, 3] }

    const diff = differ.diff(oldState, newState)
    expect(diff.stats.added).toBeGreaterThan(0)
  })

  it('should take snapshots', () => {
    differ.snapshot({ count: 0 }, 'Initial')
    differ.snapshot({ count: 1 }, 'After increment')

    const snapshots = differ.getSnapshots()
    expect(snapshots.length).toBe(2)
    expect(snapshots[1].diff).toBeDefined()
  })

  it('should format diff output', () => {
    const diff = quickDiff({ a: 1 }, { a: 2 })
    const formatted = differ.formatDiff(diff)

    expect(formatted).toContain('State Diff')
    expect(formatted).toContain('changed')
  })
})

describe('Network Timeline', () => {
  let timeline: NetworkTimeline

  beforeEach(() => {
    timeline = createNetworkTimeline({ enabled: true })
  })

  afterEach(() => {
    timeline.clear()
  })

  it('should record requests', () => {
    timeline.record({
      timestamp: new Date(),
      method: 'GET',
      url: 'https://api.example.com/data',
      status: 200,
      statusText: 'OK',
      requestHeaders: {},
      responseHeaders: {},
      responseSize: 1024,
      timing: {
        startTime: 0,
        ttfb: 50,
        endTime: 100,
        total: 100,
      },
      type: 'fetch',
      cached: false,
    })

    const requests = timeline.getRequests()
    expect(requests.length).toBe(1)
    expect(requests[0].url).toBe('https://api.example.com/data')
  })

  it('should filter requests', () => {
    timeline.record({
      timestamp: new Date(),
      method: 'GET',
      url: 'https://api.example.com/data',
      status: 200,
      statusText: 'OK',
      requestHeaders: {},
      responseHeaders: {},
      responseSize: 1024,
      timing: { startTime: 0, ttfb: 50, endTime: 100, total: 100 },
      type: 'fetch',
      cached: false,
    })

    timeline.record({
      timestamp: new Date(),
      method: 'POST',
      url: 'https://api.example.com/submit',
      status: 201,
      statusText: 'Created',
      requestHeaders: {},
      responseHeaders: {},
      responseSize: 256,
      timing: { startTime: 0, ttfb: 100, endTime: 200, total: 200 },
      type: 'fetch',
      cached: false,
    })

    const getRequests = timeline.getRequests({ methods: ['GET'] })
    expect(getRequests.length).toBe(1)

    const postRequests = timeline.getRequests({ methods: ['POST'] })
    expect(postRequests.length).toBe(1)
  })

  it('should calculate statistics', () => {
    timeline.record({
      timestamp: new Date(),
      method: 'GET',
      url: 'https://api.example.com/data',
      status: 200,
      statusText: 'OK',
      requestHeaders: {},
      responseHeaders: {},
      responseSize: 1024,
      timing: { startTime: 0, ttfb: 50, endTime: 100, total: 100 },
      type: 'fetch',
      cached: false,
    })

    const stats = timeline.getStats()
    expect(stats.totalRequests).toBe(1)
    expect(stats.avgDuration).toBe(100)
    expect(stats.avgTTFB).toBe(50)
  })

  it('should generate waterfall chart', () => {
    timeline.record({
      timestamp: new Date(),
      method: 'GET',
      url: 'https://api.example.com/data',
      status: 200,
      statusText: 'OK',
      requestHeaders: {},
      responseHeaders: {},
      responseSize: 1024,
      timing: { startTime: 0, ttfb: 50, endTime: 100, total: 100 },
      type: 'fetch',
      cached: false,
    })

    const waterfall = timeline.generateWaterfall()
    expect(waterfall).toContain('Network Waterfall')
  })

  it('should export as HAR format', () => {
    timeline.record({
      timestamp: new Date(),
      method: 'GET',
      url: 'https://api.example.com/data',
      status: 200,
      statusText: 'OK',
      requestHeaders: {},
      responseHeaders: {},
      responseSize: 1024,
      timing: { startTime: 0, ttfb: 50, endTime: 100, total: 100 },
      type: 'fetch',
      cached: false,
    })

    const har = JSON.parse(timeline.exportHAR())
    expect(har.log).toBeDefined()
    expect(har.log.entries).toHaveLength(1)
  })
})

describe('Error Tracker', () => {
  let tracker: ErrorTracker

  beforeEach(() => {
    tracker = createErrorTracker({ enabled: true })
  })

  afterEach(() => {
    tracker.clear()
  })

  it('should track errors', () => {
    const error = new Error('Test error')
    const event = tracker.track({ error })

    expect(event.error).toBe(error)
    expect(event.resolved).toBe(false)
  })

  it('should categorize errors automatically', () => {
    const networkError = new Error('Network request failed')
    const event = tracker.track({ error: networkError })

    expect(event.category).toBe('network')
  })

  it('should track recovery attempts', () => {
    const error = new Error('Test error')
    const event = tracker.track({ error })

    const recovery = tracker.trackRecovery(event.id, {
      strategy: 'retry',
      successful: true,
      duration: 100,
    })

    expect(recovery).toBeDefined()
    expect(recovery?.successful).toBe(true)
  })

  it('should resolve errors', () => {
    const error = new Error('Test error')
    const event = tracker.track({ error })

    const resolved = tracker.resolve(event.id)
    expect(resolved).toBe(true)

    const updated = tracker.getError(event.id)
    expect(updated?.resolved).toBe(true)
  })

  it('should calculate statistics', () => {
    tracker.track({ error: new Error('Error 1') })
    tracker.track({ error: new Error('Error 2') })
    tracker.track({ error: new Error('Error 3'), severity: 'critical' })

    const stats = tracker.getStats()
    expect(stats.totalErrors).toBe(3)
    expect(stats.errorsBySeverity.critical).toBe(1)
  })

  it('should provide recommendations', () => {
    for (let i = 0; i < 10; i++) {
      tracker.track({ error: new Error('Network error'), category: 'network' })
    }

    const recommendations = tracker.getRecommendations()
    expect(recommendations.length).toBeGreaterThan(0)
  })

  it('should group similar errors', () => {
    for (let i = 0; i < 5; i++) {
      tracker.track({ error: new Error('Same error message') })
    }

    const groups = tracker.getGroups()
    expect(groups.length).toBe(1)
    expect(groups[0].count).toBe(5)
  })
})

describe('Dev Notifications', () => {
  let notifications: DevNotifications

  beforeEach(() => {
    notifications = createDevNotifications({
      enableConsoleOutput: false,
    })
  })

  afterEach(() => {
    notifications.clear()
  })

  it('should create notifications', () => {
    const notification = notifications.info('Test', 'Test message')

    expect(notification.type).toBe('info')
    expect(notification.title).toBe('Test')
    expect(notification.message).toBe('Test message')
  })

  it('should support different notification types', () => {
    notifications.info('Info', 'Info message')
    notifications.success('Success', 'Success message')
    notifications.warning('Warning', 'Warning message')
    notifications.error('Error', 'Error message')
    notifications.performance('Performance', 'Performance message')
    notifications.build('Build', 'Build message')

    const stats = notifications.getStats()
    expect(stats.byType.info).toBe(1)
    expect(stats.byType.success).toBe(1)
    expect(stats.byType.warning).toBe(1)
    expect(stats.byType.error).toBe(1)
    expect(stats.byType.performance).toBe(1)
    expect(stats.byType.build).toBe(1)
  })

  it('should dismiss notifications', () => {
    const notification = notifications.info('Test', 'Test message')
    notifications.dismiss(notification.id)

    const active = notifications.getActive()
    expect(active.length).toBe(0)
  })

  it('should dismiss all notifications', () => {
    notifications.info('Test 1', 'Message 1')
    notifications.info('Test 2', 'Message 2')
    notifications.dismissAll()

    const active = notifications.getActive()
    expect(active.length).toBe(0)
  })

  it('should subscribe to notifications', () => {
    const callback = vi.fn()
    notifications.subscribe(callback)

    notifications.info('Test', 'Test message')

    expect(callback).toHaveBeenCalled()
  })

  it('should sort by priority', () => {
    notifications.notify({ type: 'info', title: 'Low', message: 'Low priority', priority: 'low' })
    notifications.notify({ type: 'info', title: 'Urgent', message: 'Urgent priority', priority: 'urgent' })
    notifications.notify({ type: 'info', title: 'Normal', message: 'Normal priority', priority: 'normal' })

    const active = notifications.getActive()
    expect(active[0].priority).toBe('urgent')
  })
})

// React Hook Tests
describe('useComponentMonitor Hook', () => {
  it('should return metrics', () => {
    const { result } = renderHook(() =>
      useComponentMonitor({ componentName: 'TestComponent', enabled: true })
    )

    expect(result.current.renderCount).toBeGreaterThanOrEqual(0)
    expect(result.current.warnings).toBeInstanceOf(Array)
  })
})

describe('useTokenTracker Hook', () => {
  it('should track tokens', () => {
    const { result } = renderHook(() => useTokenTracker({ enabled: true }))

    act(() => {
      result.current.track({
        provider: 'openai',
        model: 'gpt-4o-mini',
        usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 },
      })
    })

    expect(result.current.stats.totalTokens).toBeGreaterThanOrEqual(150)
  })

  it('should estimate costs', () => {
    const { result } = renderHook(() => useTokenTracker({ enabled: true }))

    const estimate = result.current.estimateCost('gpt-4o-mini', 1000, 500)
    expect(estimate.totalCost).toBeGreaterThan(0)
  })
})

describe('useStateDiff Hook', () => {
  it('should track state changes', () => {
    const { result, rerender } = renderHook(
      ({ state }) => useStateDiff(state, { autoTrack: true }),
      { initialProps: { state: { count: 0 } } }
    )

    rerender({ state: { count: 1 } })

    expect(result.current.snapshots.length).toBeGreaterThanOrEqual(1)
  })
})

describe('useErrorTracker Hook', () => {
  it('should track errors', () => {
    const { result } = renderHook(() =>
      useErrorTracker({ enabled: true, autoTrack: false })
    )

    act(() => {
      result.current.track(new Error('Test error'))
    })

    expect(result.current.errors.length).toBeGreaterThanOrEqual(1)
  })
})

describe('useDevNotifications Hook', () => {
  it('should create notifications', () => {
    const { result } = renderHook(() => useDevNotifications())

    act(() => {
      result.current.info('Test', 'Test message')
    })

    expect(result.current.notifications.length).toBeGreaterThanOrEqual(1)
  })
})
