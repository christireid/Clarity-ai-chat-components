'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

// =============================================================================
// AURORA BACKGROUND - Northern lights effect
// =============================================================================

interface AuroraBackgroundProps {
  children?: React.ReactNode
  colors?: string[]
  className?: string
}

export function AuroraBackground({
  children,
  colors = ['#3B82F6', '#8B5CF6', '#EC4899'],
  className,
}: AuroraBackgroundProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className="absolute inset-0">
        {colors.map((color, i) => (
          <div
            key={i}
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${color}, transparent)`,
              animation: `aurora-${i} ${15 + i * 5}s ease-in-out infinite`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10">{children}</div>
      <style jsx>{`
        @keyframes aurora-0 {
          0%,
          100% {
            transform: translateX(-10%) translateY(0) rotate(0deg);
          }
          33% {
            transform: translateX(10%) translateY(-10%) rotate(5deg);
          }
          66% {
            transform: translateX(-5%) translateY(5%) rotate(-5deg);
          }
        }
        @keyframes aurora-1 {
          0%,
          100% {
            transform: translateX(10%) translateY(5%) rotate(0deg);
          }
          33% {
            transform: translateX(-10%) translateY(0) rotate(-5deg);
          }
          66% {
            transform: translateX(5%) translateY(-10%) rotate(5deg);
          }
        }
        @keyframes aurora-2 {
          0%,
          100% {
            transform: translateX(0) translateY(-10%) rotate(0deg);
          }
          33% {
            transform: translateX(-10%) translateY(5%) rotate(5deg);
          }
          66% {
            transform: translateX(10%) translateY(0) rotate(-5deg);
          }
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// GRADIENT MESH - Animated mesh gradient
// =============================================================================

interface GradientMeshProps {
  colors?: string[]
  className?: string
  children?: React.ReactNode
}

export function GradientMesh({
  colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'],
  className,
  children,
}: GradientMeshProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()

    const orbs: Array<{
      x: number
      y: number
      vx: number
      vy: number
      color: string
      size: number
    }> = colors.map((color) => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      color,
      size: 200 + Math.random() * 200,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      orbs.forEach((orb) => {
        orb.x += orb.vx
        orb.y += orb.vy

        if (orb.x < 0 || orb.x > canvas.offsetWidth) orb.vx *= -1
        if (orb.y < 0 || orb.y > canvas.offsetHeight) orb.vy *= -1

        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.size
        )
        gradient.addColorStop(0, orb.color)
        gradient.addColorStop(1, 'transparent')

        ctx.globalCompositeOperation = 'screen'
        ctx.fillStyle = gradient
        ctx.globalAlpha = 0.6
        ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      })

      requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [colors])

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// =============================================================================
// NOISE TEXTURE - Animated noise background
// =============================================================================

interface NoiseTextureProps {
  opacity?: number
  className?: string
  children?: React.ReactNode
}

export function NoiseTexture({
  opacity = 0.05,
  className,
  children,
}: NoiseTextureProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 200
    canvas.height = 200

    const imageData = ctx.createImageData(canvas.width, canvas.height)
    const data = imageData.data

    const generateNoise = () => {
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255
        data[i] = value
        data[i + 1] = value
        data[i + 2] = value
        data[i + 3] = 255
      }
      ctx.putImageData(imageData, 0, 0)
    }

    const animate = () => {
      generateNoise()
      setTimeout(() => requestAnimationFrame(animate), 100)
    }

    animate()
  }, [])

  return (
    <div className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          opacity,
          imageRendering: 'pixelated',
          mixBlendMode: 'overlay',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// =============================================================================
// ANIMATED WAVES - Layered wave animation
// =============================================================================

interface AnimatedWavesProps {
  colors?: string[]
  className?: string
}

export function AnimatedWaves({
  colors = ['#3B82F6', '#8B5CF6', '#EC4899'],
  className,
}: AnimatedWavesProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {colors.map((color, i) => (
        <svg
          key={i}
          className="absolute bottom-0 w-full"
          style={{
            height: '150px',
            animation: `wave ${10 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * -2}s`,
            opacity: 0.2 + i * 0.1,
          }}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C300,100 500,20 600,40 C700,60 900,0 1200,40 L1200,120 L0,120 Z"
            fill={color}
          />
        </svg>
      ))}
      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(-25%) translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// RADIAL GRADIENT - Animated radial gradient
// =============================================================================

interface RadialGradientProps {
  colors?: string[]
  className?: string
  children?: React.ReactNode
}

export function RadialGradient({
  colors = ['#3B82F6', '#8B5CF6'],
  className,
  children,
}: RadialGradientProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className="absolute inset-0 animate-pulse-slow"
        style={{
          background: `radial-gradient(ellipse at center, ${colors.join(', ')})`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// =============================================================================
// SPOTLIGHT GRID - Animated spotlight grid
// =============================================================================

interface SpotlightGridProps {
  className?: string
  children?: React.ReactNode
}

export function SpotlightGrid({ className, children }: SpotlightGridProps) {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 })
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 300px at ${mousePos.x}% ${mousePos.y}%, rgba(var(--accent-rgb, 59, 130, 246), 0.15), transparent 80%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// =============================================================================
// ANIMATED GRID - Moving grid background
// =============================================================================

interface AnimatedGridProps {
  className?: string
  children?: React.ReactNode
  lineColor?: string
  lineWidth?: number
}

export function AnimatedGrid({
  className,
  children,
  lineColor = 'hsl(var(--border))',
  lineWidth = 1,
}: AnimatedGridProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className="absolute inset-0 animate-grid-move"
        style={{
          backgroundImage: `
            linear-gradient(${lineColor} ${lineWidth}px, transparent ${lineWidth}px),
            linear-gradient(90deg, ${lineColor} ${lineWidth}px, transparent ${lineWidth}px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      <div className="relative z-10">{children}</div>
      <style jsx>{`
        @keyframes grid-move {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 50px 50px;
          }
        }
        .animate-grid-move {
          animation: grid-move 2s linear infinite;
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// RETRO GRID - Cyberpunk style grid
// =============================================================================

interface RetroGridProps {
  className?: string
  angle?: number
}

export function RetroGrid({ className, angle = 65 }: RetroGridProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden opacity-50 [perspective:200px]',
        className
      )}
    >
      <div
        className="absolute inset-0 [transform:rotateX(var(--grid-angle))]"
        style={{ '--grid-angle': `${angle}deg` } as React.CSSProperties}
      >
        <div
          className="animate-grid-fade"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--accent)) 1px, transparent 0),
              linear-gradient(to bottom, hsl(var(--accent)) 1px, transparent 0)
            `,
            backgroundSize: '75px 75px',
            backgroundRepeat: 'repeat',
            height: '300vh',
            inset: '0 -50%',
            marginLeft: '-50%',
            position: 'absolute',
            width: '200%',
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      <style jsx>{`
        @keyframes grid-fade {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 0.3;
          }
        }
        .animate-grid-fade {
          animation: grid-fade 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// STARFIELD - Animated stars background
// =============================================================================

interface StarfieldProps {
  starCount?: number
  speedFactor?: number
  className?: string
}

export function Starfield({
  starCount = 200,
  speedFactor = 0.05,
  className,
}: StarfieldProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()

    const stars: Array<{ x: number; y: number; z: number; size: number }> = []
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width - centerX,
        y: Math.random() * canvas.height - centerY,
        z: Math.random() * 1000,
        size: Math.random() * 2,
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        star.z -= speedFactor * 10

        if (star.z <= 0) {
          star.z = 1000
          star.x = Math.random() * canvas.width - centerX
          star.y = Math.random() * canvas.height - centerY
        }

        const k = 128 / star.z
        const px = star.x * k + centerX
        const py = star.y * k + centerY

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          const size = (1 - star.z / 1000) * star.size
          const brightness = 1 - star.z / 1000
          ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`
          ctx.fillRect(px, py, size, size)
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [starCount, speedFactor])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 pointer-events-none', className)}
    />
  )
}
