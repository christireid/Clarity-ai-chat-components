import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Safety Review Guide - Clarity Chat Components',
  description:
    'Learn how to review AI-generated content for safety, including PII detection, prompt injection prevention, and content moderation.',
}

export default function SafetyReviewPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Safety Review</h1>
        <p className="docs-lead">
          Learn how to review AI-generated content for safety, including PII
          detection, prompt injection prevention, jailbreak detection, and
          content moderation.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Detect PII in content',
          'Prevent prompt injection',
          'Detect jailbreak attempts',
          'Review content safety',
          'Handle unsafe content',
        ]}
      />

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Safety review ensures AI-generated content is safe, secure, and
          compliant with your policies.
        </p>
      </section>

      <section className="docs-section">
        <h2>PII Detection</h2>
        <p>Detect personally identifiable information:</p>
        <CodePlayground
          initialCode={`import { SafetyReviewConsole } from '@clarity-chat/react/internal'

function PIIDetection({ content }: { content: string }) {
  const highlights = detectPII(content)

  return (
    <SafetyReviewConsole
      content={content}
      highlights={highlights}
      onRedact={(highlight) => {
        // Redact PII
        return redactContent(content, highlight)
      }}
    />
  )
}

// PII detection
function detectPII(content: string) {
  const patterns = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/g,
    phone: /\\+?[1-9]\\d{1,14}/g,
    ssn: /\\d{3}-\\d{2}-\\d{4}/g,
  }

  const highlights = []
  for (const [type, pattern] of Object.entries(patterns)) {
    const matches = content.matchAll(pattern)
    for (const match of matches) {
      highlights.push({
        type,
        start: match.index,
        end: match.index + match[0].length,
        severity: 'high',
      })
    }
  }

  return highlights
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Prompt Injection Prevention</h2>
        <p>Prevent prompt injection attacks:</p>
        <CodePlayground
          initialCode={`import { SafetyReviewConsole } from '@clarity-chat/react/internal'

function PromptInjectionDetection({ content }: { content: string }) {
  const highlights = detectPromptInjection(content)

  return (
    <SafetyReviewConsole
      content={content}
      highlights={highlights}
      onReject={() => {
        // Reject unsafe content
        logger.debug('Content rejected due to prompt injection')
      }}
    />
  )
}

function detectPromptInjection(content: string) {
  const injectionPatterns = [
    /ignore (previous|above|all) instructions/i,
    /system:.*prompt/i,
    /you are now/i,
    /forget.*instructions/i,
  ]

  const highlights = []
  for (const pattern of injectionPatterns) {
    const matches = content.matchAll(pattern)
    for (const match of matches) {
      highlights.push({
        type: 'prompt-injection',
        start: match.index,
        end: match.index + match[0].length,
        severity: 'critical',
      })
    }
  }

  return highlights
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Jailbreak Detection</h2>
        <p>Detect jailbreak attempts:</p>
        <CodePlayground
          initialCode={`function JailbreakDetection({ content }: { content: string }) {
  const highlights = detectJailbreak(content)

  return (
    <SafetyReviewConsole
      content={content}
      highlights={highlights}
      onReject={() => {
        logger.debug('Content rejected due to jailbreak attempt')
      }}
    />
  )
}

function detectJailbreak(content: string) {
  const jailbreakPatterns = [
    /roleplay|pretend|act as/i,
    /hypothetical|fictional|imaginary/i,
    /bypass|override|ignore/i,
    /developer mode|debug mode/i,
  ]

  const highlights = []
  for (const pattern of jailbreakPatterns) {
    const matches = content.matchAll(pattern)
    for (const match of matches) {
      highlights.push({
        type: 'jailbreak',
        start: match.index,
        end: match.index + match[0].length,
        severity: 'critical',
      })
    }
  }

  return highlights
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Content Moderation</h2>
        <p>Moderate content for safety:</p>
        <CodePlayground
          initialCode={`import { SafetyReviewConsole } from '@clarity-chat/react/internal'

function ContentModeration({ content }: { content: string }) {
  const highlights = moderateContent(content)

  return (
    <SafetyReviewConsole
      content={content}
      highlights={highlights}
      onApprove={() => {
        logger.debug('Content approved')
      }}
      onReject={() => {
        logger.debug('Content rejected')
      }}
      onRedact={(highlight) => {
        return redactContent(content, highlight)
      }}
    />
  )
}

async function moderateContent(content: string) {
  // Use moderation API
  const response = await fetch('/api/moderate', {
    method: 'POST',
    body: JSON.stringify({ content }),
  })

  const result = await response.json()
  return result.highlights
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Complete Safety Review</h2>
        <p>Complete safety review workflow:</p>
        <CodePlayground
          initialCode={`import { SafetyReviewConsole } from '@clarity-chat/react/internal'

function CompleteSafetyReview({ content }: { content: string }) {
  const [highlights, setHighlights] = useState([])

  useEffect(() => {
    // Run all safety checks
    const piiHighlights = detectPII(content)
    const injectionHighlights = detectPromptInjection(content)
    const jailbreakHighlights = detectJailbreak(content)
    const moderationHighlights = await moderateContent(content)

    setHighlights([
      ...piiHighlights,
      ...injectionHighlights,
      ...jailbreakHighlights,
      ...moderationHighlights,
    ])
  }, [content])

  return (
    <SafetyReviewConsole
      content={content}
      highlights={highlights}
      onApprove={() => {
        // Approve content
      }}
      onReject={() => {
        // Reject content
      }}
      onRedact={(highlight) => {
        // Redact unsafe content
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Detect and redact PII</li>
          <li>Prevent prompt injection attacks</li>
          <li>Detect jailbreak attempts</li>
          <li>Moderate content for safety</li>
          <li>Review content before display</li>
          <li>Log safety events for auditing</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/safety-review-console">
              SafetyReviewConsole
            </a>{' '}
            - Safety review component
          </li>
          <li>
            <a href="/reference/components/message-actions-secure">
              MessageActionsSecure
            </a>{' '}
            - Secure message actions
          </li>
        </ul>
      </section>
    </div>
  )
}
