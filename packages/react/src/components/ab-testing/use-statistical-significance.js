'use client';
import * as React from 'react';
/**
 * Normal CDF approximation using Abramowitz and Stegun formula
 */
export function normalCDF(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp((-x * x) / 2);
    const p = d *
        t *
        (0.3193815 +
            t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
}
/**
 * Calculate statistical significance using z-test for proportions
 *
 * @param control - Control variant metrics
 * @param variant - Treatment variant metrics
 * @param options - Test options
 * @returns Significance test result
 */
export function calculateSignificance(control, variant, options = {}) {
    const { confidenceLevel = 0.95, minEffect = 5 } = options;
    const n1 = control.impressions;
    const n2 = variant.impressions;
    const totalSampleSize = n1 + n2;
    // Guard against insufficient data
    if (totalSampleSize === 0 || n1 === 0 || n2 === 0) {
        return {
            isSignificant: false,
            pValue: 1,
            confidenceLevel,
            sampleSize: totalSampleSize,
            effectSize: 0,
        };
    }
    // Calculate conversion rates if not provided
    const p1 = control.conversionRate ?? control.conversions / n1;
    const p2 = variant.conversionRate ?? variant.conversions / n2;
    // Pooled proportion
    const pPool = (control.conversions + variant.conversions) / totalSampleSize;
    // Standard error - guard against pPool being 0 or 1
    const seSquared = pPool * (1 - pPool) * (1 / n1 + 1 / n2);
    const se = seSquared > 0 ? Math.sqrt(seSquared) : 0;
    // Z-score - guard against se being 0
    const z = se > 0 ? (p2 - p1) / se : 0;
    // Two-tailed p-value
    const pValue = se > 0 ? 2 * (1 - normalCDF(Math.abs(z))) : 1;
    // Effect size (relative improvement) - guard against p1 being 0
    const effectSize = p1 > 0 ? ((p2 - p1) / p1) * 100 : p2 > 0 ? 100 : 0;
    const isSignificant = pValue < 1 - confidenceLevel && Math.abs(effectSize) >= minEffect;
    return {
        isSignificant,
        pValue,
        confidenceLevel,
        sampleSize: totalSampleSize,
        effectSize,
    };
}
/**
 * Hook for calculating statistical significance between two variants
 *
 * @example
 * ```tsx
 * const { isSignificant, pValue, effectSize } = useStatisticalSignificance(
 *   controlMetrics,
 *   variantMetrics,
 *   { confidenceLevel: 0.95 }
 * )
 * ```
 */
export function useStatisticalSignificance(control, variant, options = {}) {
    return React.useMemo(() => {
        if (!control || !variant)
            return null;
        return calculateSignificance(control, variant, options);
    }, [control, variant, options.confidenceLevel, options.minEffect]);
}
//# sourceMappingURL=use-statistical-significance.js.map