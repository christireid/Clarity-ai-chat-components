import { NextResponse } from 'next/server'
import {
  API_RESPONSE_HEADERS,
  AI_API_VERSION,
  PACKAGE_VERSION,
} from '@/lib/ai/types'

/**
 * Health Check API
 *
 * Provides API status, version info, and basic statistics.
 * Used for monitoring and load balancer health checks.
 *
 * @route GET /api/ai/health
 * @route OPTIONS /api/ai/health (CORS preflight)
 */

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  version: string
  apiVersion: string
  timestamp: string
  uptime: number
  stats: {
    components: number
    hooks: number
    searchItems: number
  }
  endpoints: {
    path: string
    status: 'available' | 'unavailable'
  }[]
}

// Track when the server started
const startTime = Date.now()

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: API_RESPONSE_HEADERS,
  })
}

/**
 * GET /api/ai/health
 *
 * Returns health status and API statistics
 */
export async function GET() {
  const now = Date.now()

  // Calculate uptime in seconds
  const uptimeSeconds = Math.floor((now - startTime) / 1000)

  // Get stats from other endpoints (hardcoded for now, could be dynamic)
  const stats = {
    components: 15, // Number of documented components
    hooks: 13, // Number of documented hooks
    searchItems: 241, // Number of searchable items
  }

  // Check endpoint availability
  const endpoints = [
    { path: '/api/ai/components', status: 'available' as const },
    { path: '/api/ai/hooks', status: 'available' as const },
    { path: '/api/ai/search', status: 'available' as const },
    { path: '/api/ai/health', status: 'available' as const },
  ]

  const response: HealthResponse = {
    status: 'healthy',
    version: PACKAGE_VERSION,
    apiVersion: AI_API_VERSION,
    timestamp: new Date().toISOString(),
    uptime: uptimeSeconds,
    stats,
    endpoints,
  }

  return NextResponse.json(response, {
    headers: {
      ...API_RESPONSE_HEADERS,
      // Don't cache health checks
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}
