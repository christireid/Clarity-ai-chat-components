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
export declare function POST(request: NextRequest): Promise<Response>;
//# sourceMappingURL=route.d.ts.map