/**
 * TOON Optimization Utilities
 *
 * Automatic detection and optimization for TOON vs JSON usage
 */
import { jsonToToon, estimateToonSavings, isSuitableForToon } from './encoder';
import { toonToJson } from './decoder';
import { estimateTokens } from '../tokenization/estimator';
/**
 * Automatically optimize data format (JSON vs TOON)
 *
 * @example
 * ```ts
 * const result = autoOptimize(data)
 * console.log(`Using ${result.format}, saved ${result.savingsPercent}%`)
 * // Send result.data to LLM
 * ```
 */
export function autoOptimize(data, options = {}) {
    const { minSavingsPercent = 20, forceToon = false, forceJson = false, compact = true, } = options;
    const json = JSON.stringify(data);
    const jsonTokens = estimateTokens(json);
    // Force JSON if requested
    if (forceJson) {
        return {
            format: 'json',
            data: json,
            originalTokens: jsonTokens,
            optimizedTokens: jsonTokens,
            tokensSaved: 0,
            savingsPercent: 0,
            reason: 'Forced JSON format',
        };
    }
    // Check if data is suitable for TOON
    const suitable = isSuitableForToon(data);
    if (!suitable && !forceToon) {
        return {
            format: 'json',
            data: json,
            originalTokens: jsonTokens,
            optimizedTokens: jsonTokens,
            tokensSaved: 0,
            savingsPercent: 0,
            reason: 'Data not suitable for TOON (deeply nested or non-uniform structure)',
        };
    }
    // Estimate savings
    const savings = estimateToonSavings(data);
    // Use TOON if savings exceed threshold or forced
    if (savings.savingsPercent >= minSavingsPercent || forceToon) {
        const toon = jsonToToon(data, { compact });
        const toonTokens = estimateTokens(toon);
        return {
            format: 'toon',
            data: toon,
            originalTokens: jsonTokens,
            optimizedTokens: toonTokens,
            tokensSaved: savings.savings,
            savingsPercent: savings.savingsPercent,
            reason: `TOON saves ${savings.savingsPercent.toFixed(1)}% tokens`,
        };
    }
    // Default to JSON
    return {
        format: 'json',
        data: json,
        originalTokens: jsonTokens,
        optimizedTokens: jsonTokens,
        tokensSaved: 0,
        savingsPercent: 0,
        reason: `TOON savings (${savings.savingsPercent.toFixed(1)}%) below threshold (${minSavingsPercent}%)`,
    };
}
/**
 * Parse response that might be in TOON or JSON format
 */
export function parseFlexible(response) {
    // Try JSON first
    try {
        return JSON.parse(response);
    }
    catch {
        // Try TOON
        try {
            return toonToJson(response);
        }
        catch {
            // Return raw string if neither works
            return response;
        }
    }
}
/**
 * Batch optimize multiple data items
 */
export function batchOptimize(items, options = {}) {
    const results = items.map(item => autoOptimize(item, options));
    const totalOriginal = results.reduce((sum, r) => sum + r.originalTokens, 0);
    const totalOptimized = results.reduce((sum, r) => sum + r.optimizedTokens, 0);
    const totalSavings = totalOriginal - totalOptimized;
    const totalSavingsPercent = totalOriginal > 0 ? (totalSavings / totalOriginal) * 100 : 0;
    return {
        results,
        totalSavings,
        totalSavingsPercent,
    };
}
/**
 * Format data for LLM with automatic optimization
 */
export function formatForLLM(data, options = {}) {
    const result = autoOptimize(data, options);
    return {
        formatted: result.data,
        metadata: {
            format: result.format,
            tokensSaved: result.tokensSaved,
            savingsPercent: result.savingsPercent,
        },
    };
}
//# sourceMappingURL=optimizer.js.map