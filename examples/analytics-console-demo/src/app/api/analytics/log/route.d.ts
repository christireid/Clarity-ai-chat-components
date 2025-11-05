/**
 * Analytics Logging API
 * POST: Log a new analytics entry
 */
import { NextRequest, NextResponse } from 'next/server';
export declare function POST(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    entry: {
        id: any;
        timestamp: any;
    };
}>>;
//# sourceMappingURL=route.d.ts.map