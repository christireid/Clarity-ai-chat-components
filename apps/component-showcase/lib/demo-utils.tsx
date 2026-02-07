'use client'

import { useRef, useEffect, useCallback } from 'react'
import { Key } from 'lucide-react'

/**
 * Shared demo utilities — used across streaming/chat/hooks demos
 * to eliminate duplicated patterns.
 */

// ---------------------------------------------------------------------------
// useAbortController — manages AbortController ref with cleanup on unmount
// ---------------------------------------------------------------------------

export function useAbortController() {
  const ref = useRef<AbortController | null>(null)

  const abort = useCallback(() => {
    ref.current?.abort()
    ref.current = null
  }, [])

  const create = useCallback(() => {
    ref.current?.abort()
    const controller = new AbortController()
    ref.current = controller
    return controller
  }, [])

  useEffect(() => {
    return () => {
      ref.current?.abort()
    }
  }, [])

  return { ref, abort, create }
}

// ---------------------------------------------------------------------------
// StreamingCursor — the blinking cursor shown during streaming
// ---------------------------------------------------------------------------

export function StreamingCursor({ height = 'h-3' }: { height?: string }) {
  return (
    <span
      className={`inline-block w-0.5 ${height} bg-foreground animate-pulse ml-0.5`}
      aria-hidden="true"
    />
  )
}

// ---------------------------------------------------------------------------
// ApiKeyRequired — placeholder UI when no API key is set
// ---------------------------------------------------------------------------

export function ApiKeyRequired({
  message = 'Set your API key to enable this demo.',
  className = 'py-6',
}: {
  message?: string
  className?: string
}) {
  return (
    <div className={`text-center text-muted-foreground ${className}`}>
      <Key className="h-6 w-6 mx-auto mb-2 opacity-50" />
      <p className="text-xs">{message}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// STATUS_STYLES — consistent status-to-color mapping
// ---------------------------------------------------------------------------

export const STATUS_STYLES = {
  idle: 'bg-gray-500/20 text-gray-600',
  connecting: 'bg-amber-500/20 text-amber-600',
  streaming: 'bg-green-500/20 text-green-600',
  retrying: 'bg-yellow-500/20 text-yellow-600',
  success: 'bg-green-500/20 text-green-600',
  complete: 'bg-green-500/20 text-green-600',
  error: 'bg-red-500/20 text-red-600',
  failed: 'bg-red-500/20 text-red-600',
  pending: 'bg-gray-500/20 text-gray-600',
  running: 'bg-yellow-500/10 border-yellow-500/20',
  completed: 'bg-green-500/10 border-green-500/20',
} as const

// ---------------------------------------------------------------------------
// AI_AVATAR_CLASSES — consistent AI avatar gradient
// ---------------------------------------------------------------------------

export const AI_AVATAR_CLASSES =
  'bg-gradient-to-br from-violet-500 to-purple-600'
