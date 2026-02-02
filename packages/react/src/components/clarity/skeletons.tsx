'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

// Base Skeleton
interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />
}

// Text Shimmer (streaming text effect)
interface TextShimmerProps {
  className?: string
  lines?: number
}

export function TextShimmer({ className, lines = 3 }: TextShimmerProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 rounded bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] animate-shimmer',
            i === lines - 1 && 'w-2/3'
          )}
        />
      ))}
    </div>
  )
}

// Message Skeleton
export function MessageSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4">
      <Skeleton className="w-8 h-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <TextShimmer lines={3} />
      </div>
    </div>
  )
}

// Chat List Skeleton
export function ChatListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2">
          <Skeleton className="w-8 h-8 rounded shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Code Block Skeleton
export function CodeBlockSkeleton() {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-6 rounded" />
      </div>
      <div className="p-4 space-y-2 bg-code-bg">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}

// Tool Call Skeleton
export function ToolCallSkeleton() {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-8 h-8 rounded" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <TextShimmer lines={2} />
    </div>
  )
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-6 rounded" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-8 w-20 rounded" />
        <Skeleton className="h-8 w-20 rounded" />
      </div>
    </div>
  )
}

// Table Skeleton
export function TableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number
  columns?: number
}) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="flex items-center border-b border-border bg-muted/50 p-3">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1 px-2">
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center border-b border-border last:border-0 p-3"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1 px-2">
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// Sidebar Skeleton
export function SidebarSkeleton() {
  return (
    <div className="w-72 border-r border-border h-full">
      <div className="p-4 border-b border-border">
        <Skeleton className="h-10 w-full rounded" />
      </div>
      <div className="p-3">
        <Skeleton className="h-9 w-full rounded mb-3" />
        <ChatListSkeleton count={8} />
      </div>
    </div>
  )
}

// Full Page Skeleton
export function PageSkeleton() {
  return (
    <div className="flex h-screen bg-background">
      <SidebarSkeleton />
      <div className="flex-1 flex flex-col">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <MessageSkeleton />
          <MessageSkeleton />
          <ToolCallSkeleton />
          <MessageSkeleton />
        </div>
        <div className="border-t border-border p-4">
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Typing Indicator
export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}

// Pulse Loader
export function PulseLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-accent animate-pulse" />
      </div>
    </div>
  )
}

// Progress Loader
interface ProgressLoaderProps {
  progress: number
  label?: string
  className?: string
}

export function ProgressLoader({
  progress,
  label,
  className,
}: ProgressLoaderProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-mono">{progress}%</span>
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// Shimmer Text Effect (for streaming)
interface StreamingTextProps {
  text: string
  isStreaming?: boolean
  className?: string
}

export function StreamingText({
  text,
  isStreaming,
  className,
}: StreamingTextProps) {
  return (
    <span className={className}>
      {text}
      {isStreaming && (
        <span className="inline-block w-2 h-4 ml-0.5 bg-foreground animate-pulse" />
      )}
    </span>
  )
}

// Spinner
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  }

  return (
    <div
      className={cn(
        'rounded-full border-muted-foreground/30 border-t-foreground animate-spin',
        sizeClasses[size],
        className
      )}
    />
  )
}

// Empty State
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8',
        className
      )}
    >
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="font-semibold text-lg">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// Alias for backward compatibility
export const ShimmerText = TextShimmer
