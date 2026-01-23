import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const metadata: Metadata = {
  title: 'ConversationAnalyticsDashboard | Clarity Chat',
  description:
    'AI-powered conversation analytics with topic extraction, sentiment analysis, and quality metrics.',
}

const conversationAnalyticsDashboardProps: Prop[] = [
  {
    name: 'messages',
    type: 'Message[]',
    required: true,
    description: 'Messages to analyze.',
  },
  {
    name: 'analytics',
    type: 'ConversationAnalytics',
    description: 'Pre-computed analytics data (optional).',
  },
  {
    name: 'onGenerateAnalytics',
    type: '(messages: Message[]) => Promise<ConversationAnalytics>',
    description: 'Callback for custom analytics generation using AI/ML.',
  },
  {
    name: 'autoGenerate',
    type: 'boolean',
    default: 'false',
    description: 'Auto-generate analytics when messages change.',
  },
  {
    name: 'updateInterval',
    type: 'number',
    default: '30000',
    description: 'Update interval for auto-generation (milliseconds).',
  },
  {
    name: 'onAnalyticsGenerated',
    type: '(analytics: ConversationAnalytics) => void',
    description: 'Callback when analytics are generated.',
  },
  {
    name: 'detailed',
    type: 'boolean',
    default: 'false',
    description: 'Show detailed breakdown of analytics.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Custom className.',
  },
]

export default function ConversationAnalyticsDashboardPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>ConversationAnalyticsDashboard</h1>

      <p className="lead">
        AI-powered conversation analytics dashboard that provides insights into
        conversation patterns, topics, sentiment, quality metrics, and key
        moments. Perfect for understanding user engagement and conversation
        effectiveness.
      </p>

      <Callout type="info" title="Conversation Insights">
        <p>
          This dashboard automatically analyzes conversations to extract topics,
          detect sentiment, identify key moments, and calculate quality scores.
          Use it to understand user engagement and improve conversation quality.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the component:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { ConversationAnalyticsDashboard } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function AnalyticsView({ messages }: { messages: Message[] }) {
  return (
    <ConversationAnalyticsDashboard
      messages={messages}
      autoGenerate
      updateInterval={30000}
      onAnalyticsGenerated={(analytics) => {
        console.log('Analytics:', analytics)
      }}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with ConversationAnalyticsDashboard:
        </p>
        <CodePlayground
          initialCode={`import { ConversationAnalyticsDashboard } from '@clarity-chat/react'

function Example() {
  const messages = [
    { id: '1', role: 'user', content: 'Hello, how are you?' },
    { id: '2', role: 'assistant', content: 'I am doing well, thank you!' },
  ]

  return (
    <ConversationAnalyticsDashboard
      messages={messages}
      autoGenerate
      detailed
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">
          With Custom AI Analytics
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ConversationAnalyticsDashboard } from '@clarity-chat/react'
import type { Message, ConversationAnalytics } from '@clarity-chat/types'

function AIAnalyticsView({ messages }: { messages: Message[] }) {
  const generateAnalytics = async (msgs: Message[]): Promise<ConversationAnalytics> => {
    // Call your AI/ML service
    const response = await fetch('/api/analyze-conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: msgs }),
    })
    
    if (!response.ok) {
      throw new Error('Analytics generation failed')
    }
    
    return response.json()
  }

  return (
    <ConversationAnalyticsDashboard
      messages={messages}
      onGenerateAnalytics={generateAnalytics}
      autoGenerate
      onAnalyticsGenerated={(analytics) => {
        // Store analytics for later analysis
        saveAnalytics(analytics)
      }}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">
          With Pre-computed Analytics
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ConversationAnalyticsDashboard } from '@clarity-chat/react'
import type { ConversationAnalytics } from '@clarity-chat/types'

function PrecomputedAnalytics({ 
  messages, 
  analytics 
}: { 
  messages: Message[]
  analytics: ConversationAnalytics 
}) {
  return (
    <ConversationAnalyticsDashboard
      messages={messages}
      analytics={analytics}
      detailed
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">
          With Real-time Updates
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ConversationAnalyticsDashboard } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'

function RealTimeAnalytics() {
  const { messages } = useClarityChat({ api: '/api/chat' })

  return (
    <div className="grid grid-cols-2 gap-4">
      <ChatWindow messages={messages} />
      <ConversationAnalyticsDashboard
        messages={messages}
        autoGenerate
        updateInterval={10000} // Update every 10 seconds
        detailed
      />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Props</h2>
        <PropsTable
          props={conversationAnalyticsDashboardProps}
          title="Component Props"
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Analytics Features</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Topic Extraction</h3>
            <p className="mb-2 text-gray-600 dark:text-gray-400">
              Automatically identifies and clusters topics from conversations
              using keyword analysis and co-occurrence patterns.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Sentiment Analysis</h3>
            <p className="mb-2 text-gray-600 dark:text-gray-400">
              Tracks sentiment over time and provides overall sentiment
              classification (positive, neutral, negative) with confidence
              scores.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Quality Metrics</h3>
            <p className="mb-2 text-gray-600 dark:text-gray-400">
              Calculates conversation quality scores based on engagement,
              coherence, depth, and efficiency factors.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Key Moments</h3>
            <p className="mb-2 text-gray-600 dark:text-gray-400">
              Detects important moments in conversations such as breakthroughs,
              confusion points, questions, decisions, and insights.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Automatic Summarization
            </h3>
            <p className="mb-2 text-gray-600 dark:text-gray-400">
              Generates summaries with key points, next steps, open questions,
              decisions, and action items.
            </p>
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Use AI for better insights</strong> - Provide
            onGenerateAnalytics for LLM-powered analysis
          </li>
          <li>
            <strong>Cache analytics</strong> - Store pre-computed analytics to
            avoid regeneration
          </li>
          <li>
            <strong>Set appropriate intervals</strong> - Balance between
            real-time updates and performance
          </li>
          <li>
            <strong>Monitor quality scores</strong> - Track quality trends to
            improve conversations
          </li>
          <li>
            <strong>Use key moments</strong> - Highlight important conversation
            points to users
          </li>
          <li>
            <strong>Track sentiment trends</strong> - Monitor sentiment over
            time to identify issues
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/reference/components/performance-analytics-dashboard"
            className="docs-card"
          >
            <h3>PerformanceAnalyticsDashboard</h3>
            <p>Performance monitoring</p>
          </a>
          <a
            href="/reference/components/ab-testing-dashboard"
            className="docs-card"
          >
            <h3>ABTestingDashboard</h3>
            <p>A/B test analytics</p>
          </a>
          <a
            href="/reference/components/conversation-summarizer"
            className="docs-card"
          >
            <h3>ConversationSummarizer</h3>
            <p>Conversation summaries</p>
          </a>
          <a href="/guides/analytics" className="docs-card">
            <h3>Analytics Guide</h3>
            <p>Analytics implementation guide</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{
          title: 'PerformanceAnalyticsDashboard',
          href: '/reference/components/performance-analytics-dashboard',
        }}
        next={{
          title: 'ABTestingDashboard',
          href: '/reference/components/ab-testing-dashboard',
        }}
      />
    </>
  )
}
