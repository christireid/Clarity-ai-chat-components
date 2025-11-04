import { NextRequest, NextResponse } from 'next/server';
export declare function POST(req: NextRequest): Promise<NextResponse<{
    message: string | null;
}> | NextResponse<{
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map