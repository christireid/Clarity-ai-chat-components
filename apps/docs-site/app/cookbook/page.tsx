import React from 'react'
import { Metadata } from 'next'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Cookbook - Clarity Chat Components',
  description:
    'Real-world recipes for common AI chat patterns and integrations.',
}

export default function CookbookPage() {
  return (
    <div className="docs-content">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
          Cookbook
        </h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Real-world recipes you can copy and use. Each recipe solves a specific
          problem with production-ready code.
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
          <strong>Pro tip:</strong> All recipes are fully typed with TypeScript and include error handling.
          They're ready to use in production applications.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">Available Recipes</h2>
        <p className="text-text-secondary mb-8">
          These are battle-tested patterns used in real applications. Click any
          recipe to see the complete implementation with copy-paste ready code.
        </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a href="/cookbook/openai-streaming-chat" className="group p-6 rounded-xl bg-bg-secondary border border-border hover:border-brand-500/40 hover:shadow-lg transition-all">
          <div className="flex items-start gap-3">
            <span className="text-3xl">💬</span>
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary mb-2 group-hover:text-brand-500 transition-colors">
                OpenAI Streaming Chat
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Build a complete chat with OpenAI streaming responses
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2 py-1 rounded font-medium">
                  OpenAI
                </span>
                <span className="text-xs bg-bg-tertiary text-text-secondary px-2 py-1 rounded">
                  Streaming
                </span>
              </div>
            </div>
          </div>
        </a>

          <a href="/cookbook/conversation-branching" className="group p-6 rounded-xl bg-bg-secondary border border-border hover:border-brand-500/40 hover:shadow-lg transition-all">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌿</span>
              <div>
                <h3>Conversation Branching</h3>
                <p className="text-sm text-muted-foreground">
                  Speculative replies with branch visualizer and history management
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    Blueprint v2.1
                  </span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">
                    Branching
                  </span>
                </div>
              </div>
            </div>
          </a>

          <a href="/cookbook/latex-markdown" className="group p-6 rounded-xl bg-bg-secondary border border-border hover:border-brand-500/40 hover:shadow-lg transition-all">
            <div className="flex items-start gap-3">
              <span className="text-2xl">∑</span>
              <div>
                <h3>LaTeX & Markdown Renderer</h3>
                <p className="text-sm text-muted-foreground">
                  Render math-heavy answers with KaTeX, syntax highlighting, and copy buttons
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    Math
                  </span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">
                    Markdown
                  </span>
                </div>
              </div>
            </div>
          </a>

          <a href="/cookbook/advanced-export" className="group p-6 rounded-xl bg-bg-secondary border border-border hover:border-brand-500/40 hover:shadow-lg transition-all">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📤</span>
              <div>
                <h3>Advanced Export Workflows</h3>
                <p className="text-sm text-muted-foreground">
                  Export transcripts to PDF, Markdown, HTML, or JSON with analytics and privacy controls
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    Export
                  </span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">
                    Privacy
                  </span>
                </div>
              </div>
            </div>
          </a>

        <a href="/cookbook/rag-document-chat" className="docs-card group">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <h3>RAG Document Chat</h3>
              <p className="text-sm text-muted-foreground">
                Chat with your documents using vector search and RAG
              </p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  RAG
                </span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  Pinecone
                </span>
              </div>
            </div>
          </div>
        </a>

        <a href="/cookbook/multi-modal-chat" className="docs-card group">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🖼️</span>
            <div>
              <h3>Multi-Modal Chat</h3>
              <p className="text-sm text-muted-foreground">
                Upload and discuss images, PDFs, and other files
              </p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  Vision
                </span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  Files
                </span>
              </div>
            </div>
          </div>
        </a>

        <a href="/cookbook/agent-with-tools" className="docs-card group">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h3>AI Agent with Tools</h3>
              <p className="text-sm text-muted-foreground">
                Build an agent that can call functions and APIs
              </p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  Agents
                </span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  Tools
                </span>
              </div>
            </div>
          </div>
        </a>

        <a href="/cookbook/voice-chat" className="docs-card group">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎤</span>
            <div>
              <h3>Voice-Enabled Chat</h3>
              <p className="text-sm text-muted-foreground">
                Add voice input and text-to-speech to your chat
              </p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  Voice
                </span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  STT/TTS
                </span>
              </div>
            </div>
          </div>
        </a>

        <a href="/cookbook/team-collaboration-chat" className="docs-card group">
          <div className="flex items-start gap-3">
            <span className="text-2xl">👥</span>
            <div>
              <h3>Team Collaboration Chat</h3>
              <p className="text-sm text-muted-foreground">
                Multi-user chat with presence and typing indicators
              </p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  Real-time
                </span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  WebSocket
                </span>
              </div>
            </div>
          </div>
        </a>

        <a href="/cookbook/custom-theming" className="docs-card group">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎨</span>
            <div>
              <h3>Custom Theming</h3>
              <p className="text-sm text-muted-foreground">
                Create and apply custom themes with dark mode
              </p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  Theming
                </span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  CSS
                </span>
              </div>
            </div>
          </div>
        </a>

        <a href="/cookbook/error-handling" className="docs-card group">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3>Robust Error Handling</h3>
              <p className="text-sm text-muted-foreground">
                Handle API errors, retries, and edge cases gracefully
              </p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  Errors
                </span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  Retry Logic
                </span>
              </div>
            </div>
          </div>
        </a>

        <a href="/cookbook/nextjs-integration" className="docs-card group">
          <div className="flex items-start gap-3">
            <span className="text-2xl">▲</span>
            <div>
              <h3>Next.js 14 Integration</h3>
              <p className="text-sm text-muted-foreground">
                Complete setup with App Router and Server Components
              </p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  Next.js
                </span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  RSC
                </span>
              </div>
            </div>
          </div>
        </a>

        <a href="/cookbook/authentication" className="docs-card group">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔐</span>
            <div>
              <h3>User Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Secure chat with user authentication and sessions
              </p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  Auth
                </span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  NextAuth
                </span>
              </div>
            </div>
          </div>
        </a>

        <a href="/cookbook/analytics-tracking" className="docs-card group">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <h3>Analytics & Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Track usage, costs, and user behavior
              </p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  Analytics
                </span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  Metrics
                </span>
              </div>
            </div>
          </div>
        </a>

        <a href="/cookbook/rate-limiting" className="docs-card group">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⏱️</span>
            <div>
              <h3>Rate Limiting & Quotas</h3>
              <p className="text-sm text-muted-foreground">
                Manage API limits and user quotas effectively
              </p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  Limits
                </span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  Redis
                </span>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}
