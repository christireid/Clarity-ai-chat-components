'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, cn } from '@clarity-chat/primitives';
import { useBatteryAware } from '../hooks/use-battery-aware';
/**
 * BatteryIndicator Component
 *
 * Displays current battery status with visual indicator.
 * Shows optimization level and recommendations when battery is low.
 *
 * @example
 * ```tsx
 * <BatteryIndicator
 *   position="top-right"
 *   showTooltip
 *   config={{ batterySaverThreshold: 0.2 }}
 * />
 * ```
 */
export function BatteryIndicator({ config, showTooltip = true, position = 'inline', showLabel = true, compact = false, className, }) {
    const { batteryStatus, isSupported, recommendations, batteryDescription, shouldEnableBatterySaver, } = useBatteryAware(config);
    const [showDetails, setShowDetails] = React.useState(false);
    if (!isSupported || !batteryStatus) {
        return null;
    }
    const { level, charging } = batteryStatus;
    const percentage = Math.round(level * 100);
    // Determine color based on level
    const getColor = () => {
        if (charging)
            return 'text-blue-500';
        if (level <= 0.05)
            return 'text-red-500';
        if (level <= 0.2)
            return 'text-orange-500';
        if (level <= 0.5)
            return 'text-yellow-500';
        return 'text-green-500';
    };
    // Battery icon SVG
    const BatteryIcon = () => {
        const fillWidth = Math.max(2, level * 18); // Minimum 2px width
        return (_jsxs("svg", { className: cn('h-5 w-5', getColor()), viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: [_jsx("rect", { x: "2", y: "7", width: "18", height: "10", rx: "2", strokeWidth: "2", fill: "none" }), _jsx("path", { d: "M22 10v4", strokeWidth: "2", strokeLinecap: "round" }), _jsx("rect", { x: "4", y: "9", width: fillWidth, height: "6", rx: "1", fill: "currentColor", className: cn(getColor()) }), charging && (_jsx(motion.path, { d: "M13 11l-2 3h2l-2 3", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", fill: "none", stroke: "currentColor", initial: { opacity: 0 }, animate: { opacity: [0, 1, 0] }, transition: { duration: 1.5, repeat: Infinity } }))] }));
    };
    // Position classes
    const positionClasses = {
        'top-left': 'fixed top-4 left-4 z-50',
        'top-right': 'fixed top-4 right-4 z-50',
        'bottom-left': 'fixed bottom-4 left-4 z-50',
        'bottom-right': 'fixed bottom-4 right-4 z-50',
        inline: 'inline-flex',
    };
    const content = (_jsxs(motion.div, { className: cn('flex items-center gap-2 rounded-lg bg-background/95 backdrop-blur-sm', position !== 'inline' && 'shadow-lg border p-2', positionClasses[position], className), initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.2 }, onMouseEnter: () => showTooltip && setShowDetails(true), onMouseLeave: () => showTooltip && setShowDetails(false), children: [_jsx(BatteryIcon, {}), !compact && showLabel && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: cn('text-sm font-medium', getColor()), children: [percentage, "%"] }), shouldEnableBatterySaver && (_jsx(Badge, { variant: "warning", className: "text-xs", children: "Low" })), charging && (_jsx(Badge, { variant: "default", className: "text-xs", children: "Charging" }))] })), recommendations.level !== 'none' && !compact && (_jsx(Badge, { variant: recommendations.level === 'aggressive'
                    ? 'destructive'
                    : recommendations.level === 'moderate'
                        ? 'warning'
                        : 'secondary', className: "text-xs", children: recommendations.level }))] }));
    if (!showTooltip) {
        return content;
    }
    return (_jsxs("div", { className: "relative", children: [content, _jsx(AnimatePresence, { children: showDetails && (_jsx(motion.div, { initial: { opacity: 0, y: -10, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -10, scale: 0.95 }, transition: { duration: 0.2 }, className: cn('absolute z-50 min-w-[200px] rounded-lg border bg-popover p-3 shadow-lg', position.includes('right') ? 'right-0' : 'left-0', position.includes('top') ? 'top-full mt-2' : 'bottom-full mb-2'), children: _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-sm font-semibold", children: batteryDescription }), batteryStatus.dischargingTime &&
                                batteryStatus.dischargingTime !== Infinity &&
                                !charging && (_jsxs("div", { className: "text-xs text-muted-foreground", children: ["~", Math.round(batteryStatus.dischargingTime / 3600), " hours remaining"] })), batteryStatus.chargingTime &&
                                batteryStatus.chargingTime !== Infinity &&
                                charging && (_jsxs("div", { className: "text-xs text-muted-foreground", children: ["~", Math.round(batteryStatus.chargingTime / 3600), " hours to full"] })), recommendations.level !== 'none' && (_jsxs("div", { className: "border-t pt-2 space-y-1", children: [_jsx("div", { className: "text-xs font-medium", children: "Optimizations Active:" }), _jsxs("ul", { className: "text-xs text-muted-foreground space-y-0.5", children: [recommendations.disableAnimations && (_jsx("li", { children: "\u2022 Animations reduced" })), recommendations.throttleUpdates && _jsx("li", { children: "\u2022 Updates throttled" }), recommendations.deferNonCritical && (_jsx("li", { children: "\u2022 Non-critical tasks deferred" })), recommendations.reduceStreaming && (_jsx("li", { children: "\u2022 Streaming quality reduced" }))] })] }))] }) })) })] }));
}
BatteryIndicator.displayName = 'BatteryIndicator';
//# sourceMappingURL=battery-indicator.js.map