/**
 * Summarize Compression Strategy
 *
 * Uses LLM to summarize content (requires LLM provider)
 */
import { countTokens } from '../utils/token-counter';
export class SummarizeStrategy {
    summarizer;
    constructor(summarizer) {
        this.summarizer = summarizer;
    }
    canCompress(memory) {
        return this.summarizer !== undefined && memory.content.length > 300;
    }
    async compress(memory, targetRatio) {
        if (!this.summarizer) {
            throw new Error('Summarizer not available');
        }
        const original = memory.content;
        const originalTokens = this.countTokens(original);
        const targetTokens = Math.floor(originalTokens * targetRatio);
        // Summarize using LLM
        const summarized = await this.summarizer.summarize(original, targetTokens);
        const compressedTokens = this.countTokens(summarized);
        const compressionRatio = compressedTokens / originalTokens;
        return {
            compressed: summarized,
            original,
            compressionRatio,
            tokensSaved: originalTokens - compressedTokens,
            method: 'summarize',
        };
    }
    countTokens(text) {
        return countTokens(text);
    }
}
//# sourceMappingURL=summarize-strategy.js.map