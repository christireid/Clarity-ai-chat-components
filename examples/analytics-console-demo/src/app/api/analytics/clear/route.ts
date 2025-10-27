/**
 * Clear Analytics API
 * DELETE: Clear all analytics data (dev only)
 */

import { NextResponse } from 'next/server'
import { clearAllEntries } from '@/lib/storage'

export async function DELETE() {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Not allowed in production' },
        { status: 403 }
      )
    }
    
    clearAllEntries()
    
    return NextResponse.json({
      success: true,
      message: 'All analytics data cleared'
    })
    
  } catch (error) {
    console.error('Clear analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to clear analytics' },
      { status: 500 }
    )
  }
}
