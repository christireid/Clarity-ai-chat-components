/**
 * Feedback API Endpoint
 *
 * Handles user feedback on AI assistant responses.
 */
import { NextResponse } from 'next/server';
import { getFeedbackStore } from '@/lib/ai/feedbackStore';
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
/**
 * POST /api/feedback
 *
 * Submit feedback for an AI response
 */
export async function POST(request) {
    try {
        const body = (await request.json());
        // Validate required fields
        if (!body.messageId || !body.type) {
            return NextResponse.json({ error: 'messageId and type are required' }, { status: 400 });
        }
        if (!['positive', 'negative'].includes(body.type)) {
            return NextResponse.json({ error: 'type must be "positive" or "negative"' }, { status: 400 });
        }
        // Save feedback
        const feedbackStore = getFeedbackStore();
        await feedbackStore.saveFeedback({
            messageId: body.messageId,
            type: body.type,
            comment: body.comment,
            sessionId: body.sessionId,
            userId: body.userId,
            metadata: body.metadata || {},
        });
        console.log(`✅ Feedback received: ${body.type} for message ${body.messageId}`);
        return NextResponse.json({
            success: true,
            message: 'Feedback received. Thank you!',
        });
    }
    catch (error) {
        console.error('Feedback error:', error);
        return NextResponse.json({
            error: 'Failed to save feedback',
            message: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
/**
 * GET /api/feedback
 *
 * Get feedback statistics (admin only in production)
 */
export async function GET(request) {
    try {
        // In production, you should add authentication here
        const isDev = process.env.NODE_ENV === 'development';
        if (!isDev) {
            // Check for admin auth token
            const authHeader = request.headers.get('authorization');
            const adminToken = process.env.ADMIN_AUTH_TOKEN;
            if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }
        const feedbackStore = getFeedbackStore();
        const stats = await feedbackStore.getStats();
        return NextResponse.json({
            stats,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json({
            error: 'Failed to fetch stats',
            message: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map