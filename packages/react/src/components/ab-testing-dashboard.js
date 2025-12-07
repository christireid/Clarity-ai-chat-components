'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, cn, } from '@clarity-chat/primitives';
/**
 * Simple Progress component for internal use
 */
const Progress = React.forwardRef(({ className, value = 0, ...props }, ref) => {
    // Guard against NaN/Infinity - clamp to valid percentage range
    const safeValue = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
    return (_jsx("div", { ref: ref, className: cn('relative h-4 w-full overflow-hidden rounded-full bg-gray-200', className), ...props, children: _jsx("div", { className: "h-full bg-blue-600 transition-all", style: { width: `${safeValue}%` } }) }));
});
Progress.displayName = 'Progress';
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
export function ABTestingDashboard({ experiments, config: userConfig, onSelectExperiment, onDeclareWinner, showStatistics = true, className, }) {
    const config = { ...defaultConfig, ...userConfig };
    const [selectedExperiment, setSelectedExperiment] = React.useState(experiments[0] || null);
    const [sortBy, setSortBy] = React.useState('conversionRate');
    // Calculate statistical significance
    const calculateSignificance = React.useCallback((controlMetrics, variantMetrics) => {
        // Simple z-test for proportions
        const p1 = controlMetrics.conversionRate;
        const p2 = variantMetrics.conversionRate;
        const n1 = controlMetrics.impressions;
        const n2 = variantMetrics.impressions;
        // Pooled proportion
        const pPool = (controlMetrics.conversions + variantMetrics.conversions) / (n1 + n2);
        // Standard error
        const se = Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2));
        // Z-score
        const z = (p2 - p1) / se;
        // Two-tailed p-value (approximate)
        const pValue = 2 * (1 - normalCDF(Math.abs(z)));
        // Effect size (relative improvement)
        const effectSize = ((p2 - p1) / p1) * 100;
        const isSignificant = pValue < (1 - config.confidenceLevel) && Math.abs(effectSize) >= config.minEffect;
        return {
            isSignificant,
            pValue,
            confidenceLevel: config.confidenceLevel,
            sampleSize: n1 + n2,
            effectSize,
        };
    }, [config]);
    // Normal CDF approximation
    const normalCDF = (x) => {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp(-x * x / 2);
        const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return x > 0 ? 1 - p : p;
    };
    // Get sorted variants for selected experiment
    const getSortedVariants = React.useCallback((experiment) => {
        const variants = experiment.variants.map(variant => {
            const metrics = experiment.metrics.get(variant.id);
            return { variant, metrics };
        }).filter(v => v.metrics);
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
        const control = sorted.find(v => v.variant.isControl);
        const best = sorted[0];
        if (!control || !best.metrics)
            return null;
        // Check if best is significantly better than control
        const significance = calculateSignificance(control.metrics, best.metrics);
        if (significance.isSignificant && best.metrics.impressions >= config.minSampleSize) {
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
    const renderExperimentList = () => (_jsxs("div", { className: "space-y-2", children: [experiments.map(experiment => {
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
        const control = sorted.find(v => v.variant.isControl);
        const winner = determineWinner(selectedExperiment);
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: sortBy === 'conversionRate' ? 'default' : 'outline', size: "sm", onClick: () => setSortBy('conversionRate'), children: "Conversion Rate" }), _jsx(Button, { variant: sortBy === 'impressions' ? 'default' : 'outline', size: "sm", onClick: () => setSortBy('impressions'), children: "Impressions" }), _jsx(Button, { variant: sortBy === 'engagement' ? 'default' : 'outline', size: "sm", onClick: () => setSortBy('engagement'), children: "Engagement" })] }), winner && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, children: _jsxs(Card, { className: "border-green-500 bg-green-50 dark:bg-green-950", children: [_jsx(CardHeader, { className: "pb-3", children: _jsx(CardTitle, { className: "text-base flex items-center gap-2", children: "\uD83C\uDFC6 Winner Detected" }) }), _jsxs(CardContent, { children: [_jsxs("p", { className: "text-sm mb-2", children: [_jsx("strong", { children: winner.variant.name }), " is performing significantly better with ", formatPercent(winner.metrics.conversionRate), " conversion rate (", winner.significance.effectSize.toFixed(1), "% improvement)"] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["p-value: ", winner.significance.pValue.toFixed(4), " (", formatPercent(winner.significance.confidenceLevel), " confidence)"] }), !selectedExperiment.winner && (_jsx(Button, { size: "sm", className: "mt-3", onClick: () => handleDeclareWinner(selectedExperiment.experimentId, winner.variant.id), children: "Declare Winner" }))] })] }) })), _jsx("div", { className: "space-y-3", children: sorted.map(({ variant, metrics }, index) => {
                        if (!metrics)
                            return null;
                        const isWinner = winner?.variant.id === variant.id;
                        const significance = control && !variant.isControl
                            ? calculateSignificance(control.metrics, metrics)
                            : null;
                        return (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, children: _jsxs(Card, { className: cn(isWinner && 'border-green-500'), children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [variant.name, variant.isControl && (_jsx(Badge, { variant: "outline", className: "text-xs", children: "Control" })), isWinner && (_jsx(Badge, { variant: "success", className: "text-xs", children: "Winner" }))] }), variant.description && (_jsx(CardDescription, { className: "text-xs mt-1", children: variant.description }))] }), _jsx(Badge, { variant: "outline", children: index + 1 })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Conversion Rate" }), _jsx("div", { className: "text-2xl font-bold", children: formatPercent(metrics.conversionRate) }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [metrics.conversions, " / ", metrics.impressions] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Avg Engagement" }), _jsx("div", { className: "text-2xl font-bold", children: formatDuration(metrics.avgEngagementTime) }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [metrics.users, " users"] })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mb-1", children: [_jsx("span", { children: "Sample Size" }), _jsxs("span", { children: [metrics.impressions, " / ", config.minSampleSize] })] }), _jsx(Progress, { value: (metrics.impressions / config.minSampleSize) * 100, className: "h-2" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Bounce Rate" }), _jsx("span", { children: formatPercent(metrics.bounceRate) })] }), metrics.revenue !== undefined && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Revenue" }), _jsxs("span", { children: ["$", metrics.revenue.toFixed(2)] })] }))] }), showStatistics && significance && (_jsx("div", { className: "pt-2 border-t", children: _jsxs("div", { className: "text-xs space-y-1", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "vs Control" }), _jsx(Badge, { variant: significance.isSignificant ? 'success' : 'secondary', className: "text-xs", children: significance.isSignificant ? 'Significant' : 'Not Significant' })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Effect Size" }), _jsxs("span", { className: cn('font-medium', significance.effectSize > 0 ? 'text-green-600' : 'text-red-600'), children: [significance.effectSize > 0 ? '+' : '', significance.effectSize.toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "p-value" }), _jsx("span", { children: significance.pValue.toFixed(4) })] })] }) }))] }) })] }) }, variant.id));
                    }) })] }));
    };
    return (_jsxs("div", { className: cn('space-y-4', className), children: [_jsx(Card, { children: _jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "A/B Testing Dashboard" }), _jsx(CardDescription, { children: "Monitor experiment results and statistical significance" })] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-base", children: "Experiments" }) }), _jsx(CardContent, { children: renderExperimentList() })] }) }), _jsx("div", { className: "lg:col-span-2", children: selectedExperiment ? (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-base", children: selectedExperiment.experimentName }), _jsxs(CardDescription, { children: ["Started ", new Date(selectedExperiment.startDate).toLocaleDateString(), selectedExperiment.endDate && (_jsxs(_Fragment, { children: [" \u00B7 Ended ", new Date(selectedExperiment.endDate).toLocaleDateString()] }))] })] }), _jsx(CardContent, { children: renderVariantComparison() })] })) : (_jsx(Card, { children: _jsx(CardContent, { className: "flex items-center justify-center h-64", children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Select an experiment to view results" }) }) })) })] })] }));
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
        setExperiments(prev => [...prev, experiment]);
        return experiment;
    }, []);
    const startExperiment = React.useCallback((experimentId) => {
        setExperiments(prev => prev.map(exp => exp.experimentId === experimentId
            ? { ...exp, status: 'running' }
            : exp));
    }, []);
    const getVariant = React.useCallback((experimentId, userId) => {
        const experiment = experiments.find(e => e.experimentId === experimentId);
        if (!experiment || experiment.status !== 'running')
            return null;
        // Check if user already has a variant
        const key = `${experimentId}-${userId}`;
        if (currentVariants.has(key)) {
            return experiment.variants.find(v => v.id === currentVariants.get(key));
        }
        // Assign random variant
        const variant = experiment.variants[Math.floor(Math.random() * experiment.variants.length)];
        setCurrentVariants(prev => new Map(prev).set(key, variant.id));
        return variant;
    }, [experiments, currentVariants]);
    const recordMetric = React.useCallback((experimentId, variantId, metric) => {
        setExperiments(prev => prev.map(exp => {
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
            updated.conversionRate = updated.conversions / (updated.impressions || 1);
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
//# sourceMappingURL=ab-testing-dashboard.js.map