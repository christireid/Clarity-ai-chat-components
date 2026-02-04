'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

/**
 * FloatingAccents - Elegant floating geometric elements for premium hero
 *
 * Features:
 * - Subtle parallax response to mouse movement
 * - Refined glassmorphism with gradient borders
 * - Soft glow effects that complement the particle system
 * - Multiple layers of depth for visual interest
 */

interface FloatingElementProps {
  size: number
  x: number
  y: number
  depth: number // 1-3, affects parallax strength and opacity
  variant: 'ring' | 'dot' | 'line' | 'gradient-orb'
  delay: number
}

function FloatingElement({ size, x, y, depth, variant, delay }: FloatingElementProps) {
  const prefersReducedMotion = useReducedMotion()

  // Parallax multiplier based on depth (deeper = moves more)
  const parallaxStrength = depth * 0.015

  // Mouse position for parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring physics for parallax
  const springConfig = { damping: 50, stiffness: 100 }
  const smoothMouseX = useSpring(mouseX, springConfig)
  const smoothMouseY = useSpring(mouseY, springConfig)

  // Transform mouse position to element offset
  const translateX = useTransform(smoothMouseX, [-500, 500], [-30 * parallaxStrength, 30 * parallaxStrength])
  const translateY = useTransform(smoothMouseY, [-500, 500], [-30 * parallaxStrength, 30 * parallaxStrength])

  // Track mouse movement
  useEffect(() => {
    if (prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      mouseX.set(e.clientX - centerX)
      mouseY.set(e.clientY - centerY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY, prefersReducedMotion])

  // Base opacity based on depth
  const baseOpacity = depth === 1 ? 0.6 : depth === 2 ? 0.4 : 0.25

  // Render different variants
  const renderElement = () => {
    switch (variant) {
      case 'ring':
        return (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              x: translateX,
              y: translateY,
              left: `${x}%`,
              top: `${y}%`,
              border: '1px solid',
              borderColor: 'rgba(129, 140, 248, 0.3)',
              background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.05) 0%, rgba(244, 114, 182, 0.05) 100%)',
              boxShadow: '0 0 20px rgba(129, 140, 248, 0.1), inset 0 0 20px rgba(244, 114, 182, 0.05)',
              opacity: baseOpacity,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: baseOpacity,
              scale: 1,
              rotate: [0, 360],
            }}
            viewport={{ once: true }}
            transition={{
              opacity: { duration: 1, delay },
              scale: { duration: 1, delay },
              rotate: {
                duration: 60 + depth * 20,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          />
        )

      case 'dot':
        return (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              x: translateX,
              y: translateY,
              left: `${x}%`,
              top: `${y}%`,
              background: 'linear-gradient(135deg, #818cf8 0%, #f472b6 100%)',
              boxShadow: `0 0 ${size}px rgba(129, 140, 248, 0.4), 0 0 ${size * 2}px rgba(244, 114, 182, 0.2)`,
              opacity: baseOpacity,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: baseOpacity,
              scale: [1, 1.2, 1],
            }}
            viewport={{ once: true }}
            transition={{
              opacity: { duration: 0.8, delay },
              scale: {
                duration: 3 + depth,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          />
        )

      case 'line':
        return (
          <motion.div
            className="absolute"
            style={{
              width: size,
              height: 1,
              x: translateX,
              y: translateY,
              left: `${x}%`,
              top: `${y}%`,
              background: 'linear-gradient(90deg, transparent 0%, rgba(129, 140, 248, 0.5) 50%, transparent 100%)',
              opacity: baseOpacity,
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{
              opacity: baseOpacity,
              scaleX: 1,
            }}
            viewport={{ once: true }}
            transition={{
              opacity: { duration: 1.5, delay },
              scaleX: { duration: 1.5, delay },
            }}
          />
        )

      case 'gradient-orb':
        return (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              x: translateX,
              y: translateY,
              left: `${x}%`,
              top: `${y}%`,
              background: 'radial-gradient(circle at 30% 30%, rgba(129, 140, 248, 0.15) 0%, rgba(244, 114, 182, 0.08) 50%, transparent 70%)',
              filter: `blur(${size * 0.1}px)`,
              opacity: baseOpacity * 0.8,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: baseOpacity * 0.8,
              scale: [1, 1.1, 1],
            }}
            viewport={{ once: true }}
            transition={{
              opacity: { duration: 2, delay },
              scale: {
                duration: 8 + depth * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          />
        )

      default:
        return null
    }
  }

  return renderElement()
}

export function FloatingAccents() {
  const prefersReducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render during SSR or with reduced motion
  if (!mounted || prefersReducedMotion) return null

  // Define floating elements with careful positioning
  const elements: FloatingElementProps[] = [
    // Top left area - subtle rings
    { size: 80, x: 8, y: 15, depth: 2, variant: 'ring', delay: 0.2 },
    { size: 4, x: 12, y: 20, depth: 1, variant: 'dot', delay: 0.4 },

    // Top right area - gradient orbs
    { size: 120, x: 85, y: 8, depth: 3, variant: 'gradient-orb', delay: 0.3 },
    { size: 3, x: 90, y: 15, depth: 1, variant: 'dot', delay: 0.5 },

    // Left side - decorative lines and dots
    { size: 60, x: 5, y: 45, depth: 2, variant: 'line', delay: 0.6 },
    { size: 5, x: 3, y: 55, depth: 1, variant: 'dot', delay: 0.7 },

    // Right side - rings
    { size: 50, x: 92, y: 50, depth: 2, variant: 'ring', delay: 0.4 },
    { size: 3, x: 95, y: 60, depth: 1, variant: 'dot', delay: 0.8 },

    // Bottom area - larger orbs and subtle elements
    { size: 100, x: 15, y: 75, depth: 3, variant: 'gradient-orb', delay: 0.5 },
    { size: 40, x: 80, y: 80, depth: 2, variant: 'ring', delay: 0.6 },
    { size: 4, x: 75, y: 85, depth: 1, variant: 'dot', delay: 0.9 },

    // Center area - very subtle accents
    { size: 3, x: 30, y: 35, depth: 1, variant: 'dot', delay: 1.0 },
    { size: 3, x: 70, y: 40, depth: 1, variant: 'dot', delay: 1.1 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {elements.map((props, index) => (
        <FloatingElement key={index} {...props} />
      ))}
    </div>
  )
}

export default FloatingAccents
