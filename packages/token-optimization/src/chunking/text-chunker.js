/**
 * Text Chunker
 *
 * High-performance text chunking using llm-splitter.
 *
 * llm-splitter is a lightweight alternative to LangChain's text splitters:
 * - 100x smaller footprint (~KB vs 21MB for @langchain/textsplitters)
 * - Single-pass greedy algorithm for speed
 * - Paragraph-aware chunking
 * - Rich metadata with character positions
 *
 * @see https://github.com/nearform/llm-splitter
 */
import { split } from 'llm-splitter';
import { encode } from 'gpt-tokenizer';
/**
 * Chunking strategy presets
 */
export var ChunkingStrategy;
(function (ChunkingStrategy) {
    /** Small chunks for precise retrieval (256 tokens, 10% overlap) */
    ChunkingStrategy["PRECISE"] = "precise";
    /** Balanced chunks for general use (512 tokens, 15% overlap) */
    ChunkingStrategy["BALANCED"] = "balanced";
    /** Large chunks for context preservation (1024 tokens, 20% overlap) */
    ChunkingStrategy["CONTEXT"] = "context";
    /** Custom configuration */
    ChunkingStrategy["CUSTOM"] = "custom";
})(ChunkingStrategy || (ChunkingStrategy = {}));
/**
 * Strategy presets with optimal settings for different use cases
 */
const STRATEGY_PRESETS = {
    [ChunkingStrategy.PRECISE]: {
        maxTokens: 256,
        overlapPercentage: 0.1,
    },
    [ChunkingStrategy.BALANCED]: {
        maxTokens: 512,
        overlapPercentage: 0.15,
    },
    [ChunkingStrategy.CONTEXT]: {
        maxTokens: 1024,
        overlapPercentage: 0.2,
    },
    [ChunkingStrategy.CUSTOM]: {},
};
/**
 * Simple word-based splitter for llm-splitter
 */
function wordSplitter(text) {
    // Split on whitespace while preserving the whitespace as separate tokens
    return text.split(/(\s+)/).filter((s) => s.length > 0);
}
/**
 * TextChunker - High-performance text chunking for LLM applications
 *
 * @example
 * ```typescript
 * const chunker = new TextChunker({ strategy: ChunkingStrategy.BALANCED })
 * const result = chunker.chunk(longDocument)
 *
 * for (const chunk of result.chunks) {
 *   console.log(`Chunk ${chunk.index}: ${chunk.tokenCount} tokens`)
 *   // Process chunk...
 * }
 * ```
 */
export class TextChunker {
    config;
    constructor(config = {}) {
        const strategy = config.strategy || ChunkingStrategy.BALANCED;
        const preset = STRATEGY_PRESETS[strategy];
        this.config = {
            maxTokens: config.maxTokens ?? preset.maxTokens ?? 512,
            overlapPercentage: config.overlapPercentage ?? preset.overlapPercentage ?? 0.15,
            strategy,
            includeTokenCount: config.includeTokenCount ?? true,
        };
    }
    /**
     * Chunk text into smaller pieces with overlap
     */
    chunk(text) {
        if (!text || text.trim().length === 0) {
            return {
                chunks: [],
                totalChunks: 0,
                totalTokens: 0,
                originalTokens: 0,
                overheadPercentage: 0,
                config: this.config,
            };
        }
        // Calculate overlap
        const overlapTokens = Math.floor(this.config.maxTokens * this.config.overlapPercentage);
        // Configure llm-splitter
        // Use word-based splitting for better results
        const splitOptions = {
            chunkSize: this.config.maxTokens,
            chunkOverlap: overlapTokens,
            splitter: wordSplitter,
            chunkStrategy: 'paragraph',
        };
        // Perform the split
        const rawChunks = split(text, splitOptions);
        // Calculate original token count
        const originalTokens = encode(text).length;
        // Transform chunks with metadata, filtering out null/empty chunks
        const chunks = rawChunks
            .filter((chunk) => chunk.text !== null && chunk.text !== '')
            .map((chunk, index) => {
            // Handle text that could be string or string[]
            const chunkText = Array.isArray(chunk.text)
                ? chunk.text.join('')
                : chunk.text;
            const tokenCount = this.config.includeTokenCount
                ? encode(chunkText).length
                : 0;
            return {
                text: chunkText,
                index,
                startPosition: chunk.start,
                endPosition: chunk.end,
                tokenCount,
                metadata: {
                    startsNewParagraph: index === 0 || chunkText.startsWith('\n'),
                    overlapTokens: index > 0 ? overlapTokens : 0,
                },
            };
        });
        // Calculate totals
        const totalTokens = chunks.reduce((sum, c) => sum + c.tokenCount, 0);
        const overheadPercentage = originalTokens > 0
            ? ((totalTokens - originalTokens) / originalTokens) * 100
            : 0;
        return {
            chunks,
            totalChunks: chunks.length,
            totalTokens,
            originalTokens,
            overheadPercentage: Math.round(overheadPercentage * 100) / 100,
            config: this.config,
        };
    }
    /**
     * Chunk text and return just the text strings
     */
    chunkToStrings(text) {
        return this.chunk(text).chunks.map((chunk) => chunk.text);
    }
    /**
     * Estimate number of chunks without actually chunking
     */
    estimateChunkCount(text) {
        if (!text)
            return 0;
        const tokens = encode(text).length;
        const effectiveChunkSize = this.config.maxTokens * (1 - this.config.overlapPercentage);
        return Math.ceil(tokens / effectiveChunkSize);
    }
    /**
     * Check if text needs chunking based on token limit
     */
    needsChunking(text, maxTokens) {
        if (!text)
            return false;
        const limit = maxTokens ?? this.config.maxTokens;
        const tokens = encode(text).length;
        return tokens > limit;
    }
    /**
     * Get the current configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Create a new chunker with updated configuration
     */
    withConfig(config) {
        return new TextChunker({
            ...this.config,
            ...config,
        });
    }
    /**
     * Static factory methods for common strategies
     */
    static precise() {
        return new TextChunker({ strategy: ChunkingStrategy.PRECISE });
    }
    static balanced() {
        return new TextChunker({ strategy: ChunkingStrategy.BALANCED });
    }
    static context() {
        return new TextChunker({ strategy: ChunkingStrategy.CONTEXT });
    }
}
//# sourceMappingURL=text-chunker.js.map