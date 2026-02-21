'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface DemoContainerProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
}

/**
 * DemoContainer - Wrapper for live component demos
 *
 * Provides a consistent container for showcasing live components
 * in documentation pages with optional title and description.
 */
export function DemoContainer({
  children,
  className,
  title,
  description,
}: DemoContainerProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border/50 bg-card overflow-hidden',
        className
      )}
    >
      {(title || description) && (
        <div className="px-6 py-4 border-b border-border/50 bg-muted/30">
          {title && (
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

DemoContainer.displayName = 'DemoContainer'
