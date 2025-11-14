import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
export const metadata = {
    title: 'Analytics & Tracking - Cookbook - Clarity Chat',
    description: 'Track chat usage, costs, user behavior, and key metrics in your AI application.',
};
export default function AnalyticsTrackingPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Cookbook" }), _jsx("h1", { children: "Analytics & Tracking" }), _jsx("p", { className: "docs-lead", children: "Know what's happening in your chat app. Track costs, usage, popular questions, and user behavior. Make data-driven decisions." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "What to Track" }), _jsxs("ul", { children: [_jsx("li", { children: "\uD83D\uDCB0 **Costs**: Token usage, API calls" }), _jsx("li", { children: "\uD83D\uDC65 **Users**: Active users, retention" }), _jsx("li", { children: "\uD83D\uDCAC **Messages**: Count, length, topics" }), _jsx("li", { children: "\u26A1 **Performance**: Response time, errors" }), _jsx("li", { children: "\uD83C\uDFAF **Quality**: User feedback, ratings" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Event Tracking" }), _jsx(CodeBlock, { language: "typescript", code: `// lib/analytics.ts
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
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Track Token Usage & Costs" }), _jsx(CodeBlock, { language: "typescript", code: `// Track every API call
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
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Usage Dashboard" }), _jsx(CodeBlock, { language: "typescript", code: `import { UsageDashboard } from '@clarity-chat/react'

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
/>` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Track User Feedback" }), _jsx(CodeBlock, { language: "typescript", code: `import { Message } from '@clarity-chat/react'

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
// Identify patterns to improve` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Custom Events" }), _jsx(CodeBlock, { language: "typescript", code: `// Track important events
trackEvent('conversation_started')
trackEvent('first_message_sent')
trackEvent('document_uploaded', { fileType: 'pdf', size: file.size })
trackEvent('agent_tool_called', { tool: 'web_search' })
trackEvent('error_occurred', { error: error.message, code: error.status })
trackEvent('conversation_exported')
trackEvent('theme_changed', { theme: 'dark' })
trackEvent('model_switched', { from: 'gpt-3.5', to: 'gpt-4' })` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Performance Monitoring" }), _jsx(CodeBlock, { language: "typescript", code: `// Track response times
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
/>` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs("ul", { children: [_jsx("li", { children: "Track events on both client and server" }), _jsx("li", { children: "Don't track PII without consent" }), _jsx("li", { children: "Aggregate data for privacy" }), _jsx("li", { children: "Set up alerts for high costs" }), _jsx("li", { children: "Monitor error rates" }), _jsx("li", { children: "A/B test different prompts" })] }), _jsx(Callout, { type: "warning", title: "Privacy First", children: "Never track message content without user consent. Track metadata like length, timestamp, model - not the actual conversation." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related Recipes" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/cookbook/rate-limiting", className: "docs-card", children: [_jsx("h3", { children: "Rate Limiting" }), _jsx("p", { children: "Control costs" })] }), _jsxs("a", { href: "/reference/components/usage-dashboard", className: "docs-card", children: [_jsx("h3", { children: "Usage Dashboard" }), _jsx("p", { children: "Component docs" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map