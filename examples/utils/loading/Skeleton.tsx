'use client'

/**
 * Loading Skeleton Components
 *
 * A collection of skeleton loading components for chat applications.
 * Provides visual feedback during content loading.
 */

import { type ReactNode } from 'react'

// ============================================================================
// Base Skeleton
// ============================================================================

export interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  animate?: boolean
}

export function Skeleton({
  className = '',
  width,
  height,
  rounded = 'md',
  animate = true,
}: SkeletonProps) {
  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[rounded]

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`bg-muted ${roundedClass} ${animate ? 'animate-pulse' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}

// ============================================================================
// Text Skeleton
// ============================================================================

export interface TextSkeletonProps {
  lines?: number
  className?: string
  lastLineWidth?: string
}

export function TextSkeleton({
  lines = 3,
  className = '',
  lastLineWidth = '60%',
}: TextSkeletonProps) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={16}
          width={i === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  )
}

// ============================================================================
// Message Skeleton
// ============================================================================

export interface MessageSkeletonProps {
  isUser?: boolean
  className?: string
}

export function MessageSkeleton({
  isUser = false,
  className = '',
}: MessageSkeletonProps) {
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`}
      aria-hidden="true"
    >
      <div
        className={`max-w-[80%] p-4 ${isUser ? 'rounded-2xl rounded-br-md bg-primary/20' : 'rounded-2xl rounded-bl-md bg-muted'}`}
      >
        <div className="space-y-2">
          <Skeleton height={14} width={isUser ? 120 : 200} />
          <Skeleton height={14} width={isUser ? 80 : 160} />
          {!isUser && <Skeleton height={14} width={100} />}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Chat Skeleton
// ============================================================================

export interface ChatSkeletonProps {
  messageCount?: number
  className?: string
}

export function ChatSkeleton({
  messageCount = 4,
  className = '',
}: ChatSkeletonProps) {
  return (
    <div
      className={`space-y-4 ${className}`}
      role="status"
      aria-label="Loading chat"
    >
      {Array.from({ length: messageCount }).map((_, i) => (
        <MessageSkeleton key={i} isUser={i % 2 === 0} />
      ))}
      <span className="sr-only">Loading messages...</span>
    </div>
  )
}

// ============================================================================
// Avatar Skeleton
// ============================================================================

export interface AvatarSkeletonProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AvatarSkeleton({
  size = 'md',
  className = '',
}: AvatarSkeletonProps) {
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
  }

  return (
    <Skeleton
      width={sizeMap[size]}
      height={sizeMap[size]}
      rounded="full"
      className={className}
    />
  )
}

// ============================================================================
// Input Skeleton
// ============================================================================

export interface InputSkeletonProps {
  className?: string
  showButton?: boolean
}

export function InputSkeleton({
  className = '',
  showButton = true,
}: InputSkeletonProps) {
  return (
    <div className={`flex gap-2 ${className}`} aria-hidden="true">
      <Skeleton height={48} className="flex-1" rounded="lg" />
      {showButton && <Skeleton width={80} height={48} rounded="lg" />}
    </div>
  )
}

// ============================================================================
// Card Skeleton
// ============================================================================

export interface CardSkeletonProps {
  className?: string
  showHeader?: boolean
  showFooter?: boolean
}

export function CardSkeleton({
  className = '',
  showHeader = true,
  showFooter = false,
}: CardSkeletonProps) {
  return (
    <div className={`border rounded-lg p-4 ${className}`} aria-hidden="true">
      {showHeader && (
        <div className="flex items-center gap-3 mb-4">
          <AvatarSkeleton size="sm" />
          <div className="space-y-1">
            <Skeleton height={14} width={120} />
            <Skeleton height={12} width={80} />
          </div>
        </div>
      )}
      <TextSkeleton lines={2} />
      {showFooter && (
        <div className="flex justify-end gap-2 mt-4">
          <Skeleton width={60} height={32} rounded="md" />
          <Skeleton width={60} height={32} rounded="md" />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Full Page Chat Skeleton
// ============================================================================

export interface FullChatSkeletonProps {
  className?: string
}

export function FullChatSkeleton({ className = '' }: FullChatSkeletonProps) {
  return (
    <div
      className={`flex flex-col h-screen max-w-3xl mx-auto ${className}`}
      role="status"
      aria-label="Loading chat interface"
    >
      {/* Header skeleton */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="space-y-1">
          <Skeleton height={24} width={150} />
          <Skeleton height={14} width={100} />
        </div>
        <Skeleton width={80} height={32} rounded="md" />
      </div>

      {/* Messages skeleton */}
      <div className="flex-1 overflow-hidden p-4">
        <ChatSkeleton messageCount={4} />
      </div>

      {/* Input skeleton */}
      <div className="p-4 border-t">
        <InputSkeleton />
      </div>

      <span className="sr-only">Loading chat interface...</span>
    </div>
  )
}

// ============================================================================
// Skeleton Container (with fade animation)
// ============================================================================

export interface SkeletonContainerProps {
  loading: boolean
  skeleton: ReactNode
  children: ReactNode
  className?: string
  fadeIn?: boolean
}

export function SkeletonContainer({
  loading,
  skeleton,
  children,
  className = '',
  fadeIn = true,
}: SkeletonContainerProps) {
  if (loading) {
    return <>{skeleton}</>
  }

  if (fadeIn) {
    return <div className={`animate-fade-in ${className}`}>{children}</div>
  }

  return <>{children}</>
}

// ============================================================================
// Exports
// ============================================================================

export default Skeleton
