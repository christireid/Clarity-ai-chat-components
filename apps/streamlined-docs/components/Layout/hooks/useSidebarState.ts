'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { usePersistedState } from './usePersistedState'

export interface SidebarConfig {
  minWidth: number
  maxWidth: number
  defaultWidth: number
  storageKeyVisible: string
  storageKeyWidth: string
}

export interface SidebarState {
  // State
  visible: boolean
  width: number
  isResizing: boolean
  isMounted: boolean

  // Actions
  toggleVisibility: () => void
  setVisible: (visible: boolean) => void
  setWidth: (width: number) => void

  // Resize handlers
  startResize: (e: React.MouseEvent | React.TouchEvent) => void
  handleKeyboardResize: (e: React.KeyboardEvent) => void
}

const DEFAULT_CONFIG: SidebarConfig = {
  minWidth: 200,
  maxWidth: 400,
  defaultWidth: 280,
  storageKeyVisible: 'docs-sidebar-visible',
  storageKeyWidth: 'docs-sidebar-width',
}

/**
 * Comprehensive hook for managing sidebar state with:
 * - localStorage persistence
 * - SSR hydration safety
 * - Cross-tab synchronization
 * - Mouse and touch resize support
 * - Keyboard navigation
 * - requestAnimationFrame throttling
 *
 * @param config - Optional configuration overrides
 * @returns SidebarState object with state and actions
 */
export function useSidebarState(config: Partial<SidebarConfig> = {}): SidebarState {
  const {
    minWidth,
    maxWidth,
    defaultWidth,
    storageKeyVisible,
    storageKeyWidth,
  } = { ...DEFAULT_CONFIG, ...config }

  // Persisted state with SSR safety and cross-tab sync
  const [visible, setVisible, isMounted] = usePersistedState(storageKeyVisible, true)
  const [width, setWidthState, ] = usePersistedState(storageKeyWidth, defaultWidth)

  // Local state for resize interaction
  const [isResizing, setIsResizing] = useState(false)

  // Refs for resize handling
  const rafRef = useRef<number | null>(null)
  const lastWidthRef = useRef(width)

  // Clamp width to valid range
  const clampWidth = useCallback(
    (w: number) => Math.min(maxWidth, Math.max(minWidth, w)),
    [minWidth, maxWidth]
  )

  // Set width with clamping
  const setWidth = useCallback(
    (newWidth: number) => {
      const clamped = clampWidth(newWidth)
      setWidthState(clamped)
      lastWidthRef.current = clamped
    },
    [clampWidth, setWidthState]
  )

  // Toggle visibility
  const toggleVisibility = useCallback(() => {
    setVisible((v) => !v)
  }, [setVisible])

  // Start resize (mouse or touch)
  const startResize = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  // Handle keyboard resize
  const handleKeyboardResize = useCallback(
    (e: React.KeyboardEvent) => {
      const step = e.shiftKey ? 50 : 10

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setWidth(lastWidthRef.current - step)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setWidth(lastWidthRef.current + step)
      } else if (e.key === 'Home') {
        e.preventDefault()
        setWidth(minWidth)
      } else if (e.key === 'End') {
        e.preventDefault()
        setWidth(maxWidth)
      }
    },
    [setWidth, minWidth, maxWidth]
  )

  // Mouse/Touch move and up handlers with rAF throttling
  useEffect(() => {
    if (!isResizing) return

    const handleMove = (clientX: number) => {
      // Cancel any pending animation frame
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }

      // Schedule update on next animation frame
      rafRef.current = requestAnimationFrame(() => {
        const newWidth = clampWidth(clientX)
        if (newWidth !== lastWidthRef.current) {
          lastWidthRef.current = newWidth
          setWidthState(newWidth)
        }
        rafRef.current = null
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleMove(e.touches[0].clientX)
      }
    }

    const handleEnd = () => {
      setIsResizing(false)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    // Set cursor and disable selection
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'

    // Add listeners
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleEnd)
    document.addEventListener('touchcancel', handleEnd)

    return () => {
      // Restore cursor and selection
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''

      // Remove listeners
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleEnd)
      document.removeEventListener('touchcancel', handleEnd)

      // Cancel any pending animation frame
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isResizing, clampWidth, setWidthState])

  // Keyboard shortcut: Cmd/Ctrl + B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        toggleVisibility()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleVisibility])

  return {
    visible,
    width,
    isResizing,
    isMounted,
    toggleVisibility,
    setVisible,
    setWidth,
    startResize,
    handleKeyboardResize,
  }
}
