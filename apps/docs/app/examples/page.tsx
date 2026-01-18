'use client'

import Link from 'next/link'
import {
  MessageSquare,
  Palette,
  Users,
  FileText,
  Zap,
  Command,
  Sparkles,
  GitBranch,
  Shield,
  Eye,
  RefreshCw,
  BarChart3,
  Play,
  Brain as BrainCircuit,
  Accessibility,
  Package,
  Wrench,
  Building,
  ArrowRight,
  Star,
} from 'lucide-react'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

// Interactive Demos (from /demos)
const demos = [
  {
    id: 'zero-to-chat',
    title: 'Zero to Chat',
    description:
      'A fully functional AI chat in under 10 lines of code. See instant gratification with beautiful defaults.',
    icon: Zap,
    priority: 'critical',
    gradient: 'from-yellow-500 to-orange-500',
    href: '/demos/zero-to-chat',
  },
  {
    id: 'streaming-states',
    title: 'Streaming States',
    description:
      'Experience the full streaming lifecycle: thinking indicators, character-by-character text, syntax highlighting, and polished transitions.',
    icon: Play,
    priority: 'high',
    gradient: 'from-green-500 to-emerald-500',
    href: '/demos/streaming-states',
  },
  {
    id: 'customization-playground',
    title: 'Customization Playground',
    description:
      'Interactive builder to toggle features, change themes, and export your configuration as starter code.',
    icon: Palette,
    priority: 'high',
    gradient: 'from-purple-500 to-pink-500',
    href: '/demos/customization-playground',
  },
  {
    id: 'token-visualizer',
    title: 'Token Budget Visualizer',
    description:
      'Real-time dashboard showing token counts, context window optimization, and cost savings.',
    icon: BarChart3,
    priority: 'medium',
    gradient: 'from-indigo-500 to-violet-500',
    href: '/demos/token-visualizer',
  },
  {
    id: 'tool-calling',
    title: 'Tool Calling / Agent',
    description:
      'Watch AI agents search the web, generate images, create events, and execute code with custom tool UIs.',
    icon: Wrench,
    priority: 'medium',
    gradient: 'from-amber-500 to-yellow-500',
    href: '/demos/tool-calling',
  },
]

const priorityBadge = {
  critical: {
    label: 'Must See',
    className:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  },
  high: {
    label: 'Featured',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  medium: {
    label: 'Showcase',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
}

// Static Examples (existing)
const examples = [
  {
    title: 'Basic Examples',
    icon: MessageSquare,
    examples: [
      {
        title: 'Simple Chat',
        href: '/examples/simple-chat',
        description: 'Basic chat interface with messages and input',
        difficulty: 'Beginner',
      },
      {
        title: 'Themed Chat',
        href: '/examples/themed-chat',
        description: 'Custom theme with dark mode support',
        difficulty: 'Beginner',
      },
      {
        title: 'Custom Styling',
        href: '/examples/custom-styling',
        description: 'Fully customized UI with Tailwind CSS',
        difficulty: 'Intermediate',
      },
      {
        title: 'Streaming',
        href: '/examples/streaming',
        description: 'Real-time streaming response handling',
        difficulty: 'Beginner',
      },
    ],
  },
  {
    title: 'Advanced Features',
    icon: Zap,
    examples: [
      {
        title: 'Multi-user Chat',
        href: '/examples/multi-user-chat',
        description: 'Group chat with multiple participants',
        difficulty: 'Intermediate',
      },
      {
        title: 'Conversation Branching',
        href: '/examples/conversation-branching',
        description: 'Claude-style speculative replies with branching tree',
        difficulty: 'Advanced',
      },
      {
        title: 'Virtualized Transcript',
        href: '/examples/virtualized-chat',
        description:
          'Render 5k+ messages with virtualization and jump-to-bottom',
        difficulty: 'Intermediate',
      },
      {
        title: 'Model Switching',
        href: '/examples/model-switching',
        description: 'Switch between AI providers mid-conversation',
        difficulty: 'Intermediate',
      },
    ],
  },
  {
    title: 'Industry Solutions',
    icon: FileText,
    examples: [
      {
        title: 'Healthcare Assistant',
        href: '/examples/healthcare-assistant',
        description: 'HIPAA-compliant medical chatbot with patient records',
        difficulty: 'Advanced',
      },
      {
        title: 'Financial Advisor',
        href: '/examples/financial-advisor',
        description:
          'Budget planning, expense tracking, and investment insights',
        difficulty: 'Advanced',
      },
      {
        title: 'Token Optimization',
        href: '/examples/token-optimization',
        description: 'Optimize context window usage and reduce costs',
        difficulty: 'Intermediate',
      },
    ],
  },
  {
    title: 'Enterprise Workflows',
    icon: Building,
    examples: [
      {
        title: 'AI Agents Workflow',
        href: '/examples/ai-agents-workflow',
        description: 'Multi-agent orchestration with custom tools',
        difficulty: 'Advanced',
      },
      {
        title: 'Tool Calling Showcase',
        href: '/examples/tool-calling-showcase',
        description: 'Advanced tool calling with interactive UI components',
        difficulty: 'Advanced',
      },
    ],
  },
]

const difficultyColor = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Intermediate:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  Advanced: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

export default function ExamplesPage() {
  return (
    <div className="container-docs py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Demos & Examples
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              See Clarity Chat in Action
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Experience interactive demos and explore code examples. All
              examples include full source code and are ready to copy and
              customize.
            </p>
          </div>
        </ScrollReveal>

        {/* Featured Demo - Zero to Chat */}
        <ScrollReveal delay={0.1}>
          <Link
            href="/demos/zero-to-chat"
            className="group relative block mb-12 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/25">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h2 className="text-3xl font-bold">Zero to Chat</h2>
                  <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-medium">
                    <Star className="w-3 h-3" /> Hero Demo
                  </span>
                </div>
                <p className="text-lg text-text-secondary mb-4">
                  A fully functional AI chat in{' '}
                  <strong>under 10 lines of code</strong>. Type and get real AI
                  responses right here in the docs.
                </p>
                <div className="inline-flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-medium group-hover:gap-3 transition-all">
                  Try it live <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        </ScrollReveal>

        {/* Interactive Demos Section */}
        <ScrollReveal delay={0.15}>
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-lg">
                <Play className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold">Interactive Demos</h2>
            </div>

            <ScrollReveal stagger staggerDelay={0.05}>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {demos.slice(1).map((demo) => {
                  const Icon = demo.icon
                  const badge =
                    priorityBadge[demo.priority as keyof typeof priorityBadge]
                  return (
                    <ScrollRevealItem key={demo.id}>
                      <Link
                        href={demo.href}
                        className="group relative block h-full p-5 rounded-xl border-2 border-border hover:border-brand-500/50 bg-bg-primary hover:bg-bg-secondary transition-all overflow-hidden"
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${demo.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                        />
                        <div className="relative">
                          <div className="flex items-start justify-between mb-3">
                            <div
                              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${demo.gradient} flex items-center justify-center shadow-md`}
                            >
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
                            >
                              {badge.label}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {demo.title}
                          </h3>
                          <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
                            {demo.description}
                          </p>
                        </div>
                      </Link>
                    </ScrollRevealItem>
                  )
                })}
              </div>
            </ScrollReveal>
          </div>
        </ScrollReveal>

        {/* Tool Calling Showcase - Featured Example */}
        <ScrollReveal delay={0.2}>
          <Link
            href="/examples/tool-calling-showcase"
            className="group block mb-12 p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 border-2 border-purple-300 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg shadow-purple-500/25">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                    FEATURED EXAMPLE
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 rounded-full">
                    New
                  </span>
                </div>
                <h2 className="text-2xl font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Advanced Tool Calling Showcase
                </h2>
                <p className="text-text-secondary mt-1">
                  Watch the AI orchestrate multiple tools, render interactive UI
                  components, and request approval for critical actions.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 dark:bg-white/5">
                <GitBranch className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Tool Chains</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 dark:bg-white/5">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Generative UI</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 dark:bg-white/5">
                <Shield className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium">Human-in-Loop</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 dark:bg-white/5">
                <Eye className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Glass Box Debug</span>
              </div>
            </div>
          </Link>
        </ScrollReveal>

        {/* Code Examples Section */}
        <div className="grid gap-12">
          {examples.map((category, idx) => {
            const Icon = category.icon
            return (
              <ScrollReveal key={category.title} delay={idx * 0.05}>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold">{category.title}</h2>
                  </div>

                  <ScrollReveal
                    stagger
                    staggerDelay={0.1}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    {category.examples.map((example) => (
                      <ScrollRevealItem key={example.href}>
                        <Link
                          href={example.href}
                          className="group p-6 border border-border rounded-xl hover:border-brand-500 hover:shadow-lg transition-all block h-full"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-semibold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300">
                              {example.title}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                difficultyColor[
                                  example.difficulty as keyof typeof difficultyColor
                                ]
                              }`}
                            >
                              {example.difficulty}
                            </span>
                          </div>
                          <p className="text-text-secondary line-clamp-2">
                            {example.description}
                          </p>
                        </Link>
                      </ScrollRevealItem>
                    ))}
                  </ScrollReveal>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* CTA Section */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 text-center p-8 md:p-12 rounded-3xl bg-gradient-to-r from-brand-50 via-purple-50 to-pink-50 dark:from-brand-950 dark:via-purple-950 dark:to-pink-950 border border-brand-200 dark:border-brand-800">
            <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              All these demos use the exact same components available in the
              library. Get started in minutes with our quick start guide.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/learn/quick-start"
                className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-brand-500/25"
              >
                Quick Start Guide
              </Link>
              <Link
                href="/playground"
                className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-xl font-semibold transition-colors border border-border"
              >
                Open Playground
              </Link>
              <a
                href="https://storybook.clarity-chat.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-xl font-semibold transition-colors border border-border"
              >
                Open Storybook
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
