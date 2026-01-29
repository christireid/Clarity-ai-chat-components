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
  TrendingDown,
  ArrowRight,
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

      {/* Token Optimization Hero - #1 Differentiator */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 border-y border-neutral-200/60 dark:border-neutral-800/60">
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20"
          aria-hidden="true"
        />

        <div className="container-docs relative z-10">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="max-w-5xl mx-auto">
              {/* Badge */}
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold shadow-lg">
                  <TrendingDown className="w-4 h-4" />
                  #1 Cost Reduction Feature
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400 bg-clip-text text-transparent">
                  Reduce AI Costs by 50-90%
                </span>
              </h2>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl text-center text-neutral-600 dark:text-neutral-400 mb-8 max-w-3xl mx-auto">
                Provider-native caching, intelligent compression, and smart routing work together to dramatically reduce your AI API costs while maintaining quality.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
                <div className="bg-white dark:bg-neutral-900/50 rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-800 text-center backdrop-blur-sm">
                  <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    90%
                  </div>
                  <div className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                    Max Savings
                  </div>
                </div>
                <div className="bg-white dark:bg-neutral-900/50 rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-800 text-center backdrop-blur-sm">
                  <div className="text-2xl md:text-3xl font-bold text-pink-600 dark:text-pink-400 mb-1">
                    87
                  </div>
                  <div className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                    Optimization APIs
                  </div>
                </div>
                <div className="bg-white dark:bg-neutral-900/50 rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-800 text-center backdrop-blur-sm">
                  <div className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                    3
                  </div>
                  <div className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                    Major Providers
                  </div>
                </div>
                <div className="bg-white dark:bg-neutral-900/50 rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-800 text-center backdrop-blur-sm">
                  <div className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                    &lt;100ms
                  </div>
                  <div className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                    Overhead
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/token-optimization"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Explore Token Optimization
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="/guides/token-optimization"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg font-medium border border-neutral-200 dark:border-neutral-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Read the Guide
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

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
                icon: <TrendingDown className="w-5 h-5" />,
                title: 'Token Optimization (50-90% Savings)',
                description:
                  'Provider-native caching, compression, and routing reduce costs by 50-90% with 87 optimization APIs.',
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
