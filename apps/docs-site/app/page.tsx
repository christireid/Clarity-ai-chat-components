import Link from 'next/link'
import { HeroSection } from '@/components/Layout/HeroSection'
import { FeaturesGrid } from '@/components/Layout/FeaturesGrid'
import { CodeExample } from '@/components/Demo/CodeExample'
import { 
  Sparkles, 
  Zap, 
  Palette, 
  Accessibility,
  Code,
  Rocket
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection
        title={
          <>
            Build Beautiful Chat UIs
            <br />
            <span className="text-brand-500">Lightning Fast</span>
          </>
        }
        description="A comprehensive React UI library with 70+ components, 30+ hooks, and 150+ animations. Built with TypeScript, Tailwind CSS, and Framer Motion."
        primaryCta={{
          text: 'Get Started',
          href: '/learn/quick-start',
        }}
        secondaryCta={{
          text: 'View Components',
          href: '/reference/components',
        }}
      />

      {/* Quick Example */}
      <section className="container-docs py-24">
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
      </section>

      {/* Features Grid */}
      <section className="bg-bg-secondary py-24">
        <div className="container-docs">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Clarity Chat?</h2>
            <p className="text-xl text-text-secondary">
              Everything you need to build production-ready chat interfaces
            </p>
          </div>

          <FeaturesGrid
            features={[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: '70+ Components',
                description:
                  'From basic messages to advanced patterns like command palettes, drag & drop, and context menus.',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: '150+ Animations',
                description:
                  'Smooth, performant animations powered by Framer Motion. Spring physics, stagger effects, and more.',
              },
              {
                icon: <Palette className="w-8 h-8" />,
                title: 'Fully Customizable',
                description:
                  'Built with Tailwind CSS. Override any style with your design tokens. Dark mode included.',
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
                icon: <Rocket className="w-8 h-8" />,
                title: 'Production Ready',
                description:
                  'Tree-shakeable, performant, and battle-tested. Used in production by teams worldwide.',
              },
            ]}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-docs py-24">
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Install Clarity Chat and build your first chat interface in minutes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/learn/installation"
              className="px-8 py-3 bg-white text-brand-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Installation Guide
            </Link>
            <Link
              href="/examples"
              className="px-8 py-3 bg-brand-700 text-white rounded-lg font-semibold hover:bg-brand-800 transition-colors"
            >
              View Examples
            </Link>
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
                <Link href="/learn/quick-start" className="text-brand-500 hover:text-brand-600">
                  Quick Start →
                </Link>
              </li>
              <li>
                <Link href="/learn/tutorial" className="text-brand-500 hover:text-brand-600">
                  Tutorial →
                </Link>
              </li>
              <li>
                <Link href="/learn/concepts" className="text-brand-500 hover:text-brand-600">
                  Core Concepts →
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Reference</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/reference/components" className="text-brand-500 hover:text-brand-600">
                  Components →
                </Link>
              </li>
              <li>
                <Link href="/reference/hooks" className="text-brand-500 hover:text-brand-600">
                  Hooks →
                </Link>
              </li>
              <li>
                <Link href="/reference/api" className="text-brand-500 hover:text-brand-600">
                  API Reference →
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Community</h3>
            <ul className="space-y-3">
              <li>
                <Link href="https://github.com/clarity-chat/ui" className="text-brand-500 hover:text-brand-600">
                  GitHub →
                </Link>
              </li>
              <li>
                <Link href="https://storybook.clarity-chat.dev" className="text-brand-500 hover:text-brand-600">
                  Storybook →
                </Link>
              </li>
              <li>
                <Link href="/examples" className="text-brand-500 hover:text-brand-600">
                  Examples →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
