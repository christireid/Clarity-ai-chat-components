import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Safety & Content Moderation - Clarity Chat',
  description: 'Clarity Chat includes comprehensive safety features for detecting PII, filtering content, and preventing prompt injection attacks.',
}

export default function SafetyGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Safety &amp; Content Moderation</h1>
        <p className="docs-lead">
          Clarity Chat includes comprehensive safety features for detecting PII, filtering content, and preventing prompt injection attacks.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Safety features help you:
        </p>
        <ul>
          <li>Detect and redact personally identifiable information (PII)</li>
          <li>Filter inappropriate or harmful content</li>
          <li>Prevent prompt injection attacks</li>
          <li>Comply with content policies</li>
          <li>Protect user privacy</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>PII Detection</h2>
        <p>
          Detect and redact personally identifiable information:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { PIIDetector } from '@clarity-chat/react'

const detector = new PIIDetector({
  enabled: true,
  redact: true, // Automatically redact detected PII
  types: ['email', 'phone', 'ssn', 'credit_card', 'ip_address'],
})

// Detect PII in text
const result = await detector.detect(userInput)

if (result.hasPII) {
  console.log('Detected PII:', result.entities)
  // Use result.redactedText for safe text
}`}
        />

        <h3>Supported PII Types</h3>
        <ul>
          <li>Email addresses</li>
          <li>Phone numbers</li>
          <li>Social Security Numbers</li>
          <li>Credit card numbers</li>
          <li>IP addresses</li>
          <li>Physical addresses</li>
          <li>Dates of birth</li>
          <li>Driver&apos;s license numbers</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Content Filtering</h2>
        <p>
          Filter inappropriate or harmful content:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { ContentFilter } from '@clarity-chat/react'

const filter = new ContentFilter({
  enabled: true,
  categories: ['hate', 'harassment', 'self-harm', 'violence'],
  severity: 'medium', // 'low', 'medium', 'high'
})

const result = await filter.check(userInput)

if (result.flagged) {
  console.log('Content flagged:', result.categories)
  // Handle flagged content
}`}
        />

        <h3>Content Categories</h3>
        <ul>
          <li><strong>Hate</strong>: Hate speech and discriminatory content</li>
          <li><strong>Harassment</strong>: Harassing or bullying content</li>
          <li><strong>Self-harm</strong>: Content promoting self-harm</li>
          <li><strong>Violence</strong>: Violent or threatening content</li>
          <li><strong>Sexual</strong>: Sexual content</li>
          <li><strong>Spam</strong>: Spam or promotional content</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Prompt Injection Prevention</h2>
        <p>
          Protect against prompt injection attacks:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { PromptInjectionDetector } from '@clarity-chat/react'

const detector = new PromptInjectionDetector({
  enabled: true,
  sensitivity: 'high',
})

const result = await detector.detect(userInput)

if (result.isInjection) {
  console.log('Prompt injection detected!')
  // Reject or sanitize input
}`}
        />

        <h3>Injection Patterns Detected</h3>
        <ul>
          <li>System prompt leaks</li>
          <li>Instruction overrides</li>
          <li>Context manipulation</li>
          <li>Jailbreak attempts</li>
          <li>Role-playing attacks</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ol>
          <li><strong>Enable by Default</strong>: Enable safety features in production</li>
          <li><strong>User Feedback</strong>: Show users when content is filtered</li>
          <li><strong>False Positives</strong>: Allow manual review for edge cases</li>
          <li><strong>Privacy</strong>: Don&apos;t log sensitive PII</li>
          <li><strong>Performance</strong>: Cache safety check results when possible</li>
          <li><strong>Compliance</strong>: Ensure compliance with regulations (GDPR, etc.)</li>
          <li><strong>Transparency</strong>: Be transparent about safety measures</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/reference/safety">Safety API Reference</a> - Complete safety API</li>
          <li><a href="/reference/components/safety-status-card">Safety Status Card</a> - Display safety checks</li>
        </ul>
      </section>
    </div>
  )
}
