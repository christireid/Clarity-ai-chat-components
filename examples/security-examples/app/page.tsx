'use client'

import { useState } from 'react'
import { SecurityDemo } from '@/components/security-demo'

/**
 * Security Examples Page
 *
 * Demonstrates comprehensive security features:
 * 1. Prompt Injection Detection
 * 2. PII Redaction
 * 3. Jailbreak Prevention
 * 4. Security Monitoring
 */
export default function SecurityExamplesPage() {
  const [activeTab, setActiveTab] = useState<
    'test-bench' | 'monitor' | 'config'
  >('test-bench')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold">Security Examples</h1>
              <p className="text-xs text-muted-foreground">
                Prompt injection, PII, jailbreak protection
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-1">
            {[
              { id: 'test-bench', label: 'Test Bench' },
              { id: 'monitor', label: 'Monitor' },
              { id: 'config', label: 'Config' },
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
        <SecurityDemo activeTab={activeTab} />
      </main>
    </div>
  )
}
