'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft, Compass, Sparkles, Code2, Play } from 'lucide-react'
import { ScrollReveal, KineticText } from '@/components/Enhanced/ScrollReveal'
import { useState } from 'react'

export default function NotFound() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const popularPages = [
    { name: 'Get Started', href: '/get-started', icon: Sparkles, description: 'Quick start guide' },
    { name: 'Explore Demos', href: '/explore/demos', icon: Play, description: 'Interactive examples' },
    { name: 'API Reference', href: '/api', icon: Code2, description: 'Complete documentation' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <ScrollReveal direction="down" delay={0.1}>
          <motion.div
            className="mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="relative inline-block">
              {/* Glow effect */}
              <div
                className="absolute inset-0 blur-3xl opacity-30"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                }}
                aria-hidden="true"
              />
              
              {/* 404 Text */}
              <h1 className="relative text-[120px] sm:text-[180px] font-bold leading-none">
                <span className="bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  404
                </span>
              </h1>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Error Message */}
        <ScrollReveal direction="up" delay={0.2}>
          <KineticText className="text-3xl sm:text-4xl font-bold mb-4">
            Page Not Found
          </KineticText>
          
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
            Looks like this page took a wrong turn. Let's get you back on track.
          </p>
        </ScrollReveal>

        {/* Search Box */}
        <ScrollReveal direction="up" delay={0.3}>
          <form onSubmit={handleSearch} className="mb-12">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
              />
            </div>
          </form>
        </ScrollReveal>

        {/* Quick Actions */}
        <ScrollReveal direction="up" delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg font-medium border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </ScrollReveal>

        {/* Popular Pages */}
        <ScrollReveal direction="up" delay={0.5}>
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Compass className="w-5 h-5 text-brand-500" />
              <h2 className="text-xl font-semibold">Popular Pages</h2>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-4">
              {popularPages.map((page, index) => {
                const Icon = page.icon
                return (
                  <motion.div
                    key={page.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                  >
                    <Link
                      href={page.href}
                      className="block p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 hover:shadow-lg group"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-brand-500 mb-4 mx-auto group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-brand-500 transition-colors">
                        {page.name}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {page.description}
                      </p>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Fun Message */}
        <ScrollReveal direction="up" delay={0.9}>
          <div className="mt-12 text-sm text-neutral-500 dark:text-neutral-600">
            <p>Lost in space? Our AI assistant can help guide you!</p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
