/**
 * Cache Invalidation API
 *
 * Provides endpoints for invalidating cached responses by tags, patterns, or full clear.
 *
 * POST /api/cache/invalidate
 *
 * Request body:
 * - all: boolean - Clear entire cache
 * - tags: string[] - Invalidate by tags (e.g., ['component', 'api:ChatWindow'])
 * - pattern: string - Invalidate by pattern match (e.g., 'streaming')
 */

import { NextRequest, NextResponse } from 'next/server'
import { getResponseCache } from '../../../../lib/ai/responseCache'
import { getLogger } from '../../../../lib/logging'

const logger = getLogger('cache-invalidate-api')

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tags, pattern, all } = body

    // SECURITY: Check for admin authorization (add your auth logic here)
    const authHeader = request.headers.get('authorization')
    const adminKey = process.env.ADMIN_API_KEY

    if (adminKey && authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid admin key' },
        { status: 401 }
      )
    }

    const cache = getResponseCache()

    if (all) {
      // Full cache clear
      logger.info('Clearing entire cache')
      await cache.clear()

      return NextResponse.json({
        success: true,
        message: 'Cache cleared completely',
        operation: 'clear_all',
      })
    }

    if (tags && Array.isArray(tags) && tags.length > 0) {
      // Tag-based invalidation
      logger.info(`Invalidating cache by tags: ${tags.join(', ')}`)
      await cache.clear(tags)

      return NextResponse.json({
        success: true,
        message: `Invalidated tags: ${tags.join(', ')}`,
        operation: 'clear_tags',
        tags,
      })
    }

    if (pattern && typeof pattern === 'string') {
      // Pattern-based invalidation
      logger.info(`Invalidating cache by pattern: ${pattern}`)
      const count = await cache.invalidatePattern(pattern)

      return NextResponse.json({
        success: true,
        message: `Invalidated ${count} entries matching: ${pattern}`,
        operation: 'invalidate_pattern',
        pattern,
        count,
      })
    }

    return NextResponse.json(
      {
        error: 'No invalidation criteria provided',
        expected: {
          all: 'boolean',
          tags: 'string[]',
          pattern: 'string',
        },
      },
      { status: 400 }
    )
  } catch (error) {
    logger.error('Cache invalidation failed', error)

    return NextResponse.json(
      {
        error: 'Invalidation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/cache/invalidate
 *
 * Returns available invalidation operations
 */
export async function GET() {
  return NextResponse.json({
    operations: {
      clearAll: {
        method: 'POST',
        body: { all: true },
        description: 'Clear entire cache',
      },
      clearByTags: {
        method: 'POST',
        body: { tags: ['component', 'api:ChatWindow'] },
        description: 'Invalidate entries with specific tags',
      },
      invalidatePattern: {
        method: 'POST',
        body: { pattern: 'streaming' },
        description: 'Invalidate entries matching pattern',
      },
    },
    commonTags: [
      'component',
      'hook',
      'guide',
      'example',
      'reference',
      'api:ChatWindow',
      'api:MessageList',
      'api:ChatInput',
    ],
    security: {
      required: !!process.env.ADMIN_API_KEY,
      header: 'Authorization: Bearer <ADMIN_API_KEY>',
    },
  })
}
