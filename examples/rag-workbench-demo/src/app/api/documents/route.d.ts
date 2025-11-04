/**
 * Document management API
 * POST: Upload document
 * GET: List documents
 * DELETE: Delete document
 */
import { NextRequest, NextResponse } from 'next/server';
export declare function POST(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    documentId: any;
    name: any;
    chunks: any;
    tokens: any;
    size: any;
}>>;
export declare function GET(): Promise<NextResponse<{
    documents: any;
    total: any;
}> | NextResponse<{
    error: string;
}>>;
export declare function DELETE(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    message: string;
}>>;
//# sourceMappingURL=route.d.ts.map