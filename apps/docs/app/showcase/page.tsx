'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Code2,
  Sparkles,
  Star,
  ArrowRight,
  TrendingUp,
  DollarSign,
  BarChart3,
  Zap,
  Shield,
  Calculator,
  MessageSquare,
  Users,
  FileText,
  Command,
  GitBranch,
  Eye,
  Building,
  Layers,
  Palette,
} from 'lucide-react'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

// =============================================================================
// DATA: Interactive Demos
// =============================================================================
const interactiveDemos = [
  {
    id: 'zero-to-chat',
    title: 'Zero to Chat',
    description:
      'Build a complete, production-ready AI chat interface in under 60 seconds. See our flagship demo in action.',
    href: '/demos/zero-to-chat',
    icon: Sparkles,
    gradient: 'from-yellow-500 to-orange-500',
    featured: true,
    priority: 'critical',
    tags: ['Quick Start', 'Production Ready', 'Full Stack'],
  },
  {
    id: 'tool-calling-showcase',
    title: 'Tool Calling Showcase',
    description:
      'Watch AI orchestrate multiple tools, render interactive UI, and request human approval for actions.',
    href: '/examples/tool-calling-showcase',
    icon: GitBranch,
    gradient: 'from-purple-500 to-pink-500',
    featured: true,
    priority: 'critical',
    tags: ['Generative UI', 'Human-in-Loop', 'Tool Chains'],
  },
  {
    id: 'token-visualizer',
    title: 'Token Budget Visualizer',
    description:
      'See real-time token analytics, context window optimization, and potential cost savings.',
    href: '/demos/token-visualizer',
    icon: BarChart3,
    gradient: 'from-green-500 to-emerald-500',
    featured: true,
    priority: 'critical',
    tags: ['Cost Savings', 'Analytics', 'Optimization'],
  },
  {
    id: 'streaming-demo',
    title: 'Streaming Responses',
    description: 'Real-time streaming with typing indicators and smooth animations.',
    href: '/demos/streaming',
    icon: Zap,
    gradient: 'from-blue-500 to-cyan-500',
    featured: false,
    priority: 'high',
  },
  {
    id: 'multi-user',
    title: 'Multi-User Chat',
    description: 'Group conversations with avatars, presence, and role management.',
    href: '/demos/multi-user',
    icon: Users,
    gradient: 'from-indigo-500 to-purple-500',
    featured: false,
    priority: 'high',
  },
  {
    id: 'chain-of-thought',
    title: 'Chain of Thought',
    description: 'Visualize AI reasoning with step-by-step thinking displays.',
    href: '/demos/chain-of-thought',
    icon: Eye,
    gradient: 'from-amber-500 to-orange-500',
    featured: false,
    priority: 'high',
  },
  {
    id: 'file-upload',
    title: 'File Upload',
    description: 'Drag-and-drop file handling with previews and progress.',
    href: '/demos/file-upload',
    icon: FileText,
    gradient: 'from-rose-500 to-pink-500',
    featured: false,
    priority: 'medium',
  },
  {
    id: 'theming',
    title: 'Theme Customization',
    description: 'Live theme switching with 12+ pre-built themes.',
    href: '/demos/theming',
    icon: Layers,
    gradient: 'from-violet-500 to-purple-500',
    featured: false,
    priority: 'medium',
  },
]

// =============================================================================
// DATA: Code Examples
// =============================================================================
const codeExamples = [
  {
    title: 'Basic Examples',
    icon: MessageSquare,
    examples: [
      { title: 'Simple Chat', href: '/examples/simple-chat', description: 'Basic chat interface with messages and input', difficulty: 'Beginner' },
      { title: 'Themed Chat', href: '/examples/themed-chat', description: 'Custom theme with dark mode support', difficulty: 'Beginner' },
      { title: 'Custom Styling', href: '/examples/custom-styling', description: 'Fully customized UI with Tailwind CSS', difficulty: 'Intermediate' },
    ],
  },
  {
    title: 'Advanced Features',
    icon: Zap,
    examples: [
      { title: 'Multi-user Chat', href: '/examples/multi-user', description: 'Group chat with multiple participants', difficulty: 'Intermediate' },
      { title: 'File Sharing', href: '/examples/file-sharing', description: 'Upload and share files in chat', difficulty: 'Advanced' },
      { title: 'Real-time Updates', href: '/examples/realtime', description: 'WebSocket integration for live chat', difficulty: 'Advanced' },
      { title: 'Conversation Branching', href: '/examples/conversation-branching', description: 'Claude-style speculative replies with branching tree', difficulty: 'Advanced' },
      { title: 'Virtualized Transcript', href: '/examples/virtualized-chat', description: 'Render 5k+ messages with virtualization', difficulty: 'Intermediate' },
    ],
  },
  {
    title: 'Interactive Patterns',
    icon: Command,
    examples: [
      { title: 'Command Palette', href: '/examples/command-palette', description: 'Keyboard-driven command interface (Cmd+K)', difficulty: 'Intermediate' },
      { title: 'Drag & Drop', href: '/examples/drag-drop', description: 'Drag and drop messages and files', difficulty: 'Advanced' },
      { title: 'Context Menus', href: '/examples/context-menus', description: 'Right-click context menus', difficulty: 'Intermediate' },
    ],
  },
  {
    title: 'Industry Solutions',
    icon: FileText,
    examples: [
      { title: 'Healthcare Assistant', href: '/examples/healthcare-assistant', description: 'HIPAA-compliant medical chatbot', difficulty: 'Advanced' },
      { title: 'Financial Advisor', href: '/examples/financial-advisor', description: 'Budget planning and investment insights', difficulty: 'Advanced' },
      { title: 'Ecommerce Assistant', href: '/examples/ecommerce-assistant', description: 'Product recommendations and cart integration', difficulty: 'Intermediate' },
      { title: 'Education Tutor', href: '/examples/education-tutor', description: 'Interactive learning with quizzes', difficulty: 'Intermediate' },
    ],
  },
  {
    title: 'Enterprise Workflows',
    icon: Building,
    examples: [
      { title: 'AI Agents Workflow', href: '/examples/ai-agents-workflow', description: 'Multi-agent orchestration with tools', difficulty: 'Advanced' },
      { title: 'Code Assistant', href: '/examples/code-assistant', description: 'AI-powered code help with syntax highlighting', difficulty: 'Advanced' },
      { title: 'Email Assistant', href: '/examples/email-assistant', description: 'Smart email composition and responses', difficulty: 'Intermediate' },
      { title: 'Document Summarizer', href: '/examples/document-summarizer', description: 'Upload and summarize documents with AI', difficulty: 'Advanced' },
    ],
  },
]

// =============================================================================
// STYLE MAPS
// =============================================================================
const priorityBadge = {
  critical: { label: 'Must See', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
  high: { label: 'Featured', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  medium: { label: 'Showcase', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
}

const difficultyColor = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  Advanced: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

// =============================================================================
// COMPONENTS
// =============================================================================
function TabButton({
  active,
  onClick,
  children,
  icon: Icon,
  count,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  icon: React.ComponentType<{ className?: string }>
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all ${
        active
          ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
          : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
      }`}
    >
      <Icon className="w-5 h-5" />
      {children}
      <span
        className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
          active ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-text-secondary'
        }`}
      >
        {count}
      </span>
    </button>
  )
}

function FeaturedDemoCard({ demo, isHero }: { demo: (typeof interactiveDemos)[0]; isHero: boolean }) {
  const Icon = demo.icon

  if (isHero) {
    return (
      <Link
        href={demo.href}
        className="group relative block p-8 md:p-10 rounded-3xl bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/25">
            <Icon className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h3 className="text-2xl md:text-3xl font-bold">{demo.title}</h3>
              <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-medium">
                <Star className="w-3 h-3" /> Hero Demo
              </span>
            </div>
            <p className="text-lg text-text-secondary mb-4">{demo.description}</p>
            <div className="inline-flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-medium group-hover:gap-3 transition-all">
              Try it live <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={demo.href}
      className="group relative block p-6 rounded-2xl border-2 border-border hover:border-brand-500/50 bg-bg-primary hover:bg-bg-secondary transition-all overflow-hidden h-full"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${demo.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
      <div className="relative h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${demo.gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <span className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-bold">
            FEATURED
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {demo.title}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed flex-1">{demo.description}</p>
        {demo.tags && (
          <div className="flex flex-wrap gap-2 mt-4">
            {demo.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 rounded-lg bg-white/50 dark:bg-white/5 text-xs font-medium text-text-secondary">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center gap-2 text-brand-600 dark:text-brand-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          View Demo <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  )
}

// Sample themes for the showcase
const themes = [
  { name: 'Default', colors: ['#3b82f6', '#1e40af', '#f8fafc'], description: 'Clean and professional' },
  { name: 'Forest', colors: ['#22c55e', '#166534', '#f0fdf4'], description: 'Nature-inspired greens' },
  { name: 'Sunset', colors: ['#f97316', '#c2410c', '#fff7ed'], description: 'Warm orange tones' },
  { name: 'Ocean', colors: ['#06b6d4', '#0e7490', '#ecfeff'], description: 'Cool cyan palette' },
  { name: 'Rose', colors: ['#f43f5e', '#be123c', '#fff1f2'], description: 'Elegant pink accents' },
  { name: 'Violet', colors: ['#8b5cf6', '#6d28d9', '#f5f3ff'], description: 'Royal purple theme' },
  { name: 'Slate', colors: ['#64748b', '#334155', '#f8fafc'], description: 'Minimal grayscale' },
  { name: 'Amber', colors: ['#f59e0b', '#b45309', '#fffbeb'], description: 'Golden warmth' },
  { name: 'Emerald', colors: ['#10b981', '#047857', '#ecfdf5'], description: 'Rich green vibes' },
  { name: 'Crimson', colors: ['#dc2626', '#991b1b', '#fef2f2'], description: 'Bold red accents' },
  { name: 'Indigo', colors: ['#6366f1', '#4338ca', '#eef2ff'], description: 'Deep blue-violet' },
  { name: 'Teal', colors: ['#14b8a6', '#0f766e', '#f0fdfa'], description: 'Balanced blue-green' },
]

function ThemesShowcase() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border-2 border-violet-500/30 p-8 md:p-10">
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-violet-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/20 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium mb-4">
              <Palette className="w-4 h-4" />
              12+ Built-in Themes
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Beautiful Themes Out of the Box</h3>
            <p className="text-text-secondary text-lg mb-6 max-w-2xl">
              Customize your chat UI with professionally designed themes. Dark mode included. Override any style with Tailwind CSS.
            </p>

            {/* Theme Preview Grid */}
            <div className="grid grid-cols-6 md:grid-cols-12 gap-2 mb-6">
              {themes.map((theme) => (
                <div key={theme.name} className="group relative" title={theme.name}>
                  <div className="w-full aspect-square rounded-lg overflow-hidden shadow-sm border border-white/20 flex flex-col cursor-pointer hover:scale-110 transition-transform">
                    <div className="flex-1" style={{ backgroundColor: theme.colors[0] }} />
                    <div className="h-1/3" style={{ backgroundColor: theme.colors[1] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full lg:w-auto">
            <Link
              href="/demos/theming"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-violet-500/25"
            >
              <Palette className="w-5 h-5" />
              Theme Customizer
            </Link>
            <Link
              href="/guides/theming"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-xl font-semibold transition-colors border border-border"
            >
              <ArrowRight className="w-5 h-5" />
              Theming Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function TokenOptimizationBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-green-500/30 p-8 md:p-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              Save 30-50% on API Costs
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Token Optimization Suite</h3>
            <p className="text-text-secondary text-lg mb-6 max-w-2xl">
              See real-time token analytics, context window optimization, and cost savings. Our TOON format, prompt caching, and smart truncation can dramatically reduce your LLM costs.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Cost Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Real-time Stats</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">KV-Cache</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium">Context Control</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full lg:w-auto">
            <Link
              href="/demos/token-visualizer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-green-500/25"
            >
              <BarChart3 className="w-5 h-5" />
              Token Visualizer Demo
            </Link>
            <Link
              href="/tools/roi-calculator"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-xl font-semibold transition-colors border border-border"
            >
              <Calculator className="w-5 h-5" />
              ROI Calculator
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function DemoCard({ demo }: { demo: (typeof interactiveDemos)[0] }) {
  const Icon = demo.icon
  const badge = priorityBadge[demo.priority as keyof typeof priorityBadge]

  return (
    <Link
      href={demo.href}
      className="group relative block h-full p-6 rounded-2xl border-2 border-border hover:border-brand-500/50 bg-bg-primary hover:bg-bg-secondary transition-all overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${demo.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
      <div className="relative h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${demo.gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>{badge.label}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {demo.title}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed flex-1">{demo.description}</p>
        <div className="mt-4 flex items-center gap-2 text-brand-600 dark:text-brand-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          View Demo <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  )
}

function ExampleCard({ example }: { example: { title: string; href: string; description: string; difficulty: string } }) {
  return (
    <Link
      href={example.href}
      className="group p-6 border border-border rounded-xl hover:border-brand-500 hover:shadow-lg transition-all block h-full bg-bg-primary"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-lg font-semibold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300">
          {example.title}
        </h4>
        <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColor[example.difficulty as keyof typeof difficultyColor]}`}>
          {example.difficulty}
        </span>
      </div>
      <p className="text-text-secondary text-sm line-clamp-2">{example.description}</p>
    </Link>
  )
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================
export default function ShowcasePage() {
  const [activeTab, setActiveTab] = useState<'demos' | 'examples'>('demos')

  const featuredDemos = interactiveDemos.filter((d) => d.featured)
  const otherDemos = interactiveDemos.filter((d) => !d.featured)
  const totalExamples = codeExamples.reduce((acc, cat) => acc + cat.examples.length, 0)

  return (
    <div className="container-docs py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Demos & Examples
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              See Clarity Chat in Action
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Explore interactive demos and production-ready code examples. Every feature you see is available in the library. Copy, paste, and ship.
            </p>
          </div>
        </ScrollReveal>

        {/* Featured Section */}
        <ScrollReveal delay={0.1}>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold">Featured</h2>
            </div>
            <div className="mb-6">
              <FeaturedDemoCard demo={featuredDemos[0]} isHero={true} />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredDemos.slice(1).map((demo) => (
                <FeaturedDemoCard key={demo.id} demo={demo} isHero={false} />
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Token Optimization Banner */}
        <ScrollReveal delay={0.15}>
          <div className="mb-12">
            <TokenOptimizationBanner />
          </div>
        </ScrollReveal>

        {/* Themes Showcase */}
        <ScrollReveal delay={0.18}>
          <div className="mb-12">
            <ThemesShowcase />
          </div>
        </ScrollReveal>

        {/* Tab Navigation */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-wrap gap-3 mb-8">
            <TabButton active={activeTab === 'demos'} onClick={() => setActiveTab('demos')} icon={Play} count={interactiveDemos.length}>
              Interactive Demos
            </TabButton>
            <TabButton active={activeTab === 'examples'} onClick={() => setActiveTab('examples')} icon={Code2} count={totalExamples}>
              Code Examples
            </TabButton>
          </div>
        </ScrollReveal>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'demos' ? (
            <motion.div key="demos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
              <ScrollReveal stagger staggerDelay={0.05}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherDemos.map((demo) => (
                    <ScrollRevealItem key={demo.id}>
                      <DemoCard demo={demo} />
                    </ScrollRevealItem>
                  ))}
                </div>
              </ScrollReveal>
            </motion.div>
          ) : (
            <motion.div key="examples" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
              <div className="space-y-12">
                {codeExamples.map((category, idx) => {
                  const Icon = category.icon
                  return (
                    <ScrollReveal key={category.title} delay={idx * 0.1}>
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
                            <Icon className="w-6 h-6" />
                          </div>
                          <h3 className="text-2xl font-bold">{category.title}</h3>
                        </div>
                        <ScrollReveal stagger staggerDelay={0.05} className="grid md:grid-cols-2 gap-4">
                          {category.examples.map((example) => (
                            <ScrollRevealItem key={example.href}>
                              <ExampleCard example={example} />
                            </ScrollRevealItem>
                          ))}
                        </ScrollReveal>
                      </div>
                    </ScrollReveal>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA Section */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-brand-50 via-purple-50 to-pink-50 dark:from-brand-950 dark:via-purple-950 dark:to-pink-950 border border-brand-200 dark:border-brand-800">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                All demos use the exact same components available in the library. Get started in minutes with our quick start guide, or calculate your potential savings.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/learn/quick-start" className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-brand-500/25">
                  Quick Start Guide
                </Link>
                <Link href="/tools/roi-calculator" className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-green-500/25 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  ROI Calculator
                </Link>
                <Link href="/playground" className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-xl font-semibold transition-colors border border-border">
                  Open Playground
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* External Resources */}
        <ScrollReveal delay={0.4}>
          <div className="mt-12 p-8 bg-bg-secondary rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-4">Want More?</h3>
            <p className="text-text-secondary mb-6">
              Check out our Storybook for interactive component demos and our GitHub repository for complete example projects.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a
                href="https://storybook.clarity-chat.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
              >
                Open Storybook
              </a>
              <a
                href="https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
