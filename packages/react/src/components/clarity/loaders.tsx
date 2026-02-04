'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Loader2, Bot, Sparkles, Brain, Cpu, Zap } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export type LoaderVariant =
  | 'spinner'
  | 'dots'
  | 'pulse'
  | 'shimmer'
  | 'bounce'
  | 'wave'
  | 'bars'
  | 'ring'
  | 'ai'
  | 'brain'
  | 'thinking'

export type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// ============================================================================
// BASE LOADER
// ============================================================================

export interface LoaderProps {
  variant?: LoaderVariant
  size?: LoaderSize
  text?: string
  textPosition?: 'top' | 'bottom' | 'left' | 'right'
  color?: string
  className?: string
  textClassName?: string
}

const sizeMap: Record<
  LoaderSize,
  { icon: string; text: string; container: string }
> = {
  xs: { icon: 'w-3 h-3', text: 'text-xs', container: 'gap-1' },
  sm: { icon: 'w-4 h-4', text: 'text-sm', container: 'gap-1.5' },
  md: { icon: 'w-5 h-5', text: 'text-sm', container: 'gap-2' },
  lg: { icon: 'w-6 h-6', text: 'text-base', container: 'gap-2' },
  xl: { icon: 'w-8 h-8', text: 'text-lg', container: 'gap-3' },
}

export function Loader({
  variant = 'spinner',
  size = 'md',
  text,
  textPosition = 'right',
  color,
  className,
  textClassName,
}: LoaderProps) {
  const sizes = sizeMap[size]

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <SpinnerLoader size={size} color={color} />
      case 'dots':
        return <DotsLoader size={size} color={color} />
      case 'pulse':
        return <PulseLoader size={size} color={color} />
      case 'shimmer':
        return <ShimmerLoader size={size} text={text} />
      case 'bounce':
        return <BounceLoader size={size} color={color} />
      case 'wave':
        return <WaveLoader size={size} color={color} />
      case 'bars':
        return <BarsLoader size={size} color={color} />
      case 'ring':
        return <RingLoader size={size} color={color} />
      case 'ai':
        return <AILoader size={size} color={color} />
      case 'brain':
        return <BrainLoader size={size} color={color} />
      case 'thinking':
        return <ThinkingLoader size={size} color={color} />
      default:
        return <SpinnerLoader size={size} color={color} />
    }
  }

  // Shimmer variant handles its own text
  if (variant === 'shimmer') {
    return renderLoader()
  }

  const isVertical = textPosition === 'top' || textPosition === 'bottom'

  return (
    <div
      className={cn(
        'inline-flex items-center',
        isVertical ? 'flex-col' : 'flex-row',
        textPosition === 'top' || textPosition === 'left'
          ? 'flex-col-reverse'
          : '',
        textPosition === 'left' && 'flex-row-reverse',
        sizes.container,
        className
      )}
    >
      {renderLoader()}
      {text && variant !== 'shimmer' && (
        <span
          className={cn('text-muted-foreground', sizes.text, textClassName)}
        >
          {text}
        </span>
      )}
    </div>
  )
}

// ============================================================================
// SPINNER LOADER
// ============================================================================

interface BaseLoaderProps {
  size: LoaderSize
  color?: string
}

function SpinnerLoader({ size, color }: BaseLoaderProps) {
  const sizes = sizeMap[size]
  return (
    <Loader2 className={cn(sizes.icon, 'animate-spin')} style={{ color }} />
  )
}

// ============================================================================
// DOTS LOADER
// ============================================================================

function DotsLoader({ size, color }: BaseLoaderProps) {
  const dotSizes: Record<LoaderSize, string> = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
    xl: 'w-3 h-3',
  }

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            dotSizes[size],
            'rounded-full bg-current animate-bounce'
          )}
          style={{
            color: color || 'currentColor',
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// PULSE LOADER
// ============================================================================

function PulseLoader({ size, color }: BaseLoaderProps) {
  const sizes = sizeMap[size]
  return (
    <span
      className={cn(sizes.icon, 'rounded-full bg-current animate-pulse')}
      style={{ color: color || 'currentColor' }}
    />
  )
}

// ============================================================================
// SHIMMER LOADER
// ============================================================================

interface ShimmerLoaderProps {
  size: LoaderSize
  text?: string
}

function ShimmerLoader({ size, text = 'Loading...' }: ShimmerLoaderProps) {
  const sizes = sizeMap[size]
  return (
    <span
      className={cn(
        sizes.text,
        'inline-block bg-clip-text text-transparent',
        'bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground',
        'bg-[length:200%_100%] animate-shimmer'
      )}
    >
      {text}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }
      `}</style>
    </span>
  )
}

// ============================================================================
// BOUNCE LOADER
// ============================================================================

function BounceLoader({ size, color }: BaseLoaderProps) {
  const dotSizes: Record<LoaderSize, string> = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  }

  return (
    <div className="flex items-end gap-0.5 h-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(dotSizes[size], 'rounded-full bg-current')}
          style={{
            color: color || 'currentColor',
            animation: 'bounce-loader 0.6s ease-in-out infinite',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes bounce-loader {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// WAVE LOADER
// ============================================================================

function WaveLoader({ size, color }: BaseLoaderProps) {
  const barSizes: Record<LoaderSize, { width: string; height: string }> = {
    xs: { width: 'w-0.5', height: 'h-3' },
    sm: { width: 'w-1', height: 'h-4' },
    md: { width: 'w-1', height: 'h-5' },
    lg: { width: 'w-1.5', height: 'h-6' },
    xl: { width: 'w-2', height: 'h-8' },
  }

  const barSize = barSizes[size]

  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn(
            barSize.width,
            barSize.height,
            'rounded-full bg-current'
          )}
          style={{
            color: color || 'currentColor',
            animation: 'wave 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes wave {
          0%,
          40%,
          100% {
            transform: scaleY(0.4);
          }
          20% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// BARS LOADER
// ============================================================================

function BarsLoader({ size, color }: BaseLoaderProps) {
  const barSizes: Record<LoaderSize, { width: string; height: string }> = {
    xs: { width: 'w-1', height: 'h-2' },
    sm: { width: 'w-1', height: 'h-3' },
    md: { width: 'w-1.5', height: 'h-4' },
    lg: { width: 'w-2', height: 'h-5' },
    xl: { width: 'w-2.5', height: 'h-6' },
  }

  const barSize = barSizes[size]

  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(barSize.width, barSize.height, 'rounded-sm bg-current')}
          style={{
            color: color || 'currentColor',
            animation: 'bars 1s ease-in-out infinite',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes bars {
          0%,
          100% {
            opacity: 0.3;
            transform: scaleY(0.6);
          }
          50% {
            opacity: 1;
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// RING LOADER
// ============================================================================

function RingLoader({ size, color }: BaseLoaderProps) {
  const sizes = sizeMap[size]
  return (
    <div
      className={cn(sizes.icon, 'relative')}
      style={{ color: color || 'currentColor' }}
    >
      <span className="absolute inset-0 rounded-full border-2 border-current opacity-20" />
      <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-current animate-spin" />
    </div>
  )
}

// ============================================================================
// AI LOADER
// ============================================================================

function AILoader({ size, color }: BaseLoaderProps) {
  const sizes = sizeMap[size]
  return (
    <div className="relative">
      <Sparkles
        className={cn(sizes.icon, 'animate-pulse')}
        style={{ color: color || 'currentColor' }}
      />
      <span
        className={cn('absolute inset-0 rounded-full animate-ping opacity-30')}
        style={{ backgroundColor: color || 'currentColor' }}
      />
    </div>
  )
}

// ============================================================================
// BRAIN LOADER
// ============================================================================

function BrainLoader({ size, color }: BaseLoaderProps) {
  const sizes = sizeMap[size]
  return (
    <Brain
      className={cn(sizes.icon, 'animate-pulse')}
      style={{ color: color || 'currentColor' }}
    />
  )
}

// ============================================================================
// THINKING LOADER - Multi-element thinking animation
// ============================================================================

function ThinkingLoader({ size, color }: BaseLoaderProps) {
  const dotSizes: Record<LoaderSize, string> = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
    xl: 'w-3 h-3',
  }

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(dotSizes[size], 'rounded-full bg-current')}
          style={{
            color: color || 'currentColor',
            animation: 'thinking 1.4s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes thinking {
          0%,
          80%,
          100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// SKELETON LOADER
// ============================================================================

export interface SkeletonLoaderProps {
  lines?: number
  width?: string | string[]
  height?: string
  animated?: boolean
  className?: string
}

export function SkeletonLoader({
  lines = 3,
  width = '100%',
  height = '1rem',
  animated = true,
  className,
}: SkeletonLoaderProps) {
  const widths = Array.isArray(width) ? width : Array(lines).fill(width)

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn('bg-muted rounded', animated && 'animate-pulse')}
          style={{
            width: widths[i] || widths[0],
            height,
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// MESSAGE LOADING INDICATOR
// ============================================================================

export interface MessageLoadingProps {
  variant?: 'dots' | 'text' | 'avatar'
  text?: string
  avatar?: React.ReactNode
  className?: string
}

export function MessageLoading({
  variant = 'dots',
  text = 'AI is thinking',
  avatar,
  className,
}: MessageLoadingProps) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      {avatar && <div className="flex-shrink-0">{avatar}</div>}
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-muted">
        {variant === 'dots' && <DotsLoader size="sm" />}
        {variant === 'text' && (
          <span className="text-sm text-muted-foreground animate-pulse">
            {text}...
          </span>
        )}
        {variant === 'avatar' && (
          <>
            <Bot className="w-4 h-4 text-muted-foreground animate-pulse" />
            <span className="text-sm text-muted-foreground">{text}</span>
            <DotsLoader size="xs" />
          </>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// PROGRESS LOADER
// ============================================================================

export interface ProgressLoaderProps {
  progress?: number
  indeterminate?: boolean
  text?: string
  showPercentage?: boolean
  size?: LoaderSize
  color?: string
  className?: string
}

export function ProgressLoader({
  progress = 0,
  indeterminate = false,
  text,
  showPercentage = false,
  size = 'md',
  color,
  className,
}: ProgressLoaderProps) {
  const heights: Record<LoaderSize, string> = {
    xs: 'h-0.5',
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2',
    xl: 'h-3',
  }

  return (
    <div className={cn('w-full space-y-1', className)}>
      {(text || showPercentage) && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{text}</span>
          {showPercentage && !indeterminate && (
            <span>{Math.round(progress)}%</span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-muted rounded-full overflow-hidden',
          heights[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            indeterminate && 'animate-indeterminate'
          )}
          style={{
            width: indeterminate ? '30%' : `${progress}%`,
            backgroundColor: color || 'hsl(var(--primary))',
          }}
        />
      </div>
      {indeterminate && (
        <style jsx>{`
          @keyframes indeterminate {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(400%);
            }
          }
          .animate-indeterminate {
            animation: indeterminate 1.5s ease-in-out infinite;
          }
        `}</style>
      )}
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export default Loader
