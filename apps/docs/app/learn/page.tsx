import { Metadata } from 'next'
import Link from 'next/link'
import {
  BookOpen,
  Zap,
  Code,
  Lightbulb,
  GraduationCap,
  Rocket,
  Target,
  ArrowRight,
  DollarSign,
  Brain,
  Shield,
  Smartphone,
  Palette,
  Settings,
  Users,
  BarChart3,
  CheckCircle2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Learn - Clarity Chat UI',
  description:
    'Learn how to build beautiful, accessible chat interfaces with Clarity Chat UI. From quick start to advanced patterns.',
}

// Skill level badge component
function SkillBadge({
  level,
}: {
  level: 'beginner' | 'intermediate' | 'advanced'
}) {
  const config = {
    beginner: {
      label: 'Beginner',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    intermediate: {
      label: 'Intermediate',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    advanced: {
      label: 'Advanced',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    },
  }

  const { label, color } = config[level]
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${color}`}>
      {label}
    </span>
  )
}

const gettingStarted = {
  title: 'Getting Started',
  icon: Rocket,
  description: 'Get up and running in minutes',
  items: [
    {
      title: 'Quick Start',
      href: '/learn/quick-start',
      description: 'Install and run your first chat in 60 seconds',
      icon: Zap,
      level: 'beginner' as const,
      highlight: true,
    },
    {
      title: 'Installation',
      href: '/learn/installation',
      description: 'Detailed installation and configuration options',
      icon: Settings,
      level: 'beginner' as const,
    },
    {
      title: 'Tutorial',
      href: '/learn/tutorial',
      description: 'Build a complete chat application step by step',
      icon: GraduationCap,
      level: 'beginner' as const,
    },
  ],
}

const coreConcepts = {
  title: 'Core Concepts',
  icon: BookOpen,
  description: 'Understand the fundamentals',
  items: [
    {
      title: 'Components',
      href: '/learn/concepts/components',
      description: 'Building blocks of chat interfaces',
      icon: Code,
      level: 'beginner' as const,
    },
    {
      title: 'Hooks',
      href: '/learn/concepts/hooks',
      description: 'React hooks for state and behavior',
      icon: Brain,
      level: 'intermediate' as const,
    },
    {
      title: 'Theming',
      href: '/learn/concepts/theming',
      description: 'Customize colors, fonts, and styles',
      icon: Palette,
      level: 'beginner' as const,
    },
    {
      title: 'Animations',
      href: '/learn/concepts/animations',
      description: 'Smooth motion and micro-interactions',
      icon: Lightbulb,
      level: 'intermediate' as const,
    },
  ],
}

const deepDiveGuides = [
  {
    title: 'Streaming Responses',
    href: '/guides/streaming',
    description: 'Real-time token streaming and progressive rendering',
    icon: Zap,
    level: 'intermediate' as const,
  },
  {
    title: 'RAG Integration',
    href: '/guides/rag',
    description: 'Retrieval-augmented generation with your documents',
    icon: BookOpen,
    level: 'advanced' as const,
  },
  {
    title: 'AI Agents & Tools',
    href: '/guides/agents',
    description: 'Give AI the ability to take actions and call functions',
    icon: Brain,
    level: 'advanced' as const,
  },
  {
    title: 'State Management',
    href: '/guides/state-management',
    description: 'Managing chat state, history, and real-time updates',
    icon: Settings,
    level: 'intermediate' as const,
  },
  {
    title: 'Accessibility',
    href: '/guides/accessibility',
    description: 'Build inclusive chat experiences for all users',
    icon: Users,
    level: 'intermediate' as const,
  },
  {
    title: 'Performance',
    href: '/guides/performance',
    description: 'Virtual scrolling, memoization, and optimization',
    icon: BarChart3,
    level: 'advanced' as const,
  },
  {
    title: 'Security',
    href: '/guides/security',
    description: 'Protect user data and prevent vulnerabilities',
    icon: Shield,
    level: 'advanced' as const,
  },
  {
    title: 'Mobile Optimization',
    href: '/guides/mobile',
    description: 'Touch interactions and responsive design',
    icon: Smartphone,
    level: 'intermediate' as const,
  },
  {
    title: 'Production Deployment',
    href: '/guides/production-deployment',
    description: 'Deploy, monitor, and scale your chat application',
    icon: Rocket,
    level: 'advanced' as const,
  },
]

export default function LearnPage() {
  return (
    <div className="container-docs py-12">
      <div className="max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Learn Clarity Chat</h1>
          <p className="text-xl text-text-secondary max-w-3xl">
            From quick start to advanced patterns. Everything you need to build
            beautiful, accessible chat interfaces with React.
          </p>
        </div>

        {/* Token Optimization - Featured Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-8 border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-xl">
                <DollarSign className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">Token Optimization</h2>
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
                    Save 30-50%
                  </span>
                </div>
                <p className="text-text-secondary max-w-2xl">
                  Cut your AI costs significantly with built-in token
                  optimization. TOON format, prompt caching, and smart context
                  management—all out of the box.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/60 dark:bg-gray-900/60 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  30-60%
                </div>
                <div className="text-sm text-text-secondary">
                  TOON Format Savings
                </div>
              </div>
              <div className="bg-white/60 dark:bg-gray-900/60 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  50-90%
                </div>
                <div className="text-sm text-text-secondary">
                  Prompt Caching Savings
                </div>
              </div>
              <div className="bg-white/60 dark:bg-gray-900/60 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  Real-time
                </div>
                <div className="text-sm text-text-secondary">
                  Usage Monitoring
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/guides/token-optimization"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Read the Guide
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/tools/roi-calculator"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-medium transition-colors border border-green-200 dark:border-green-800"
              >
                <DollarSign className="w-4 h-4" />
                Calculate Your Savings
              </Link>
              <Link
                href="/demos/token-visualizer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-medium transition-colors border border-green-200 dark:border-green-800"
              >
                Try Live Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Learning Path */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-brand-500" />
            <h2 className="text-2xl font-bold">Learning Path</h2>
          </div>
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-medium text-green-700 dark:text-green-400 whitespace-nowrap">
              <CheckCircle2 className="w-4 h-4" />
              Beginner
            </div>
            <ArrowRight className="w-4 h-4 text-text-tertiary flex-shrink-0" />
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-400 whitespace-nowrap">
              <CheckCircle2 className="w-4 h-4" />
              Intermediate
            </div>
            <ArrowRight className="w-4 h-4 text-text-tertiary flex-shrink-0" />
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-medium text-purple-700 dark:text-purple-400 whitespace-nowrap">
              <CheckCircle2 className="w-4 h-4" />
              Advanced
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl">
              <gettingStarted.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{gettingStarted.title}</h2>
              <p className="text-text-secondary">{gettingStarted.description}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {gettingStarted.items.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group block p-6 rounded-xl border transition-all hover:shadow-lg ${
                    item.highlight
                      ? 'border-brand-300 dark:border-brand-700 bg-gradient-to-br from-brand-50/50 to-transparent dark:from-brand-950/30 dark:to-transparent hover:border-brand-400 dark:hover:border-brand-600'
                      : 'border-border hover:border-brand-300 dark:hover:border-brand-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-lg group-hover:bg-brand-200 dark:group-hover:bg-brand-800/30 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <SkillBadge level={item.level} />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {item.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Core Concepts */}
        <section className="mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <coreConcepts.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{coreConcepts.title}</h2>
              <p className="text-text-secondary">{coreConcepts.description}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {coreConcepts.items.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-4 p-5 rounded-xl border border-border hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <SkillBadge level={item.level} />
                    </div>
                    <p className="text-sm text-text-secondary">
                      {item.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Deep Dive Guides */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Deep Dive Guides</h2>
                <p className="text-text-secondary">
                  In-depth guides for specific topics
                </p>
              </div>
            </div>
            <Link
              href="/guides"
              className="text-sm text-brand-500 hover:text-brand-600 font-medium hidden md:block"
            >
              View all guides →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {deepDiveGuides.map((guide) => {
              const Icon = guide.icon
              return (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="group block p-5 rounded-xl border border-border hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <SkillBadge level={guide.level} />
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {guide.description}
                  </p>
                </Link>
              )
            })}
          </div>

          <Link
            href="/guides"
            className="mt-4 text-sm text-brand-500 hover:text-brand-600 font-medium block md:hidden"
          >
            View all guides →
          </Link>
        </section>

        {/* Resources */}
        <section className="mb-12 grid md:grid-cols-2 gap-6">
          <Link
            href="/examples"
            className="group block p-6 rounded-xl border border-border hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Examples
              </h3>
            </div>
            <p className="text-text-secondary">
              Real-world code examples and patterns you can copy and customize.
            </p>
          </Link>

          <Link
            href="/cookbook"
            className="group block p-6 rounded-xl border border-border hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Cookbook
              </h3>
            </div>
            <p className="text-text-secondary">
              Step-by-step recipes for common tasks and integrations.
            </p>
          </Link>
        </section>

        {/* Help Section */}
        <section className="p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950/50 dark:to-purple-950/50 rounded-2xl border border-brand-200 dark:border-brand-800">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-text-secondary mb-6">
            Can't find what you're looking for? We're here to help!
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="https://github.com/christireid/Clarity-ai-chat-components/discussions"
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
        </section>
      </div>
    </div>
  )
}
