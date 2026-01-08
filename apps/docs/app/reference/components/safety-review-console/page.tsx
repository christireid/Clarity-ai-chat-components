import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'SafetyReviewConsole - Clarity Chat Components',
  description:
    'Safety review console for reviewing and redacting sensitive content in AI responses.',
}

const props: Prop[] = [
  {
    name: 'content',
    type: 'string',
    required: true,
    description: 'Content to review',
  },
  {
    name: 'highlights',
    type: 'SafetyHighlight[]',
    required: true,
    description: 'Safety highlights to display',
  },
  {
    name: 'onRedact',
    type: '(highlight: SafetyHighlight) => void',
    description: 'Callback when highlight is redacted',
  },
  {
    name: 'onApprove',
    type: '() => void',
    description: 'Callback when content is approved',
  },
  {
    name: 'onReject',
    type: '() => void',
    description: 'Callback when content is rejected',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function SafetyReviewConsolePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>SafetyReviewConsole</h1>
        <p className="docs-lead">
          Safety review console for reviewing and redacting sensitive content in
          AI responses with highlighted safety issues.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Review AI responses for safety',
          'Identify sensitive content',
          'Redact flagged content',
          'Approve or reject responses',
          'Handle safety highlights',
        ]}
      />

      <Callout type="warning">
        <p>
          <strong>Safety Review:</strong> This component helps identify and
          redact sensitive content. Always review flagged content before
          approval.
        </p>
      </Callout>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Review content for safety issues:</p>
        <CodePlayground
          code={`import { SafetyReviewConsole } from '@clarity-chat/react/internal'

function SafetyReview({ content }: { content: string }) {
  const highlights = [
    {
      id: 'highlight-1',
      start: 10,
      end: 25,
      category: 'PII',
      severity: 'high' as const,
      suggestion: 'Redact email address',
    },
    {
      id: 'highlight-2',
      start: 50,
      end: 65,
      category: 'Sensitive Data',
      severity: 'medium' as const,
    },
  ]

  return (
    <SafetyReviewConsole
      content={content}
      highlights={highlights}
      onRedact={(highlight) => {
        logger.debug('Redacting:', highlight)
        // Redact content
      }}
      onApprove={() => {
        logger.debug('Content approved')
      }}
      onReject={() => {
        logger.debug('Content rejected')
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Severity Levels</h2>
        <p>Handle different severity levels:</p>
        <CodePlayground
          code={`import { SafetyReviewConsole } from '@clarity-chat/react/internal'

function WithSeverity({ content }: { content: string }) {
  const highlights = [
    {
      id: 'high',
      start: 0,
      end: 10,
      category: 'Critical Issue',
      severity: 'high' as const,  // Red background
    },
    {
      id: 'medium',
      start: 20,
      end: 30,
      category: 'Warning',
      severity: 'medium' as const,  // Yellow background
    },
    {
      id: 'low',
      start: 40,
      end: 50,
      category: 'Info',
      severity: 'low' as const,  // Blue background
    },
  ]

  return (
    <SafetyReviewConsole
      content={content}
      highlights={highlights}
      onRedact={(highlight) => {
        if (highlight.severity === 'high') {
          // Auto-redact high severity
          autoRedact(highlight)
        }
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Interactive Redaction</h2>
        <p>Allow users to redact highlighted content:</p>
        <CodePlayground
          code={`import { SafetyReviewConsole } from '@clarity-chat/react/internal'

function InteractiveReview({ content }: { content: string }) {
  const [redactedContent, setRedactedContent] = React.useState(content)

  return (
    <SafetyReviewConsole
      content={content}
      highlights={highlights}
      onRedact={(highlight) => {
        // Replace highlighted text with [REDACTED]
        const newContent = 
          content.slice(0, highlight.start) +
          '[REDACTED]' +
          content.slice(highlight.end)
        setRedactedContent(newContent)
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
        <h2>Safety Highlight Properties</h2>
        <ul>
          <li>
            <code>id</code>: Unique identifier
          </li>
          <li>
            <code>start</code>: Start character position
          </li>
          <li>
            <code>end</code>: End character position
          </li>
          <li>
            <code>category</code>: Safety category (PII, Sensitive Data, etc.)
          </li>
          <li>
            <code>severity</code>: Severity level ('low' | 'medium' | 'high')
          </li>
          <li>
            <code>suggestion</code>: Optional suggestion for handling
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Review all high-severity highlights</li>
          <li>Provide clear suggestions for redaction</li>
          <li>Allow manual review before auto-redaction</li>
          <li>Track redaction history for audit</li>
          <li>Show redacted content preview</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/message-actions-secure">
              MessageActionsSecure
            </a>{' '}
            - Secure message actions
          </li>
          <li>
            <a href="/reference/components/evaluation-dashboard">
              EvaluationDashboard
            </a>{' '}
            - Evaluation metrics
          </li>
        </ul>
      </section>
    </div>
  )
}
