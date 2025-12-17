import { logger } from '@clarity-chat/utils/logger';
'use client'

import * as React from 'react'
import type { ThemeMode } from '../theme/ThemeProvider'
import type { ModernThemePresetName } from '../theme/modern-presets'

/**
 * Theme analytics event types
 */
export type ThemeAnalyticsEventType =
  | 'theme_change'
  | 'mode_toggle'
  | 'preset_change'
  | 'custom_theme_applied'
  | 'theme_error'

/**
 * Theme analytics event data
 */
export interface ThemeAnalyticsEvent {
  type: ThemeAnalyticsEventType
  timestamp: number
  data: {
    previousMode?: ThemeMode | null
    newMode?: ThemeMode
    previousPreset?: ModernThemePresetName | null
    newPreset?: ModernThemePresetName | null
    customThemeName?: string
    errorMessage?: string
    source?: 'user' | 'system' | 'cross-tab'
  }
}

/**
 * Analytics handler callback type
 */
export type ThemeAnalyticsHandler = (event: ThemeAnalyticsEvent) => void

/**
 * Theme analytics configuration
 */
export interface UseThemeAnalyticsOptions {
  /**
   * Handler function called when theme events occur
   */
  onEvent?: ThemeAnalyticsHandler
  /**
   * Enable console logging of events (development only)
   * @default false
   */
  debug?: boolean
  /**
   * Track mode toggle events
   * @default true
   */
  trackModeChanges?: boolean
  /**
   * Track preset changes
   * @default true
   */
  trackPresetChanges?: boolean
  /**
   * Track custom theme applications
   * @default true
   */
  trackCustomThemes?: boolean
  /**
   * Track theme-related errors
   * @default true
   */
  trackErrors?: boolean
}

/**
 * Return type for useThemeAnalytics hook
 */
export interface UseThemeAnalyticsReturn {
  /**
   * Track a mode toggle event
   */
  trackModeChange: (
    previousMode: ThemeMode | null,
    newMode: ThemeMode,
    source?: 'user' | 'system' | 'cross-tab'
  ) => void
  /**
   * Track a preset change event
   */
  trackPresetChange: (
    previousPreset: ModernThemePresetName | null,
    newPreset: ModernThemePresetName,
    source?: 'user' | 'system' | 'cross-tab'
  ) => void
  /**
   * Track a custom theme application
   */
  trackCustomTheme: (themeName: string) => void
  /**
   * Track a theme-related error
   */
  trackError: (errorMessage: string) => void
  /**
   * Get all recorded events (if history is enabled)
   */
  events: ThemeAnalyticsEvent[]
  /**
   * Clear event history
   */
  clearEvents: () => void
  /**
   * Get analytics summary
   */
  getSummary: () => ThemeAnalyticsSummary
}

/**
 * Summary of theme analytics data
 */
export interface ThemeAnalyticsSummary {
  totalEvents: number
  modeChanges: number
  presetChanges: number
  customThemeApplications: number
  errors: number
  mostUsedMode: ThemeMode | null
  mostUsedPreset: ModernThemePresetName | null
  sessionDuration: number
}

/**
 * useThemeAnalytics - Track theme usage patterns and events
 *
 * This hook provides analytics tracking for theme-related events,
 * useful for understanding user preferences and debugging issues.
 *
 * @example
 * ```tsx
 * function App() {
 *   const analytics = useThemeAnalytics({
 *     onEvent: (event) => {
 *       // Send to analytics service
 *       sendToAnalytics('theme_event', event)
 *     },
 *     debug: process.env.NODE_ENV === 'development',
 *   })
 *
 *   // In theme change handler:
 *   const handlePresetChange = (preset) => {
 *     setPreset(preset)
 *     analytics.trackPresetChange(currentPreset, preset, 'user')
 *   }
 *
 *   // Get summary for reporting:
 *   const summary = analytics.getSummary()
 *   logger.debug(`Most used theme: ${summary.mostUsedPreset}`)
 * }
 * ```
 */
export function useThemeAnalytics(
  options: UseThemeAnalyticsOptions = {}
): UseThemeAnalyticsReturn {
  const {
    onEvent,
    debug = false,
    trackModeChanges = true,
    trackPresetChanges = true,
    trackCustomThemes = true,
    trackErrors = true,
  } = options

  const [events, setEvents] = React.useState<ThemeAnalyticsEvent[]>([])
  const sessionStartRef = React.useRef(Date.now())

  // Mode usage tracking
  const modeUsageRef = React.useRef<Record<string, number>>({})
  const presetUsageRef = React.useRef<Record<string, number>>({})

  const recordEvent = React.useCallback(
    (event: ThemeAnalyticsEvent) => {
      setEvents((prev) => [...prev, event])

      if (debug && process.env.NODE_ENV !== 'production') {
        logger.debug('[ThemeAnalytics]', event.type, event.data)
      }

      onEvent?.(event)
    },
    [onEvent, debug]
  )

  const trackModeChange = React.useCallback(
    (
      previousMode: ThemeMode | null,
      newMode: ThemeMode,
      source: 'user' | 'system' | 'cross-tab' = 'user'
    ) => {
      if (!trackModeChanges) return

      // Update usage tracking
      modeUsageRef.current[newMode] = (modeUsageRef.current[newMode] || 0) + 1

      recordEvent({
        type: 'mode_toggle',
        timestamp: Date.now(),
        data: {
          previousMode,
          newMode,
          source,
        },
      })
    },
    [trackModeChanges, recordEvent]
  )

  const trackPresetChange = React.useCallback(
    (
      previousPreset: ModernThemePresetName | null,
      newPreset: ModernThemePresetName,
      source: 'user' | 'system' | 'cross-tab' = 'user'
    ) => {
      if (!trackPresetChanges) return

      // Update usage tracking
      presetUsageRef.current[newPreset] =
        (presetUsageRef.current[newPreset] || 0) + 1

      recordEvent({
        type: 'preset_change',
        timestamp: Date.now(),
        data: {
          previousPreset,
          newPreset,
          source,
        },
      })
    },
    [trackPresetChanges, recordEvent]
  )

  const trackCustomTheme = React.useCallback(
    (themeName: string) => {
      if (!trackCustomThemes) return

      recordEvent({
        type: 'custom_theme_applied',
        timestamp: Date.now(),
        data: {
          customThemeName: themeName,
        },
      })
    },
    [trackCustomThemes, recordEvent]
  )

  const trackError = React.useCallback(
    (errorMessage: string) => {
      if (!trackErrors) return

      recordEvent({
        type: 'theme_error',
        timestamp: Date.now(),
        data: {
          errorMessage,
        },
      })
    },
    [trackErrors, recordEvent]
  )

  const clearEvents = React.useCallback(() => {
    setEvents([])
    modeUsageRef.current = {}
    presetUsageRef.current = {}
  }, [])

  const getSummary = React.useCallback((): ThemeAnalyticsSummary => {
    const modeChanges = events.filter((e) => e.type === 'mode_toggle').length
    const presetChanges = events.filter(
      (e) => e.type === 'preset_change'
    ).length
    const customThemeApplications = events.filter(
      (e) => e.type === 'custom_theme_applied'
    ).length
    const errors = events.filter((e) => e.type === 'theme_error').length

    // Find most used mode
    let mostUsedMode: ThemeMode | null = null
    let maxModeUsage = 0
    for (const [mode, count] of Object.entries(modeUsageRef.current)) {
      if (count > maxModeUsage) {
        maxModeUsage = count
        mostUsedMode = mode as ThemeMode
      }
    }

    // Find most used preset
    let mostUsedPreset: ModernThemePresetName | null = null
    let maxPresetUsage = 0
    for (const [preset, count] of Object.entries(presetUsageRef.current)) {
      if (count > maxPresetUsage) {
        maxPresetUsage = count
        mostUsedPreset = preset as ModernThemePresetName
      }
    }

    return {
      totalEvents: events.length,
      modeChanges,
      presetChanges,
      customThemeApplications,
      errors,
      mostUsedMode,
      mostUsedPreset,
      sessionDuration: Date.now() - sessionStartRef.current,
    }
  }, [events])

  return {
    trackModeChange,
    trackPresetChange,
    trackCustomTheme,
    trackError,
    events,
    clearEvents,
    getSummary,
  }
}

export default useThemeAnalytics
