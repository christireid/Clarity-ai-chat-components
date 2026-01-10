'use client'

import { motion, useReducedMotion } from 'framer-motion'

/**
 * Skeleton components for layout loading states
 *
 * Features:
 * - Use new skeleton animation classes for smooth 1.5s pulse
 * - Respect prefers-reduced-motion
 * - GPU-accelerated via will-change and opacity animations
 * - Match actual content layouts to prevent shift
 */

export function CardSkeleton({ className = '' }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
      className={`p-6 rounded-xl bg-bg-secondary border border-border ${className}`}
    >
      <div className="h-4 bg-bg-tertiary rounded mb-3 w-3/4 animate-skeleton-pulse motion-reduce:animate-none" />
      <div className="h-3 bg-bg-tertiary rounded mb-2 w-full animate-skeleton-pulse motion-reduce:animate-none" />
      <div className="h-3 bg-bg-tertiary rounded w-5/6 animate-skeleton-pulse motion-reduce:animate-none" />
    </motion.div>
  )
}

export function HeroSkeleton() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
      className="container-docs py-20 md:py-28"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-8 bg-bg-tertiary rounded-full animate-skeleton-pulse motion-reduce:animate-none w-48" />
          <div className="h-8 bg-bg-tertiary rounded-full animate-skeleton-pulse motion-reduce:animate-none w-24" />
        </div>

        <div className="h-16 bg-bg-tertiary rounded-lg animate-skeleton-pulse motion-reduce:animate-none mb-6 mx-auto w-3/4" />
        <div className="h-8 bg-bg-tertiary rounded-lg animate-skeleton-pulse motion-reduce:animate-none mb-8 mx-auto w-2/3" />
        <div className="h-12 bg-bg-tertiary rounded-xl animate-skeleton-pulse motion-reduce:animate-none mb-8 mx-auto w-80" />

        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="h-12 bg-bg-tertiary rounded-lg animate-skeleton-pulse motion-reduce:animate-none w-40" />
          <div className="h-12 bg-bg-tertiary rounded-lg animate-skeleton-pulse motion-reduce:animate-none w-40" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 bg-bg-tertiary rounded-xl animate-skeleton-pulse motion-reduce:animate-none"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function ComponentGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-bg-tertiary rounded animate-skeleton-pulse motion-reduce:animate-none"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  )
}

export function SidebarSkeleton() {
  return (
    <div className="w-64 p-4 space-y-4">
      <div className="h-6 bg-bg-tertiary rounded animate-skeleton-pulse motion-reduce:animate-none w-3/4" />
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-bg-tertiary rounded animate-skeleton-pulse motion-reduce:animate-none"
            style={{ animationDelay: `${i * 0.05}s` }}
          />
        ))}
      </div>
    </div>
  )
}
