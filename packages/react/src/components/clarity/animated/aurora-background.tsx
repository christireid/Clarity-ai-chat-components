'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

// ============================================================================
// AURORA BACKGROUND - Animated northern lights effect
// ============================================================================

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  showRadialGradient?: boolean
  colors?: string[]
  speed?: 'slow' | 'normal' | 'fast'
  blur?: 'none' | 'sm' | 'md' | 'lg'
  opacity?: number
  interactive?: boolean
}

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  colors = ['#00d4ff', '#7c3aed', '#f472b6', '#22d3ee'],
  speed = 'normal',
  blur = 'lg',
  opacity = 0.5,
  interactive = false,
  ...props
}: AuroraBackgroundProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive) return
      const rect = e.currentTarget.getBoundingClientRect()
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    },
    [interactive]
  )

  const speedMap = {
    slow: '60s',
    normal: '30s',
    fast: '15s',
  }

  const blurMap = {
    none: '0px',
    sm: '40px',
    md: '80px',
    lg: '120px',
  }

  return (
    <div
      className={cn(
        'relative flex flex-col h-full w-full items-center justify-center bg-background overflow-hidden',
        className
      )}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          ['--aurora-speed' as string]: speedMap[speed],
          ['--aurora-blur' as string]: blurMap[blur],
          ['--aurora-opacity' as string]: opacity,
        }}
      >
        {/* Aurora layers */}
        {colors.map((color, index) => (
          <div
            key={index}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 80% 50% at ${
                interactive ? mousePosition.x : 50 + index * 10
              }% ${interactive ? mousePosition.y : 50}%, ${color}40 0%, transparent 50%)`,
              animation: `aurora-shift ${speedMap[speed]} ease-in-out infinite`,
              animationDelay: `${index * -5}s`,
              filter: `blur(${blurMap[blur]})`,
              opacity: opacity,
              transform: `rotate(${index * 15}deg)`,
            }}
          />
        ))}

        {/* Animated gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(45deg, ${colors[0]}20, transparent, ${colors[1]}20, transparent, ${colors[2]}20)`,
            backgroundSize: '400% 400%',
            animation: `aurora-gradient ${speedMap[speed]} ease infinite`,
          }}
        />

        {showRadialGradient && (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 0%, hsl(var(--background)) 70%)',
            }}
          />
        )}
      </div>
      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes aurora-shift {
          0%,
          100% {
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          25% {
            transform: translateX(5%) translateY(-5%) rotate(5deg);
          }
          50% {
            transform: translateX(-5%) translateY(5%) rotate(-5deg);
          }
          75% {
            transform: translateX(3%) translateY(3%) rotate(3deg);
          }
        }
        @keyframes aurora-gradient {
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
// AURORA TEXT - Text with aurora glow effect
// ============================================================================

interface AuroraTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  colors?: string[]
  speed?: 'slow' | 'normal' | 'fast'
}

export function AuroraText({
  className,
  children,
  colors = ['#00d4ff', '#7c3aed', '#f472b6'],
  speed = 'normal',
  ...props
}: AuroraTextProps) {
  const speedMap = { slow: '8s', normal: '4s', fast: '2s' }

  return (
    <span
      className={cn('relative inline-block', className)}
      style={{
        background: `linear-gradient(90deg, ${colors.join(', ')}, ${colors[0]})`,
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: `aurora-text-shift ${speedMap[speed]} linear infinite`,
      }}
      {...props}
    >
      {children}
      <style jsx>{`
        @keyframes aurora-text-shift {
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
// AURORA CARD - Card with aurora border effect
// ============================================================================

interface AuroraCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  colors?: string[]
  borderWidth?: number
  speed?: 'slow' | 'normal' | 'fast'
}

export function AuroraCard({
  className,
  children,
  colors = ['#00d4ff', '#7c3aed', '#f472b6', '#22d3ee'],
  borderWidth = 2,
  speed = 'normal',
  ...props
}: AuroraCardProps) {
  const speedMap = { slow: '6s', normal: '3s', fast: '1.5s' }

  return (
    <div
      className={cn('relative rounded-xl p-[1px] overflow-hidden', className)}
      {...props}
    >
      {/* Animated border */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(90deg, ${colors.join(', ')}, ${colors[0]})`,
          backgroundSize: '300% 100%',
          animation: `aurora-border ${speedMap[speed]} linear infinite`,
          padding: borderWidth,
        }}
      />
      {/* Inner content */}
      <div className="relative bg-background rounded-xl h-full">{children}</div>

      <style jsx>{`
        @keyframes aurora-border {
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
