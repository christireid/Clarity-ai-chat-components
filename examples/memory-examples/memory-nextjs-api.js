/**
 * Next.js API Route Example - Modern Clarity Memory API
 *
 * File location: app/api/chat/route.ts (App Router)
 * Or: pages/api/chat.ts (Pages Router)
 *
 * This example shows how to use @clarity-chat/memory in a Next.js API route
 */
import { NextRequest, NextResponse } from 'next/server';
import { clarityMemory } from '@clarity-chat/memory';
// Initialize memory service (singleton pattern for API routes)
let memoryInstance = null;
async function getMemory() {
    if (!memoryInstance) {
        // @ts-expect-error - Example uses minimal config, factory provides defaults
        memoryInstance = clarityMemory({
            debug: true,
            storage: {
                type: 'memory', // Use file or database in production
            },
        });
        await memoryInstance.initialize();
    }
    return memoryInstance;
}
/**
 * POST /api/chat
 * Chat endpoint with memory-enhanced context
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, message, sessionId } = body;
        if (!userId || !message) {
            return NextResponse.json({ error: 'userId and message required' }, { status: 400 });
        }
        const memory = await getMemory();
        // Search for relevant memories
        const relevantMemories = await memory.recall(message, {
            limit: 5,
            minConfidence: 0.7,
            metadata: { userId, sessionId },
        });
        // Get optimized context bundle
        const contextBundle = await memory.context({
            maxTokens: 1000,
        });
        // Call your LLM with context
        const response = await generateResponse(message, contextBundle.formatted || '');
        // Store user message and response
        await Promise.all([
            memory.add(message, {
                type: 'episodic',
                scope: 'session',
                importance: 0.5,
                tags: ['user-message', userId, sessionId].filter(Boolean),
            }),
            memory.add(response, {
                type: 'episodic',
                scope: 'session',
                importance: 0.6,
                tags: ['assistant-response', userId, sessionId].filter(Boolean),
            }),
        ]);
        return NextResponse.json({
            response,
            memoriesUsed: relevantMemories.length,
            tokensUsed: contextBundle.tokenBreakdown.total,
        });
    }
    catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
/**
 * GET /api/chat?userId=xxx
 * Get chat history for a user
 */
export async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');
        if (!userId) {
            return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }
        const memory = await getMemory();
        const stats = memory.getStats();
        // Get recent memories for the user
        const recentMemories = await memory.query({
            types: ['episodic'],
            metadata: { userId },
            limit: 20,
        });
        return NextResponse.json({
            stats,
            recentMemories: recentMemories.map((r) => ({
                content: r.memory.content,
                type: r.memory.type,
                timestamp: r.memory.timestamp,
                tags: r.memory.tags,
            })),
        });
    }
    catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
/**
 * Mock LLM response generator
 * Replace with actual LLM integration (OpenAI, Anthropic, etc.)
 */
async function generateResponse(message, context) {
    // Example with Vercel AI SDK:
    // import { streamText } from 'ai'
    // import { openai } from '@ai-sdk/openai'
    //
    // const result = await streamText({
    //   model: openai('gpt-4o-mini'),
    //   messages: [
    //     { role: 'system', content: `Context: ${context}` },
    //     { role: 'user', content: message }
    //   ]
    // })
    // return result.text
    return `Response to: ${message} (with context)`;
}
//# sourceMappingURL=memory-nextjs-api.js.map