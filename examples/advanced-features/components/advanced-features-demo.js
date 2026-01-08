'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useBatteryAware, } from '@clarity-chat/react';
// =============================================================================
// Enhanced Suggestions Demo
// =============================================================================
function EnhancedSuggestionsDemo() {
    const [suggestions] = useState([
        {
            text: 'Explain this concept in simpler terms',
            confidence: 0.92,
            category: 'clarify',
        },
        {
            text: 'Can you provide an example?',
            confidence: 0.88,
            category: 'example',
        },
        {
            text: 'What are the best practices?',
            confidence: 0.85,
            category: 'best-practices',
        },
        {
            text: 'How does this compare to alternatives?',
            confidence: 0.78,
            category: 'compare',
        },
    ]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-6 bg-card border rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "ML-Ranked Suggestions" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Suggestions are ranked by confidence based on conversation context, user history, and engagement patterns." }), _jsx("div", { className: "space-y-2", children: suggestions.map((suggestion, i) => (_jsxs("button", { className: "w-full p-3 text-left bg-muted hover:bg-muted/80 rounded-lg transition-colors flex items-center justify-between group", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "text-lg", children: [suggestion.category === 'clarify' && '💡', suggestion.category === 'example' && '📝', suggestion.category === 'best-practices' && '⭐', suggestion.category === 'compare' && '⚖️'] }), _jsx("span", { className: "text-sm", children: suggestion.text })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-xs text-muted-foreground", children: [Math.round(suggestion.confidence * 100), "% match"] }), _jsx("div", { className: "w-16 h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-primary rounded-full", style: { width: `${suggestion.confidence * 100}%` } }) })] })] }, i))) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-4 bg-card border rounded-lg", children: [_jsx("h4", { className: "font-medium mb-2", children: "Click-Through Rate" }), _jsx("p", { className: "text-3xl font-bold text-primary", children: "24.5%" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "+150% vs baseline" })] }), _jsxs("div", { className: "p-4 bg-card border rounded-lg", children: [_jsx("h4", { className: "font-medium mb-2", children: "Avg Relevance" }), _jsx("p", { className: "text-3xl font-bold text-primary", children: "0.86" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "ML model confidence" })] })] })] }));
}
// =============================================================================
// Battery Aware Demo using @clarity-chat/react hook
// =============================================================================
function BatteryAwareDemo() {
    // Use the existing useBatteryAware hook from @clarity-chat/react
    const { batteryStatus, isSupported, recommendations, batteryDescription, shouldEnableBatterySaver, error, } = useBatteryAware({
        batterySaverThreshold: 0.2,
        autoOptimize: true,
        thresholds: {
            critical: 0.05,
            low: 0.2,
            medium: 0.5,
        },
    });
    // Simulation mode for demo purposes (when Battery API not available)
    const [simulationMode, setSimulationMode] = useState(false);
    const [simulatedLevel, setSimulatedLevel] = useState(0.65);
    const [simulatedCharging, setSimulatedCharging] = useState(false);
    // Determine effective values (real or simulated)
    const effectiveLevel = simulationMode || !isSupported
        ? simulatedLevel
        : (batteryStatus?.level ?? 1);
    const effectiveCharging = simulationMode || !isSupported
        ? simulatedCharging
        : (batteryStatus?.charging ?? true);
    // Calculate recommendations based on effective values for simulation
    const effectiveRecommendations = simulationMode || !isSupported
        ? {
            disableAnimations: effectiveLevel < 0.2,
            throttleUpdates: effectiveLevel < 0.5,
            deferNonCritical: effectiveLevel < 0.2,
            reduceStreaming: effectiveLevel < 0.2,
            updateInterval: effectiveLevel <= 0.05
                ? 1000
                : effectiveLevel <= 0.2
                    ? 500
                    : effectiveLevel <= 0.5
                        ? 250
                        : 100,
            level: effectiveLevel <= 0.05
                ? 'aggressive'
                : effectiveLevel <= 0.2
                    ? 'moderate'
                    : effectiveLevel <= 0.5
                        ? 'minimal'
                        : 'none',
        }
        : recommendations;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-6 bg-card border rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Battery Status" }), _jsx("span", { className: `text-xs px-2 py-1 rounded ${isSupported && !simulationMode
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'}`, children: isSupported && !simulationMode ? 'Live API' : 'Simulation Mode' })] }), _jsx("div", { className: "mb-4 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg", children: _jsxs("p", { className: "text-sm text-blue-800 dark:text-blue-200", children: ["This demo uses the", ' ', _jsx("code", { className: "font-mono", children: "useBatteryAware" }), " hook from", ' ', _jsx("code", { className: "font-mono", children: "@clarity-chat/react" }), ".", !isSupported && (_jsxs(_Fragment, { children: [_jsx("br", {}), _jsx("span", { className: "text-xs text-blue-600 dark:text-blue-400", children: "Battery API not available - using simulation mode." })] }))] }) }), isSupported && (_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("input", { type: "checkbox", id: "simulation-mode", checked: simulationMode, onChange: (e) => setSimulationMode(e.target.checked), className: "rounded" }), _jsx("label", { htmlFor: "simulation-mode", className: "text-sm", children: "Enable simulation mode (override real values)" })] })), (simulationMode || !isSupported) && (_jsxs("div", { className: "mb-6 p-4 bg-muted/50 rounded-lg", children: [_jsxs("label", { className: "block text-sm font-medium mb-2", children: ["Simulate Battery Level: ", Math.round(simulatedLevel * 100), "%"] }), _jsx("input", { type: "range", min: "0", max: "100", value: simulatedLevel * 100, onChange: (e) => setSimulatedLevel(parseInt(e.target.value) / 100), className: "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer" }), _jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mt-1", children: [_jsx("span", { children: "Critical (5%)" }), _jsx("span", { children: "Low (20%)" }), _jsx("span", { children: "Medium (50%)" }), _jsx("span", { children: "Full (100%)" })] }), _jsxs("div", { className: "flex items-center gap-2 mt-4", children: [_jsx("input", { type: "checkbox", id: "charging", checked: simulatedCharging, onChange: (e) => setSimulatedCharging(e.target.checked), className: "rounded" }), _jsx("label", { htmlFor: "charging", className: "text-sm", children: "Charging" })] })] })), _jsxs("div", { className: "flex items-center gap-3 p-4 bg-muted rounded-lg", children: [_jsxs("div", { className: `w-12 h-6 border-2 rounded-sm relative ${effectiveLevel < 0.2 ? 'border-red-500' : 'border-green-500'}`, children: [_jsx("div", { className: `absolute inset-0.5 rounded-sm transition-all ${effectiveLevel < 0.2 ? 'bg-red-500' : 'bg-green-500'}`, style: { width: `${effectiveLevel * 100}%` } }), _jsx("div", { className: "absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-3 bg-current rounded-r-sm" })] }), _jsxs("div", { children: [_jsxs("p", { className: "font-medium", children: [Math.round(effectiveLevel * 100), "%"] }), _jsx("p", { className: "text-xs text-muted-foreground", children: effectiveCharging
                                            ? '⚡ Charging'
                                            : effectiveLevel < 0.2
                                                ? '🔴 Low battery'
                                                : '🔋 On battery' })] })] })] }), _jsxs("div", { className: "p-6 bg-card border rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Active Optimizations" }), _jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Recommendations from useBatteryAware hook based on current battery level" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: `flex items-center justify-between p-3 rounded-lg transition-colors ${effectiveRecommendations.disableAnimations
                                    ? 'bg-yellow-100 dark:bg-yellow-900/20'
                                    : 'bg-muted'}`, children: [_jsx("span", { className: "text-sm", children: "Animations" }), _jsx("span", { className: `text-sm font-medium ${effectiveRecommendations.disableAnimations
                                            ? 'text-yellow-700 dark:text-yellow-400'
                                            : 'text-green-600'}`, children: effectiveRecommendations.disableAnimations
                                            ? 'Disabled'
                                            : 'Enabled' })] }), _jsxs("div", { className: "flex items-center justify-between p-3 bg-muted rounded-lg", children: [_jsx("span", { className: "text-sm", children: "Update Interval" }), _jsxs("span", { className: "text-sm font-medium", children: [effectiveRecommendations.updateInterval, "ms"] })] }), _jsxs("div", { className: "flex items-center justify-between p-3 bg-muted rounded-lg", children: [_jsx("span", { className: "text-sm", children: "Throttle Updates" }), _jsx("span", { className: `text-sm font-medium ${effectiveRecommendations.throttleUpdates
                                            ? 'text-yellow-700 dark:text-yellow-400'
                                            : 'text-green-600'}`, children: effectiveRecommendations.throttleUpdates ? 'Yes' : 'No' })] }), _jsxs("div", { className: "flex items-center justify-between p-3 bg-muted rounded-lg", children: [_jsx("span", { className: "text-sm", children: "Optimization Level" }), _jsx("span", { className: `text-sm font-medium px-2 py-0.5 rounded ${effectiveRecommendations.level === 'aggressive'
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                            : effectiveRecommendations.level === 'moderate'
                                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                : effectiveRecommendations.level === 'minimal'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                                    : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'}`, children: effectiveRecommendations.level })] })] })] })] }));
}
// =============================================================================
// Performance Dashboard Demo
// =============================================================================
function PerformanceDashboardDemo() {
    const [fps, setFps] = useState(60);
    const [memory, setMemory] = useState({ used: 45, limit: 100 });
    // Simulate performance metrics
    useEffect(() => {
        const interval = setInterval(() => {
            setFps(55 + Math.random() * 10);
            setMemory((prev) => ({
                ...prev,
                used: Math.min(prev.limit, 40 + Math.random() * 20),
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const webVitals = [
        { name: 'LCP', value: 1.8, unit: 's', status: 'good' },
        { name: 'FID', value: 12, unit: 'ms', status: 'good' },
        { name: 'CLS', value: 0.05, unit: '', status: 'good' },
        { name: 'TTFB', value: 180, unit: 'ms', status: 'needs-improvement' },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-6 bg-card border rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Core Web Vitals" }), _jsx("div", { className: "grid grid-cols-4 gap-4", children: webVitals.map((vital) => (_jsxs("div", { className: "text-center p-4 bg-muted rounded-lg", children: [_jsx("p", { className: "text-xs text-muted-foreground mb-1", children: vital.name }), _jsxs("p", { className: "text-2xl font-bold", children: [vital.value, vital.unit] }), _jsx("span", { className: `text-xs px-2 py-0.5 rounded ${vital.status === 'good'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'}`, children: vital.status })] }, vital.name))) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { className: "p-6 bg-card border rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "FPS Monitor" }), _jsx("div", { className: "flex items-end gap-2 h-32", children: [...Array(20)].map((_, i) => (_jsx("div", { className: "flex-1 bg-primary/80 rounded-t transition-all", style: {
                                        height: `${((55 + Math.sin(i * 0.5) * 5) / 60) * 100}%`,
                                    } }, i))) }), _jsxs("div", { className: "mt-4 flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Current FPS" }), _jsx("span", { className: `text-2xl font-bold ${fps >= 55
                                            ? 'text-green-600'
                                            : fps >= 30
                                                ? 'text-yellow-600'
                                                : 'text-red-600'}`, children: Math.round(fps) })] })] }), _jsxs("div", { className: "p-6 bg-card border rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Memory Usage" }), _jsxs("div", { className: "relative h-32 flex items-center justify-center", children: [_jsxs("svg", { className: "w-28 h-28 transform -rotate-90", children: [_jsx("circle", { cx: "56", cy: "56", r: "48", fill: "none", stroke: "currentColor", strokeWidth: "8", className: "text-muted" }), _jsx("circle", { cx: "56", cy: "56", r: "48", fill: "none", stroke: "currentColor", strokeWidth: "8", strokeDasharray: `${(memory.used / memory.limit) * 301.59} 301.59`, className: "text-primary" })] }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("span", { className: "text-xl font-bold", children: [Math.round(memory.used), "%"] }) })] }), _jsx("div", { className: "mt-4 text-center", children: _jsxs("p", { className: "text-sm text-muted-foreground", children: [Math.round(memory.used * 10), "MB / ", memory.limit * 10, "MB"] }) })] })] })] }));
}
// =============================================================================
// Full Demo
// =============================================================================
function FullDemo() {
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx("div", { className: "space-y-6", children: _jsx(EnhancedSuggestionsDemo, {}) }), _jsx("div", { className: "space-y-6", children: _jsx(BatteryAwareDemo, {}) }), _jsx("div", { className: "lg:col-span-2", children: _jsx(PerformanceDashboardDemo, {}) })] }));
}
// =============================================================================
// Main Export
// =============================================================================
export function AdvancedFeaturesDemo({ activeTab }) {
    switch (activeTab) {
        case 'suggestions':
            return _jsx(EnhancedSuggestionsDemo, {});
        case 'battery':
            return _jsx(BatteryAwareDemo, {});
        case 'performance':
            return _jsx(PerformanceDashboardDemo, {});
        default:
            return _jsx(FullDemo, {});
    }
}
//# sourceMappingURL=advanced-features-demo.js.map