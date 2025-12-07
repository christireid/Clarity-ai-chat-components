/**
 * Sliding Context Window Manager with RAG Integration
 *
 * Dynamically manages conversation history by maintaining a fixed-size buffer
 * while using semantic search (RAG) to retrieve relevant historical context.
 */
/**
 * Adapter to convert VectorStoreAdapter to VectorStore interface
 */
export class VectorStoreAdapterWrapper {
    adapter;
    constructor(adapter) {
        this.adapter = adapter;
    }
    async similaritySearch(query, userId, options) {
        const queryEmbedding = await this.adapter.createEmbedding(query);
        return this.adapter.similaritySearch(queryEmbedding, {
            userId,
            k: options?.k,
            minScore: options?.minScore,
            filter: options?.filter,
        });
    }
    async storeMemory(memory) {
        const embedding = memory.embedding || await this.adapter.createEmbedding(memory.value);
        await this.adapter.storeMemory(memory, embedding);
    }
    async deleteMemory(memoryId) {
        await this.adapter.deleteMemory(memoryId);
    }
}
/**
 * Sliding Context Manager with RAG Integration
 */
export class SlidingContextManager {
    config;
    historyBuffer = [];
    maxBufferSize;
    constructor(config) {
        this.config = {
            maxTokens: config.maxTokens,
            contextRatio: config.contextRatio ?? 0.7,
            immediateWindowSize: config.immediateWindowSize ?? 10,
            countTokens: config.countTokens,
            vectorStore: config.vectorStore,
        };
        this.maxBufferSize = Math.max(50, config.immediateWindowSize ?? 10) * 2;
    }
    /**
     * Add message to history buffer
     */
    addMessage(message) {
        this.historyBuffer.push(message);
        // Maintain buffer size
        if (this.historyBuffer.length > this.maxBufferSize) {
            this.historyBuffer = this.historyBuffer.slice(-this.maxBufferSize);
        }
    }
    /**
     * Get optimized context for a query
     */
    async getContext(userId, currentMessage, options) {
        // Get immediate context from sliding window
        const immediateContext = this.getImmediateContext();
        // Retrieve relevant historical context using semantic search
        let historicalContext = [];
        if (this.config.vectorStore) {
            try {
                historicalContext = await this.config.vectorStore.similaritySearch(currentMessage, userId, {
                    k: 3,
                    minScore: 0.7,
                });
            }
            catch (error) {
                console.warn('Vector store retrieval failed:', error);
                // Fallback to empty historical context
            }
        }
        // Combine and optimize token usage
        return this.optimizeContext(immediateContext, historicalContext, options);
    }
    /**
     * Get immediate context from sliding window
     */
    getImmediateContext() {
        // Keep most recent messages up to immediateWindowSize
        const recentCount = Math.min(this.config.immediateWindowSize, this.historyBuffer.length);
        return this.historyBuffer.slice(-recentCount);
    }
    /**
     * Optimize context to fit within token budget
     */
    optimizeContext(immediate, historical, options) {
        const contextTokens = Math.floor(this.config.maxTokens * this.config.contextRatio);
        const layersUsed = ['real-time'];
        const result = [];
        let currentTokens = 0;
        // Add system message if provided
        if (options?.includeSystemMessage && options?.systemMessage) {
            const systemTokens = this.config.countTokens(options.systemMessage);
            if (systemTokens <= contextTokens) {
                result.push({
                    role: 'system',
                    content: options.systemMessage,
                });
                currentTokens += systemTokens;
            }
        }
        // Add immediate context (highest priority)
        const immediateTokens = immediate.reduce((sum, msg) => sum + this.config.countTokens(msg.content), 0);
        if (currentTokens + immediateTokens <= contextTokens * 0.6) {
            // Fits within 60% budget, add all immediate context
            result.push(...immediate);
            currentTokens += immediateTokens;
        }
        else {
            // Compress immediate context
            const compressed = this.compressMessages(immediate, Math.floor(contextTokens * 0.6) - currentTokens);
            result.push(...compressed);
            currentTokens += compressed.reduce((sum, msg) => sum + this.config.countTokens(msg.content), 0);
        }
        // Add historical context if space allows
        const remainingTokens = contextTokens - currentTokens;
        if (remainingTokens > 0 && historical.length > 0) {
            const historicalContext = this.selectHistoricalContext(historical, remainingTokens);
            // Convert memory items to context messages
            historicalContext.forEach((memory) => {
                result.push({
                    role: 'system',
                    content: `[Memory: ${memory.label}] ${memory.value}`,
                });
                currentTokens += this.config.countTokens(memory.value);
                // Track layers used
                if (!layersUsed.includes(memory.layer)) {
                    layersUsed.push(memory.layer);
                }
            });
        }
        return {
            messages: result.filter(m => m.role !== 'function'),
            totalTokens: currentTokens,
            compressionRatio: immediate.length > 0
                ? result.length / immediate.length
                : undefined,
            layersUsed,
            retrievedMemories: historical,
        };
    }
    /**
     * Compress messages to fit token budget
     */
    compressMessages(messages, maxTokens) {
        if (messages.length === 0)
            return [];
        // Strategy: Keep most recent messages, summarize older ones
        const kept = [];
        let tokens = 0;
        // Keep messages from newest, fitting as many as possible
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            if (!msg)
                continue;
            const msgTokens = this.config.countTokens(msg.content);
            if (tokens + msgTokens <= maxTokens) {
                kept.unshift(msg);
                tokens += msgTokens;
            }
            else {
                break;
            }
        }
        // If we have remaining tokens and messages, create a summary
        const remainingTokens = maxTokens - tokens;
        if (remainingTokens > 50 && kept.length < messages.length) {
            const summarized = messages.slice(0, messages.length - kept.length);
            const summary = this.createSummary(summarized, remainingTokens);
            if (summary) {
                kept.unshift({
                    role: 'system',
                    content: `Previous conversation summary: ${summary}`,
                });
            }
        }
        return kept;
    }
    /**
     * Create summary of messages
     */
    createSummary(messages, maxTokens) {
        if (messages.length === 0)
            return null;
        const content = messages
            .map((m) => `${m.role}: ${m.content}`)
            .join('\n');
        // Simple summarization: extract key sentences
        const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 20);
        if (sentences.length === 0)
            return null;
        // Keep first and last sentences, plus key middle ones
        const keySentences = [];
        if (sentences.length > 0 && sentences[0]) {
            keySentences.push(sentences[0]);
        }
        if (sentences.length > 1 && sentences[sentences.length - 1]) {
            keySentences.push(sentences[sentences.length - 1]);
        }
        // Add middle sentences if space allows
        const middleStart = Math.floor(sentences.length / 3);
        const middleEnd = Math.floor((sentences.length * 2) / 3);
        for (let i = middleStart; i < middleEnd && i < sentences.length; i++) {
            const sentence = sentences[i];
            if (!sentence)
                continue;
            const sentenceTokens = this.config.countTokens(sentence);
            const currentTokens = keySentences.reduce((sum, s) => sum + this.config.countTokens(s), 0);
            if (currentTokens + sentenceTokens <= maxTokens) {
                keySentences.push(sentence);
            }
            else {
                break;
            }
        }
        return keySentences.join('. ').substring(0, maxTokens * 4); // Rough char limit
    }
    /**
     * Select historical context that fits within token budget
     */
    selectHistoricalContext(memories, maxTokens) {
        const selected = [];
        let tokens = 0;
        // Sort by importance score and recency
        const sorted = [...memories].sort((a, b) => {
            const importanceDiff = (b.importanceScore ?? 0) - (a.importanceScore ?? 0);
            if (Math.abs(importanceDiff) > 0.1)
                return importanceDiff;
            return b.lastUpdated.getTime() - a.lastUpdated.getTime();
        });
        for (const memory of sorted) {
            const memoryTokens = memory.tokens || this.config.countTokens(memory.value);
            if (tokens + memoryTokens <= maxTokens) {
                selected.push(memory);
                tokens += memoryTokens;
            }
            else {
                break;
            }
        }
        return selected;
    }
    /**
     * Clear history buffer
     */
    clear() {
        this.historyBuffer = [];
    }
    /**
     * Get current buffer statistics
     */
    getStats() {
        const tokens = this.historyBuffer.reduce((sum, msg) => sum + this.config.countTokens(msg.content), 0);
        return {
            bufferSize: this.historyBuffer.length,
            estimatedTokens: tokens,
            oldestMessage: this.historyBuffer.length > 0 ? new Date() : undefined,
            newestMessage: this.historyBuffer.length > 0 ? new Date() : undefined,
        };
    }
}
//# sourceMappingURL=sliding-context-manager.js.map