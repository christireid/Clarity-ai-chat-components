/**
 * Live Demo Chat API Endpoint
 *
 * Powers the homepage demo chat with AI and docs search.
 * Uses shared streaming utilities from lib/ai/streaming.ts
 */
import { searchDocumentation, formatSearchResultsForRAG } from '@/lib/ai/keywordSearch';
import { streamFromGemini, streamFromDemo } from '@/lib/ai/streaming';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// System prompt that defines the assistant's role
const SYSTEM_PROMPT = `You are the Clarity Chat documentation assistant, helping developers build amazing chat interfaces.

## About Clarity Chat

Clarity Chat is a comprehensive React component library with:
- 70+ production-ready components (ChatWindow, MessageBubble, InputBar, TypingIndicator, etc.)
- 35+ custom hooks (useChat, useStreaming, useTokenCount, useMessageHistory, etc.)
- Token optimization tools achieving 60-80% cost reductions
- TypeScript-first design with full type safety
- WCAG AAA accessibility compliance
- 11 built-in themes with dark mode support

## Your Behavior

1. **Be concise**: This is a demo chat, keep responses focused and helpful (2-4 paragraphs max)
2. **Use the documentation context**: When provided, reference specific components, hooks, and features
3. **Provide code examples**: Include short, practical code snippets when relevant
4. **Be enthusiastic but professional**: Help developers feel excited about using Clarity Chat
5. **Stay on topic**: Focus on Clarity Chat; politely redirect off-topic questions

## Response Format

- Use markdown for formatting (code blocks, bold, lists)
- Keep code examples short and focused
- Always mention relevant documentation pages when applicable
- End with a helpful follow-up suggestion when appropriate

Remember: You're the friendly face of Clarity Chat, helping developers build production-ready chat UIs!`;
/**
 * Create a plain text streaming response from StreamChunk generator
 */
function createPlainTextStream(generator) {
    const encoder = new TextEncoder();
    return new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of generator) {
                    if (chunk.type === 'text' && chunk.content) {
                        controller.enqueue(encoder.encode(chunk.content));
                    }
                }
                controller.close();
            }
            catch (error) {
                console.error('Streaming error:', error);
                controller.error(error);
            }
        }
    });
}
/**
 * POST /api/live-demo-chat
 */
export async function POST(request) {
    let body;
    try {
        body = (await request.json());
    }
    catch {
        return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    try {
        if (!body.message) {
            return Response.json({ error: 'Message is required' }, { status: 400 });
        }
        // Search documentation for relevant context
        const searchResults = searchDocumentation(body.message, {
            topK: 3,
            minScore: 0.5,
        });
        const { context: docsContext } = formatSearchResultsForRAG(searchResults);
        // Build message with context
        const messageWithContext = docsContext
            ? `[Documentation Context]\n${docsContext}\n\n[User Question]\n${body.message}`
            : body.message;
        // Choose streaming function based on API key availability
        const hasGeminiKey = !!process.env.GEMINI_API_KEY;
        let generator;
        if (hasGeminiKey) {
            // Use shared Gemini streaming utility
            generator = streamFromGemini([{ role: 'user', content: messageWithContext }], { systemPrompt: SYSTEM_PROMPT });
        }
        else {
            // Use shared demo streaming utility
            generator = streamFromDemo([
                { role: 'user', content: body.message }
            ]);
        }
        // Create streaming response
        const stream = createPlainTextStream(generator);
        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    }
    catch (error) {
        console.error('API error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
/**
 * GET /api/live-demo-chat - Health check
 */
export async function GET() {
    return Response.json({
        status: 'ok',
        service: 'Live Demo Chat',
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
    });
}
//# sourceMappingURL=route.js.map