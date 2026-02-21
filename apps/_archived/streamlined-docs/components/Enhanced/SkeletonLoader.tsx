'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'avatar' | 'button' | 'image' | 'code' | 'nav'
  className?: string
  count?: number
  height?: string
  width?: string
  rounded?: boolean
}

export function SkeletonLoader({
  variant = 'text',
  className,
  count = 1,
  height,
  width,
  rounded = false,
}: SkeletonLoaderProps) {
  const baseClasses = cn(
    'animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800',
    'bg-[length:200%_100%]',
    rounded ? 'rounded-full' : 'rounded-lg'
  )

  const variants = {
    text: 'h-4 w-full',
    card: 'h-32 w-full',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24',
    image: 'h-48 w-full',
    code: 'h-64 w-full rounded-xl',
    nav: 'h-12 w-full',
  }

  const variantClass = variants[variant]

  const items = Array.from({ length: count }, (_, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: i * 0.05 }}
      className={cn(baseClasses, variantClass, className)}
      style={{
        height: height || undefined,
        width: width || undefined,
        animation: `shimmer 2s ease-in-out infinite ${i * 0.1}s`,
      }}
    />
  ))

  return count > 1 ? (
    <div className="space-y-3">{items}</div>
  ) : (
    items[0]
  )
}

// Shimmer animation keyframes
export function SkeletonStyles() {
  return (
    <style jsx global>{`
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
    `}</style>
  )
}

// Pre-built skeleton patterns for common use cases
export function ComponentCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonLoader variant="avatar" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader width="60%" height="16px" />
          <SkeletonLoader width="40%" height="12px" />
        </div>
      </div>
      <SkeletonLoader variant="text" count={3} />
      <div className="flex gap-2">
        <SkeletonLoader variant="button" />
        <SkeletonLoader variant="button" />
      </div>
    </div>
  )
}

export function SearchResultSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-lg"
        >
          <SkeletonLoader variant="avatar" width="32px" height="32px" />
          <div className="flex-1 space-y-2">
            <SkeletonLoader width="70%" height="16px" />
            <SkeletonLoader width="50%" height="12px" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function CodeBlockSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <SkeletonLoader width="120px" height="12px" />
        <SkeletonLoader variant="button" width="80px" height="32px" />
      </div>
      {/* Code lines */}
      <div className="p-4 space-y-2 bg-neutral-50 dark:bg-neutral-950">
        <SkeletonLoader width="90%" height="14px" />
        <SkeletonLoader width="75%" height="14px" />
        <SkeletonLoader width="85%" height="14px" />
        <SkeletonLoader width="60%" height="14px" />
        <SkeletonLoader width="80%" height="14px" />
      </div>
    </div>
  )
}

export function NavigationSkeleton() {
  return (
    <div className="space-y-1 p-4">
      <SkeletonLoader variant="nav" height="40px" />
      <SkeletonLoader variant="nav" height="40px" />
      <SkeletonLoader variant="nav" height="40px" />
      <div className="ml-4 space-y-1 mt-2">
        <SkeletonLoader variant="text" width="80%" height="32px" />
        <SkeletonLoader variant="text" width="70%" height="32px" />
      </div>
      <SkeletonLoader variant="nav" height="40px" />
      <SkeletonLoader variant="nav" height="40px" />
    </div>
  )
}
