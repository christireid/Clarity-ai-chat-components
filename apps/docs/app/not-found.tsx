'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { durations } from '@/lib/animations'
import { Home, Search, Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">
      {/* Animated Grid Background */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 dark:opacity-20"
        aria-hidden="true"
      />

      {/* Radial gradient glow */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      {/* Grain texture overlay */}
      <div className="hero-grain" aria-hidden="true" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: durations.slow }}
        className="text-center max-w-md relative z-10"
      >
        {/* Animated 404 with gradient text */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: durations.slow, type: 'spring', stiffness: 100 }}
          className="relative mb-6"
        >
          {/* Glow effect behind the number */}
          <div
            className="absolute inset-0 blur-3xl opacity-30"
            style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #f9a8d4 100%)',
            }}
            aria-hidden="true"
          />
          <h1 className="text-[10rem] sm:text-[12rem] font-bold leading-none bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent relative">
            404
          </h1>
        </motion.div>

        {/* Sparkle icon */}
        <motion.div
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: durations.slow, delay: 0.2 }}
          className="flex justify-center mb-4"
        >
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <Sparkles className="w-6 h-6 text-indigo-500" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.slow, delay: 0.15 }}
          className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.slow, delay: 0.2 }}
          className="text-gray-600 dark:text-gray-400 mb-8 text-balance"
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.slow, delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          {/* Primary CTA with shimmer effect */}
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative px-6 py-3 min-h-[48px] bg-gradient-to-r from-brand-500 via-purple-500 to-brand-500 bg-[length:200%_100%] hover:bg-[position:100%_0] text-white rounded-xl font-medium transition-all duration-500 shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.35)] flex items-center justify-center gap-2 overflow-hidden focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {/* Shimmer effect overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:200%_100%] animate-[shimmer_2s_infinite] pointer-events-none" />
              <Home className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Go Home</span>
            </motion.button>
          </Link>

          {/* Secondary CTA with gradient border on hover */}
          <Link href="/learn/quick-start">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-6 py-3 min-h-[48px] bg-bg-secondary hover:bg-bg-tertiary text-text-primary rounded-xl font-medium transition-all border border-border hover:border-transparent flex items-center justify-center gap-2 overflow-hidden focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {/* Gradient border overlay - appears on hover */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  padding: '1px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.5) 0%, rgba(139,92,246,0.3) 50%, rgba(244,114,182,0.4) 100%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
                aria-hidden="true"
              />
              <Search className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Browse Docs</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Helpful links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: durations.slow, delay: 0.4 }}
          className="mt-10 pt-6 border-t border-border/50"
        >
          <p className="text-sm text-text-tertiary mb-3">Popular pages</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Components', href: '/reference/components' },
              { label: 'Hooks', href: '/reference/hooks' },
              { label: 'Themes', href: '/learn/theming' },
              { label: 'Examples', href: '/examples' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary bg-bg-secondary/50 hover:bg-bg-secondary rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
