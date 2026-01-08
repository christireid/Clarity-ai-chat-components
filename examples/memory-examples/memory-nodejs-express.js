/**
 * Node.js Express Example - Modern Clarity Memory API
 *
 * This example shows how to use @clarity-chat/memory in an Express.js backend
 * with the modern clarityMemory() factory function.
 *
 * Install dependencies: npm install express
 * Run: npx tsx examples/memory-examples/memory-nodejs-express.ts
 */
import express, {} from 'express';
import { MemoryService, } from '../../packages/memory/src/index';
// Initialize memory service with complete configuration
const memoryConfig = {
    tokenOptimization: {
        maxContextWindow: 4096,
        allocation: {
            systemPrompt: 0.1,
            userPreferences: 0.15,
            recentContext: 0.3,
            semanticMemory: 0.25,
            episodicMemory: 0.15,
            responseReserve: 0.05,
        },
        dynamicAllocation: true,
        enableCompression: true,
        enableChunking: true,
    },
    persistence: {
        useVectorStore: false,
        useCache: true,
        useDatabase: false,
    },
    enableAutoSummarization: false,
    enableAutoCleanup: true,
    cleanupInterval: 3600000, // 1 hour
    retentionPolicy: {
        shortTerm: 3600, // 1 hour
        session: 86400, // 24 hours
        thread: 604800, // 7 days
        global: 0, // Never expires
    },
    debug: true,
};
const memory = new MemoryService(memoryConfig);
// Initialize memory service
await memory.initialize();
// Create Express app
const app = express();
app.use(express.json());
/**
 * POST /api/chat
 * Chat endpoint with memory-enhanced context
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { userId, message, sessionId } = req.body;
        if (!userId || !message) {
            res.status(400).json({ error: 'userId and message required' });
            return;
        }
        // Search for relevant memories
        const relevantMemories = await memory.query({
            query: message,
            limit: 5,
            minConfidence: 0.7,
            metadata: { userId, sessionId },
        });
        // Get optimized context bundle for LLM
        const contextBundle = await memory.context({
            maxTokens: 1000,
        });
        // Call your LLM with the context
        const llmResponse = await callLLM(message, contextBundle.formatted || '');
        // Store the user message as episodic memory
        await memory.add(message, {
            type: 'episodic',
            scope: 'session',
            importance: 0.5,
            tags: ['user-message', userId, sessionId].filter(Boolean),
        });
        // Store assistant response
        await memory.add(llmResponse, {
            type: 'episodic',
            scope: 'session',
            importance: 0.6,
            tags: ['assistant-response', userId, sessionId].filter(Boolean),
        });
        res.json({
            response: llmResponse,
            memoriesUsed: relevantMemories.length,
            tokensUsed: contextBundle.tokenBreakdown.total,
            context: (contextBundle.formatted || '').substring(0, 200) + '...',
        });
    }
    catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * GET /api/preferences/:userId
 * Get user preferences from semantic memory
 */
app.get('/api/preferences/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const preferences = await memory.query({
            types: ['semantic'],
            scopes: ['user', 'global'],
            metadata: { userId, category: 'preference' },
            limit: 20,
        });
        res.json({
            preferences: preferences.map((result) => ({
                content: result.memory.content,
                score: result.score ?? result.relevance,
                tags: result.memory.tags,
                createdAt: result.memory.createdAt,
            })),
        });
    }
    catch (error) {
        console.error('Preferences error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * POST /api/preferences/:userId
 * Set user preference as semantic memory
 */
app.post('/api/preferences/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { key, value } = req.body;
        if (!key || !value) {
            res.status(400).json({ error: 'key and value required' });
            return;
        }
        const memoryId = await memory.add(`User preference: ${key} = ${value}`, {
            type: 'semantic',
            scope: 'user',
            importance: 0.9,
            tags: ['preference', key, userId],
        });
        res.json({ success: true, memoryId });
    }
    catch (error) {
        console.error('Set preference error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * GET /api/stats
 * Get memory statistics
 */
app.get('/api/stats', async (_req, res) => {
    try {
        const stats = memory.getStats();
        res.json(stats);
    }
    catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * GET /api/memories/:userId
 * Get all memories for a user
 */
app.get('/api/memories/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { type, limit = '50' } = req.query;
        const query = {
            metadata: { userId },
            limit: Number(limit),
        };
        if (type) {
            query.types = [String(type)];
        }
        const memories = await memory.query(query);
        res.json({
            memories: memories.map((r) => ({
                id: r.memory.id,
                content: r.memory.content,
                type: r.memory.type,
                importance: r.memory.importance,
                timestamp: r.memory.timestamp,
                tags: r.memory.tags,
            })),
        });
    }
    catch (error) {
        console.error('Memories error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * DELETE /api/memories/:memoryId
 * Delete a specific memory
 */
app.delete('/api/memories/:memoryId', async (req, res) => {
    try {
        const { memoryId } = req.params;
        if (!memoryId) {
            res.status(400).json({ error: 'memoryId required' });
            return;
        }
        const success = await memory.forget(memoryId);
        res.json({ success });
    }
    catch (error) {
        console.error('Delete memory error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'clarity-memory-api' });
});
/**
 * Mock LLM function - Replace with your actual LLM integration
 *
 * Example with OpenAI:
 * ```typescript
 * import OpenAI from 'openai'
 * const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
 *
 * async function callLLM(message: string, context: string): Promise<string> {
 *   const response = await openai.chat.completions.create({
 *     model: 'gpt-4o-mini',
 *     messages: [
 *       {
 *         role: 'system',
 *         content: `You are a helpful assistant.\n\nRelevant context:\n${context}`
 *       },
 *       { role: 'user', content: message }
 *     ]
 *   })
 *   return response.choices[0].message.content || 'No response'
 * }
 * ```
 */
async function callLLM(message, context) {
    // Mock response for demonstration
    const contextPreview = context
        ? context.substring(0, 50) + '...'
        : 'no context';
    return `Echo: ${message} (with context: ${contextPreview})`;
}
// Start server
const PORT = process.env['PORT'] || 3000;
app.listen(PORT, () => {
    console.log(`\n✨ Clarity Memory API Server`);
    console.log(`📡 Listening on port ${PORT}`);
    console.log(`\nAvailable endpoints:`);
    console.log(`  POST   http://localhost:${PORT}/api/chat`);
    console.log(`  GET    http://localhost:${PORT}/api/preferences/:userId`);
    console.log(`  POST   http://localhost:${PORT}/api/preferences/:userId`);
    console.log(`  GET    http://localhost:${PORT}/api/memories/:userId`);
    console.log(`  DELETE http://localhost:${PORT}/api/memories/:memoryId`);
    console.log(`  GET    http://localhost:${PORT}/api/stats`);
    console.log(`  GET    http://localhost:${PORT}/health\n`);
});
export default app;
//# sourceMappingURL=memory-nodejs-express.js.map