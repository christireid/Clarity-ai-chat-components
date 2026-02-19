import { ComponentShowcase } from '@/components/Layout/ComponentShowcase'
import { ScrollReveal, ScrollRevealStagger, ScrollRevealStaggerItem, KineticText } from '@/components/Enhanced/ScrollReveal'
import Link from 'next/link'
import {
  Play,
  Code2,
  ChefHat,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
} from 'lucide-react'

export default function Page() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 border-b border-neutral-200/60 dark:border-neutral-800/60">
        {/* Background gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-purple-500/5 to-pink-500/5"
          aria-hidden="true"
        />

        <div className="container-docs relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal direction="down" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/50 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                  155+ Components & 70+ Hooks
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Explore{' '}
                <KineticText
                  gradient={true}
                  className="inline-block bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                >
                  Interactive Examples
                </KineticText>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
                See our components in action. Interactive demos, code examples,
                and robust recipes to accelerate your development.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/explore/demos"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <Play className="w-4 h-4" />
                  View Demos
                </Link>
                <Link
                  href="/explore/examples"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg font-medium border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <Code2 className="w-4 h-4" />
                  Browse Examples
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <ScrollReveal direction="up" delay={0.2}>
        <ComponentShowcase />
      </ScrollReveal>

      {/* Explore Sections Grid */}
      <section className="container-docs py-16 sm:py-20 md:py-24">
        <ScrollReveal direction="up" delay={0.2}>
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <KineticText className="text-3xl sm:text-4xl font-bold mb-4">
              What would you like to explore?
            </KineticText>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
              Choose your learning path based on what you need right now.
            </p>
          </div>
        </ScrollReveal>

        <ScrollRevealStagger staggerDelay={0.1}>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Demos Card */}
          <ScrollRevealStaggerItem>
            <Link
            href="/explore/demos"
            className="group relative rounded-xl overflow-hidden bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-transparent transition-all duration-300 hover:shadow-[0_4px_8px_rgba(99,102,241,0.08),0_8px_16px_rgba(99,102,241,0.06),0_16px_32px_rgba(99,102,241,0.04)] dark:hover:shadow-[0_4px_8px_rgba(129,140,248,0.15),0_8px_16px_rgba(129,140,248,0.1),0_16px_32px_rgba(129,140,248,0.05)] hover:-translate-y-1"
          >
            {/* Gradient border on hover */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                padding: '1px',
                background:
                  'linear-gradient(135deg, rgba(129,140,248,0.5) 0%, rgba(167,139,250,0.3) 50%, rgba(249,168,212,0.4) 100%)',
                WebkitMask:
                  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/80 dark:to-purple-950/60 text-brand-500 dark:text-brand-400 mb-4 ring-1 ring-brand-200/50 dark:ring-brand-800/50">
                <Play className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Interactive Demos
              </h3>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Fully interactive component demonstrations with live controls
                and real-time updates. See it working before you build.
              </p>

              <div className="flex items-center text-brand-500 text-sm font-medium group-hover:gap-2 transition-all">
                Explore Demos
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"
              aria-hidden="true"
            />
          </Link>
          </ScrollRevealStaggerItem>

          {/* Examples Card */}
          <ScrollRevealStaggerItem>
            <Link
            href="/explore/examples"
            className="group relative rounded-xl overflow-hidden bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-transparent transition-all duration-300 hover:shadow-[0_4px_8px_rgba(99,102,241,0.08),0_8px_16px_rgba(99,102,241,0.06),0_16px_32px_rgba(99,102,241,0.04)] dark:hover:shadow-[0_4px_8px_rgba(129,140,248,0.15),0_8px_16px_rgba(129,140,248,0.1),0_16px_32px_rgba(129,140,248,0.05)] hover:-translate-y-1"
          >
            {/* Gradient border on hover */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                padding: '1px',
                background:
                  'linear-gradient(135deg, rgba(129,140,248,0.5) 0%, rgba(167,139,250,0.3) 50%, rgba(249,168,212,0.4) 100%)',
                WebkitMask:
                  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/80 dark:to-pink-950/60 text-purple-500 dark:text-purple-400 mb-4 ring-1 ring-purple-200/50 dark:ring-purple-800/50">
                <Code2 className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Code Examples
              </h3>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Copy-paste code snippets for common use cases. TypeScript
                examples with full type definitions and inline documentation.
              </p>

              <div className="flex items-center text-purple-500 text-sm font-medium group-hover:gap-2 transition-all">
                Browse Examples
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-brand-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"
              aria-hidden="true"
            />
          </Link>
          </ScrollRevealStaggerItem>

          {/* Recipes Card */}
          <ScrollRevealStaggerItem>
            <Link
            href="/explore/recipes"
            className="group relative rounded-xl overflow-hidden bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-transparent transition-all duration-300 hover:shadow-[0_4px_8px_rgba(99,102,241,0.08),0_8px_16px_rgba(99,102,241,0.06),0_16px_32px_rgba(99,102,241,0.04)] dark:hover:shadow-[0_4px_8px_rgba(129,140,248,0.15),0_8px_16px_rgba(129,140,248,0.1),0_16px_32px_rgba(129,140,248,0.05)] hover:-translate-y-1"
          >
            {/* Gradient border on hover */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                padding: '1px',
                background:
                  'linear-gradient(135deg, rgba(129,140,248,0.5) 0%, rgba(167,139,250,0.3) 50%, rgba(249,168,212,0.4) 100%)',
                WebkitMask:
                  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-50 to-amber-50 dark:from-pink-950/80 dark:to-amber-950/60 text-pink-500 dark:text-pink-400 mb-4 ring-1 ring-pink-200/50 dark:ring-pink-800/50">
                <ChefHat className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                Recipes & Patterns
              </h3>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Robust patterns and best practices. Complete solutions
                for common challenges with optimization tips.
              </p>

              <div className="flex items-center text-pink-500 text-sm font-medium group-hover:gap-2 transition-all">
                View Recipes
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-500 via-amber-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"
              aria-hidden="true"
            />
          </Link>
          </ScrollRevealStaggerItem>
        </div>
        </ScrollRevealStagger>
      </section>

      {/* Quick Links Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 border-t border-neutral-200/60 dark:border-neutral-800/60">
        {/* Background gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-brand-500/5 to-pink-500/5"
          aria-hidden="true"
        />

        <div className="container-docs relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
                Looking for something specific?
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Jump directly to what you need.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href="/get-started"
                className="flex items-start gap-4 p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-300 dark:hover:border-brand-700 transition-all group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/50 dark:to-purple-950/50 flex-shrink-0">
                  <Target className="w-5 h-5 text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-brand-500 transition-colors">
                    Quick Start Guide
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Get your first component running in &lt; 5 minutes
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </Link>

              <Link
                href="/api"
                className="flex items-start gap-4 p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-purple-300 dark:hover:border-purple-700 transition-all group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 flex-shrink-0">
                  <Zap className="w-5 h-5 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-purple-500 transition-colors">
                    API Reference
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Complete documentation for all components and hooks
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
