'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

// Gradient Background
export interface GradientBackgroundProps {
  colors?: string[]
  animate?: boolean
  direction?:
    | 'to-r'
    | 'to-l'
    | 'to-t'
    | 'to-b'
    | 'to-br'
    | 'to-bl'
    | 'to-tr'
    | 'to-tl'
  className?: string
  children?: React.ReactNode
}

export function GradientBackground({
  colors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  animate = false,
  direction = 'to-br',
  className,
  children,
}: GradientBackgroundProps) {
  const gradientStyle = {
    background: `linear-gradient(${direction.replace('to-', 'to ')}, ${colors.join(', ')})`,
    backgroundSize: animate ? '400% 400%' : '100% 100%',
  }

  return (
    <div
      className={cn('relative', animate && 'animate-gradient', className)}
      style={gradientStyle}
    >
      {children}
    </div>
  )
}

// Animated Particles
export interface ParticleProps {
  count?: number
  color?: string
  size?: number
  speed?: number
  className?: string
}

export function AnimatedParticles({
  count = 50,
  color = 'currentColor',
  size = 4,
  speed = 20,
  className,
}: ParticleProps) {
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * speed,
      duration: speed + Math.random() * speed,
      size: size * (0.5 + Math.random() * 0.5),
    }))
  }, [count, size, speed])

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        className
      )}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full opacity-20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

// Glow Effect
export interface GlowEffectProps {
  color?: string
  size?: number
  blur?: number
  className?: string
  children?: React.ReactNode
}

export function GlowEffect({
  color = 'hsl(var(--accent))',
  size = 100,
  blur = 40,
  className,
  children,
}: GlowEffectProps) {
  return (
    <div className={cn('relative', className)}>
      <div
        className="absolute rounded-full opacity-50 blur-3xl"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          filter: `blur(${blur}px)`,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// Pulse Ring
export interface PulseRingProps {
  color?: string
  size?: number
  duration?: number
  className?: string
}

export function PulseRing({
  color = 'hsl(var(--accent))',
  size = 40,
  duration = 2,
  className,
}: PulseRingProps) {
  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: color,
          animation: `pulse-ring ${duration}s ease-out infinite`,
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: color,
          animation: `pulse-ring ${duration}s ease-out ${duration / 2}s infinite`,
        }}
      />
      <div
        className="absolute inset-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// Typing Cursor
export interface TypingCursorProps {
  className?: string
}

export function TypingCursor({ className }: TypingCursorProps) {
  return (
    <span
      className={cn(
        'inline-block w-0.5 h-5 bg-foreground ml-0.5',
        'animate-[blink_1s_step-end_infinite]',
        className
      )}
      style={{
        animation: 'blink 1s step-end infinite',
      }}
    >
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  )
}

// Wave Animation
export interface WaveAnimationProps {
  color?: string
  height?: number
  className?: string
}

export function WaveAnimation({
  color = 'hsl(var(--accent))',
  height = 100,
  className,
}: WaveAnimationProps) {
  return (
    <div className={cn('overflow-hidden', className)} style={{ height }}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ animation: 'wave 3s ease-in-out infinite' }}
      >
        <path
          d="M0,0 C150,90 350,0 500,50 C650,100 700,0 900,50 C1050,100 1150,0 1200,50 L1200,120 L0,120 Z"
          fill={color}
          fillOpacity="0.3"
        />
        <path
          d="M0,40 C150,110 350,10 500,60 C650,110 700,10 900,60 C1050,110 1150,20 1200,60 L1200,120 L0,120 Z"
          fill={color}
          fillOpacity="0.5"
          style={{ animation: 'wave 4s ease-in-out infinite reverse' }}
        />
      </svg>
      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-25%); }
        }
      `}</style>
    </div>
  )
}

// Loading Dots
export interface LoadingDotsProps {
  size?: number
  color?: string
  className?: string
}

export function LoadingDots({
  size = 8,
  color = 'currentColor',
  className,
}: LoadingDotsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// Shimmer Effect
export interface ShimmerEffectProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  className?: string
}

export function ShimmerEffect({
  width = '100%',
  height = 20,
  borderRadius = 4,
  className,
}: ShimmerEffectProps) {
  return (
    <div
      className={cn('relative overflow-hidden bg-muted', className)}
      style={{ width, height, borderRadius }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          animation: 'shimmer 1.5s infinite',
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

// Fade In
export interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  className,
}: FadeInProps) {
  const transforms = {
    up: 'translateY(20px)',
    down: 'translateY(-20px)',
    left: 'translateX(20px)',
    right: 'translateX(-20px)',
    none: 'none',
  }

  return (
    <div
      className={cn('opacity-0', className)}
      style={
        {
          animation: `fadeIn ${duration}s ease-out ${delay}s forwards`,
          '--transform-start': transforms[direction],
        } as React.CSSProperties
      }
    >
      {children}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: var(--transform-start);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  )
}

// Stagger Children
export interface StaggerChildrenProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
}

export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  className,
}: StaggerChildrenProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <FadeIn delay={index * staggerDelay}>{child}</FadeIn>
      ))}
    </div>
  )
}

// Spotlight Effect
export interface SpotlightProps {
  className?: string
  children?: React.ReactNode
}

export function Spotlight({ className, children }: SpotlightProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onMouseMove={handleMouseMove}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      {children}
    </div>
  )
}

// Border Beam
export interface BorderBeamProps {
  size?: number
  duration?: number
  borderWidth?: number
  colorFrom?: string
  colorTo?: string
  className?: string
  children?: React.ReactNode
}

export function BorderBeam({
  size = 200,
  duration = 15,
  borderWidth = 1.5,
  colorFrom = '#ffaa40',
  colorTo = '#9c40ff',
  className,
  children,
}: BorderBeamProps) {
  return (
    <div className={cn('relative rounded-lg', className)}>
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          padding: borderWidth,
          background: `linear-gradient(var(--angle), ${colorFrom}, ${colorTo}, ${colorFrom})`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          WebkitMaskComposite: 'xor',
          animation: `rotate ${duration}s linear infinite`,
        }}
      />
      <div className="relative bg-background rounded-lg">{children}</div>
      <style>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes rotate {
          to { --angle: 360deg; }
        }
      `}</style>
    </div>
  )
}

// Text Gradient
export interface TextGradientProps {
  children: React.ReactNode
  colors?: string[]
  animate?: boolean
  className?: string
}

export function TextGradient({
  children,
  colors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  animate = false,
  className,
}: TextGradientProps) {
  return (
    <span
      className={cn(
        'bg-clip-text text-transparent',
        animate && 'animate-gradient',
        className
      )}
      style={{
        backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
        backgroundSize: animate ? '200% 200%' : '100% 100%',
      }}
    >
      {children}
    </span>
  )
}

// Counter Animation
export interface CounterProps {
  from?: number
  to: number
  duration?: number
  className?: string
}

export function Counter({
  from = 0,
  to,
  duration = 2,
  className,
}: CounterProps) {
  const [count, setCount] = React.useState(from)
  const nodeRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const startTime = Date.now()
    const endTime = startTime + duration * 1000

    const updateCount = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / (duration * 1000), 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(from + (to - from) * easeOut)

      setCount(current)

      if (now < endTime) {
        requestAnimationFrame(updateCount)
      } else {
        setCount(to)
      }
    }

    requestAnimationFrame(updateCount)
  }, [from, to, duration])

  return (
    <span ref={nodeRef} className={className}>
      {count.toLocaleString()}
    </span>
  )
}
