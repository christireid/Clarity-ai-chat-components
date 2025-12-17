/**
 * Recent Analytics API
 * GET: Get recent entries
 */

import { NextRequest, NextResponse } from 'next/server'
import { getEntries } from '@/lib/storage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get('limit')) || 50
    
    const entries = getEntries(limit)
    
    return NextResponse.json({
      entries,
      count: entries.length
    })
    
  } catch (error) {
    console.error('Recent analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to get recent entries' },
      { status: 500 }
    )
  }
}
