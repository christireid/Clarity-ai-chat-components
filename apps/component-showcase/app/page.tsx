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
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from '@clarity-chat/primitives'

const categories = [
  {
    name: 'Core Chat',
    href: '/core-chat',
    icon: <MessageSquare className="h-6 w-6" />,
    description: 'ClarityChatApp, ChatWindow, ChatInput, and more',
    count: 8,
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: <MessagesSquare className="h-6 w-6" />,
    description: 'Message bubbles, streaming, typing indicators',
    count: 12,
    color: 'bg-green-500/10 text-green-500',
  },
  {
    name: 'AI & Reasoning',
    href: '/ai-reasoning',
    icon: <Brain className="h-6 w-6" />,
    description: 'Think, ChainOfThought, ThinkingBar, AgentPanel',
    count: 15,
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    name: 'Tools',
    href: '/tools',
    icon: <Wrench className="h-6 w-6" />,
    description: 'ToolCard, ToolExecutionCard, tool displays',
    count: 6,
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    name: 'Input',
    href: '/input',
    icon: <Keyboard className="h-6 w-6" />,
    description: 'Advanced inputs, voice, file upload, mentions',
    count: 10,
    color: 'bg-cyan-500/10 text-cyan-500',
  },
  {
    name: 'Search',
    href: '/search',
    icon: <Search className="h-6 w-6" />,
    description: 'Message search, filters, semantic search',
    count: 6,
    color: 'bg-pink-500/10 text-pink-500',
  },
  {
    name: 'Token Management',
    href: '/token-management',
    icon: <Coins className="h-6 w-6" />,
    description: 'Token counting, budgets, optimization',
    count: 8,
    color: 'bg-yellow-500/10 text-yellow-500',
  },
  {
    name: 'Dashboards',
    href: '/dashboards',
    icon: <BarChart3 className="h-6 w-6" />,
    description: 'Analytics, performance, usage dashboards',
    count: 7,
    color: 'bg-indigo-500/10 text-indigo-500',
  },
  {
    name: 'Code & Data',
    href: '/code-data',
    icon: <Code2 className="h-6 w-6" />,
    description: 'Code blocks, tables, terminal, test results',
    count: 8,
    color: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    name: 'Media & Files',
    href: '/media-files',
    icon: <FileImage className="h-6 w-6" />,
    description: 'File tree, image gallery, attachments',
    count: 6,
    color: 'bg-rose-500/10 text-rose-500',
  },
  {
    name: 'Navigation',
    href: '/navigation',
    icon: <Navigation className="h-6 w-6" />,
    description: 'Command palette, history, conversations',
    count: 5,
    color: 'bg-teal-500/10 text-teal-500',
  },
  {
    name: 'Feedback & Status',
    href: '/feedback-status',
    icon: <Bell className="h-6 w-6" />,
    description: 'Toasts, errors, network status, feedback',
    count: 8,
    color: 'bg-red-500/10 text-red-500',
  },
  {
    name: 'Suggestions',
    href: '/suggestions',
    icon: <Lightbulb className="h-6 w-6" />,
    description: 'Follow-ups, suggestions, response actions',
    count: 7,
    color: 'bg-amber-500/10 text-amber-500',
  },
  {
    name: 'Theme',
    href: '/theme',
    icon: <Palette className="h-6 w-6" />,
    description: 'Theme customizer, switcher, previews',
    count: 4,
    color: 'bg-violet-500/10 text-violet-500',
  },
  {
    name: 'Loading States',
    href: '/loading-states',
    icon: <Loader2 className="h-6 w-6" />,
    description: 'Shimmers, skeletons, loading indicators',
    count: 8,
    color: 'bg-slate-500/10 text-slate-500',
  },
  {
    name: 'Citations',
    href: '/citations',
    icon: <Quote className="h-6 w-6" />,
    description: 'Citations, sources, link previews',
    count: 6,
    color: 'bg-sky-500/10 text-sky-500',
  },
  {
    name: 'Primitives',
    href: '/primitives',
    icon: <Layers className="h-6 w-6" />,
    description: 'Buttons, dialogs, tooltips, cards, inputs',
    count: 20,
    color: 'bg-gray-500/10 text-gray-500',
  },
]

const features = [
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: '155+ Components',
    description: 'Comprehensive library for AI chat interfaces',
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'Fully Interactive',
    description: 'All demos are fully functional with working actions',
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'WCAG AAA',
    description: 'Accessible and keyboard navigable',
  },
]

export default function HomePage() {
  const totalComponents = categories.reduce((acc, cat) => acc + cat.count, 0)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
            CC
          </div>
          <div>
            <h1 className="text-3xl font-bold">Clarity Chat Components</h1>
            <p className="text-muted-foreground">
              Interactive showcase of {totalComponents}+ components
            </p>
          </div>
        </div>

        <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
          Explore the complete Clarity Chat component library. Each component is
          fully interactive with working menus, actions, and state management.
          Click on any category to see all components in action.
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-4 mb-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted"
            >
              <span className="text-primary">{feature.icon}</span>
              <div>
                <span className="font-medium text-sm">{feature.title}</span>
                <span className="text-muted-foreground text-sm ml-2">
                  {feature.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.href} href={category.href}>
            <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    {category.icon}
                  </div>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                    {category.count} components
                  </span>
                </div>
                <CardTitle className="text-lg mt-3 flex items-center gap-2">
                  {category.name}
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Start */}
      <div className="mt-12 p-6 rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10">
        <h2 className="text-xl font-semibold mb-2">Quick Start</h2>
        <p className="text-muted-foreground mb-4">
          Get started with Clarity Chat in your React project:
        </p>
        <div className="bg-card rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <pre>
            <code>
              {`import { ClarityChatApp } from '@clarity-chat/react'

// Basic usage - streaming chat in 3 minutes
<ClarityChatApp api="/api/chat" />

// With memory enabled
<ClarityChatApp api="/api/chat" features={{ memory: true }} />

// Enterprise preset with all features
<ClarityChatApp api="/api/chat" preset="enterprise" />`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}
