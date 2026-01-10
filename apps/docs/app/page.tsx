import Link from 'next/link'
import { HeroSection } from '@/components/Layout/HeroSection'
import { QuickStartTutorial } from '@/components/Layout/QuickStartTutorial'
import { FeaturesGrid } from '@/components/Layout/FeaturesGrid'
import { LiveChatDemo } from '@/components/Layout/LiveChatDemo'
import { CodeExample } from '@/components/Demo/CodeExample'
import { PerformanceComparison } from '@/components/Diagrams/PerformanceComparison'
import { FeatureMatrix } from '@/components/Diagrams/FeatureMatrix'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'
import { ComponentShowcase } from '@/components/Layout/ComponentShowcase'
import { BundleSizeAnalyzer } from '@/components/Diagrams/BundleSizeAnalyzer'
import { Testimonials } from '@/components/Layout/Testimonials'
// AnimatedBackground is a 'use client' component with built-in lazy loading
import { AnimatedBackground } from '@/components/Layout/AnimatedBackground'
import {
  Zap,
  Palette,
  Accessibility,
  Code,
  Heart,
  Layers,
  Smartphone,
} from 'lucide-react'
import { LIBRARY_STATS } from '@/lib/library-stats'

export default function HomePage() {
  return (
    <div className="relative">
      <AnimatedBackground />
      {/* Hero Section */}
      <HeroSection
        title={
          <>
            Finally, Chat UIs
            <br />
            <span className="text-brand-500">That Don't Fight You</span>
          </>
        }
        description="You've rebuilt chat from scratch three times already. Stop. 190+ production-ready components with streaming, accessibility, and theming—all built-in. Copy, paste, ship."
        installCommand="npm install @clarity-chat/react"
        primaryCta={{
          text: 'Get Started in 60s',
          href: '/learn/quick-start',
        }}
        secondaryCta={{
          text: 'See It Live',
          href: '#demo',
        }}
      />

      {/* Quick Start Tutorial */}
      <QuickStartTutorial />

      {/* Live Demo Section */}
      <section id="demo" className="container-docs py-24 scroll-mt-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">See What You're Getting</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            No signup. No surprises. Just a chat UI that works.
          </p>
        </div>

        <LiveChatDemo />
      </section>

      {/* Quick Example */}
      <section className="bg-bg-secondary py-24">
        <div className="container-docs">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Start Building in Seconds
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Copy, paste, and customize. It's that simple.
            </p>
          </div>

          <CodeExample
            title="Your First Chat Window"
            code={`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

// Production-ready chat in one line
export default function App() {
  return <ClarityChat api="/api/chat" />
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
      </section>

      {/* Features Grid */}
      <section className="container-docs py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Built for Developers Who Ship
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need. Nothing you don't.
          </p>
        </div>

        <FeaturesGrid
          features={[
            {
              icon: <Layers className="w-8 h-8" />,
              title: '190+ Components',
              description:
                'From basic messages to advanced patterns like command palettes, drag & drop, and context menus.',
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: 'Lightning Fast',
              description:
                'Virtual scrolling for 1000+ messages. Tree-shakeable. Optimized with React.memo. Instant performance.',
            },
            {
              icon: <Palette className="w-8 h-8" />,
              title: 'Fully Customizable',
              description: `Built with Tailwind CSS. ${LIBRARY_STATS.themes} themes included. Override any style. Dark mode by default.`,
            },
            {
              icon: <Accessibility className="w-8 h-8" />,
              title: 'Accessible by Default',
              description:
                'WCAG AAA compliant. Full keyboard navigation, screen reader support, and ARIA attributes.',
            },
            {
              icon: <Code className="w-8 h-8" />,
              title: 'TypeScript First',
              description:
                'Comprehensive type definitions. IntelliSense for every prop. Catch errors at compile time.',
            },
            {
              icon: <Smartphone className="w-8 h-8" />,
              title: 'Mobile Optimized',
              description:
                'Touch gestures. Virtual keyboard handling. Responsive design. Perfect on any device.',
            },
          ]}
        />

        {/* Performance Comparison */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Performance You Don't Have to Think About
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Virtual scrolling. React.memo. Tree-shaking. Already done.
            </p>
          </div>
          <PerformanceComparison />
        </div>

        {/* Feature Comparison */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              More Features, Less Work
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See how Clarity stacks up against the alternatives.
            </p>
          </div>
          <FeatureMatrix />
        </div>
      </section>

      {/* Testimonials - Developer social proof */}
      <Testimonials />

      {/* CTA Section */}
      <section className="container-docs py-24">
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-12 text-center text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>

          <div className="relative">
            <Heart className="w-12 h-12 mx-auto mb-4 fill-current" />
            <h2 className="text-4xl font-bold mb-4">
              Ship Your First Chat Today
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              One install. One import. One minute to a working chat. No
              boilerplate. No configuration hell. Just results.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/learn/quick-start"
                className="px-8 py-3 bg-white text-brand-600 rounded-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
              >
                Quick Start →
              </Link>
              <Link
                href="/reference/components"
                className="px-8 py-3 bg-brand-700 text-white rounded-lg font-semibold hover:bg-brand-800 transition-colors border border-white/20"
              >
                Browse Components
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <ComponentShowcase />

      {/* Bundle Size Analyzer */}
      <BundleSizeAnalyzer />

      {/* Links Section */}
      <section className="container-docs py-24 border-t border-border">
        <ScrollReveal
          stagger
          staggerDelay={0.15}
          className="grid md:grid-cols-3 gap-8"
        >
          <ScrollRevealItem>
            <div>
              <h3 className="text-2xl font-bold mb-4">Learn</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/learn/quick-start"
                    className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span>Quick Start</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/learn/tutorial"
                    className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span>Tutorial</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/learn/concepts"
                    className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span>Core Concepts</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <div>
              <h3 className="text-2xl font-bold mb-4">Reference</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/reference/components"
                    className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span>Components</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reference/hooks"
                    className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span>Hooks</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reference/api"
                    className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span>API Reference</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <div>
              <h3 className="text-2xl font-bold mb-4">Community</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="https://github.com/christireid/Clarity-ai-chat-components"
                    className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span>GitHub</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookbook"
                    className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span>Cookbook</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/examples"
                    className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span>Examples</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </ScrollRevealItem>
        </ScrollReveal>
      </section>
    </div>
  )
}
