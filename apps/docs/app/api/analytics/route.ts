/**
 * Analytics API Endpoint
 *
 * Provides access to usage analytics and metrics.
 * Protected endpoint - requires authentication in production.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAnalyticsStore } from '@/lib/ai/analytics'
import { logApiError } from '@/lib/security/secureLogger'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

/**
 * GET /api/analytics - Get analytics summary
 *
 * Query params:
 * - startDate: ISO date string (optional)
 * - endDate: ISO date string (optional)
 * - period: '7d' | '30d' | '90d' (optional, shorthand)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication in production
    const isDev = process.env.NODE_ENV === 'development'

    if (!isDev) {
      const authHeader = request.headers.get('authorization')
      const adminToken = process.env.ADMIN_AUTH_TOKEN

      if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
        return NextResponse.json(
          { error: 'Unauthorized. Admin access required.' },
          { status: 401 }
        )
      }
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')
    const period = searchParams.get('period') as '7d' | '30d' | '90d' | null

    let startDate: Date | undefined
    let endDate: Date | undefined

    // Handle period shorthand
    if (period) {
      endDate = new Date()
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
      startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)
    } else {
      // Handle explicit dates
      if (startDateParam) {
        startDate = new Date(startDateParam)
      }
      if (endDateParam) {
        endDate = new Date(endDateParam)
      }
    }

    // Get analytics
    const analytics = getAnalyticsStore()
    const summary = await analytics.getSummary(startDate, endDate)

    return NextResponse.json({
      success: true,
      data: summary,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logApiError(error as Error, 'Analytics API GET', request)

    return NextResponse.json(
      {
        error: 'Failed to fetch analytics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/analytics/recent - Get recent queries
 */
export async function POST(request: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV === 'development'

    if (!isDev) {
      const authHeader = request.headers.get('authorization')
      const adminToken = process.env.ADMIN_AUTH_TOKEN

      if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    const body = await request.json()
    const limit = body.limit || 50

    const analytics = getAnalyticsStore()
    const queries = await analytics.getRecentQueries(limit)

    return NextResponse.json({
      success: true,
      data: queries,
      count: queries.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logApiError(error as Error, 'Analytics API POST', request)

    return NextResponse.json(
      {
        error: 'Failed to fetch recent queries',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS /api/analytics - CORS preflight
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
