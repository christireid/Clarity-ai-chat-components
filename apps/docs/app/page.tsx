import Link from 'next/link'
import { HeroSection } from '@/components/Layout/HeroSection'
import { FeaturesGrid } from '@/components/Layout/FeaturesGrid'
import { LiveChatDemo } from '@/components/Layout/LiveChatDemo'
import { CodeExample } from '@/components/Demo/CodeExample'
import { PerformanceComparison } from '@/components/Diagrams/PerformanceComparison'
import { FeatureMatrix } from '@/components/Diagrams/FeatureMatrix'
import {
  Sparkles,
  Zap,
  Palette,
  Accessibility,
  Code,
  Rocket,
  Heart,
  Layers,
  Smartphone,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection
        title={
          <>
            Beautiful AI Chat UIs
            <br />
            <span className="text-brand-500">Built for React</span>
          </>
        }
        description="Production-ready React components for building stunning chat interfaces. Type-safe, accessible, and ridiculously customizable."
        primaryCta={{
          text: 'Get Started',
          href: '/learn/quick-start',
        }}
        secondaryCta={{
          text: 'Live Demo',
          href: '#demo',
        }}
      />

      {/* Live Demo Section */}
      <section id="demo" className="container-docs py-24 scroll-mt-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
          <p className="text-xl text-text-secondary">
            Experience the power of Clarity Chat. Try the interactive demo below.
          </p>
        </div>

        <LiveChatDemo />
      </section>

      {/* Quick Example */}
      <section className="bg-bg-secondary py-24">
        <div className="container-docs">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Start Building in Seconds</h2>
            <p className="text-xl text-text-secondary">
              Copy, paste, and customize. It's that simple.
            </p>
          </div>

          <CodeExample
            title="Your First Chat Window"
            code={`import { ChatWindow, Message } from '@clarity-chat/react'

function App() {
  const [messages, setMessages] = useState<Message[]>([])

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={(text) => {
        setMessages([...messages, {
          id: Date.now().toString(),
          text,
          sender: 'user',
          timestamp: new Date(),
        }])
      }}
      placeholder="Type your message..."
      height="600px"
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
          <h2 className="text-4xl font-bold mb-4">Why Clarity Chat?</h2>
          <p className="text-xl text-text-secondary">
            Everything you need to build production-ready chat interfaces
          </p>
        </div>

        <FeaturesGrid
          features={[
            {
              icon: <Layers className="w-8 h-8" />,
              title: '70+ Components',
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
              description:
                'Built with Tailwind CSS. 11 themes included. Override any style. Dark mode by default.',
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
              Optimized for Performance
            </h2>
            <p className="text-xl text-text-secondary">
              After comprehensive React.memo optimization
            </p>
          </div>
          <PerformanceComparison />
        </div>

        {/* Feature Comparison */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Most Feature-Complete</h2>
            <p className="text-xl text-text-secondary">
              Compare Clarity to alternatives
            </p>
          </div>
          <FeatureMatrix />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-docs py-24">
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-12 text-center text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>

          <div className="relative">
            <Heart className="w-12 h-12 mx-auto mb-4 fill-current" />
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Install Clarity Chat and build your first chat interface in minutes. Join thousands of developers building beautiful experiences.
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

      {/* Links Section */}
      <section className="container-docs py-24 border-t border-border">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Learn</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/learn/quick-start"
                  className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                >
                  <span>Quick Start</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/learn/tutorial"
                  className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                >
                  <span>Tutorial</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/learn/concepts"
                  className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                >
                  <span>Core Concepts</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Reference</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/reference/components"
                  className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                >
                  <span>Components</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/reference/hooks"
                  className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                >
                  <span>Hooks</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/reference/api"
                  className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                >
                  <span>API Reference</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Community</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://github.com/christireid/Clarity-ai-chat-components"
                  className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                >
                  <span>GitHub</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cookbook"
                  className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                >
                  <span>Cookbook</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/examples"
                  className="text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group"
                >
                  <span>Examples</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
