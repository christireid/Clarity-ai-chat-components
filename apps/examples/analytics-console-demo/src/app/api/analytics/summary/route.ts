/**
 * Analytics Summary API
 * GET: Get aggregate statistics
 */

import { NextResponse } from 'next/server'
import { getSummaryStats } from '@/lib/storage'

export async function GET() {
  try {
    const stats = getSummaryStats()
    
    return NextResponse.json(stats)
    
  } catch (error) {
    console.error('Analytics summary error:', error)
    return NextResponse.json(
      { error: 'Failed to get summary' },
      { status: 500 }
    )
  }
}
