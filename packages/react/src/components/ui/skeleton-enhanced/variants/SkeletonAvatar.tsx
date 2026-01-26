/**
 * Smart Skeleton Avatar Component
 */

import * as React from 'react'
import { EnhancedSkeleton } from './BaseSkeleton'
import type { EnhancedSkeletonAvatarProps } from '../types'

export const EnhancedSkeletonAvatar: React.FC<EnhancedSkeletonAvatarProps> = ({
  size = 40,
  variant = 'shimmer',
  className,
  enableTransition = true,
  responsive = true,
}) => {
  const [optimizedSize, setOptimizedSize] = React.useState(size)

  React.useEffect(() => {
    if (!responsive) return

    const optimizeSize = () => {
      const viewportWidth = window.innerWidth
      if (viewportWidth < 640) {
        setOptimizedSize(Math.min(size, 32))
      } else {
        setOptimizedSize(size)
      }
    }

    optimizeSize()
    window.addEventListener('resize', optimizeSize)
    return () => window.removeEventListener('resize', optimizeSize)
  }, [size, responsive])

  return (
    <EnhancedSkeleton
      variant={variant}
      width={optimizedSize}
      height={optimizedSize}
      rounded="full"
      enableTransition={enableTransition}
      className={className}
    />
  )
}
