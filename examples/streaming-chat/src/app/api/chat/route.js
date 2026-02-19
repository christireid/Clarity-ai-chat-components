import { NextRequest } from 'next/server';
/**
 * POST /api/chat
 *
 * Streaming chat API endpoint that demonstrates real-time AI response streaming.
 *
 * In production, integrate with your preferred AI provider:
 * - OpenAI: Use the OpenAI SDK with streaming enabled
 * - Anthropic: Use the Anthropic SDK with streaming
 * - Vercel AI SDK: Use streamText() for unified provider support
 *
 * @example Production integration with OpenAI:
 * ```typescript
 * import OpenAI from 'openai'
 *
 * const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
 *
 * const stream = await openai.chat.completions.create({
 *   model: 'gpt-4o-mini',
 *   messages,
 *   stream: true,
 * })
 *
 * return new Response(stream.toReadableStream())
 * ```
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { messages } = body;
        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: 'Messages array is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        // Get the last user message
        const lastMessage = messages[messages.length - 1];
        // ==========================================================================
        // DEMO MODE: Simulated streaming response
        // ==========================================================================
        // This is a demonstration of streaming without requiring API keys.
        // Replace this section with actual AI provider integration in production.
        const demoResponse = generateDemoResponse(lastMessage?.content || '');
        // Create a streaming response using ReadableStream
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                // Simulate streaming by sending chunks with delays
                const words = demoResponse.split(' ');
                for (let i = 0; i < words.length; i++) {
                    // Add space between words (except for first word)
                    const chunk = i === 0 ? words[i] : ' ' + words[i];
                    controller.enqueue(encoder.encode(chunk));
                    // Simulate typing delay (30-80ms per word)
                    await new Promise((resolve) => setTimeout(resolve, 30 + Math.random() * 50));
                }
                controller.close();
            },
        });
        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache',
                'Transfer-Encoding': 'chunked',
            },
        });
    }
    catch (error) {
        console.error('Chat API error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
/**
 * Generate a demo response based on user input.
 * This provides meaningful responses without requiring API keys.
 */
function generateDemoResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    // Context-aware demo responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello! I'm a demo AI assistant showcasing Clarity Chat's streaming capabilities. While this is a simulated response, it demonstrates real-time text streaming that you'd see with actual AI providers like OpenAI or Anthropic. How can I help you explore this example?";
    }
    if (lowerMessage.includes('how') && lowerMessage.includes('work')) {
        return 'Great question! This streaming chat example works by:\n\n1. **Sending your message** to the /api/chat endpoint\n2. **Processing the request** (in production, this calls an AI provider)\n3. **Streaming the response** back chunk by chunk using ReadableStream\n4. **Updating the UI** in real-time as each chunk arrives\n\nThe result is a smooth, responsive chat experience where you see the response being "typed" rather than waiting for the full response.';
    }
    if (lowerMessage.includes('clarity') || lowerMessage.includes('chat')) {
        return 'Clarity Chat is a premium AI chat component library that provides:\n\n• **Streaming components** for real-time AI responses\n• **Accessibility-first design** (WCAG 2.1 AA compliant)\n• **TypeScript support** with full type safety\n• **Customizable themes** with Tailwind CSS\n• **Robust patterns** for enterprise applications\n\nThis example demonstrates the streaming chat pattern you can implement with Clarity Chat components.';
    }
    if (lowerMessage.includes('code') || lowerMessage.includes('example')) {
        return "To integrate real AI streaming in this example, you'd modify the API route like this:\n\n```typescript\nimport { streamText } from 'ai'\nimport { openai } from '@ai-sdk/openai'\n\nconst result = await streamText({\n  model: openai('gpt-4o-mini'),\n  messages,\n})\n\nreturn result.toTextStreamResponse()\n```\n\nThe Vercel AI SDK makes it easy to switch between providers while keeping the same streaming pattern.";
    }
    // Default response
    return `I received your message: "${userMessage}"\n\nThis is a demo response showcasing Clarity Chat's streaming capabilities. In production, you would connect this to an AI provider like OpenAI, Anthropic, or any other LLM service. The streaming pattern demonstrated here would work the same way with real AI responses, providing a smooth, real-time chat experience.\n\nTry asking about how this example works, or about Clarity Chat features!`;
}
//# sourceMappingURL=route.js.map