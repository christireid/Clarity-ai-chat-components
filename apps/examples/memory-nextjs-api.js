/**
 * Next.js API Route Example - Framework-Agnostic Memory Usage
 *
 * File: app/api/chat/route.ts
 */
import { NextResponse } from 'next/server';
import { MemoryService } from '@clarity-chat/memory';
// Initialize memory service (singleton pattern for API routes)
let memoryService = null;
function getMemoryService() {
    if (!memoryService) {
        const config = {
            tokenOptimization: {
                maxContextWindow: 8192,
                allocation: {
                    systemPrompt: 0.10,
                    userPreferences: 0.15,
                    recentContext: 0.30,
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
            enableAutoCleanup: true,
            retentionPolicy: {
                shortTerm: 3600,
                session: 86400,
                thread: 604800,
                global: 0,
            },
        };
        memoryService = new MemoryService(config);
    }
    return memoryService;
}
/**
 * POST /api/chat
 * Chat endpoint with memory
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, message, sessionId } = body;
        if (!userId || !message) {
            return NextResponse.json({ error: 'userId and message required' }, { status: 400 });
        }
        const memory = getMemoryService();
        // Get relevant memories
        const memories = await memory.query({
            query: message,
            limit: 5,
            minConfidence: 0.7,
            sessionId,
            metadata: { userId },
        });
        // Build context
        const context = memories.map(r => r.memory.content).join('\n\n');
        // Call LLM (OpenAI, Anthropic, etc.)
        const response = await generateResponse(message, context);
        // Store messages
        await Promise.all([
            memory.addMemory(message, 'episodic', 'session', { userId, sessionId, role: 'user' }, { priority: 'medium' }),
            memory.addMemory(response, 'episodic', 'session', { userId, sessionId, role: 'assistant' }, { priority: 'medium' }),
        ]);
        return NextResponse.json({
            response,
            memoriesUsed: memories.length,
        });
    }
    catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
/**
 * GET /api/chat/stats
 * Get memory statistics
 */
export async function GET() {
    try {
        const memory = getMemoryService();
        const stats = memory.getStats();
        return NextResponse.json(stats);
    }
    catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
async function generateResponse(message, context) {
    // Your LLM call here
    // const openai = new OpenAI()
    // const completion = await openai.chat.completions.create({...})
    return `Response to: ${message}`;
}
//# sourceMappingURL=memory-nextjs-api.js.map