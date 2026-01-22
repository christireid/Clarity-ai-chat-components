import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guides - Clarity Chat Components',
  description:
    'In-depth guides on key concepts for building AI chat applications.',
}

export default function GuidesPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <h1>Guides</h1>
        <p className="docs-lead">
          Deep dives into important concepts. Go beyond copy-paste and truly
          understand how things work.
        </p>
      </div>

      <section className="docs-section">
        <h2>Core Concepts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/guides/streaming" className="docs-card group">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h3>Streaming Responses</h3>
                <p className="text-sm text-muted-foreground">
                  How streaming works, when to use it, and how to implement it
                  properly
                </p>
              </div>
            </div>
          </a>

          <a href="/guides/rag" className="docs-card group">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <h3>RAG (Retrieval-Augmented Generation)</h3>
                <p className="text-sm text-muted-foreground">
                  Make AI answer from YOUR documents, not just training data
                </p>
              </div>
            </div>
          </a>

          <a href="/guides/agents" className="docs-card group">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h3>AI Agents & Tools</h3>
                <p className="text-sm text-muted-foreground">
                  Give AI the ability to take actions and call functions
                </p>
              </div>
            </div>
          </a>

          <a href="/guides/state-management" className="docs-card group">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <h3>State Management</h3>
                <p className="text-sm text-muted-foreground">
                  Managing chat state, history, and real-time updates
                </p>
              </div>
            </div>
          </a>

          <a href="/guides/accessibility" className="docs-card group">
            <div className="flex items-start gap-3">
              <span className="text-2xl">♿</span>
              <div>
                <h3>Accessibility</h3>
                <p className="text-sm text-muted-foreground">
                  Build inclusive chat experiences for all users
                </p>
              </div>
            </div>
          </a>

          <a href="/guides/performance" className="docs-card group">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚀</span>
              <div>
                <h3>Performance Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Keep your chat fast with thousands of messages
                </p>
              </div>
            </div>
          </a>

          <a href="/guides/security" className="docs-card group">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h3>Security Best Practices</h3>
                <p className="text-sm text-muted-foreground">
                  Protect user data and prevent common vulnerabilities
                </p>
              </div>
            </div>
          </a>

          <a href="/guides/mobile" className="docs-card group">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <h3>Mobile Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Touch interactions, keyboard handling, and responsive design
                </p>
              </div>
            </div>
          </a>

          <a href="/guides/testing" className="docs-card group">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🧪</span>
              <div>
                <h3>Testing Strategies</h3>
                <p className="text-sm text-muted-foreground">
                  Test AI interactions, mock APIs, and ensure quality
                </p>
              </div>
            </div>
          </a>

          <a href="/guides/production-deployment" className="docs-card group">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚢</span>
              <div>
                <h3>Production Deployment</h3>
                <p className="text-sm text-muted-foreground">
                  Deploy, monitor, and scale your chat application
                </p>
              </div>
            </div>
          </a>
        </div>
      </section>
    </div>
  )
}
