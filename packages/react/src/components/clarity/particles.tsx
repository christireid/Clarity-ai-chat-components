'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

// =============================================================================
// PARTICLES BACKGROUND - Magic UI inspired but enhanced
// =============================================================================

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

interface ParticlesProps {
  quantity?: number
  size?: { min: number; max: number }
  speed?: { min: number; max: number }
  color?: string
  colors?: string[]
  connectDistance?: number
  showConnections?: boolean
  interactive?: boolean
  className?: string
  staticity?: number
  ease?: number
}

export function Particles({
  quantity = 50,
  size = { min: 1, max: 3 },
  speed = { min: 0.1, max: 0.5 },
  color = 'currentColor',
  colors,
  connectDistance = 100,
  showConnections = false,
  interactive = true,
  className,
  staticity = 50,
  ease = 50,
}: ParticlesProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const particlesRef = React.useRef<Particle[]>([])
  const mouseRef = React.useRef({ x: 0, y: 0, isInside: false })
  const animationRef = React.useRef<number>(0)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const random = (min: number, max: number) =>
      Math.random() * (max - min) + min

    const getColor = () => {
      if (colors && colors.length > 0) {
        return colors[Math.floor(Math.random() * colors.length)]
      }
      return color
    }

    const createParticle = (id: number): Particle => {
      const rect = canvas.getBoundingClientRect()
      return {
        id,
        x: random(0, rect.width),
        y: random(0, rect.height),
        size: random(size.min, size.max),
        speedX: random(-speed.max, speed.max),
        speedY: random(-speed.max, speed.max),
        opacity: random(0.3, 1),
        color: getColor(),
      }
    }

    const initParticles = () => {
      particlesRef.current = Array.from({ length: quantity }, (_, i) =>
        createParticle(i)
      )
    }

    const drawParticle = (p: Particle) => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.opacity
      ctx.fill()
      ctx.globalAlpha = 1
    }

    const drawConnections = () => {
      if (!showConnections) return

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectDistance) {
            const opacity = 1 - distance / connectDistance
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = color
            ctx.globalAlpha = opacity * 0.2
            ctx.lineWidth = 0.5
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }
    }

    const updateParticle = (p: Particle) => {
      const rect = canvas.getBoundingClientRect()

      // Mouse interaction
      if (interactive && mouseRef.current.isInside) {
        const dx = mouseRef.current.x - p.x
        const dy = mouseRef.current.y - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = staticity

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          p.x -= (dx / distance) * force * (ease / 100)
          p.y -= (dy / distance) * force * (ease / 100)
        }
      }

      // Move
      p.x += p.speedX
      p.y += p.speedY

      // Bounce off edges
      if (p.x < 0 || p.x > rect.width) p.speedX *= -1
      if (p.y < 0 || p.y > rect.height) p.speedY *= -1

      // Keep in bounds
      p.x = Math.max(0, Math.min(rect.width, p.x))
      p.y = Math.max(0, Math.min(rect.height, p.y))
    }

    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      drawConnections()

      for (const particle of particlesRef.current) {
        updateParticle(particle)
        drawParticle(particle)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isInside: true,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.isInside = false
    }

    resizeCanvas()
    initParticles()
    animate()

    window.addEventListener('resize', resizeCanvas)
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
      }
      cancelAnimationFrame(animationRef.current)
    }
  }, [
    quantity,
    size,
    speed,
    color,
    colors,
    connectDistance,
    showConnections,
    interactive,
    staticity,
    ease,
  ])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 pointer-events-auto', className)}
      style={{ width: '100%', height: '100%' }}
    />
  )
}

// =============================================================================
// SPARKLES - Animated sparkle particles
// =============================================================================

interface SparklesProps {
  density?: 'low' | 'medium' | 'high'
  speed?: 'slow' | 'normal' | 'fast'
  color?: string
  className?: string
  children?: React.ReactNode
}

export function Sparkles({
  density = 'medium',
  speed = 'normal',
  color = '#FFD700',
  className,
  children,
}: SparklesProps) {
  const densityMap = { low: 10, medium: 20, high: 40 }
  const speedMap = { slow: 3, normal: 2, fast: 1 }

  return (
    <span className={cn('relative inline-block', className)}>
      {children}
      <span className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: densityMap[density] }).map((_, i) => (
          <span
            key={i}
            className="absolute animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${speedMap[speed]}s`,
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              className="animate-spin-slow"
              style={{ animationDuration: `${3 + Math.random() * 2}s` }}
            >
              <path
                d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
                fill={color}
              />
            </svg>
          </span>
        ))}
      </span>
    </span>
  )
}

// =============================================================================
// FLOATING PARTICLES - Static floating elements
// =============================================================================

interface FloatingParticlesProps {
  count?: number
  size?: { min: number; max: number }
  colors?: string[]
  shapes?: ('circle' | 'square' | 'star')[]
  className?: string
}

export function FloatingParticles({
  count = 20,
  size = { min: 4, max: 12 },
  colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981'],
  shapes = ['circle'],
  className,
}: FloatingParticlesProps) {
  const particles = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: size.min + Math.random() * (size.max - size.min),
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20,
    }))
  }, [count, size, colors, shapes])

  const renderShape = (
    shape: string,
    particleSize: number,
    particleColor: string
  ) => {
    switch (shape) {
      case 'square':
        return (
          <div
            className="rounded-sm"
            style={{
              width: particleSize,
              height: particleSize,
              backgroundColor: particleColor,
            }}
          />
        )
      case 'star':
        return (
          <svg width={particleSize} height={particleSize} viewBox="0 0 24 24">
            <path
              d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
              fill={particleColor}
            />
          </svg>
        )
      default:
        return (
          <div
            className="rounded-full"
            style={{
              width: particleSize,
              height: particleSize,
              backgroundColor: particleColor,
            }}
          />
        )
    }
  }

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        className
      )}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-float opacity-60"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {renderShape(p.shape, p.size, p.color)}
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// GRADIENT ORB - Animated gradient background
// =============================================================================

interface GradientOrbProps {
  colors?: string[]
  size?: number
  blur?: number
  className?: string
}

export function GradientOrb({
  colors = ['#3B82F6', '#8B5CF6', '#EC4899'],
  size = 400,
  blur = 100,
  className,
}: GradientOrbProps) {
  return (
    <div
      className={cn(
        'absolute rounded-full animate-float opacity-50',
        className
      )}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${colors.join(', ')})`,
        filter: `blur(${blur}px)`,
      }}
    />
  )
}

// =============================================================================
// DOT PATTERN - Background pattern
// =============================================================================

interface DotPatternProps {
  width?: number
  height?: number
  cx?: number
  cy?: number
  cr?: number
  className?: string
}

export function DotPattern({
  width = 16,
  height = 16,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
}: DotPatternProps) {
  const id = React.useId()

  return (
    <svg
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full fill-muted-foreground/20',
        className
      )}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
        >
          <circle cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// =============================================================================
// GRID PATTERN - Background grid
// =============================================================================

interface GridPatternProps {
  width?: number
  height?: number
  strokeWidth?: number
  className?: string
}

export function GridPattern({
  width = 40,
  height = 40,
  strokeWidth = 1,
  className,
}: GridPatternProps) {
  const id = React.useId()

  return (
    <svg
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full stroke-muted-foreground/10',
        className
      )}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${width} 0 L 0 0 0 ${height}`}
            fill="none"
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// =============================================================================
// METEORS - Shooting stars effect
// =============================================================================

interface MeteorsProps {
  number?: number
  className?: string
}

export function Meteors({ number = 20, className }: MeteorsProps) {
  const meteors = React.useMemo(() => {
    return Array.from({ length: number }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 0.5 + Math.random() * 0.5,
    }))
  }, [number])

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        className
      )}
    >
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="absolute top-0 h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-full bg-primary shadow-[0_0_0_1px_#ffffff10]"
          style={{
            left: `${meteor.left}%`,
            animationDelay: `${meteor.delay}s`,
            animationDuration: `${meteor.duration}s`,
          }}
        >
          <span className="absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-primary to-transparent" />
        </span>
      ))}
    </div>
  )
}

// Add keyframes to globals.css for animations:
// @keyframes sparkle { 0%, 100% { opacity: 0; transform: scale(0); } 50% { opacity: 1; transform: scale(1); } }
// @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
// @keyframes meteor { 0% { transform: rotate(215deg) translateX(0); opacity: 1; } 70% { opacity: 1; } 100% { transform: rotate(215deg) translateX(-500px); opacity: 0; } }
// @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
