/**
 * Next.js API Route Example - Modern Clarity Memory API
 *
 * File location: app/api/chat/route.ts (App Router)
 * Or: pages/api/chat.ts (Pages Router)
 *
 * This example shows how to use @clarity-chat/memory in a Next.js API route
 */
import { NextRequest } from 'next/server';
/**
 * POST /api/chat
 * Chat endpoint with memory-enhanced context
 */
export declare function POST(request: NextRequest): Promise<any>;
/**
 * GET /api/chat?userId=xxx
 * Get chat history for a user
 */
export declare function GET(request: NextRequest): Promise<any>;
//# sourceMappingURL=memory-nextjs-api.d.ts.map