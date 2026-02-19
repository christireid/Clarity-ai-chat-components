'use client'

import Link from 'next/link'
import {
  MessageSquare,
  MessagesSquare,
  Brain,
  Wrench,
  Keyboard,
  Search,
  Coins,
  BarChart3,
  Code2,
  FileImage,
  Navigation,
  Bell,
  Lightbulb,
  Palette,
  Loader2,
  Quote,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Copy,
  LayoutDashboard,
  Github,
  ExternalLink,
  Command,
  Cpu,
  GraduationCap,
  Globe,
  Blocks,
} from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

const categories = [
  {
    name: 'Core Chat',
    href: '/core-chat',
    icon: MessageSquare,
    description: 'ClarityChatApp, ChatWindow, ChatInput',
    count: 8,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500',
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessagesSquare,
    description: 'Message bubbles, streaming, typing',
    count: 12,
    gradient: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-500',
  },
  {
    name: 'AI Reasoning',
    href: '/ai-reasoning',
    icon: Brain,
    description: 'Think, ChainOfThought, AgentPanel',
    count: 15,
    gradient: 'from-purple-500/20 to-violet-500/20',
    iconColor: 'text-purple-500',
  },
  {
    name: 'Tools',
    href: '/tools',
    icon: Wrench,
    description: 'ToolCard, execution displays',
    count: 6,
    gradient: 'from-orange-500/20 to-amber-500/20',
    iconColor: 'text-orange-500',
  },
  {
    name: 'Input',
    href: '/input',
    icon: Keyboard,
    description: 'Voice, file upload, mentions',
    count: 10,
    gradient: 'from-cyan-500/20 to-blue-500/20',
    iconColor: 'text-cyan-500',
  },
  {
    name: 'Search',
    href: '/search',
    icon: Search,
    description: 'Message search, semantic search',
    count: 6,
    gradient: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-pink-500',
  },
  {
    name: 'Token Management',
    href: '/token-management',
    icon: Coins,
    description: 'Counting, budgets, optimization',
    count: 8,
    gradient: 'from-yellow-500/20 to-orange-500/20',
    iconColor: 'text-yellow-500',
  },
  {
    name: 'Dashboards',
    href: '/dashboards',
    icon: BarChart3,
    description: 'Analytics, performance, usage',
    count: 7,
    gradient: 'from-indigo-500/20 to-purple-500/20',
    iconColor: 'text-indigo-500',
  },
  {
    name: 'Code & Data',
    href: '/code-data',
    icon: Code2,
    description: 'Code blocks, tables, terminal',
    count: 8,
    gradient: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-500',
  },
  {
    name: 'Media & Files',
    href: '/media-files',
    icon: FileImage,
    description: 'File tree, gallery, attachments',
    count: 6,
    gradient: 'from-rose-500/20 to-pink-500/20',
    iconColor: 'text-rose-500',
  },
  {
    name: 'Navigation',
    href: '/navigation',
    icon: Navigation,
    description: 'Command palette, history',
    count: 5,
    gradient: 'from-teal-500/20 to-cyan-500/20',
    iconColor: 'text-teal-500',
  },
  {
    name: 'Feedback',
    href: '/feedback-status',
    icon: Bell,
    description: 'Toasts, errors, status',
    count: 8,
    gradient: 'from-red-500/20 to-orange-500/20',
    iconColor: 'text-red-500',
  },
  {
    name: 'Suggestions',
    href: '/suggestions',
    icon: Lightbulb,
    description: 'Follow-ups, response actions',
    count: 7,
    gradient: 'from-amber-500/20 to-yellow-500/20',
    iconColor: 'text-amber-500',
  },
  {
    name: 'Theme',
    href: '/theme',
    icon: Palette,
    description: 'Customizer, switcher, previews',
    count: 4,
    gradient: 'from-violet-500/20 to-purple-500/20',
    iconColor: 'text-violet-500',
  },
  {
    name: 'Loading',
    href: '/loading-states',
    icon: Loader2,
    description: 'Shimmers, skeletons, loaders',
    count: 8,
    gradient: 'from-slate-500/20 to-gray-500/20',
    iconColor: 'text-slate-500',
  },
  {
    name: 'Citations',
    href: '/citations',
    icon: Quote,
    description: 'Sources, link previews',
    count: 6,
    gradient: 'from-sky-500/20 to-blue-500/20',
    iconColor: 'text-sky-500',
  },
  {
    name: 'Primitives',
    href: '/primitives',
    icon: Layers,
    description: 'Buttons, dialogs, tooltips',
    count: 25,
    gradient: 'from-gray-500/20 to-slate-500/20',
    iconColor: 'text-gray-500',
  },
  {
    name: 'AI Clones',
    href: '/clones',
    icon: Copy,
    description: 'Claude, ChatGPT, Perplexity',
    count: 7,
    gradient: 'from-violet-500/20 to-indigo-500/20',
    iconColor: 'text-violet-500',
  },
]

const features = [
  {
    icon: Sparkles,
    title: '180+ Components',
    description: 'Full-featured AI chat components',
  },
  {
    icon: Zap,
    title: 'Fully Interactive',
    description: 'Working actions & state management',
  },
  {
    icon: Shield,
    title: 'WCAG AAA',
    description: 'Accessible & keyboard navigable',
  },
  {
    icon: Cpu,
    title: 'AI-Native',
    description: 'Built for streaming & agents',
  },
]

const quickLinks = [
  { name: 'AI Clones', href: '/clones', icon: Copy },
  { name: 'Dashboards', href: '/dashboards', icon: LayoutDashboard },
  { name: 'Features', href: '/features', icon: Sparkles },
]

export default function HomePage() {
  const totalComponents = categories.reduce((acc, cat) => acc + cat.count, 0)

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="orb-primary -top-20 -left-20 animate-float" />
        <div
          className="orb-violet top-1/3 -right-32 animate-float"
          style={{ animationDelay: '-2s' }}
        />
        <div
          className="orb-cyan bottom-20 left-1/4 animate-float"
          style={{ animationDelay: '-4s' }}
        />
        <div className="absolute inset-0 dot-pattern opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Hero Section */}
        <section className="pt-4 pb-16">
          {/* Top Badge */}
          <div className="flex justify-center mb-8">
            <div className="badge-glass flex items-center gap-2 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm">v2.0 Now Available</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* Main Hero */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="pulse-ring" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl gradient-accent text-white font-bold text-2xl shadow-lg glow">
                  CC
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              <span className="gradient-text">Clarity Chat</span>
              <br />
              <span className="text-foreground">Components</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              The most comprehensive React component library for building
              beautiful, accessible AI chat interfaces.{' '}
              <span className="text-foreground font-medium">
                {totalComponents}+ components
              </span>{' '}
              ready for production.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link href="/chat">
                <button className="px-6 py-3 rounded-xl gradient-accent text-white font-medium shadow-lg glow-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Command className="h-4 w-4" />
                  Explore Components
                </button>
              </Link>
              <a
                href="https://github.com/christireid/Clarity-ai-chat-components"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="px-6 py-3 rounded-xl glass font-medium hover:bg-white/80 dark:hover:bg-white/10 transition-colors flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  View on GitHub
                </button>
              </a>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="glass-panel px-4 py-2 flex items-center gap-2"
                >
                  <feature.icon className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{feature.title}</span>
                  <span className="text-muted-foreground text-sm hidden sm:inline">
                    {feature.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex justify-center gap-4 mb-16">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className="glass-card px-5 py-3 flex items-center gap-2 card-hover cursor-pointer">
                  <link.icon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{link.name}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider mb-12" />

        {/* Categories Section */}
        <section className="pb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Component Categories</h2>
            <p className="text-muted-foreground">
              Click any category to explore interactive demos
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.href} href={category.href}>
                <div
                  className={cn(
                    'feature-card cursor-pointer h-full',
                    'hover:border-primary/30'
                  )}
                >
                  {/* Gradient Background */}
                  <div
                    className={cn(
                      'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br',
                      category.gradient
                    )}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={cn('icon-container-sm', category.iconColor)}
                      >
                        <category.icon className="h-5 w-5" />
                      </div>
                      <span className="badge-glass text-xs">
                        {category.count}
                      </span>
                    </div>

                    <h3 className="font-semibold mb-1 flex items-center gap-2">
                      {category.name}
                      <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider mb-12" />

        {/* Advanced Demos Section */}
        <section className="pb-16">
          <div className="text-center mb-10">
            <div className="badge-glass inline-flex items-center gap-2 px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <span className="text-sm font-medium">New</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Advanced Interactive Demos</h2>
            <p className="text-muted-foreground">
              Three production-quality AI chat demos showcasing model adapters, RAG, MCP, tools, artifacts, and more
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Library Learning Hub',
                description: 'RAG-powered tutor for the Clarity Chat library with embedded knowledge base and code examples',
                href: '/advanced-demos/library-learning-hub',
                icon: GraduationCap,
                gradient: 'from-emerald-500 to-teal-600',
                tag: 'RAG + Teaching',
              },
              {
                title: 'Deep Research',
                description: 'Multi-step research with MCP servers, enriched sources, tool plugins, and citation management',
                href: '/advanced-demos/deep-research-assistant',
                icon: Globe,
                gradient: 'from-blue-500 to-indigo-600',
                tag: 'Research + MCP',
              },
              {
                title: 'Artifact Studio',
                description: 'Claude-style artifact creation with live previews, code generation, diagrams, and version history',
                href: '/advanced-demos/artifact-studio',
                icon: Blocks,
                gradient: 'from-violet-500 to-purple-600',
                tag: 'Artifacts + Generative',
              },
            ].map((demo) => (
              <Link key={demo.href} href={demo.href}>
                <div className="feature-card cursor-pointer h-full group">
                  <div className={cn(
                    'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-4 shadow-lg',
                    demo.gradient
                  )}>
                    <demo.icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{demo.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500 font-medium">
                      {demo.tag}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{demo.description}</p>
                  <div className="flex items-center gap-1 text-sm text-primary font-medium">
                    <span>Open Demo</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link href="/advanced-demos">
              <button className="px-4 py-2 rounded-lg glass text-sm font-medium hover:bg-white/80 dark:hover:bg-white/10 transition-colors inline-flex items-center gap-2">
                View All Advanced Demos
                <ArrowRight className="h-3 w-3" />
              </button>
            </Link>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider mb-12" />

        {/* Quick Start Section */}
        <section className="pb-16">
          <div className="glass-card p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="icon-container">
                  <Code2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Quick Start</h2>
                  <p className="text-sm text-muted-foreground">
                    Get started in under 3 minutes
                  </p>
                </div>
              </div>

              <div className="glass-panel p-6 font-mono text-sm overflow-x-auto">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <span className="text-green-500">$</span>
                  <span>npm install @clarity-chat/react</span>
                </div>
                <pre className="text-foreground">
                  <code>{`import { ClarityChatApp } from '@clarity-chat/react'

// Basic usage - streaming chat
<ClarityChatApp api="/api/chat" />

// With memory enabled
<ClarityChatApp
  api="/api/chat"
  features={{ memory: true }}
/>

// Enterprise preset with all features
<ClarityChatApp
  api="/api/chat"
  preset="enterprise"
/>`}</code>
                </pre>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Link href="/chat">
                  <button className="px-4 py-2 rounded-lg gradient-accent text-white text-sm font-medium">
                    View Chat Components
                  </button>
                </Link>
                <Link href="/primitives">
                  <button className="px-4 py-2 rounded-lg glass text-sm font-medium">
                    Browse Primitives
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Components', value: `${totalComponents}+` },
              { label: 'Categories', value: categories.length },
              { label: 'AI Clones', value: '7' },
              { label: 'Dashboards', value: '5' },
            ].map((stat) => (
              <div key={stat.label} className="stat-card text-center">
                <p className="text-3xl font-bold gradient-text mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
