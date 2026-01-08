/**
 * Context Builder
 *
 * Builds optimized context bundles for LLMs
 */
import { TokenBudgetManager } from './token-budget';
import { countTokens } from '../utils/token-counter';
export class ContextBuilder {
    budgetManager;
    storage;
    // Reserved for future semantic search enhancements
    // @ts-expect-error - Stored for future use
    embeddingProvider;
    constructor(budgetManager, storage, embeddingProvider) {
        this.budgetManager = budgetManager;
        this.storage = storage;
        this.embeddingProvider = embeddingProvider;
    }
    /**
     * Build optimized context bundle for LLM
     *
     * Gathers and optimizes context components within token budget:
     * - User preferences (profile memories)
     * - Recent context (session memories)
     * - Semantic memories (relevant long-term memories)
     * - Episodic memories (recent events)
     * - Summary (compressed long-term context)
     *
     * @param options - Context building options
     * @returns Optimized context bundle with token breakdown
     *
     * @example
     * ```typescript
     * const bundle = await contextBuilder.build({
     *   maxTokens: 4096,
     *   includePreferences: true,
     *   includeRecent: true,
     * })
     * ```
     */
    async build(options) {
        const maxTokens = options?.maxTokens || 4096;
        const allocation = this.budgetManager.getAllocation({ maxTokens });
        // Gather context components
        const userPreferences = options?.includePreferences !== false
            ? await this.getUserPreferences(options?.userId, allocation.userPreferences)
            : '';
        const recentContext = options?.includeRecent !== false
            ? await this.getRecentContext(options?.sessionId, allocation.recentContext)
            : '';
        const semanticMemories = await this.getSemanticMemories(options?.userId, allocation.semanticMemory, options?.minRelevance);
        const episodicMemories = await this.getEpisodicMemories(options?.sessionId, allocation.episodicMemory);
        // Build summary if enabled
        const summary = options?.includeSummary
            ? await this.buildSummary([...semanticMemories, ...episodicMemories], allocation.summary ?? 0)
            : '';
        // Calculate actual token usage
        const tokenBreakdown = {
            systemPrompt: this.countTokens(''),
            userPreferences: this.countTokens(userPreferences),
            recentContext: this.countTokens(recentContext),
            semanticMemory: semanticMemories.reduce((sum, m) => sum + this.countTokens(m.content), 0),
            episodicMemory: episodicMemories.reduce((sum, m) => sum + this.countTokens(m.content), 0),
            responseReserve: 0,
            summary: this.countTokens(summary),
            total: 0,
        };
        tokenBreakdown.total =
            tokenBreakdown.systemPrompt +
                tokenBreakdown.userPreferences +
                tokenBreakdown.recentContext +
                tokenBreakdown.semanticMemory +
                tokenBreakdown.episodicMemory +
                (tokenBreakdown.summary ?? 0);
        // Format context
        const formatted = this.formatContext({
            userPreferences,
            recentContext,
            semanticMemories,
            episodicMemories,
            summary,
        });
        return {
            memories: [...semanticMemories, ...episodicMemories],
            totalTokens: tokenBreakdown.total,
            systemPrompt: '',
            semanticMemories,
            episodicMemories,
            tokenBreakdown,
            metadata: {
                compressionRatio: 0,
                memoriesRetrieved: semanticMemories.length + episodicMemories.length,
                memoriesFiltered: 0,
                memoriesCompressed: 0,
                strategiesUsed: [],
            },
            formatted,
        };
    }
    async getUserPreferences(userId, tokenBudget) {
        if (!userId || !tokenBudget)
            return '';
        const preferences = await this.storage.query({
            type: 'profile',
            scope: 'user',
            userId,
        });
        // Filter and format preferences
        const formatted = preferences
            .slice(0, 5) // Limit to top 5
            .map(m => `- ${m.content}`)
            .join('\n');
        return this.trimToTokens(formatted, tokenBudget);
    }
    async getRecentContext(sessionId, tokenBudget) {
        if (!sessionId || !tokenBudget)
            return '';
        const recent = await this.storage.query({
            scope: 'session',
            sessionId,
        });
        // Sort by timestamp, get most recent
        const sorted = recent
            .sort((a, b) => (b.timestamp ?? b.createdAt).getTime() - (a.timestamp ?? a.createdAt).getTime())
            .slice(0, 10);
        const formatted = sorted.map(m => m.content).join('\n\n');
        return this.trimToTokens(formatted, tokenBudget);
    }
    async getSemanticMemories(userId, tokenBudget, minRelevance) {
        const memories = await this.storage.query({
            type: 'semantic',
            userId,
        });
        // Filter by relevance if provided
        const filtered = minRelevance
            ? memories.filter(m => (m.importance ?? 0.5) >= minRelevance)
            : memories;
        // Sort by importance
        const sorted = filtered.sort((a, b) => (b.importance ?? 0.5) - (a.importance ?? 0.5));
        // Select memories within token budget
        const selected = [];
        let usedTokens = 0;
        for (const memory of sorted) {
            const tokens = this.countTokens(memory.content);
            if (usedTokens + tokens <= (tokenBudget ?? 0)) {
                selected.push(memory);
                usedTokens += tokens;
            }
            else {
                break;
            }
        }
        return selected;
    }
    async getEpisodicMemories(sessionId, tokenBudget) {
        const memories = await this.storage.query({
            type: 'episodic',
            sessionId,
        });
        // Sort by timestamp (most recent first)
        const sorted = memories.sort((a, b) => (b.timestamp ?? b.createdAt).getTime() - (a.timestamp ?? a.createdAt).getTime());
        // Select memories within token budget
        const selected = [];
        let usedTokens = 0;
        for (const memory of sorted) {
            const tokens = this.countTokens(memory.content);
            if (usedTokens + tokens <= (tokenBudget ?? 0)) {
                selected.push(memory);
                usedTokens += tokens;
            }
            else {
                break;
            }
        }
        return selected;
    }
    async buildSummary(memories, tokenBudget) {
        if (memories.length === 0)
            return '';
        // Simple summarization: concatenate and trim
        const content = memories.map(m => m.content).join('\n\n');
        return this.trimToTokens(content, tokenBudget);
    }
    formatContext(context) {
        const parts = [];
        if (context.userPreferences) {
            parts.push('## User Preferences\n' + context.userPreferences);
        }
        if (context.recentContext) {
            parts.push('## Recent Context\n' + context.recentContext);
        }
        if (context.semanticMemories.length > 0) {
            parts.push('## Semantic Memories\n' +
                context.semanticMemories.map(m => `- ${m.content}`).join('\n'));
        }
        if (context.episodicMemories.length > 0) {
            parts.push('## Episodic Memories\n' +
                context.episodicMemories.map(m => `- ${m.content}`).join('\n'));
        }
        if (context.summary) {
            parts.push('## Summary\n' + context.summary);
        }
        return parts.join('\n\n');
    }
    countTokens(text) {
        return countTokens(text);
    }
    trimToTokens(text, maxTokens) {
        const maxChars = maxTokens * 4;
        if (text.length <= maxChars)
            return text;
        return text.slice(0, maxChars).trim() + '...';
    }
}
//# sourceMappingURL=context-builder.js.map