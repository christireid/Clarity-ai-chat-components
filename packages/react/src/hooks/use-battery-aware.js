import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
const defaultConfig = {
    batterySaverThreshold: 0.2, // 20%
    optimizations: {
        reduceAnimations: true,
        throttleUpdates: true,
        deferNonCritical: true,
        reduceStreamingQuality: true,
    },
    autoOptimize: true,
    thresholds: {
        critical: 0.05, // 5%
        low: 0.2, // 20%
        medium: 0.5, // 50%
    },
};
/**
 * Hook for battery-aware feature optimization
 *
 * Monitors device battery status and provides recommendations for
 * optimizing performance based on battery level.
 *
 * Features:
 * - Real-time battery monitoring
 * - Automatic optimization recommendations
 * - Configurable thresholds
 * - Battery saver mode detection
 * - Graceful fallback for unsupported browsers
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const { batteryStatus, recommendations, isSupported } = useBatteryAware({
 *     batterySaverThreshold: 0.2,
 *     autoOptimize: true,
 *   })
 *
 *   // Conditionally disable animations on low battery
 *   const enableAnimations = !recommendations.disableAnimations
 *
 *   // Throttle updates when battery is low
 *   const updateInterval = recommendations.updateInterval
 *
 *   return (
 *     <div>
 *       {batteryStatus && (
 *         <BatteryIndicator
 *           level={batteryStatus.level}
 *           charging={batteryStatus.charging}
 *         />
 *       )}
 *       <ChatWindow
 *         enableAnimations={enableAnimations}
 *         updateInterval={updateInterval}
 *       />
 *     </div>
 *   )
 * }
 * ```
 */
export function useBatteryAware(config) {
    const finalConfig = { ...defaultConfig, ...config };
    const [batteryStatus, setBatteryStatus] = React.useState(null);
    const [isSupported, setIsSupported] = React.useState(false);
    const [error, setError] = React.useState(null);
    // Check if Battery API is supported
    React.useEffect(() => {
        const nav = navigator;
        setIsSupported(typeof nav.getBattery === 'function');
    }, []);
    // Monitor battery status
    React.useEffect(() => {
        const nav = navigator;
        if (!nav.getBattery) {
            return;
        }
        let battery = null;
        const updateBatteryStatus = (batteryManager) => {
            const level = batteryManager.level;
            const batterySaverRecommended = level <= finalConfig.batterySaverThreshold;
            setBatteryStatus({
                level,
                charging: batteryManager.charging,
                dischargingTime: batteryManager.dischargingTime,
                chargingTime: batteryManager.chargingTime,
                batterySaverRecommended,
            });
        };
        const initBattery = async () => {
            try {
                // getBattery is checked above, safe to use non-null assertion
                battery = await nav.getBattery();
                updateBatteryStatus(battery);
                // Listen for battery changes
                const handleChange = () => {
                    if (battery)
                        updateBatteryStatus(battery);
                };
                battery.addEventListener('chargingchange', handleChange);
                battery.addEventListener('levelchange', handleChange);
                battery.addEventListener('chargingtimechange', handleChange);
                battery.addEventListener('dischargingtimechange', handleChange);
                return () => {
                    if (battery) {
                        battery.removeEventListener('chargingchange', handleChange);
                        battery.removeEventListener('levelchange', handleChange);
                        battery.removeEventListener('chargingtimechange', handleChange);
                        battery.removeEventListener('dischargingtimechange', handleChange);
                    }
                };
            }
            catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to access battery API'));
                console.error('Battery API error:', err);
            }
        };
        const cleanup = initBattery();
        return () => {
            cleanup.then((cleanupFn) => cleanupFn?.());
        };
    }, [finalConfig.batterySaverThreshold]);
    /**
     * Get optimization recommendations based on battery status
     */
    const recommendations = React.useMemo(() => {
        if (!batteryStatus || !finalConfig.autoOptimize) {
            return {
                disableAnimations: false,
                throttleUpdates: false,
                deferNonCritical: false,
                reduceStreaming: false,
                updateInterval: 100, // Default: 100ms
                level: 'none',
            };
        }
        const { level, charging } = batteryStatus;
        const thresholds = finalConfig.thresholds || defaultConfig.thresholds;
        // Don't optimize if charging
        if (charging) {
            return {
                disableAnimations: false,
                throttleUpdates: false,
                deferNonCritical: false,
                reduceStreaming: false,
                updateInterval: 100,
                level: 'none',
            };
        }
        // Critical battery (< 5%)
        if (level <= thresholds.critical) {
            return {
                disableAnimations: finalConfig.optimizations.reduceAnimations,
                throttleUpdates: finalConfig.optimizations.throttleUpdates,
                deferNonCritical: finalConfig.optimizations.deferNonCritical,
                reduceStreaming: finalConfig.optimizations.reduceStreamingQuality,
                updateInterval: 1000, // 1s
                level: 'aggressive',
            };
        }
        // Low battery (< 20%)
        if (level <= thresholds.low) {
            return {
                disableAnimations: finalConfig.optimizations.reduceAnimations,
                throttleUpdates: finalConfig.optimizations.throttleUpdates,
                deferNonCritical: finalConfig.optimizations.deferNonCritical,
                reduceStreaming: finalConfig.optimizations.reduceStreamingQuality,
                updateInterval: 500, // 500ms
                level: 'moderate',
            };
        }
        // Medium battery (< 50%)
        if (level <= thresholds.medium) {
            return {
                disableAnimations: false,
                throttleUpdates: finalConfig.optimizations.throttleUpdates,
                deferNonCritical: false,
                reduceStreaming: false,
                updateInterval: 250, // 250ms
                level: 'minimal',
            };
        }
        // High battery (> 50%)
        return {
            disableAnimations: false,
            throttleUpdates: false,
            deferNonCritical: false,
            reduceStreaming: false,
            updateInterval: 100, // 100ms
            level: 'none',
        };
    }, [batteryStatus, finalConfig.autoOptimize, finalConfig.optimizations, finalConfig.thresholds]);
    /**
     * Get human-readable battery level description
     */
    const getBatteryDescription = React.useCallback(() => {
        if (!batteryStatus)
            return 'Unknown';
        const { level, charging } = batteryStatus;
        const percentage = Math.round(level * 100);
        if (charging)
            return `${percentage}% (Charging)`;
        if (level <= 0.05)
            return `${percentage}% (Critical)`;
        if (level <= 0.2)
            return `${percentage}% (Low)`;
        if (level <= 0.5)
            return `${percentage}% (Medium)`;
        return `${percentage}% (Good)`;
    }, [batteryStatus]);
    /**
     * Get battery icon name based on level and charging status
     */
    const getBatteryIcon = React.useCallback(() => {
        if (!batteryStatus)
            return 'battery-unknown';
        const { level, charging } = batteryStatus;
        if (charging)
            return 'battery-charging';
        if (level <= 0.05)
            return 'battery-critical';
        if (level <= 0.2)
            return 'battery-low';
        if (level <= 0.5)
            return 'battery-medium';
        return 'battery-full';
    }, [batteryStatus]);
    /**
     * Check if battery saver mode should be enabled
     */
    const shouldEnableBatterySaver = React.useMemo(() => {
        return batteryStatus?.batterySaverRecommended || false;
    }, [batteryStatus]);
    return {
        /** Current battery status */
        batteryStatus,
        /** Whether Battery API is supported */
        isSupported,
        /** Optimization recommendations */
        recommendations,
        /** Human-readable battery description */
        batteryDescription: getBatteryDescription(),
        /** Battery icon name */
        batteryIcon: getBatteryIcon(),
        /** Whether battery saver should be enabled */
        shouldEnableBatterySaver,
        /** Any error that occurred */
        error,
    };
}
/**
 * HOC to wrap components with battery-aware optimizations
 *
 * @example
 * ```tsx
 * const BatteryAwareChatWindow = withBatteryOptimizations(ChatWindow, {
 *   batterySaverThreshold: 0.2,
 *   autoOptimize: true,
 * })
 * ```
 */
export function withBatteryOptimizations(Component, config) {
    return function BatteryAwareComponent(props) {
        const { recommendations } = useBatteryAware(config);
        return _jsx(Component, { ...props, batteryOptimizations: recommendations });
    };
}
//# sourceMappingURL=use-battery-aware.js.map