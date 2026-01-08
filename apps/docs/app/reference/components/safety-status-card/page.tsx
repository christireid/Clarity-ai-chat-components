import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Safety Status Card - Clarity Chat Components',
  description:
    'Display AI safety check results - content moderation, policy compliance, and safety guardrails.',
}

export default function SafetyStatusCardPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Safety Status Card</h1>
        <p className="docs-lead">
          Show safety check results for AI responses. Like a security checkpoint
          - did the AI say anything unsafe, inappropriate, or against your
          policies?
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Before showing AI responses to users, you might run safety checks
          (using OpenAI Moderation API, custom filters, etc.). This component
          displays those check results in a clear, actionable way.
        </p>

        <Callout type="info" title="Why Safety Checks Matter">
          AI can sometimes generate inappropriate content. Safety checks catch
          issues before users see them - protecting your users and your brand.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          code={`function BasicSafety() {
  const checks = [
    {
      id: '1',
      label: 'Content Moderation',
      status: 'pass',
      detail: 'No harmful content detected'
    },
    {
      id: '2',
      label: 'PII Detection',
      status: 'pass',
      detail: 'No personal information found'
    },
    {
      id: '3',
      label: 'Policy Compliance',
      status: 'pass',
      detail: 'Meets company guidelines'
    }
  ]

  return (
    <SafetyStatusCard
      checks={checks}
      lastReviewedAt={new Date()}
    />
  )
}

render(<BasicSafety />)`}
        />
      </section>

      <section className="docs-section">
        <h2>With Warnings and Failures</h2>
        <CodePlayground
          code={`function SafetyIssues() {
  const checks = [
    {
      id: '1',
      label: 'Hate Speech',
      status: 'pass',
      detail: 'Content is respectful'
    },
    {
      id: '2',
      label: 'Profanity Filter',
      status: 'warn',
      detail: 'Mild language detected',
      remediation: 'Consider rephrasing to be more professional'
    },
    {
      id: '3',
      label: 'Competitive Mentions',
      status: 'fail',
      detail: 'Mentioned competitor products',
      remediation: 'Block response - violates company policy'
    },
    {
      id: '4',
      label: 'Medical Advice',
      status: 'warn',
      detail: 'Contains health-related content',
      remediation: 'Add disclaimer: "Not medical advice"'
    }
  ]

  return (
    <SafetyStatusCard
      checks={checks}
      lastReviewedAt={new Date()}
      onAcknowledge={(check) => {
        logger.debug('Acknowledged:', check.label)
      }}
    />
  )
}

render(<SafetyIssues />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable title="SafetyStatusCard Props" data={safetyProps} />
      </section>

      <section className="docs-section">
        <h2>Integration Example</h2>
        <pre>
          <code>{`// Using OpenAI Moderation API
import { SafetyStatusCard } from '@clarity-chat/react/internal'
import OpenAI from 'openai'

const openai = new OpenAI()

async function checkSafety(text: string) {
  const moderation = await openai.moderations.create({
    input: text
  })

  const result = moderation.results[0]
  
  const checks = [
    {
      id: '1',
      label: 'Hate Speech',
      status: result.categories.hate ? 'fail' : 'pass',
      detail: result.categories.hate 
        ? \`Score: \${result.category_scores.hate.toFixed(3)}\`
        : 'Content is respectful'
    },
    {
      id: '2',
      label: 'Violence',
      status: result.categories.violence ? 'fail' : 'pass',
      detail: result.categories.violence
        ? 'Violent content detected'
        : 'No violent content'
    },
    // Add more checks...
  ]

  return checks
}

// In your chat component
const [safetyChecks, setSafetyChecks] = useState([])

useEffect(() => {
  if (aiResponse) {
    checkSafety(aiResponse).then(setSafetyChecks)
  }
}, [aiResponse])`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Run safety checks BEFORE displaying AI responses</li>
          <li>Block responses that fail critical checks</li>
          <li>Log all safety events for auditing</li>
          <li>Provide clear remediation steps</li>
          <li>Review warnings manually</li>
        </ul>

        <Callout type="warning" title="Not a Replacement for Backend Checks">
          This component shows results. Always run safety checks on your
          backend/server, not just in the frontend. Users can bypass frontend
          checks.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/reference/components/response-quality-meter"
            className="docs-card"
          >
            <h3>Response Quality Meter</h3>
            <p>Quality metrics</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const safetyProps = [
  {
    name: 'checks',
    type: 'SafetyCheck[]',
    required: true,
    description: 'Array of safety checks performed',
  },
  {
    name: 'lastReviewedAt',
    type: 'Date',
    required: false,
    description: 'When checks were last run',
  },
  {
    name: 'onReviewPolicy',
    type: '() => void',
    required: false,
    description: 'Callback to review safety policies',
  },
  {
    name: 'onAcknowledge',
    type: '(check: SafetyCheck) => void',
    required: false,
    description: 'Callback when user acknowledges a check',
  },
  {
    name: 'title',
    type: 'string',
    required: false,
    description: 'Section heading',
  },
  {
    name: 'subtitle',
    type: 'string',
    required: false,
    description: 'Description text',
  },
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Additional CSS classes',
  },
]
