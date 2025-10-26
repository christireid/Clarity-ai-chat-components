/**
 * Skeleton Loaders
 * 
 * Loading placeholder components with shimmer animation effect.
 * Used to show content structure while data is loading.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { createPulseAnimation, createShimmerAnimation } from '../animations/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Animation type */
  variant?: 'pulse' | 'shimmer' | 'none'
  /** Width of skeleton (CSS value) */
  width?: string | number
  /** Height of skeleton (CSS value) */
  height?: string | number
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

/**
 * Base skeleton component with loading animation
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'shimmer',
  width,
  height,
  rounded = 'md',
  className,
  style,
  ...props
}) => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }

  // Shimmer gradient background
  const shimmerStyle = variant === 'shimmer' ? {
    backgroundImage: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    backgroundSize: '200% 100%',
  } : {}

  const animation = variant === 'pulse' 
    ? createPulseAnimation()
    : variant === 'shimmer'
    ? createShimmerAnimation()
    : undefined

  const Component = variant !== 'none' ? motion.div : 'div'

  return (
    <Component
      className={cn(
        'bg-muted',
        roundedClasses[rounded],
        className
      )}
      style={{
        width,
        height,
        ...shimmerStyle,
        ...style,
      }}
      {...(animation && { variants: animation, animate: 'animate' })}
      {...props}
    />
  )
}

/**
 * Skeleton for text content
 */
export interface SkeletonTextProps {
  /** Number of lines */
  lines?: number
  /** Line height in pixels */
  lineHeight?: number
  /** Gap between lines in pixels */
  gap?: number
  /** Last line width percentage */
  lastLineWidth?: number
  /** Animation variant */
  variant?: 'pulse' | 'shimmer' | 'none'
  className?: string
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  lineHeight = 16,
  gap = 8,
  lastLineWidth = 70,
  variant = 'shimmer',
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)} style={{ gap: `${gap}px` }}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          height={lineHeight}
          width={index === lines - 1 ? `${lastLineWidth}%` : '100%'}
          rounded="sm"
        />
      ))}
    </div>
  )
}

/**
 * Skeleton for avatar/profile picture
 */
export interface SkeletonAvatarProps {
  /** Size in pixels */
  size?: number
  /** Animation variant */
  variant?: 'pulse' | 'shimmer' | 'none'
  className?: string
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 40,
  variant = 'shimmer',
  className,
}) => {
  return (
    <Skeleton
      variant={variant}
      width={size}
      height={size}
      rounded="full"
      className={className}
    />
  )
}

/**
 * Skeleton for message bubble
 */
export interface SkeletonMessageProps {
  /** Message role - affects alignment and styling */
  role?: 'user' | 'assistant'
  /** Show avatar */
  showAvatar?: boolean
  /** Number of text lines */
  lines?: number
  /** Animation variant */
  variant?: 'pulse' | 'shimmer' | 'none'
  className?: string
}

export const SkeletonMessage: React.FC<SkeletonMessageProps> = ({
  role = 'assistant',
  showAvatar = true,
  lines = 3,
  variant = 'shimmer',
  className,
}) => {
  const isUser = role === 'user'

  return (
    <div
      className={cn(
        'flex gap-3 p-4',
        isUser && 'flex-row-reverse',
        className
      )}
    >
      {showAvatar && <SkeletonAvatar size={32} variant={variant} />}
      
      <div className={cn('flex-1', isUser && 'flex justify-end')}>
        <div className={cn('max-w-[80%]', isUser && 'items-end')}>
          <SkeletonText
            lines={lines}
            variant={variant}
            lastLineWidth={60}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton for card component
 */
export interface SkeletonCardProps {
  /** Show image placeholder */
  showImage?: boolean
  /** Image height in pixels */
  imageHeight?: number
  /** Show header (title) */
  showHeader?: boolean
  /** Number of body text lines */
  bodyLines?: number
  /** Show footer actions */
  showFooter?: boolean
  /** Animation variant */
  variant?: 'pulse' | 'shimmer' | 'none'
  className?: string
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showImage = true,
  imageHeight = 200,
  showHeader = true,
  bodyLines = 3,
  showFooter = true,
  variant = 'shimmer',
  className,
}) => {
  return (
    <div className={cn('rounded-lg border bg-card overflow-hidden', className)}>
      {/* Image */}
      {showImage && (
        <Skeleton variant={variant} height={imageHeight} rounded="none" />
      )}

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Header */}
        {showHeader && (
          <div className="space-y-2">
            <Skeleton variant={variant} width="60%" height={24} rounded="sm" />
            <Skeleton variant={variant} width="40%" height={16} rounded="sm" />
          </div>
        )}

        {/* Body */}
        <SkeletonText lines={bodyLines} variant={variant} />

        {/* Footer */}
        {showFooter && (
          <div className="flex gap-2 pt-2">
            <Skeleton variant={variant} width={80} height={36} rounded="md" />
            <Skeleton variant={variant} width={80} height={36} rounded="md" />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Skeleton for list items
 */
export interface SkeletonListProps {
  /** Number of items */
  count?: number
  /** Show avatar in each item */
  showAvatar?: boolean
  /** Number of text lines per item */
  lines?: number
  /** Animation variant */
  variant?: 'pulse' | 'shimmer' | 'none'
  className?: string
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 3,
  showAvatar = true,
  lines = 2,
  variant = 'shimmer',
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-3 items-start">
          {showAvatar && <SkeletonAvatar size={40} variant={variant} />}
          <div className="flex-1">
            <SkeletonText lines={lines} variant={variant} lastLineWidth={80} />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton for button
 */
export interface SkeletonButtonProps {
  /** Button width */
  width?: number | string
  /** Button height */
  height?: number
  /** Animation variant */
  variant?: 'pulse' | 'shimmer' | 'none'
  className?: string
}

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  width = 100,
  height = 40,
  variant = 'shimmer',
  className,
}) => {
  return (
    <Skeleton
      variant={variant}
      width={width}
      height={height}
      rounded="md"
      className={className}
    />
  )
}

/**
 * Skeleton for input field
 */
export interface SkeletonInputProps {
  /** Input width */
  width?: number | string
  /** Input height */
  height?: number
  /** Show label */
  showLabel?: boolean
  /** Animation variant */
  variant?: 'pulse' | 'shimmer' | 'none'
  className?: string
}

export const SkeletonInput: React.FC<SkeletonInputProps> = ({
  width = '100%',
  height = 40,
  showLabel = true,
  variant = 'shimmer',
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <Skeleton variant={variant} width="30%" height={16} rounded="sm" />
      )}
      <Skeleton variant={variant} width={width} height={height} rounded="md" />
    </div>
  )
}

/**
 * Skeleton for chat window
 */
export const SkeletonChatWindow: React.FC<{ variant?: 'pulse' | 'shimmer' | 'none' }> = ({
  variant = 'shimmer',
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <SkeletonAvatar size={40} variant={variant} />
        <div className="flex-1">
          <Skeleton variant={variant} width="40%" height={20} rounded="sm" />
          <Skeleton variant={variant} width="60%" height={14} rounded="sm" className="mt-2" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden p-4 space-y-4">
        <SkeletonMessage role="user" lines={2} variant={variant} />
        <SkeletonMessage role="assistant" lines={4} variant={variant} />
        <SkeletonMessage role="user" lines={1} variant={variant} />
        <SkeletonMessage role="assistant" lines={3} variant={variant} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Skeleton variant={variant} height={40} className="flex-1" rounded="md" />
          <Skeleton variant={variant} width={40} height={40} rounded="md" />
        </div>
      </div>
    </div>
  )
}
