'use client'

import { useState } from 'react'
import { AdvancedFeaturesDemo } from '@/components/advanced-features-demo'

/**
 * Advanced Features Example
 *
 * This page demonstrates the four "Quick Win" advanced features:
 * 1. Enhanced Follow-up Suggestions (ML-ranked)
 * 2. Conversation Summarizer
 * 3. Battery-Aware Optimizations
 * 4. Performance Analytics Dashboard
 */
export default function AdvancedFeaturesPage() {
  const [activeTab, setActiveTab] = useState<'demo' | 'suggestions' | 'battery' | 'performance'>('demo')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold">Advanced Features</h1>
              <p className="text-xs text-muted-foreground">Quick wins for production chat</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-1">
            {[
              { id: 'demo', label: 'Full Demo' },
              { id: 'suggestions', label: 'Suggestions' },
              { id: 'battery', label: 'Battery' },
              { id: 'performance', label: 'Performance' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <AdvancedFeaturesDemo activeTab={activeTab} />
      </main>
    </div>
  )
}
