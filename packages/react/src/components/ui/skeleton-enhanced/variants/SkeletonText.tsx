/**
 * Responsive Skeleton Text Component
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { EnhancedSkeleton } from './BaseSkeleton'
import type { EnhancedSkeletonTextProps } from '../types'

export const EnhancedSkeletonText: React.FC<EnhancedSkeletonTextProps> = ({
  lines = 3,
  lineHeight = 16,
  gap = 8,
  lastLineWidth = 70,
  variant = 'shimmer',
  className,
  enableTransition = true,
  responsive = true,
}) => {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const effectiveLines = responsive && isMobile ? Math.min(lines, 2) : lines

  return (
    <div className={cn('space-y-2.5', className)} style={{ gap: `${gap}px` }}>
      {Array.from({ length: effectiveLines }).map((_, index) => (
        <EnhancedSkeleton
          key={index}
          variant={variant}
          height={lineHeight}
          width={index === effectiveLines - 1 ? `${lastLineWidth}%` : '100%'}
          rounded="sm"
          enableTransition={enableTransition}
        />
      ))}
    </div>
  )
}
