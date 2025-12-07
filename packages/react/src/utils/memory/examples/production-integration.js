/**
 * Production Integration Examples
 *
 * Comprehensive examples for integrating the memory system into production applications
 */
import { MemoryService, SlidingContextManager, TokenOptimizedContextManager, SemanticChunker, createVectorStoreAdapter, VectorStoreAdapterWrapper, estimateTokens, } from '../index';
/**
 * Example 1: Complete Production Setup with Qdrant
 */
export async function setupProductionMemorySystem() {
    // Initialize vector store adapter
    const vectorAdapter = createVectorStoreAdapter('in-memory'); // Use 'qdrant' in production
    await vectorAdapter.initialize();
    const vectorStore = new VectorStoreAdapterWrapper(vectorAdapter);
    // Initialize memory service
    const memoryService = new MemoryService({
        vectorStore,
        maxRealTimeTokens: 100,
        maxSessionTokens: 500,
        enableCompression: true,
        compressionThreshold: 20,
        countTokens: estimateTokens,
    });
    // Initialize sliding context manager
    const contextManager = new SlidingContextManager({
        maxTokens: 4000,
        contextRatio: 0.7,
        immediateWindowSize: 10,
        vectorStore,
        countTokens: estimateTokens,
    });
    // Initialize token-optimized context manager
    const tokenManager = new TokenOptimizedContextManager(128000, // GPT-4 context limit
    4000, // Reserved for response
    estimateTokens);
    return {
        memoryService,
        contextManager,
        tokenManager,
    };
}
/**
 * Example 2: Complete Chat Flow with Memory
 */
export async function chatWithMemory(userId, message, memoryService, contextManager) {
    // 1. Add user message to context
    contextManager.addMessage({
        role: 'user',
        content: message,
    });
    // 2. Get optimized context
    const optimizedContext = await contextManager.getContext(userId, message, {
        includeSystemMessage: true,
        systemMessage: 'You are a helpful AI assistant with access to conversation history.',
    });
    // 3. Store important information as memory
    const importanceScore = calculateImportance(message);
    if (importanceScore > 0.7) {
        await memoryService.storeMemory({
            userId,
            label: 'User Message',
            value: message,
            scope: 'thread',
            type: 'episodic',
            layer: 'session',
            importanceScore,
            tokens: estimateTokens(message),
        }, {
            userId,
            promoteToGlobal: importanceScore > 0.9,
        });
    }
    // 4. Retrieve relevant memories for next interaction
    const relevantMemories = await memoryService.retrieveMemories({
        userId,
        query: message,
        maxResults: 5,
        minConfidence: 0.7,
    });
    return {
        optimizedContext,
        relevantMemories,
        contextTokens: optimizedContext.totalTokens,
    };
}
/**
 * Example 3: Memory-Aware Message Processing
 */
export async function processMessageWithFullMemory(userId, message, services) {
    const { memoryService, contextManager, tokenManager } = services;
    // 1. Retrieve user preferences and context
    const userPreferences = await memoryService.retrieveMemories({
        userId,
        type: ['preference', 'semantic'],
        scope: ['global'],
        maxResults: 10,
    });
    // 2. Get recent conversation
    const recentMessages = [
        { role: 'user', content: message },
    ];
    // 3. Get semantic memories
    const semanticMemories = await memoryService.retrieveMemories({
        userId,
        query: message,
        type: ['semantic'],
        maxResults: 5,
    });
    // 4. Analyze context
    const analysis = tokenManager.analyzeContext(recentMessages, userPreferences.map((m) => m.value).join('\n'), semanticMemories.map((m) => m.value));
    // 5. Optimize context
    const optimized = tokenManager.optimizeContext('You are a helpful AI assistant.', userPreferences.map((m) => `${m.label}: ${m.value}`).join('\n'), recentMessages, semanticMemories.map((m) => m.value), [], // Episodic memories would come from separate query
    analysis);
    return {
        optimizedContext: optimized.context,
        totalTokens: optimized.totalTokens,
        compressionRatio: optimized.compressionRatio,
        allocation: optimized.allocation,
    };
}
/**
 * Example 4: Batch Memory Processing
 */
export async function batchProcessConversations(userId, conversations, memoryService) {
    const chunker = new SemanticChunker(estimateTokens);
    for (const conversation of conversations) {
        // Chunk conversation
        const conversationText = conversation.messages
            .map((m) => `${m.role}: ${m.content}`)
            .join('\n');
        const chunks = await chunker.chunkConversation(conversationText);
        // Store each chunk as memory
        for (const chunk of chunks) {
            await memoryService.storeMemory({
                userId,
                label: `Conversation Chunk: ${chunk.topic || 'general'}`,
                value: chunk.text,
                scope: 'thread',
                type: 'episodic',
                layer: 'episodic',
                importanceScore: chunk.importanceScore,
                tokens: chunk.tokens,
            }, {
                userId,
                compress: true,
            });
        }
    }
}
/**
 * Example 5: Memory Compression Pipeline
 */
export async function compressAndArchiveMemories(userId, memoryService) {
    // Get session memories that are candidates for compression
    const sessionMemories = await memoryService.retrieveMemories({
        userId,
        scope: ['session'],
        maxResults: 100,
    });
    if (sessionMemories.length < 20) {
        return { compressed: 0, archived: 0 };
    }
    // Group by type
    const byType = new Map();
    sessionMemories.forEach((m) => {
        const type = m.type;
        if (!byType.has(type)) {
            byType.set(type, []);
        }
        byType.get(type).push(m);
    });
    let compressed = 0;
    let archived = 0;
    // Compress each type
    for (const [type, memories] of byType.entries()) {
        if (memories.length >= 5) {
            // Create semantic summary
            const summary = memories
                .map((m) => m.value)
                .join('. ')
                .substring(0, 500);
            // Store as compressed semantic memory
            await memoryService.storeMemory({
                userId,
                label: `Compressed ${type} memories`,
                value: summary,
                scope: 'global',
                type: 'semantic',
                layer: 'semantic',
                confidence: memories.reduce((sum, m) => sum + (m.confidence || 0), 0) / memories.length,
                tokens: estimateTokens(summary),
            }, {
                userId,
                promoteToGlobal: true,
            });
            compressed += memories.length;
            archived += 1;
        }
    }
    return { compressed, archived };
}
/**
 * Helper: Calculate message importance
 */
function calculateImportance(message) {
    const hasQuestion = message.includes('?') ? 0.2 : 0;
    const hasExclamation = message.includes('!') ? 0.15 : 0;
    const lengthFactor = Math.min(message.length / 500, 0.3);
    const keywordFactor = hasImportantKeywords(message) ? 0.35 : 0;
    return Math.min(1.0, hasQuestion + hasExclamation + lengthFactor + keywordFactor);
}
function hasImportantKeywords(text) {
    const keywords = [
        'important',
        'critical',
        'remember',
        'prefer',
        'like',
        'dislike',
        'never',
        'always',
        'favorite',
    ];
    const lowerText = text.toLowerCase();
    return keywords.some((keyword) => lowerText.includes(keyword));
}
/**
 * Example 6: Memory Statistics and Monitoring
 */
export async function getMemoryStatistics(userId, memoryService) {
    const stats = memoryService.getStats(userId);
    return {
        totalMemories: stats.totalMemories,
        byScope: stats.byScope,
        byType: stats.byType,
        byLayer: stats.byLayer,
        totalTokens: stats.totalTokens,
        averageConfidence: stats.averageConfidence,
        oldestMemory: stats.oldestMemory,
        newestMemory: stats.newestMemory,
        // Calculate costs (example with GPT-4 pricing)
        estimatedMonthlyCost: calculateMonthlyCost(stats.totalTokens),
    };
}
function calculateMonthlyCost(totalTokens) {
    // Example: GPT-4 pricing
    const inputCostPer1kTokens = 0.03;
    const outputCostPer1kTokens = 0.06;
    // Assume 70% input, 30% output
    const inputTokens = totalTokens * 0.7;
    const outputTokens = totalTokens * 0.3;
    const inputCost = (inputTokens / 1000) * inputCostPer1kTokens;
    const outputCost = (outputTokens / 1000) * outputCostPer1kTokens;
    return inputCost + outputCost;
}
//# sourceMappingURL=production-integration.js.map