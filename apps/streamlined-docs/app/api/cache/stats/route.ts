/**
 * Cache Statistics API
 *
 * Provides detailed cache performance metrics including:
 * - Hit rates (L1 and L2)
 * - Cost savings
 * - Compression statistics
 * - Memory usage
 *
 * GET /api/cache/stats
 */

import { NextResponse } from 'next/server'
import { getResponseCache } from '../../../../lib/ai/responseCache'
import { getLogger } from '../../../../lib/logging'

const logger = getLogger('cache-stats-api')

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cache = getResponseCache()
    const stats = await cache.getStats()

    // Calculate efficiency metrics
    const overallHitRate = stats.hitRate
    const l1HitRate = stats.l1Stats?.hitRate || 0
    const l2HitRate = stats.l2Stats?.hitRate || 0

    // Cost analysis
    const monthlyCost = stats.cacheMisses * 0.0015 * 30 // Estimate monthly cost
    const monthlySavings = stats.cacheHits * 0.0015 * 30 // Estimate monthly savings
    const savingsPercentage =
      monthlyCost + monthlySavings > 0
        ? (monthlySavings / (monthlyCost + monthlySavings)) * 100
        : 0

    // Compression efficiency
    const compressionRatio = stats.compressionStats?.compressionRatio || 0
    const totalBytesSaved = stats.compressionStats?.bytesSaved || 0
    const compressionSavings = (totalBytesSaved / (1024 * 1024)).toFixed(2) // MB saved

    return NextResponse.json({
      summary: {
        totalQueries: stats.totalQueries,
        hitRate: `${overallHitRate.toFixed(1)}%`,
        estimatedSavings: `$${stats.estimatedSavings.toFixed(2)}`,
        status: overallHitRate >= 70 ? 'excellent' : overallHitRate >= 50 ? 'good' : 'needs-improvement',
      },
      performance: {
        overall: {
          hits: stats.cacheHits,
          misses: stats.cacheMisses,
          hitRate: `${overallHitRate.toFixed(1)}%`,
        },
        l1: {
          name: 'Memory Cache',
          hits: stats.l1Stats?.hits || 0,
          misses: stats.l1Stats?.misses || 0,
          size: stats.l1Stats?.size || 0,
          hitRate: `${l1HitRate.toFixed(1)}%`,
          avgResponseTime: '1-2ms',
        },
        l2: {
          name: 'Redis Cache',
          hits: stats.l2Stats?.hits || 0,
          misses: stats.l2Stats?.misses || 0,
          hitRate: `${l2HitRate.toFixed(1)}%`,
          avgResponseTime: '50ms',
        },
      },
      costAnalysis: {
        current: {
          estimatedMonthlyCost: `$${monthlyCost.toFixed(2)}`,
          estimatedMonthlySavings: `$${monthlySavings.toFixed(2)}`,
          savingsPercentage: `${savingsPercentage.toFixed(1)}%`,
        },
        breakdown: {
          cachedRequests: stats.cacheHits,
          llmRequests: stats.cacheMisses,
          costPerLLMRequest: '$0.0015',
          costPerCachedRequest: '$0.00',
        },
      },
      compression: {
        enabled: true,
        totalCompressed: stats.compressionStats?.totalCompressed || 0,
        avgCompressionRatio: `${compressionRatio.toFixed(0)} bytes/response`,
        totalBytesSaved: `${compressionSavings} MB`,
        compressionThreshold: '1 KB',
      },
      recommendations: generateRecommendations(stats),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Failed to get cache stats', error)

    return NextResponse.json(
      {
        error: 'Failed to retrieve cache statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Generate actionable recommendations based on cache performance
 */
function generateRecommendations(stats: {
  hitRate: number
  totalQueries: number
  l1Stats?: { hitRate: number; size: number }
  l2Stats?: { hitRate: number }
}): string[] {
  const recommendations: string[] = []

  // Overall hit rate
  if (stats.hitRate < 50) {
    recommendations.push(
      'Low cache hit rate detected. Review query patterns and consider adjusting TTLs.'
    )
  } else if (stats.hitRate >= 80) {
    recommendations.push('Excellent cache performance! Continue monitoring.')
  }

  // L1 performance
  if (stats.l1Stats && stats.l1Stats.hitRate < 40) {
    recommendations.push(
      'L1 cache hit rate is low. Consider increasing L1_MAX_SIZE or L1_MAX_AGE.'
    )
  }

  // L1 size
  if (stats.l1Stats && stats.l1Stats.size >= 45) {
    recommendations.push(
      'L1 cache is near capacity. Monitor memory usage or increase L1_MAX_SIZE.'
    )
  }

  // Total queries
  if (stats.totalQueries < 100) {
    recommendations.push(
      'Limited query volume. Cache warming may help improve initial hit rates.'
    )
  }

  // L2 performance
  if (stats.l2Stats && stats.l2Stats.hitRate < 30) {
    recommendations.push(
      'L2 cache hit rate is low. Review tag-based invalidation and TTL strategies.'
    )
  }

  if (recommendations.length === 0) {
    recommendations.push('Cache is performing optimally. No actions needed.')
  }

  return recommendations
}
