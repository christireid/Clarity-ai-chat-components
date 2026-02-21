'use client'

import { ReactNode } from 'react'
import { DemoErrorBoundary } from './DemoErrorBoundary'

interface DemoLayoutWrapperProps {
  children: ReactNode
}

/**
 * Client-side wrapper for demo layout that provides error boundaries
 * Used in the demos layout to catch errors in any demo page
 */
export function DemoLayoutWrapper({ children }: DemoLayoutWrapperProps) {
  return (
    <DemoErrorBoundary>
      {children}
    </DemoErrorBoundary>
  )
}

export default DemoLayoutWrapper
