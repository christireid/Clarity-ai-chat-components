'use client'

import { useState, useEffect } from 'react'

interface ViewportSize {
  width: number
  height: number
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  orientation: 'portrait' | 'landscape'
  deviceType: 'mobile' | 'tablet' | 'desktop'
}

const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export function useViewportSize(): ViewportSize {
  const [viewport, setViewport] = useState<ViewportSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    breakpoint: 'xl',
    orientation: 'landscape',
    deviceType: 'desktop',
  })

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      // Determine breakpoint
      let breakpoint: ViewportSize['breakpoint'] = 'xs'
      if (width >= BREAKPOINTS['2xl']) breakpoint = '2xl'
      else if (width >= BREAKPOINTS.xl) breakpoint = 'xl'
      else if (width >= BREAKPOINTS.lg) breakpoint = 'lg'
      else if (width >= BREAKPOINTS.md) breakpoint = 'md'
      else if (width >= BREAKPOINTS.sm) breakpoint = 'sm'

      // Determine orientation
      const orientation: ViewportSize['orientation'] = width > height ? 'landscape' : 'portrait'

      // Determine device type
      let deviceType: ViewportSize['deviceType'] = 'desktop'
      if (width < BREAKPOINTS.md) deviceType = 'mobile'
      else if (width < BREAKPOINTS.lg) deviceType = 'tablet'

      setViewport({
        width,
        height,
        breakpoint,
        orientation,
        deviceType,
      })
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)
    window.addEventListener('orientationchange', updateViewport)

    return () => {
      window.removeEventListener('resize', updateViewport)
      window.removeEventListener('orientationchange', updateViewport)
    }
  }, [])

  return viewport
}
