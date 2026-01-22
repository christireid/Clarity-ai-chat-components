import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'MessageActionsSecure - Clarity Chat Components',
  description:
    'Secure message actions with security validation, PII detection, threat indicators, and reporting capabilities.',
}

const props: Prop[] = [
  {
    name: 'messageContent',
    type: 'string',
    required: true,
    description: 'Message content',
  },
  {
    name: 'messageId',
    type: 'string',
    required: true,
    description: 'Message ID',
  },
  {
    name: 'role',
    type: '"user" | "assistant" | "system"',
    required: true,
    description: 'Message role',
  },
  {
    name: 'feedbackGiven',
    type: '"up" | "down" | null',
    required: true,
    description: 'Current feedback state',
  },
  {
    name: 'showConfetti',
    type: 'boolean',
    required: true,
    description: 'Show confetti animation',
  },
  {
    name: 'hasError',
    type: 'boolean',
    required: true,
    description: 'Whether message has error',
  },
  {
    name: 'onFeedback',
    type: '(type: "up" | "down") => void',
    required: true,
    description: 'Callback when feedback given',
  },
  {
    name: 'onRetry',
    type: '() => void',
    description: 'Callback when retry clicked',
  },
  {
    name: 'onEdit',
    type: '(messageId: string) => void',
    description: 'Callback when edit clicked',
  },
  {
    name: 'onRegenerate',
    type: '(messageId: string) => void',
    description: 'Callback when regenerate clicked',
  },
  {
    name: 'onDelete',
    type: '(messageId: string) => void',
    description: 'Callback when delete clicked',
  },
  {
    name: 'show',
    type: 'boolean',
    required: true,
    description: 'Whether to show actions',
  },
  {
    name: 'securityInfo',
    type: 'SecurityInfo',
    description: 'Security validation information',
  },
  {
    name: 'onReport',
    type: '(reason: string) => void',
    description: 'Callback when message reported',
  },
  {
    name: 'showSecurityIndicators',
    type: 'boolean',
    description: 'Show security indicators (default: true)',
  },
]

export default function MessageActionsSecurePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>MessageActionsSecure</h1>
        <p className="docs-lead">
          Secure message actions with security validation, PII detection
          indicators, threat warnings, and reporting capabilities.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Display security validation status',
          'Show PII detection indicators',
          'Report unsafe content',
          'View security details',
          'Handle security warnings',
        ]}
      />

      <Callout type="warning">
        <p>
          <strong>Security Features:</strong> This component provides security
          indicators and reporting capabilities. Always validate security
          information server-side.
        </p>
      </Callout>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Use secure message actions with security info:</p>
        <CodePlayground
          initialCode={`import { MessageActionsSecure } from '@clarity-chat/react'

function SecureMessageActions({ message }: { message: Message }) {
  return (
    <MessageActionsSecure
      messageContent={message.content}
      messageId={message.id}
      role={message.role}
      feedbackGiven={null}
      showConfetti={false}
      hasError={false}
      onFeedback={(type) => {
        console.log('Feedback:', type)
      }}
      show={true}
      securityInfo={{
        validated: true,
        piiDetected: false,
        threats: [],
        sanitized: false,
      }}
      onReport={(reason) => {
        console.log('Reported:', reason)
        // Send report to server
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>PII Detection</h2>
        <p>Display PII detection indicators:</p>
        <CodePlayground
          initialCode={`import { MessageActionsSecure } from '@clarity-chat/react'

function WithPIIDetection({ message }: { message: Message }) {
  return (
    <MessageActionsSecure
      messageContent={message.content}
      messageId={message.id}
      role={message.role}
      feedbackGiven={null}
      showConfetti={false}
      hasError={false}
      onFeedback={() => {}}
      show={true}
      securityInfo={{
        validated: true,
        piiDetected: true,
        piiCount: 3,
        threats: [],
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Security Warnings</h2>
        <p>Handle security warnings and threats:</p>
        <CodePlayground
          initialCode={`import { MessageActionsSecure } from '@clarity-chat/react'

function WithWarnings({ message }: { message: Message }) {
  return (
    <MessageActionsSecure
      messageContent={message.content}
      messageId={message.id}
      role={message.role}
      feedbackGiven={null}
      showConfetti={false}
      hasError={false}
      onFeedback={() => {}}
      show={true}
      securityInfo={{
        validated: false,
        threats: ['prompt-injection', 'jailbreak'],
        confidence: 0.85,
      }}
      onReport={(reason) => {
        // Report unsafe content
        reportUnsafeContent(message.id, reason)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Security Details Tooltip</h2>
        <p>The component automatically shows security details on hover:</p>
        <CodePlayground
          initialCode={`import { MessageActionsSecure } from '@clarity-chat/react'

function WithDetails({ message }: { message: Message }) {
  return (
    <MessageActionsSecure
      messageContent={message.content}
      messageId={message.id}
      role={message.role}
      feedbackGiven={null}
      showConfetti={false}
      hasError={false}
      onFeedback={() => {}}
      show={true}
      securityInfo={{
        validated: true,
        piiDetected: false,
        confidence: 0.95,
        method: 'ml-classifier',
      }}
      showSecurityIndicators={true}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Reporting Unsafe Content</h2>
        <p>Enable reporting for unsafe content:</p>
        <CodePlayground
          initialCode={`import { MessageActionsSecure } from '@clarity-chat/react'

function WithReporting({ message }: { message: Message }) {
  return (
    <MessageActionsSecure
      messageContent={message.content}
      messageId={message.id}
      role={message.role}
      feedbackGiven={null}
      showConfetti={false}
      hasError={false}
      onFeedback={() => {}}
      show={true}
      onReport={(reason) => {
        // Report to moderation service
        fetch('/api/moderation/report', {
          method: 'POST',
          body: JSON.stringify({
            messageId: message.id,
            reason,
          }),
        })
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
        <h2>Security Info Properties</h2>
        <ul>
          <li>
            <code>validated</code>: Whether message passed security validation
          </li>
          <li>
            <code>piiDetected</code>: Whether PII was detected
          </li>
          <li>
            <code>piiCount</code>: Number of PII entities found
          </li>
          <li>
            <code>threats</code>: Array of detected security threats
          </li>
          <li>
            <code>sanitized</code>: Whether message was sanitized/modified
          </li>
          <li>
            <code>confidence</code>: Confidence score of validation (0-1)
          </li>
          <li>
            <code>method</code>: Security check method used
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Security Indicators</h2>
        <ul>
          <li>
            <strong>Green Shield</strong>: Message validated, no threats
          </li>
          <li>
            <strong>Orange Warning</strong>: Security warnings detected
          </li>
          <li>
            <strong>PII Badge</strong>: PII detected and redacted
          </li>
          <li>
            <strong>Report Button</strong>: Available for reporting unsafe
            content
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Always validate security information server-side</li>
          <li>Show security indicators for transparency</li>
          <li>Enable reporting for user safety</li>
          <li>Handle PII detection appropriately</li>
          <li>Display security details in tooltips</li>
          <li>Use confidence scores to determine indicator colors</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/hooks/use-security">useSecurity</a> - Security
            validation hook
          </li>
          <li>
            <a href="/reference/components/chat-window">ChatWindow</a> - Main
            chat interface
          </li>
        </ul>
      </section>
    </div>
  )
}
