'use client'

import { motion } from 'framer-motion'

export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-6 rounded-xl bg-bg-secondary border border-border animate-pulse ${className}`}
    >
      <div className="h-4 bg-bg-tertiary rounded mb-3 w-3/4" />
      <div className="h-3 bg-bg-tertiary rounded mb-2 w-full" />
      <div className="h-3 bg-bg-tertiary rounded w-5/6" />
    </motion.div>
  )
}

export function HeroSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container-docs py-20 md:py-28"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-8 bg-bg-tertiary rounded-full animate-pulse w-48" />
          <div className="h-8 bg-bg-tertiary rounded-full animate-pulse w-24" />
        </div>

        <div className="h-16 bg-bg-tertiary rounded-lg animate-pulse mb-6 mx-auto w-3/4" />
        <div className="h-8 bg-bg-tertiary rounded-lg animate-pulse mb-8 mx-auto w-2/3" />
        <div className="h-12 bg-bg-tertiary rounded-xl animate-pulse mb-8 mx-auto w-80" />

        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="h-12 bg-bg-tertiary rounded-lg animate-pulse w-40" />
          <div className="h-12 bg-bg-tertiary rounded-lg animate-pulse w-40" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 bg-bg-tertiary rounded-xl animate-pulse"
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
        <div key={i} className="h-4 bg-bg-tertiary rounded animate-pulse" />
      ))}
    </div>
  )
}

export function SidebarSkeleton() {
  return (
    <div className="w-64 p-4 space-y-4">
      <div className="h-6 bg-bg-tertiary rounded animate-pulse w-3/4" />
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 bg-bg-tertiary rounded animate-pulse" />
        ))}
      </div>
    </div>
  )
}
