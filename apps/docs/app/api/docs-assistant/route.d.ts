/**
 * Documentation Assistant API Endpoint
 *
 * Handles chat requests with RAG-powered responses using indexed documentation.
 * Supports streaming responses via Server-Sent Events.
 */
import { NextRequest, NextResponse } from 'next/server';
export declare const runtime = "nodejs";
export declare const dynamic = "force-dynamic";
/**
 * POST /api/docs-assistant
 *
 * Generate AI response for documentation queries
 */
export declare function POST(request: NextRequest): Promise<Response>;
/**
 * GET /api/docs-assistant
 *
 * Health check endpoint
 */
export declare function GET(): Promise<NextResponse<{
    status: string;
    service: string;
    version: string;
    features: {
        rag: boolean;
        streaming: boolean;
        rateLimit: boolean;
        caching: boolean;
        feedback: boolean;
    };
    models: {
        configured: string;
        available: string[];
    };
    cache: any;
}>>;
/**
 * OPTIONS /api/docs-assistant
 *
 * CORS preflight
 */
export declare function OPTIONS(): Promise<Response>;
//# sourceMappingURL=route.d.ts.map