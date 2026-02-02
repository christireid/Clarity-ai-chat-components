'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

// =============================================================================
// RIPPLE EFFECT - Interactive ripple on click
// =============================================================================

interface RippleProps {
  mainCircleSize?: number
  mainCircleOpacity?: number
  numCircles?: number
  className?: string
  children?: React.ReactNode
}

export function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className,
  children,
}: RippleProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: numCircles }, (_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
            style={{
              width: mainCircleSize + i * 70,
              height: mainCircleSize + i * 70,
              opacity: mainCircleOpacity * (1 - i / numCircles),
              animation: `ripple 3s ease-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: ${mainCircleOpacity};
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// MAGNETIC ELEMENT - Follows mouse cursor
// =============================================================================

interface MagneticProps {
  children: React.ReactNode
  intensity?: number
  className?: string
}

export function Magnetic({
  children,
  intensity = 0.3,
  className,
}: MagneticProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = (e.clientX - centerX) * intensity
    const distanceY = (e.clientY - centerY) * intensity
    setPosition({ x: distanceX, y: distanceY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div
      ref={ref}
      className={cn(
        'inline-block transition-transform duration-200',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {children}
    </div>
  )
}

// =============================================================================
// 3D CARD TILT - Interactive 3D perspective card
// =============================================================================

interface CardTiltProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  glareEnabled?: boolean
}

export function CardTilt({
  children,
  className,
  intensity = 15,
  glareEnabled = true,
}: CardTiltProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [transform, setTransform] = React.useState('')
  const [glare, setGlare] = React.useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -intensity
    const rotateY = ((x - centerX) / centerX) * intensity

    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    )

    if (glareEnabled) {
      setGlare({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.3,
      })
    }
  }

  const handleMouseLeave = () => {
    setTransform('')
    setGlare({ x: 50, y: 50, opacity: 0 })
  }

  return (
    <div
      ref={ref}
      className={cn(
        'relative transition-transform duration-300 ease-out',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transformStyle: 'preserve-3d' }}
    >
      {children}
      {glareEnabled && (
        <div
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 50%)`,
            transition: 'opacity 0.3s ease-out',
          }}
        />
      )}
    </div>
  )
}

// =============================================================================
// LIQUID BUTTON - Morphing liquid hover effects
// =============================================================================

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function LiquidButton({
  children,
  className,
  variant = 'primary',
  ...props
}: LiquidButtonProps) {
  const [ripples, setRipples] = React.useState<
    Array<{ x: number; y: number; id: number }>
  >([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples((prev) => [...prev, { x, y, id }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)

    props.onClick?.(e)
  }

  const variantClasses = {
    primary: 'bg-accent text-accent-foreground hover:bg-accent/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'bg-transparent hover:bg-accent/10 text-foreground',
  }

  return (
    <button
      {...props}
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden px-6 py-3 rounded-lg font-medium transition-colors',
        variantClasses[variant],
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ripple-expand"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
        />
      ))}
    </button>
  )
}

// =============================================================================
// DOCK ANIMATION - macOS-style dock with magnification
// =============================================================================

interface DockProps {
  items: Array<{
    icon: React.ReactNode
    label: string
    onClick?: () => void
  }>
  className?: string
}

export function Dock({ items, className }: DockProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  const getScale = (index: number) => {
    if (hoveredIndex === null) return 1
    const distance = Math.abs(index - hoveredIndex)
    if (distance === 0) return 1.5
    if (distance === 1) return 1.25
    if (distance === 2) return 1.1
    return 1
  }

  return (
    <div
      className={cn(
        'flex items-end gap-2 p-2 bg-background/80 backdrop-blur-md border border-border rounded-2xl shadow-lg',
        className
      )}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onMouseEnter={() => setHoveredIndex(index)}
          onClick={item.onClick}
          className="group relative flex flex-col items-center transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${getScale(index)}) translateY(${hoveredIndex === index ? '-8px' : '0'})`,
          }}
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
            {item.icon}
          </div>
          {hoveredIndex === index && (
            <span className="absolute -top-10 text-xs bg-popover text-popover-foreground px-2 py-1 rounded-md border border-border whitespace-nowrap shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
              {item.label}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// =============================================================================
// MOUSE TRAIL - Cursor trail effect
// =============================================================================

interface MouseTrailProps {
  color?: string
  size?: number
  length?: number
  className?: string
}

export function MouseTrail({
  color = 'hsl(var(--accent))',
  size = 20,
  length = 20,
  className,
}: MouseTrailProps) {
  const [trail, setTrail] = React.useState<
    Array<{ x: number; y: number; id: number }>
  >([])

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTrail((prev) => {
        const newTrail = [
          { x: e.clientX, y: e.clientY, id: Date.now() },
          ...prev.slice(0, length - 1),
        ]
        return newTrail
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [length])

  return (
    <div className={cn('fixed inset-0 pointer-events-none z-50', className)}>
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="absolute rounded-full"
          style={{
            left: point.x,
            top: point.y,
            width: size * (1 - index / length),
            height: size * (1 - index / length),
            backgroundColor: color,
            opacity: 0.5 * (1 - index / length),
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.1s ease-out',
          }}
        />
      ))}
    </div>
  )
}

// =============================================================================
// GOOEY EFFECT - Blob morphing effect
// =============================================================================

interface GooeyProps {
  children: React.ReactNode
  className?: string
  blur?: number
}

export function Gooey({ children, className, blur = 10 }: GooeyProps) {
  const id = React.useId()
  const filterId = `gooey-${id}`

  return (
    <div
      className={cn('relative', className)}
      style={{ filter: `url(#${filterId})` }}
    >
      {children}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={blur}
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
