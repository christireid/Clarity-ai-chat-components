'use client'

import React from 'react'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'
import { Callout } from '@/components/MDX/Callout'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'
import { RecipeCard } from '@/components/Cookbook'

// Recipe data for maintainability
const recipes = [
  {
    href: '/cookbook/openai-streaming-chat',
    icon: '💬',
    title: 'OpenAI Streaming Chat',
    description: 'Build a complete chat with OpenAI streaming responses',
    tags: [{ label: 'OpenAI', primary: true }, { label: 'Streaming' }],
  },
  {
    href: '/cookbook/conversation-branching',
    icon: '🌿',
    title: 'Conversation Branching',
    description:
      'Speculative replies with branch visualizer and history management',
    tags: [{ label: 'Blueprint v2.1', primary: true }, { label: 'Branching' }],
  },
  {
    href: '/cookbook/latex-markdown',
    icon: '∑',
    title: 'LaTeX & Markdown Renderer',
    description:
      'Render math-heavy answers with KaTeX, syntax highlighting, and copy buttons',
    tags: [{ label: 'Math', primary: true }, { label: 'Markdown' }],
  },
  {
    href: '/cookbook/advanced-export',
    icon: '📤',
    title: 'Advanced Export Workflows',
    description:
      'Export transcripts to PDF, Markdown, HTML, or JSON with analytics and privacy controls',
    tags: [{ label: 'Export', primary: true }, { label: 'Privacy' }],
  },
  {
    href: '/cookbook/rag-document-chat',
    icon: '📚',
    title: 'RAG Document Chat',
    description: 'Chat with your documents using vector search and RAG',
    tags: [{ label: 'RAG', primary: true }, { label: 'Pinecone' }],
  },
  {
    href: '/cookbook/multi-modal-chat',
    icon: '🖼️',
    title: 'Multi-Modal Chat',
    description: 'Upload and discuss images, PDFs, and other files',
    tags: [{ label: 'Vision', primary: true }, { label: 'Files' }],
  },
  {
    href: '/cookbook/agent-with-tools',
    icon: '🤖',
    title: 'AI Agent with Tools',
    description: 'Build an agent that can call functions and APIs',
    tags: [{ label: 'Agents', primary: true }, { label: 'Tools' }],
  },
  {
    href: '/cookbook/voice-chat',
    icon: '🎤',
    title: 'Voice-Enabled Chat',
    description: 'Add voice input and text-to-speech to your chat',
    tags: [{ label: 'Voice', primary: true }, { label: 'STT/TTS' }],
  },
  {
    href: '/cookbook/team-collaboration-chat',
    icon: '👥',
    title: 'Team Collaboration Chat',
    description: 'Multi-user chat with presence and typing indicators',
    tags: [{ label: 'Real-time', primary: true }, { label: 'WebSocket' }],
  },
  {
    href: '/cookbook/custom-theming',
    icon: '🎨',
    title: 'Custom Theming',
    description: 'Create and apply custom themes with dark mode',
    tags: [{ label: 'Theming', primary: true }, { label: 'CSS' }],
  },
  {
    href: '/cookbook/error-handling',
    icon: '⚠️',
    title: 'Robust Error Handling',
    description: 'Handle API errors, retries, and edge cases gracefully',
    tags: [{ label: 'Errors', primary: true }, { label: 'Retry Logic' }],
  },
  {
    href: '/cookbook/nextjs-integration',
    icon: '▲',
    title: 'Next.js 14 Integration',
    description: 'Complete setup with App Router and Server Components',
    tags: [{ label: 'Next.js', primary: true }, { label: 'RSC' }],
  },
  {
    href: '/cookbook/authentication',
    icon: '🔐',
    title: 'User Authentication',
    description: 'Secure chat with user authentication and sessions',
    tags: [{ label: 'Auth', primary: true }, { label: 'NextAuth' }],
  },
  {
    href: '/cookbook/analytics-tracking',
    icon: '📊',
    title: 'Analytics & Tracking',
    description: 'Track usage, costs, and user behavior',
    tags: [{ label: 'Analytics', primary: true }, { label: 'Metrics' }],
  },
  {
    href: '/cookbook/rate-limiting',
    icon: '⏱️',
    title: 'Rate Limiting & Quotas',
    description: 'Manage API limits and user quotas effectively',
    tags: [{ label: 'Limits', primary: true }, { label: 'Redis' }],
  },
] as const

export default function CookbookPage() {
  return (
    <div className="docs-content">
      <ScrollReveal>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
            Cookbook
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            Real-world recipes you can copy and use. Each recipe solves a
            specific problem with robust code.
          </p>
        </div>

        <YouWillLearn
          items={[
            'Copy-paste ready code examples',
            'Production-tested patterns',
            'Common integration scenarios',
            'Best practices and optimizations',
          ]}
        />

        <Callout type="tip" className="mb-8">
          <p>
            <strong>Pro tip:</strong> All recipes are fully typed with
            TypeScript and include error handling. They're ready to use in
            production applications.
          </p>
        </Callout>
      </ScrollReveal>

      <section className="my-12">
        <ScrollReveal>
          <h2 className="text-3xl font-bold mb-6">Available Recipes</h2>
          <p className="text-text-secondary mb-8">
            These are battle-tested patterns used in real applications. Click
            any recipe to see the complete implementation with copy-paste ready
            code.
          </p>
        </ScrollReveal>

        <ScrollReveal
          stagger
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {recipes.map((recipe) => (
            <ScrollRevealItem key={recipe.href}>
              <RecipeCard
                href={recipe.href}
                icon={recipe.icon}
                title={recipe.title}
                description={recipe.description}
                tags={recipe.tags}
              />
            </ScrollRevealItem>
          ))}
        </ScrollReveal>
      </section>
    </div>
  )
}
