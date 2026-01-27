import { HeroSection } from '@/components/Layout/HeroSection'
import { FeaturesGrid } from '@/components/Layout/FeaturesGrid'
import { SocialProof } from '@/components/Layout/SocialProof'
import { QuickStartTutorial } from '@/components/Layout/QuickStartTutorial'
import { ScrollReveal, KineticText } from '@/components/Enhanced/ScrollReveal'
import {
  Zap,
  Accessibility,
  Code2,
  DollarSign,
  Brain,
  Command,
  Search,
  Library,
} from 'lucide-react'

// ISR Configuration: Home page has high traffic, revalidate every 30 minutes
export const revalidate = 1800

export default function Page() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection
        title={
          <>
            Build Production AI Chat Interfaces
            <br />
            <span className="bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              With Token Tracking & Streaming Built-In
            </span>
          </>
        }
        description="React components focused on production AI features: token optimization, real-time streaming, conversation memory, and command palettes. TypeScript-first, accessible, and battle-tested."
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
              Built with modern best practices, accessibility standards, and
              performance optimization.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.4}>
          <FeaturesGrid
            features={[
              {
                icon: <DollarSign className="w-5 h-5" />,
                title: 'Token Optimization',
                description:
                  'TokenUsageMeter, TokenBudgetBar, and useTokenBudget hook for real-time AI cost tracking and control.',
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: 'True Streaming',
                description:
                  'StreamingMessage and StreamingProgress for smooth, real-time AI responses with proper loading states.',
              },
              {
                icon: <Brain className="w-5 h-5" />,
                title: 'Conversation Memory',
                description:
                  'MemoryActivityIndicator and useMemoryFeedback for context-aware chat experiences.',
              },
              {
                icon: <Command className="w-5 h-5" />,
                title: 'Command Palette',
                description:
                  'Built-in CommandPalette component for keyboard-first navigation and quick actions.',
              },
              {
                icon: <Search className="w-5 h-5" />,
                title: 'Advanced Search',
                description:
                  'SearchFiltersPanel for filtering and finding messages in long conversations.',
              },
              {
                icon: <Library className="w-5 h-5" />,
                title: 'Prompt Library',
                description:
                  'PromptLibrary and TemplateMarketplace for managing reusable prompt templates.',
              },
              {
                icon: <Code2 className="w-5 h-5" />,
                title: 'TypeScript First',
                description:
                  'Fully typed with comprehensive IntelliSense. Catch errors before runtime.',
              },
              {
                icon: <Accessibility className="w-5 h-5" />,
                title: 'Accessible by Default',
                description:
                  'WCAG AA compliant with keyboard navigation, screen readers, and focus management.',
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
              Ready to Build Production AI Chat?
            </KineticText>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
              Stop rebuilding token tracking, streaming UI, and memory management.
              Start with components built for production.
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
