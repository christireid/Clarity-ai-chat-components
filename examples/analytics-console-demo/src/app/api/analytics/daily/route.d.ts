/**
 * Daily Analytics API
 * GET: Get daily breakdown
 */
import { NextRequest, NextResponse } from 'next/server';
export declare function GET(request: NextRequest): Promise<NextResponse<{
    summaries: any;
    count: any;
}> | NextResponse<{
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map