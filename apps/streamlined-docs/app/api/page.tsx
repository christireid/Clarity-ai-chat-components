// @ts-nocheck
// TODO: Fix missing imports (toast, durations)
import {
  ScrollReveal,
  KineticText,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from '@/components/Enhanced/ScrollReveal'
import { InteractivePreview } from '@/components/Enhanced/InteractivePreview'
import {
  Library,
  Code2,
  Sparkles,
  Search,
  Package,
  BookOpen,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'API Reference | Clarity Chat',
  description:
    'Complete API documentation for all Clarity Chat components, hooks, and utilities.',
}

// ISR Configuration: API reference landing page, revalidate every 1 hour
export const revalidate = 3600

// Example component documentation structure
const componentExample = `interface ChatWindowProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  placeholder?: string
  theme?: 'light' | 'dark' | 'system'
  className?: string
}

function ChatWindow(props: ChatWindowProps): JSX.Element`

export default function APIPage() {
  return (
    <div className="container-docs py-8 sm:py-12">
      {/* Hero */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50 rounded-full mb-6">
            <Library className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Complete API Documentation
            </span>
          </div>

          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            API Reference
          </KineticText>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Comprehensive documentation for 155+ components, 70+ hooks, and
            utilities. TypeScript definitions included.
          </p>
        </div>
      </ScrollReveal>

      {/* Search */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search components, hooks, or utilities..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded">
              ⌘K
            </kbd>
          </div>
        </div>
      </ScrollReveal>

      {/* Categories */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>

          <ScrollRevealStagger staggerDelay={0.1}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Code2 className="w-5 h-5" />,
                  title: 'Components',
                  count: '155+',
                  description: 'UI components for chat interfaces',
                  href: '/api/components',
                  color: 'brand',
                },
                {
                  icon: <Sparkles className="w-5 h-5" />,
                  title: 'Hooks',
                  count: '70+',
                  description: 'React hooks for state and behavior',
                  href: '/api/hooks',
                  color: 'purple',
                },
                {
                  icon: <Package className="w-5 h-5" />,
                  title: 'Utilities',
                  count: '30+',
                  description: 'Helper functions and utilities',
                  href: '/api/utilities',
                  color: 'pink',
                },
              ].map((category, i) => (
                <ScrollRevealStaggerItem key={i}>
                  <Link
                    href={category.href}
                    className="block p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 hover:shadow-lg group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-brand-500 group-hover:scale-110 transition-transform">
                        {category.icon}
                      </div>
                      <div className="text-2xl font-bold text-brand-500">
                        {category.count}
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-brand-500 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {category.description}
                    </p>
                  </Link>
                </ScrollRevealStaggerItem>
              ))}
            </div>
          </ScrollRevealStagger>
        </section>
      </ScrollReveal>

      {/* Example Component Doc */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">
            Example: Component Documentation
          </h2>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            {/* Component Header */}
            <div className="p-6 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">ChatWindow</h3>
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium">
                  Stable
                </span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">
                The main chat interface component. Displays messages, handles
                input, and manages conversation state.
              </p>
            </div>

            {/* Type Definition */}
            <div className="p-6">
              <h4 className="font-semibold mb-4">Type Definition</h4>
              <InteractivePreview
                code={componentExample}
                defaultMode="code"
                allowFullscreen={false}
                showResponsive={false}
              >
                <div />
              </InteractivePreview>
            </div>

            {/* Props Table */}
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800">
              <h4 className="font-semibold mb-4">Props</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="text-left">
                    <tr className="border-b border-neutral-200 dark:border-neutral-800">
                      <th className="py-2 px-4 font-semibold">Prop</th>
                      <th className="py-2 px-4 font-semibold">Type</th>
                      <th className="py-2 px-4 font-semibold">Default</th>
                      <th className="py-2 px-4 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        prop: 'messages',
                        type: 'Message[]',
                        default: '—',
                        description: 'Array of message objects to display',
                        required: true,
                      },
                      {
                        prop: 'onSendMessage',
                        type: '(message: string) => void',
                        default: '—',
                        description: 'Callback when user sends a message',
                        required: true,
                      },
                      {
                        prop: 'placeholder',
                        type: 'string',
                        default: '"Type a message..."',
                        description: 'Input placeholder text',
                        required: false,
                      },
                      {
                        prop: 'theme',
                        type: '"light" | "dark" | "system"',
                        default: '"system"',
                        description: 'Color theme for the chat',
                        required: false,
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-neutral-200 dark:border-neutral-800"
                      >
                        <td className="py-3 px-4">
                          <code className="text-sm font-mono text-brand-600 dark:text-brand-400">
                            {row.prop}
                            {row.required && (
                              <span className="text-red-500">*</span>
                            )}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-sm font-mono text-purple-600 dark:text-purple-400">
                            {row.type}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
                            {row.default}
                          </code>
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                          {row.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-brand-500/10 via-purple-500/10 to-pink-500/10 border border-brand-200 dark:border-brand-800/50">
          <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-xl mx-auto">
            Can't find what you're looking for? Try our AI-powered documentation
            assistant or browse interactive examples.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/explore/demos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <BookOpen className="w-4 h-4" />
              Browse Examples
            </Link>
            <button
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg font-medium border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1"
              onClick={() => {
                // This would trigger the DocsAssistant
                toast.success('AI Assistant', {
                  description:
                    'Press Cmd+. to open the AI documentation assistant',
                  duration: durations.slower,
                })
              }}
            >
              <Sparkles className="w-4 h-4" />
              Ask AI Assistant
            </button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}
