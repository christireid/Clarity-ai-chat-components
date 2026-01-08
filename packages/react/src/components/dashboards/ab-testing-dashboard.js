'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, cn, } from '@clarity-chat/primitives';
import { useKeyboardShortcuts, useShortcutDisplay, KeyboardShortcutsHelp, } from '../../hooks/keyboard/use-keyboard-shortcuts';
import { DashboardProgress } from '../ui/dashboard-progress';
import { KeyboardShortcutHint } from '../navigation/keyboard-shortcut-hint';
import { Skeleton } from '../ui/skeleton';
const defaultConfig = {
    minSampleSize: 100,
    confidenceLevel: 0.95,
    minEffect: 5,
    allocation: 'equal',
};
/**
 * ABTestingDashboard Component
 *
 * Display A/B test results with:
 * - Experiment overview
 * - Variant performance comparison
 * - Statistical significance testing
 * - Winner recommendation
 * - Conversion funnel visualization
 */
export function ABTestingDashboard({ experiments, config: userConfig, onSelectExperiment, onDeclareWinner, showStatistics = true, className, isLoading = false, error = null, onRefresh, enableKeyboardShortcuts = true, }) {
    const config = { ...defaultConfig, ...userConfig };
    const [selectedExperiment, setSelectedExperiment] = React.useState(experiments[0] || null);
    const [sortBy, setSortBy] = React.useState('conversionRate');
    const [showShortcutsHelp, setShowShortcutsHelp] = React.useState(false);
    const getShortcut = useShortcutDisplay();
    // Get current experiment index for navigation
    const currentIndex = React.useMemo(() => {
        if (!selectedExperiment)
            return -1;
        return experiments.findIndex((exp) => exp.experimentId === selectedExperiment.experimentId);
    }, [experiments, selectedExperiment]);
    // Navigate to next experiment
    const navigateNext = React.useCallback(() => {
        if (experiments.length === 0)
            return;
        const nextIndex = currentIndex < experiments.length - 1 ? currentIndex + 1 : 0;
        const nextExp = experiments[nextIndex];
        setSelectedExperiment(nextExp);
        onSelectExperiment?.(nextExp);
    }, [experiments, currentIndex, onSelectExperiment]);
    // Navigate to previous experiment
    const navigatePrev = React.useCallback(() => {
        if (experiments.length === 0)
            return;
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : experiments.length - 1;
        const prevExp = experiments[prevIndex];
        setSelectedExperiment(prevExp);
        onSelectExperiment?.(prevExp);
    }, [experiments, currentIndex, onSelectExperiment]);
    // Keyboard shortcuts definition
    const keyboardShortcuts = React.useMemo(() => [
        {
            key: 'j',
            callback: navigateNext,
            description: 'Next experiment',
            enabled: enableKeyboardShortcuts && !showShortcutsHelp,
        },
        {
            key: 'arrowdown',
            callback: navigateNext,
            description: 'Next experiment',
            enabled: enableKeyboardShortcuts && !showShortcutsHelp,
        },
        {
            key: 'k',
            callback: navigatePrev,
            description: 'Previous experiment',
            enabled: enableKeyboardShortcuts && !showShortcutsHelp,
        },
        {
            key: 'arrowup',
            callback: navigatePrev,
            description: 'Previous experiment',
            enabled: enableKeyboardShortcuts && !showShortcutsHelp,
        },
        {
            key: 'r',
            callback: () => onRefresh?.(),
            description: 'Refresh data',
            enabled: enableKeyboardShortcuts && !showShortcutsHelp && !!onRefresh,
        },
        {
            key: 'shift+/',
            callback: () => setShowShortcutsHelp(true),
            description: 'Show keyboard shortcuts',
            enabled: enableKeyboardShortcuts && !showShortcutsHelp,
        },
        {
            key: '1',
            callback: () => setSortBy('conversionRate'),
            description: 'Sort by conversion rate',
            enabled: enableKeyboardShortcuts && !showShortcutsHelp,
        },
        {
            key: '2',
            callback: () => setSortBy('impressions'),
            description: 'Sort by impressions',
            enabled: enableKeyboardShortcuts && !showShortcutsHelp,
        },
        {
            key: '3',
            callback: () => setSortBy('engagement'),
            description: 'Sort by engagement',
            enabled: enableKeyboardShortcuts && !showShortcutsHelp,
        },
    ], [
        enableKeyboardShortcuts,
        showShortcutsHelp,
        navigateNext,
        navigatePrev,
        onRefresh,
    ]);
    // Display shortcuts for help panel (filtered, unique descriptions)
    const displayShortcuts = React.useMemo(() => [
        { key: 'j', callback: () => { }, description: 'Next experiment' },
        { key: 'k', callback: () => { }, description: 'Previous experiment' },
        { key: 'r', callback: () => { }, description: 'Refresh data' },
        { key: '1', callback: () => { }, description: 'Sort by conversion rate' },
        { key: '2', callback: () => { }, description: 'Sort by impressions' },
        { key: '3', callback: () => { }, description: 'Sort by engagement' },
        {
            key: 'shift+/',
            callback: () => { },
            description: 'Show keyboard shortcuts',
        },
    ], []);
    // Register keyboard shortcuts
    useKeyboardShortcuts(keyboardShortcuts);
    // Sync selectedExperiment when experiments prop changes
    React.useEffect(() => {
        // If selected experiment no longer exists in experiments, reset to first
        if (selectedExperiment) {
            const stillExists = experiments.some((exp) => exp.experimentId === selectedExperiment.experimentId);
            if (!stillExists) {
                setSelectedExperiment(experiments[0] || null);
            }
        }
        else if (experiments.length > 0) {
            setSelectedExperiment(experiments[0]);
        }
    }, [experiments, selectedExperiment]);
    // Calculate statistical significance
    const calculateSignificance = React.useCallback((controlMetrics, variantMetrics) => {
        // Simple z-test for proportions
        const p1 = controlMetrics.conversionRate;
        const p2 = variantMetrics.conversionRate;
        const n1 = controlMetrics.impressions;
        const n2 = variantMetrics.impressions;
        const totalSampleSize = n1 + n2;
        // Guard against insufficient data - return non-significant result
        if (totalSampleSize === 0 || n1 === 0 || n2 === 0) {
            return {
                isSignificant: false,
                pValue: 1,
                confidenceLevel: config.confidenceLevel,
                sampleSize: totalSampleSize,
                effectSize: 0,
            };
        }
        // Pooled proportion
        const pPool = (controlMetrics.conversions + variantMetrics.conversions) /
            totalSampleSize;
        // Standard error - guard against pPool being 0 or 1 (causes se=0)
        const seSquared = pPool * (1 - pPool) * (1 / n1 + 1 / n2);
        const se = seSquared > 0 ? Math.sqrt(seSquared) : 0;
        // Z-score - guard against se being 0
        const z = se > 0 ? (p2 - p1) / se : 0;
        // Two-tailed p-value (approximate)
        const pValue = se > 0 ? 2 * (1 - normalCDF(Math.abs(z))) : 1;
        // Effect size (relative improvement) - guard against p1 being 0
        // When control rate is 0, use absolute difference instead
        const effectSize = p1 > 0 ? ((p2 - p1) / p1) * 100 : p2 > 0 ? 100 : 0;
        const isSignificant = pValue < 1 - config.confidenceLevel &&
            Math.abs(effectSize) >= config.minEffect;
        return {
            isSignificant,
            pValue,
            confidenceLevel: config.confidenceLevel,
            sampleSize: totalSampleSize,
            effectSize,
        };
    }, [config]);
    // Normal CDF approximation
    const normalCDF = (x) => {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp((-x * x) / 2);
        const p = d *
            t *
            (0.3193815 +
                t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return x > 0 ? 1 - p : p;
    };
    // Get sorted variants for selected experiment
    const getSortedVariants = React.useCallback((experiment) => {
        const variants = experiment.variants
            .map((variant) => {
            const metrics = experiment.metrics.get(variant.id);
            return { variant, metrics };
        })
            .filter((v) => v.metrics);
        return variants.sort((a, b) => {
            if (sortBy === 'conversionRate') {
                return b.metrics.conversionRate - a.metrics.conversionRate;
            }
            else if (sortBy === 'impressions') {
                return b.metrics.impressions - a.metrics.impressions;
            }
            else {
                return b.metrics.avgEngagementTime - a.metrics.avgEngagementTime;
            }
        });
    }, [sortBy]);
    // Determine winner
    const determineWinner = React.useCallback((experiment) => {
        const sorted = getSortedVariants(experiment);
        if (sorted.length < 2)
            return null;
        const control = sorted.find((v) => v.variant.isControl);
        const best = sorted[0];
        if (!control || !best.metrics)
            return null;
        // Check if best is significantly better than control
        const significance = calculateSignificance(control.metrics, best.metrics);
        if (significance.isSignificant &&
            best.metrics.impressions >= config.minSampleSize) {
            return {
                variant: best.variant,
                metrics: best.metrics,
                significance,
            };
        }
        return null;
    }, [getSortedVariants, calculateSignificance, config]);
    // Handle experiment selection
    const handleSelectExperiment = (experiment) => {
        setSelectedExperiment(experiment);
        onSelectExperiment?.(experiment);
    };
    // Handle declare winner
    const handleDeclareWinner = (experimentId, winnerId) => {
        onDeclareWinner?.(experimentId, winnerId);
    };
    // Format percentage
    const formatPercent = (value) => `${(value * 100).toFixed(2)}%`;
    // Format duration
    const formatDuration = (ms) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
    };
    // Render experiment list
    const renderExperimentList = () => (_jsxs("div", { className: "space-y-2", children: [experiments.map((experiment) => {
                const isSelected = selectedExperiment?.experimentId === experiment.experimentId;
                const winner = determineWinner(experiment);
                return (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, whileHover: { scale: 1.01 }, whileTap: { scale: 0.99 }, children: _jsxs(Card, { className: cn('cursor-pointer transition-colors', 'focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-1', isSelected && 'border-primary'), onClick: () => handleSelectExperiment(experiment), onKeyDown: (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSelectExperiment(experiment);
                            }
                        }, role: "button", tabIndex: 0, "aria-label": `Select experiment ${experiment.experimentName}`, "aria-pressed": isSelected, children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { className: "text-base", children: experiment.experimentName }), experiment.description && (_jsx(CardDescription, { className: "text-xs mt-1", children: experiment.description }))] }), _jsx(Badge, { variant: experiment.status === 'running'
                                                ? 'default'
                                                : experiment.status === 'completed'
                                                    ? 'secondary'
                                                    : 'outline', children: experiment.status })] }) }), _jsx(CardContent, { className: "pt-0", children: _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("span", { className: "text-muted-foreground", children: [experiment.variants.length, " variants"] }), winner && (_jsx(Badge, { variant: "success", className: "text-xs", children: "Winner found" }))] }) })] }) }, experiment.experimentId));
            }), experiments.length === 0 && (_jsx("p", { className: "text-sm text-muted-foreground text-center py-8", children: "No experiments yet. Create your first A/B test to get started." }))] }));
    // Render variant comparison
    const renderVariantComparison = () => {
        if (!selectedExperiment)
            return null;
        const sorted = getSortedVariants(selectedExperiment);
        const control = sorted.find((v) => v.variant.isControl);
        const winner = determineWinner(selectedExperiment);
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: sortBy === 'conversionRate' ? 'default' : 'outline', size: "sm", onClick: () => setSortBy('conversionRate'), children: "Conversion Rate" }), _jsx(Button, { variant: sortBy === 'impressions' ? 'default' : 'outline', size: "sm", onClick: () => setSortBy('impressions'), children: "Impressions" }), _jsx(Button, { variant: sortBy === 'engagement' ? 'default' : 'outline', size: "sm", onClick: () => setSortBy('engagement'), children: "Engagement" })] }), winner && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, children: _jsxs(Card, { className: "border-green-500 bg-green-50 dark:bg-green-950", children: [_jsx(CardHeader, { className: "pb-3", children: _jsx(CardTitle, { className: "text-base flex items-center gap-2", children: "\uD83C\uDFC6 Winner Detected" }) }), _jsxs(CardContent, { children: [_jsxs("p", { className: "text-sm mb-2", children: [_jsx("strong", { children: winner.variant.name }), " is performing significantly better with", ' ', formatPercent(winner.metrics.conversionRate), " conversion rate (", winner.significance.effectSize.toFixed(1), "% improvement)"] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["p-value: ", winner.significance.pValue.toFixed(4), " (", formatPercent(winner.significance.confidenceLevel), ' ', "confidence)"] }), !selectedExperiment.winner && (_jsx(Button, { size: "sm", className: "mt-3", onClick: () => handleDeclareWinner(selectedExperiment.experimentId, winner.variant.id), children: "Declare Winner" }))] })] }) })), _jsx("div", { className: "space-y-3", children: sorted.map(({ variant, metrics }, index) => {
                        if (!metrics)
                            return null;
                        const isWinner = winner?.variant.id === variant.id;
                        const significance = control && !variant.isControl
                            ? calculateSignificance(control.metrics, metrics)
                            : null;
                        return (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, children: _jsxs(Card, { className: cn(isWinner && 'border-green-500'), children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [variant.name, variant.isControl && (_jsx(Badge, { variant: "outline", className: "text-xs", children: "Control" })), isWinner && (_jsx(Badge, { variant: "success", className: "text-xs", children: "Winner" }))] }), variant.description && (_jsx(CardDescription, { className: "text-xs mt-1", children: variant.description }))] }), _jsx(Badge, { variant: "outline", children: index + 1 })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Conversion Rate" }), _jsx("div", { className: "text-2xl font-bold", children: formatPercent(metrics.conversionRate) }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [metrics.conversions, " / ", metrics.impressions] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Avg Engagement" }), _jsx("div", { className: "text-2xl font-bold", children: formatDuration(metrics.avgEngagementTime) }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [metrics.users, " users"] })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mb-1", children: [_jsx("span", { children: "Sample Size" }), _jsxs("span", { children: [metrics.impressions, " / ", config.minSampleSize] })] }), _jsx(DashboardProgress, { value: (metrics.impressions / config.minSampleSize) * 100, size: "sm", "aria-label": `Sample size progress: ${metrics.impressions} of ${config.minSampleSize} required` })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Bounce Rate" }), _jsx("span", { children: formatPercent(metrics.bounceRate) })] }), metrics.revenue !== undefined && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Revenue" }), _jsxs("span", { children: ["$", metrics.revenue.toFixed(2)] })] }))] }), showStatistics && significance && (_jsx("div", { className: "pt-2 border-t", children: _jsxs("div", { className: "text-xs space-y-1", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "vs Control" }), _jsx(Badge, { variant: significance.isSignificant
                                                                            ? 'success'
                                                                            : 'secondary', className: "text-xs", children: significance.isSignificant
                                                                            ? 'Significant'
                                                                            : 'Not Significant' })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Effect Size" }), _jsxs("span", { className: cn('font-medium', significance.effectSize > 0
                                                                            ? 'text-green-700 dark:text-green-400'
                                                                            : 'text-red-700 dark:text-red-400'), "aria-label": `Effect size: ${significance.effectSize > 0 ? 'positive' : 'negative'} ${Math.abs(significance.effectSize).toFixed(1)} percent`, children: [significance.effectSize > 0 ? '+' : '', significance.effectSize.toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "p-value" }), _jsx("span", { children: significance.pValue.toFixed(4) })] })] }) }))] }) })] }) }, variant.id));
                    }) })] }));
    };
    // Loading state
    if (isLoading) {
        return (_jsxs("div", { className: cn('space-y-4', className), role: "status", "aria-label": "Loading A/B Testing Dashboard", "aria-busy": "true", children: [_jsx(Card, { children: _jsx(CardHeader, { children: _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { width: 192, height: 24, rounded: "md" }), _jsx(Skeleton, { width: 256, height: 16, rounded: "md" })] }) }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsxs(Card, { className: "lg:col-span-1", children: [_jsx(CardHeader, { children: _jsx(Skeleton, { width: 96, height: 20, rounded: "md" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => (_jsx(Skeleton, { height: 80, rounded: "lg" }, i))) }) })] }), _jsx(Card, { className: "lg:col-span-2", children: _jsx(CardContent, { className: "flex items-center justify-center h-64", children: _jsx(Skeleton, { width: 192, height: 16, rounded: "md" }) }) })] }), _jsx("span", { className: "sr-only", children: "Loading A/B testing data..." })] }));
    }
    // Error state
    if (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return (_jsx("div", { className: cn('space-y-4', className), role: "alert", "aria-live": "assertive", children: _jsx(Card, { className: "border-destructive/30", children: _jsx(CardContent, { className: "p-8", children: _jsxs("div", { className: "flex flex-col items-center justify-center gap-3 text-center", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10", children: _jsx("svg", { className: "h-6 w-6 text-destructive", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-base font-medium text-foreground", children: "Failed to load A/B testing data" }), _jsx("p", { className: "text-sm text-muted-foreground", children: errorMessage })] })] }) }) }) }));
    }
    return (_jsxs("div", { className: cn('space-y-4', className), role: "region", "aria-label": "A/B Testing Dashboard", children: [showShortcutsHelp && (_jsx(KeyboardShortcutsHelp, { shortcuts: displayShortcuts, onClose: () => setShowShortcutsHelp(false), title: "A/B Testing Keyboard Shortcuts" })), _jsx(Card, { children: _jsx(CardHeader, { children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { children: "A/B Testing Dashboard" }), _jsx(CardDescription, { children: "Monitor experiment results and statistical significance" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [onRefresh && (_jsxs(Button, { variant: "outline", size: "sm", onClick: onRefresh, "aria-label": "Refresh data", children: [_jsx("svg", { className: "h-4 w-4 mr-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }), _jsx("span", { className: "hidden sm:inline", children: "Refresh" }), _jsx("kbd", { className: "ml-2 hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground", children: "R" })] })), enableKeyboardShortcuts && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowShortcutsHelp(true), "aria-label": "Show keyboard shortcuts", className: "text-muted-foreground", children: _jsx("kbd", { className: "flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium", children: "?" }) }))] })] }) }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-base", children: "Experiments" }) }), _jsx(CardContent, { children: renderExperimentList() })] }) }), _jsx("div", { className: "lg:col-span-2", children: selectedExperiment ? (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-base", children: selectedExperiment.experimentName }), _jsxs(CardDescription, { children: ["Started", ' ', new Date(selectedExperiment.startDate).toLocaleDateString(), selectedExperiment.endDate && (_jsxs(_Fragment, { children: [' ', "\u00B7 Ended", ' ', new Date(selectedExperiment.endDate).toLocaleDateString()] }))] })] }), _jsx(CardContent, { children: renderVariantComparison() })] })) : (_jsx(Card, { children: _jsx(CardContent, { className: "flex items-center justify-center h-64", children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Select an experiment to view results" }) }) })) })] }), enableKeyboardShortcuts && (_jsx(KeyboardShortcutHint, { storageKey: "ab-testing-dashboard", message: "Keyboard shortcuts available", shortcutKey: "?", position: "bottom-right", showDelay: 2000, displayDuration: 6000 }))] }));
}
/**
 * Hook for managing A/B test experiments
 */
export function useABTesting() {
    const [experiments, setExperiments] = React.useState([]);
    const [currentVariants, setCurrentVariants] = React.useState(new Map());
    const createExperiment = React.useCallback((name, variants, description) => {
        const experiment = {
            experimentId: `exp-${Date.now()}`,
            experimentName: name,
            description,
            status: 'draft',
            startDate: Date.now(),
            variants,
            metrics: new Map(),
        };
        setExperiments((prev) => [...prev, experiment]);
        return experiment;
    }, []);
    const startExperiment = React.useCallback((experimentId) => {
        setExperiments((prev) => prev.map((exp) => exp.experimentId === experimentId
            ? { ...exp, status: 'running' }
            : exp));
    }, []);
    const getVariant = React.useCallback((experimentId, userId) => {
        const experiment = experiments.find((e) => e.experimentId === experimentId);
        if (!experiment || experiment.status !== 'running')
            return null;
        // Check if user already has a variant
        const key = `${experimentId}-${userId}`;
        if (currentVariants.has(key)) {
            return experiment.variants.find((v) => v.id === currentVariants.get(key));
        }
        // Assign random variant
        const variant = experiment.variants[Math.floor(Math.random() * experiment.variants.length)];
        setCurrentVariants((prev) => new Map(prev).set(key, variant.id));
        return variant;
    }, [experiments, currentVariants]);
    const recordMetric = React.useCallback((experimentId, variantId, metric) => {
        setExperiments((prev) => prev.map((exp) => {
            if (exp.experimentId !== experimentId)
                return exp;
            const existing = exp.metrics.get(variantId) || {
                variantId,
                impressions: 0,
                conversions: 0,
                conversionRate: 0,
                avgEngagementTime: 0,
                bounceRate: 0,
                users: 0,
            };
            const updated = { ...existing, ...metric };
            updated.conversionRate =
                updated.conversions / (updated.impressions || 1);
            const newMetrics = new Map(exp.metrics);
            newMetrics.set(variantId, updated);
            return { ...exp, metrics: newMetrics };
        }));
    }, []);
    return {
        experiments,
        createExperiment,
        startExperiment,
        getVariant,
        recordMetric,
    };
}
ABTestingDashboard.displayName = 'ABTestingDashboard';
//# sourceMappingURL=ab-testing-dashboard.js.map