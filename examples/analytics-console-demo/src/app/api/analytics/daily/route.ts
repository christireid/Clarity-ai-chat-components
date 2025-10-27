/**
 * Daily Analytics API
 * GET: Get daily breakdown
 */

import { NextRequest, NextResponse } from 'next/server'
import { getDailySummaries } from '@/lib/storage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number(searchParams.get('days')) || 30
    
    const dailySummaries = getDailySummaries(days)
    
    return NextResponse.json({
      summaries: dailySummaries,
      count: dailySummaries.length
    })
    
  } catch (error) {
    console.error('Daily analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to get daily analytics' },
      { status: 500 }
    )
  }
}
