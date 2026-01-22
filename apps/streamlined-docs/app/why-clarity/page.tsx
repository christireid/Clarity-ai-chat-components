import { BentoGrid, BentoCard } from '@/components/Enhanced/BentoGrid'
import { ScrollReveal, KineticText } from '@/components/Enhanced/ScrollReveal'
import { Code2, Zap, Sparkles, Package, Shield, Globe, Palette, Accessibility } from 'lucide-react'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Why Clarity Chat | Clarity Chat UI',
  description: 'Discover why developers choose Clarity Chat for building beautiful, accessible chat interfaces.',
}

export default function WhyClarityPage() {
  return (
    <div className="container-docs py-8 sm:py-12">
      {/* Hero */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/50 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
              Why Developers Love Us
            </span>
          </div>
          
          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            Built for Modern Development
          </KineticText>
          
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Production-ready components that combine beautiful design with enterprise-grade reliability.
          </p>
        </div>
      </ScrollReveal>

      {/* Bento Grid */}
      <ScrollReveal direction="up" delay={0.2}>
        <BentoGrid columns={4} gap="md" className="mb-16">
          {/* Large Feature - Spans 2x2 */}
          <BentoCard
            span={2}
            rowSpan={2}
            gradient="bg-gradient-to-br from-brand-500/10 to-purple-500/10"
            pattern={true}
          >
            <div className="h-full flex flex-col justify-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 text-white mb-6">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4">155+ Components</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-6">
                Production-ready components for every use case. Chat windows, message lists, input fields, and more.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-full text-sm">TypeScript</span>
                <span className="px-3 py-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-full text-sm">React 18+</span>
                <span className="px-3 py-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-full text-sm">Fully Typed</span>
              </div>
            </div>
          </BentoCard>

          {/* Small Feature */}
          <BentoCard>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 text-emerald-500 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">99 Lighthouse</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Optimized for performance with sub-second load times
            </p>
          </BentoCard>

          {/* Small Feature */}
          <BentoCard>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 text-purple-500 mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Enterprise Ready</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Battle-tested in production environments
            </p>
          </BentoCard>

          {/* Medium Feature - Spans 2 columns */}
          <BentoCard span={2}>
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-500 flex-shrink-0">
                <Accessibility className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">WCAG AA Compliant</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Full keyboard navigation, screen reader support, and focus management built-in. Accessibility isn't an afterthought.
                </p>
              </div>
            </div>
          </BentoCard>

          {/* Small Feature */}
          <BentoCard>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 text-pink-500 mb-4">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">15 Themes</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Pre-built themes with full customization
            </p>
          </BentoCard>

          {/* Small Feature */}
          <BentoCard>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 text-indigo-500 mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Framework Agnostic</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Works with Next.js, Vite, CRA, Remix
            </p>
          </BentoCard>

          {/* Wide Feature - Spans 4 columns (full width) */}
          <BentoCard
            span={4}
            gradient="bg-gradient-to-r from-brand-500/5 via-purple-500/5 to-pink-500/5"
          >
            <div className="text-center py-8">
              <h3 className="text-2xl font-bold mb-4">Developer Experience First</h3>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-6">
                We obsess over developer experience. IntelliSense auto-complete, comprehensive docs, copy-paste examples, and helpful error messages.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {[
                  '< 5 min setup',
                  'TypeScript support',
                  'Tree-shakeable',
                  'Zero config',
                  'Hot reload',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>
        </BentoGrid>
      </ScrollReveal>

      {/* Stats Grid */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { value: '155+', label: 'Components', color: 'text-brand-500' },
            { value: '70+', label: 'React Hooks', color: 'text-purple-500' },
            { value: '15', label: 'Themes', color: 'text-pink-500' },
            { value: '99', label: 'Lighthouse Score', color: 'text-emerald-500' },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] text-center"
            >
              <div className={cn('text-4xl font-bold mb-2', stat.color)}>
                {stat.value}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-brand-500/10 via-purple-500/10 to-pink-500/10 border border-brand-200 dark:border-brand-800/50">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Building?</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-xl mx-auto">
            Join thousands of developers building beautiful chat interfaces with Clarity Chat UI.
          </p>
          <a
            href="/get-started"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            Get Started Now
          </a>
        </div>
      </ScrollReveal>
    </div>
  )
}
