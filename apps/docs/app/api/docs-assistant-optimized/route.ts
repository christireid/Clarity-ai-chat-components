/**
 * Documentation Assistant API Endpoint - Optimized (DISABLED)
 *
 * This endpoint requires token optimization functions from @clarity-chat/react
 * that are not yet available in the public API. It returns 501 Not Implemented.
 *
 * When token optimization is added to the public API:
 * - Prompt compression (20-35% token savings)
 * - Model routing (40-60% cost savings for simple queries)
 * - Enhanced RAG with context optimization
 * - Semantic caching integration
 * - Token budget monitoring
 */

import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/docs-assistant-optimized
 *
 * Returns 501 Not Implemented - use /api/docs-assistant instead
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        'This optimized endpoint is not yet available. Please use /api/docs-assistant instead.',
      redirectTo: '/api/docs-assistant',
    },
    { status: 501 }
  )
}
