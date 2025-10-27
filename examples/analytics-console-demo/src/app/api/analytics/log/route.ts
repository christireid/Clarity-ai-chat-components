/**
 * Analytics Logging API
 * POST: Log a new analytics entry
 */

import { NextRequest, NextResponse } from 'next/server'
import { addEntry } from '@/lib/storage'
import type { AnalyticsEntry } from '@/types/analytics'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const {
      provider,
      model,
      promptTokens,
      completionTokens,
      cost,
      responseTime,
      userId,
      metadata
    } = body
    
    if (!provider || !model) {
      return NextResponse.json(
        { error: 'Provider and model are required' },
        { status: 400 }
      )
    }
    
    if (promptTokens === undefined || completionTokens === undefined) {
      return NextResponse.json(
        { error: 'Token counts are required' },
        { status: 400 }
      )
    }
    
    // Add entry
    const entry = addEntry({
      provider,
      model,
      promptTokens: Number(promptTokens),
      completionTokens: Number(completionTokens),
      cost: Number(cost) || 0,
      responseTime: Number(responseTime) || 0,
      userId,
      metadata
    })
    
    return NextResponse.json({
      success: true,
      entry: {
        id: entry.id,
        timestamp: entry.timestamp
      }
    })
    
  } catch (error) {
    console.error('Analytics log error:', error)
    return NextResponse.json(
      { error: 'Failed to log analytics' },
      { status: 500 }
    )
  }
}
