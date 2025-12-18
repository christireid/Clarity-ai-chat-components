import { Metadata } from 'next'
import Link from 'next/link'
import { Heart, Users, Zap, Target, BookOpen, Github } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Clarity Chat',
  description:
    'Learn about the mission, team, and vision behind Clarity Chat UI library',
}

export default function AboutPage() {
  return (
    <div className="container-docs py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">About Clarity Chat</h1>
        <p className="text-xl text-text-secondary mb-12">
          Building beautiful, accessible AI chat interfaces shouldn't be hard.
          That's why we created Clarity Chat.
        </p>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold">Our Mission</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-text-secondary leading-relaxed">
              We believe that building AI chat interfaces should be a joy, not a
              chore. Too many developers waste weeks rebuilding the same chat
              components from scratch, fighting with accessibility, wrestling
              with state management, and battling performance issues.
            </p>
            <p className="text-lg text-text-secondary leading-relaxed mt-4">
              Clarity Chat was born from this frustration. We set out to create
              the most complete, production-ready chat component library that
              handles all the hard parts—so you can focus on building unique AI
              experiences for your users.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border border-border rounded-xl hover:border-brand-500 transition-colors">
              <Zap className="w-8 h-8 text-brand-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">
                Developer Experience First
              </h3>
              <p className="text-text-secondary">
                Every decision we make prioritizes your experience. From
                comprehensive TypeScript support to clear documentation, we want
                you to ship faster and with confidence.
              </p>
            </div>
            <div className="p-6 border border-border rounded-xl hover:border-brand-500 transition-colors">
              <Users className="w-8 h-8 text-brand-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Accessibility for All</h3>
              <p className="text-text-secondary">
                WCAG AAA compliance isn't optional—it's built into every
                component. Everyone deserves access to great AI chat
                experiences, regardless of ability.
              </p>
            </div>
            <div className="p-6 border border-border rounded-xl hover:border-brand-500 transition-colors">
              <BookOpen className="w-8 h-8 text-brand-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Open Source</h3>
              <p className="text-text-secondary">
                MIT licensed and community-driven. We believe great tools should
                be accessible to everyone, and better together through open
                collaboration.
              </p>
            </div>
            <div className="p-6 border border-border rounded-xl hover:border-brand-500 transition-colors">
              <Zap className="w-8 h-8 text-brand-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Performance Matters</h3>
              <p className="text-text-secondary">
                Virtual scrolling, tree-shaking, React.memo optimization—we
                obsess over performance so your users enjoy fast, responsive
                chat experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-bg-secondary to-bg-tertiary rounded-xl border border-border">
              <div className="text-3xl font-bold text-brand-500 mb-2">200+</div>
              <div className="text-sm text-text-secondary">Components</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-bg-secondary to-bg-tertiary rounded-xl border border-border">
              <div className="text-3xl font-bold text-brand-500 mb-2">140+</div>
              <div className="text-sm text-text-secondary">Hooks</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-bg-secondary to-bg-tertiary rounded-xl border border-border">
              <div className="text-3xl font-bold text-brand-500 mb-2">
                249K+
              </div>
              <div className="text-sm text-text-secondary">Lines of Code</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-bg-secondary to-bg-tertiary rounded-xl border border-border">
              <div className="text-3xl font-bold text-brand-500 mb-2">100%</div>
              <div className="text-sm text-text-secondary">TypeScript</div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold">Open Source</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-text-secondary leading-relaxed">
              Clarity Chat is built and maintained by a passionate community of
              developers who believe in creating better tools for everyone. We
              welcome contributions from developers of all skill levels.
            </p>
            <div className="mt-6 flex gap-4 flex-wrap">
              <Link
                href="https://github.com/christireid/Clarity-ai-chat-components"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </Link>
              <Link
                href="/contributing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-bg-secondary hover:bg-bg-tertiary text-text-primary rounded-lg font-semibold transition-colors border border-border hover:border-brand-300"
              >
                Contributing Guide
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800">
          <h2 className="text-2xl font-bold mb-4">Join Us</h2>
          <p className="text-text-secondary mb-6">
            Whether you're building your first chat interface or scaling to
            millions of users, we're here to help you succeed.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/learn/quick-start"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="https://discord.gg/clarity-chat"
              className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border"
            >
              Join Community
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
