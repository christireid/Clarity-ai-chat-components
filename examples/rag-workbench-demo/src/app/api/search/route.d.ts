/**
 * Search API - Find relevant chunks
 */
import { NextRequest, NextResponse } from 'next/server';
export declare function POST(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    results: never[];
    message: string;
}> | NextResponse<{
    results: any;
    total: any;
}>>;
//# sourceMappingURL=route.d.ts.map