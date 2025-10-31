import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Zap, Code, Lightbulb } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Learn',
  description: 'Learn how to use Clarity Chat UI',
}

const sections = [
  {
    title: 'Getting Started',
    icon: Zap,
    description: 'Quick start guides and installation instructions',
    links: [
      { title: 'Quick Start', href: '/learn/quick-start', description: 'Get up and running in 5 minutes' },
      { title: 'Installation', href: '/learn/installation', description: 'Install Clarity Chat in your project' },
      { title: 'Tutorial', href: '/learn/tutorial', description: 'Build a complete chat application' },
    ],
  },
  {
    title: 'Core Concepts',
    icon: BookOpen,
    description: 'Understand the fundamentals of Clarity Chat',
    links: [
      { title: 'Components', href: '/learn/concepts/components', description: 'Learn about UI components' },
      { title: 'Hooks', href: '/learn/concepts/hooks', description: 'Powerful React hooks for state management' },
      { title: 'Theming', href: '/learn/concepts/theming', description: 'Customize colors and styles' },
      { title: 'Animations', href: '/learn/concepts/animations', description: 'Smooth motion and transitions' },
    ],
  },
  {
    title: 'Guides',
    icon: Code,
    description: 'In-depth guides for specific topics',
    links: [
      { title: 'Styling', href: '/learn/guides/styling', description: 'Custom styles and CSS' },
      { title: 'Accessibility', href: '/learn/guides/accessibility', description: 'Build inclusive interfaces' },
      { title: 'Performance', href: '/learn/guides/performance', description: 'Optimize your chat app' },
      { title: 'Testing', href: '/learn/guides/testing', description: 'Test your components' },
      { title: 'TypeScript', href: '/learn/guides/typescript', description: 'Type-safe development' },
    ],
  },
  {
    title: 'Examples',
    icon: Lightbulb,
    description: 'Real-world examples and patterns',
    links: [
      { title: 'View all examples', href: '/examples', description: 'Browse code examples →' },
    ],
  },
]

export default function LearnPage() {
  return (
    <div className="container-docs py-12">
      <div className="max-w-4xl">
        <h1 className="text-5xl font-bold mb-6">Learn Clarity Chat</h1>
        <p className="text-xl text-text-secondary mb-12">
          Everything you need to know to build beautiful, accessible chat interfaces with React.
        </p>

        <div className="grid gap-8">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <div
                key={section.title}
                className="border border-border rounded-xl p-8 hover:border-brand-500/50 transition-colors"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                    <p className="text-text-secondary">{section.description}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group block p-4 rounded-lg hover:bg-bg-secondary transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 mb-1">
                            {link.title}
                          </h3>
                          <p className="text-sm text-text-secondary">
                            {link.description}
                          </p>
                        </div>
                        <span className="text-text-tertiary group-hover:text-brand-500 transition-colors">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-text-secondary mb-6">
            Can't find what you're looking for? We're here to help!
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="https://github.com/clarity-chat/ui/discussions"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              Ask on GitHub
            </Link>
            <Link
              href="https://discord.gg/clarity-chat"
              className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border"
            >
              Join Discord
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
