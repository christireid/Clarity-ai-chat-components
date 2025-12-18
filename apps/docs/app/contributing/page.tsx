import { Metadata } from 'next'
import Link from 'next/link'
import {
  Heart,
  Code,
  Users,
  BookOpen,
  Bug,
  Lightbulb,
  TestTube,
  Globe,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contributing to Clarity Chat',
  description:
    'Learn how to contribute to Clarity Chat - from bug fixes to new features',
}

export default function ContributingPage() {
  return (
    <div className="container-docs py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">
          Contributing to Clarity Chat
        </h1>
        <p className="text-xl text-text-secondary mb-12">
          Welcome! Whether you're fixing a typo or adding a major feature, every
          contribution makes Clarity Chat better.
        </p>

        {/* Ways to Contribute */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold">Ways to Contribute</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border border-border rounded-xl hover:border-brand-500 transition-colors">
              <Bug className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Fix Bugs</h3>
              <p className="text-text-secondary mb-4">
                Found a bug? Submit a fix! Check out issues labeled "good first
                issue" for beginner-friendly bugs.
              </p>
              <Link
                href="https://github.com/christireid/Clarity-ai-chat-components/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22"
                className="text-brand-500 hover:text-brand-600 text-sm font-medium inline-flex items-center gap-1"
              >
                View Issues →
              </Link>
            </div>

            <div className="p-6 border border-border rounded-xl hover:border-brand-500 transition-colors">
              <Lightbulb className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Add Features</h3>
              <p className="text-text-secondary mb-4">
                Have an idea for a new component or hook? We'd love to see it!
                Discuss your idea first in GitHub Discussions.
              </p>
              <Link
                href="https://github.com/christireid/Clarity-ai-chat-components/discussions/new?category=ideas"
                className="text-brand-500 hover:text-brand-600 text-sm font-medium inline-flex items-center gap-1"
              >
                Share Idea →
              </Link>
            </div>

            <div className="p-6 border border-border rounded-xl hover:border-brand-500 transition-colors">
              <BookOpen className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Improve Documentation</h3>
              <p className="text-text-secondary mb-4">
                Documentation is crucial! Fix typos, add examples, or write
                guides to help other developers.
              </p>
              <Link
                href="https://github.com/christireid/Clarity-ai-chat-components/tree/main/docs"
                className="text-brand-500 hover:text-brand-600 text-sm font-medium inline-flex items-center gap-1"
              >
                View Docs →
              </Link>
            </div>

            <div className="p-6 border border-border rounded-xl hover:border-brand-500 transition-colors">
              <TestTube className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Write Tests</h3>
              <p className="text-text-secondary mb-4">
                Help us maintain quality by writing tests. Every test makes the
                library more reliable for everyone.
              </p>
              <Link
                href="https://github.com/christireid/Clarity-ai-chat-components/tree/main/packages/react/src"
                className="text-brand-500 hover:text-brand-600 text-sm font-medium inline-flex items-center gap-1"
              >
                View Code →
              </Link>
            </div>

            <div className="p-6 border border-border rounded-xl hover:border-brand-500 transition-colors">
              <Code className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Share Examples</h3>
              <p className="text-text-secondary mb-4">
                Built something cool with Clarity Chat? Share your code examples
                to inspire others!
              </p>
              <Link
                href="https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples"
                className="text-brand-500 hover:text-brand-600 text-sm font-medium inline-flex items-center gap-1"
              >
                View Examples →
              </Link>
            </div>

            <div className="p-6 border border-border rounded-xl hover:border-brand-500 transition-colors">
              <Globe className="w-8 h-8 text-indigo-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Help the Community</h3>
              <p className="text-text-secondary mb-4">
                Answer questions, help troubleshoot issues, and welcome new
                contributors in our Discord and GitHub Discussions.
              </p>
              <Link
                href="https://discord.gg/clarity-chat"
                className="text-brand-500 hover:text-brand-600 text-sm font-medium inline-flex items-center gap-1"
              >
                Join Discord →
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="mb-12 p-8 bg-gradient-to-br from-bg-secondary to-bg-tertiary rounded-xl border border-border">
          <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-brand-500 text-white rounded-full font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Fork and Clone</h3>
                <p className="text-sm text-text-secondary">
                  Fork the repository on GitHub and clone it to your local
                  machine
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-brand-500 text-white rounded-full font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Install Dependencies</h3>
                <p className="text-sm text-text-secondary">
                  Run{' '}
                  <code className="px-2 py-1 bg-bg-tertiary rounded text-xs">
                    pnpm install
                  </code>{' '}
                  to install all dependencies
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-brand-500 text-white rounded-full font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Create a Branch</h3>
                <p className="text-sm text-text-secondary">
                  Create a new branch for your changes:{' '}
                  <code className="px-2 py-1 bg-bg-tertiary rounded text-xs">
                    git checkout -b feature/my-feature
                  </code>
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-brand-500 text-white rounded-full font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Make Your Changes</h3>
                <p className="text-sm text-text-secondary">
                  Write code, add tests, update docs—whatever makes Clarity Chat
                  better!
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-brand-500 text-white rounded-full font-bold">
                5
              </div>
              <div>
                <h3 className="font-semibold mb-1">Submit a Pull Request</h3>
                <p className="text-sm text-text-secondary">
                  Push your changes and open a PR. We'll review it as soon as
                  possible!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Full Guide */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold">Full Contributing Guide</h2>
          </div>
          <div className="p-8 border border-border rounded-xl">
            <p className="text-text-secondary mb-6">
              For detailed information on our development setup, coding
              standards, testing guidelines, and pull request process, check out
              our comprehensive contributing guide on GitHub.
            </p>
            <Link
              href="https://github.com/christireid/Clarity-ai-chat-components/blob/main/CONTRIBUTING.md"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              View Full Guide on GitHub
            </Link>
          </div>
        </section>

        {/* Code of Conduct */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold">Code of Conduct</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-text-secondary leading-relaxed">
              We are committed to providing a welcoming and inspiring community
              for all. Please read and follow our Code of Conduct. In short:
            </p>
            <ul className="text-text-secondary space-y-2 mt-4">
              <li>Be respectful and inclusive</li>
              <li>Welcome newcomers warmly</li>
              <li>Be patient and helpful</li>
              <li>Focus on constructive feedback</li>
              <li>Report unacceptable behavior</li>
            </ul>
            <div className="mt-6">
              <Link
                href="https://github.com/christireid/Clarity-ai-chat-components/blob/main/CODE_OF_CONDUCT.md"
                className="text-brand-500 hover:text-brand-600 font-medium inline-flex items-center gap-1"
              >
                Read Full Code of Conduct →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800">
          <h2 className="text-2xl font-bold mb-4">Ready to Contribute?</h2>
          <p className="text-text-secondary mb-6">
            Join our community of contributors and help make Clarity Chat even
            better!
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="https://github.com/christireid/Clarity-ai-chat-components"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              View on GitHub
            </Link>
            <Link
              href="https://discord.gg/clarity-chat"
              className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border"
            >
              Join Discord
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
