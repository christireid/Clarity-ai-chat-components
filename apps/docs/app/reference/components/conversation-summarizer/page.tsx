import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'ConversationSummarizer - Clarity Chat Components',
  description:
    'AI-powered conversation summarization with multiple detail levels, key topics, and action items.',
}

const props: Prop[] = [
  {
    name: 'messages',
    type: 'Message[]',
    required: true,
    description: 'Array of messages to summarize',
  },
  {
    name: 'config',
    type: 'Partial<SummarizationConfig>',
    description: 'Summarization configuration',
  },
  {
    name: 'onSummaryGenerated',
    type: '(summary: ConversationSummary) => void',
    description: 'Callback when summary is generated',
  },
  {
    name: 'onGenerateSummary',
    type: '(messages: Message[], level: SummaryLevel) => Promise<ConversationSummary>',
    description: 'Custom summarization logic',
  },
  {
    name: 'showHistory',
    type: 'boolean',
    description: 'Show history of generated summaries',
  },
  {
    name: 'defaultLevel',
    type: '"brief" | "detailed" | "comprehensive"',
    description: 'Default summary level',
  },
  {
    name: 'emptyState',
    type: 'React.ReactNode',
    description: 'Custom empty state',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function ConversationSummarizerPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>ConversationSummarizer</h1>
        <p className="docs-lead">
          AI-powered conversation summarization with multiple detail levels, key
          topics extraction, and action items.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Generate summaries at different detail levels',
          'Extract key topics and action items',
          'Configure automatic or manual summarization',
          'Export summaries as Markdown',
          'Track summary history',
        ]}
      />

      <Callout type="info" className="my-6">
        <p>
          <strong>New in 2025:</strong> This component provides 70% faster
          conversation review with AI-powered summarization at three detail
          levels: brief, detailed, and comprehensive.
        </p>
      </Callout>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Generate summaries manually with default configuration:</p>
        <CodePlayground
          initialCode={`import { ConversationSummarizer } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function ChatWithSummaries() {
  const [messages, setMessages] = React.useState<Message[]>([])

  return (
    <div className="p-4">
      <ConversationSummarizer
        messages={messages}
        config={{
          trigger: 'manual',
          provider: { type: 'openai', model: 'gpt-4o' },
          includeActionItems: true,
          includeKeyTopics: true,
        }}
        onSummaryGenerated={(summary) => {
          logger.debug('Summary:', summary.content)
          if (summary.keyTopics) {
            logger.debug('Key Topics:', summary.keyTopics)
          }
          if (summary.actionItems) {
            logger.debug('Action Items:', summary.actionItems)
          }
        }}
      />
    </div>
  )
}

render(<ChatWithSummaries />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Automatic Summarization</h2>
        <p>Configure automatic summarization at intervals:</p>
        <CodePlayground
          initialCode={`import { ConversationSummarizer } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function AutoSummarizeChat({ messages }: { messages: Message[] }) {
  const [isGenerating, setIsGenerating] = React.useState(false)

  return (
    <ConversationSummarizer
      messages={messages}
      config={{
        trigger: 'interval',
        interval: 10,  // Every 10 messages
        provider: { type: 'openai', model: 'gpt-4o' },
        includeActionItems: true,
        includeKeyTopics: true,
      }}
      onSummaryGenerated={(summary) => {
        // Automatically generated every 10 messages
        setIsGenerating(false)
        logger.debug('Auto-generated summary:', summary.content)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Summary Levels</h2>
        <p>Generate summaries at different detail levels:</p>
        <CodePlayground
          initialCode={`import { ConversationSummarizer } from '@clarity-chat/react'

function MultiLevelSummaries({ messages }: { messages: Message[] }) {
  return (
    <ConversationSummarizer
      messages={messages}
      config={{
        trigger: 'manual',
        levels: ['brief', 'detailed', 'comprehensive'],
        provider: { type: 'openai', model: 'gpt-4o' },
        maxLength: {
          brief: 50,
          detailed: 200,
          comprehensive: 500,
        },
      }}
      defaultLevel="detailed"
      onSummaryGenerated={(summary) => {
        logger.debug(\`\${summary.level} summary:\`, summary.content)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Key Topics and Action Items</h2>
        <p>Extract key topics and action items from conversations:</p>
        <CodePlayground
          initialCode={`import { ConversationSummarizer } from '@clarity-chat/react'

function RichSummaries({ messages }: { messages: Message[] }) {
  return (
    <ConversationSummarizer
      messages={messages}
      config={{
        trigger: 'manual',
        provider: { type: 'openai', model: 'gpt-4o' },
        includeActionItems: true,  // Extract action items
        includeKeyTopics: true,     // Extract key topics
        includeCodeSnippets: true,  // Extract code snippets
      }}
      onSummaryGenerated={(summary) => {
        if (summary.keyTopics) {
          logger.debug('Topics:', summary.keyTopics)
        }
        if (summary.actionItems) {
          logger.debug('Actions:', summary.actionItems)
        }
        if (summary.codeSnippets) {
          logger.debug('Code:', summary.codeSnippets)
        }
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Summarization</h2>
        <p>Provide custom summarization logic:</p>
        <CodePlayground
          initialCode={`import { ConversationSummarizer, type ConversationSummary, type SummaryLevel } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function CustomSummarizer({ messages }: { messages: Message[] }) {
  const customSummarize = async (
    messages: Message[],
    level: SummaryLevel
  ): Promise<ConversationSummary> => {
    // Your custom summarization logic
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, level }),
    })
    if (!response.ok) {
      throw new Error('Failed to generate summary')
    }
    return response.json()
  }

  return (
    <ConversationSummarizer
      messages={messages}
      onGenerateSummary={customSummarize}
      config={{
        trigger: 'manual',
        levels: ['brief', 'detailed', 'comprehensive'],
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Summary History</h2>
        <p>Show history of generated summaries:</p>
        <CodePlayground
          initialCode={`import { ConversationSummarizer } from '@clarity-chat/react'

function SummariesWithHistory({ messages }: { messages: Message[] }) {
  return (
    <ConversationSummarizer
      messages={messages}
      config={{
        trigger: 'interval',
        interval: 10,
        provider: { type: 'openai', model: 'gpt-4o' },
      }}
      showHistory={true}  // Show all generated summaries
      onSummaryGenerated={(summary) => {
        // Track summary history
        logger.debug('Summary generated at:', new Date(summary.timestamp))
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <PropsTable props={props} />
      </section>

      <section className="docs-section">
        <h2>Configuration Options</h2>
        <ul>
          <li>
            <strong>trigger</strong>:{' '}
            <code>'manual' | 'auto' | 'interval'</code> - When to generate
            summaries
          </li>
          <li>
            <strong>interval</strong>: <code>number</code> - Number of messages
            or milliseconds for interval trigger
          </li>
          <li>
            <strong>levels</strong>: <code>SummaryLevel[]</code> - Available
            summary levels
          </li>
          <li>
            <strong>provider</strong>:{' '}
            <code>{'{ type, model, apiKey?, endpoint? }'}</code> - LLM provider
            configuration
          </li>
          <li>
            <strong>includeActionItems</strong>: <code>boolean</code> - Extract
            action items
          </li>
          <li>
            <strong>includeKeyTopics</strong>: <code>boolean</code> - Extract
            key topics
          </li>
          <li>
            <strong>includeCodeSnippets</strong>: <code>boolean</code> - Extract
            code snippets
          </li>
          <li>
            <strong>maxLength</strong>:{' '}
            <code>{'{ brief, detailed, comprehensive }'}</code> - Maximum length
            per level
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Use <code>interval</code> trigger for long conversations to keep
            summaries up-to-date
          </li>
          <li>
            Enable <code>includeActionItems</code> for task-oriented
            conversations
          </li>
          <li>
            Use <code>brief</code> level for quick overviews,{' '}
            <code>comprehensive</code> for detailed analysis
          </li>
          <li>
            Configure appropriate <code>maxLength</code> values based on your
            use case
          </li>
          <li>Show history for conversations with multiple summary points</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/guides/memory">Memory Guide</a> - Conversation memory
            management
          </li>
          <li>
            <a href="/guides/analytics">Analytics Guide</a> - Tracking
            conversation metrics
          </li>
          <li>
            <a href="/cookbook/conversation-branching">
              Conversation Branching
            </a>{' '}
            - Branching patterns
          </li>
        </ul>
      </section>
    </div>
  )
}
