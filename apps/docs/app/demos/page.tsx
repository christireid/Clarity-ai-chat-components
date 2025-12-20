'use client'

import Link from 'next/link'
import {
  Zap,
  RefreshCw,
  BarChart3,
  Play,
  Brain as BrainCircuit,
  Accessibility,
  Package,
  Wrench,
  Palette,
  Building,
  Sparkles,
  ArrowRight,
  Star,
} from 'lucide-react'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'
import { motion } from 'framer-motion'

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
    id: 'provider-hotswap',
    title: 'Provider Hot-Swap',
    description:
      'Switch between OpenAI, Claude, and Gemini mid-conversation. Same code, different providers.',
    icon: RefreshCw,
    priority: 'high',
    gradient: 'from-blue-500 to-cyan-500',
    href: '/demos/provider-hotswap',
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
    id: 'memory-context',
    title: 'Memory & Context',
    description:
      'See how the AI remembers your name, preferences, and context across sessions with a visual memory panel.',
    icon: BrainCircuit,
    priority: 'medium',
    gradient: 'from-rose-500 to-red-500',
    href: '/demos/memory-context',
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
  {
    id: 'accessibility-audit',
    title: 'Accessibility Audit',
    description:
      'Full keyboard navigation, screen reader support, focus management, and high contrast mode.',
    icon: Accessibility,
    priority: 'medium',
    gradient: 'from-teal-500 to-green-500',
    href: '/demos/accessibility-audit',
  },
  {
    id: 'bundle-comparison',
    title: 'Bundle Size Comparison',
    description:
      'See how Clarity Chat compares: 27KB vs competitors at 89-156KB. Tree-shaking visualization included.',
    icon: Package,
    priority: 'medium',
    gradient: 'from-sky-500 to-blue-500',
    href: '/demos/bundle-comparison',
  },
  {
    id: 'enterprise-production',
    title: 'Enterprise in Production',
    description:
      '10K concurrent connections, error recovery, analytics, multi-tenancy, and audit logging.',
    icon: Building,
    priority: 'niche',
    gradient: 'from-slate-500 to-gray-600',
    href: '/demos/enterprise-production',
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
  niche: {
    label: 'Enterprise',
    className:
      'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  },
}

export default function DemosPage() {
  return (
    <div className="container-docs py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Interactive Demos
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              See Clarity Chat in Action
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Experience the power, polish, and flexibility of Clarity Chat
              through interactive demos. Every feature you see is available in
              the library.
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

        {/* Demo Grid */}
        <ScrollReveal stagger staggerDelay={0.05}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demos.slice(1).map((demo) => {
              const Icon = demo.icon
              const badge =
                priorityBadge[demo.priority as keyof typeof priorityBadge]
              return (
                <ScrollRevealItem key={demo.id}>
                  <Link
                    href={demo.href}
                    className="group relative block h-full p-6 rounded-2xl border-2 border-border hover:border-brand-500/50 bg-bg-primary hover:bg-bg-secondary transition-all overflow-hidden"
                  >
                    {/* Gradient Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${demo.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                    />

                    <div className="relative">
                      {/* Icon and Badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${demo.gradient} flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {demo.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {demo.description}
                      </p>

                      {/* Arrow */}
                      <div className="mt-4 flex items-center gap-2 text-brand-600 dark:text-brand-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        View Demo <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </ScrollRevealItem>
              )
            })}
          </div>
        </ScrollReveal>

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
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
