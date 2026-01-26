import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { validateRequestBody, validationErrorResponse } from '@/lib/validation'
import { revalidateRequestSchema } from './schema'

/**
 * On-Demand Revalidation API Route
 *
 * Wave 3.3 Agent 35 - ISR Cache Optimizer + Wave 3.4 Agent 38 - Data Validation
 *
 * Allows manual cache invalidation after content updates or deployments.
 * Requires REVALIDATION_SECRET environment variable for authentication.
 * Now includes Zod validation for request body.
 *
 * Usage:
 * ```bash
 * # Revalidate specific path
 * curl -X POST "https://your-domain.com/api/revalidate?secret=YOUR_SECRET" \
 *   -H "Content-Type: application/json" \
 *   -d '{"path": "/api/reference/hooks"}'
 *
 * # Revalidate by tag (all pages with that tag)
 * curl -X POST "https://your-domain.com/api/revalidate?secret=YOUR_SECRET" \
 *   -H "Content-Type: application/json" \
 *   -d '{"tag": "api-docs"}'
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    // Verify secret token for authentication
    const secret = request.nextUrl.searchParams.get('secret')

    if (!secret || secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        {
          error: 'Invalid or missing secret token',
          message: 'Authentication required for cache revalidation'
        },
        { status: 401 }
      )
    }

    // Validate request body with Zod schema
    const validation = await validateRequestBody(request, revalidateRequestSchema)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const { path, tag } = validation.data

    // Revalidate by path
    if (path) {
      await revalidatePath(path)
      return NextResponse.json({
        revalidated: true,
        method: 'path',
        path,
        timestamp: new Date().toISOString(),
        now: Date.now(),
      })
    }

    // Revalidate by tag
    if (tag) {
      await revalidateTag(tag)
      return NextResponse.json({
        revalidated: true,
        method: 'tag',
        tag,
        timestamp: new Date().toISOString(),
        now: Date.now(),
      })
    }

    // No path or tag provided
    return NextResponse.json(
      {
        error: 'Missing parameter',
        message: 'Either "path" or "tag" parameter is required'
      },
      { status: 400 }
    )
  } catch (err) {
    console.error('Revalidation error:', err)
    return NextResponse.json(
      {
        error: 'Revalidation failed',
        message: err instanceof Error ? err.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? err : undefined
      },
      { status: 500 }
    )
  }
}

// Prevent caching of the revalidation endpoint itself
export const dynamic = 'force-dynamic'
export const revalidate = 0
