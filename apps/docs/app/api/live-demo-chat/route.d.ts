/**
 * Live Demo Chat API Endpoint
 *
 * Powers the homepage demo chat with AI and docs search.
 * Uses shared streaming utilities from lib/ai/streaming.ts
 */
import { NextRequest } from 'next/server';
export declare const runtime = "nodejs";
export declare const dynamic = "force-dynamic";
/**
 * POST /api/live-demo-chat
 */
export declare function POST(request: NextRequest): Promise<Response>;
/**
 * GET /api/live-demo-chat - Health check
 */
export declare function GET(): Promise<Response>;
//# sourceMappingURL=route.d.ts.map