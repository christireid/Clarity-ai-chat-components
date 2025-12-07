/**
 * Compression Engine
 *
 * Orchestrates compression strategies
 */
import { TruncateStrategy } from './truncate-strategy';
import { ExtractStrategy } from './extract-strategy';
import { SummarizeStrategy } from './summarize-strategy';
import { AdaptiveStrategy } from './adaptive-strategy';
import { SummarizationPipeline } from '../summarization/summarization-pipeline';
import { countTokens } from '../utils/token-counter';
export class CompressionEngine {
    config;
    strategies;
    defaultStrategy;
    constructor(config, summarizer) {
        this.config = config;
        this.strategies = new Map();
        // Register strategies
        this.strategies.set('truncate', new TruncateStrategy());
        this.strategies.set('extract', new ExtractStrategy());
        // Use summarizer if available (can be SummarizationPipeline or direct Summarizer)
        const effectiveSummarizer = summarizer instanceof SummarizationPipeline
            ? undefined // Compression engine will use its own summarization if needed
            : summarizer;
        if (effectiveSummarizer) {
            this.strategies.set('summarize', new SummarizeStrategy(effectiveSummarizer));
        }
        this.strategies.set('adaptive', new AdaptiveStrategy(effectiveSummarizer));
        // Set default strategy
        this.defaultStrategy = this.strategies.get(config.strategy ?? 'adaptive') || this.strategies.get('adaptive');
    }
    /**
     * Compress a memory
     */
    async compress(memory, targetRatio) {
        if (!this.config.enabled) {
            return {
                compressed: memory.content,
                original: memory.content,
                compressionRatio: 1.0,
                tokensSaved: 0,
                method: 'none',
            };
        }
        const ratio = targetRatio ?? (1 - (this.config.threshold ?? 0.5));
        // Check if compression is needed
        const currentTokens = this.countTokens(memory.content);
        const targetTokens = Math.floor(currentTokens * ratio);
        if (currentTokens <= targetTokens) {
            return {
                compressed: memory.content,
                original: memory.content,
                compressionRatio: 1.0,
                tokensSaved: 0,
                method: 'none',
            };
        }
        // Select strategy
        const strategy = this.selectStrategy(memory);
        if (!strategy || !strategy.canCompress(memory)) {
            return {
                compressed: memory.content,
                original: memory.content,
                compressionRatio: 1.0,
                tokensSaved: 0,
                method: 'none',
            };
        }
        // Compress
        const result = await strategy.compress(memory, ratio);
        // Validate quality
        if (result.compressionRatio < (this.config.minQuality ?? 0)) {
            // Compression too aggressive, return original
            return {
                compressed: memory.content,
                original: memory.content,
                compressionRatio: 1.0,
                tokensSaved: 0,
                method: 'none',
            };
        }
        return result;
    }
    /**
     * Compress multiple memories
     */
    async compressBatch(memories, targetRatio) {
        return Promise.all(memories.map(m => this.compress(m, targetRatio)));
    }
    selectStrategy(_memory) {
        const strategyName = this.config.strategy ?? 'adaptive';
        if (strategyName === 'adaptive') {
            return this.defaultStrategy;
        }
        return this.strategies.get(strategyName) || this.defaultStrategy;
    }
    countTokens(text) {
        return countTokens(text);
    }
}
//# sourceMappingURL=compression-engine.js.map