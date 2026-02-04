'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

// ============================================================================
// SPOTLIGHT - Animated spotlight effect following cursor
// ============================================================================

interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  fill?: string
  size?: number
  blur?: number
  followMouse?: boolean
  pulseOnHover?: boolean
}

export function Spotlight({
  className,
  children,
  fill = 'white',
  size = 400,
  blur = 80,
  followMouse = true,
  pulseOnHover = false,
  ...props
}: SpotlightProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = React.useState(false)
  const [opacity, setOpacity] = React.useState(0)

  React.useEffect(() => {
    setOpacity(1)
  }, [])

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || !followMouse) return
      const rect = containerRef.current.getBoundingClientRect()
      setPosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    },
    [followMouse]
  )

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden bg-background', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(${size}px circle at ${position.x}% ${position.y}%, ${fill}15 0%, transparent 100%)`,
          filter: `blur(${blur}px)`,
          transform: pulseOnHover && isHovered ? 'scale(1.2)' : 'scale(1)',
          transition: 'transform 0.3s ease-out, opacity 0.5s ease-out',
        }}
      />

      {/* Secondary glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: opacity * 0.5,
          background: `radial-gradient(${size * 0.6}px circle at ${position.x}% ${position.y}%, ${fill}25 0%, transparent 100%)`,
          filter: `blur(${blur * 0.5}px)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ============================================================================
// SPOTLIGHT CARD - Card with spotlight border effect
// ============================================================================

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  spotlightColor?: string
  borderColor?: string
}

export function SpotlightCard({
  className,
  children,
  spotlightColor = 'rgba(120, 119, 198, 0.3)',
  borderColor = 'rgba(255, 255, 255, 0.1)',
  ...props
}: SpotlightCardProps) {
  const divRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = React.useState(0)

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!divRef.current) return
      const rect = divRef.current.getBoundingClientRect()
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    },
    []
  )

  return (
    <div
      ref={divRef}
      className={cn(
        'relative rounded-xl border bg-card p-6 overflow-hidden',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      style={{ borderColor }}
      {...props}
    >
      {/* Spotlight gradient */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ============================================================================
// MULTI SPOTLIGHT - Multiple animated spotlights
// ============================================================================

interface MultiSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  count?: number
  colors?: string[]
}

export function MultiSpotlight({
  className,
  children,
  count = 3,
  colors = ['#7c3aed', '#06b6d4', '#f472b6'],
  ...props
}: MultiSpotlightProps) {
  return (
    <div
      className={cn('relative overflow-hidden bg-background', className)}
      {...props}
    >
      {/* Multiple spotlights */}
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="pointer-events-none absolute w-96 h-96 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${colors[i % colors.length]}40 0%, transparent 70%)`,
            filter: 'blur(60px)',
            animation: `spotlight-float-${i} ${15 + i * 5}s ease-in-out infinite`,
            left: `${20 + i * 30}%`,
            top: `${20 + i * 20}%`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes spotlight-float-0 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(100px, 50px);
          }
        }
        @keyframes spotlight-float-1 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-80px, 100px);
          }
        }
        @keyframes spotlight-float-2 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(50px, -80px);
          }
        }
      `}</style>
    </div>
  )
}
