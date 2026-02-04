/**
 * Cache Warming API
 *
 * Warms the cache with common queries to improve hit rates after deployment.
 *
 * POST /api/cache/warm
 */

import { NextRequest, NextResponse } from 'next/server'
import { warmCommonQueries } from '../../../../lib/ai/responseCache'
import { getLogger } from '../../../../lib/logging'

const logger = getLogger('cache-warm-api')

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Check for admin authorization (add your auth logic here)
    const authHeader = request.headers.get('authorization')
    const adminKey = process.env.ADMIN_API_KEY

    if (adminKey && authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid admin key' },
        { status: 401 }
      )
    }

    logger.info('Starting cache warming')

    await warmCommonQueries()

    logger.info('Cache warming completed')

    return NextResponse.json({
      success: true,
      message: 'Cache warming completed',
      note: 'Only queries already in cache were counted. New queries require LLM calls.',
    })
  } catch (error) {
    logger.error('Cache warming failed', error)

    return NextResponse.json(
      {
        error: 'Cache warming failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    description: 'Warm cache with common queries',
    method: 'POST',
    security: {
      required: !!process.env.ADMIN_API_KEY,
      header: 'Authorization: Bearer <ADMIN_API_KEY>',
    },
  })
}
