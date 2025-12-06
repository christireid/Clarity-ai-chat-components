import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Token Optimization Guide - Clarity Chat Components',
  description: 'Comprehensive guide to optimizing token usage in AI chat applications.',
}

export default function TokenOptimizationGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Token Optimization Guide</h1>
        <p className="docs-lead">
          Learn how to optimize token usage in your AI chat applications to reduce costs and improve performance.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Understand token optimization strategies',
          'Use TOON format for structured data',
          'Enable prompt caching',
          'Implement semantic caching',
          'Monitor and manage token budgets',
          'Optimize conversation history',
        ]}
      />

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Token optimization is crucial for managing costs and staying within model context limits. This guide covers
          various strategies and tools available in Clarity Chat Components.
        </p>
      </section>

      <section className="docs-section">
        <h2>Token Optimization Strategies</h2>

        <h3>1. TOON Format (30-60% Savings)</h3>
        <p>
          Use TOON (Token-Optimized Object Notation) for structured data like JSON, arrays, and objects:
        </p>
        <CodePlayground
          initialCode={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

const { optimizedMessages } = useTokenOptimizationEnhanced({
  enableToon: true,
  toonMinSavings: 0.3,  // Only use if savings >= 30%
})`}
        />

        <h3>2. Prompt Caching (50-90% Savings)</h3>
        <p>
          Cache repeated system prompts and context:
        </p>
        <CodePlayground
          initialCode={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

const { optimizedMessages } = useTokenOptimizationEnhanced({
  enablePromptCaching: true,
  cachingProvider: 'anthropic',  // or 'openai'
})`}
        />

        <h3>3. Semantic Caching</h3>
        <p>
          Cache semantically similar queries:
        </p>
        <CodePlayground
          initialCode={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

const { optimizedMessages } = useTokenOptimizationEnhanced({
  enableSemanticCaching: true,
  similarityThreshold: 0.85,  // 85% similarity required
})`}
        />

        <h3>4. History Limiting</h3>
        <p>
          Automatically limit conversation history:
        </p>
        <CodePlayground
          initialCode={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

const { optimizedMessages } = useTokenOptimizationEnhanced({
  enableHistoryLimiting: true,
  historyLimiting: {
    maxMessages: 50,
    maxTokens: 8000,
    strategy: 'keep-recent',
  },
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Token Budget Monitoring</h2>
        <p>
          Monitor token usage in real-time with threshold warnings:
        </p>
        <CodePlayground
          initialCode={`import { useTokenBudgetMonitor } from '@clarity-chat/react'

const { usage, status, trimMessages } = useTokenBudgetMonitor(messages, {
  maxInputTokens: 128000,
  warningThreshold: 0.8,   // Warn at 80%
  criticalThreshold: 0.95,  // Critical at 95%
  autoTrim: true,           // Auto-trim at critical
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Context Monitoring</h2>
        <p>
          Monitor context utilization and get optimization recommendations:
        </p>
        <CodePlayground
          initialCode={`import { useContextMonitor } from '@clarity-chat/react'

const { utilization, recommendations } = useContextMonitor(messages, {
  maxTokens: 128000,
  enableRecommendations: true,
})

// Follow recommendations
recommendations.forEach(rec => {
  if (rec.action === 'compress') {
    // Compress context
  } else if (rec.action === 'summarize') {
    // Summarize old messages
  }
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Enable TOON for structured data (JSON, arrays, objects)</li>
          <li>Use prompt caching when system prompts are repeated</li>
          <li>Set similarity threshold between 0.8-0.9 for semantic caching</li>
          <li>Enable history limiting for long conversations</li>
          <li>Monitor token usage with useTokenBudgetMonitor</li>
          <li>Follow optimization recommendations from useContextMonitor</li>
          <li>Reserve tokens for output responses</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/hooks/use-token-optimization-enhanced">useTokenOptimizationEnhanced</a> - Advanced optimization hook</li>
          <li><a href="/reference/hooks/use-token-budget-monitor">useTokenBudgetMonitor</a> - Budget monitoring</li>
          <li><a href="/reference/hooks/use-context-monitor">useContextMonitor</a> - Context monitoring</li>
          <li><a href="/reference/components/token-counter">TokenCounter</a> - Token display component</li>
        </ul>
      </section>
    </div>
  )
}
