'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface Point {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
}

interface GeometricMeshProps {
  className?: string
}

/**
 * GeometricMesh - A stunning interactive geometric mesh animation
 *
 * Features:
 * - Interconnected nodes forming an elegant mesh network
 * - Mouse-responsive parallax and attraction effects
 * - Gradient-colored lines with glow effects
 * - Smooth organic movement with spring physics
 * - Premium glassmorphism aesthetic
 */
export function GeometricMesh({ className }: GeometricMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const pointsRef = useRef<Point[]>([])
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const [mounted, setMounted] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Initialize points in a grid pattern with slight randomization
  const initPoints = useCallback((width: number, height: number) => {
    const points: Point[] = []
    const cols = Math.ceil(width / 100)
    const rows = Math.ceil(height / 80)
    const spacingX = width / cols
    const spacingY = height / rows

    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        const x = i * spacingX + (Math.random() - 0.5) * 30
        const y = j * spacingY + (Math.random() - 0.5) * 30
        points.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
        })
      }
    }
    return points
  }, [])

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    const points = pointsRef.current
    const mouse = mouseRef.current

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Update points
    points.forEach((point) => {
      // Organic floating movement
      const time = Date.now() * 0.001
      const floatX = Math.sin(time + point.baseX * 0.01) * 3
      const floatY = Math.cos(time + point.baseY * 0.01) * 3

      // Mouse interaction
      if (mouse.active) {
        const dx = mouse.x - point.x
        const dy = mouse.y - point.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const maxDist = 200

        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * 0.5
          point.vx += dx * force * 0.02
          point.vy += dy * force * 0.02
        }
      }

      // Spring back to base position
      const springForce = 0.03
      point.vx += (point.baseX + floatX - point.x) * springForce
      point.vy += (point.baseY + floatY - point.y) * springForce

      // Apply damping
      point.vx *= 0.92
      point.vy *= 0.92

      // Update position
      point.x += point.vx
      point.y += point.vy
    })

    // Draw connections
    const maxConnectionDist = 150

    points.forEach((point, i) => {
      points.slice(i + 1).forEach((other) => {
        const dx = other.x - point.x
        const dy = other.y - point.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < maxConnectionDist) {
          const opacity = (1 - dist / maxConnectionDist) * 0.4

          // Create gradient for each line
          const gradient = ctx.createLinearGradient(point.x, point.y, other.x, other.y)
          gradient.addColorStop(0, `rgba(129, 140, 248, ${opacity})`) // Indigo
          gradient.addColorStop(0.5, `rgba(168, 85, 247, ${opacity})`) // Purple
          gradient.addColorStop(1, `rgba(244, 114, 182, ${opacity})`) // Pink

          ctx.beginPath()
          ctx.moveTo(point.x, point.y)
          ctx.lineTo(other.x, other.y)
          ctx.strokeStyle = gradient
          ctx.lineWidth = 1
          ctx.stroke()
        }
      })
    })

    // Draw nodes with glow
    points.forEach((point) => {
      // Outer glow
      const glowGradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 12)
      glowGradient.addColorStop(0, 'rgba(129, 140, 248, 0.3)')
      glowGradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.1)')
      glowGradient.addColorStop(1, 'rgba(244, 114, 182, 0)')

      ctx.beginPath()
      ctx.arc(point.x, point.y, 12, 0, Math.PI * 2)
      ctx.fillStyle = glowGradient
      ctx.fill()

      // Core node
      const coreGradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 3)
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
      coreGradient.addColorStop(0.5, 'rgba(129, 140, 248, 0.6)')
      coreGradient.addColorStop(1, 'rgba(244, 114, 182, 0.3)')

      ctx.beginPath()
      ctx.arc(point.x, point.y, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = coreGradient
      ctx.fill()
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(dpr, dpr)
      }

      setDimensions({ width: rect.width, height: rect.height })
      pointsRef.current = initPoints(rect.width, rect.height)
    }

    setMounted(true)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [initPoints])

  // Start animation
  useEffect(() => {
    if (!mounted) return

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mounted, animate])

  // Handle mouse movement
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false
  }, [])

  if (!mounted) return null

  return (
    <div className={`absolute inset-0 overflow-hidden ${className || ''}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  )
}

export default GeometricMesh
