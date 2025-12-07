/**
 * Analytics API Endpoint
 *
 * Provides access to usage analytics and metrics.
 * Protected endpoint - requires authentication in production.
 */
import { NextRequest, NextResponse } from 'next/server';
export declare const runtime = "edge";
export declare const dynamic = "force-dynamic";
/**
 * GET /api/analytics - Get analytics summary
 *
 * Query params:
 * - startDate: ISO date string (optional)
 * - endDate: ISO date string (optional)
 * - period: '7d' | '30d' | '90d' (optional, shorthand)
 */
export declare function GET(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    data: any;
    timestamp: string;
}>>;
/**
 * GET /api/analytics/recent - Get recent queries
 */
export declare function POST(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    data: any;
    count: any;
    timestamp: string;
}>>;
/**
 * OPTIONS /api/analytics - CORS preflight
 */
export declare function OPTIONS(): Promise<Response>;
//# sourceMappingURL=route.d.ts.map