'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

// ============================================================================
// ANIMATED GRADIENT BACKGROUND - Smooth morphing gradient
// ============================================================================

interface AnimatedGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  colors?: string[]
  speed?: 'slow' | 'normal' | 'fast'
  direction?: 'diagonal' | 'horizontal' | 'vertical' | 'radial'
  blur?: boolean
}

export function AnimatedGradient({
  className,
  children,
  colors = ['#7c3aed', '#06b6d4', '#f472b6', '#22c55e'],
  speed = 'normal',
  direction = 'diagonal',
  blur = false,
  ...props
}: AnimatedGradientProps) {
  const speedMap = { slow: '15s', normal: '8s', fast: '4s' }

  const getGradient = () => {
    const colorStops = colors.join(', ')
    switch (direction) {
      case 'horizontal':
        return `linear-gradient(90deg, ${colorStops})`
      case 'vertical':
        return `linear-gradient(180deg, ${colorStops})`
      case 'radial':
        return `radial-gradient(ellipse at center, ${colorStops})`
      default:
        return `linear-gradient(45deg, ${colorStops})`
    }
  }

  return (
    <div className={cn('relative overflow-hidden', className)} {...props}>
      <div
        className="absolute inset-0"
        style={{
          background: getGradient(),
          backgroundSize: direction === 'radial' ? '200% 200%' : '400% 400%',
          animation: `gradient-shift ${speedMap[speed]} ease infinite`,
          filter: blur ? 'blur(100px)' : 'none',
        }}
      />
      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// MESH GRADIENT - Multi-point animated mesh gradient
// ============================================================================

interface MeshGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  colors?: string[]
  speed?: 'slow' | 'normal' | 'fast'
  interactive?: boolean
}

export function MeshGradient({
  className,
  children,
  colors = ['#7c3aed', '#06b6d4', '#f472b6', '#fbbf24'],
  speed = 'normal',
  interactive = false,
  ...props
}: MeshGradientProps) {
  const [mousePos, setMousePos] = React.useState({ x: 50, y: 50 })
  const speedMap = { slow: '20s', normal: '10s', fast: '5s' }

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive) return
      const rect = e.currentTarget.getBoundingClientRect()
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    },
    [interactive]
  )

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {/* Mesh gradient blobs */}
      {colors.map((color, index) => {
        const positions = [
          { x: 20, y: 20 },
          { x: 80, y: 20 },
          { x: 20, y: 80 },
          { x: 80, y: 80 },
        ]
        const pos = positions[index % positions.length]

        return (
          <div
            key={index}
            className="absolute w-[50%] h-[50%] rounded-full opacity-70"
            style={{
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              filter: 'blur(60px)',
              left: interactive
                ? `${mousePos.x - 25 + index * 10}%`
                : `${pos.x - 25}%`,
              top: interactive
                ? `${mousePos.y - 25 + index * 10}%`
                : `${pos.y - 25}%`,
              animation: interactive
                ? 'none'
                : `mesh-blob-${index} ${speedMap[speed]} ease-in-out infinite`,
              transition: interactive ? 'all 0.3s ease-out' : 'none',
            }}
          />
        )
      })}

      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes mesh-blob-0 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        @keyframes mesh-blob-1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-30px, 30px) scale(0.9);
          }
          66% {
            transform: translate(20px, -20px) scale(1.1);
          }
        }
        @keyframes mesh-blob-2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(20px, 20px) scale(1.05);
          }
          66% {
            transform: translate(-30px, -10px) scale(0.95);
          }
        }
        @keyframes mesh-blob-3 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-20px, -30px) scale(0.95);
          }
          66% {
            transform: translate(30px, 10px) scale(1.05);
          }
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// GRADIENT BORDER - Animated gradient border effect
// ============================================================================

interface GradientBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  colors?: string[]
  borderWidth?: number
  speed?: 'slow' | 'normal' | 'fast'
  borderRadius?: string
}

export function GradientBorder({
  className,
  children,
  colors = ['#7c3aed', '#06b6d4', '#f472b6', '#22c55e'],
  borderWidth = 2,
  speed = 'normal',
  borderRadius = '0.75rem',
  ...props
}: GradientBorderProps) {
  const speedMap = { slow: '6s', normal: '3s', fast: '1.5s' }

  return (
    <div
      className={cn('relative p-[1px]', className)}
      style={{ borderRadius }}
      {...props}
    >
      {/* Animated gradient border */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius,
          background: `linear-gradient(90deg, ${colors.join(', ')}, ${colors[0]})`,
          backgroundSize: '300% 100%',
          animation: `gradient-border ${speedMap[speed]} linear infinite`,
          padding: borderWidth,
        }}
      />
      {/* Inner content */}
      <div
        className="relative bg-background h-full"
        style={{ borderRadius: `calc(${borderRadius} - ${borderWidth}px)` }}
      >
        {children}
      </div>

      <style jsx>{`
        @keyframes gradient-border {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 300% 50%;
          }
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// GRADIENT TEXT - Animated gradient text
// ============================================================================

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  colors?: string[]
  speed?: 'slow' | 'normal' | 'fast'
  animate?: boolean
}

export function GradientText({
  className,
  children,
  colors = ['#7c3aed', '#06b6d4', '#f472b6'],
  speed = 'normal',
  animate = true,
  ...props
}: GradientTextProps) {
  const speedMap = { slow: '8s', normal: '4s', fast: '2s' }

  return (
    <span
      className={cn('inline-block font-bold', className)}
      style={{
        background: `linear-gradient(90deg, ${colors.join(', ')}, ${colors[0]})`,
        backgroundSize: animate ? '200% auto' : '100% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: animate
          ? `gradient-text ${speedMap[speed]} linear infinite`
          : 'none',
      }}
      {...props}
    >
      {children}
      <style jsx>{`
        @keyframes gradient-text {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
      `}</style>
    </span>
  )
}

// ============================================================================
// SHIMMER EFFECT - Shimmer/shine effect overlay
// ============================================================================

interface ShimmerEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  color?: string
  speed?: 'slow' | 'normal' | 'fast'
  angle?: number
}

export function ShimmerEffect({
  className,
  children,
  color = 'rgba(255, 255, 255, 0.1)',
  speed = 'normal',
  angle = -45,
  ...props
}: ShimmerEffectProps) {
  const speedMap = { slow: '3s', normal: '2s', fast: '1s' }

  return (
    <div className={cn('relative overflow-hidden', className)} {...props}>
      {children}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(${angle}deg, transparent 40%, ${color} 50%, transparent 60%)`,
          backgroundSize: '200% 100%',
          animation: `shimmer ${speedMap[speed]} linear infinite`,
        }}
      />
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  )
}
