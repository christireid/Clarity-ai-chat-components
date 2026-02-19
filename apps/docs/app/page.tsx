import Link from 'next/link'
import { HeroSection } from '@/components/Layout/HeroSection'
import { QuickStartTutorial } from '@/components/Layout/QuickStartTutorial'
import { FeaturesGrid } from '@/components/Layout/FeaturesGrid'
import { LiveChatDemo } from '@/components/Layout/LiveChatDemo'
import { CodeExample } from '@/components/Demo/CodeExample'
// PerformanceComparison, FeatureMatrix, BundleSizeAnalyzer moved to dedicated pages
// ComponentShowcase removed - redundant hero mockup added unnecessary length
// Testimonials removed - fabricated quotes should not be displayed
// AnimatedBackground is a 'use client' component with built-in lazy loading
import { AnimatedBackground } from '@/components/Layout/AnimatedBackground'
import {
  Zap,
  Palette,
  Accessibility,
  Heart,
  Layers,
} from 'lucide-react'
import { LIBRARY_STATS } from '@/lib/library-stats'

export default function HomePage() {
  return (
    <div className="relative bg-[#FAFAFA] dark:bg-[#050506]">
      {/* Premium animated gradient mesh background - Ultra-Dark Luxury */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Primary indigo orb - top left */}
        <div className="hero-orb-primary top-[-20%] left-[-15%]" />
        {/* Secondary pink orb - bottom right */}
        <div className="hero-orb-secondary bottom-[-15%] right-[-10%]" />
        {/* Accent purple orb - center */}
        <div className="hero-orb-accent top-[30%] left-[50%] -translate-x-1/2" />
        {/* Aurora wave effect */}
        <div className="hero-aurora top-0 left-0" />
        {/* Subtle grain texture for premium depth */}
        <div className="hero-grain" />
        {/* Radial fade from center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-white/40 dark:from-white/3 to-transparent" />
      </div>
      <AnimatedBackground />

      {/* Main content landmark for accessibility */}
      <main id="main-content">
      {/* Hero Section */}
      <HeroSection
        title={
          <>
            Finally, Chat UIs
            <br />
            <span className="text-brand-500">That Don't Fight You</span>
          </>
        }
        description="Cut API costs dramatically with intelligent Token Optimization. 155+ robust components with streaming, accessibility, and theming—all built-in. Stop rebuilding chat. Start shipping."
        installCommand="Coming Soon — Join the Waitlist"
        primaryCta={{
          text: 'Join Waitlist',
          href: '/waitlist',
        }}
        secondaryCta={{
          text: 'See It Live',
          href: '#demo',
        }}
      />

      {/* Quick Start Tutorial */}
      <QuickStartTutorial />

      {/* Live Demo Section - Glassmorphism card */}
      <section id="demo" className="relative scroll-mt-20 py-16 md:py-24">
        <div className="container-docs">
          {/* Glassmorphism container */}
          <div className="relative rounded-2xl overflow-hidden">
            {/* Glass background */}
            <div className="absolute inset-0 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl" />

            {/* Gradient accent line at top - Premium Indigo */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            <div className="relative p-6 md:p-10">
              <div className="grid md:grid-cols-[1fr,1.4fr] gap-8 md:gap-12 items-start">
                {/* Left - Text content */}
                <div className="md:sticky md:top-24">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-pink-500/10 border border-indigo-500/20 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[11px] font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Live Demo</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-semibold mb-2 text-neutral-900 dark:text-white">See What You're Getting</h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    No signup. No surprises. Just a chat UI that works.
                  </p>
                </div>
                {/* Right - Demo */}
                <div className="relative">
                  <LiveChatDemo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Example - Floating glassmorphism card */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Animated gradient orbs - Premium Indigo to Pink */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-10 left-20 w-64 h-64 bg-gradient-to-tr from-pink-500/15 to-indigo-400/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '14s' }} />

        <div className="container-docs relative">
          <div className="grid md:grid-cols-[1fr,0.8fr] gap-8 md:gap-16 items-center">
            {/* Left - Glassmorphism code card */}
            <div className="order-2 md:order-1 relative">
              {/* Floating effect shadow - Premium Indigo to Pink */}
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl opacity-60" />

              <div className="relative bg-white/60 dark:bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/30 dark:border-white/10 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
                {/* Gradient accent - Premium Indigo */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-pink-500/0" />

                <CodeExample
                  title="Your First Chat Window"
                  code={`import { ClarityChatApp } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

// Robust chat in one line
export default function App() {
  return <ClarityChatApp api="/api/chat" />
}

// Need more control? Use the hook:
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function CustomChat() {
  const chat = useClarityChat({ api: '/api/chat' })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={(content) => chat.append({ role: 'user', content })}
    />
  )
}`}
                  language="tsx"
                  showLineNumbers
                />
              </div>
            </div>

            {/* Right - Text */}
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-pink-500/10 border border-indigo-500/20 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Quick Start</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 text-neutral-900 dark:text-white">Start Building in Seconds</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-5">
                Copy, paste, and customize. Robust chat in one line of code.
              </p>
              <Link
                href="/learn/quick-start"
                className="group inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-lg hover:opacity-90 transition-all"
              >
                View full guide
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Bento-style glassmorphism grid */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="container-docs relative">
          {/* Section header - left aligned for asymmetry */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-pink-500/10 border border-indigo-500/20 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Why Clarity</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 dark:text-white">Built for Developers Who Ship</h2>
          </div>

          {/* Equal-sized feature grid with glassmorphism */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Feature cards - all same size with balanced padding */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-pink-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full p-4 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-xl border border-white/30 dark:border-white/10 overflow-hidden flex flex-col justify-between min-h-[120px]">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/30 to-pink-500/0" />
                <Layers className="w-5 h-5 text-indigo-500 mb-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-0.5">155+ Components</h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                    Everything you need in one package.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="h-full p-4 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-xl border border-white/30 dark:border-white/10 flex flex-col justify-between min-h-[120px]">
                <Zap className="w-5 h-5 text-indigo-500 mb-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-0.5">Lightning Fast</h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">Virtual scrolling. Tree-shakeable.</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="h-full p-4 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-xl border border-white/30 dark:border-white/10 flex flex-col justify-between min-h-[120px]">
                <Palette className="w-5 h-5 text-pink-500 mb-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-0.5">Customizable</h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">{LIBRARY_STATS.themes} themes. Full control.</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="h-full p-4 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-xl border border-white/30 dark:border-white/10 flex flex-col justify-between min-h-[120px]">
                <Accessibility className="w-5 h-5 text-purple-500 mb-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-0.5">Accessible</h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">WCAG AA+. Keyboard nav.</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="h-full p-4 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 backdrop-blur-xl rounded-xl border border-indigo-500/20 flex flex-col justify-between min-h-[120px]">
                <Heart className="w-5 h-5 text-indigo-500 mb-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-0.5">Coming Soon</h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">Join the waitlist today.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Dramatic glassmorphism with animated glow */}
      <section className="relative py-20 md:py-32 overflow-hidden" aria-labelledby="cta-heading">
        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-[#0A0A0B]" aria-hidden="true" />

        {/* Animated gradient mesh - Premium Indigo to Pink */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-transparent rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-gradient-to-tl from-pink-600/20 via-indigo-500/15 to-transparent rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s' }} />
        </div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" aria-hidden="true" />

        {/* Top gradient line - Premium Indigo accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" aria-hidden="true" />

        <div className="container-docs relative">
          <div className="text-center max-w-2xl mx-auto">
            {/* Glassmorphism badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-pink-400 animate-pulse" aria-hidden="true" />
              <span className="text-xs font-medium text-white/80">Get Started Today</span>
            </div>

            <h2 id="cta-heading" className="text-3xl md:text-5xl font-semibold mb-4 text-white tracking-tight">
              Ship Your First{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Chat Today
              </span>
            </h2>

            <p className="text-sm md:text-base text-neutral-400 mb-8 leading-relaxed max-w-md mx-auto">
              One install. One import. Robust chat in sixty seconds.
            </p>

            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/waitlist"
                className="group relative inline-flex items-center gap-2 px-6 py-3 overflow-hidden rounded-xl font-medium text-sm animate-cta"
              >
                <span className="relative text-white">Join Waitlist</span>
                <span className="relative text-white transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
              <Link
                href="/reference/components"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-all border border-white/10"
              >
                Browse Components
              </Link>
            </div>
          </div>
        </div>
      </section>
      </main>
    </div>
  )
}
