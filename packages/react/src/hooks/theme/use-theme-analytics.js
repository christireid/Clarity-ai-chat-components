'use client';
import * as React from 'react';
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
 *   console.log(`Most used theme: ${summary.mostUsedPreset}`)
 * }
 * ```
 */
export function useThemeAnalytics(options = {}) {
    const { onEvent, debug = false, trackModeChanges = true, trackPresetChanges = true, trackCustomThemes = true, trackErrors = true, } = options;
    const [events, setEvents] = React.useState([]);
    const sessionStartRef = React.useRef(Date.now());
    // Mode usage tracking
    const modeUsageRef = React.useRef({});
    const presetUsageRef = React.useRef({});
    const recordEvent = React.useCallback((event) => {
        setEvents((prev) => [...prev, event]);
        if (debug && process.env.NODE_ENV !== 'production') {
            console.log('[ThemeAnalytics]', event.type, event.data);
        }
        onEvent?.(event);
    }, [onEvent, debug]);
    const trackModeChange = React.useCallback((previousMode, newMode, source = 'user') => {
        if (!trackModeChanges)
            return;
        // Update usage tracking
        modeUsageRef.current[newMode] = (modeUsageRef.current[newMode] || 0) + 1;
        recordEvent({
            type: 'mode_toggle',
            timestamp: Date.now(),
            data: {
                previousMode,
                newMode,
                source,
            },
        });
    }, [trackModeChanges, recordEvent]);
    const trackPresetChange = React.useCallback((previousPreset, newPreset, source = 'user') => {
        if (!trackPresetChanges)
            return;
        // Update usage tracking
        presetUsageRef.current[newPreset] =
            (presetUsageRef.current[newPreset] || 0) + 1;
        recordEvent({
            type: 'preset_change',
            timestamp: Date.now(),
            data: {
                previousPreset,
                newPreset,
                source,
            },
        });
    }, [trackPresetChanges, recordEvent]);
    const trackCustomTheme = React.useCallback((themeName) => {
        if (!trackCustomThemes)
            return;
        recordEvent({
            type: 'custom_theme_applied',
            timestamp: Date.now(),
            data: {
                customThemeName: themeName,
            },
        });
    }, [trackCustomThemes, recordEvent]);
    const trackError = React.useCallback((errorMessage) => {
        if (!trackErrors)
            return;
        recordEvent({
            type: 'theme_error',
            timestamp: Date.now(),
            data: {
                errorMessage,
            },
        });
    }, [trackErrors, recordEvent]);
    const clearEvents = React.useCallback(() => {
        setEvents([]);
        modeUsageRef.current = {};
        presetUsageRef.current = {};
    }, []);
    const getSummary = React.useCallback(() => {
        const modeChanges = events.filter((e) => e.type === 'mode_toggle').length;
        const presetChanges = events.filter((e) => e.type === 'preset_change').length;
        const customThemeApplications = events.filter((e) => e.type === 'custom_theme_applied').length;
        const errors = events.filter((e) => e.type === 'theme_error').length;
        // Find most used mode
        let mostUsedMode = null;
        let maxModeUsage = 0;
        for (const [mode, count] of Object.entries(modeUsageRef.current)) {
            if (count > maxModeUsage) {
                maxModeUsage = count;
                mostUsedMode = mode;
            }
        }
        // Find most used preset
        let mostUsedPreset = null;
        let maxPresetUsage = 0;
        for (const [preset, count] of Object.entries(presetUsageRef.current)) {
            if (count > maxPresetUsage) {
                maxPresetUsage = count;
                mostUsedPreset = preset;
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
        };
    }, [events]);
    return {
        trackModeChange,
        trackPresetChange,
        trackCustomTheme,
        trackError,
        events,
        clearEvents,
        getSummary,
    };
}
export default useThemeAnalytics;
//# sourceMappingURL=use-theme-analytics.js.map