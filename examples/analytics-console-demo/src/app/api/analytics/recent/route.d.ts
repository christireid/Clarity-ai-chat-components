/**
 * Recent Analytics API
 * GET: Get recent entries
 */
import { NextRequest, NextResponse } from 'next/server';
export declare function GET(request: NextRequest): Promise<NextResponse<{
    entries: any;
    count: any;
}> | NextResponse<{
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map