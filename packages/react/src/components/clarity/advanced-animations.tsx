'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

// =============================================================================
// FLOATING ELEMENTS - Physics-based floating
// =============================================================================

interface FloatingElementProps {
  children: React.ReactNode
  speed?: number
  distance?: number
  className?: string
}

export function FloatingElement({
  children,
  speed = 3,
  distance = 20,
  className,
}: FloatingElementProps) {
  return (
    <div
      className={cn('animate-float', className)}
      style={{
        animationDuration: `${speed}s`,
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        animationName: 'float',
      }}
    >
      {children}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-${distance}px);
          }
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// SPOTLIGHT CURSOR - Advanced cursor spotlight
// =============================================================================

interface SpotlightCursorProps {
  children: React.ReactNode
  color?: string
  size?: number
  className?: string
}

export function SpotlightCursor({
  children,
  color = 'rgba(255, 255, 255, 0.1)',
  size = 300,
  className,
}: SpotlightCursorProps) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const containerRef = React.useRef<HTMLDivElement>(null)

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
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle ${size}px at ${position.x}px ${position.y}px, ${color}, transparent)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// =============================================================================
// MORPH BLOB - SVG morphing blob
// =============================================================================

interface MorphBlobProps {
  size?: number
  colors?: string[]
  duration?: number
  className?: string
}

export function MorphBlob({
  size = 200,
  colors = ['#3B82F6', '#8B5CF6'],
  duration = 8,
  className,
}: MorphBlobProps) {
  const id = React.useId()
  const gradientId = `blob-gradient-${id}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={cn('animate-morph-blob', className)}
      style={{ animationDuration: `${duration}s` }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        d="M47.1,-57.1C59.9,-47.6,68.5,-32.3,71.6,-16.2C74.7,-0.1,72.3,16.8,64.3,30.9C56.3,45,42.7,56.3,27.5,62.1C12.3,67.9,-4.5,68.2,-20.1,63.2C-35.7,58.2,-50.1,47.9,-58.6,33.8C-67.1,19.7,-69.7,1.8,-66.8,-14.7C-63.9,-31.2,-55.5,-46.3,-42.7,-55.8C-29.9,-65.3,-12.6,-69.2,2.9,-72.7C18.4,-76.2,34.3,-66.6,47.1,-57.1Z"
        transform="translate(100 100)"
      />
      <style jsx>{`
        @keyframes morph-blob {
          0%,
          100% {
            d: path(
              'M47.1,-57.1C59.9,-47.6,68.5,-32.3,71.6,-16.2C74.7,-0.1,72.3,16.8,64.3,30.9C56.3,45,42.7,56.3,27.5,62.1C12.3,67.9,-4.5,68.2,-20.1,63.2C-35.7,58.2,-50.1,47.9,-58.6,33.8C-67.1,19.7,-69.7,1.8,-66.8,-14.7C-63.9,-31.2,-55.5,-46.3,-42.7,-55.8C-29.9,-65.3,-12.6,-69.2,2.9,-72.7C18.4,-76.2,34.3,-66.6,47.1,-57.1Z'
            );
          }
          50% {
            d: path(
              'M42.7,-55.8C54.1,-45.4,61.1,-30.9,64.3,-15.7C67.5,-0.5,66.9,15.4,59.9,28.3C52.9,41.2,39.5,51.1,24.7,57.1C9.9,63.1,-6.3,65.2,-21.4,60.9C-36.5,56.6,-50.5,46,-58.6,31.8C-66.7,17.6,-68.9,-0.2,-65.2,-16.5C-61.5,-32.8,-51.9,-47.6,-38.8,-57.6C-25.7,-67.6,-9.1,-72.8,4.9,-78.7C18.9,-84.6,31.3,-66.2,42.7,-55.8Z'
            );
          }
        }
        .animate-morph-blob path {
          animation: morph-blob ease-in-out infinite;
        }
      `}</style>
    </svg>
  )
}

// =============================================================================
// PARTICLE BURST - Particle explosion effect
// =============================================================================

interface ParticleBurstProps {
  active?: boolean
  count?: number
  colors?: string[]
  onComplete?: () => void
}

export function ParticleBurst({
  active = false,
  count = 30,
  colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'],
  onComplete,
}: ParticleBurstProps) {
  const [particles, setParticles] = React.useState<
    Array<{
      id: number
      x: number
      y: number
      color: string
      angle: number
      velocity: number
    }>
  >([])

  React.useEffect(() => {
    if (!active) return

    const newParticles = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      return {
        id: i,
        x: 50,
        y: 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle,
        velocity: 100 + Math.random() * 100,
      }
    })

    setParticles(newParticles)

    const timeout = setTimeout(() => {
      setParticles([])
      onComplete?.()
    }, 1000)

    return () => clearTimeout(timeout)
  }, [active, count, colors, onComplete])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full animate-particle-burst"
          style={
            {
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: particle.color,
              transform: `translate(-50%, -50%)`,
              '--angle': `${particle.angle}rad`,
              '--velocity': `${particle.velocity}px`,
            } as React.CSSProperties
          }
        />
      ))}
      <style jsx>{`
        @keyframes particle-burst {
          to {
            transform: translate(
              calc(-50% + cos(var(--angle)) * var(--velocity)),
              calc(-50% + sin(var(--angle)) * var(--velocity))
            );
            opacity: 0;
          }
        }
        .animate-particle-burst {
          animation: particle-burst 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// 3D FLIP CARD - Card that flips in 3D
// =============================================================================

interface FlipCard3DProps {
  front: React.ReactNode
  back: React.ReactNode
  className?: string
}

export function FlipCard3D({ front, back, className }: FlipCard3DProps) {
  const [isFlipped, setIsFlipped] = React.useState(false)

  return (
    <div
      className={cn('perspective-1000 cursor-pointer', className)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-700 transform-style-3d',
          isFlipped && 'rotate-y-180'
        )}
      >
        <div className="absolute inset-0 backface-hidden">{front}</div>
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          {back}
        </div>
      </div>
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// WAVE TEXT - Text with wave animation
// =============================================================================

interface WaveTextProps {
  children: string
  delay?: number
  className?: string
}

export function WaveText({ children, delay = 0.1, className }: WaveTextProps) {
  const chars = children.split('')

  return (
    <span className={className}>
      {chars.map((char, index) => (
        <span
          key={index}
          className="inline-block animate-wave"
          style={{
            animationDelay: `${index * delay}s`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </span>
  )
}

// =============================================================================
// SHIMMER BORDER - Animated border shimmer
// =============================================================================

interface ShimmerBorderProps {
  children: React.ReactNode
  color?: string
  duration?: number
  className?: string
}

export function ShimmerBorder({
  children,
  color = '#3B82F6',
  duration = 2,
  className,
}: ShimmerBorderProps) {
  return (
    <div
      className={cn('relative rounded-lg p-[2px] overflow-hidden', className)}
    >
      <div
        className="absolute inset-0 animate-shimmer-border"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animationDuration: `${duration}s`,
        }}
      />
      <div className="relative bg-background rounded-lg">{children}</div>
      <style jsx>{`
        @keyframes shimmer-border {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer-border {
          animation: shimmer-border linear infinite;
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// BREATH EFFECT - Pulsing breath animation
// =============================================================================

interface BreathEffectProps {
  children: React.ReactNode
  duration?: number
  scale?: number
  className?: string
}

export function BreathEffect({
  children,
  duration = 3,
  scale = 1.05,
  className,
}: BreathEffectProps) {
  return (
    <div
      className={cn('animate-breath', className)}
      style={
        {
          animationDuration: `${duration}s`,
          '--scale': scale,
        } as React.CSSProperties
      }
    >
      {children}
      <style jsx>{`
        @keyframes breath {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(var(--scale));
            opacity: 0.8;
          }
        }
        .animate-breath {
          animation: breath ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// SHAKE ANIMATION - Shake effect
// =============================================================================

interface ShakeProps {
  children: React.ReactNode
  active?: boolean
  intensity?: number
  className?: string
}

export function Shake({
  children,
  active = false,
  intensity = 10,
  className,
}: ShakeProps) {
  return (
    <div
      className={cn(active && 'animate-shake', className)}
      style={
        {
          '--intensity': `${intensity}px`,
        } as React.CSSProperties
      }
    >
      {children}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(calc(var(--intensity) * -1));
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(var(--intensity));
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// BOUNCE IN - Bounce entrance animation
// =============================================================================

interface BounceInProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function BounceIn({ children, delay = 0, className }: BounceInProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all',
        isVisible ? 'animate-bounce-in' : 'opacity-0 scale-50',
        className
      )}
    >
      {children}
      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  )
}
