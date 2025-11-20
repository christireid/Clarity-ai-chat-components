import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Analytics & Tracking - Cookbook - Clarity Chat',
  description: 'Track chat usage, costs, user behavior, and key metrics in your AI application.',
}

export default function AnalyticsTrackingPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Cookbook</span>
        <h1>Analytics & Tracking</h1>
        <p className="docs-lead">
          Know what's happening in your chat app. Track costs, usage, popular questions, and user behavior. Make data-driven decisions.
        </p>
      </div>

      <section className="docs-section">
        <h2>What to Track</h2>
        <ul>
          <li>💰 **Costs**: Token usage, API calls</li>
          <li>👥 **Users**: Active users, retention</li>
          <li>💬 **Messages**: Count, length, topics</li>
          <li>⚡ **Performance**: Response time, errors</li>
          <li>🎯 **Quality**: User feedback, ratings</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Basic Event Tracking</h2>
        <CodeBlock
          language="typescript"
          code={`// lib/analytics.ts
export function trackEvent(event: string, properties?: Record<string, any>) {
  // Send to your analytics service
  if (typeof window !== 'undefined') {
    // PostHog
    window.posthog?.capture(event, properties)
    
    // Mixpanel
    window.mixpanel?.track(event, properties)
    
    // Google Analytics
    window.gtag?.('event', event, properties)
  }
}

// Usage in chat
import { trackEvent } from '@/lib/analytics'

const handleSendMessage = async (content: string) => {
  trackEvent('message_sent', {
    length: content.length,
    hasAttachments: attachments.length > 0,
    timestamp: new Date().toISOString()
  })
  
  // ... send message
  
  trackEvent('message_received', {
    responseTime: Date.now() - startTime,
    tokensUsed: response.usage.total_tokens
  })
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Track Token Usage & Costs</h2>
        <CodeBlock
          language="typescript"
          code={`// Track every API call
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const startTime = Date.now()
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: messages
  })

  const duration = Date.now() - startTime
  const tokens = response.usage!.total_tokens

  // Calculate cost
  const cost = calculateCost('gpt-4-turbo-preview', tokens)

  // Save to database
  await prisma.usage.create({
    data: {
      userId: session.user.id,
      model: 'gpt-4-turbo-preview',
      promptTokens: response.usage!.prompt_tokens,
      completionTokens: response.usage!.completion_tokens,
      totalTokens: tokens,
      costUSD: cost,
      durationMs: duration,
      timestamp: new Date()
    }
  })

  return response
}

function calculateCost(model: string, tokens: number): number {
  const prices: Record<string, { input: number; output: number }> = {
    'gpt-4-turbo-preview': { input: 0.01 / 1000, output: 0.03 / 1000 },
    'gpt-3.5-turbo': { input: 0.0005 / 1000, output: 0.0015 / 1000 }
  }
  
  const price = prices[model]
  if (!price) return 0
  
  // Simplified - in reality, split input/output tokens
  return tokens * price.input
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Usage Dashboard</h2>
        <CodeBlock
          language="typescript"
          code={`import { UsageDashboard } from '@clarity-chat/react'

// Fetch usage data
const usageData = await prisma.usage.groupBy({
  by: ['model'],
  where: {
    userId: session.user.id,
    timestamp: { gte: thirtyDaysAgo }
  },
  _sum: {
    totalTokens: true,
    costUSD: true
  },
  _count: true
})

// Display
<UsageDashboard
  metrics={[
    {
      label: 'Total Cost',
      value: \`$\${totalCost.toFixed(2)}\`,
      trend: 'up'
    },
    {
      label: 'Messages',
      value: messageCount.toString(),
      trend: 'steady'
    },
    {
      label: 'Tokens Used',
      value: formatNumber(totalTokens),
      trend: 'up'
    }
  ]}
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>Track User Feedback</h2>
        <CodeBlock
          language="typescript"
          code={`import { Message } from '@clarity-chat/react'

<Message
  message={message}
  onFeedback={(type) => {
    // Track thumbs up/down
    trackEvent('message_feedback', {
      messageId: message.id,
      feedbackType: type,  // 'up' or 'down'
      messageLength: message.content.length,
      model: 'gpt-4'
    })
    
    // Save to database
    prisma.feedback.create({
      data: {
        messageId: message.id,
        userId: session.user.id,
        type: type,
        timestamp: new Date()
      }
    })
  }}
/>

// Later: analyze what messages get thumbs down
const poorMessages = await prisma.feedback.findMany({
  where: { type: 'down' },
  include: { message: true }
})
// Identify patterns to improve`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Events</h2>
        <CodeBlock
          language="typescript"
          code={`// Track important events
trackEvent('conversation_started')
trackEvent('first_message_sent')
trackEvent('document_uploaded', { fileType: 'pdf', size: file.size })
trackEvent('agent_tool_called', { tool: 'web_search' })
trackEvent('error_occurred', { error: error.message, code: error.status })
trackEvent('conversation_exported')
trackEvent('theme_changed', { theme: 'dark' })
trackEvent('model_switched', { from: 'gpt-3.5', to: 'gpt-4' })`}
        />
      </section>

      <section className="docs-section">
        <h2>Performance Monitoring</h2>
        <CodeBlock
          language="typescript"
          code={`// Track response times
const startTime = performance.now()

const response = await fetch('/api/chat', { ... })

const duration = performance.now() - startTime

trackEvent('api_response_time', {
  duration: Math.round(duration),
  model: 'gpt-4',
  success: response.ok
})

// Show to user
import { PerformanceDashboard } from '@clarity-chat/react'

<PerformanceDashboard
  metrics={[
    { label: 'Avg Response Time', value: '1.2s' },
    { label: 'P95 Latency', value: '3.5s' },
    { label: 'Error Rate', value: '0.5%' }
  ]}
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Track events on both client and server</li>
          <li>Don't track PII without consent</li>
          <li>Aggregate data for privacy</li>
          <li>Set up alerts for high costs</li>
          <li>Monitor error rates</li>
          <li>A/B test different prompts</li>
        </ul>

        <Callout type="warning" title="Privacy First">
          Never track message content without user consent. Track metadata like
          length, timestamp, model - not the actual conversation.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Related Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/cookbook/rate-limiting" className="docs-card">
            <h3>Rate Limiting</h3>
            <p>Control costs</p>
          </a>
          <a href="/reference/components/usage-dashboard" className="docs-card">
            <h3>Usage Dashboard</h3>
            <p>Component docs</p>
          </a>
        </div>
      </section>
    </div>
  )
}

