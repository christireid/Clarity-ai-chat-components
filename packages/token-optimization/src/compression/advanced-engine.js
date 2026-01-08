/**
 * Advanced Compression Engine
 *
 * Enterprise-grade compression system with multiple strategies,
 * adaptive selection, and quality preservation
 */
import { AdvancedTokenCounter } from './advanced-counter';
/**
 * Content analyzer for compression strategy selection
 */
class ContentAnalyzer {
    counter;
    constructor() {
        this.counter = new AdvancedTokenCounter();
    }
    analyze(text) {
        const contentType = this.detectContentType(text);
        const length = text.length;
        const sentenceCount = text.split(/[.!?]+/).length;
        const paragraphCount = text.split(/\n\s*\n/).length;
        // Calculate complexity based on various factors
        const vocabularySize = new Set(text.toLowerCase().split(/\s+/)).size;
        const avgWordLength = text.replace(/\s/g, '').length / text.split(/\s+/).length;
        const punctuationDensity = (text.match(/[,.;:!?]/g) || []).length / length;
        const complexity = Math.min(1, (vocabularySize / 500 + avgWordLength / 10 + punctuationDensity * 5) / 3);
        const structureScore = Math.min(1, (sentenceCount / 50 + paragraphCount / 10) / 2);
        return {
            contentType,
            complexity,
            structureScore,
            length,
            sentenceCount,
            paragraphCount,
        };
    }
    detectContentType(text) {
        if (!text || text.length === 0)
            return 'unknown';
        const codePatterns = [
            /\b(function|const|let|var|class|import|export|if|for|while|return)\s+/m,
            /[{}();=]/g,
            /^\s*\/\//m,
            /^\s*#\s*(include|define|pragma)/m,
            /`[^`]*`|'[^']*'|"[^"]*"/g,
        ];
        const codeMatches = codePatterns.reduce((count, pattern) => {
            const matches = text.match(pattern);
            return count + (matches ? matches.length : 0);
        }, 0);
        const codeRatio = codeMatches / (text.length / 100);
        if (codeRatio > 2)
            return 'code';
        if (codeRatio > 0.5)
            return 'mixed';
        return 'prose';
    }
}
/**
 * Truncate compression strategy
 */
export class TruncateStrategy {
    name = 'truncate';
    counter;
    constructor() {
        this.counter = new AdvancedTokenCounter();
    }
    async compress(text, targetRatio) {
        const startTime = performance.now();
        const originalTokens = this.counter.count(text);
        const targetTokens = Math.floor(originalTokens * targetRatio);
        const compressed = this.intelligentTruncate(text, targetTokens);
        const compressedTokens = this.counter.count(compressed);
        const processingTime = performance.now() - startTime;
        return {
            original: text,
            compressed,
            originalTokens,
            compressedTokens,
            compressionRatio: originalTokens / compressedTokens,
            method: this.name,
            quality: this.assessQuality(text, compressed),
            metadata: {
                strategy: this.name,
                processingTime,
            },
        };
    }
    estimate(text, targetRatio) {
        const originalTokens = this.counter.count(text);
        const _targetTokens = Math.floor(originalTokens * targetRatio);
        // Estimate based on content type
        const contentType = this.detectContentType(text);
        let achievableRatio = targetRatio;
        let quality = 0.8;
        switch (contentType) {
            case 'code':
                // Code can be truncated more aggressively
                achievableRatio = Math.min(targetRatio, 0.7);
                quality = 0.6;
                break;
            case 'prose':
                // Prose needs more careful truncation
                achievableRatio = Math.min(targetRatio, 0.85);
                quality = 0.9;
                break;
            case 'mixed':
                achievableRatio = Math.min(targetRatio, 0.75);
                quality = 0.7;
                break;
        }
        return {
            achievableRatio,
            quality,
            processingTime: Math.min(text.length / 1000, 100), // ~1ms per 1000 chars
            recommended: achievableRatio >= 0.5,
        };
    }
    intelligentTruncate(text, maxTokens) {
        const tokens = this.counter.count(text);
        if (tokens <= maxTokens)
            return text;
        // Analyze content structure
        const sentences = text
            .split(/[.!?]+/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        const paragraphs = text
            .split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter((p) => p.length > 0);
        if (sentences.length <= 3) {
            // Short text - simple truncation
            return this.simpleTruncate(text, maxTokens);
        }
        // Multi-sentence text - preserve structure
        return this.structureAwareTruncate(text, maxTokens, sentences, paragraphs);
    }
    structureAwareTruncate(text, maxTokens, sentences, paragraphs) {
        // Keep first paragraph and last sentence
        const firstParagraph = paragraphs[0] || '';
        const lastSentence = sentences[sentences.length - 1] || '';
        let result = firstParagraph;
        let usedTokens = this.counter.count(result);
        // Add last sentence if it fits
        const lastSentenceTokens = this.counter.count(lastSentence);
        if (usedTokens + lastSentenceTokens <= maxTokens) {
            result += (result ? '\n\n' : '') + '[...]\n\n' + lastSentence;
            usedTokens += lastSentenceTokens + 4; // For the [...] marker
        }
        if (usedTokens > maxTokens) {
            // Still too long, truncate first paragraph
            result = this.simpleTruncate(firstParagraph, maxTokens - 10) + '...';
        }
        return result;
    }
    simpleTruncate(text, maxTokens) {
        let left = 0;
        let right = text.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            const truncated = text.slice(0, mid);
            const tokens = this.counter.count(truncated);
            if (tokens <= maxTokens) {
                left = mid + 1;
            }
            else {
                right = mid;
            }
        }
        return text.slice(0, left - 1).trim();
    }
    detectContentType(text) {
        // Simple content type detection
        if (text.includes('function') ||
            text.includes('const') ||
            text.includes('class')) {
            return 'code';
        }
        return 'prose';
    }
    assessQuality(original, compressed) {
        // Simple quality assessment based on information retention
        const originalWords = new Set(original.toLowerCase().split(/\s+/));
        const compressedWords = new Set(compressed.toLowerCase().split(/\s+/));
        const retainedWords = Array.from(originalWords).filter((word) => compressedWords.has(word) && word.length > 3);
        return Math.min(1, (retainedWords.length / originalWords.size) * 1.5);
    }
}
/**
 * Extract compression strategy - extracts key information
 */
export class ExtractStrategy {
    name = 'extract';
    counter;
    constructor() {
        this.counter = new AdvancedTokenCounter();
    }
    async compress(text, targetRatio) {
        const startTime = performance.now();
        const originalTokens = this.counter.count(text);
        const targetTokens = Math.floor(originalTokens * targetRatio);
        const extracted = this.extractKeyInformation(text, targetTokens);
        const extractedTokens = this.counter.count(extracted);
        const processingTime = performance.now() - startTime;
        return {
            original: text,
            compressed: extracted,
            originalTokens,
            compressedTokens: extractedTokens,
            compressionRatio: originalTokens / extractedTokens,
            method: this.name,
            quality: this.assessExtractionQuality(text, extracted),
            metadata: {
                strategy: this.name,
                processingTime,
            },
        };
    }
    estimate(text, targetRatio) {
        const contentType = this.detectContentType(text);
        let achievableRatio = targetRatio;
        let quality = 0.7;
        let processingTime = Math.min(text.length / 500, 200);
        let recommended = true;
        switch (contentType) {
            case 'code':
                // Code extraction is effective
                achievableRatio = Math.min(targetRatio, 0.6);
                quality = 0.8;
                break;
            case 'prose':
                // Prose extraction is challenging
                achievableRatio = Math.min(targetRatio, 0.8);
                quality = 0.6;
                processingTime *= 1.5;
                break;
            case 'mixed':
                achievableRatio = Math.min(targetRatio, 0.7);
                quality = 0.65;
                break;
        }
        return {
            achievableRatio,
            quality,
            processingTime,
            recommended,
        };
    }
    extractKeyInformation(text, maxTokens) {
        const contentType = this.detectContentType(text);
        switch (contentType) {
            case 'code':
                return this.extractCodeInformation(text, maxTokens);
            case 'prose':
                return this.extractProseInformation(text, maxTokens);
            default:
                return this.extractGenericInformation(text, maxTokens);
        }
    }
    extractCodeInformation(text, maxTokens) {
        // Extract function signatures, class definitions, and key comments
        const lines = text.split('\n');
        const extracted = [];
        let currentTokens = 0;
        for (const line of lines) {
            const lineTokens = this.counter.count(line);
            if (currentTokens + lineTokens > maxTokens)
                break;
            // Keep important code elements
            if (line.includes('function') ||
                line.includes('class') ||
                line.includes('const') ||
                line.includes('export') ||
                line.includes('import') ||
                line.trim().startsWith('//') ||
                line.trim().startsWith('*') ||
                line.includes('=')) {
                extracted.push(line);
                currentTokens += lineTokens;
            }
        }
        return extracted.join('\n');
    }
    extractProseInformation(text, maxTokens) {
        // Extract key sentences and important phrases
        const sentences = text
            .split(/[.!?]+/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        const extracted = [];
        let currentTokens = 0;
        for (const sentence of sentences) {
            const sentenceTokens = this.counter.count(sentence);
            if (currentTokens + sentenceTokens > maxTokens)
                break;
            // Keep sentences with key information
            if (sentence.length > 20 && // Not too short
                !sentence.toLowerCase().includes('however') && // Not filler
                !sentence.toLowerCase().includes('moreover')) {
                extracted.push(sentence);
                currentTokens += sentenceTokens;
            }
        }
        return extracted.join('. ') + '.';
    }
    extractGenericInformation(text, _maxTokens) {
        // Simple extraction - keep first and last parts
        const targetLength = Math.floor(text.length * 0.6);
        const firstPart = text.slice(0, Math.floor(targetLength * 0.7));
        const lastPart = text.slice(-Math.floor(targetLength * 0.3));
        return firstPart + ' [...] ' + lastPart;
    }
    detectContentType(text) {
        if (text.includes('function') ||
            text.includes('const') ||
            text.includes('class')) {
            return 'code';
        }
        return 'prose';
    }
    assessExtractionQuality(original, extracted) {
        // Quality based on keyword retention
        const originalKeywords = this.extractKeywords(original);
        const extractedKeywords = this.extractKeywords(extracted);
        const retainedKeywords = originalKeywords.filter((keyword) => extractedKeywords.includes(keyword));
        return Math.min(1, retainedKeywords.length / originalKeywords.length);
    }
    extractKeywords(text) {
        const words = text.toLowerCase().split(/\s+/);
        const frequency = {};
        for (const word of words) {
            if (word.length > 4 && !this.isStopWord(word)) {
                frequency[word] = (frequency[word] || 0) + 1;
            }
        }
        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word]) => word);
    }
    isStopWord(word) {
        const stopWords = new Set([
            'the',
            'and',
            'or',
            'but',
            'in',
            'on',
            'at',
            'to',
            'for',
            'of',
            'with',
            'by',
            'this',
            'that',
            'these',
            'those',
            'is',
            'are',
            'was',
            'were',
            'be',
            'been',
        ]);
        return stopWords.has(word);
    }
}
/**
 * Adaptive compression strategy - automatically selects best method
 */
export class AdaptiveStrategy {
    name = 'adaptive';
    strategies;
    analyzer;
    counter;
    constructor() {
        this.counter = new AdvancedTokenCounter();
        this.analyzer = new ContentAnalyzer();
        this.strategies = new Map();
        this.strategies.set('truncate', new TruncateStrategy());
        this.strategies.set('extract', new ExtractStrategy());
    }
    async compress(text, targetRatio) {
        const analysis = this.analyzer.analyze(text);
        // Select optimal strategy based on content analysis
        const strategy = this.selectStrategy(analysis, targetRatio);
        return strategy.compress(text, targetRatio);
    }
    estimate(text, targetRatio) {
        const _analysis = this.analyzer.analyze(text);
        // Get estimates from all strategies
        const estimates = [];
        for (const strategy of this.strategies.values()) {
            try {
                const estimate = strategy.estimate(text, targetRatio);
                estimates.push(estimate);
            }
            catch {
                // Strategy doesn't support estimation
                continue;
            }
        }
        if (estimates.length === 0) {
            return {
                achievableRatio: targetRatio,
                quality: 0.5,
                processingTime: 100,
                recommended: false,
            };
        }
        // Select best estimate
        const bestEstimate = estimates.reduce((best, current) => {
            const bestScore = best.quality * 0.6 + best.recommended ? 0.4 : 0;
            const currentScore = current.quality * 0.6 + current.recommended ? 0.4 : 0;
            return currentScore > bestScore ? current : best;
        });
        return bestEstimate;
    }
    selectStrategy(analysis, targetRatio) {
        const { contentType, complexity, structureScore, length } = analysis;
        // Very short content - no compression needed
        if (length < 100) {
            return this.strategies.get('truncate');
        }
        // Code content - use extraction for better preservation
        if (contentType === 'code' && targetRatio <= 0.7) {
            return this.strategies.get('extract');
        }
        // Structured prose - use extraction for key points
        if (contentType === 'prose' && structureScore > 0.6 && targetRatio <= 0.8) {
            return this.strategies.get('extract');
        }
        // High complexity - use truncation for speed
        if (complexity > 0.8) {
            return this.strategies.get('truncate');
        }
        // Default to truncate for safety
        return this.strategies.get('truncate');
    }
}
/**
 * Advanced compression engine with multiple strategies and adaptive selection
 */
export class AdvancedCompressionEngine {
    strategies;
    defaultStrategy;
    config;
    counter;
    analyzer;
    constructor(config = {}) {
        this.config = {
            strategies: ['truncate', 'extract', 'adaptive'],
            defaultStrategy: 'adaptive',
            qualityThreshold: 0.6,
            maxProcessingTime: 5000, // 5 seconds
            enableParallel: true,
            adaptiveSelection: true,
            ...config,
        };
        this.counter = new AdvancedTokenCounter();
        this.analyzer = new ContentAnalyzer();
        this.strategies = new Map();
        this.registerStrategies();
        this.defaultStrategy =
            this.strategies.get(this.config.defaultStrategy) ||
                this.strategies.get('adaptive');
    }
    /**
     * Compress text using the optimal strategy
     */
    async compress(text, targetRatio = 0.7, strategy) {
        const startTime = performance.now();
        // Validate inputs
        if (!text || text.length === 0) {
            throw new Error('Cannot compress empty text');
        }
        if (targetRatio <= 0 || targetRatio > 1) {
            throw new Error('Target ratio must be between 0 and 1');
        }
        // Check if compression is needed
        const originalTokens = this.counter.count(text);
        if (originalTokens <= 100) {
            // Too short to compress effectively
            return {
                original: text,
                compressed: text,
                originalTokens,
                compressedTokens: originalTokens,
                compressionRatio: 1.0,
                method: 'none',
                quality: 1.0,
                metadata: {
                    strategy: 'none',
                    processingTime: performance.now() - startTime,
                },
            };
        }
        // Select compression strategy
        const selectedStrategy = strategy
            ? this.strategies.get(strategy) || this.defaultStrategy
            : this.selectOptimalStrategy(text, targetRatio);
        try {
            const result = await Promise.race([
                selectedStrategy.compress(text, targetRatio),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Compression timeout')), this.config.maxProcessingTime)),
            ]);
            const processingTime = performance.now() - startTime;
            // Validate result quality
            if (result.quality < this.config.qualityThreshold) {
                // Try fallback strategy
                const fallbackStrategy = this.strategies.get('truncate');
                const fallbackResult = await fallbackStrategy.compress(text, targetRatio);
                return {
                    ...fallbackResult,
                    metadata: {
                        ...fallbackResult.metadata,
                        processingTime,
                        fallback: true,
                    },
                };
            }
            return {
                ...result,
                metadata: {
                    ...result.metadata,
                    processingTime,
                    strategy: selectedStrategy.name,
                },
            };
        }
        catch (error) {
            // Fallback to simple truncation
            console.warn(`Compression failed with ${selectedStrategy.name}:`, error);
            return this.fallbackCompression(text, targetRatio, startTime);
        }
    }
    /**
     * Batch compress multiple texts efficiently
     */
    async compressBatch(texts, targetRatio = 0.7, strategy) {
        if (!this.config.enableParallel) {
            // Sequential processing
            const results = [];
            for (const text of texts) {
                results.push(await this.compress(text, targetRatio, strategy));
            }
            return results;
        }
        // Parallel processing with concurrency limit
        const concurrency = Math.min(4, texts.length); // Max 4 concurrent operations
        const results = new Array(texts.length);
        for (let i = 0; i < texts.length; i += concurrency) {
            const batch = texts.slice(i, i + concurrency);
            const batchPromises = batch.map((text, index) => this.compress(text, targetRatio, strategy).then((result) => ({
                result,
                index: i + index,
            })));
            const batchResults = await Promise.all(batchPromises);
            batchResults.forEach(({ result, index }) => {
                results[index] = result;
            });
        }
        return results;
    }
    /**
     * Get compression estimates for planning
     */
    async estimateCompression(text, targetRatio = 0.7, strategy) {
        const selectedStrategy = strategy
            ? this.strategies.get(strategy) || this.defaultStrategy
            : this.selectOptimalStrategy(text, targetRatio);
        return selectedStrategy.estimate(text, targetRatio);
    }
    /**
     * Select optimal compression strategy based on content analysis
     */
    selectOptimalStrategy(text, targetRatio) {
        if (!this.config.adaptiveSelection) {
            return this.defaultStrategy;
        }
        const analysis = this.analyzer.analyze(text);
        // Strategy selection logic based on content characteristics
        const { contentType, complexity: _complexity, structureScore } = analysis;
        // Very short content
        if (text.length < 200) {
            return this.strategies.get('truncate');
        }
        // Code content with high compression target
        if (contentType === 'code' && targetRatio <= 0.6) {
            return this.strategies.get('extract');
        }
        // Structured content
        if (structureScore > 0.7) {
            return this.strategies.get('adaptive');
        }
        // Default to adaptive strategy
        return this.strategies.get('adaptive');
    }
    /**
     * Fallback compression when primary strategies fail
     */
    fallbackCompression(text, targetRatio, startTime) {
        const originalTokens = this.counter.count(text);
        const _targetTokens = Math.floor(originalTokens * targetRatio);
        // Simple character-based truncation
        const truncated = text.slice(0, Math.floor(text.length * targetRatio));
        const truncatedTokens = this.counter.count(truncated);
        const processingTime = performance.now() - startTime;
        return {
            original: text,
            compressed: truncated,
            originalTokens,
            compressedTokens: truncatedTokens,
            compressionRatio: originalTokens / truncatedTokens,
            method: 'fallback',
            quality: 0.3, // Low quality but guaranteed to work
            metadata: {
                strategy: 'fallback',
                processingTime,
                warning: 'Primary compression failed, used fallback',
            },
        };
    }
    /**
     * Register available compression strategies
     */
    registerStrategies() {
        this.strategies.set('truncate', new TruncateStrategy());
        this.strategies.set('extract', new ExtractStrategy());
        this.strategies.set('adaptive', new AdaptiveStrategy());
    }
    /**
     * Get available compression strategies
     */
    getAvailableStrategies() {
        return Array.from(this.strategies.keys());
    }
    /**
     * Get compression performance metrics
     */
    getMetrics() {
        return {
            strategies: this.getAvailableStrategies(),
            config: this.config,
            counter: this.counter.getMetrics(),
        };
    }
}
/**
 * Convenience function for compression
 */
export async function compressText(text, targetRatio = 0.7, strategy, config) {
    const engine = new AdvancedCompressionEngine(config);
    return engine.compress(text, targetRatio, strategy);
}
/**
 * Convenience function for batch compression
 */
export async function compressTextBatch(texts, targetRatio = 0.7, strategy, config) {
    const engine = new AdvancedCompressionEngine(config);
    return engine.compressBatch(texts, targetRatio, strategy);
}
//# sourceMappingURL=advanced-engine.js.map