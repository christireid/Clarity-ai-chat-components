/**
 * Clear Analytics API
 * DELETE: Clear all analytics data (dev only)
 */
import { NextResponse } from 'next/server';
export declare function DELETE(): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    message: string;
}>>;
//# sourceMappingURL=route.d.ts.map