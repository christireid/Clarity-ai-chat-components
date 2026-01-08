/**
 * Advanced Token Counter with Model-Specific Heuristics
 *
 * Enhanced token counting with content type detection, confidence levels,
 * and model-specific optimizations based on empirical analysis
 */
import { encode } from 'gpt-tokenizer';
/**
 * Model-specific token ratios based on empirical analysis
 * These ratios represent characters per token for different content types
 */
const MODEL_RATIOS = {
    'gpt-4': {
        prose: 4.0,
        code: 3.5,
        mixed: 3.8,
        unknown: 3.9,
    },
    'gpt-3.5': {
        prose: 4.2,
        code: 3.8,
        mixed: 4.0,
        unknown: 4.1,
    },
    claude: {
        prose: 3.8,
        code: 3.3,
        mixed: 3.6,
        unknown: 3.7,
    },
    gemini: {
        prose: 3.9,
        code: 3.4,
        mixed: 3.7,
        unknown: 3.8,
    },
    generic: {
        prose: 4.0,
        code: 3.5,
        mixed: 3.8,
        unknown: 3.9,
    },
};
/**
 * Advanced token counter with caching and content analysis
 */
export class AdvancedTokenCounter {
    config;
    cache;
    metrics;
    constructor(config) {
        this.config = config;
        this.cache = new Map();
        this.metrics = {
            totalCounts: 0,
            cacheHits: 0,
            averageProcessingTime: 0,
            contentTypeDistribution: {
                prose: 0,
                code: 0,
                mixed: 0,
                unknown: 0,
            },
            cacheHitRate: 0,
        };
    }
    /**
     * Count tokens with high accuracy using gpt-tokenizer
     */
    async countWithConfidence(text, model = this.config.defaultModel) {
        const startTime = Date.now();
        const cacheKey = `${model}:${text}`;
        // Check cache first
        if (this.config.enableCache) {
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout) {
                this.metrics.cacheHits++;
                this.updateMetrics();
                return {
                    count: cached.count,
                    confidence: 'exact',
                    contentType: this.detectContentType(text),
                    model,
                    processingTime: Date.now() - startTime,
                    cached: true,
                };
            }
        }
        // Detect content type
        const contentType = this.detectContentType(text);
        // Use gpt-tokenizer for exact counting (works for GPT models)
        let count;
        let confidence = 'exact';
        if (model === 'gpt-4' || model === 'gpt-3.5') {
            try {
                count = encode(text).length;
            }
            catch {
                // Fallback to heuristic counting
                count = this.estimateWithHeuristics(text, model, contentType);
                confidence = 'approximate';
            }
        }
        else {
            // Use heuristic counting for non-GPT models
            count = this.estimateWithHeuristics(text, model, contentType);
            confidence = 'approximate';
        }
        // Cache the result
        if (this.config.enableCache) {
            this.cache.set(cacheKey, { count, timestamp: Date.now() });
        }
        this.metrics.totalCounts++;
        this.updateMetrics();
        return {
            count,
            confidence,
            contentType,
            model,
            processingTime: Date.now() - startTime,
            cached: false,
        };
    }
    /**
     * Simple token counting without detailed analysis
     */
    count(text, model = this.config.defaultModel) {
        return Math.ceil(text.length / MODEL_RATIOS[model][this.detectContentType(text)]);
    }
    /**
     * Estimate token count using heuristics when exact counting is not available
     */
    estimateWithHeuristics(text, model, contentType) {
        const ratio = MODEL_RATIOS[model][contentType];
        return Math.ceil(text.length / ratio);
    }
    /**
     * Detect content type based on text characteristics
     */
    detectContentType(text) {
        const codePatterns = [
            /function\s+\w+\s*\(/,
            /const\s+\w+\s*=/,
            /class\s+\w+/,
            /def\s+\w+\s*\(/,
            /\{.*\}/,
            /\[.*\]/,
            /import\s+\w+/,
            /export\s+\w+/,
        ];
        const codeMatches = codePatterns.reduce((count, pattern) => {
            const matches = text.match(pattern);
            return count + (matches ? matches.length : 0);
        }, 0);
        const codeRatio = codeMatches / (text.length / 100);
        if (codeRatio > 2) {
            this.metrics.contentTypeDistribution.code++;
            return 'code';
        }
        if (codeRatio > 0.5) {
            this.metrics.contentTypeDistribution.mixed++;
            return 'mixed';
        }
        this.metrics.contentTypeDistribution.prose++;
        return 'prose';
    }
    /**
     * Count tokens for multiple texts efficiently
     */
    async countBatch(texts, model = this.config.defaultModel) {
        return Promise.all(texts.map((text) => this.countWithConfidence(text, model).then((result) => result.count)));
    }
    /**
     * Count tokens for multiple texts with confidence information
     */
    async countBatchWithConfidence(texts, model = this.config.defaultModel) {
        return Promise.all(texts.map((text) => this.countWithConfidence(text, model)));
    }
    /**
     * Get current performance metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }
    /**
     * Reset performance metrics
     */
    resetMetrics() {
        this.metrics = {
            totalCounts: 0,
            cacheHits: 0,
            averageProcessingTime: 0,
            contentTypeDistribution: {
                prose: 0,
                code: 0,
                mixed: 0,
                unknown: 0,
            },
            cacheHitRate: 0,
        };
    }
    /**
     * Update internal metrics
     */
    updateMetrics() {
        this.metrics.cacheHitRate =
            this.metrics.cacheHits / Math.max(1, this.metrics.totalCounts);
    }
    /**
     * Clean up resources
     */
    destroy() {
        this.cache.clear();
    }
}
/**
 * Convenience function for quick token counting
 */
export function countTokens(text, model) {
    const counter = new AdvancedTokenCounter({
        defaultModel: model || 'generic',
        enableCache: true,
        cacheTimeout: 3600000,
        enableContentDetection: true,
        enableMonitoring: false,
        confidenceThreshold: 0.8,
    });
    return counter.count(text, model || 'generic');
}
/**
 * Convenience function for token counting with confidence information
 */
export async function countTokensWithConfidence(text, model) {
    const counter = new AdvancedTokenCounter({
        defaultModel: model || 'generic',
        enableCache: true,
        cacheTimeout: 3600000,
        enableContentDetection: true,
        enableMonitoring: false,
        confidenceThreshold: 0.8,
    });
    return await counter.countWithConfidence(text, model || 'generic');
}
//# sourceMappingURL=advanced-counter.js.map