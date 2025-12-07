/**
 * Token Optimizer Tests
 */
import { describe, it, expect } from 'vitest';
import { TokenCounter, TokenBudgetManager, MemoryCompressor, SemanticChunker, ContextOptimizer, } from '../token-optimizer';
const defaultConfig = {
    maxContextWindow: 4096,
    allocation: {
        systemPrompt: 0.10,
        userPreferences: 0.15,
        recentContext: 0.30,
        semanticMemory: 0.25,
        episodicMemory: 0.15,
        responseReserve: 0.05,
    },
    dynamicAllocation: false,
    enableCompression: true,
    compressionRatio: 0.6,
    enableChunking: true,
    chunkSize: 200,
    chunkOverlap: 50,
};
describe('TokenCounter', () => {
    it('should count tokens in text', () => {
        const text = 'Hello world!';
        const tokens = TokenCounter.count(text);
        expect(tokens).toBeGreaterThan(0);
    });
    it('should return 0 for empty text', () => {
        expect(TokenCounter.count('')).toBe(0);
    });
    it('should count batch of texts', () => {
        const texts = ['Hello', 'world', '!'];
        const total = TokenCounter.countBatch(texts);
        expect(total).toBeGreaterThan(0);
    });
    it('should truncate text to fit budget', () => {
        const text = 'This is a long text that needs to be truncated to fit the budget. '.repeat(10);
        const truncated = TokenCounter.truncate(text, 50);
        const tokens = TokenCounter.count(truncated);
        expect(tokens).toBeLessThanOrEqual(50);
        expect(truncated.length).toBeLessThan(text.length);
    });
    it('should not truncate if under budget', () => {
        const text = 'Short text';
        const truncated = TokenCounter.truncate(text, 100);
        expect(truncated).toBe(text);
    });
    it('should split text into sentences', () => {
        const text = 'First sentence. Second sentence! Third sentence?';
        const sentences = TokenCounter.splitSentences(text);
        expect(sentences).toHaveLength(3);
    });
});
describe('TokenBudgetManager', () => {
    let manager;
    beforeEach(() => {
        manager = new TokenBudgetManager(defaultConfig);
    });
    it('should calculate token allocation', () => {
        const allocation = manager.getAllocation();
        expect(allocation.systemPrompt).toBe(Math.floor(4096 * 0.10));
        expect(allocation.userPreferences).toBe(Math.floor(4096 * 0.15));
        expect(allocation.recentContext).toBe(Math.floor(4096 * 0.30));
    });
    it('should adjust allocation based on context', () => {
        const contextManager = new TokenBudgetManager({
            ...defaultConfig,
            dynamicAllocation: true,
        });
        const allocation = contextManager.adjustAllocation({
            conversationActivity: 'high',
            preferenceRichness: 'low',
            taskComplexity: 'medium',
            stats: {
                totalMemories: 10,
                byType: {},
                byScope: {},
                totalTokens: 1000,
                averageRelevance: 0.8,
            },
        });
        expect(allocation).toBeDefined();
    });
    it('should optimize memories to fit budget', () => {
        const memories = [
            {
                id: '1',
                type: 'episodic',
                scope: 'session',
                content: 'Memory 1',
                metadata: {},
                confidence: 0.9,
                priority: 'high',
                tokens: 100,
                accessCount: 0,
                lastAccessed: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: '2',
                type: 'episodic',
                scope: 'session',
                content: 'Memory 2',
                metadata: {},
                confidence: 0.7,
                priority: 'low',
                tokens: 100,
                accessCount: 0,
                lastAccessed: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];
        const optimized = manager.optimizeMemories(memories, 150);
        const totalTokens = optimized.reduce((sum, m) => sum + m.tokens, 0);
        expect(totalTokens).toBeLessThanOrEqual(150);
        expect(optimized[0].priority).toBe('high'); // Should prioritize by priority
    });
    it('should check if budget is exceeded', () => {
        expect(manager.isBudgetExceeded(5000)).toBe(true);
        expect(manager.isBudgetExceeded(3000)).toBe(false);
    });
    it('should calculate remaining budget', () => {
        const remaining = manager.getRemainingBudget(1000);
        expect(remaining).toBe(3096);
    });
});
describe('MemoryCompressor', () => {
    let compressor;
    beforeEach(() => {
        compressor = new MemoryCompressor();
    });
    it('should compress conversation history', () => {
        const messages = [
            'Hello, how are you?',
            'I am doing great, thanks!',
            'What can you help me with today?',
            'I can help you with many things.',
        ].map(m => m.repeat(20)); // Make them long
        const compressed = compressor.compressConversation(messages, 100);
        expect(compressed.compressedTokens).toBeLessThanOrEqual(100);
        expect(compressed.compressionRatio).toBeGreaterThan(1);
        expect(compressed.compressed.length).toBeLessThan(compressed.original.length);
    });
    it('should not compress if under budget', () => {
        const messages = ['Short message'];
        const compressed = compressor.compressConversation(messages, 1000);
        expect(compressed.compressed).toBe(compressed.original);
        expect(compressed.compressionRatio).toBe(1.0);
    });
    it('should compress memory item', () => {
        const memory = {
            id: '1',
            type: 'episodic',
            scope: 'session',
            content: 'This is a long memory content that should be compressed. '.repeat(20),
            metadata: {},
            confidence: 0.8,
            priority: 'medium',
            tokens: TokenCounter.count('This is a long memory content that should be compressed. '.repeat(20)),
            accessCount: 0,
            lastAccessed: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const compressed = compressor.compressMemory(memory, 0.5);
        expect(compressed.compressedTokens).toBeLessThan(compressed.originalTokens);
        expect(compressed.compressionRatio).toBeGreaterThan(1);
    });
});
describe('SemanticChunker', () => {
    let chunker;
    beforeEach(() => {
        chunker = new SemanticChunker(200, 50);
    });
    it('should chunk conversation into semantic pieces', () => {
        const conversation = Array(20)
            .fill('This is a sentence in the conversation.')
            .join(' ');
        const chunks = chunker.chunkConversation(conversation);
        expect(chunks.length).toBeGreaterThan(0);
        expect(chunks[0].tokens).toBeLessThanOrEqual(200);
    });
    it('should retrieve optimal chunks within budget', () => {
        const chunks = [
            { id: '1', text: 'Chunk 1', tokens: 50, embedding: [] },
            { id: '2', text: 'Chunk 2', tokens: 60, embedding: [] },
            { id: '3', text: 'Chunk 3', tokens: 70, embedding: [] },
        ];
        const selected = chunker.retrieveOptimalChunks(chunks, 100);
        const totalTokens = selected.reduce((sum, c) => sum + c.tokens, 0);
        expect(totalTokens).toBeLessThanOrEqual(100);
    });
    it('should use relevance scores for selection', () => {
        const chunks = [
            { id: '1', text: 'Low relevance', tokens: 50, embedding: [] },
            { id: '2', text: 'High relevance', tokens: 50, embedding: [] },
        ];
        const relevanceScores = new Map([
            ['1', 0.3],
            ['2', 0.9],
        ]);
        const selected = chunker.retrieveOptimalChunks(chunks, 60, relevanceScores);
        expect(selected[0].id).toBe('2'); // Should select high relevance first
    });
    it('should extract topic from chunk', () => {
        const chunk = {
            id: '1',
            text: 'Programming is about solving problems with code. Programming requires logic.',
            tokens: 15,
            embedding: [],
        };
        const topic = chunker.extractTopic(chunk);
        expect(topic).toBeTruthy();
        expect(typeof topic).toBe('string');
    });
});
describe('ContextOptimizer', () => {
    let optimizer;
    beforeEach(() => {
        optimizer = new ContextOptimizer(defaultConfig);
    });
    it('should optimize entire context', () => {
        const memories = [
            {
                id: '1',
                type: 'semantic',
                scope: 'global',
                content: 'User prefers dark theme',
                metadata: {},
                confidence: 0.9,
                priority: 'high',
                tokens: 20,
                accessCount: 0,
                lastAccessed: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];
        const result = optimizer.optimizeContext({
            systemPrompt: 'You are a helpful assistant.',
            userPreferences: { theme: 'dark' },
            recentMessages: ['Hello', 'How are you?'],
            semanticMemories: memories,
            episodicMemories: [],
        });
        expect(result.optimized).toBeDefined();
        expect(result.optimized.systemPrompt).toBeTruthy();
        expect(result.optimized.userPreferences).toBeTruthy();
        expect(result.optimized.recentContext).toBeTruthy();
        expect(result.stats.totalTokens).toBeLessThanOrEqual(defaultConfig.maxContextWindow);
    });
    it('should provide access to components', () => {
        expect(optimizer.getBudgetManager()).toBeDefined();
        expect(optimizer.getCompressor()).toBeDefined();
        expect(optimizer.getChunker()).toBeDefined();
    });
});
//# sourceMappingURL=token-optimizer.test.js.map