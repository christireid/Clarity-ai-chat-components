/**
 * Feedback API Endpoint
 *
 * Handles user feedback on AI assistant responses.
 */
import { NextRequest, NextResponse } from 'next/server';
export declare const runtime = "edge";
export declare const dynamic = "force-dynamic";
/**
 * POST /api/feedback
 *
 * Submit feedback for an AI response
 */
export declare function POST(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    message: string;
}>>;
/**
 * GET /api/feedback
 *
 * Get feedback statistics (admin only in production)
 */
export declare function GET(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    stats: any;
    timestamp: string;
}>>;
//# sourceMappingURL=route.d.ts.map