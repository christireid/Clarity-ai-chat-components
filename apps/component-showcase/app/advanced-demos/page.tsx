'use client'

import { PageHeader } from '@/components/component-section'
import { cn } from '@clarity-chat/primitives'
import {
  GraduationCap,
  Globe,
  Blocks,
  ArrowRight,
  Brain,
  Search,
  Wrench,
  MessageSquare,
  Code,
  FileText,
  Database,
  Sparkles,
  Zap,
  Shield,
  Layers,
  BookOpen,
} from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface DemoCard {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  gradient: string
  features: string[]
  componentCount: number
  tag: string
}

const demos: DemoCard[] = [
  {
    title: 'Library Learning Hub',
    description:
      'An AI-powered tutor built with a RAG system that indexes the entire Clarity Chat library. Ask questions about components, hooks, adapters, and get instant code examples with source citations.',
    href: '/advanced-demos/library-learning-hub',
    icon: <GraduationCap className="h-8 w-8" />,
    gradient: 'from-emerald-500 to-teal-600',
    features: [
      'RAG-powered library knowledge base',
      'Component & hook documentation search',
      'Interactive code examples',
      'Slash commands & @mentions',
      'Saved prompt library',
      'Memory & token optimization',
    ],
    componentCount: 35,
    tag: 'Learning & RAG',
  },
  {
    title: 'Deep Research Assistant',
    description:
      'A research-focused chat that performs multi-step deep research with enriched sources, MCP server integration, and tool plugins. Combines web research with library knowledge to help users build AI applications.',
    href: '/advanced-demos/deep-research-assistant',
    icon: <Globe className="h-8 w-8" />,
    gradient: 'from-blue-500 to-indigo-600',
    features: [
      'Deep research pipeline visualization',
      'MCP server plugin system',
      'Enriched source cards with citations',
      'Multi-tool execution (search, code, analyze)',
      'Research session management',
      'Export as research reports',
    ],
    componentCount: 40,
    tag: 'Research & MCP',
  },
  {
    title: 'Artifact Studio',
    description:
      'A Claude-style artifact creation environment that generates code, documents, diagrams, and interactive previews in a side panel. Create, iterate, and export artifacts with full version history.',
    href: '/advanced-demos/artifact-studio',
    icon: <Blocks className="h-8 w-8" />,
    gradient: 'from-violet-500 to-purple-600',
    features: [
      'Multi-type artifact creation (code, docs, diagrams)',
      'Live preview panel with version history',
      'Mermaid diagram rendering',
      'HTML/React component preview',
      'Artifact iteration & refinement',
      'Export artifacts as files',
    ],
    componentCount: 38,
    tag: 'Artifacts & Generative UI',
  },
]

const sharedFeatures = [
  {
    icon: <Brain className="h-5 w-5" />,
    title: 'Model Switching',
    description: 'Hot-swap between OpenAI, Anthropic, and Google models with adapter visualization',
  },
  {
    icon: <Wrench className="h-5 w-5" />,
    title: 'Tools & Plugins',
    description: 'Extensible tool system with execution cards, approval flows, and MCP integration',
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: 'Slash Commands & Mentions',
    description: 'Type / for commands or @ to mention components, tools, and resources',
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: 'Prompt Library',
    description: 'Save, reuse, and manage prompt templates within each chat',
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: 'Memory Management',
    description: 'Configurable memory strategies with token-aware context optimization',
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'Token Optimization',
    description: 'Multiple compression techniques with real-time cost tracking',
  },
  {
    icon: <Code className="h-5 w-5" />,
    title: 'Syntax Highlighting',
    description: 'Full code highlighting with copy, language detection, and streaming support',
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'File Upload & Context',
    description: 'Upload documents as master context for richer, more relevant responses',
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: 'Streaming & Thinking',
    description: 'Real-time streaming responses with expandable chain-of-thought reasoning',
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Full Message Actions',
    description: 'Edit, delete, regenerate, thumbs up/down, copy — all working interactively',
  },
  {
    icon: <Search className="h-5 w-5" />,
    title: 'Citations & Sources',
    description: 'Rich source cards with relevance scores, inline citations, and source grouping',
  },
  {
    icon: <Layers className="h-5 w-5" />,
    title: 'Chat Export',
    description: 'Export conversations as Markdown, JSON, or formatted reports',
  },
]

export default function AdvancedDemosPage() {
  return (
    <div>
      <PageHeader
        title="Advanced Chat Demos"
        description="Three production-quality interactive demos showcasing the full power of Clarity Chat Components — model adapters, RAG, MCP servers, tools, artifacts, and more."
        icon={Sparkles}
        badge="113 Components"
      />

      {/* Demo Cards */}
      <div className="grid gap-8 mb-16">
        {demos.map((demo) => (
          <Link key={demo.href} href={demo.href} className="group block">
            <div className="glass-card p-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
              <div className="flex flex-col lg:flex-row">
                {/* Left - Icon & Gradient */}
                <div
                  className={cn(
                    'flex items-center justify-center p-8 lg:p-12 lg:w-64 bg-gradient-to-br text-white shrink-0',
                    demo.gradient
                  )}
                >
                  <div className="flex flex-col items-center gap-3">
                    {demo.icon}
                    <span className="text-xs font-medium opacity-80 uppercase tracking-wider">
                      {demo.tag}
                    </span>
                  </div>
                </div>

                {/* Right - Content */}
                <div className="flex-1 p-6 lg:p-8">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {demo.title}
                      </h2>
                      <span className="text-xs text-muted-foreground">
                        {demo.componentCount} components showcased
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                      <span>Open Demo</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{demo.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {demo.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Shared Features Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Shared Across All Demos</h2>
        <p className="text-muted-foreground mb-6">
          Every advanced demo includes these core capabilities, each fully interactive and
          configurable.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sharedFeatures.map((feature) => (
            <div key={feature.title} className="glass-panel p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="icon-container-sm shrink-0">{feature.icon}</div>
                <h3 className="font-medium text-sm">{feature.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
