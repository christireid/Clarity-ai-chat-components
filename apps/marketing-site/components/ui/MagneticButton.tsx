'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useMagnetic, Button } from '@clarity-chat/primitives'
import { cn } from '@/lib/utils'

interface ButtonProps {
  children: React.ReactNode
  href?: string
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  onClick?: () => void
  icon?: React.ReactNode
}

export default function MagneticButton({
  children,
  href,
  className = '',
  variant = 'primary',
  onClick,
  icon,
}: ButtonProps) {
  const { ref, position, handleMouseMove, handleMouseLeave } = useMagnetic({ strength: 0.15 })

  const variants = {
    primary: 'bg-gradient-to-r from-clarity-500 to-cosmic-500 text-white shadow-lg shadow-clarity-500/20 hover:shadow-clarity-400/30 border-none',
    secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20',
    ghost: 'text-gray-300 hover:text-white hover:bg-transparent',
  }

  // Common wrapper for motion behavior
  const MotionWrapper = ({ children: child }: { children: React.ReactNode }) => (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      {child}
    </motion.div>
  )

  return (
    <MotionWrapper>
      <Button
        asChild={!!href}
        variant="ghost" // Use ghost as base to allow custom styles
        className={cn(
          "relative flex items-center justify-center gap-2 px-6 py-6 rounded-xl font-semibold overflow-hidden h-auto",
          variants[variant],
          className
        )}
        onClick={onClick}
      >
        {href ? (
          <Link href={href}>
            {/* Glossy overlay for primary */}
            {variant === 'primary' && (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {children}
              {icon}
            </span>
          </Link>
        ) : (
          <>
            {/* Glossy overlay for primary */}
            {variant === 'primary' && (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {children}
              {icon}
            </span>
          </>
        )}
      </Button>
    </MotionWrapper>
  )
}
