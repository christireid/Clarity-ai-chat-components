import { HeroSection } from '@/components/Layout/HeroSection'
import { FeaturesGrid } from '@/components/Layout/FeaturesGrid'
import { SocialProof } from '@/components/Layout/SocialProof'
import { QuickStartTutorial } from '@/components/Layout/QuickStartTutorial'
import { ScrollReveal, KineticText } from '@/components/Enhanced/ScrollReveal'
import {
  Zap,
  Palette,
  Globe,
  Accessibility,
  Code2,
  Sparkles,
  Package,
  Shield,
} from 'lucide-react'

export default function Page() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection
        title={
          <>
            Build Beautiful Chat Interfaces
            <br />
            <span className="bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              In Minutes, Not Weeks
            </span>
          </>
        }
        description="A comprehensive React UI library for building beautiful, accessible chat interfaces with 155+ components, 70+ hooks, and 15 themes. Production-ready, fully typed, and optimized for performance."
        primaryCta={{
          text: 'Get Started',
          href: '/get-started',
        }}
        secondaryCta={{
          text: 'View Components',
          href: '/explore',
        }}
        installCommand="npm install @clarity-chat/ui"
        showGitHubStars={true}
      />

      {/* Features Grid */}
      <section className="container-docs py-16 sm:py-20 md:py-24">
        <ScrollReveal direction="up" delay={0.2}>
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <KineticText className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need
            </KineticText>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
              Built with modern best practices, accessibility standards, and performance optimization.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.4}>
            <FeaturesGrid
            features={[
              {
                icon: <Package className="w-5 h-5" />,
                title: 'Production Ready',
                description:
                  '155+ components battle-tested in production. Built with TypeScript, fully typed, and documented.',
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: 'Lightning Fast',
                description:
                  'Optimized bundle size, tree-shakeable, lazy-loaded. Sub-second page loads with 99 Lighthouse score.',
              },
              {
                icon: <Accessibility className="w-5 h-5" />,
                title: 'Accessible by Default',
                description:
                  'WCAG AA compliant. Keyboard navigation, screen readers, focus management all included.',
              },
              {
                icon: <Palette className="w-5 h-5" />,
                title: '15 Beautiful Themes',
                description:
                  'Pre-built themes with dark mode support. Customize every aspect with Tailwind CSS.',
              },
              {
                icon: <Code2 className="w-5 h-5" />,
                title: 'Developer Experience',
                description:
                  'IntelliSense auto-complete, comprehensive docs, copy-paste examples. Start in < 5 minutes.',
              },
              {
                icon: <Sparkles className="w-5 h-5" />,
                title: 'Framer Motion',
                description:
                  'Smooth, performant animations built-in. Respect user motion preferences automatically.',
              },
              {
                icon: <Globe className="w-5 h-5" />,
                title: 'Framework Agnostic',
                description:
                  'Works with Next.js, Vite, CRA, Remix. Server components, client components, both supported.',
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: 'Enterprise Ready',
                description:
                  'Token optimization, cost tracking, error boundaries. Built for scale with production safeguards.',
              },
            ]}
          />
        </ScrollReveal>
      </section>

      {/* Quick Start Tutorial */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="container-docs py-12 sm:py-16">
          <QuickStartTutorial />
        </section>
      </ScrollReveal>

      {/* Social Proof */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="container-docs py-12 sm:py-16 md:py-20">
          <SocialProof />
        </section>
      </ScrollReveal>

      {/* Final CTA */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="relative overflow-hidden py-16 sm:py-20 md:py-24">
          {/* Background gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-purple-500/5 to-pink-500/5"
            aria-hidden="true"
          />

          <div className="container-docs relative z-10 text-center">
            <KineticText className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Ready to build something amazing?
            </KineticText>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
              Join thousands of developers building beautiful chat interfaces with Clarity Chat UI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/get-started"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Get Started Now
              </a>
              <a
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg font-medium border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Browse Components
              </a>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
