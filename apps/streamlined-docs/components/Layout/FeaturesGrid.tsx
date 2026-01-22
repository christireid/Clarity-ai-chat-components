'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  staggerContainer,
  staggerItem,
  iconHover,
} from '@/lib/animations'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface FeaturesGridProps {
  features: Feature[]
}

/**
 * Premium Bento Grid Layout
 * Inspired by Linear, Raycast, and Apple - asymmetric, memorable, sophisticated
 *
 * Layout pattern (8 features):
 * Desktop: [Large][Small][Small]
 *          [Small][Medium][Medium]
 *          [Small][Large]
 *
 * Features multi-layer shadows, gradient borders on hover, and glass effects
 */
export function FeaturesGrid({ features }: FeaturesGridProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  // Bento grid size assignments for visual interest
  // First card is large (spans 2 cols), others vary
  const getBentoSize = (index: number, total: number) => {
    if (total <= 4) return 'normal' // Small grids use uniform sizing

    // For 8 features, create asymmetric pattern
    if (index === 0) return 'large'      // First card large
    if (index === 4 || index === 5) return 'medium' // Middle row has medium cards
    if (index === 7) return 'large'      // Last card large
    return 'small'
  }

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer(0.08)}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr"
    >
      {features.map((feature, index) => {
        const size = getBentoSize(index, features.length)

        return (
          <motion.div
            key={index}
            variants={staggerItem}
            whileHover={{
              y: -4,
              transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
            }}
            className={`
              group relative rounded-xl overflow-hidden
              h-full flex flex-col min-h-[160px]
              transition-all duration-300 ease-out

              /* Base glass effect - Raycast inspired */
              bg-white/60 dark:bg-white/[0.02]
              backdrop-blur-sm

              /* Border with gradient on hover */
              border border-neutral-200/60 dark:border-white/[0.06]
              hover:border-transparent

              /* Multi-layer shadow system - creates depth */
              shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_4px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04)]
              dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.2),0_8px_16px_rgba(0,0,0,0.1)]

              hover:shadow-[0_4px_8px_rgba(99,102,241,0.08),0_8px_16px_rgba(99,102,241,0.06),0_16px_32px_rgba(99,102,241,0.04)]
              dark:hover:shadow-[0_4px_8px_rgba(129,140,248,0.15),0_8px_16px_rgba(129,140,248,0.1),0_16px_32px_rgba(129,140,248,0.05),0_0_40px_rgba(129,140,248,0.08)]

              /* Bento sizing */
              ${size === 'large' ? 'lg:col-span-2 lg:row-span-1' : ''}
              ${size === 'medium' ? 'lg:col-span-1 lg:row-span-1' : ''}
            `}
          >
            {/* Gradient border overlay - shows on hover */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                padding: '1px',
                background: 'linear-gradient(135deg, rgba(129,140,248,0.5) 0%, rgba(167,139,250,0.3) 50%, rgba(249,168,212,0.4) 100%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
              aria-hidden="true"
            />

            {/* Glow effect on hover - subtle radial gradient */}
            <div
              className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-brand-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              aria-hidden="true"
            />

            {/* Content wrapper with padding */}
            <div className="relative z-10 p-5 flex flex-col h-full">
              {/* Icon - premium gradient with ring */}
              <motion.div
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/80 dark:to-purple-950/60 text-brand-500 dark:text-brand-400 mb-4 ring-1 ring-brand-200/50 dark:ring-brand-800/50 shadow-sm"
                {...iconHover}
              >
                {feature.icon}
              </motion.div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-start">
                <h3 className="text-sm font-semibold mb-2 text-neutral-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>

            {/* Bottom accent line - animates on hover */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"
              aria-hidden="true"
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
